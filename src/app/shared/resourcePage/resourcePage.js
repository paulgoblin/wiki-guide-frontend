'use strict';

app.directive('resourcePage', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'resourcePageCtrl',
    controllerAs: 'rp',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/resourcePage/resourcePage.html',
  }
})
app.controller('resourcePageCtrl', function($scope, $sce, ResourceSrvc, UserSrvc, HELPERS) {
  let rp = this;
  let defaultUrl = "https://www.wikipedia.org/"

  rp.well = ResourceSrvc.well;
  rp.iframeUrl = $sce.trustAsResourceUrl(rp.well ? rp.well.info.url : defaultUrl);

  let dist = () => {
    if (!rp.well) return;
    let wellCoords = { lat: rp.well.lat, long: rp.well.long };
    return  HELPERS.calcDist(UserSrvc.coords, wellCoords) || '';
  }

  rp.dist = dist();

  UserSrvc.listen('coords', $scope, () => {
    rp.dist = dist();
  })

});
