;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.factory('userService', function ($http) {
    

    function getUserCanvas(callback) {
      $http.get('/admin/api/examples')
      .then(function success(res) {
        callback(res.data);
      }, function error(res) {
      });
    }


    function getCanvasData(canvas, callback) {
      $http.get('/admin/api/examples/' + canvas._id)
      .then(function success(res) {
        callback(res.data);
      }, function error(res) {
      });
    }


    function saveCanvas(canvas, callback) {
      $http.post('/admin/api/examples', canvas)
      .then(function success(res) {
        callback(res.data);
      }, function error(res) {
      });
    }


    function removeCanvas(canvas, callback) {
      $http.delete('/admin/api/examples/' + canvas._id)
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