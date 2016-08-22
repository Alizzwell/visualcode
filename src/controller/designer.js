;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('designerCtrl', function ($scope, $http, $uibModal, workSpace) {

    $scope.structures = workSpace.data.structures; 
    $scope.selected = workSpace.selected;
    
    $scope.loadDrawApiList = function () {
      $http.get('/api/drawapis').then(
        function success(res) {
          $scope.drawApiList = res.data;
        }, function err() {

        });
    };

    $scope.addItem = function (type) {
      var id = type;
      var surfix = 1;
      while ($scope.structures[id]) {
        id = type + surfix++;
      }
      
      $scope.structures[id] = type;
      $scope.selectItem(id);
      workSpace.isChanged = true;
    };

    $scope.selectItem = function (id) {
      workSpace.selected.ItemId = id;
    };

    $scope.removeItem = function (id) {
      if (workSpace.selected.ItemId === id) {
        delete workSpace.selected.ItemId;
      }
      delete $scope.structures[id];
      workSpace.data.breaks.forEach(function (bp, idx) {
        if (bp.draws[id]) {
          delete bp.draws[id];
        }
      });
      workSpace.isChanged = true;
    };

    
    $scope.openAddDrawApiModal = function (api) {
      var struct_id = workSpace.selected.ItemId;
      var breakpoint = workSpace.selected.breakpoint;

      var modalInstance = $uibModal.open({
        templateUrl: 'add-drawapi-modal.html',
        controller: 'drawApiModalCtrl',
        resolve: {
          api: function () {
            return api;
          }
        }
      });

      modalInstance.result.then(
        function success(output) {
          if (!breakpoint.draws[struct_id]) {
            breakpoint.draws[struct_id] = [];
          }
          breakpoint.draws[struct_id].push({
            api: api,
            data: output
          });
          workSpace.isChanged = true;
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
      var draws = workSpace.selected.breakpoint.draws[workSpace.selected.ItemId];
      draws.splice(draws.indexOf(draw), 1);  
      workSpace.isChanged = true;
    };

    $scope.removeBp = function () {
      $scope.removeBreakpoint(workSpace.selected.breakpoint);
      delete workSpace.selected.breakpoint;
    };
    
  });

  
  app.controller('drawApiModalCtrl', function ($scope, $uibModalInstance, api) {
    $scope.api = api;
    $scope.output = {};

    $scope.modify = false;

    $scope.add = function () {
      var requires = [];
      var error = false;
      
      api.params.forEach(function (param) {
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

