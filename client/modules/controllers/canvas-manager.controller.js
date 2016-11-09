import angular from 'angular';

export default class CanvasManagerCtrl {

  constructor($scope, $state, $uibModal, $templateCache, $http, $window, 
    CanvasRepository, CanvasService, ExampleService, userType) {
    'ngInject';

    $scope.userType =userType;


    $scope.initCanvas = function () {
      $scope.canvasRepo = new CanvasRepository();
      $scope.currentCanvas = $scope.canvasRepo.data;
      $scope.lastSavedDump = JSON.stringify($scope.currentCanvas);
      $scope.$broadcast('changedCurrentCanvas');
    };


    $scope.newCanvas = function () {
      $scope.initCanvas();
      $state.go('home.editor');
    };


    $scope.isChanged = function () {
      return $scope.lastSavedDump !==
      JSON.stringify(angular.copy($scope.currentCanvas));
    };


    $scope.isActiveItem = function (item) {
      return item._id === $scope.currentCanvas._id;
    };


    $scope.saveCanvas = function () {
      $scope.canvasRepo.save()
        .then(function () {
          $scope.currentCanvas = $scope.canvasRepo.data;
          $scope.lastSavedDump =
          JSON.stringify(angular.copy($scope.currentCanvas));
          $scope.loadSavedCanvas();
        })
        .catch(function () {
        });
    };


    $scope.loadSavedCanvas = function () {
      CanvasService.getCanvasList()
      .then(function (data) {
        $scope.savedCanvas = data;
      })
      .catch(function () {
      });
    };


    $scope.setSavedCanvas = function (item) {
      if (item.removing) {
        return;
      }
      
      CanvasService.getCanvas(item._id)
      .then(function (data) {
        var repo = new CanvasRepository(data);
        $scope.canvasRepo = repo;
        $scope.currentCanvas = repo.data;
        $scope.lastSavedDump = JSON.stringify($scope.currentCanvas);
        $state.go('home.editor');
        $scope.$broadcast('changedCurrentCanvas');
      })
      .catch(function () {
      });
    };


    $scope.removeSavedCanvas = function (item) {
      item.removing = true;
      var repo = new CanvasRepository(item);
      repo.remove()
      .then(function () {
        $scope.loadSavedCanvas();
        if (item._id === $scope.currentCanvas._id) {
          $scope.newCanvas();
        }
      })
      .catch(function () {
        delete item.removing;
      });
    };


    $scope.loadExamples = function () {
      ExampleService.getExampleList()
      .then(function (data) {
        $scope.examples = data;
      })
      .catch(function () {
      });
    };


    $scope.setExample = function (item) {
      ExampleService.getExample(item._id)
      .then(function (data) {
        $scope.canvasRepo = new CanvasRepository();
        $scope.lastSavedDump = JSON.stringify($scope.canvasRepo.data);
        $scope.canvasRepo.data = data;
        $scope.currentCanvas = $scope.canvasRepo.data;
        $scope.$broadcast('changedCurrentCanvas');
        $state.go('home.editor');
      })
      .catch(function () {
      });
    };


    $scope.uploadCanvas = function () {
      $scope.canvasRepo.upload()
        .then(function (data) {
          $scope.canvasListOpen = false;
          $state.go('home.viewer', {data: data});
        })
        .catch(function () {
        });
    };


    $scope.logout = function () {
      $http.post('/api/logout')
        .then(function () {
          $window.location.reload();
        })
        .catch(function () {
        });
    };


    $scope.openSaveModal = function () {
      var modalInstance = $uibModal.open({
        template: $templateCache.get('modal/save-modal.tpl.html'),
        resolve: {
          title: function () {
            return $scope.currentCanvas.title;
          }
        },
        controller: function ($scope, $uibModalInstance, title) {
          $scope.title = title;

          $scope.save = function () {
            $uibModalInstance.close($scope.title);
          };

          $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
          };
        }
      });

      modalInstance.result.then(function (title) {
        $scope.currentCanvas.title = title;
        $scope.saveCanvas();
      }, function () {

      });
    };
  }
}
