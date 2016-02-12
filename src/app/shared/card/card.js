'use strict';
angular.module('wikiApp')

.directive('cardDirective', function(){
  return {
    restrict: 'A',
    controller: 'cardCtrl',
    controllerAs: 'cc',
    scope: true,
    bindToController: {
      resource: "=",
      test: "@"
    },
    templateUrl:'js/shared/card/card.html',
  }
})

.controller('cardCtrl', function() {
  let cc = this;
})
