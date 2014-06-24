(function() {

  'use strict';

  angular.module('onms-requisitions', [
    'ngRoute',
    'ngAnimate',
    'ui.bootstrap',
    'angular-growl',
    'angular-loading-bar'
  ])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider
    .when('/requisitions', {
      templateUrl: 'views/requisitions.html',
      controller: 'RequisitionsController'
    })
    .when('/requisitions/:foreignSource', {
      templateUrl: 'views/requisition.html',
      controller: 'RequisitionController'
    })
    .when('/requisitions/:foreignSource/foreignSource', {
      templateUrl: 'views/foreignsource.html',
      controller: 'ForeignSourceController'
    })
    .when('/requisitions/:foreignSource/nodes/:foreignId', {
      templateUrl: 'views/node.html',
      controller: 'NodeController'
    })
    .otherwise({
      redirectTo: '/requisitions'
    });
  }])

  .config(['growlProvider', function(growlProvider) {
    growlProvider.globalTimeToLive(3000);
  }])

  .config(['$tooltipProvider', function($tooltipProvider) {
    $tooltipProvider.setTriggers({
      'mouseenter': 'mouseleave'
    });
    $tooltipProvider.options({
      'placement': 'left',
      'trigger': 'mouseenter'
    });
  }]);

}());
