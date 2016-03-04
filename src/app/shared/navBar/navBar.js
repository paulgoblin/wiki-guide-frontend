'use strict';

app.directive('navBar', function(){
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
app.controller('navBarCtrl', function(LoginSrvc, UserSrvc, $scope, $location) {
  let nb = this;
  nb.logout = () => {
    LoginSrvc.logout();
  }
  UserSrvc.listen('me', $scope, () => {
    nb.me = UserSrvc.me;
  })
  nb.me = UserSrvc.me;

  nb.guest = () => (nb.me && nb.me._id.toString() === '000000000000000000000000');

  nb.selected = window.location.hash.split('/')[1];
  window.addEventListener('hashchange', (loc) => {
    nb.selected = window.location.hash.split('/')[1]
  });
})
