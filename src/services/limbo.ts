'use strict'
import * as fs from 'fs'
const limbo = require('limbo')
const config = require('config')
const mongoose = require('mongoose')

let teambitionOptions: any = {}
if (config.tb_mongo.auth_db) {
  teambitionOptions.auth = {
    authdb: config.tb_mongo.auth_db
  }
}

if (config.tb_mongo.use_cert && config.tb_mongo.ca_path && config.tb_mongo.client_crt_path && config.tb_mongo.client_key_path) {
  let caFileBuf = fs.readFileSync(config.tb_mongo.ca_path)
  let certFileBuf = fs.readFileSync(config.tb_mongo.client_crt_path)
  let keyFileBuf = fs.readFileSync(config.tb_mongo.client_key_path)

  teambitionOptions.replset = {
    sslCA: caFileBuf,
    sslCert: certFileBuf,
    sslKey: keyFileBuf
  }
}

let teambitionConn = mongoose.createConnection(config.tb_mongo.url, teambitionOptions)

let teambition = limbo.use('teambition', {
  provider: 'mongo',
  conn: teambitionConn
})

teambition.loadSchemas(require('../schemas')(mongoose.Schema, {
  db: teambitionConn
}))

export default limbo
