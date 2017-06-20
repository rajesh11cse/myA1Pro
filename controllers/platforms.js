/*
 * File : contollers/paltforms.js
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
require('../models/platforms.js');
var Platform = mongoose.model('Platform');


/**
 * Create Platforms
 */
module.exports.createPlatform = function (req, res) {
    req.assert('name', 'Name is required').notEmpty();
    req.assert('role', 'Role is required').notEmpty();

    var errors = req.validationErrors();
    if (errors) {
        res.send(errors[0].msg); return;
    }
    var platform = new Platform(req.body);
    platform.save(function (err, qn) {
        if (err) {
            return res.status(200).json({ success: false, message: err });
        } else {
            return res.status(200).json({ success: true, message: 'Platform created successfully.' });
        }
    });
}


/**
 * Get platforms
 */
module.exports.getPlatform = function (req, res) {
    Platform.find(function (err, data) {
        if (err) {
            return res.status(200).json({ success: false, message: err });
        } else {
            return res.status(200).json({ success: true, message: data });
        }
    });
}