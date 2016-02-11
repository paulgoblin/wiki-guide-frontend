'use strict';
angular.module('wikiApp')

.directive('navBar', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'navBarCtrl',
    controllerAs: 'nb',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/navBar/navBar.html',
  }
})
.controller('navBarCtrl', function(LoginSrvc, UserSrvc, $scope, $state) {
  let nb = this;
  nb.logout = () => {
    LoginSrvc.logout();
    $state.go('main', {login: true});
  }
  LoginSrvc.listen($scope, () => {
    let token = LoginSrvc.token;
    if (!token) return;
    let payload = JSON.parse(atob(token.split('.')[1]));
    UserSrvc.getMe(payload.id);
  })
  UserSrvc.listen('me', $scope, () => {
    console.log("got me", UserSrvc.me);
    nb.me = UserSrvc.me;
  })
  nb.me = UserSrvc.me;
})
