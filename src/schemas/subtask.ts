module.exports = function(Schema, options) {
  return new Schema({
    _taskId: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      index: true
    },
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    isDone: {
      es_indexed: true,
      type: Boolean,
      'default': false
    },
    _executorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      es_indexed: true,
      es_analyzer: 'ik_smart',
      type: String,
      'default': ''
    },
    dueDate: {
      es_indexed: true,
      type: Date,
      'default': null
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
    }
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
      getters: true
    }
  });
};
