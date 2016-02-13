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

.controller('deckCtrl', function($state, UserSrvc, ResourceSrvc) {
  let dc = this;
  this.deck = this.deck || [{}];
  dc.viewWell = (resource) => {
    ResourceSrvc.well = resource;
    $state.go('resource', {resourceId: resource._id});
  }
  dc.strike = (resource) => {
    // only update server if local array of strikes updates
    UserSrvc.strike(resource) && ResourceSrvc.addStrike(resource);
  }
  dc.like = (resource) => {
    // only update server if local array of likes updates
    UserSrvc.like(resource) && ResourceSrvc.addLike(resource);
  }
})
