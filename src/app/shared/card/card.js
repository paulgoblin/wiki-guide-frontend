'use strict';
angular.module('wikiApp')

.directive('cardDirective', function(){
  return {
    restrict: 'A',
    controller: 'cardCtrl',
    controllerAs: 'cc',
    scope: true,
    bindToController: {
      resource: "="
    },
    templateUrl:'js/shared/card/card.html',
  }
})

.controller('cardCtrl', function($scope, UserSrvc) {
  let cc = this;

  cc.resourceCoords = () => {
    return { lat: cc.resource.lat, long: cc.resource.long };
  }

  let calcDist = (coords1, coords2) => {
    let delx = (coords1.long - coords2.long)*((180 - Math.abs(coords1.lat))/180);
    let dely = coords1.lat - coords2.lat;
    let change = Math.sqrt(Math.abs(Math.pow(delx,2) - Math.pow(dely,2)))*69;
    console.log(coords1, coords2, change);
    return isNaN(change) ? 0 : change;
  }
  cc.dist = () => {
    return  calcDist(UserSrvc.coords, cc.resourceCoords());
  }
})
