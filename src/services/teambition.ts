'use strict'
import * as chalk from 'chalk'
import * as mime from 'mime'
import * as IParsedInfo from '../interfaces/IParsedInfo'
import * as fs from 'fs'
import * as request from 'request'

const db = require('limbo').use('teambition')
const _ = require('lodash')
const config = require('config')
const StrikerUtil = require('striker-util')

const success = chalk.bold.green
const error = chalk.bold.red
let strikerUtil = new StrikerUtil(config.striker2)

export async function create (user, parsedProjectArray: Array<IParsedInfo.IParsedProjectInfo>) {
  await Promise.all(parsedProjectArray.map(async function (parsedProject) {
    let createdProjectInfo = await _createProject(user, parsedProject.projectInfo)

    await Promise.all([
      _createTasks(user, createdProjectInfo, parsedProject.tasksInfo),
      _createPosts(user, createdProjectInfo, parsedProject.postsInfo),
      _createEvents(user, createdProjectInfo, parsedProject.eventsInfo),
      _createCollections(user, createdProjectInfo, parsedProject.collectionsInfo)
    ])
  }))
}

async function _createProject (user, projectInfo: IParsedInfo.IProjectInfo) {
  let project = await db.project.create({
    _creatorId: user._id,
    name: projectInfo.name,
    created: new Date(),
    logo: 'https://mailimg.teambition.com/logos/cover-other.jpg',
    category: 'other'
  })
  console.log(success(`[t2t] Created project: ${project.name}`))

  let member = await db.member.create({
    boundToObjectType: 'project',
    _boundToObjectId: project._id,
    _userId: user._id,
    role: 2,
    joined: new Date()
  })

  console.log(success(`[t2t] Created member: ${member._id}`))

  let tasklist = await db.tasklist.create({
    title: '默认分组',
    _projectId: project._id,
    _creatorId: user._id,
    created: new Date(),
    stageIds: []
  })

  console.log(success(`[t2t] Created tasklist: ${tasklist.title}`))
  let stages = await Promise.all([
    db.stage.create({
      _tasklistId: tasklist._id,
      _projectId: project._id,
      name: '未完成',
      created: new Date()
    }),
    db.stage.create({
      _tasklistId: tasklist._id,
      _projectId: project._id,
      name: '进行中',
      created: new Date()
    }),
    db.stage.create({
      _tasklistId: tasklist._id,
      _projectId: project._id,
      name: '已完成',
      created: new Date()
    })
  ])

  await db.tasklist.findByIdAndUpdate(tasklist._id, {
    stageIds: _.pluck(stages, '_id')
  })

  let rootFolder = await db.collection.create({
    title: 'root',
    collectionType: 'root',
    _creatorId: user._id,
    _projectId: project._id,
    color: 'blue',
    created: new Date()
  })
  await db.collection.create({
    title: 'default',
    collectionType: 'default',
    _creatorId: user._id,
    _projectId: project._id,
    _parentId: rootFolder._id,
    color: 'blue',
    created: new Date()
  })

  console.log(success(`[t2t] Created default & root collections for project: ${project.name}`))
  return {
    project: project,
    tasklist: tasklist,
    stages: stages,
    rootFolder: rootFolder
  }
}

async function _createTasks (user, createdProjectInfo, tasksInfo: Array<IParsedInfo.ITasksInfo>) {
  await Promise.all(tasksInfo.map(async function (taskInfo) {
    let task = await db.task.create({
      _creatorId: user._id,
      _tasklistId: createdProjectInfo.tasklist._id,
      _projectId: createdProjectInfo.project._id,
      _stageId: createdProjectInfo.stages[0]._id,
      tagIds: [],
      _executorId: null,
      visiable: 'members',
      created: new Date(),
      content: taskInfo.content,
      note: taskInfo.note,
      isArchived: null,
      priority: 0,
      attachments: [],
      involveMembers: [user._id]
    })

    await db.activity.create({
      action: 'create',
      _creatorId: user._id,
      boundToObjects: [{
        _objectId: task._id,
        objectType: 'task'
      }],
      created: new Date()
    })

    console.log(success(`[t2t] Created task: ${task.content}`))

    await taskInfo.subtasks.map(async function (subtaskInfo) {
      let subtask = await db.subtask.create({
        _taskId: task._id,
        _creatorId: user._id,
        _projectId: createdProjectInfo.project._id,
        created: new Date(),
        content: subtaskInfo.content
      })

      console.log(success(`[t2t] Created subtask: ${subtask.content}`))
    })

    if (taskInfo.comment.trim() !== '') {
      let comment = await db.activity.create({
        action: 'comment',
        _creatorId: user._id,
        rootId: `project#${createdProjectInfo.project._id}`,
        content: {voice: {}, comment: taskInfo.comment, attachments: []},
        boundToObjects: [{
          _objectId: task._id,
          objectType: 'task'
        }],
        created: new Date()
      })
      console.log(success(`[t2t] Created comment: ${comment._id}`))
    }
  })).catch(console.error)
}

async function _createPosts (user, createdProjectInfo, postsInfo: Array<IParsedInfo.IPostsInfo>) {
  await Promise.all(postsInfo.map(async function (postInfo) {
    let post = await db.post.create({
      _projectId: createdProjectInfo.project._id,
      _creatorId: user._id,
      type: 'text',
      content: postInfo.content,
      title: postInfo.title,
      involveMembers: [user._id]
    })

    await db.activity.create({
      action: 'create',
      _creatorId: user._id,
      boundToObjects: [{
        _objectId: post._id,
        objectType: 'post'
      }]
    })

    console.log(`[t2t] Created post: ${post.title}`)
  }))
}

async function _createEvents (user, createdProjectInfo, eventsInfo: Array<IParsedInfo.IEventsInfo>) {
  await Promise.all(eventsInfo.map(async function (eventInfo) {
    let event = await db.event.create({
      _projectId: createdProjectInfo.project._id,
      startDate: eventInfo.startDate,
      endDate: eventInfo.startDate,
      _creatorId: user._id,
      created: new Date(),
      title: eventInfo.title,
      visiable : 'members',
      recurrence: null,
      location: '',
      involveMembers: [user._id]
    })

    await db.activity.create({
      action: 'create',
      _creatorId: user._id,
      boundToObjects: [{
        _objectId: event._id,
        objectType: 'event'
      }]
    })

    console.log(success(`[t2t] Created event: ${event.title}`))
  }))
}

async function _createCollections (user, createdProjectInfo, collectionsInfo: Array<IParsedInfo.ICollectionsInfo>) {
  await Promise.all(collectionsInfo.map(async function (collectionInfo) {
    let collection = await db.collection.create({
      title: collectionInfo.title,
      _creatorId: user._id,
      _projectId: createdProjectInfo.project._id,
      _parentId: createdProjectInfo.rootFolder._id,
      color: 'blue',
      created: new Date()
    })

    console.log(success(`[t2t] Created collection: ${collection.title}`))

    let authorization = strikerUtil.signAuth({userId: user._id})
    for (let workInfo of collectionInfo.works) {
      let fileInfo
      try {
        fileInfo = await _uploadFile(workInfo, authorization)
      } catch (err) {
        console.error(error(`[t2t] File: ${workInfo.path} failed to upload to striker2, error: ${err}`))
        continue
      }

      let work = await db.work.create(Object.assign(fileInfo, {
        _projectId: createdProjectInfo.project._id,
        _parentId: collection._id,
        _creatorId: user._id
      }))

      await db.activity.create({
        action: 'create',
        _creatorId: user._id,
        boundToObjects: [{
          _objectId: work._id,
          objectType: 'work'
        }]
      })
      console.log(success(`[t2t] Created work: ${work.fileName}`))
    }
  }))
}

function _uploadFile (workInfo: IParsedInfo.IWorksInfo, authorization: string): Promise<any> {
  return new Promise((resolve, reject) => {
    fs.createReadStream(workInfo.path).pipe(
      request.post(`${config.striker2.host}/upload`, {
        headers: {
          authorization: authorization,
          'content-type': mime.lookup(workInfo.path),
          'content-length': fs.statSync(workInfo.path).size,
          'X-File-Name': workInfo.fileName
        },
        timeout: 1000 * 60 * 60,
        json: true
      }, (err, res, fileInfo) => {
        if (err) return reject(err)
        if (!res) return reject('Missing res')
        if (res.statusCode !== 200) return reject(res.statusMessage)
        resolve(fileInfo)
      })
    )
  })
}
