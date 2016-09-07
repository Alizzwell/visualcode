;(function (angular) {
  'use strict';
  
  var app = angular.module('visualcodeApp');

  app.factory('userService', function ($http) {
    
    $http.post('/api/users', {})
    .then(function success(res) {
    }, function error(res) {
    });


    function getUserCanvas(callback) {
      $http.get('/api/canvas')
      .then(function success(res) {
        callback(res.data);
      }, function error(res) {
      });
    }


    function getCanvasData(canvas, callback) {
      $http.get('/api/canvas/' + canvas._id)
      .then(function success(res) {
        callback(res.data);
      }, function error(res) {
      });
    }


    function saveCanvas(canvas, callback) {
      if (canvas._id) {
        $http.put('/api/canvas/' + canvas._id, canvas)
        .then(function success(res) {
          callback(res.data);
        }, function error(res) {
        });
      }
      else {
        $http.post('/api/canvas', canvas)
        .then(function success(res) {
          callback(res.data);
        }, function error(res) {
        });
      }
    }


    function removeCanvas(canvas, callback) {
      $http.delete('/api/canvas/' + canvas._id)
      .then(function success(res) {
        callback();
      }, function error(res) {
        callback();
      });
    }

    return {
      getUserCanvas: getUserCanvas,
      getCanvasData: getCanvasData,
      saveCanvas: saveCanvas,
      removeCanvas: removeCanvas
    };
  });

})(angular);