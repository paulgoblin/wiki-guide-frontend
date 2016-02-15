'use strict';
angular.module('wikiApp')

.service( 'UserSrvc', function(CONST, HELPERS, $http, $rootScope) {

  let refreshDist = CONST.REFRESH_DIST;

  this.me = null;
  this.coords = { lat: null, long: null };
  this.locationWatcher = null;

  this.locate = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.clearWatch(this.locationWatcher);
    this.locationWatcher = navigator.geolocation.watchPosition((newPosition) => {
      if (changeInDistance(newPosition) > refreshDist) {
        updateCoords(newPosition);
      }
    }, (err) => {
      console.log("couldn't find geolocation", err);
    });
  }

  this.requestMe = (meId, cb) => {
    cb = cb || (() => {});
    let reqUrl = `${CONST.API_URL}/users/user/${meId}`
    return $http.get(reqUrl)
      .success( me => {
        updateMe(me);
        cb(null, me);
      })
      .error( err => {
        this.deleteMe();
        cb(err)
      })
  }

  this.like = (resource, cb) => {
    if (this.me.likes.some(like => like._id === resource._id)){
      return cb(resource);
    }
    this.me.likes.push(resource);
    cb(resource, 'updateDb')
    emit('me');
  }

  this.strike = (resource, cb) => {
    if (this.me.strikes.some(strike => strike === resource._id)){
      return cb(resource);
    }
    this.me.strikes.push(resource._id);
    cb(resource, 'updateDb')
    emit('me');
  }

  this.listen = (eventName, scope, callback) => {
    let handler = $rootScope.$on(eventName, callback);
    scope.$on('$destroy', handler);
  }

  this.deleteMe = () => {
    updateMe(null);
  }

  let emit = (eventName) => {
    $rootScope.$emit(eventName);
  }

  let updateMe = (me) => {
    this.me = me;
    emit('me');
  }

  let updateCoords = (position) => {
    if (!position) return this.coords = null;
    this.coords = {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    };
    emit('coords');
  }

  let changeInDistance = (newPosition) => {
    if (!this.coords.lat || !this.coords.long) return Infinity;
    let newCoords = {};
    newCoords.lat = newPosition.coords.latitude;
    newCoords.long = newPosition.coords.longitude;
    HELPERS.calcDist(this.coords, newCoords);
  }

})
