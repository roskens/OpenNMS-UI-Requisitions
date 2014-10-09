/*global RequisitionNode:true */

'use strict';

describe('Controller: NodeController', function () {

  // Initialize testing environment

  var controllerFactory, scope, $q, mockModal = {}, mockGrowl = {}, mockRequisitionsService = {};

  var foreignSource = 'test-requisition';
  var foreignId = '1001';
  var node = new RequisitionNode(foreignSource, { 'foreign-id': foreignId });

  function createController() {
    return controllerFactory('NodeController', {
      $scope: scope,
      $routeParams: { 'foreignSource': foreignSource, 'foreignId': foreignId },
      $modal: mockModal,
      RequisitionsService: mockRequisitionsService,
      growl: mockGrowl
    });
  }

  beforeEach(module('onms-requisitions', function($provide) {
    $provide.value('$log', console);
  }));

  beforeEach(inject(function($rootScope, $controller, _$q_) {
    scope = $rootScope.$new();
    controllerFactory = $controller;
    $q = _$q_;
  }));

  beforeEach(function() {
    mockRequisitionsService.getNode = jasmine.createSpy('getNode');
    var nodeDefer = $q.defer();
    nodeDefer.resolve(node);
    mockRequisitionsService.getNode.andReturn(nodeDefer.promise);

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
    expect(mockRequisitionsService.getNode).toHaveBeenCalledWith(foreignSource, foreignId);
    expect(scope.foreignSource).toBe(foreignSource);
    expect(scope.foreignId).toBe(foreignId);
  });

});
