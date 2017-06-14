(function () {
  'use strict';

  // Mycodes controller
  angular
    .module('mycodes')
    .controller('MycodesController', MycodesController);

  MycodesController.$inject = ['$scope', '$state', '$window', 'Authentication', 'mycodeResolve'];

  function MycodesController ($scope, $state, $window, Authentication, mycode) {
    var vm = this;

    vm.authentication = Authentication;
    vm.mycode = mycode;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Mycode
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.mycode.$remove($state.go('mycodes.list'));
      }
    }

    // Save Mycode
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.mycodeForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.mycode._id) {
        vm.mycode.$update(successCallback, errorCallback);
      } else {
        vm.mycode.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('mycodes.view', {
          mycodeId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
