'use strict';

app.directive('listPage', function(){
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
app.controller('listPageCtrl', function($scope, $state, UserSrvc, ResourceSrvc, HELPERS) {
  let lp = this;
  lp.me = UserSrvc.me || { likes: [] };
  lp.coords = UserSrvc.coords.lat ? UserSrvc.coords : null;
  lp.nearby = UserSrvc.nearby;
  lp.ratingScale = 10;
  lp.legend = [...Array(lp.ratingScale)].map((_,i) => `rating${i+1}`);

  lp.viewResource = (resource) => {
    ResourceSrvc.setWell(resource);
    $state.go('resource', {resourceId: resource._id});
  }
  lp.sortOrder = (resource) => {
    if (!lp.nearby) return 'index';
    return -UserSrvc.likesDistDict[resource.pageid];
  }
  lp.ratingClass = (resource) => {
    if (!lp.nearby) return;
    let rating = Math.ceil(lp.ratingScale*UserSrvc.likesDistDict[resource.pageid]);
    return `rating${rating}`;
  }
  lp.togNearby = () => {
    UserSrvc.nearby = !UserSrvc.nearby;
  }

  // listners
  UserSrvc.listen('me', $scope, () => {
    lp.me = UserSrvc.me;
  })
  UserSrvc.listen('coords', $scope, () => {
    lp.coords = UserSrvc.coords;
  })

});
