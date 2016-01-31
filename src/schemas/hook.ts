module.exports = function (Schema) {
  return new Schema({
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    },
    secret: {
      type: String,
      'default': ''
    },
    name: {
      type: String,
      'default': 'web'
    },
    active: {
      type: Boolean,
      'default': true
    },
    callbackURL: String,
    events: Array,
    lastResponse: {
      code: {
        type: Number,
        'default': 0
      },
      message: {
        type: String,
        'default': ''
      }
    },
    created: {
      type: Date,
      'default': Date.now
    },
    updated: {
      type: Date
    }
  })
}
