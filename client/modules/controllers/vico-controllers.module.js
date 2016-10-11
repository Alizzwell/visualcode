import angular from 'angular';

import CanvasManagerCtrl from './canvas-manager.controller';
import EditorCtrl from './editor.controller';
import DesignerCtrl from './designer.controller';
import CanvasViewCtrl from './canvas-view.controller';

export default angular
  .module('VicoControllers', [])
  .controller('CanvasManagerCtrl', CanvasManagerCtrl)
  .controller('EditorCtrl', EditorCtrl)
  .controller('DesignerCtrl', DesignerCtrl)
  .controller('CanvasViewCtrl', CanvasViewCtrl);
