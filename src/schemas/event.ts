'use strict'
module.exports = function (Schema, options) {
  const xss = require('xss')

  var ReminderSchema
  ReminderSchema = new Schema({
    minutes: {
      type: Number,
      required: true
    },
    format: String,
    method: {
      type: String,
      required: true
    }
  }, {
    _id: false
  })
  return new Schema({
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String,
      'default': '',
      get: function (val) {
        if (val != null) {
          return xss(val)
        } else {
          return val
        }
      }
    },
    content: {
      type: String,
      'default': '',
      get: function (val) {
        if (val != null) {
          return xss(val)
        } else {
          return val
        }
      }
    },
    location: {
      type: String,
      'default': '',
      get: function (val) {
        if (val != null) {
          return xss(val)
        } else {
          return val
        }
      }
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    remindDate: {
      type: Date
    },
    untilDate: {
      type: Date
    },
    status: {
      type: String,
      'default': 'confirmed'
    },
    involveMembers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    source: String,
    _sourceId: String,
    sourceCalendarId: String,
    sourceEvent: Object,
    sourceDate: Date,
    recurrence: {
      es_indexed: true,
      es_type: 'string',
      type: Schema.Types.Mixed
    },
    reminders: [ReminderSchema],
    isArchived: {
      type: String,
      'default': null
    },
    visiable: {
      type: String,
      'default': 'all'
    },
    isDeleted: {
      type: Boolean,
      'default': false
    },
    created: {
      type: Date,
      'default': Date.now
    },
    updated: {
      type: Date,
      'default': Date.now
    }
  }, {
    read: 'secondaryPreferred',
    toObject: {
      virtuals: true,
      getters: true
    },
    toJSON: {
      virtuals: true,
      getters: true
    }
  })
}
