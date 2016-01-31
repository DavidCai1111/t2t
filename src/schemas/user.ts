'use strict'
module.exports = function (Schema) {
  const EmailSchema = new Schema({
    openId: String,
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true
      // get: function (val) {
      //   if (val != null) {
      //     return xss(val)
      //   } else {
      //     return val
      //   }
      // }
    },
    state: Number
  }, {
    toObject: {
      virtuals: true,
      getters: true
    },
    toJSON: {
      virtuals: true,
      getters: true
    }
  })
  return new Schema({
    name: {
      es_indexed: true,
      type: String
    },
    email: {
      type: String,
      index: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    emails: [EmailSchema],
    password: String,
    avatarUrl: {
      es_indexed: true,
      type: String
    },
    title: {
      type: String,
      'default': ''
    },
    birthday: Date,
    phone: String,
    location: {
      type: String,
      'default': ''
    },

    phoneForLogin: {
      type: String,
      trim: true
    },
    phoneVerifiedDate: {
      type: Date
    },
    pinyin: String,
    actived: Date,
    created: {
      type: Date,
      'default': Date.now
    },
    updated: {
      type: Date,
      'default': Date.now
    },
    isActive: {
      type: Boolean,
      'default': false
    },
    isAdmin: {
      type: Boolean,
      'default': false
    },
    isBlock: {
      type: Boolean,
      'default': false
    },
    isPay: {
      type: Boolean,
      'default': false
    },
    latestActived: {
      type: Date,
      'default': null
    },
    hasLoginToday: {
      type: Boolean,
      'default': false
    },
    hasLoginTalk: {
      type: Boolean,
      'default': false
    },
    googleTwoFactor: {
      type: String,
      'default': null
    },
    signUpIP: {
      type: String,
      'default': null
    },
    signUpCity: {
      type: String,
      'default': null
    },
    _invitorId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    _consumerId: {
      type: Schema.Types.ObjectId,
      ref: 'Consumer'
    },
    fromTitle: String
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
