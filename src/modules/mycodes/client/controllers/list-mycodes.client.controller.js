(function () {
  'use strict';

  angular
    .module('mycodes')
    .controller('MycodesListController', MycodesListController);

  MycodesListController.$inject = ['MycodesService'];

  function MycodesListController(MycodesService) {
    var vm = this;

    vm.mycodes = MycodesService.query();
  }
}());
