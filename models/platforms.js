/*
 * File :  models/platforms.js
 */

'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlatformsSchema = new Schema({

    name: {
        type: String
    },

    id: {
        type: String,
        unique : true
    },

    logo: {
        type: String
    },

    about: {
        type: String
    },

    role: {
        type: String
    },

    url: {
        type: String
    },

    conditions: {
        type: Array
    },

    score: {
        type: Number
    },
    
    tier: {
        type: Array
    },

    createdAt: {
        type: Date
    },

    updatedAt: {
        type: Date
    }

});

PlatformsSchema.pre('save', function (next) {
    var now = new Date();
    this.updateAt = now;
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
mongoose.model('Platform', PlatformsSchema)