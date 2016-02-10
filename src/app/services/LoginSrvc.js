'use strict';
angular.module('wikiApp')

.service( 'LoginSrvc', function(CONST, $http, localStorageService) {

  this.login = (loginInfo) => {
    return $http.post(`${CONST.API_URL}/users/login`, loginInfo)
     .success( resp => {
       updateToken(resp);
     })
  }

  this.register = (registerInfo) => {
    return $http.post(`${CONST.API_URL}/users/register`, registerInfo)
     .success( resp => {
       updateToken(resp);
     })
  }

  var updateToken = (token) => {
    console.log("updating token", token);
    localStorageService.set('token', 'Bearer ' + token);
    console.log("saved token", localStorageService.get('token'));
  }

})
