'use strict';

angular.module('wikiApp', [
  'ui.bootstrap',
  'ui.router'
])
.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('main', {
      url: '/',
      // template:'<h1>hello</h1>',
      templateUrl: 'js/components/main/main.html',
      controller:'mainCtrl'
    });
})
.constant('ENV', {
  API_URL: 'http://localhost:3000'
})
