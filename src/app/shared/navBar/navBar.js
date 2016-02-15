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
.controller('navBarCtrl', function(LoginSrvc, UserSrvc, ResourceSrvc, $scope, $state,  $location) {
  let nb = this;
  nb.logout = () => {
    LoginSrvc.logout();
    $state.go('main', {login: true});
  }
  LoginSrvc.listen($scope, () => {
    let token = LoginSrvc.token;
    console.log("got a new token", token);
    if (!token) return;
    let payload = JSON.parse(atob(token.split('.')[1]));
    UserSrvc.requestMe(payload.id, UserSrvc.requestDeck());
  })
  UserSrvc.listen('me', $scope, () => {
    nb.me = UserSrvc.me;
  })
  UserSrvc.listen('deck', $scope, () => {
    ResourceSrvc.handleNewDeck(UserSrvc.deck);
  })
  nb.me = UserSrvc.me;
  nb.selected = window.location.hash.split('/')[1];
  window.addEventListener('hashchange', (loc) => {
    nb.selected = window.location.hash.split('/')[1]
  });
})
