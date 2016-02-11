'use strict';
angular.module('wikiApp')

.service( 'UserSrvc', function(CONST, $http, $rootScope) {
  let us = this;
  us.me = null;
  us.coords = null;
  us.locationWatcher = null;
  us.deck = null;

  us.locate = () => {
    if ("geolocation" in navigator){
      navigator.geolocation.clearWatch(us.locationWatcher);
      us.locationWatcher = navigator.geolocation.watchPosition((position) => {
        console.log("watchPosition", position);
        updateCoords(position);
        us.getNewDeck();
      }, (err) => {
        console.log("couldn't find geolocation", err);
      });
    }
  }

  us.getMe = (meId) => {
    return $http.get(`${CONST.API_URL}/users/user/${meId}`)
      .success( resp => {
        updateMe(resp);
        us.getNewDeck();
      })
      .error( err => {
        updateMe(null);
      })
  }

  us.getNewDeck = () => {
    if (!us.me || !us.coords) return;
    return $http.get(`${CONST.API_URL}/users/user/${us.me._id}`)
      .success( resp => {
        console.log("got a new deck", resp);
      })
      .error( err => {
        console.log("error getting deck", err);
      })
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
      lang: position.coords.longitude,
    };
    emit('coords');
  }

})
