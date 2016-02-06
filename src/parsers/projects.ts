'use strict'
import * as fs from 'fs'
import {basename, join} from 'path'
import * as chalk from 'chalk'
import * as moment from 'moment'
import * as cheerio from 'cheerio'
import * as IParsedInfo from '../interfaces/IParsedInfo'

const warn = chalk.bold.gray
const info = chalk.black

function parseProjectFolder (projectsFolderPath: string): Array<IParsedInfo.IParsedProjectInfo> {
  try {
    fs.statSync(projectsFolderPath)
  } catch (e) {
    console.log(warn(`[t2t] Empty projects folder path: ${projectsFolderPath}`))
    return []
  }

  const _projects = fs.readdirSync(projectsFolderPath).filter((projectFolderPath, index, array) => {
    return fs.statSync(join(projectsFolderPath, projectFolderPath)).isDirectory()
  })
  .map((folderName) => join(projectsFolderPath, folderName))
  console.log(info(`[t2t] Project paths: ${_projects}`))

  let parsedResult = _projects.map((project: string) => _parseProject(project))
  return parsedResult
}

function _parseProject (projectFolderPath: string): IParsedInfo.IParsedProjectInfo {
  console.log(info(`[t2t] Parsing ${projectFolderPath}...`))
  let projectInfo: IParsedInfo.IProjectInfo = {
    name: basename(projectFolderPath).split('-')[1]
  }
  console.log(info(`[t2t] Project's name: ${projectInfo.name}`))
  return {
    projectInfo: projectInfo,
    tasksInfo: _parseTasks(join(projectFolderPath, './todolists')).concat(_parseTalks(join(projectFolderPath, './messages'))),
    eventsInfo: _parseEvents(join(projectFolderPath, './calendar_events')),
    postsInfo: _parsePosts(join(projectFolderPath, './documents')),
    collectionsInfo: _parseCollections(join(projectFolderPath, './attachments'))
  }
}

function _parseTasks (taskFolderPath: string): Array<IParsedInfo.ITasksInfo> {
  return fs.readdirSync(taskFolderPath).map((taskHtmlPath) => {
    let taskHtml = fs.readFileSync(join(taskFolderPath, taskHtmlPath)).toString('utf8')
    let $ = cheerio.load(taskHtml)
    let task: IParsedInfo.ITasksInfo = {
      content: $('.todolists .header h2').text().trim(),
      subtasks: [],
      comment: '',
      note: ''
    }
    let comment = ''
    let subtasksInfo: Array<IParsedInfo.ISubtasksInfo> = []
    $('.todos li').each(function (i, elem) {
      subtasksInfo[i] = {
        content: $(this).text().trim()
      }
      let commentPath = cheerio('a.content', $(this).html()).attr('href')

      if (commentPath && commentPath.trim() !== '') {
        let commentHtml = fs.readFileSync(join(taskFolderPath, commentPath)).toString('utf8')
        let commentSelector = cheerio.load(commentHtml)
        commentSelector('.comment').each(function (i, elem) {
          comment += `${cheerio('p b', $(this).html()).text().trim()} ${cheerio('.time', $(this).html()).text().trim()}\n${cheerio('.editor-style', $(this).html()).text().trim()}\n\n`
        })
      }
    })

    task.subtasks = subtasksInfo
    task.comment = comment
    return task
  })
  .filter((taskInfo) => {
    let isVaildTask = taskInfo.content.trim() !== ''
    if (isVaildTask) console.log(info(`[t2t] Parsed task: ${taskInfo.content}`))
    return isVaildTask
  })
}

function _parseTalks (talksFolderPath: string): Array<IParsedInfo.ITasksInfo> {
  return fs.readdirSync(talksFolderPath).map((talkHtmlPath) => {
    let taskHtml = fs.readFileSync(join(talksFolderPath, talkHtmlPath)).toString('utf8')
    let $ = cheerio.load(taskHtml)
    let task = {
      content: $('.message .header').text().trim(),
      subtasks: [],
      comment: '',
      note: $('.message .content p').text().trim()
    }

    let comment = ''
    $('.comment').each(function (i, elem) {
      comment += `${cheerio('p b', $(this).html()).text().trim()} ${cheerio('.time', $(this).html()).text().trim()}\n${cheerio('.editor-style', $(this).html()).text().trim()}\n\n`
    })

    task.comment = comment
    return task
  })
}

function _parseEvents (eventFolderPath: string): Array<IParsedInfo.IEventsInfo> {
  let indexHtml = fs.readFileSync(join(eventFolderPath, './index.html')).toString('utf8')
  let $ = cheerio.load(indexHtml)
  let events: Array<IParsedInfo.IEventsInfo> = []
  $('.day').each(function (i, elem) {
    let startDate = moment(cheerio('p b', $(this).html())).toDate()
    cheerio('li', $(this).html()).each(function (j, elem) {
      let event = {
        title: cheerio('p', $(this).html()).text().trim(),
        startDate: startDate,
        comment: ''
      }
      let commentPath = cheerio('.comments_count', $(this).html()).attr('href')
      if (commentPath && commentPath.trim() !== '') {
        let comment = ''
        let commentHtml = fs.readFileSync(join(eventFolderPath, commentPath)).toString('utf8')
        let commentSelector = cheerio.load(commentHtml)
        commentSelector('comment').each(function (i, elem) {
          comment += `${cheerio('p b', $(this).html()).text().trim()} ${cheerio('.time', $(this).html()).text().trim()}\n${cheerio('.editor-style', $(this).html()).text().trim()}\n\n`
        })
        event.comment = comment
      }
      events.push(event)
    })
  })

  events = events.filter((eventInfo) => {
    let isVaildEvent = eventInfo.title.trim() !== ''
    if (isVaildEvent) console.log(info(`[t2t] Parsed event: ${eventInfo.title} startDate: ${eventInfo.startDate}`))
    return isVaildEvent
  })
  return events
}

function _parsePosts (postFolderPath: string): Array<IParsedInfo.IPostsInfo> {
  return fs.readdirSync(postFolderPath).map((postHtmlPath) => {
    let postHtml = fs.readFileSync(join(postFolderPath, postHtmlPath)).toString('utf8')
    let $ = cheerio.load(postHtml)
    let title = $('.document .header h2').text().trim()
    return {
      content: $('.editor-style').html(),
      title: title
    }
  })
  .filter((postInfo) => {
    let isVaildPost = postInfo.title && postInfo.title.trim() !== ''
    if (isVaildPost) console.log(info(`[t2t] Parsed post: ${postInfo.title}`))
    return isVaildPost
  })
}

function _parseCollections (collectionFolderPath: string): Array<IParsedInfo.ICollectionsInfo> {
  let indexHtmlPath = join(collectionFolderPath, './index.html')
  let indexHtml = fs.readFileSync(indexHtmlPath).toString('utf8')
  let $ = cheerio.load(indexHtml)
  let collections: Array<IParsedInfo.ICollectionsInfo> = []

  $('.day').each(function (i , elem) {
    collections[i] = {
      title: cheerio('p b', $(this).html()).text().trim(),
      works: []
    }
    cheerio('.attachments li', $(this).html()).each(function (j, elem) {
      let filePath = cheerio('img', $(this).html()).attr('src')
      collections[i].works[j] = {
        fileName: cheerio('.image-name', $(this).html()).text().trim(),
        path: join(collectionFolderPath, filePath)
      }
    })
    collections[i].works.filter((workInfo) => {
      let isVaildWork = workInfo.fileName !== ''
      if (isVaildWork) console.log(info(`[t2t] Parsed work: ${workInfo.fileName} at ${workInfo.path}`))
      return isVaildWork
    })
  })

  collections.filter((collectionInfo) => {
    let isVaildCollection = collectionInfo.title.trim() !== ''
    if (isVaildCollection) console.log(info(`[t2t] Parsed collection: ${collectionInfo.title}`))
    return isVaildCollection
  })
  return collections
}

export default parseProjectFolder
