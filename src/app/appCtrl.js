'use strict';

// Handles all communication between services or within services.
app.controller('appCtrl', function($scope, CONST, UserSrvc, ResourceSrvc, LoginSrvc){

  LoginSrvc.listen('tokenChange', $scope, () => {
    updateUserFromToken();
  })

  UserSrvc.listen('coords', $scope, () => {
    ResourceSrvc.requestDeck(UserSrvc.me, UserSrvc.coords, searchDist());
  })

  UserSrvc.listen('me', $scope, () => {
    if (!UserSrvc.me) return LoginSrvc.logout();
    ResourceSrvc.requestDeck(UserSrvc.me, UserSrvc.coords, searchDist());
  })

  ResourceSrvc.listen('deck', $scope, () => {
    if (isDeckEmpty()) searchFurther();
  })

  let isDeckEmpty = () => (ResourceSrvc.deck.length <= 0);
  let searchDist = () => searchDistFactor * CONST.INITIAL_SEARCH_RAD;
  let haveExceededMaxSearch = () => searchDist() > CONST.MAX_SEARCH_RAD;

  let searchDistFactor = 1;
  let searchFurther = () => {
    searchDistFactor+= searchDistFactor;
    if (haveExceededMaxSearch()) return ResourceSrvc.stopSearch();
    ResourceSrvc.requestDeck(UserSrvc.me
                           , UserSrvc.coords
                           , searchDist()
                           , (err, deck) => {
      if (isDeckEmpty()) searchFurther();
    });
  }

  let updateUserFromToken = () => {
    let token = LoginSrvc.token;
    if (!token) return UserSrvc.deleteMe();;
    let payload = JSON.parse(atob(token.split('.')[1]));
    UserSrvc.requestMe(payload.id);
  }

})
