'use strict'
import * as moment from 'moment'
const config = require('config')
const xss = require('xss')

module.exports = function (Schema) {
  return new Schema({
    openId: String,
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      get: function (val) {
        if (val != null) {
          return xss(val);
        } else {
          return val;
        }
      }
    },
    logo: String,
    cover: String,
    location: String,
    category: String,
    description: {
      type: String,
      get: function (val) {
        if (val != null) {
          return xss(val);
        } else {
          return val;
        }
      }
    },
    website: {
      type: String,
      get: function (val) {
        if (val != null) {
          return xss(val);
        } else {
          return val;
        }
      }
    },
    background: {
      type: String,
      get: function (val) {
        if (val != null) {
          return xss(val);
        } else {
          return val;
        }
      }
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
    },
    prefs: {
      type: Schema.Types.Mixed,
      get: function (val) {
        if (val) {
          return val;
        } else {
          return {};
        }
      },
      set: function (val) {
        if (val) {
          return val;
        } else {
          return {};
        }
      }
    },
    py: String,
    pinyin: String,
    projectIds: Array,
    dividers: {
      type: String,
      get: function (val) {
        if (val) {
          return JSON.parse(val);
        } else {
          return [];
        }
      },
      set: function (val) {
        if (val) {
          return JSON.stringify(val);
        } else {
          return val;
        }
      }
    },
    isPublic: {
      type: Boolean,
      'default': false
    },
    plan: {
      membersCount: {
        type: Number,
        'default': 20
      },
      paidCount: {
        type: Number,
        'default': 0
      },
      free: {
        type: Boolean,
        'default': !!config.free
      },
      expired: {
        type: Date,
        'default': function () {
          return moment().add(14, 'day').toDate();
        }
      },
      created: {
        type: Date,
        'default': Date.now
      },
      updated: {
        type: Date,
        'default': null
      },
      firstPaidTime: {
        type: Date,
        'default': null
      },
      lastPaidTime: {
        type: Date,
        'default': null
      }
    },
    membersCount: {
      type: Number,
      'default': 1
    },
    projectsCount: {
      type: Number,
      'default': 0
    },
    teamsCount: {
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
