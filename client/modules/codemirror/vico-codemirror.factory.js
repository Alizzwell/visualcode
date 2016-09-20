import 'codemirror/codemirror/theme/bespin.css!';
import 'codemirror/codemirror/theme/blackboard.css!';
import 'codemirror/codemirror/theme/cobalt.css!';
import 'codemirror/codemirror/theme/dracula.css!';
import 'codemirror/codemirror/theme/eclipse.css!';
import 'codemirror/codemirror/theme/erlang-dark.css!';
import 'codemirror/codemirror/theme/the-matrix.css!';
import 'codemirror/codemirror/theme/zenburn.css!';

import 'codemirror/codemirror/mode/clike/clike';
import 'codemirror/codemirror/addon/edit/closebrackets';
import 'codemirror/codemirror/addon/selection/active-line';


export default function VicoCodeMirrorFactory() {
  'ngInject';

  function VicoCodeMirror(codemirror) {
    this.codemirror = codemirror;
    this.codemirror.setOption('theme', this.theme);
  }

  VicoCodeMirror.prototype.theme = 'default';

  VicoCodeMirror.prototype.themes = [
    'default',
    'bespin',
    'blackboard',
    'cobalt',
    'dracula',
    'eclipse',
    'erlang-dark',
    'the-matrix',
    'zenburn'
  ];

  VicoCodeMirror.prototype.selectTheme = function (theme) {
    VicoCodeMirror.prototype.theme = theme;
    this.codemirror.setOption('theme', theme);
  };

  VicoCodeMirror.prototype.getGutterMarker = function (line) {
    var info = this.codemirror.lineInfo(line);
    if (!info) {
      return;
    }
    return info.gutterMarkers;
  };

  VicoCodeMirror.prototype.setGutterMarker = function
  (line, innerHTML) {
    var marker = document.createElement('div');
    marker.setAttribute('class', 'breakpoint');
    marker.innerHTML = innerHTML || '●';
    this.codemirror.setGutterMarker(line, 'breakpoints', marker);
    return this.getGutterMarker(line);
  };

  VicoCodeMirror.prototype.getEachGutterMarkers = function (callback) {
    var firstLine = this.codemirror.firstLine();
    var lastLine = this.codemirror.lastLine();

    for (var line = firstLine; line <= lastLine; line++) {
      var gutter = this.getGutterMarker(line);
      if (gutter) {
        callback(gutter, line);
      }
    }
  };

  VicoCodeMirror.prototype.removeGutterMarker = function (gutter) {
    var self = this;
    this.getEachGutterMarkers(function (gm, line) {
      if (gm === gutter) {
        self.codemirror.setGutterMarker(line, 'breakpoints', null);
        for (var key in gm) {
          delete gm[key];
        }
      }
    });
  };

  VicoCodeMirror.prototype.clearGutterMarkers = function () {
    this.codemirror.clearGutter('breakpoints');
    this.getEachGutterMarkers(function (gm) {
      for (var key in gm) {
        delete gm[key];
      }
    });
  };

  return VicoCodeMirror;

}
