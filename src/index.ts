'use strict'
require('./services/limbo')
import {join} from 'path'
import * as fs from 'fs'
import * as chalk from 'chalk'
import parseProjectFolder from './parsers/projects'
import parseCalendarsFolder from './parsers/calendars'
import * as userService from './services/user'
import {create as createEntities} from './services/teambition'

const error = chalk.bold.red
const success = chalk.bold.green
let userEmail = process.argv[2]
let folderPath = process.argv[3]

const start = Date.now()

process.on('unhandledRejection', (reason) => {
  console.error(error(`[t2t] unhandledRejection: ${reason}`))
  process.exit(1)
})

main().catch(console.error)

async function main () {
  if (!userEmail) {
    console.error(error(('[t2t] Email is required!')))
    process.exit(1)
  }

  let user = await userService.getUserByEmail(userEmail)
  if (!user) {
    console.error(error((`[t2t] Invaild email: ${userEmail}`)))
    process.exit(1)
  }

  console.log(success(`[t2t] User name: ${user.name}`))

  if (!folderPath) {
    console.error(error(('[t2t] Path of tower exported files folder is required!')))
    process.exit(1)
  }

  folderPath = join(process.cwd(), process.argv[3])
  try {
    fs.statSync(folderPath)
  } catch (e) {
    console.error(error((`[t2t] Invaild folder path: ${folderPath}`)))
    process.exit(1)
  }

  await createEntities(user, parseProjectFolder(join(folderPath, './projects')).concat(parseCalendarsFolder(join(folderPath, './calendars'))))

  console.log(success(`[t2t] done! Cost ${Date.now() - start} ms.`))
  process.exit(0)
}
