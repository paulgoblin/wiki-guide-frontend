'use strict';
angular.module('wikiApp')

.service( 'UserSrvc', function(CONST, $http, $rootScope) {
  this.me = {};

  this.getMe = (meId) => {
    return $http.get(`${CONST.API_URL}/users/user/${meId}`)
      .success( resp => {
        updateMe(resp);
      })
  }

  this.listen = (eventName, scope, callback) => {
    let handler = $rootScope.$on(eventName, callback);
    scope.$on('$destroy', handler);
  }

  let emit = (eventName) => {
    $rootScope.$emit(eventName);
  }

  let updateMe = (me) => {
    this.me = me;
    emit('me');
  }

})
