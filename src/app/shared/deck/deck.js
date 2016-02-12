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

.controller('deckCtrl', function(UserSrvc, ResourceSrvc) {
  let dc = this;
  dc.viewWell = (resource) => {
    ResourceSrvc.well = resource;
    $state.go('resource', {resourceId: resource._id});
  }
  dc.strike = (resource) => {
    ResourceSrvc.addStrike(resource);
    UserSrvc.strike(resource);
  }
  dc.like = (resource) => {
    ResourceSrvc.addLike(resource);
    UserSrvc.like(resource);
  }
})
