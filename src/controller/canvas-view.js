;(function (angular) {
  'use strict';

  var app = angular.module('visualcodeApp');

  app.controller('canvasViewCtrl', function ($scope) {

    $scope.$on('canvasViewCtrl.load', function (event, data) {
      console.log(data);
    });

  });
})(angular);
