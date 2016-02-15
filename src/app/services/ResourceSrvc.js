'use strict';
angular.module('wikiApp')

.service( 'ResourceSrvc', function(CONST, $http, $rootScope) {

  let searchDistFactor = 1;

  this.well = null;
  this.deck = null;

  this.requestDeck = (me, coords, cb) => {
    console.log("reqesting deck");
    if (!me || !coords.lat || !coords.long) return;
    cb = cb || (() => {});
    let searchRadius = searchDistFactor * CONST.INITIAL_SEARCH_RAD;
    let reqUrl = `${CONST.API_URL}/resources/getDeck/${searchRadius}`
    let reqBody = {loc: coords, user: me}
    return $http.post(reqUrl, reqBody)
      .success( resp => {
        console.log("got a deck", resp);
        updateDeck(resp);
        cb(null, resp);
      })
      .error( err => {
        console.log("error getting deck", err);
        cb(err);
      })
  }

  this.addLike = (resource) => {
    console.log("adding like");
    return $http.post(`${CONST.API_URL}/users/likeResource/${resource._id}`)
      .error( err => {
        console.log("error liking", err);
      })
  }

  this.addStrike = (resource) => {
    return $http.post(`${CONST.API_URL}/users/strikeResource/${resource._id}`)
      .error( err => {
        console.log("error striking", err);
      })
  }

  this.listen = (eventName, scope, callback) => {
    let handler = $rootScope.$on(eventName, callback);
    scope.$on('$destroy', handler);
  }

  let emit = (eventName) => {
    $rootScope.$emit(eventName);
  }

  this.setWell = (resource) => {
    this.well = resource;
  }

  let updateDeck = (deck) => {
    this.deck = deck;
    if (!this.well) this.well = deck[0];
    emit('deck');
  }

  let removeFromDeck = (resource) => {
    let resI = this.deck.indexOf(resource);
    if (resI !== -1) this.deck.splice(resI, 1);
  }


})
