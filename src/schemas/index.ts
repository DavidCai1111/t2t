'use strict'
module.exports = function (Schema, options) {
  return {
    Organization: require('./organization')(Schema),
    User: require('./user')(Schema),
    Project: require('./project')(Schema),
    Member: require('./member')(Schema),
    Idmap: require('./idmap')(Schema),
    Alien: require('./alien')(Schema),
    Hook: require('./hook')(Schema),
    Source: require('./source')(Schema),
    Tasklist: require('./tasklist')(Schema),
    Stage: require('./stage')(Schema),
    Collection: require('./collection')(Schema),
    Task: require('./task')(Schema),
    Subtask: require('./subtask')(Schema),
    Activity: require('./activity')(Schema),
    Event: require('./event')(Schema),
    Post: require('./post')(Schema),
    Work: require('./work')(Schema)
  }
}
