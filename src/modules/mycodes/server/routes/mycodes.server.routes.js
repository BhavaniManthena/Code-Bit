'use strict';

/**
 * Module dependencies
 */
var mycodesPolicy = require('../policies/mycodes.server.policy'),
  mycodes = require('../controllers/mycodes.server.controller');

module.exports = function(app) {
  // Mycodes Routes
  app.route('/api/mycodes').all(mycodesPolicy.isAllowed)
    .get(mycodes.list)
    .post(mycodes.create);

  app.route('/api/mycodes/:mycodeId').all(mycodesPolicy.isAllowed)
    .get(mycodes.read)
    .put(mycodes.update)
    .delete(mycodes.delete);

  // Finish by binding the Mycode middleware
  app.param('mycodeId', mycodes.mycodeByID);
};
