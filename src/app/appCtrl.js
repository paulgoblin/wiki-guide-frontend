'use strict';
angular.module('wikiApp')

// used to commuicated between services via listenrs
.controller('appCtrl', function($scope, UserSrvc, ResourceSrvc, LoginSrvc){

  UserSrvc.listen('coords', $scope, () => {
    ResourceSrvc.requestDeck(UserSrvc.me, UserSrvc.coords);
  })

  LoginSrvc.listen($scope, () => {
    let token = LoginSrvc.token;
    if (!token) return;
    let payload = JSON.parse(atob(token.split('.')[1]));
    UserSrvc.requestMe(payload.id, ResourceSrvc.requestDeck());
  })

})
