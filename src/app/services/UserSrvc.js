'use strict';
angular.module('wikiApp')

.service( 'UserSrvc', function(CONST, HELPERS, $http, $rootScope) {
  let refreshDist = CONST.REFRESH_DIST;
  let searchDistFactor = 1;

  let us = this;
  us.me = null;
  us.coords = { lat: null, long: null };
  us.locationWatcher = null;
  us.deck = null;

  us.locate = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.clearWatch(us.locationWatcher);
    us.locationWatcher = navigator.geolocation.watchPosition((newPosition) => {
      if (changeInDistance(newPosition) > refreshDist) {
        updateCoords(newPosition);
        searchDistFactor = 1;
      }
    }, (err) => {
      console.log("couldn't find geolocation", err);
    });
  }

  us.requestMe = (meId, cb) => {
    cb = cb || (() => {});
    let reqUrl = `${CONST.API_URL}/users/user/${meId}`
    return $http.get(reqUrl)
      .success( resp => {
        updateMe(resp);
        cb(null, resp);
      })
      .error( err => {
        updateMe(null);
        cb(err)
      })
  }

  us.requestDeck = (cb) => {
    if (!us.me || !us.coords.lat) return;
    cb = cb || (() => {});
    let searchRadius = searchDistFactor * CONST.INITIAL_SEARCH_RAD;
    let reqUrl = `${CONST.API_URL}/resources/getDeck/${searchRadius}`
    let reqBody = {loc: us.coords, user: us.me}
    return $http.post(reqUrl, reqBody)
      .success( resp => {
        updateDeck(resp);
        cb(null, resp);
      })
      .error( err => {
        console.log("error getting deck", err);
        cb(err);
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
    emit('me');
  }

  let updateCoords = (position) => {
    if (!position) return us.coords = null;
    us.coords = {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    };
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
    if (!us.coords.lat || !us.coords.long) return Infinity;
    let newCoords = {};
    newCoords.lat = newPosition.coords.latitude;
    newCoords.long = newPosition.coords.longitude;
    HELPERS.calcDist(us.coords, newCoords);
  }

})
