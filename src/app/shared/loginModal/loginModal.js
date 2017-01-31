'use strict';

app.directive('loginModal', function(){
  return {
    restrict: 'E',
    replace: true,
    controller: 'loginCtrl',
    controllerAs: 'lm',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/loginModal/loginModal.html',
  }
})

app.controller('loginCtrl', function($scope, $state, LoginSrvc) {

  var lm = this;
  lm.token = LoginSrvc.token;
  lm.submitLogin = (loginInfo) => {
    handleRequest(LoginSrvc.login,  loginInfo);
  }
  lm.submitRegister = (registerInfo) => {
    handleRequest(LoginSrvc.register, registerInfo);
  };
  lm.submitGuest = () => {
    handleRequest(LoginSrvc.guest);
  }

  lm.closeLoginModal = () => {
    window.location.hash = window.location.hash.replace(/\?.*/,'')
  }
  lm.closeLoginAlert = () =>  lm.loginAlert = null;
  lm.closeRegisterAlert = () =>  lm.registerAlert = null;
  lm.closeGuestAlert = () =>  lm.guestAlert = null;

  function handleRequest(fn, info) {
    lm.spin = true;
    return fn(info)
      .success( resp => {
        $state.go('main', {login: null});
      })
      .error( err => {
        lm.registerAlert = err;
        console.log("error", err);
      })
      .finally( () => { lm.spin = false })
  }

});
