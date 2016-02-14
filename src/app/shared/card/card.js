'use strict';
angular.module('wikiApp')

.directive('cardDirective', function(){
  return {
    restrict: 'A',
    controller: 'cardCtrl',
    controllerAs: 'cc',
    scope: true,
    bindToController: {
      info: "="
    },
    templateUrl:'js/shared/card/card.html',
  }
})

.controller('cardCtrl', function($scope) {
})
