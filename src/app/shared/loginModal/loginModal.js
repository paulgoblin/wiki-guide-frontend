'use strict';
angular.module('wikiApp')

.directive('loginModal', function(){
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

.controller('loginCtrl', function($scope, $stateParams, $state, LoginSrvc) {

  var lm = this;
  lm.token = LoginSrvc.token;
  lm.submitLogin = (loginInfo) => {
    LoginSrvc.login(loginInfo)
      .success( resp => {
        $state.go('main', {login: null});
      })
      .error( err => {
        lm.loginAlert = err;
        console.log("error", err);
      })
  }
  lm.submitRegister = (registerInfo) => {
    LoginSrvc.register(registerInfo)
      .success( resp => {
        $state.go('main', {login: null});
      })
      .error( err => {
        lm.registerAlert = err;
        console.log("error", err);
      })
  }
  lm.closeLoginModal = () => {
    window.location.hash = window.location.hash.replace(/\?.*/,'')
  }
  lm.closeLoginAlert = () =>  lm.loginAlert = null;
  lm.closeRegisterAlert = () =>  lm.registerAlert = null;


});
