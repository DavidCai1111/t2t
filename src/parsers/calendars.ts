'use strict'
import {basename, join} from 'path'
import * as fs from 'fs'
import * as chalk from 'chalk'
import * as IParsedInfo from '../interfaces/IParsedInfo'
import * as moment from 'moment'
import * as cheerio from 'cheerio'

const warn = chalk.bold.gray
const info = chalk.black

function parseCalendarsFolder (calendarsFolderPath: string): Array<IParsedInfo.IParsedProjectInfo> {
  try {
    fs.statSync(calendarsFolderPath)
  } catch (e) {
    console.log(warn(`[t2t] Empty calendars folder path: ${calendarsFolderPath}`))
    return []
  }

  const _projects = fs.readdirSync(calendarsFolderPath).filter((calendarFolderPath, index, array) => {
    return fs.statSync(join(calendarsFolderPath, calendarFolderPath)).isDirectory() && !~calendarFolderPath.indexOf('attachments')
  })
  .map((folderName) => join(calendarsFolderPath, folderName))

  console.log(info(`[t2t] Calendars paths: ${_projects}`))
  let parsedResult = _projects.map((project: string) => _parseProject(project))
  return parsedResult
}

function _parseProject (calendarFolderPath: string): IParsedInfo.IParsedProjectInfo {
  console.log(info(`[t2t] Parsing ${calendarFolderPath}...`))
  let projectInfo: IParsedInfo.IProjectInfo = {
    name: basename(calendarFolderPath).split('_')[1]
  }
  console.log(info(`[t2t] Project's name: ${projectInfo.name}`))

  return {
    projectInfo: projectInfo,
    tasksInfo: [],
    eventsInfo: _parseEvents(calendarFolderPath),
    postsInfo: [],
    collectionsInfo: []
  }
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

export default parseCalendarsFolder
