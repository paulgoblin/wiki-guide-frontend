'use strict';
angular.module('wikiApp')

.service( 'ResourceSrvc', function(CONST, $http) {
  this.well = null;

  this.handleNewDeck = (deck) => {
    if (this.well) return;
    this.well = deck[0];
  }

  this.addStrike = (resource) => {
    // call to API

  }
  this.addLike = (resource) => {
    // call to API
  }
})
