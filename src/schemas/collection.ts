module.exports = function(Schema) {
  var CollectionSchema;
  CollectionSchema = new Schema({
    title: {
      type: String
    },
    description: {
      type: String
    },
    collectionType: {
      es_indexed: true,
      type: String
    },
    isDeleted: {
      type: Boolean,
      'default': false
    },
    isArchived: {
      type: String,
      'default': null
    },
    created: {
      type: Date,
      'default': Date.now
    },
    updated: {
      type: Date,
      'default': Date.now
    },
    _creatorId: {
      type: Schema.Types.ObjectId
    },
    _projectId: {
      type: Schema.Types.ObjectId,
      ref: 'Project'
    },
    _parentId: {
      type: Schema.Types.ObjectId
    },
    color: String
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
  return CollectionSchema
}
