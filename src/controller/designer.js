;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('designerCtrl', function ($scope, $http, $uibModal, workSpace) {
    $scope.loadDrawApiList = function () {
      $http.get('/api/drawapis').then(
        function success(res) {
          $scope.drawApiList = res.data;
        }, function err() {

        });
    };

    if (!workSpace.data.drawapis) {
      workSpace.data.drawapis = [];
    }

    $scope.myDrawItems = workSpace.data.drawapis;

    $scope.addDrawItem = function (type) {
      var myDrawItems = $scope.myDrawItems;

      var newitem = {
        id: type,
        type: type,
        apis: {}
      };

      var surfix = 1;
      while (myDrawItems.some(function (item) {
        return item.id === newitem.id;
      })) {
        newitem.id = type + surfix++;
      }

      myDrawItems.push(newitem);
      $scope.selectItem(newitem);
    };

    $scope.selectItem = function (item) {
      $scope.selectedItem = item;
    };

    $scope.removeItem = function (item, idx) {
      if ($scope.selectedItem === item) {
        delete $scope.selectedItem;
      }

      $scope.myDrawItems.splice(idx, 1);
    };

    $scope.openAddDrawApiModal = function (api, draw) {
      var modalInstance = $uibModal.open({
        templateUrl: 'add-drawapi-modal.html',
        controller: 'drawApiModalCtrl',
        resolve: {
          api: function () {
            return api;
          },
          input: function () {
            if (draw) {
              return draw.params;
            }
          }
        }
      });

      modalInstance.result.then(
        function success(output) {
          if (draw) {
            draw.params = output;
          }
          else {
            if (!$scope.selectedItem.apis[$scope.selectedLine]) {
              $scope.selectedItem.apis[$scope.selectedLine] = [];
            }
            
            $scope.selectedItem.apis[$scope.selectedLine].push({
              api: api,
              params: output
            });
          }
        }, function dismissed() {

        });
    };

    $scope.drawApiToString = function (draw) {
      var str = draw.api.name;
      str += "(";
      for (var key in draw.params) {
        str += draw.params[key];
        str += ", ";
      }
      str = str.substring(0, str.length - 2);
      str += ")";
      return str;
    };

    $scope.removeDrawApi = function (draw) {
      $scope.selectedItem.apis[$scope.selectedLine].splice($scope.selectedItem.apis[$scope.selectedLine].indexOf(draw), 1);
    };

  });


  app.controller('drawApiModalCtrl', function ($scope, $uibModalInstance, api, input) {
    $scope.api = api;
    $scope.output = {};
    if (input) {
      angular.copy(input, $scope.output);
      $scope.modify = true;
    }
    

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

