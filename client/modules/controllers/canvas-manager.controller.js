import angular from 'angular';

export default class CanvasManagerCtrl {

  constructor($scope, $state, $uibModal, $templateCache, $http,
    CanvasRepository, UserService) {
    'ngInject';

    UserService.regist();

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
      UserService.getCanvasList()
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
      var repo = new CanvasRepository(item);
      repo.getData()
      .then(function () {
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
      $http.get('/api/examples')
      .then(function (res) {
        $scope.examples = res.data;
      });
    };


    $scope.setExample = function (item) {
      $http.get('/api/examples/' + item._id)
      .then(function (res) {
        $scope.canvasRepo = new CanvasRepository();
        $scope.lastSavedDump = JSON.stringify($scope.canvasRepo.data);
        $scope.canvasRepo.data = res.data;
        $scope.currentCanvas = $scope.canvasRepo.data;
        $scope.$broadcast('changedCurrentCanvas');
        $state.go('home.editor');
      })
      .catch (function () {
        $scope.loadExamples();
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
