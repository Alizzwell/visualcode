;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.factory('userService', function ($http) {
    
    $http.post('/api/users', {})
    .then(function success(res, status) {
      console.log(status);
    }, function error(err) {
      console.log(err);
    });


    function getUserCanvas(callback) {
      $http.get('/api/canvas')
      .then(function success(res, status) {
        console.log(status);
      }, function error(err) {
        console.log(err);
      });
    }

    function save(canvas, callback) {
      if (canvas._id) {
        $http.put('/api/canvas/' + canvas_id, canvas)
        .then(function success(res, status) {
          console.log(status);
        }, function error(err) {
          console.log(err);
        });
      }
      else {
        $http.post('/api/canvas')
        .then(function success(res, status) {
          console.log(status);
        }, function error(err) {
          console.log(err);
        });
      }
    }

    var savedCanvas = [];

    function add(canvas) {
      if (!canvas.id) {
        return false;
      }
      
      if (savedCanvas.some(function (c) {
        return c.id === canvas.id
      })) {
        return false;
      }

      var obj = {};
      angular.copy(canvas, obj);
      savedCanvas.push(obj);
      $cookies.putObject('thisplay.savedCanvas', savedCanvas);
      return true;      
    }

    function update(canvas) {
      if (!canvas.id) {
        return false;
      }

      var idx = findIndex(savedCanvas, function (c) {
        return c.id == canvas.id;
      });

      if (idx < 0) {
        return false;
      }

      var obj = {};
      angular.copy(canvas, obj);
      savedCanvas[idx] = obj;
      $cookies.putObject('thisplay.savedCanvas', savedCanvas);
      return true;
    }

    function remove(id) {
      savedCanvas.splice(findIndex(savedCanvas, function (c) {
        return c.id == id;
      }), 1);
      $cookies.putObject('thisplay.savedCanvas', savedCanvas);
    }

    return {
      data: savedCanvas,
      add: add,
      update: update,
      remove: remove
    };
  });

  function findIndex(arr, callback) {
    for (var i = 0; i < arr.length; i++) {
      if (callback(arr[i])) return i;
    }
    return -1;
  }

})(angular);