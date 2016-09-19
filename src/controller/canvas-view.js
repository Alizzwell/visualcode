;(function (angular, thisplay) {
  'use strict';

  var app = angular.module('visualcodeApp');

  app.controller('canvasViewCtrl', function ($scope, $element, $compile) {

    var structures;
    var schedule;
    var idx;
    var editor;
    var design;

    $scope.cmOptions = {
      mode: "text/x-c++src",
      tabSize: 2,
      indentWithTabs: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      readOnly: true,
      gutters: ["CodeMirror-linenumbers", "breakpoints"]
    };

    $scope.cmLoadded = function (cm) {
      editor = cm;
    };

    $scope.$on('canvasViewCtrl.load', function (event, data) {
      structures = {};
      schedule = data.result;
      design = data.design;
      idx = 0;

      var topelement = angular.element(
        $element[0].querySelector('#resizer-top-content'));

      topelement.html('');

      for (var id in data.design.structures) {
        var canvas = angular.element('<svg ' + 
          'id="' + id + '" ' +
          'style="width: 100%; height: 100%;"></svg>');
        topelement.append(canvas);
        $compile(canvas)($scope);
      }

      for (var id in data.design.structures) {
        structures[id] = new thisplay.Chart('#' + id);
      }

      $scope.code = data.code;
    });


    $scope.btnStepClk = function () {
      var step = schedule[idx++];
      editor.setCursor(step.line - 1);
      var draws = step.draws;
      if (!draws) {
        return;
      }
      for (var id in draws) {
        draws[id].forEach(function (api) {
          structures[id][api.name].apply(structures[id], api.values);
        });
      }
    };

    $scope.btnNextClk = function () {
      var step;
      var draws;
      
      while (idx < schedule.length) {
        step = schedule[idx++];
        draws = step.draws;
        if (draws) {
          for (var id in draws) {
            draws[id].forEach(function (api) {
              structures[id][api.name].apply(structures[id], api.values);
            });
          }          
        }
        if (design.draws[step.line]) {
          break;
        }
      }

      if (step) {
        editor.setCursor(step.line - 1);
      }
    };

  });
})(angular, thisplay);
