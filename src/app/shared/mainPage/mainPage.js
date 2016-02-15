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

.controller('mainPageCtrl', function($scope, $stateParams, UserSrvc) {
  let mp = this;
  mp.showLogin = $stateParams.login;
  mp.deck = UserSrvc.deck;
  UserSrvc.listen('deck', $scope, () => {
    mp.deck = UserSrvc.deck;
  })
});
