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

.controller('loginCtrl',function($scope, $stateParams, LoginSrvc) {
  var lm = this;
  lm.submitLogin = (action, loginInfo) => {
    LoginSrvc[action](loginInfo);
  }
});
