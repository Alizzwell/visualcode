'use strict';

import angular from 'angular';

export default angular.module('mc.resizer', [])

  .directive('resizer', function ($document) {
    return function($scope, $element, $attrs) {
      if ($attrs.resizer == 'vertical') {
        // TODO: vertical init..
      }
      else {
        $element.css({height: parseInt($attrs.resizerHeight) + 'px'});
        var y = parseInt($attrs.resizerBottomHeight);

        $element.css({
          bottom: y + 'px',
          left: 0,
          right: 0
        });

        angular.element($document[0].querySelector($attrs.resizerTop)).css({
          bottom: (y + parseInt($attrs.resizerHeight)) + 'px',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          overflow: 'auto'
        });

        angular.element($document[0].querySelector($attrs.resizerBottom)).css({
          height: y + 'px',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          overflow: 'auto'
        });

      }

      $element.on('mousedown', function(event) {
        event.preventDefault();

        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        if ($attrs.resizer == 'vertical') {
          // Handle vertical resizer
          // var x = event.pageX;
          //
          // if ($attrs.resizerMax && x > $attrs.resizerMax) {
          //   x = parseInt($attrs.resizerMax);
          // }
          //
          // $element.css({
          //   left: x + 'px'
          // });
          //
          // angular.element(getElementById($attrs.resizerLeft)).css({
          //   width: x + 'px'
          // });
          //
          // angular.element(getElementById($attrs.resizerRight)).css({
          //   left: (x + parseInt($attrs.resizerWidth)) + 'px'
          // });
        } else {
          // Handle horizontal resizer
          var y = window.innerHeight - event.pageY;
          var maxHeight = $document[0].querySelector($attrs.resizerContainer).offsetHeight
            - parseInt($attrs.resizerHeight);

          if (y < 0) {
            y = 0;
          }

          if (y > maxHeight) {
            y = maxHeight;
          }


          $element.css({
            bottom: y + 'px'
          });

          angular.element($document[0].querySelector($attrs.resizerTop)).css({
            bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
          });

          angular.element($document[0].querySelector($attrs.resizerBottom)).css({
            height: y + 'px'
          });
        }
      }

      function mouseup() {
        $document.unbind('mousemove', mousemove);
        $document.unbind('mouseup', mouseup);
      }
    };
  });
