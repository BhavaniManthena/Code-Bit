(function () {
  'use strict';

  angular
    .module('mycodes')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('mycodes', {
        abstract: true,
        url: '/mycodes',
        template: '<ui-view/>'
      })
      .state('mycodes.list', {
        url: '',
        templateUrl: 'modules/mycodes/client/views/list-mycodes.client.view.html',
        controller: 'MycodesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Mycodes List'
        }
      })
      .state('mycodes.create', {
        url: '/create',
        templateUrl: 'modules/mycodes/client/views/form-mycode.client.view.html',
        controller: 'MycodesController',
        controllerAs: 'vm',
        resolve: {
          mycodeResolve: newMycode
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Mycodes Create'
        }
      })
      .state('mycodes.edit', {
        url: '/:mycodeId/edit',
        templateUrl: 'modules/mycodes/client/views/form-mycode.client.view.html',
        controller: 'MycodesController',
        controllerAs: 'vm',
        resolve: {
          mycodeResolve: getMycode
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Mycode {{ mycodeResolve.name }}'
        }
      })
      .state('mycodes.view', {
        url: '/:mycodeId',
        templateUrl: 'modules/mycodes/client/views/view-mycode.client.view.html',
        controller: 'MycodesController',
        controllerAs: 'vm',
        resolve: {
          mycodeResolve: getMycode
        },
        data: {
          pageTitle: 'Mycode {{ mycodeResolve.name }}'
        }
      });
  }

  getMycode.$inject = ['$stateParams', 'MycodesService'];

  function getMycode($stateParams, MycodesService) {
    return MycodesService.get({
      mycodeId: $stateParams.mycodeId
    }).$promise;
  }

  newMycode.$inject = ['MycodesService'];

  function newMycode(MycodesService) {
    return new MycodesService();
  }
}());
