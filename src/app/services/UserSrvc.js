'use strict';

app.service( 'UserSrvc', function(CONST, HELPERS, $http, $rootScope) {

  let refreshDist = CONST.REFRESH_DIST;

  this.me = null;
  this.likesDistDict = {};
  this.coords = { lat: null, long: null };
  this.locationWatcher = null;
  this.nearby = null;

  let defaultPosition = {
    // home sweet home
    coords: {
      latitude: 37.3907,
      longitude: -122.0637,
    }
  };

  this.locate = () => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.clearWatch(this.locationWatcher);
    this.locationWatcher = navigator.geolocation.watchPosition((newPosition) => {
      if (changeInDistance(newPosition) > refreshDist) {
        updateCoords(newPosition);
        calcLikesDist();
      }
    }, (err) => {
      console.log("couldn't find geolocation", err);

      if (CONST.APP_ENV === 'development') {
        updateCoords(defaultPosition);
        calcLikesDist();
      }
    });
  }

  this.requestMe = (meId, cb) => {
    cb = cb || (() => {});
    let reqUrl = `${CONST.API_URL}/users/user/${meId}`
    return $http.get(reqUrl)
      .success( me => {
        updateMe(me);
        calcLikesDist();
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
    this.likesDistDict[resource.pageid] = distRating(resource);
    this.me.likes.unshift(resource);
    cb(resource, 'updateDb')
    emit('vote');
  }

  this.strike = (resource, cb) => {
    if (this.me.strikes.some(strike => strike === resource._id)){
      return cb(resource);
    }
    this.me.strikes.push(resource._id);
    cb(resource, 'updateDb')
    emit('vote');
  }

  this.listen = (eventName, scope, callback) => {
    let handler = $rootScope.$on(eventName, callback);
    scope.$on('$destroy', handler);
  }

  this.deleteMe = () => {
    updateMe(null);
  }

  let calcLikesDist = () => {
    if (!this.me || !this.coords.lat || !this.me.likes.length) return;
    this.likesDistDict = {};
    this.me.likes.forEach( like => {
      this.likesDistDict[like.pageid] = distRating(like);
    })
  }

  let distRating = (resource) => {
    let hotZone = 10; // miles
    let resCoords = { lat: resource.lat, long: resource.long };
    if (!resCoords.lat || !resCoords.long || !this.coords) return 0;
    let dist = HELPERS.calcDist(resCoords, this.coords);
    let rating = (dist <= hotZone) ? (hotZone - dist)/hotZone : 0;
    return rating
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
