;(function (angular) {
  'use strict';

  var app = angular.module('visualcodeApp');

  app.controller('canvasManagerCtrl', function ($scope, $http,
    $uibModal, workSpace, userService) {

    var lastSavedData = workSpace.dumpData();
    $scope.containerMode = 'editor';


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
      openEditor();
      $scope.$broadcast('initScope');
      workSpace.setInitData();
      lastSavedData = workSpace.dumpData();
    }


    function saveCanvas() {
      $scope.$broadcast('editorCtrl.syncBreaksLine');
      workSpace.save(function () {
        $scope.$broadcast('editorCtrl.redrawBreakpoints');
        lastSavedData = workSpace.dumpData();
        loadSavedCanvas();
      });
    }


    function loadSavedCanvas() {
      userService.getUserCanvas(function (data) {
        $scope.savedCanvas = data;
      });
    }


    function setSavedCanvas(item) {
      if (item.removing) {
        return;
      }
      userService.getCanvasData(item, function (canvas) {
        openEditor();
        $scope.$broadcast('initScope');
        workSpace.data = canvas;
        $scope.$broadcast('editorCtrl.redrawBreakpoints');
        lastSavedData = workSpace.dumpData();
      });
    }


    function removeSavedCanvas(item) {
      item.removing = true;
      userService.removeCanvas(item, function () {
        if (item._id == workSpace.data._id) {
          newCanvas();
        }
        loadSavedCanvas();
      });
    }


    function loadExamples() {
      $http.get('/api/examples').then(
        function success(res) {
          $scope.examples = res.data;
        }, function error() {

        });
    }


    function setExample(item) {
      $http.get('/api/examples/' + item._id).then(
        function success(res) {
          openEditor();
          $scope.$broadcast('initScope');
          workSpace.data = res.data;
          $scope.$broadcast('editorCtrl.redrawBreakpoints');
          lastSavedData = workSpace.getInitData();
        }, function err() {
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


    function isEditor() {
      return $scope.containerMode == 'editor';
    }

    function openEditor() {
      $scope.containerMode = 'editor'
    }

    function isView() {
      return $scope.containerMode == 'view';
    }

    function openView() {
      $scope.containerMode = 'view';
    }


    function upload() {
      $scope.$broadcast('editorCtrl.syncBreaksLine');
      workSpace.upload(function (err, data) {
        if (err) {
          // error handle
          console.log(err);
          return;
        }
        $scope.$broadcast('canvasViewCtrl.load', data);
        openView();
      });
    }


    $scope.getTitle = getTitle;
    $scope.isChanged = isChanged;
    $scope.isActiveItem = isActiveItem;
    $scope.newCanvas = newCanvas;
    $scope.saveCanvas = saveCanvas;
    $scope.loadSavedCanvas = loadSavedCanvas;
    $scope.setSavedCanvas = setSavedCanvas;
    $scope.removeSavedCanvas = removeSavedCanvas;
    $scope.loadExamples = loadExamples;
    $scope.setExample = setExample;
    $scope.openSaveModal = openSaveModal;
    $scope.isEditor = isEditor;
    $scope.openEditor = openEditor;
    $scope.isView = isView;
    $scope.openView = openView;
    $scope.upload = upload;

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
