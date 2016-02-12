'use strict';

angular.module('wikiApp', [
  'ui.bootstrap',
  'ui.router',
  'LocalStorageModule',
])

.constant('CONST', {
  API_URL: 'http://localhost:3000',
  SEARCH_RAD: '10',  // miles
})
