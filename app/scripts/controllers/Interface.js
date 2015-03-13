/**
* @author Alejandro Galue <agalue@opennms.org>
* @copyright 2014 The OpenNMS Group, Inc.
*/

(function() {

  'use strict';

  angular.module('onms-requisitions')

  /**
  * @ngdoc controller
  * @name InterfaceController
  * @module onms-requisitions
  *
  * @requires $scope Angular local scope
  * @requires $modalInstance Angular modal instance
  * @requires RequisitionsService The Requisitions Servive
  * @requires EmptyTypeaheadService The empty typeahead Service
  * @requires intf Interface policy object
  *
  * @description The controller for manage the modal dialog for add/edit IP interfaces of requisitioned nodes
  */
  .controller('InterfaceController', ['$scope', '$modalInstance', 'RequisitionsService', 'EmptyTypeaheadService', 'intf', function($scope, $modalInstance, RequisitionsService, EmptyTypeaheadService, intf) {

    /**
    * @description The interface object
    *
    * @ngdoc property
    * @name InterfaceController#intf
    * @propertyOf InterfaceController
    * @returns {object} The interface object
    */
    $scope.intf = intf;

    /**
    * @description An array map with the valid values for snmp-primary
    *
    * @ngdoc property
    * @name InterfaceController#snmpPrimaryFields
    * @propertyOf InterfaceController
    * @returns {object} The snmp primary fields object
    */
    $scope.snmpPrimaryFields = [
      { id: 'P', title: 'Primary' },
      { id: 'S', title: 'Secondary' },
      { id: 'N', title: 'Not Elegible'}
    ];

    /**
    * @description The available asset fields
    *
    * @ngdoc property
    * @name InterfaceController#availableServices
    * @propertyOf InterfaceController
    * @returns {array} List of available services
    */
    $scope.availableServices = [];

    /**
    * @description fieldComparator method from EmptyTypeaheadService
    *
    * @ngdoc method
    * @name InterfaceController#fieldComparator
    * @methodOf AssetController
    */
    $scope.fieldComparator = EmptyTypeaheadService.fieldComparator;

    /**
    * @description onFocus method from EmptyTypeaheadService
    *
    * @ngdoc method
    * @name InterfaceController#onFocus
    * @methodOf AssetController
    */
    $scope.onFocus = EmptyTypeaheadService.onFocus;

    /**
    * @description Saves the current interface
    *
    * @name InterfaceController:save
    * @ngdoc method
    * @methodOf InterfaceController
    */
    $scope.save = function () {
      $modalInstance.close($scope.intf);
    };

    /**
    * @description Cancels the current operation
    *
    * @name InterfaceController:cancel
    * @ngdoc method
    * @methodOf InterfaceController
    */
    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };

    /**
    * @description Adds a new empty service
    *
    * @name InterfaceController:addService
    * @ngdoc method
    * @methodOf InterfaceController
    */
    $scope.addService = function() {
      $scope.intf.services.push({ name: '' });
    };

    /**
    * @description Removes a service
    *
    * @name InterfaceController:removeService
    * @ngdoc method
    * @methodOf InterfaceController
    * @param {integer} index The index of the service to remove
    */
    $scope.removeService = function(index) {
      $scope.intf.services.splice(index, 1);
    };

    $scope.settings = {
      bootstrap2: false,
      filterClear: 'Show all!',
      filterPlaceHolder: 'Filter!',
      moveSelectedLabel: 'Move selected only',
      moveAllLabel: 'Move all!',
      removeSelectedLabel: 'Remove selected only',
      removeAllLabel: 'Remove all!',
      moveOnSelect: false,
      preserveSelection: 'moved',
      selectedListLabel: 'Managed Services',
      nonSelectedListLabel: 'Available Services',
      postfix: '_helperz',
      selectMinHeight: 130,
      filter: false,
      filterNonSelected: '1',
      filterSelected: '4',
      infoAll: false,
      infoFiltered: '<span class="label label-warning">Filtered</span> {0} from {1}!',
      infoEmpty: 'Empty list',
      filterValues: false
    };

    // Initialization

    RequisitionsService.getAvailableServices().then(function(services) {
      var existingServices = $scope.intf.services.map(function(svc) { return svc.name; });
      console.log('$scope.intf.services', $scope.intf.services);

      $scope.availableServices = services
       .filter(function(svc){ return existingServices.indexOf(svc) < 0; })
       .map(function(svc) { return {'name': svc }; })
       .concat($scope.intf.services)
       .sort(function(a, b) {
          var x = a['name']; var y = b['name'];
          if (typeof x == "string") {
              x = x.toLowerCase();
          }
          if (typeof y == "string") {
              y = y.toLowerCase();
          }
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      })
      ;
      console.log('$scope.availableServices', $scope.availableServices);
    });

  }]);

}());
