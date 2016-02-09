'use strict';
angular.module('wikiApp')

.service('API', function( CONST ,$http){
  this.login = (loginInfo) => {
    $http.post(`${CONST.API_URL}/users/login`, loginInfo)
     .then( resp => {
       console.log("hey you logged in", resp);
     })
  }
})
