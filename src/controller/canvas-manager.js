;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('canvasManagerCtrl', function ($scope, $rootScope, $http, $uibModal, workSpace, savedCanvas) {
    
    workSpace.isChanged = false;
    
    $scope.newCanvas = function () {
      workSpace.setInitData();
      workSpace.isChanged = false;
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
      $rootScope.$broadcast('editorCtrl.redrawBreakpoints');
      workSpace.isChanged = false;
    };

    $scope.saveCanvas = function () {
      $rootScope.$broadcast('editorCtrl.syncMarkersAndBreaks');
      workSpace.save();
      workSpace.isChanged = false;
    };

    $scope.removeSavedCanvas = function (item) {
      savedCanvas.remove(item.id);
    };

    $scope.isChanged = function () {
      return workSpace.isChanged;
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
          $rootScope.$broadcast('editorCtrl.redrawBreakpoints');
          workSpace.isChanged = true;
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