'use strict';
angular.module('wikiApp')

.directive('mainPage', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'mainPageCtrl',
    controllerAs: 'mp',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/mainPage/mainPage.html',
  }
})

.controller('mainPageCtrl', function($scope, $state, $stateParams, UserSrvc, ResourceSrvc) {
  let mp = this;
  mp.showLogin = $stateParams.login;
  mp.deck = UserSrvc.deck;
  mp.viewWell = (resource) => {
    ResourceSrvc.well = resource;
    $state.go('resource', {resourceId: resource._id});
  }

  UserSrvc.listen('deck', $scope, () => {
    console.log("deck", UserSrvc.deck);
    mp.deck = UserSrvc.deck;
    if (!ResourceSrvc.well) {
      ResourceSrvc.well = mp.deck[0];
    }
  })
});
