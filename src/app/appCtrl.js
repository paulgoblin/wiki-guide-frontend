'use strict';
angular.module('wikiApp')

// used to commuicated between services via listenrs
.controller('appCtrl', function($scope, UserSrvc, ResourceSrvc, LoginSrvc){

  UserSrvc.listen('coords', $scope, () => {
    UserSrvc.requestDeck();
  })

  UserSrvc.listen('deck', $scope, () => {
    ResourceSrvc.handleNewDeck(UserSrvc.deck);
  })

  LoginSrvc.listen($scope, () => {
    let token = LoginSrvc.token;
    if (!token) return;
    let payload = JSON.parse(atob(token.split('.')[1]));
    UserSrvc.requestMe(payload.id, UserSrvc.requestDeck());
  })

})
