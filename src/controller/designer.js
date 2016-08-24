;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('designerCtrl', function ($scope, $http, $uibModal, workSpace) {

    $scope.$on('initScope', function () {
      delete $scope.selectedStructure;
    });

    $scope.loadDrawApiList = function () {
      $http.get('/api/drawapis').then(
        function success(res) {
          $scope.drawApiList = res.data;
        }, function err() {

        });
    };


    $scope.getStructures = function () {
      return workSpace.data.structures;
    };


    $scope.addStructure = function (type) {
      var structures = workSpace.data.structures;
      var item = {
        id: type,
        type: type
      };

      var surfix = 1;
      while (structures.some(function (s) {
        return s.id == item.id;
      })) {
        item.id = type + surfix++;
      }

      structures.push(item);
      $scope.selectStructure(item);
    };


    $scope.selectStructure = function (item) {
      $scope.selectedStructure = item;
    };


    $scope.removeStructure = function (item) {
      var structures = workSpace.data.structures;
      structures.splice(structures.indexOf(item), 1);
      
      workSpace.data.breaks.forEach(function (bp) {
        var temp = [];
        bp.draws.forEach(function (draw) {
          if (draw.structure.id === item.id) {
            return;
          }
          temp.push(draw);
        });
        bp.draws = temp;
      });

      if ($scope.selectedStructure == item) {
        delete $scope.selectedStructure;
      }
    };


    $scope.drawListFilter = function (item) {
      if (!$scope.selectedStructure || !item) {
        return false;
      }
      return $scope.selectedStructure.id === item.structure.id;
    };
    
    $scope.openAddDrawApiModal = function (api) {
      var structure = $scope.selectedStructure;
      var breakpoint = $scope.selectedBreakpoint;

      var modalInstance = $uibModal.open({
        templateUrl: 'drawapi-modal.html',
        controller: 'drawApiModalCtrl',
        resolve: {
          resolve: function () {
            return {
              api: api
            };
          }
        }
      });

      modalInstance.result.then(
        function success(output) {
          var draw = {
            structure: structure,
            api: api,
            data: output
          }
          breakpoint.draws.push(draw);
        }, function dismissed() {

        });
    };


    $scope.openModifyDrawApiModal = function (draw) {
      var structure = $scope.selectedStructure;
      var breakpoint = $scope.selectedBreakpoint;

      var modalInstance = $uibModal.open({
        templateUrl: 'drawapi-modal.html',
        controller: 'drawApiModalCtrl',
        resolve: {
          resolve: function () {
            return {
              api: draw.api,
              data: draw.data
            };
          }
        }
      });

      modalInstance.result.then(
        function success(output) {
          draw.data = output;
        }, function dismissed() {

        });
    };


    $scope.drawApiToString = function (draw) {
      var str = draw.api.name;
      str += "(";
      for (var key in draw.data) {
        str += draw.data[key];
        str += ", ";
      }
      str = str.substring(0, str.length - 2);
      str += ")";
      return str;
    };


    $scope.removeDrawApi = function (draw) {
      var draws = $scope.selectedBreakpoint.draws;
      draws.splice(draws.indexOf(draw), 1);  
    };


    $scope.removeBreakpoint = function () {
      $scope.$parent.removeBreakpoint($scope.selectedBreakpoint);
    };

  });

  
  
  app.controller('drawApiModalCtrl', function ($scope, $uibModalInstance, resolve) {
    $scope.api = resolve.api;

    if (resolve.data) {
      $scope.modify = true;
    }

    $scope.output = {};
    angular.copy(resolve.data, $scope.output);


    $scope.save = function () {
      var requires = [];
      var error = false;
      
      $scope.api.params.forEach(function (param) {
        if (!$scope.output[param.name]) {
          if (param.optional) {
            delete $scope.output[param.name];
          }
          else {
            error = true;
            requires.push(param.name);
          }
        }
      })

      if (error) {
        $scope.requires = requires;
        return;
      }

      $uibModalInstance.close($scope.output);
    };

    $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
    };
  });
  
})(angular);

