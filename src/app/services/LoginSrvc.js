'use strict';

app.service( 'LoginSrvc', function(CONST, $http, $rootScope, $state, localStorageService) {

  this.logout = () => {
    let token = localStorageService.get('token');
    if (token) {
      localStorageService.remove('token');
      this.token = null;
      emit('tokenChange');
    }
    $state.go('main', {login: true});
  }

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

  this.listen = (name, scope, callback) => {
    let handler = $rootScope.$on(name, callback);
    scope.$on('$destroy', handler);
  }

  this.init =  (cb) => {
    this.token = localStorageService.get('token') || null;
    if (!this.token) {
      $state.go('main', {login: true});
      return
    }
    try {
      var payload = JSON.parse(atob(this.token.split('.')[1]));
    }
    catch (e) {
      $state.go('main', {login: true})
      return localStorageService.remove('token')
    }
    if (payload.exp < Date.now()/1000) {
      console.log("exp", payload.exp, Date.now()/1000);
      $state.go('main', {login: true})
      return localStorageService.remove('token')
    }
    $http.defaults.headers.common.Authorization = this.token;
    window.location.hash = window.location.hash.replace(/\?.*/,'');
    cb(payload.id)
  }


  let emit = (name) => {
    $rootScope.$emit(name);
  }

  let updateToken = (token) => {
    this.token = 'Bearer ' + token;
    localStorageService.set('token', 'Bearer ' + token);
    $http.defaults.headers.common.Authorization = token;
    emit('tokenChange');
  }

})
