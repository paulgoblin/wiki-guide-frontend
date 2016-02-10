'use strict';
angular.module('wikiApp')

.service( 'LoginSrvc', function(CONST ,$http) {

  this.me = {};

  this.login = (loginInfo) => {
    $http.post(`${CONST.API_URL}/users/login`, loginInfo)
     .then( resp => {
       console.log("hey you logged in", resp.data);
     })
  }

  this.register = (registerInfo) => {
    $http.post(`${CONST.API_URL}/users/register`, registerInfo)
     .then( resp => {
       console.log("hey you logged in", resp.data);
     })
  }

})
