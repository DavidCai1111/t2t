module.exports = function (Schema) {
  return new Schema({
    openId: String,
    token: String,
    phone: String,
    refer: String,
    refreshToken: String,
    refreshAt: Date,
    company_id: String,
    lastSyncTime: Date,
    showname: String,
    _userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    _organizationId: {
      type: Schema.Types.ObjectId,
      ref: 'Organization'
    },
    created: {
      type: Date,
      'default': Date.now
    },
    updated: {
      type: Date,
      'default': Date.now
    }
  }, {
    read: 'secondaryPreferred'
  })
}
