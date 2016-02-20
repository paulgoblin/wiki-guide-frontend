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
  lp.coords = UserSrvc.coords.lat ? UserSrvc.coords : null;

  lp.ratingScale = 10;
  lp.legend = [...Array(lp.ratingScale)].map((_,i) => `rating${i+1}`).reverse();

  lp.viewResource = (resource) => {
    ResourceSrvc.setWell(resource);
    $state.go('resource', {resourceId: resource._id});
  }
  lp.sortOrder = (resource) => {
    if (!lp.nearby) return 'index';
    return UserSrvc.likesDistDict[resource.pageid];
  }
  lp.ratingClass = (resource) => {
    if (!lp.nearby) return;
    let rating = Math.ceil(lp.ratingScale*UserSrvc.likesDistDict[resource.pageid]);
    return `rating${rating}`;
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
