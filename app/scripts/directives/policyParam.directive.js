/**
* @author Alejandro Galue <agalue@opennms.org>
* @copyright 2014 The OpenNMS Group, Inc.
*
* Inspired by:
* http://onehungrymind.com/angularjs-dynamic-templates/
*/

(function() {

  'use strict';

  angular.module('onms-requisitions')

  /**
  * @ngdoc directive
  * @name policyParam
  * @module onms-requisitions
  *
  * @description Policy Parameter
  */
  .directive('policyParam', ['$compile', function($compile) {

    /**
     * @description The HTML Template for required properties with a pre-defined set of values.
     *
     * @private
     * @ngdoc property
     * @name policyParam#optionsTemplate
     * @propertyOf policyParam
     * @returns {string} The HTML template
     */
    var optionsTemplate = '<label class="control-label">{{ parameter.key }}</label>'
      + '<select required class="form-control" placeholder="Select an option for {{ parameter.key }}" ng-model="parameter.value" ng-options="param for param in parameterOptions | filter:$viewValue"></select>';

    /**
     * @description The HTML Template for required string properties.
     *
     * @private
     * @ngdoc property
     * @name policyParam#stringTemplate
     * @propertyOf policyParam
     * @returns {string} The HTML template
     */
    var stringTemplate = '<label class="control-label">{{ parameter.key }}</label><input required class="form-control" placeholder="Value" ng-model="parameter.value" class="form-control"></input>';

    /**
     * @description The HTML Template for string parameter with remove button.
     *
     * @private
     * @ngdoc property
     * @name policyParam#defaultCommon
     * @propertyOf policyParam
     * @returns {string} The HTML template
     */
    var defaultCommon = '<div class="input-group">'
      + '<input required type="text" class="form-control" placeholder="Parameter Value" ng-model="parameter.value"></input>'
      + '<span class="input-group-btn">'
      + '<button class="btn btn-default" type="button" ng-click="removeParameter(index)"><span class="glyphicon glyphicon-remove"></span></button>'
      + '</span>'
      + '</div>';

    /**
     * @description The HTML Template for existing optional properties.
     *
     * @private
     * @ngdoc property
     * @name policyParam#defaultTemplateFixed
     * @propertyOf policyParam
     * @returns {string} The HTML template
     */
    var defaultTemplateFixed = '<label class="control-label">{{ parameter.key }}</label>' + defaultCommon;

    /**
     * @description The HTML Template for new optional properties.
     *
     * @private
     * @ngdoc property
     * @name policyParam#defaultTemplateEditable
     * @propertyOf policyParam
     * @returns {string} The HTML template
     */
    var defaultTemplateEditable = '<select required class="form-control" placeholder="Parameter Name" ng-model="parameter.key" ng-options="param for param in optionalParameters | filter:$viewValue"></select>' + defaultCommon;

    /**
    * @description Analyzes the local scope of the directive to select the proper HTML template and populate the parameter options.
    *
    * @private
    * @name policyParam:getTemplate
    * @ngdoc method
    * @methodOf policyParam
    * @param {object} scope The directive scope object
    * @returns {string} The HTML template
    */
    var getTemplate = function(scope) {
      var policy = scope.$parent.policy;
      var policies = scope.$parent.availablePolicies;

      scope.parameterOptions = [];
      scope.optionalParameters = [];

      for (var i=0; i<policies.length; i++) {
        if (policies[i]['class'] == policy.class) {
          for (var j=0; j<policies[i].parameters.length; j++) {
            var paramCfg = policies[i].parameters[j];
            if (paramCfg.key == scope.parameter.key) { // Checking current parameter
              if (paramCfg.required) {
                if (paramCfg.options) {
                  scope.parameterOptions = paramCfg.options;
                  return optionsTemplate;
                } else {
                  return stringTemplate;
                }
              }
            }
            if (!paramCfg.required) {
              scope.optionalParameters.push(paramCfg.key);
            }
          }
        }
      }

      return scope.parameter.key ? defaultTemplateFixed : defaultTemplateEditable;
    };

    /**
    * @description Analyzes the local scope of the directive to select the proper HTML template and populate the parameter options.
    *
    * @private
    * @name policyParam:getTemplate
    * @ngdoc method
    * @methodOf policyParam
    * @param {object} scope The directive scope object.
    * @param {object} element The DOM element of the directive.
    * @param {object} attrs The external attributes of the directive.
    */
    var linker = function(scope, element, attrs) {
      element.html(getTemplate(scope)).show();
      $compile(element.contents())(scope);
      scope.removeParameter = function(index) {
        scope.$parent.removeParameter(index);
      };
    };

    // Directive Bindings

    return {
      restrict: 'E',
      link: linker,
      scope: {
        parameter: '=',
        index: '@'
      }
    };

  }]);

}());
