'use strict';

app.config(function($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

  var host = "paulgoblin.github.io";
  if ((host == window.location.host) && (window.location.protocol != "https:"))
      window.location.protocol = "https";
      
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
