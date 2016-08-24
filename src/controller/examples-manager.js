;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('examplesManagerCtrl', function ($scope, $rootScope, $http, $uibModal, workSpace, userService) {
    
    var lastSavedData = workSpace.dumpData();


    function getTitle() {
      return workSpace.data.title;
    }
    
    
    function isChanged() {
      return JSON.stringify(angular.copy(lastSavedData)) !==
       JSON.stringify(angular.copy(workSpace.data));
    }


    function isActiveItem(item) {
      return item._id === workSpace.data._id;
    }


    function newCanvas() {
      workSpace.setInitData();
      lastSavedData = workSpace.dumpData();
    }
    

    function saveCanvas() {
      $rootScope.$broadcast('editorCtrl.syncBreaksLine');
      workSpace.save(function () {
        lastSavedData = workSpace.dumpData();
        loadExamples();
      });
    }


    function loadExamples() {
      userService.getUserCanvas(function (data) {
        $scope.examples = data;
      });
    }
    

    function setExample(item) {
      if (item.removing) {
        return;
      }
      userService.getCanvasData(item, function (canvas) {
        $rootScope.$broadcast('initScope');
        workSpace.data = canvas;
        $rootScope.$broadcast('editorCtrl.redrawBreakpoints');
        lastSavedData = workSpace.dumpData();
      });
    }


    function removeExample(item) {
      item.removing = true;
      userService.removeCanvas(item, function () {
        if (item._id == workSpace.data._id) {
          newCanvas();
        }
        loadExamples();
      });
    }


    function openSaveModal() {
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
        saveCanvas();
      }, function () {

      });
    }



    $scope.getTitle = getTitle;
    $scope.isChanged = isChanged;
    $scope.isActiveItem = isActiveItem;
    $scope.newCanvas = newCanvas;
    $scope.saveCanvas = saveCanvas;
    $scope.loadExamples = loadExamples;
    $scope.setExample = setExample;
    $scope.removeExample = removeExample;
    $scope.openSaveModal = openSaveModal;

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