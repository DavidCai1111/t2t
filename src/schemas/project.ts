'use strict'
const xss = require('xss')

module.exports = function (Schema) {
  return new Schema({
    name: {
      type: String,
      get: function (val) {
        if (val != null) {
          return xss(val)
        } else {
          return val
        }
      }
    },
    description: {
      type: String,
      get: function (val) {
        if (val != null) {
          return xss(val)
        } else {
          return val
        }
      }
    },
    logo: String,
    cover: String,
    py: String,
    pinyin: String,
    category: String,
    isArchived: {
      type: Boolean,
      'default': false
    },
    isDeleted: {
      type: Boolean,
      'default': false
    },
    created: {
      type: Date,
      'default': Date.now,
      get: function (val) {
        if (!val) {
          val = this._id.getTimestamp()
        }
        return val
      }
    },
    updated: {
      type: Date,
      'default': Date.now
    },
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    },
    isPublic: {
      type: Boolean,
      'default': false
    },
    navigation: {
      type: String,
      'default': ''
    },
    _parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    forksCount: {
      type: Number,
      'default': 0
    },
    syncCountsAt: Date,
    postsCount: {
      type: Number,
      'default': 0
    },
    worksCount: {
      type: Number,
      'default': 0
    },
    eventsCount: {
      type: Number,
      'default': 0
    },
    tasksCount: {
      type: Number,
      'default': 0
    },
    tagsCount: {
      type: Number,
      'default': 0
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
