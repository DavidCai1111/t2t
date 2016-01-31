'use strict'
module.exports = function(Schema, options) {
  const xss = require('xss');
  var PostSchema = new Schema({
    title: {
      es_indexed: true,
      es_analyzer: 'ik',
      type: String,
      'default': ''
    },
    content: {
      es_indexed: true,
      es_analyzer: 'ik_smart',
      type: String,
      'default': '',
      get: function(val) {
        if ((val != null) && this.postMode === 'html') {
          return xss(val, {
            whiteList: Object.assign(xss.whiteList, {
              strike: ['style'],
              u: ['style'],
              i: ['style'],
              b: ['style'],
              font: ['color'],
              td: ['width', 'colspan', 'rowspan', 'align', 'valign'],
              a: ['rel', 'target', 'href', 'title'],
              span: ['style'],
              ol: ['start'],
              hr: ['style']
            })
          });
        } else {
          return val;
        }
      }
    },
    code: String,
    links: [],
    attachments: [],
    isDeleted: {
      es_indexed: true,
      type: Boolean,
      'default': false
    },
    created: {
      es_indexed: true,
      type: Date,
      'default': Date.now
    },
    updated: {
      es_indexed: true,
      type: Date,
      'default': Date.now
    },
    _creatorId: {
      es_indexed: true,
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    involveMembers: [
      {
        es_indexed: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    _projectId: {
      es_indexed: true,
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    },
    postMode: String,
    type: {
      type: String,
      'default': 'text'
    },
    pin: {
      type: Boolean,
      'default': false
    },
    isArchived: {
      es_indexed: true,
      type: String,
      'default': null
    },
    visiable: {
      es_indexed: true,
      es_index: 'not_analyzed',
      type: String,
      'default': 'members',
      'enum': ['members', 'involves']
    },
    tagIds: [
    ],
    source: {
      type: String,
      'default': 'teambition'
    },
    consumerKey: {
      type: String,
      'default': null
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
  });

  return PostSchema;
};
