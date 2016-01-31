'use strict'
const db = require('limbo').use('teambition')

export async function getUserByEmail (email: string) {
  let user = await db.user.findOne({
    email: email
  }).exec()
  return user
}
