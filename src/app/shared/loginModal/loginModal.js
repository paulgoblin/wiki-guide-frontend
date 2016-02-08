'use strict';
angular.module('wikiApp')

.directive('loginModal', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'loginCtrl',
    controllerAs: 'login',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/loginModal/loginModal.html',
  }
})

.controller('loginCtrl', function($scope, $stateParams) {
  this.test = 'login penguin';
});
