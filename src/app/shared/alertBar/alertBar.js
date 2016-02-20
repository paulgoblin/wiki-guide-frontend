'use strict';

app.directive('alertBar', function(){
  return {
    restrict: 'E',
    transclude: true,
    replace: true,
    controller: 'alertBarCtrl',
    controllerAs: 'ab',
    scope: true,
    bindToController: {
    },
    templateUrl:'js/shared/alertBar/alertBar.html',
    link: function(scope, el, attrs, ctrl, transclude) {
      el.append(transclude());
    },
  }
})
app.controller('alertBarCtrl', function(){

});
