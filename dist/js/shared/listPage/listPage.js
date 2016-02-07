'use strict';
angular.module('wikiApp')

.directive('listPage', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'listCtrl',
    controllerAs: 'list',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/listPage/listPage.html',
  }
})
.controller('listCtrl', function($scope, $stateParams) {
  this.test = 'list penguin';
});
