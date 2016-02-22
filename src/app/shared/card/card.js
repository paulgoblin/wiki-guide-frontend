'use strict';

app.directive('cardDirective', function(){
  return {
    restrict: 'A',
    controller: 'cardCtrl',
    controllerAs: 'cc',
    scope: true,
    bindToController: {
      resource: "=",
    },
    templateUrl:'js/shared/card/card.html',
  }
})

app.controller('cardCtrl', function($scope, UserSrvc, HELPERS) {
  let cc = this;
  cc.resourceCoords = () => {
    return { lat: cc.resource.lat, long: cc.resource.long };
  }
  cc.dist = () => {
    return  HELPERS.calcDist(UserSrvc.coords, cc.resourceCoords()) || '';
  }

})
