'use strict';
angular.module('wikiApp')

.config(function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('main', {
      url: '/main?login',
      templateUrl: 'js/components/main/main.html',
      controller:'mainCtrl'
    })
    .state('resource', {
      url: '/resource/:resourceId',
      templateUrl: 'js/components/resource/resource.html',
      controller:'resourceCtrl'
    })
    .state('list', {
      url: '/list',
      templateUrl: 'js/components/list/list.html',
      controller:'listCtrl'
    });

  $urlRouterProvider.otherwise('main');

});
