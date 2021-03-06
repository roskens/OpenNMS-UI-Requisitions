/*global RequisitionInterface:true */
/*jshint unused: false, undef:false, sub:true */

/**
* @author Alejandro Galue <agalue@opennms.org>
* @copyright 2014 The OpenNMS Group, Inc.
*/

/**
* @ngdoc object
* @name RequisitionNode
* @module onms-requisitions
* @param {string} foreignSource the name of the foreign source (a.k.a. provisioning group)
* @param {Object} node an OpenNMS node JSON object
* @param {boolean} isDeployed true if the node has been deployed
* @constructor
*/
function RequisitionNode(foreignSource, node, isDeployed) {

  'use strict';

  var self = this;

  /**
   * @description the foreign source
   * @ngdoc property
   * @name RequisitionNode#foreignSource
   * @propertyOf RequisitionNode
   * @returns {string} the foreign source
   */
  self.foreignSource = foreignSource;

  /**
   * @description The deployed flag
   * @ngdoc property
   * @name RequisitionNode#deployed
   * @propertyOf RequisitionNode
   * @returns {boolean} true, if the node has been deployed
   */
  self.deployed = isDeployed;

  /**
   * @description The foreign Id
   * @ngdoc property
   * @name RequisitionNode#foreignId
   * @propertyOf RequisitionNode
   * @returns {string} The foreign Id
   */
  self.foreignId = node['foreign-id'];

  /**
   * @description The node's label
   * @ngdoc property
   * @name RequisitionNode#nodeLabel
   * @propertyOf RequisitionNode
   * @returns {string} the node's label
   */
  self.nodeLabel = node['node-label'];

  /**
   * @description The city where the node is located
   * @ngdoc property
   * @name RequisitionNode#city
   * @propertyOf RequisitionNode
   * @returns {string} The city
   */
  self.city = node['city'];

  /**
   * @description The building where the node is located
   * @ngdoc property
   * @name RequisitionNode#building
   * @propertyOf RequisitionNode
   * @returns {string} The building
   */
  self.building = node['building'];

  /**
   * @description The parent foreign source (for path outages), required if the parent node exist on a different requisition.
   * @ngdoc property
   * @name RequisitionNode#parentForeignSource
   * @propertyOf RequisitionNode
   * @returns {string} The parent foreign source
   */
  self.parentForeignSource = node['parent-foreign-source'];

  /**
   * @description The parent foreign ID (for path outages), to uniquely identify the parent node (can not be used if parentForeignLabel is defined)
   * @ngdoc property
   * @name RequisitionNode#parentForeignId
   * @propertyOf RequisitionNode
   * @returns {string} The parent foreign ID
   */
  self.parentForeignId = node['parent-foreign-id'];

  /**
   * @description The parent foreign kavek (for path outages), to uniquely identify the parent node (can not be used if parentForeignId is defined)
   * @ngdoc property
   * @name RequisitionNode#parentForeignLabel
   * @propertyOf RequisitionNode
   * @returns {string} The parent foreign Label
   */
  self.parentForeignLabel = node['parent-foreign-label'];

  /**
   * @description The array of interfaces
   * @ngdoc property
   * @name RequisitionNode#interfaces
   * @propertyOf RequisitionNode
   * @returns {array} The interfaces
   */
  self.interfaces = [];

  /**
   * @description The array of categories
   * @ngdoc property
   * @name RequisitionNode#categories
   * @propertyOf RequisitionNode
   * @returns {array} The categories
   */
  self.categories = [];

  /**
   * @description The array of assets
   * @ngdoc property
   * @name RequisitionNode#assets
   * @propertyOf RequisitionNode
   * @returns {array} The assets
   */
  self.assets = [];

  angular.forEach(node['interface'], function(intf) {
    self.interfaces.push(new RequisitionInterface(intf));
  });

  angular.forEach(node['asset'], function(asset) {
    self.assets.push(asset);
  });

  angular.forEach(node['category'], function(category) {
    self.categories.push(category);
  });

  /**
  * @description Adds a new interface to the node
  *
  * @name RequisitionNode:addNewInterface
  * @ngdoc method
  * @methodOf RequisitionNode
  * @returns {object} the new interface Object
  */
  self.addNewInterface = function() {
    self.interfaces.push(new RequisitionInterface({}));
    return self.interfaces.length - 1;
  };

  /**
  * @description Adds a new asset to the node
  *
  * @name RequisitionNode:addNewAsset
  * @ngdoc method
  * @methodOf RequisitionNode
  * @returns {object} the new service Object
  */
  self.addNewAsset = function() {
    self.assets.push({
      name: '',
      value: ''
    });
    return self.assets.length -1;
  };

  /**
  * @description Adds a new category to the node
  *
  * @name RequisitionNode:addNewCategory
  * @ngdoc method
  * @methodOf RequisitionNode
  * @returns {object} the new service Object
  */
  self.addNewCategory = function() {
    self.categories.push({
      name: ''
    });
    return self.categories.length -1;
  };

  /**
  * @description Gets the OpenNMS representation of the requisitioned node
  *
  * @name RequisitionNode:getOnmsRequisitionNode
  * @ngdoc method
  * @methodOf RequisitionNode
  * @returns {object} the requisition Object
  */
  self.getOnmsRequisitionNode = function() {
    var nodeObject = {
      'foreign-id': self.foreignId,
      'node-label': self.nodeLabel,
      'city': self.city,
      'building': self.building,
      'interface': [],
      'asset': [],
      'category': []
    };

    angular.forEach(self.interfaces, function(intf) {
      var interfaceObject = {
        'ip-addr': intf.ipAddress,
        'descr': intf.description,
        'snmp-primary': intf.snmpPrimary,
        'status': (intf.status || intf.status === 'managed') ? '1' : '3',
        'monitored-service': []
      };
      angular.forEach(intf.services, function(service) {
        interfaceObject['monitored-service'].push({
          'service-name': service.name
        });
      });

      nodeObject['interface'].push(interfaceObject);
    });

    angular.forEach(self.assets, function(asset) {
      nodeObject['asset'].push(asset);
    });

    angular.forEach(self.categories, function(category) {
      nodeObject['category'].push(category);
    });

    return nodeObject;
  };

  self.className = 'RequisitionNode';

  return self;
}
