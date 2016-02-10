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
.controller('navBarCtrl', function(LoginSrvc, UserSrvc, $scope) {
  let nb = this;
  LoginSrvc.listen($scope, function() {
    let token = LoginSrvc.token;
    let payload = JSON.parse(atob(token.split('.')[1]));
    UserSrvc.getMe(payload.id);
  })
  UserSrvc.listen('me', $scope, function() {
    nb.me = UserSrvc.me;
  })
  nb.me = UserSrvc.me;
})
