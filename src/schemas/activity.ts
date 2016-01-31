module.exports = function(Schema) {
  var ActivitySchema, BoundObjectSchema;
  BoundObjectSchema = new Schema({
    _objectId: Schema.Types.ObjectId,
    objectType: String
  });
  ActivitySchema = new Schema({
    action: String,
    rootId: String,
    content: {
      type: Schema.Types.Mixed
    },
    source: {
      type: String,
      'default': 'web'
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Consumer'
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
    _creatorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    boundToObjects: [BoundObjectSchema]
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
  ActivitySchema.virtual('isHomeActivity').get(function() {
    return this.action === 'project_home_activity';
  }).set(function(isHomeActivity) {
    this.isHomeActivity = isHomeActivity;
  });
  ActivitySchema.virtual('isDirectProjectMessage').get(function() {
    return this.action === 'direct_project_message';
  }).set(function(isDirectProjectMessage) {
    this.isDirectProjectMessage = isDirectProjectMessage;
  });
  ActivitySchema.virtual('isDirectUserMessage').get(function() {
    return this.action === 'direct_user_message';
  }).set(function(isDirectUserMessage) {
    this.isDirectUserMessage = isDirectUserMessage;
  });
  ActivitySchema.virtual('isDirectMessage').get(function() {
    return this.isDirectUserMessage || this.isDirectProjectMessage;
  }).set(function(isDirectUserMessage) {
    this.isDirectUserMessage = isDirectUserMessage;
  });
  return ActivitySchema;
};
