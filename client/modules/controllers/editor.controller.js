export default class EditorCtrl {

  constructor($scope, $state, $element, VicoCodeMirror) {
    'ngInject';

    $scope.editor;

    $scope.cmOptions = {
      mode: 'text/x-c++src',
      tabSize: 2,
      indentWithTabs: true,
      styleActiveLine: true,
      autoCloseBrackets: true,
      lineNumbers: true,
      lineWrapping: true,
      gutters: ['CodeMirror-linenumbers', 'breakpoints']
    };


    $scope.cmLoadded = function (cm) {
      $scope.editor = new VicoCodeMirror(cm);
      syncBreaksFromCurrentCanvas();

      cm.on('gutterClick', function (cm, line) {
        // gutter is singleton at each line
        var gutter = $scope.editor.setGutterMarker(line, '●');
        if (!gutter) {
          return;
        }
        gutter.draws = gutter.draws || [];
        selectGutterMarker(gutter);
        syncBreaksToCurrentCanvas();
        $scope.designerOpen = true;
        $scope.$apply();
      });

      cm.on('keyup', function () {
        syncBreaksToCurrentCanvas();
        $scope.$apply();
      });
    };


    $scope.selectTheme = function (theme) {
      $scope.editor.selectTheme('theme', theme);
    };


    function selectGutterMarker(gutter) {
      $scope.selectedGutter = gutter;
      $scope.editor.getEachGutterMarkers(function (gm) {
        if (gm.breakpoints) {
          gm.breakpoints.setAttribute('class', 'breakpoint');
        }
      });
      gutter.breakpoints.setAttribute('class', 'breakpoint active');
    }


    $scope.removeSelectedGutterMarker = function() {
      $scope.editor.removeGutterMarker($scope.selectedGutter);
      delete $scope.selectedGutter;
      syncBreaksToCurrentCanvas();
    };


    function syncBreaksToCurrentCanvas() {
      var isSelectedGutterStillOnEditor = false;
      var breaks = [];
      $scope.editor.getEachGutterMarkers(function (gm, line) {
        if (gm === $scope.selectedGutter) {
          isSelectedGutterStillOnEditor = true;
        }

        if (gm.draws) {
          breaks.push({line: line, draws: gm.draws});
        }
      });
      if (!isSelectedGutterStillOnEditor) {
        delete $scope.selectedGutter;
      }
      $scope.currentCanvas.breaks = breaks;
    }


    function syncBreaksFromCurrentCanvas() {
      delete $scope.selectedGutter;
      $scope.editor.clearGutterMarkers();
      // angular - jquery sync problem
      $scope.editor.codemirror.setValue($scope.currentCanvas.code);
      $scope.currentCanvas.breaks.forEach(function (bk) {
        var gutter = $scope.editor.setGutterMarker(bk.line, '●');
        gutter.draws = bk.draws;
      });
    }

    $scope.$on('changedCurrentCanvas', function () {
      syncBreaksFromCurrentCanvas();
    });

    $scope.syncBreaksToCurrentCanvas = syncBreaksToCurrentCanvas;
  }
}
