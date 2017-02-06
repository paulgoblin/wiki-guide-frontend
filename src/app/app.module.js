'use strict';

let app = angular.module('wikiApp', [
  'ui.router',
  'LocalStorageModule',
  'ngTouch',
])

let APP_ENV = process.env.APP_ENV;

let API_URL = (APP_ENV === 'development') ?
  'http://192.168.0.16:3000' :
  'https://desolate-sea-75202.herokuapp.com'

app.constant('CONST', {
  APP_ENV: APP_ENV,
  API_URL: API_URL,
  INITIAL_SEARCH_RAD: '10',  // miles
  MAX_SEARCH_RAD: '100',  // miles
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
  if (APP_ENV !== 'development') LoginSrvc.forceSSL();
  UserSrvc.locate();
  LoginSrvc.init(UserSrvc.requestMe);
})
