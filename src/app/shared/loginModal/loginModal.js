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
  lm.submitLogin = (loginInfo) => {
    LoginSrvc.login(loginInfo)
      .success( resp => {
        // $state.go('main');
      })
      .error( err => {
        lm.loginAlert = err;
        console.log("error", err);
      })
  }
  lm.submitRegister = (registerInfo) => {
    LoginSrvc.register(registerInfo)
      .error( err => {
        lm.registerAlert = err;
        console.log("error", err);
      })
  }
  lm.closeLoginAlert = () =>  lm.loginAlert = null;
  lm.closeRegisterAlert = () =>  lm.registerAlert = null;

});
