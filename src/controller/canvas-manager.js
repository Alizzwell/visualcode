;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('canvasManagerCtrl', function ($scope, $http, $uibModal, workSpace, savedCanvas) {
    $scope.lastSavedData = workSpace.getInitData();
    
    $scope.newCanvas = function () {
      workSpace.setInitData();
      $scope.lastSavedData = workSpace.getInitData();
    };

    $scope.getTitle = function () {
      return workSpace.data.title;
    };

    $scope.getSavedCanvas = function () {
      return savedCanvas.data;
    };

    $scope.setSavedCanvas = function (item) {
      workSpace.setData(item);
      angular.copy({}, workSpace.selected);
      $scope.lastSavedData = item;
    };

    $scope.saveCanvas = function () {
      workSpace.save();
      angular.copy(workSpace.data, $scope.lastSavedData);
    };

    $scope.isChanged = function () {
      return !angular.equals(workSpace.data, $scope.lastSavedData);
    };

    $scope.removeSavedCanvas = function (item) {
      savedCanvas.remove(item.id);
    };

    $scope.loadExamples = function () {
      $http.get('/api/examples').then(
        function success(res) {
          $scope.examples = res.data;
        }, function error() {

        });
    };

    $scope.setExample = function (item) {
      $http.get('/api/examples/' + item.id).then(
        function success(res) {
          delete res.data.id;
          workSpace.setData(res.data);
          angular.copy({}, workSpace.selected);
          $scope.lastSavedData = workSpace.getInitData();
        }, function err() {

        });
    };

    $scope.openSaveModal = function () {
      var modalInstance = $uibModal.open({
        templateUrl: 'save-modal.html',
        controller: 'saveModalCtrl',
        resolve: {
          title: function () {
            return workSpace.data.title;
          }
        }
      });

      modalInstance.result.then(function (title) {
        workSpace.data.title = title;
        $scope.saveCanvas();
      }, function () {

      });
    };

  });

  app.controller('saveModalCtrl', function ($scope, $uibModalInstance, title) {
    $scope.title = title;

    $scope.save = function () {
      $uibModalInstance.close($scope.title);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });

})(angular);