module.exports = function (Schema) {
  var IdmapSchema
  IdmapSchema = new Schema({
    _tbId: {
      type: Schema.Types.ObjectId
    },
    refId: String,
    extra: {
      type: Schema.Types.Mixed
    },
    refer: {
      type: String,
      'enum': ['shimo', 'yiqixie', 'dingTalk']
    },
    created: {
      type: Date,
      'default': Date.now
    }
  }, {
    read: 'secondaryPreferred'
  })
  return IdmapSchema
}
