'use strict';
angular.module('wikiApp')

.service( 'LoginSrvc', function(CONST, $http, $rootScope, localStorageService) {

  this.token = localStorageService.get('token') || '';

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

  this.listen = (scope, callback) => {
    let handler = $rootScope.$on('tokenChange', callback);
    scope.$on('$destroy', handler);
  }

  let emit = () => {
    $rootScope.$emit('tokenChange');
  }

  let updateToken = (token) => {
    console.log("updating token");
    this.token = 'Bearer ' + token;
    localStorageService.set('token', 'Bearer ' + token);
    $http.defaults.headers.common.Authorization = token;
    emit();
  }

})
