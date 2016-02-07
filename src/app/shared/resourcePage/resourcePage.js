'use strict';
angular.module('wikiApp')

.directive('resourcePage', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'resourceCtrl',
    controllerAs: 'resource',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/resourcePage/resourcePage.html',
  }
})
.controller('resourceCtrl', function($scope, $stateParams) {
  $scope.test = 'resource penguin';
  $scope.resourceId = $stateParams.resourceId;
});
