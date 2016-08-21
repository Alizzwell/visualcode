;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.controller('editorCtrl', function ($scope, $cookies, workSpace) {
    $scope.isCollapsed = false;
    
    $scope.data = workSpace.data;

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

    $scope.breakpoints = [];

    $scope.selectTheme = function (theme) {
      $scope.theme = theme;
      editor.setOption("theme", theme);
    };

    $scope.cmLoadded = function (cm) {
      editor = cm;

      editor.on("gutterClick", function(cm, n) {
        $scope.makeBreakPoint(n);
        $scope.selectedLine = n;
        $scope.designerOpen = true;
        $scope.$apply();
        editor.eachLine(function (a, b) {
          console.log(b);
        });
      });
    };

    $scope.getText = function (line) {
      var info = editor.lineInfo(line);
      if (!info) {
        return null;
      }
      return info.text;
    };

    $scope.makeBreakPoint = function (line) {
      var info = editor.lineInfo(line);
      if (!info) {
        return;
      }
      if (!info.gutterMarkers) {
        var marker = document.createElement("div");
        marker.style.color = "#933";
        marker.innerHTML = "●";
        editor.setGutterMarker(line, "breakpoints", marker);  
      }      
    }

    $scope.getBreakpoint = function (line) {
      var info = editor.lineInfo(line);
      if (!info) {
        return null;
      }
      return info.gutterMarkers;
    };

    $scope.removeBreakpoint = function (line) {
      editor.setGutterMarker(line, "breakpoints", null);
    };

    $scope.getEachBreakpoints = function (callback) {
      
    };
  });

})(angular);

