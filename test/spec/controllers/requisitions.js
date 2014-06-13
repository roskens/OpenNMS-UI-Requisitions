'use strict';

describe('Controller: RequisitionsController', function () {

  // Initialize testing environment

  var controllerFactory, scope, $q, mockGrowl = {}, mockRequisitionsService = {}, requisitionsData = new RequisitionsData();

  function createController() {
    return controllerFactory('RequisitionsController', {
      $scope: scope,
      RequisitionsService: mockRequisitionsService,
      growl: mockGrowl
    });
  };

  beforeEach(module('onms-requisitions', function($provide) {
    $provide.value('$log', console);    
  }));

  beforeEach(inject(function($rootScope, $controller, _$q_) {
    scope = $rootScope.$new();
    controllerFactory = $controller;
    $q = _$q_;
  }));

  beforeEach(function() {
    mockRequisitionsService.getRequisitions = jasmine.createSpy('getRequisitions');
    var requisitionsDefer = $q.defer();
    requisitionsDefer.resolve(requisitionsData);    
    mockRequisitionsService.getRequisitions.andReturn(requisitionsDefer.promise);

    mockGrowl = {
      addWarnMessage: function(msg) { console.warn(msg); },
      addErrorMessage: function(msg) { console.error(msg); },
      addInfoMessage: function(msg) { console.info(msg); },
      addSuccessMessage: function(msg) { console.info(msg); }
    };
  });

  it('test controller', function() {
    createController();
    scope.$digest();
    expect(mockRequisitionsService.getRequisitions).toHaveBeenCalled();
    expect(scope.requisitions.status).not.toBe(null);
  });

});