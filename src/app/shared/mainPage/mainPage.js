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

app.controller('mainPageCtrl', function($scope, $stateParams, $timeout, ResourceSrvc, LoginSrvc, UserSrvc) {

  let mp = this;
  mp.showLogin = $stateParams.login;
  mp.deck = ResourceSrvc.deck;
  ResourceSrvc.listen('deck', $scope, () => {
    mp.deck = ResourceSrvc.deck;
  })

  LoginSrvc.listen('tokenChange', $scope, () => {
    waitForLocation();
  })

  waitForLocation();

  function waitForLocation() {
    if (LoginSrvc.token) {
      $timeout(function() {
        if (!UserSrvc.coords.lat){
          ResourceSrvc.displayErrorCard({
            info: {
              title: "We can't find you right now.",
              intro: "Try coming back later!",
              imgUrl:"http://danielryanday.com/wp-content/uploads/2013/04/waldo.png"
            }
          })
        }
      }, 15000)
    }
  }
});
