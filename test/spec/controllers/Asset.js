/**
* @author Alejandro Galue <agalue@opennms.org>
* @copyright 2014 The OpenNMS Group, Inc.
*/

'use strict';

describe('Controller: AssetController', function () {

  var scope, $q, controllerFactory, mockModalInstance, mockRequisitionsService = {}, mockEmptyTypeaheadService = [], asset = { key: 'admin', value: 'agalue' };

  function createController() {
    return controllerFactory('AssetController', {
      $scope: scope,
      $modalInstance: mockModalInstance,
      RequisitionsService: mockRequisitionsService,
      EmptyTypeaheadService: mockEmptyTypeaheadService,
      asset: asset
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
    mockRequisitionsService.getAvailableAssets = jasmine.createSpy('getAvailableAssets');
    var assets = $q.defer();
    assets.resolve(['address1','city','state','zip']);
    mockRequisitionsService.getAvailableAssets.andReturn(assets.promise);

    mockModalInstance = {
      close: function(obj) { console.info(obj); },
      dismiss: function(msg) { console.info(msg); }
    };
  });

  it('test controller', function() {
    createController();
    scope.$digest();
    expect(scope.asset.value).toBe(asset.value);
    expect(scope.assetFields.length).toBe(4);
    expect(scope.assetFields[0]).toBe('address1');
  });

});