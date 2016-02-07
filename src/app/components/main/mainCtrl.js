'use strict';
angular.module('wikiApp')

.controller('mainCtrl', function($scope, $stateParams) {
  $scope.test = 'main penguin';
  $scope.stateParams = $stateParams.login;
});
