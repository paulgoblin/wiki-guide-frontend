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

.controller('deckCtrl', function($state, UserSrvc, ResourceSrvc, $timeout) {
  let dc = this;
  let animationTime = 0.34;  // seconds

  dc.deck = dc.deck || [{}];
  dc.movingCard = null;
  dc.preLoad = () => {
    return dc.deck[1] ? dc.deck[1].info.imgUrl : '';
  }

  dc.viewWell = (resource) => {
    ResourceSrvc.well = resource;
    $state.go('resource', {resourceId: resource._id});
  }

  dc.like = (resource) => {
    if (dc.movingCard) return;
    if (!dc.deck[0].info) return;
    movingCardTimeout();
    dc.liked = true;
    dc.movingCard = angular.copy(resource);
    UserSrvc.like(resource, ResourceSrvc.addLike);
  }

  dc.strike = (resource) => {
    if (dc.movingCard) return;
    if (!dc.deck[0].info) return;
    movingCardTimeout();
    dc.liked = false;
    dc.movingCard = angular.copy(resource);
    UserSrvc.strike(resource, ResourceSrvc.addStrike);
  }

  let movingCardTimeout = () => {
    $timeout(()=> {
      dc.movingCard = null;
    }, animationTime*1000 )
  }

})
