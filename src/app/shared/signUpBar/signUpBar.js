'use strict';

app.directive('signUpBar', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'signUpBarCtrl',
    controllerAs: 'sb',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/signUpBar/signUpBar.html',
  }
})
app.controller('signUpBarCtrl', function(LoginSrvc, UserSrvc, $scope) {
  let sb = this;
  sb.logout = () => {
    LoginSrvc.logout();
  }
  UserSrvc.listen('me', $scope, () => {
    sb.me = UserSrvc.me;
  })
  sb.me = UserSrvc.me;

  sb.guest = () => (sb.me && sb.me._id.toString() === '000000000000000000000000');

})
