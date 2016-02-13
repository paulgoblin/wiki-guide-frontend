'use strict';
angular.module('wikiApp')

.service( 'UserSrvc', function(CONST, $http, $rootScope) {
  let refreshDist = 1; //how far your positon must change before update in miles
  let us = this;
  us.me = null;
  us.coords = { lat: null, long: null };
  us.locationWatcher = null;
  us.deck = null;

  us.locate = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.clearWatch(us.locationWatcher);
    us.locationWatcher = navigator.geolocation.watchPosition((newPosition) => {
      if (changeInDistance(newPosition) > refreshDist) updateCoords(newPosition);
    }, (err) => {
      console.log("couldn't find geolocation", err);
    });
  }

  us.getMe = (meId) => {
    let reqUrl = `${CONST.API_URL}/users/user/${meId}`
    return $http.get(reqUrl)
      .success( resp => {
        updateMe(resp);
      })
      .error( err => {
        updateMe(null);
      })
  }

  us.getNewDeck = () => {
    if (!us.me || !us.coords.lat) return;
    let reqUrl = `${CONST.API_URL}/resources/getDeck/${CONST.SEARCH_RAD}`
    let reqBody = {loc: us.coords, user: us.me}
    return $http.post(reqUrl, reqBody)
      .success( resp => {
        updateDeck(resp);
      })
      .error( err => {
        console.log("error getting deck", err);
      })
  }

  us.like = (resource) => {
    removeFromDeck(resource);
    if (us.me.likes.some(like => like._id === resource._id)) return false;
    us.me.likes.push(resource);
    emit('me');
    return true;
  }

  us.strike = (resource) => {
    removeFromDeck(resource);
    if (us.me.strikes.some(strike => strike === resource._id)) return false;
    us.me.strikes.push(resource._id);
    emit('me');
    return true;
  }

  us.listen = (eventName, scope, callback) => {
    let handler = $rootScope.$on(eventName, callback);
    scope.$on('$destroy', handler);
  }

  let emit = (eventName) => {
    $rootScope.$emit(eventName);
  }

  let updateMe = (me) => {
    us.me = me;
    us.getNewDeck();
    emit('me');
  }

  let updateCoords = (position) => {
    if (!position) return us.coords = null;
    us.coords = {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    };
    us.getNewDeck();
    emit('coords');
  }

  let updateDeck = (deck) => {
    us.deck = deck;
    emit('deck');
  }

  let removeFromDeck = (resource) => {
    let resI = us.deck.indexOf(resource);
    if (resI !== -1) us.deck.splice(resI, 1);
  }

  let changeInDistance = (newPosition) => {
    // works for small changes in distance (< 1 degree);
    // 1 degree change equals about 69 miles at (0,0)
    // may return NaN!!!!
    if (!us.coords.lat) return Infinity;
    let delx = (us.coords.long - newPosition.coords.longitude)*((180 - Math.abs(us.coords.lat))/180);
    let dely = us.coords.lat - newPosition.coords.latitude;
    let change = Math.sqrt(Math.pow(delx,2) - Math.pow(dely,2))*69;
    return change;
  }

})
