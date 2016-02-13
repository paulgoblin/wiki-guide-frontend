'use strict';
angular.module('wikiApp')

.directive('resourcePage', function(){
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
.controller('resourcePageCtrl', function($scope, $sce, ResourceSrvc, UserSrvc) {
  let rp = this;
  let defaultUrl = "https://www.wikipedia.org/"
  rp.well = ResourceSrvc.well;
  console.log("ResourceSrvc well", ResourceSrvc.well);
  rp.iframeUrl = $sce.trustAsResourceUrl(rp.well ? rp.well.info.url : defaultUrl);

});
