(function () {
  'use strict';

  describe('Mycodes Route Tests', function () {
    // Initialize global variables
    var $scope,
      MycodesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _MycodesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      MycodesService = _MycodesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('mycodes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/mycodes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          MycodesController,
          mockMycode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('mycodes.view');
          $templateCache.put('modules/mycodes/client/views/view-mycode.client.view.html', '');

          // create mock Mycode
          mockMycode = new MycodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mycode Name'
          });

          // Initialize Controller
          MycodesController = $controller('MycodesController as vm', {
            $scope: $scope,
            mycodeResolve: mockMycode
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:mycodeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.mycodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            mycodeId: 1
          })).toEqual('/mycodes/1');
        }));

        it('should attach an Mycode to the controller scope', function () {
          expect($scope.vm.mycode._id).toBe(mockMycode._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/mycodes/client/views/view-mycode.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          MycodesController,
          mockMycode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('mycodes.create');
          $templateCache.put('modules/mycodes/client/views/form-mycode.client.view.html', '');

          // create mock Mycode
          mockMycode = new MycodesService();

          // Initialize Controller
          MycodesController = $controller('MycodesController as vm', {
            $scope: $scope,
            mycodeResolve: mockMycode
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.mycodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/mycodes/create');
        }));

        it('should attach an Mycode to the controller scope', function () {
          expect($scope.vm.mycode._id).toBe(mockMycode._id);
          expect($scope.vm.mycode._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/mycodes/client/views/form-mycode.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          MycodesController,
          mockMycode;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('mycodes.edit');
          $templateCache.put('modules/mycodes/client/views/form-mycode.client.view.html', '');

          // create mock Mycode
          mockMycode = new MycodesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Mycode Name'
          });

          // Initialize Controller
          MycodesController = $controller('MycodesController as vm', {
            $scope: $scope,
            mycodeResolve: mockMycode
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:mycodeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.mycodeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            mycodeId: 1
          })).toEqual('/mycodes/1/edit');
        }));

        it('should attach an Mycode to the controller scope', function () {
          expect($scope.vm.mycode._id).toBe(mockMycode._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/mycodes/client/views/form-mycode.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
