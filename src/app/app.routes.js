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
.run(function (localStorageService, $location, $state) {
  var token = localStorageService.get('token') || '';
  // var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjU2YjgxZjM1Y2RkZjlhOTNkN2FhOTMwZSIsImlhdCI6MTQ1NTA2Mzk2MiwiZXhwIjoxNDU1NjY4NzYyLCJ1c2VybmFtZSI6InBhdWwifQ.J41C5LZgbxLDvXePySKZOwitpYe6Cil7pxHX9kpsL9Q';

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
  if (payload.exp < Date.now()*1000) {
    $state.go('main', {login: true})
    return localStorageService.remove('token')
  }

})
