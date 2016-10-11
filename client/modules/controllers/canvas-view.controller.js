import angular from 'angular';
import thisplay from 'alizzwell/thisplay';
import 'alizzwell/thisplay/dist/thisplay.min.css!';


export default class CanvasViewCtrl {

  constructor($scope, $stateParams, $element, $document,
    $compile, VicoCodeMirror) {
    'ngInject';

    var structures;
    var schedule;
    var idx;
    var design;
    var breakpoints;

    $scope.editor;

    $scope.cmOptions = {
      mode: 'text/x-c++src',
      tabSize: 2,
      indentWithTabs: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      readOnly: true,
      gutters: ['CodeMirror-linenumbers', 'breakpoints']
    };



    $document.unbind('keydown', $document.kkeydown);
    $document.kkeydown = function (event) {
      if (event.key === 'Delete' && $scope.selectedGutter) {
        $scope.editor.removeGutterMarker($scope.selectedGutter);
        delete breakpoints[$scope.selectedGutterLine];
        delete $scope.selectedGutter;
      }
    };
    $document.on('keydown', $document.kkeydown);


    $scope.cmLoadded = function (cm) {
      $scope.editor = new VicoCodeMirror(cm);

      cm.on('change', function () {
        for (var line in breakpoints) {
          $scope.editor.setGutterMarker(Number(line) - 1, '●');
        }
      });

      cm.on('gutterClick', function (cm, line) {
        var gutter = $scope.editor.getGutterMarker(line);

        if (!gutter) {
          gutter = $scope.editor.setGutterMarker(line, '●');
          breakpoints[line + 1] = true;
        }
        selectGutterMarker(gutter, line);
      });

      cm.on('mousedown', function (cm, event) {
        if (event.target.className.indexOf('gutter') > -1 ||
          event.target.className.indexOf('breakpoint') > -1) {
          return;
        }
        event.preventDefault();
      });
    };


    function selectGutterMarker(gutter, line) {
      $scope.selectedGutter = gutter;
      $scope.selectedGutterLine = line + 1;
      $scope.editor.getEachGutterMarkers(function (gm) {
        if (gm.breakpoints) {
          gm.breakpoints.setAttribute('class', 'breakpoint');
        }
      });
      gutter.breakpoints.setAttribute('class', 'breakpoint active');
    }


    $scope.initCanvas = function () {
      if (!$stateParams.data) {
        return;
      }
      var data = $stateParams.data;

      structures = {};
      schedule = data.result;
      design = data.design;
      idx = 0;
      breakpoints = {};

      var topelement = angular.element(
        $element[0].querySelector('#resizer-top-content'));
      topelement.html('');

      for (var id in design.structures) {
        var canvas = angular.element(
          '<div class="flubber resizable" ' +
          'flubber-draggable flubber-resizable>' +
            '<svg id="' + id + '" ' + '</svg>' +
          '</div>');
        topelement.append(canvas);
        $compile(canvas)($scope);
      }


      for (var _id in design.structures) {
        structures[_id] = new thisplay[design.structures[_id]]('#' + _id);
      }

      for (var line in design.draws) {
        breakpoints[line] = true;
      }

      $scope.code = data.code;
    };


    $scope.btnStepClk = function () {
      var step = schedule[idx++];
      $scope.editor.codemirror.setCursor(step.line - 1);
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
        if (breakpoints[step.line]) {
          break;
        }
      }

      if (step) {
        $scope.editor.codemirror.setCursor(step.line - 1);
      }
    };
  }
}
