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
.controller('listPageCtrl', function($scope, $stateParams, UserSrvc) {
  let lp = this;
  lp.me = UserSrvc.me || { likes: [] };
  UserSrvc.listen('me', $scope, () => {
    lp.me = UserSrvc.me;
  })
  lp.select = (index) => {
    lp.selected = index;
  }
});
