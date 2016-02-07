'use strict';

angular.module('wikiApp', [
  'ui.bootstrap',
  'ui.router'
])

.constant('ENV', {
  API_URL: 'http://localhost:3000'
})
