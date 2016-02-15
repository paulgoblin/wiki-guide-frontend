'use strict';

angular.module('wikiApp', [
  'ui.bootstrap',
  'ui.router',
  'LocalStorageModule',
])

.constant('CONST', {
  // API_URL: 'http://desolate-sea-75202.herokuapp.com',
  API_URL: 'http://localhost:3000',
  SEARCH_RAD: '10',  // miles
  REFRESH_DIST: '1', //how far your positon must change before deck updates, in miles
})

.constant('HELPERS', {
  calcDist: (coords1, coords2) => {
    let sigFigs = 2;
    let milesPerDegreeLat = 69.2;
    let delx = (coords1.long - coords2.long)*((180 - Math.abs(coords1.lat))/180);
    let dely = coords1.lat - coords2.lat;
    let delx2 = Math.pow(delx,2);
    let dely2 = Math.pow(dely,2);
    let dist = Math.sqrt(delx2 + dely2)*milesPerDegreeLat;
    return dist.toPrecision(sigFigs);
  }
})

.run(function (localStorageService, $state,  $http, UserSrvc) {
  let token = localStorageService.get('token') || '';
  UserSrvc.locate();

  if (!token) {
    $state.go('main', {login: true});
    return
  }
  try {
    var payload = JSON.parse(atob(token.split('.')[1]));
  }
  catch (e) {
    $state.go('main', {login: true})
    return localStorageService.remove('token')
  }
  if (payload.exp < Date.now()/1000) {
    console.log("exp", payload.exp, Date.now()/1000);
    $state.go('main', {login: true})
    return localStorageService.remove('token')
  }
  $http.defaults.headers.common.Authorization = token;
  window.location.hash = window.location.hash.replace(/\?.*/,'');
  UserSrvc.requestMe(payload.id, UserSrvc.requestDeck);
})
