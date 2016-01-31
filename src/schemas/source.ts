module.exports = function (Schema) {
  return new Schema({
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    title: {
      type: String
    },
    email: {
      type: String
    },
    created: {
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
