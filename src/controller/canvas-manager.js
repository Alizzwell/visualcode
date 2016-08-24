;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('canvasManagerCtrl', function ($scope, $rootScope, $http, $uibModal, workSpace, userService) {
    
    var lastSavedData = workSpace.dumpData();


    function getTitle() {
      return workSpace.data.title;
    };
    
    
    function isChanged() {
      return JSON.stringify(angular.copy(lastSavedData)) !==
       JSON.stringify(angular.copy(workSpace.data));
    };


    function newCanvas() {
      workSpace.setInitData();
      lastSavedData = workSpace.dumpData();
    };
    

    function saveCanvas() {
      $rootScope.$broadcast('editorCtrl.syncBreaksLine');
      workSpace.save(function () {
        lastSavedData = workSpace.dumpData();
        loadSavedCanvas();
      });
    };


    function loadSavedCanvas() {
      userService.getUserCanvas(function (data) {
        $scope.savedCanvas = data;
      });
    };
    

    function setSavedCanvas(item) {
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


    function removeSavedCanvas(item) {
      item.removing = true;
      userService.removeCanvas(item, function () {
        loadSavedCanvas();
      });
    };


    function loadExamples() {
      $http.get('/api/examples').then(
        function success(res) {
          $scope.examples = res.data;
        }, function error() {

        });
    };
    

    function setExample(item) {
      $http.get('/api/examples/' + item._id).then(
        function success(res) {
          $rootScope.$broadcast('initScope');
          workSpace.data = res.data;
          $rootScope.$broadcast('editorCtrl.redrawBreakpoints');
          lastSavedData = workSpace.getInitData();
        }, function err() {

        });
    };


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
    };



    $scope.getTitle = getTitle;
    $scope.isChanged = isChanged;
    $scope.newCanvas = newCanvas;
    $scope.saveCanvas = saveCanvas;
    $scope.loadSavedCanvas = loadSavedCanvas;
    $scope.setSavedCanvas = setSavedCanvas;
    $scope.removeSavedCanvas = removeSavedCanvas;
    $scope.loadExamples = loadExamples;
    $scope.setExample = setExample;
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