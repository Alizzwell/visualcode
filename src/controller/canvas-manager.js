;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('canvasManagerCtrl', function ($scope, $rootScope, $http, $uibModal, workSpace, userService) {
    
    var lastSavedData = workSpace.dumpData();


    $scope.getTitle = function () {
      return workSpace.data.title;
    };
    
    $scope.isChanged = function () {
      return JSON.stringify(angular.copy(lastSavedData))
        !== JSON.stringify(angular.copy(workSpace.data));
    };

    $scope.newCanvas = function () {
      workSpace.setInitData();
      lastSavedData = workSpace.dumpData();
    };

    $scope.saveCanvas = function () {
      $rootScope.$broadcast('editorCtrl.syncBreaksLine');
      workSpace.save(function () {
        lastSavedData = workSpace.dumpData();
        $scope.loadSavedCanvas();
      });
    };

    $scope.loadSavedCanvas = function () {
      userService.getUserCanvas(function (data) {
        $scope.savedCanvas = data;
      });
    };

    $scope.setSavedCanvas = function (item) {
      if (item.removing) {
        return;
      }
      userService.getCanvasData(item, function (canvas) {
        $rootScope.$broadcast('initScope');
        workSpace.data = canvas;
        $rootScope.$broadcast('editorCtrl.redrawBreakpoints');
        lastSavedData = workSpace.dumpData();
      });
    };

    $scope.removeSavedCanvas = function (item) {
      item.removing = true;
      userService.removeCanvas(item, function () {
        $scope.loadSavedCanvas();
      });
    };

    $scope.loadExamples = function () {
      $http.get('/api/examples').then(
        function success(res) {
          $scope.examples = res.data;
        }, function error() {

        });
    };

    $scope.setExample = function (item) {
      $http.get('/api/examples/' + item._id).then(
        function success(res) {
          $rootScope.$broadcast('initScope');
          workSpace.data = res.data;
          $rootScope.$broadcast('editorCtrl.redrawBreakpoints');
          lastSavedData = workSpace.getInitData();
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