/*
 * File : models/users.js
 */

'use strict';

var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Schema defines how the user's data will be stored in MongoDB
var UserSchema = new mongoose.Schema({
  firstName: {
    type: String
  },

  lastName: {
    type: String
  },

  nickName: {
    type: String
  },

  email: {
    type: String,
    unique: true,
  },

  password: {// hashed password only
    type: String,
  },

  oldPassword: {// Old three password
    type: Array,
  },

  phone: {
    type: Number,
  },

  dateOfBirth: {
    type: Date,
  },

  addressLine1: {
    type: String
  },

  addressLine2: {
    type: String
  },

  city: {
    type: String
  },

  state: {
    type: String
  },

  zipCode: {
    type: String
  },

  licenceNo: {
    type: String
  },

  licenceState: {
    type: String
  },

  licenceExpDate: {
    type: String
  },

  userName: {
    type: String,
  },

  role: {
    type: String,
    enum: ['Client', 'Manager', 'Admin'],
    default: 'Client'
  },

  selectedQns: {
    type: Object
  },

  matchedPFs: {
    type: Array
  },

  totalPFs: {
    type: Array
  },

  loginType: {
    type: String,
    default: 'local'
  },

  facebookId: {
    type: String
  },

  googleId: {
    type: String
  },

  createdAt: {
    type: Date
  },

  updatedAt: {
    type: Date
  }

});

// Saves the user's password hashed (plain text password storage is not good)
UserSchema.pre('save', function (next) {
  var user = this;
  var now = new Date();
  this.updatedAt = now;
  if (!this.createdAt) {
    this.createdAt = now;
  }
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        user.oldPassword = hash;
        next();
      });
    });
  } else {
    return next();
  }
});

// checking if password is valid
UserSchema.methods.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', UserSchema);