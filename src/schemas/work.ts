module.exports = function(Schema, options) {
  var WorkSchema;
  WorkSchema = new Schema({
    title: {
      type: String
    },
    description: {
      es_indexed: true,
      es_analyzer: 'ik_smart',
      type: String
    },
    fileName: {
      es_indexed: true,
      es_analyzer: 'ik',
      type: String
    },
    fileType: {
      es_indexed: true,
      type: String
    },
    fileSize: {
      es_indexed: true,
      type: Number
    },
    fileKey: {
      es_indexed: true,
      type: String
    },
    fileCategory: String,
    imageWidth: Number,
    imageHeight: Number,
    source: {
      type: String,
      'default': 'teambition',
      get: function(val) {
        if (val === 'striker2') {
          return 'striker';
        }
        return val;
      }
    },
    created: {
      es_indexed: true,
      type: Date,
      'default': Date.now
    },
    lastVersionTime: {
      es_indexed: true,
      type: Date,
      'default': Date.now
    },
    updated: {
      es_indexed: true,
      type: Date,
      'default': Date.now
    },
    involveMembers: [
      {
        es_indexed: true,
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    isDeleted: {
      es_indexed: true,
      type: Boolean,
      'default': false
    },
    isArchived: {
      es_indexed: true,
      type: String,
      'default': null
    },
    _creatorId: {
      es_indexed: true,
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    _parentId: {
      es_indexed: true,
      type: Schema.Types.ObjectId,
      ref: 'Collection'
    },
    _projectId: {
      es_indexed: true,
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    downloadUrl: {
      es_indexed: true,
      type: String
    },
    thumbnailUrl: {
      es_indexed: true,
      type: String
    },
    visiable: {
      es_indexed: true,
      es_index: 'not_analyzed',
      type: String,
      'default': 'members',
      'enum': ['members', 'involves']
    },
    tagIds: [
      {
        es_indexed: true,
        type: Schema.Types.ObjectId,
        ref: 'Tag'
      }
    ]
  }, {
    read: 'secondaryPreferred',
    id: false,
    toObject: {
      virtuals: true,
      getters: true
    },
    toJSON: {
      versionKey: false,
      virtuals: true,
      getters: true,
      transform: function(doc, ret, options) {
        delete ret.url;
        return ret;
      }
    }
  });

  return WorkSchema;
};
