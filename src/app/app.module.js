'use strict';
let app = angular.module('wikiApp', [
  'ui.bootstrap',
  'ui.router',
  'LocalStorageModule',
  'ngTouch',
])

app.constant('CONST', {
  API_URL: 'https://desolate-sea-75202.herokuapp.com',
  // API_URL: 'http://localhost:3000',
  INITIAL_SEARCH_RAD: '10',  // miles
  MAX_SEARCH_RAD: '1281',  // miles
  REFRESH_DIST: '1', //how far your positon must change before deck updates, in miles
})

app.constant('HELPERS', {
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

app.run(function (UserSrvc, LoginSrvc) {
  UserSrvc.locate();
  LoginSrvc.init(UserSrvc.requestMe);
})
