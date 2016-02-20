'use strict';

app.directive('mainPage', function(){
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

app.controller('mainPageCtrl', function($scope, $stateParams, ResourceSrvc) {
  let mp = this;
  mp.showLogin = $stateParams.login;
  mp.deck = ResourceSrvc.deck;
  ResourceSrvc.listen('deck', $scope, () => {
    mp.deck = ResourceSrvc.deck;
  })
});
