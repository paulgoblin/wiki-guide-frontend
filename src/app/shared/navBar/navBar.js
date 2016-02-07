'use strict';
angular.module('wikiApp')

.directive('navBar', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'navCtrl',
    controllerAs: 'nav',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/navBar/navBar.html',
  }
})
.controller('navCtrl', function() {
})
