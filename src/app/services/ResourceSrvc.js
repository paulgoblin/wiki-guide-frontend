'use strict';

app.service( 'ResourceSrvc', function(CONST, $http, $rootScope) {

  this.well = null;
  this.deck = null;

  this.requestDeck = (me, coords, dist, cb) => {
    if (!me || !coords.lat || !coords.long || !dist) return;
    cb = cb || (() => {});
    let reqUrl = `${CONST.API_URL}/resources/getDeck`
               + `/${dist}/${coords.lat}/${coords.long}`
    let reqBody = {user: me}
    return $http.post(reqUrl, reqBody)
      .success( newDeck => {
        updateDeck(newDeck);
        cb(null, newDeck);
      })
      .error( err => {
        console.log("error getting deck", err);
        cb(err);
      })
  }

  this.addLike = (resource, updateDb) => {
    removeFromDeck(resource);
    if (!updateDb) return;
    return $http.post(`${CONST.API_URL}/users/likeResource/${resource._id}`)
      .error( err => {
        console.log("error liking", err);
      })
  }

  this.addStrike = (resource, updateDb) => {
    removeFromDeck(resource);
    if (!updateDb) return;
    return $http.post(`${CONST.API_URL}/users/strikeResource/${resource._id}`)
      .error( err => {
        console.log("error striking", err);
      })
  }

  this.stopSearch = () => {
    updateDeck([{}]);
  }

  this.displayErrorCard = (card) => {
    updateDeck([card]);
  }

  this.setWell = (resource) => {
    this.well = resource;
  }

  this.listen = (eventName, scope, callback) => {
    let handler = $rootScope.$on(eventName, callback);
    scope.$on('$destroy', handler);
  }

  let emit = (eventName) => {
    $rootScope.$emit(eventName);
  }

  let removeFromDeck = (resource) => {
    let resIndex = this.deck.indexOf(resource);
    if (resIndex === -1) return;
    this.deck.splice(resIndex, 1);
    emit('deck');
  }

  let updateDeck = (deck) => {
    this.deck = deck;
    if (!this.well) this.well = deck[0];
    emit('deck');
  }

})
