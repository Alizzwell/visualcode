;(function (angular) {
  'use strict';

  var app = angular.module('visualcodeApp');

  app.controller('containerCtrl', function ($scope) {
    $scope.containerMode = 'editor';

    $scope.isEditor = function () {
      return $scope.containerMode == 'editor';
    };

    $scope.openEditor = function () {
      $scope.containerMode = 'editor'
    };

    $scope.isView = function () {
      return $scope.containerMode == 'view';
    };

    $scope.openView = function () {
      $scope.containerMode = 'view';
    };
  });
})(angular);
