;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('canvasManagerCtrl', function ($scope, $http, $uibModal, workSpace) {
    $scope.lastSavedData = {};
    
    $scope.newCanvas = function () {
      workSpace.setData({});
      $scope.lastSavedData = {};
    };

    $scope.getTitle = function () {
      return workSpace.getData().title;
    };

    $scope.getSavedCanvas = function () {
      return workSpace.savedCanvas;
    };

    $scope.setSavedCanvas = function (item) {
      workSpace.setData(item);
      $scope.lastSavedData = item;
    };

    $scope.saveCanvas = function () {
      workSpace.save();
      $scope.lastSavedData = workSpace.getData();
    };

    $scope.isChanged = function () {
      return !angular.equals(workSpace.data, $scope.lastSavedData);
    };

    $scope.removeSavedCanvas = function (item) {
      workSpace.removeSavedCanvas(item.id);
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
          $scope.lastSavedData = {};
        }, function err() {

        });
    };

    $scope.openModal = function () {
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

  // TODO: delete
  var examples = [{
    id: 1,
    title: "Bubble Sort",
    code: "#include <stdio.h>\n\nint main() {\n\tprintf(\"Bubble Sort\");\n\treturn 0;\n}",
    date: new Date().getTime(),
    input: "",
    designer: {}
  },
  {
    id: 2,
    title: "DFS Searching",
    code: "#include <stdio.h>\n\nint main() {\n\tprintf(\"DFS Searching\");\n\treturn 0;\n}",
    date: new Date().getTime(),
    input: "",
    designer: {}
  },
  {
    id: 3,
    title: "BFS Searching",
    code: "#include <stdio.h>\n\nint main() {\n\tprintf(\"BFS Searching\");\n\treturn 0;\n}",
    date: new Date().getTime(),
    input: "",
    designer: {}
  }];

})(angular);