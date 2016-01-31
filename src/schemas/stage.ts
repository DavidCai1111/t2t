module.exports = function(Schema) {
  var StageSchema
  StageSchema = new Schema({
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    _tasklistId: {
      type: Schema.Types.ObjectId,
      ref: 'Tasklist'
    },
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String
    },
    created: {
      type: Date,
      'default': Date.now
    },
    updated: {
      type: Date,
      'default': Date.now
    },
    isFirst: {
      type: Boolean,
      'default': false
    },
    _nextId: {
      type: Schema.Types.ObjectId,
      ref: 'Stage',
      'default': null
    },
    isArchived: {
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
  })
  return StageSchema
};
