// Mycodes service used to communicate Mycodes REST endpoints
(function () {
  'use strict';

  angular
    .module('mycodes')
    .factory('MycodesService', MycodesService);

  MycodesService.$inject = ['$resource'];

  function MycodesService($resource) {
    return $resource('api/mycodes/:mycodeId', {
      mycodeId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
