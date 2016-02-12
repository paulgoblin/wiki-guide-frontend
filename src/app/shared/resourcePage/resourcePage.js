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
.controller('resourcePageCtrl', function($scope, $stateParams, $sce, ResourceSrvc, UserSrvc) {
  let rp = this;
  let defaultUrl = "https://www.wikipedia.org/"
  rp.well = ResourceSrvc.well;
  console.log("ResourceSrvc well", ResourceSrvc.well);
  rp.iframeUrl = $sce.trustAsResourceUrl(rp.well ? rp.well.info.url : defaultUrl);

  UserSrvc.listen('deck', $scope, () => {
    ResourceSrvc.handleNewDeck(UserSrvc.deck);
  })

});
