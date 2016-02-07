var myApp = angular.module('wikiApp', []);

myApp.controller('mainCtrl', ['$scope', function($scope) {
  $scope.test = 'poop';
}]);
