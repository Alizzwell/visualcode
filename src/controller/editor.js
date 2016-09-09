;(function (angular) {
  'use strict';

  var app = angular.module('visualcodeApp');

  app.controller('editorCtrl', function ($scope, $http, workSpace) {

    var editor;

    $scope.workspace = workSpace;
    $scope.theme = 'default';
    $scope.themes = ['default', 'bespin', 'blackboard', 'cobalt',
    'dracula', 'eclipse', 'erlang-dark', 'the-matrix', 'zenburn'];

    $scope.cmOptions = {
      mode: "text/x-c++src",
      tabSize: 2,
      indentWithTabs: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      gutters: ["CodeMirror-linenumbers", "breakpoints"]
    };


    $scope.$on('initScope', function () {
      delete $scope.selectedBreakpoint;
    });


    $scope.$on('editorCtrl.syncBreaksLine', function () {
      getEachBreakpointOnEditor(function (bp, line) {
        bp.line = line;
      });
    });


    $scope.$on('editorCtrl.redrawBreakpoints', function () {
      editor.clearGutter('breakpoints');
      editor.setValue(workSpace.data.code);
      workSpace.data.breaks.forEach(function (bp, i) {
        var _bp = makeBreakpoint(bp.line);
        _bp.draws = bp.draws;
        workSpace.data.breaks[i] = _bp;
      });

      if ($scope.selectedBreakpoint) {
        selectBreakpoint(getBreakpoint($scope.selectedBreakpoint.line));
      }
    });


    function selectTheme(theme) {
      $scope.theme = theme;
      editor.setOption("theme", theme);
    }


    function cmLoadded(cm) {
      editor = cm;

      editor.on("gutterClick", function(cm, n) {
        var bp = getBreakpoint(n);

        if (!bp) {
          bp = makeBreakpoint(n);
          workSpace.data.breaks.push(bp);
        }

        selectBreakpoint(bp);

        $scope.designerOpen = true;
        $scope.$apply();
      });

      editor.on('keyup', function () {
        if ($scope.selectedBreakpoint) {
          var isOnTheEditor = false;
          getEachBreakpointOnEditor(function (bp, line) {
            bp.line = line;
            if (bp === $scope.selectedBreakpoint) {
              isOnTheEditor = true;
            }
          });

          if (!isOnTheEditor) {
            var breaks = workSpace.data.breaks;
            breaks.splice(
              breaks.indexOf($scope.selectedBreakpoint), 1);
            delete $scope.selectedBreakpoint;
            $scope.$apply();
          }
        }
      });
    }


    function getBreakpoint(line) {
      var info = editor.lineInfo(line);
      if (!info) {
        return;
      }
      if (!info.gutterMarkers) {
        return;
      }
      if (!info.gutterMarkers.breakpoints) {
        return;
      }
      return info.gutterMarkers;
    }


    function makeBreakpoint(line) {
      var marker = document.createElement("div");
      marker.setAttribute("class", "breakpoint");
      marker.innerHTML = "●";
      editor.setGutterMarker(line, "breakpoints", marker);
      var bp = editor.lineInfo(line).gutterMarkers;
      bp.line = line;
      bp.draws = [];
      return bp;
    }


    function selectBreakpoint(bp) {
      $scope.selectedBreakpoint = bp;

      getEachBreakpointOnEditor(function (_bp) {
        _bp.breakpoints.setAttribute("class", "breakpoint");
      });
      bp.breakpoints.setAttribute("class", "breakpoint active");
    }


    function getEachBreakpointOnEditor(callback) {
      for (var i = editor.firstLine(); i <= editor.lastLine(); i++) {
        var bp = getBreakpoint(i);
        if (bp) {
          callback(bp, i);
        }
      }
    }


    function removeBreakpoint(bp) {
      workSpace.data.breaks.splice(
        workSpace.data.breaks.indexOf(bp), 1);
      editor.setGutterMarker(getLineOnEditor(bp),
        "breakpoints", null);
      if ($scope.selectedBreakpoint === bp) {
        delete $scope.selectedBreakpoint;
      }
    }


    function getLineOnEditor(bp) {
      for (var i = editor.firstLine(); i <= editor.lastLine(); i++) {
        if (getBreakpoint(i) === bp) {
          return i;
        }
      }
      return -1;
    }


    function upload() {
        getEachBreakpointOnEditor(function (bp, line) {
          bp.line = line;
        });

        workSpace.upload(function (err, data) {
          if (err) {
            // error handle
            console.log(err);
            return;
          }
          console.log(JSON.stringify(data));
        });
    }


    $scope.selectTheme = selectTheme;
    $scope.cmLoadded = cmLoadded;
    $scope.removeBreakpoint = removeBreakpoint;
    $scope.upload = upload;

  });

})(angular);
