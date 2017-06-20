/*
 * File : models/tokenBlacklist.js
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TokenBlacklistSchema = new Schema({

    token: {
        type: String
    },

    createdAt: {
        type: Date
    }

});

TokenBlacklistSchema.pre('save', function (next) {
    this.createdAt = new Date();
    next();
});
mongoose.model('TokenBlacklist', TokenBlacklistSchema)