'use strict';
angular.module('wikiApp')

.service( 'UserSrvc', function(CONST, $http, $rootScope) {
  let refreshDist = 1; //miles
  let us = this;
  us.me = null;
  us.coords = { lat: null, long: null };
  us.locationWatcher = null;
  us.deck = null;

  us.locate = () => {
    if ("geolocation" in navigator){
      navigator.geolocation.clearWatch(us.locationWatcher);
      us.locationWatcher = navigator.geolocation.watchPosition((newPosition) => {
        if (changeInDistance(newPosition) > refreshDist) updateCoords(newPosition);
      }, (err) => {
        console.log("couldn't find geolocation", err);
      });
    }
  }

  us.getMe = (meId) => {
    return $http.get(`${CONST.API_URL}/users/user/${meId}`)
      .success( resp => {
        updateMe(resp);
      })
      .error( err => {
        updateMe(null);
      })
  }

  us.getNewDeck = () => {
    if (!us.me || !us.coords.lat) return;
    return $http.post(`${CONST.API_URL}/resources/getDeck/${CONST.SEARCH_RAD}`,
    {loc: us.coords, user: us.me})
      .success( resp => {
        updateDeck(resp);
      })
      .error( err => {
        console.log("error getting deck", err);
      })
  }

  us.listen = (eventName, scope, callback) => {
    let handler = $rootScope.$on(eventName, callback);
    scope.$on('$destroy', handler);
  }

  us.like = (resource) => {
    us.me.likes.push(resource);
    let resI = us.deck.indexOf(resource);
    if (resI !== -1) us.deck.splice(resI, 1);
    emit('me');
  }
  us.strike = (resource) => {
    us.me.strikes.push(resource._id);
    let resI = us.deck.indexOf(resource);
    if (resI !== -1) us.deck.splice(resI, 1);
    emit('me');
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

  let changeInDistance = (newPosition) => {
    if (!us.coords.lat) return Infinity;
    // works for small changes in distance (< 1 degree);
    // 1 degree change equals about 69 miles at (0,0)
    let delx = (us.coords.long - newPosition.coords.longitude)*((180 - Math.abs(us.coords.lat))/180);
    let dely = us.coords.lat - newPosition.coords.latitude;
    console.log("delx, dely", delx, dely);
    let change = Math.sqrt(Math.pow(delx,2) - Math.pow(dely,2))*69;
    console.log("checking distance", change, us.coords, newPosition);
    return change;
  }

})
