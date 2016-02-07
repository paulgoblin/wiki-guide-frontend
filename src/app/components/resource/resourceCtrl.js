'use strict';
angular.module('wikiApp')

.controller('resourceCtrl', function($scope, $stateParams) {
  $scope.test = 'resource penguin';
  $scope.resourceId = $stateParams.resourceId;
});
