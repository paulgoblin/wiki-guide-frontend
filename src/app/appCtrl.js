'use strict';
angular.module('wikiApp')

// Handles all communication between services or within services.
.controller('appCtrl', function($scope, CONST, UserSrvc, ResourceSrvc, LoginSrvc){

  let searchDistFactor = 1;

  LoginSrvc.listen($scope, () => {
    let token = LoginSrvc.token;
    if (!token) return;
    let payload = JSON.parse(atob(token.split('.')[1]));
    UserSrvc.requestMe(payload.id);
  })

  UserSrvc.listen('coords', $scope, () => {
    ResourceSrvc.requestDeck(UserSrvc.me, UserSrvc.coords, searchDist());
  })

  ResourceSrvc.listen('deck', $scope, () => {
    if (isDeckEmpty()) searchFurther();
  })

  let isDeckEmpty = () => (ResourceSrvc.deck.length <= 0);
  let searchDist = () => searchDistFactor * CONST.INITIAL_SEARCH_RAD;
  let haveExceededMaxSearch = () => searchDist() > CONST.MAX_SEARCH_RAD;

  let searchFurther = () => {
    searchDistFactor+= searchDistFactor;
    if (haveExceededMaxSearch()) return ResourceSrvc.stopSearch();
    ResourceSrvc.requestDeck(UserSrvc.me
                           , UserSrvc.coords
                           , searchDist()
                           , (err, deck) => {
      if (err) return;
      if (isDeckEmpty()) searchFurther();
    });
  }

})
