;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('editorCtrl', function ($scope, $cookies, workSpace) {
    $scope.isCollapsed = false;
    
    $scope.data = workSpace.data;
    $scope.selected = workSpace.selected;

    var editor;

    $scope.cmOptions = {
      indentWithTabs: true,
      mode: "text/x-c++src",
      styleActiveLine: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      gutters: ["CodeMirror-linenumbers", "breakpoints"]
    };

    $scope.theme = 'default';

    $scope.themes = ['default', 'bespin', 'blackboard', 'cobalt',
    'dracula', 'eclipse', 'erlang-dark', 'the-matrix', 'zenburn'];

    $scope.selectTheme = function (theme) {
      $scope.theme = theme;
      editor.setOption("theme", theme);
    };

    $scope.cmLoadded = function (cm) {
      editor = cm;

      editor.on("gutterClick", function(cm, n) {
        var bp = $scope.getBreakpoint(n);
        if (!bp) {
          bp = $scope.makeBreakpoint(n);
        }

        workSpace.selected.line = n;
        workSpace.selected.breakpoint = bp;

        $scope.getEachBreakpoints(function (bp) {
          bp.setAttribute("class", "breakpoint");
        });
        bp.setAttribute("class", "breakpoint active");

        $scope.designerOpen = true;
        $scope.$apply();
      });

      editor.on('change', function () {
        console.log('changed');
      });
    };

    $scope.makeBreakpoint = function (line) {
      var marker = document.createElement("div");
      marker.setAttribute("class", "breakpoint active");
      marker.innerHTML = "●";
      editor.setGutterMarker(line, "breakpoints", marker); 

      var bp = $scope.getBreakpoint(line);
      bp.draws = {};
      workSpace.data.breaks.push(bp);
      return bp;
    };

    $scope.getBreakpoint = function (line) {
      var info = editor.lineInfo(line);
      if (!info) {
        return;
      }

      if (!info.gutterMarkers) {
        return;
      }

      return info.gutterMarkers.breakpoints;
    };

    $scope.getBreakpointLine = function (bp) {
      if (!bp) {
        return -1;
      }

      for (var i = editor.firstLine(); i <= editor.lastLine(); i++) {
        if ($scope.getBreakpoint(i) === bp) {
          return i;
        }
      }
      return -1;
    };

    $scope.getEachBreakpoints = function (callback) {
      editor.eachLine(function (lineinfo) {
        if (!lineinfo.gutterMarkers) {
          return;
        }
        callback(lineinfo.gutterMarkers.breakpoints);
      });
    };

    $scope.removeBreakpoint = function (bp) {
      workSpace.data.breaks.splice(
        workSpace.data.breaks.indexOf(bp), 1);
      editor.setGutterMarker($scope.getBreakpointLine(bp),
        "breakpoints", null);
    };

  });

})(angular);

