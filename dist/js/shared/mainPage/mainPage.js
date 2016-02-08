'use strict';
angular.module('wikiApp')

.directive('mainPage', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'mainCtrl',
    controllerAs: 'main',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/mainPage/mainPage.html',
  }
})

.controller('mainCtrl', function($scope, $stateParams) {
  this.test = 'main penguin';
  this.showLogin = $stateParams.login;
});
