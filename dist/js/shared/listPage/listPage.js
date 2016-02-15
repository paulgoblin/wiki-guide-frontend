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
.controller('listPageCtrl', function($scope, $state, UserSrvc, ResourceSrvc) {
  let lp = this;
  lp.me = UserSrvc.me || { likes: [] };
  UserSrvc.listen('me', $scope, () => {
    lp.me = UserSrvc.me;
  })
  lp.viewResource = (resource) => {
    ResourceSrvc.setWell(resource);
    $state.go('resource', {resourceId: resource._id});
  }
});
