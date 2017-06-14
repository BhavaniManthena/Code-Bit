'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Mycode = mongoose.model('Mycode'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Mycode
 */
exports.create = function(req, res) {
  var mycode = new Mycode(req.body);
  mycode.user = req.user;

  mycode.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mycode);
    }
  });
};

/**
 * Show the current Mycode
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var mycode = req.mycode ? req.mycode.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  mycode.isCurrentUserOwner = req.user && mycode.user && mycode.user._id.toString() === req.user._id.toString();

  res.jsonp(mycode);
};

/**
 * Update a Mycode
 */
exports.update = function(req, res) {
  var mycode = req.mycode;

  mycode = _.extend(mycode, req.body);

  mycode.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mycode);
    }
  });
};

/**
 * Delete an Mycode
 */
exports.delete = function(req, res) {
  var mycode = req.mycode;

  mycode.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mycode);
    }
  });
};

/**
 * List of Mycodes
 */
exports.list = function(req, res) {
  Mycode.find().sort('-created').populate('user', 'displayName').exec(function(err, mycodes) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(mycodes);
    }
  });
};

/**
 * Mycode middleware
 */
exports.mycodeByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Mycode is invalid'
    });
  }

  Mycode.findById(id).populate('user', 'displayName').exec(function (err, mycode) {
    if (err) {
      return next(err);
    } else if (!mycode) {
      return res.status(404).send({
        message: 'No Mycode with that identifier has been found'
      });
    }
    req.mycode = mycode;
    next();
  });
};
