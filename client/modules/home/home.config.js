export default function HomeConfig($stateProvider) {
  'ngInject';

  $stateProvider
    .state('home', {
      url: '/home',
      views: {
        '': {
          templateProvider: function ($templateCache) {
            return $templateCache.get('home/index.ejs');
          }
        }
      },
      data: {
        pageTitle: 'Home'
      }
    })
    .state('home.editor', {
      url: '/editor',
      views: {
        'container': {
          controller: 'EditorCtrl',
          templateProvider: function ($templateCache) {
            return $templateCache.get('editor/index.ejs');
          }
        }
      }
    })
    .state('home.viewer', {
      url: '/viewer',
      params: {'data' : null},
      views: {
        'container': {
          controller: 'CanvasViewCtrl',
          templateProvider: function ($templateCache) {
            return $templateCache.get('viewer/index.ejs');
          }
        }
      }
    });
}
