'use strict';

var app = angular.module('wikiApp', ['ui.bootstrap', 'ui.router', 'LocalStorageModule', 'ngTouch']);

app.constant('CONST', {
  API_URL: 'https://desolate-sea-75202.herokuapp.com',
  // API_URL: 'http://localhost:3000',
  INITIAL_SEARCH_RAD: '10', // miles
  MAX_SEARCH_RAD: '100', // miles
  REFRESH_DIST: '1' });

//how far your positon must change before deck updates, in miles
app.constant('HELPERS', {
  calcDist: function calcDist(coords1, coords2) {
    var sigFigs = 2;
    var milesPerDegreeLat = 69.2;
    var delx = (coords1.long - coords2.long) * ((180 - Math.abs(coords1.lat)) / 180);
    var dely = coords1.lat - coords2.lat;
    var delx2 = Math.pow(delx, 2);
    var dely2 = Math.pow(dely, 2);
    var dist = Math.sqrt(delx2 + dely2) * milesPerDegreeLat;
    return dist.toPrecision(sigFigs);
  }
});

app.run(function (UserSrvc, LoginSrvc) {
  UserSrvc.locate();
  LoginSrvc.init(UserSrvc.requestMe);
});
'use strict';

app.config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('userApp');

  $stateProvider.state('main', {
    url: '/main?login',
    template: '<main-page></main-page>'
  }).state('resource', {
    url: '/resource/:resourceId',
    template: '<resource-page></resource-page>'
  }).state('list', {
    url: '/list',
    template: '<list-page></list-page>'
  });

  $urlRouterProvider.otherwise('main');
});
'use strict';

// Handles all communication between services or within services.

app.controller('appCtrl', function ($scope, CONST, UserSrvc, ResourceSrvc, LoginSrvc) {

  LoginSrvc.listen('tokenChange', $scope, function () {
    updateUserFromToken();
  });

  UserSrvc.listen('coords', $scope, function () {
    ResourceSrvc.requestDeck(UserSrvc.me, UserSrvc.coords, searchDist());
  });

  UserSrvc.listen('me', $scope, function () {
    if (!UserSrvc.me) return LoginSrvc.logout();
    ResourceSrvc.requestDeck(UserSrvc.me, UserSrvc.coords, searchDist());
  });

  ResourceSrvc.listen('deck', $scope, function () {
    if (isDeckEmpty()) searchFurther();
  });

  var isDeckEmpty = function isDeckEmpty() {
    return ResourceSrvc.deck.length <= 0;
  };
  var searchDist = function searchDist() {
    return searchDistFactor * CONST.INITIAL_SEARCH_RAD;
  };
  var haveExceededMaxSearch = function haveExceededMaxSearch() {
    return searchDist() > CONST.MAX_SEARCH_RAD;
  };

  var searchDistFactor = 1;
  var searchFurther = function searchFurther() {
    searchDistFactor += searchDistFactor;
    if (haveExceededMaxSearch()) return ResourceSrvc.stopSearch();
    ResourceSrvc.requestDeck(UserSrvc.me, UserSrvc.coords, searchDist(), function (err, deck) {
      if (isDeckEmpty()) searchFurther();
    });
  };

  var updateUserFromToken = function updateUserFromToken() {
    var token = LoginSrvc.token;
    if (!token) return UserSrvc.deleteMe();;
    var payload = JSON.parse(atob(token.split('.')[1]));
    UserSrvc.requestMe(payload.id);
  };
});
'use strict';

app.service('LoginSrvc', function (CONST, $http, $rootScope, $state, localStorageService) {
  var _this = this;

  this.logout = function () {
    var token = localStorageService.get('token');
    if (token) {
      localStorageService.remove('token');
      _this.token = null;
      emit('tokenChange');
    }
    $state.go('main', { login: true });
  };

  this.login = function (loginInfo) {
    return $http.post(CONST.API_URL + '/users/login', loginInfo).success(function (resp) {
      updateToken(resp);
    });
  };

  this.register = function (registerInfo) {
    return $http.post(CONST.API_URL + '/users/register', registerInfo).success(function (resp) {
      updateToken(resp);
    });
  };

  this.guest = function () {
    return $http.post(CONST.API_URL + '/users/guest').success(function (resp) {
      updateToken(resp);
    });
  };

  this.listen = function (name, scope, callback) {
    var handler = $rootScope.$on(name, callback);
    scope.$on('$destroy', handler);
  };

  this.init = function (cb) {
    _this.token = localStorageService.get('token') || null;
    if (!_this.token) {
      $state.go('main', { login: true });
      return;
    }
    try {
      var payload = JSON.parse(atob(_this.token.split('.')[1]));
    } catch (e) {
      $state.go('main', { login: true });
      return localStorageService.remove('token');
    }
    if (payload.exp < Date.now() / 1000) {
      $state.go('main', { login: true });
      return localStorageService.remove('token');
    }
    $http.defaults.headers.common.Authorization = _this.token;
    window.location.hash = window.location.hash.replace(/\?.*/, '');
    cb(payload.id);
  };

  var emit = function emit(name) {
    $rootScope.$emit(name);
  };

  var updateToken = function updateToken(token) {
    _this.token = 'Bearer ' + token;
    localStorageService.set('token', 'Bearer ' + token);
    $http.defaults.headers.common.Authorization = token;
    emit('tokenChange');
  };
});
'use strict';

app.service('ResourceSrvc', function (CONST, $http, $rootScope) {
  var _this = this;

  this.well = null;
  this.deck = null;

  this.requestDeck = function (me, coords, dist, cb) {
    if (!me || !coords.lat || !coords.long || !dist) return;
    cb = cb || function () {};
    var reqUrl = CONST.API_URL + '/resources/getDeck' + ('/' + dist + '/' + coords.lat + '/' + coords.long);
    var reqBody = { user: me };
    return $http.post(reqUrl, reqBody).success(function (newDeck) {
      updateDeck(newDeck);
      cb(null, newDeck);
    }).error(function (err) {
      console.log("error getting deck", err);
      cb(err);
    });
  };

  this.addLike = function (resource, updateDb) {
    removeFromDeck(resource);
    if (!updateDb) return;
    return $http.post(CONST.API_URL + '/users/likeResource/' + resource._id).error(function (err) {
      console.log("error liking", err);
    });
  };

  this.addStrike = function (resource, updateDb) {
    removeFromDeck(resource);
    if (!updateDb) return;
    return $http.post(CONST.API_URL + '/users/strikeResource/' + resource._id).error(function (err) {
      console.log("error striking", err);
    });
  };

  this.stopSearch = function () {
    updateDeck([{}]);
  };

  this.setWell = function (resource) {
    _this.well = resource;
  };

  this.listen = function (eventName, scope, callback) {
    var handler = $rootScope.$on(eventName, callback);
    scope.$on('$destroy', handler);
  };

  var emit = function emit(eventName) {
    $rootScope.$emit(eventName);
  };

  var removeFromDeck = function removeFromDeck(resource) {
    var resIndex = _this.deck.indexOf(resource);
    if (resIndex === -1) return;
    _this.deck.splice(resIndex, 1);
    emit('deck');
  };

  var updateDeck = function updateDeck(deck) {
    _this.deck = deck;
    if (!_this.well) _this.well = deck[0];
    emit('deck');
  };
});
'use strict';

app.service('UserSrvc', function (CONST, HELPERS, $http, $rootScope) {
  var _this = this;

  var refreshDist = CONST.REFRESH_DIST;

  this.me = null;
  this.likesDistDict = {};
  this.coords = { lat: null, long: null };
  this.locationWatcher = null;
  this.nearby = null;

  this.locate = function () {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.clearWatch(_this.locationWatcher);
    _this.locationWatcher = navigator.geolocation.watchPosition(function (newPosition) {
      if (changeInDistance(newPosition) > refreshDist) {
        updateCoords(newPosition);
        calcLikesDist();
      }
    }, function (err) {
      console.log("couldn't find geolocation", err);
    });
  };

  this.requestMe = function (meId, cb) {
    cb = cb || function () {};
    var reqUrl = CONST.API_URL + '/users/user/' + meId;
    return $http.get(reqUrl).success(function (me) {
      updateMe(me);
      calcLikesDist();
      cb(null, me);
    }).error(function (err) {
      _this.deleteMe();
      cb(err);
    });
  };

  this.like = function (resource, cb) {
    if (_this.me.likes.some(function (like) {
      return like._id === resource._id;
    })) {
      return cb(resource);
    }
    _this.likesDistDict[resource.pageid] = distRating(resource);
    _this.me.likes.unshift(resource);
    cb(resource, 'updateDb');
    emit('vote');
  };

  this.strike = function (resource, cb) {
    if (_this.me.strikes.some(function (strike) {
      return strike === resource._id;
    })) {
      return cb(resource);
    }
    _this.me.strikes.push(resource._id);
    cb(resource, 'updateDb');
    emit('vote');
  };

  this.listen = function (eventName, scope, callback) {
    var handler = $rootScope.$on(eventName, callback);
    scope.$on('$destroy', handler);
  };

  this.deleteMe = function () {
    updateMe(null);
  };

  var calcLikesDist = function calcLikesDist() {
    if (!_this.me || !_this.coords.lat || !_this.me.likes.length) return;
    _this.likesDistDict = {};
    _this.me.likes.forEach(function (like) {
      _this.likesDistDict[like.pageid] = distRating(like);
    });
  };

  var distRating = function distRating(resource) {
    var hotZone = 10; // miles
    var resCoords = { lat: resource.lat, long: resource.long };
    if (!resCoords.lat || !resCoords.long || !_this.coords) return 0;
    var dist = HELPERS.calcDist(resCoords, _this.coords);
    var rating = dist <= hotZone ? (hotZone - dist) / hotZone : 0;
    return rating;
  };

  var emit = function emit(eventName) {
    $rootScope.$emit(eventName);
  };

  var updateMe = function updateMe(me) {
    _this.me = me;
    emit('me');
  };

  var updateCoords = function updateCoords(position) {
    if (!position) return _this.coords = null;
    _this.coords = {
      lat: position.coords.latitude,
      long: position.coords.longitude
    };
    emit('coords');
  };

  var changeInDistance = function changeInDistance(newPosition) {
    if (!_this.coords.lat || !_this.coords.long) return Infinity;
    var newCoords = {};
    newCoords.lat = newPosition.coords.latitude;
    newCoords.long = newPosition.coords.longitude;
    HELPERS.calcDist(_this.coords, newCoords);
  };
});
'use strict';

app.directive('cardDirective', function () {
  return {
    restrict: 'A',
    controller: 'cardCtrl',
    controllerAs: 'cc',
    scope: true,
    bindToController: {
      resource: "="
    },
    templateUrl: 'js/shared/card/card.html'
  };
});

app.controller('cardCtrl', function ($scope, UserSrvc, HELPERS) {
  var cc = this;
  cc.resourceCoords = function () {
    return { lat: cc.resource.lat, long: cc.resource.long };
  };
  cc.dist = function () {
    return HELPERS.calcDist(UserSrvc.coords, cc.resourceCoords()) || '';
  };
});
'use strict';

app.directive('alertBar', function () {
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: 'alertBarCtrl',
    controllerAs: 'ab',
    scope: true,
    bindToController: {},
    templateUrl: 'js/shared/alertBar/alertBar.html',
    link: function link(scope, el, attrs, ctrl, transclude) {
      el.append(transclude());
    }
  };
});
app.controller('alertBarCtrl', function () {});
'use strict';

app.directive('deck', function () {
  return {
    restrict: 'E',
    replace: true,
    controller: 'deckCtrl',
    controllerAs: 'dc',
    scope: true,
    bindToController: {
      deck: "="
    },
    templateUrl: 'js/shared/deck/deck.html'
  };
});

app.controller('deckCtrl', function ($state, UserSrvc, ResourceSrvc, $timeout) {
  var dc = this;
  var animationTime = 0.6; // seconds

  dc.deck = dc.deck || [{}];
  dc.movingCard = null;
  dc.preLoad = function () {
    return dc.deck[1] ? dc.deck[1].info.imgUrl : '';
  };

  dc.viewWell = function (resource) {
    ResourceSrvc.well = resource;
    $state.go('resource', { resourceId: resource._id });
  };

  dc.like = function (resource) {
    if (dc.movingCard) return;
    if (!dc.deck[0].info) return;
    movingCardTimeout();
    dc.liked = true;
    dc.movingCard = angular.copy(resource);
    UserSrvc.like(resource, ResourceSrvc.addLike);
  };

  dc.strike = function (resource) {
    if (dc.movingCard) return;
    if (!dc.deck[0].info) return;
    movingCardTimeout();
    dc.liked = false;
    dc.movingCard = angular.copy(resource);
    UserSrvc.strike(resource, ResourceSrvc.addStrike);
  };

  var movingCardTimeout = function movingCardTimeout() {
    $timeout(function () {
      dc.movingCard = null;
    }, animationTime * 1000);
  };
});
'use strict';

app.directive('loginModal', function () {
  return {
    restrict: 'E',
    replace: true,
    controller: 'loginCtrl',
    controllerAs: 'lm',
    scope: true,
    bindToController: {},
    templateUrl: 'js/shared/loginModal/loginModal.html'
  };
});

app.controller('loginCtrl', function ($scope, $state, LoginSrvc) {

  var lm = this;
  lm.token = LoginSrvc.token;
  lm.submitLogin = function (loginInfo) {
    LoginSrvc.login(loginInfo).success(function (resp) {
      $state.go('main', { login: null });
    }).error(function (err) {
      lm.loginAlert = err;
      console.log("error", err);
    });
  };
  lm.submitRegister = function (registerInfo) {
    LoginSrvc.register(registerInfo).success(function (resp) {
      $state.go('main', { login: null });
    }).error(function (err) {
      lm.registerAlert = err;
      console.log("error", err);
    });
  };
  lm.submitGuest = function () {
    LoginSrvc.guest().success(function (resp) {
      $state.go('main', { login: null });
    }).error(function (err) {
      lm.guestAlert = err;
      console.log("error", err);
    });
  };
  lm.closeLoginModal = function () {
    window.location.hash = window.location.hash.replace(/\?.*/, '');
  };
  lm.closeLoginAlert = function () {
    return lm.loginAlert = null;
  };
  lm.closeRegisterAlert = function () {
    return lm.registerAlert = null;
  };
  lm.closeGuestAlert = function () {
    return lm.guestAlert = null;
  };
});
'use strict';

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

app.directive('listPage', function () {
  return {
    restrict: 'E',
    replace: true,
    controller: 'listPageCtrl',
    controllerAs: 'lp',
    scope: true,
    bindToController: {},
    templateUrl: 'js/shared/listPage/listPage.html'
  };
});
app.controller('listPageCtrl', function ($scope, $state, UserSrvc, ResourceSrvc, HELPERS) {
  var lp = this;
  lp.me = UserSrvc.me || { likes: [] };
  lp.coords = UserSrvc.coords.lat ? UserSrvc.coords : null;
  lp.nearby = UserSrvc.nearby;
  lp.ratingScale = 10;
  lp.legend = [].concat(_toConsumableArray(Array(lp.ratingScale))).map(function (_, i) {
    return 'rating' + (i + 1);
  });

  lp.viewResource = function (resource) {
    ResourceSrvc.setWell(resource);
    $state.go('resource', { resourceId: resource._id });
  };
  lp.sortOrder = function (resource) {
    if (!lp.nearby) return 'index';
    return -UserSrvc.likesDistDict[resource.pageid];
  };
  lp.ratingClass = function (resource) {
    if (!lp.nearby) return;
    var rating = Math.ceil(lp.ratingScale * UserSrvc.likesDistDict[resource.pageid]);
    return 'rating' + rating;
  };
  lp.togNearby = function () {
    UserSrvc.nearby = !UserSrvc.nearby;
  };

  // listners
  UserSrvc.listen('me', $scope, function () {
    lp.me = UserSrvc.me;
  });
  UserSrvc.listen('coords', $scope, function () {
    lp.coords = UserSrvc.coords;
  });
});
'use strict';

app.directive('mainPage', function () {
  return {
    restrict: 'E',
    replace: true,
    controller: 'mainPageCtrl',
    controllerAs: 'mp',
    scope: true,
    bindToController: {},
    templateUrl: 'js/shared/mainPage/mainPage.html'
  };
});

app.controller('mainPageCtrl', function ($scope, $stateParams, ResourceSrvc) {
  var mp = this;
  mp.showLogin = $stateParams.login;
  mp.deck = ResourceSrvc.deck;
  ResourceSrvc.listen('deck', $scope, function () {
    mp.deck = ResourceSrvc.deck;
  });
});
'use strict';

app.directive('navBar', function () {
  return {
    restrict: 'E',
    replace: true,
    controller: 'navBarCtrl',
    controllerAs: 'nb',
    scope: true,
    bindToController: {},
    templateUrl: 'js/shared/navBar/navBar.html'
  };
});
app.controller('navBarCtrl', function (LoginSrvc, UserSrvc, $scope, $location) {
  var nb = this;
  nb.logout = function () {
    LoginSrvc.logout();
  };
  UserSrvc.listen('me', $scope, function () {
    nb.me = UserSrvc.me;
  });
  nb.me = UserSrvc.me;

  nb.guest = function () {
    return nb.me && nb.me._id.toString() === '000000000000000000000000';
  };

  nb.selected = window.location.hash.split('/')[1];
  window.addEventListener('hashchange', function (loc) {
    nb.selected = window.location.hash.split('/')[1];
  });
});
'use strict';

app.directive('resourcePage', function () {
  return {
    restrict: 'E',
    replace: true,
    controller: 'resourcePageCtrl',
    controllerAs: 'rp',
    scope: true,
    bindToController: {},
    templateUrl: 'js/shared/resourcePage/resourcePage.html'
  };
});
app.controller('resourcePageCtrl', function ($scope, $sce, ResourceSrvc, UserSrvc, HELPERS) {
  var rp = this;
  var defaultUrl = "https://www.wikipedia.org/";

  rp.well = ResourceSrvc.well;
  rp.iframeUrl = $sce.trustAsResourceUrl(rp.well ? rp.well.info.url : defaultUrl);

  var dist = function dist() {
    if (!rp.well) return;
    var wellCoords = { lat: rp.well.lat, long: rp.well.long };
    return HELPERS.calcDist(UserSrvc.coords, wellCoords) || '';
  };

  rp.dist = dist();

  UserSrvc.listen('coords', $scope, function () {
    rp.dist = dist();
  });
});
'use strict';

app.directive('signUpBar', function () {
  return {
    restrict: 'E',
    replace: true,
    controller: 'signUpBarCtrl',
    controllerAs: 'sb',
    scope: true,
    bindToController: {},
    templateUrl: 'js/shared/signUpBar/signUpBar.html'
  };
});
app.controller('signUpBarCtrl', function (LoginSrvc, UserSrvc, $scope) {
  var sb = this;
  sb.logout = function () {
    LoginSrvc.logout();
  };
  UserSrvc.listen('me', $scope, function () {
    sb.me = UserSrvc.me;
  });
  sb.me = UserSrvc.me;

  sb.guest = function () {
    return sb.me && sb.me._id.toString() === '000000000000000000000000';
  };
});