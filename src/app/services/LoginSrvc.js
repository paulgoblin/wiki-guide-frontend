'use strict';
angular.module('wikiApp')

.service( 'LoginSrvc', function(CONST, $http, localStorageService) {

  this.me = {};
  this.token = localStorageService.get('token');

  this.login = (loginInfo) => {
    return $http.post(`${CONST.API_URL}/users/login`, loginInfo)
     .success( resp => {
       updateToken(resp.data);
     })
  }

  this.register = (registerInfo) => {
    return $http.post(`${CONST.API_URL}/users/register`, registerInfo)
     .success( resp => {
       console.log("registered in", resp.data);
       updateToken(resp.data);
     })
  }

  var updateToken = (token) => {
    this.token = 'Bearer ' + token;
    localStorageService.set('token') = this.token;
  }

})
