/*
 * File : contollers/questionnaire.js
 */

'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose');
require('../models/questionnaire.js');
var Questionnaire = mongoose.model('Questionnaire');


/**
 * Create Questionnaire
 */
module.exports.createQuestionnaire = function (req, res) {
	req.assert('question', 'Question is required').notEmpty();

	var errors = req.validationErrors();
	if (errors) {
		res.send(errors[0].msg); return;
	}
    var questionnaire = new Questionnaire(req.body);
    questionnaire.save(function (err, qn) {
        if (err) {
            return res.status(200).json({ success: false, message: err });
        } else {
            return res.status(200).json({ success: true, message: 'Questionnaire created successfully.' });
        }
    });
}


/**
 * Get Questionnaire
 */
module.exports.getQuestionnaire = function (req, res) {
    Questionnaire.find(function (err, data) {
        if (err) {
            return res.status(200).json({ success: false, message: err });
        } else {
            return res.status(200).json({ success: true, message: data });
        }
    });
}