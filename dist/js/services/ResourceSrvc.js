'use strict';
angular.module('wikiApp')

.service( 'ResourceSrvc', function(CONST, $http) {
  this.well = null;

  this.handleNewDeck = (deck) => {
    if (this.well) return;
    this.well = deck[0];
  }

  this.setWell = (resource) => {
    this.well = resource;
  }

  this.addLike = (resource) => {
    console.log("adding like");
    return $http.post(`${CONST.API_URL}/users/likeResource/${resource._id}`)
      .success( resp => {
      })
      .error( err => {
        console.log("error liking", err);
      })
  }

  this.addStrike = (resource) => {
    return $http.post(`${CONST.API_URL}/users/strikeResource/${resource._id}`)
      .success( resp => {
      })
      .error( err => {
        console.log("error striking", err);
      })
  }

})
