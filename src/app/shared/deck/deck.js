'use strict';
angular.module('wikiApp')

.directive('deck', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'deckCtrl',
    controllerAs: 'dc',
    scope: true,
    bindToController: {
      deck: "="
    },
    templateUrl:'js/shared/deck/deck.html',
  }
})

.controller('deckCtrl', function(UserSrvc) {
  let dc = this;
})
