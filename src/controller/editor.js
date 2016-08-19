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

    $scope.cmLoadded = function (cm) {
      editor = cm;

      editor.on("gutterClick", function(cm, n) {
        var info = cm.lineInfo(n);
        
        if (!info) {
          return;
        }

        $scope.testLineNum = n + 1;
        $scope.designerOpen = true;
        $scope.$apply();

        if (info.gutterMarkers) {
          cm.setGutterMarker(n, "breakpoints", null);  
        }
        else {
          var marker = document.createElement("div");
          marker.style.color = "#933";
          marker.innerHTML = "●";
          cm.setGutterMarker(n, "breakpoints", marker);  
        }
      });
    };

    $scope.selectTheme = function (theme) {
      $scope.theme = theme;
      editor.setOption("theme", theme);
    };
  });

})(angular);

