import angular from 'angular';

export default class DesignerCtrl {

  constructor($scope, $http, $uibModal, $templateCache) {
    'ngInject';


    $scope.loadDrawApiList = function() {
      $http.get('/api/drawapis')
      .then(function (res) {
        $scope.drawApiList = res.data;
      });
    };


    $scope.addStructure = function(type) {
      var structures = $scope.currentCanvas.structures;
      var item = {
        id: type,
        type: type
      };

      function test(s) {
        return s.id == item.id;
      }
      var surfix = 1;
      while (structures.some(test)) {
        item.id = type + surfix++;
      }

      structures.push(item);
      $scope.selectStructure(item);
    };


    $scope.selectStructure = function (item) {
      $scope.selectedStructure = item;
    };


    $scope.removeStructure = function (item) {
      var structures = $scope.currentCanvas.structures;
      structures.splice(structures.indexOf(item), 1);

      $scope.editor.getEachGutterMarkers(function (gm) {
        if (!gm.draws) {
          return;
        }
        var temp = [];
        gm.draws.forEach(function (draw) {
          if (draw.structure.id === item.id) {
            return;
          }
          temp.push(draw);
        });
        gm.draws = temp;
      });

      $scope.syncBreaksToCurrentCanvas();

      if ($scope.selectedStructure === item) {
        delete $scope.selectedStructure;
      }
    };


    $scope.openAddDrawApiModal = function (api) {
      var structure = $scope.selectedStructure;
      var gutter = $scope.selectedGutter;

      var modalInstance = $uibModal.open({
        template: $templateCache.get(
          'modal/drawapi-modal.tpl.html'),
        controller: DrawApiModalCtrl,
        resolve: {
          api: function () {
            return api;
          }
        }
      });

      modalInstance.result
      .then(function success(output) {
        var draw = {
          structure: structure,
          api: output
        };
        gutter.draws.push(draw);
        $scope.syncBreaksToCurrentCanvas();
      }, function dismissed() {

      });
    };


    $scope.drawListFilter = function (item) {
      if (!$scope.selectedStructure || !item) {
        return false;
      }
      return $scope.selectedStructure.id === item.structure.id;
    };


    $scope.drawApiToString = function (draw) {
      var str = draw.api.name;

      if (draw.api.params.length === 1 && 
        !draw.api.params[0].value) {
        return str + '()';
      }

      str += '(';
      draw.api.params.forEach(function (param) {
        if (param.value) {
          str += param.value;
          str += ', ';
        }
      });
      str = str.substring(0, str.length - 2);
      str += ')';
      return str;
    };


    $scope.removeDrawApi = function (draw) {
      var draws = $scope.selectedGutter.draws;
      draws.splice(draws.indexOf(draw), 1);
      $scope.syncBreaksToCurrentCanvas();
    };


    $scope.openModifyDrawApiModal = function (draw) {
      var modalInstance = $uibModal.open({
        template: $templateCache.get(
          'modal/drawapi-modal.tpl.html'),
        controller: DrawApiModalCtrl,
        resolve: {
          api: function () {
            return draw.api;
          }
        }
      });

      modalInstance.result
      .then(function success(output) {
        draw.api = output;
        $scope.syncBreaksToCurrentCanvas();
      }, function dismissed() {

      });
    };


    function DrawApiModalCtrl($scope, $uibModalInstance, api) {
      $scope.api = angular.copy(api);

      $scope.save = function () {
        $scope.error = false;
        $scope.api.params.forEach(function (param) {
          if (!param.optional && !param.value) {
            $scope.error = true;
          }
        });

        if ($scope.error) {
          return;
        }

        $uibModalInstance.close($scope.api);
      };

      $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
      };
    }


    $scope.$on('changedCurrentCanvas', function () {
      delete $scope.selectedStructure;
    });
  }
}
