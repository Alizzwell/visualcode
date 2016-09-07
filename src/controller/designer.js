;(function (angular) {
  'use strict';
  
  var app = angular.module('visualcodeApp');

  app.controller('designerCtrl', function ($scope, $http, $uibModal, workSpace) {

    $scope.$on('initScope', function () {
      delete $scope.selectedStructure;
    });


    function loadDrawApiList() {
      $http.get('/api/drawapis').then(
        function success(res) {
          $scope.drawApiList = res.data;
        }, function err() {

        });
    }
    

    function getStructures() {
      return workSpace.data.structures;
    }


    function addStructure(type) {
      var structures = workSpace.data.structures;
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
      selectStructure(item);
    }
    

    function selectStructure(item) {
      $scope.selectedStructure = item;
    }
    

    function removeStructure(item) {
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
    }


    function drawListFilter(item) {
      if (!$scope.selectedStructure || !item) {
        return false;
      }
      return $scope.selectedStructure.id === item.structure.id;
    }

    
    function openAddDrawApiModal(api) {
      var structure = $scope.selectedStructure;
      var breakpoint = $scope.selectedBreakpoint;

      var modalInstance = $uibModal.open({
        templateUrl: 'drawapi-modal.html',
        controller: 'drawApiModalCtrl',
        resolve: {
          api: function () {
            return api;
          }
        }
      });

      modalInstance.result.then(
        function success(output) {
          var draw = {
            structure: structure,
            api: output
          };
          breakpoint.draws.push(draw);
        }, function dismissed() {

        });
    }
    

    function openModifyDrawApiModal(draw) {
      var structure = $scope.selectedStructure;
      var breakpoint = $scope.selectedBreakpoint;

      var modalInstance = $uibModal.open({
        templateUrl: 'drawapi-modal.html',
        controller: 'drawApiModalCtrl',
        resolve: {
          api: function () {
            return draw.api;
          }
        }
      });

      modalInstance.result.then(
        function success(output) {
          draw.api = output;
        }, function dismissed() {

        });
    }


    function drawApiToString(draw) {
      var str = draw.api.name;
      
      if (draw.api.params.length === 0) {
        return str + "()";
      }

      str += "(";
      draw.api.params.forEach(function (param) {
        if (param.value) {
          str += param.value;
          str += ", ";
        }
      });
      str = str.substring(0, str.length - 2);
      str += ")";
      return str;
    }


    function removeDrawApi(draw) {
      var draws = $scope.selectedBreakpoint.draws;
      draws.splice(draws.indexOf(draw), 1);  
    }


    function removeBreakpoint() {
      $scope.$parent.removeBreakpoint($scope.selectedBreakpoint);
    }



    $scope.loadDrawApiList = loadDrawApiList;
    $scope.getStructures = getStructures;
    $scope.addStructure = addStructure;
    $scope.selectStructure = selectStructure;
    $scope.removeStructure = removeStructure;
    $scope.drawListFilter = drawListFilter;
    $scope.openAddDrawApiModal = openAddDrawApiModal;
    $scope.openModifyDrawApiModal = openModifyDrawApiModal;
    $scope.drawApiToString = drawApiToString;
    $scope.removeDrawApi = removeDrawApi;
    $scope.removeBreakpoint = removeBreakpoint;

  });

  
  
  app.controller('drawApiModalCtrl', function ($scope, $uibModalInstance, api) {
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
  });
  
})(angular);

