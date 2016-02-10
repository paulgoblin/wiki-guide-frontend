'use strict';
angular.module('wikiApp')

.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {
  localStorageServiceProvider.setPrefix('userApp');

  $stateProvider
    .state('main', {
      url: '/main?login',
      template: '<main-page></main-page>',
    })
    .state('resource', {
      url: '/resource/:resourceId',
      template: '<resource-page></resource-page>',
    })
    .state('list', {
      url: '/list',
      template: '<list-page></list-page>',
    });

  $urlRouterProvider.otherwise('main');

})
.run(function (localStorageService, $location, $state,  $http) {
  var token = localStorageService.get('token') || '';

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
  window.location.hash = window.location.hash.replace(/\?.*/,'')
})
