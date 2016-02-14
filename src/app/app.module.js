'use strict';

angular.module('wikiApp', [
  'ui.bootstrap',
  'ui.router',
  'LocalStorageModule',
])

.constant('CONST', {
  // API_URL: 'http://desolate-sea-75202.herokuapp.com',
  API_URL: 'http://localhost:3000',
  SEARCH_RAD: '100',  // miles
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
  UserSrvc.getMe(payload.id);
})
