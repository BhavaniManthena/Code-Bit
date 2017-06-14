(function () {
  'use strict';

  angular
    .module('mycodes')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Mycodes',
      state: 'mycodes',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'mycodes', {
      title: 'List Mycodes',
      state: 'mycodes.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'mycodes', {
      title: 'Create Mycode',
      state: 'mycodes.create',
      roles: ['user']
    });
  }
}());
