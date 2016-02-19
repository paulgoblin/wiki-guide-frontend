'use strict';
angular.module('wikiApp')

.directive('listPage', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'listPageCtrl',
    controllerAs: 'lp',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/listPage/listPage.html',
  }
})
.controller('listPageCtrl', function($scope, $state, UserSrvc, ResourceSrvc, HELPERS) {
  let lp = this;
  lp.me = UserSrvc.me || { likes: [] };
  lp.coords = UserSrvc.coords || null;
  lp.viewResource = (resource) => {
    ResourceSrvc.setWell(resource);
    $state.go('resource', {resourceId: resource._id});
  }
  lp.sortOrder = (resource) => {
    if (!lp.coords || !lp.nearby) return 'index';
    if(lp.nearby) return distRating(resource);
  }
  lp.ratingClass = (resource) => {
    let ratingCat = Math.ceil(distRating(resource)*10);
    return `rating${ratingCat}`;
  }

  function distRating(resource) {
    let hotZone = 10; // miles
    let resCoords = { lat: resource.lat, long: resource.long };
    if (!resCoords.lat || !resCoords.long || !lp.coords) return 0;
    let dist = HELPERS.calcDist(resCoords, lp.coords);
    let rating = (dist <= hotZone) ? (hotZone - dist)/hotZone : 0;
    console.log("rating", rating);
    return rating
  }

  // listners
  UserSrvc.listen('me', $scope, () => {
    lp.me = UserSrvc.me;
  })
  UserSrvc.listen('coords', $scope, () => {
    lp.coords = UserSrvc.coords;
  })
  UserSrvc.listen('vote', $scope, () => {
    lp.me = UserSrvc.me;
  })

});
