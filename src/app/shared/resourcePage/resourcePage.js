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
.controller('resourcePageCtrl', function($scope, $stateParams, $sce, ResourceSrvc) {
  let rp = this;
  rp.well = ResourceSrvc.well;
  rp.iframeUrl = $sce.trustAsResourceUrl(rp.well.info.url);
});
