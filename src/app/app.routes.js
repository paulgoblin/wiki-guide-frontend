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
