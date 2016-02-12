'use strict';
angular.module('wikiApp')

.directive('card', function(){
  return {
    restrict: 'A',
    controller: 'cardCtrl',
    controllerAs: 'cc',
    scope: true,
    bindToController: {
      resource: "="
    },
    templateUrl:'js/shared/card/card.html',
  }
})

.controller('cardCtrl', function() {
  let cc = this;
})
