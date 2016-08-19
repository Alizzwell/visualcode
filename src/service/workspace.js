;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.factory('workSpace', function ($cookies) {
    var data = {};
    var savedCanvas;

    try {
     savedCanvas = $cookies.getObject('thisplay.savedCanvas') || [];
    } catch (e) {
      $cookies.putObject('thisplay.savedCanvas', []);
      savedCanvas = [];
    }

    function getData() {
      var ret = {};
      angular.copy(data, ret);
      return ret;
    }

    function setData(item) {
      angular.copy(item, data);
    }

    function save() {
      if (!data.id) {
        data.id = new Date().getTime();
      }
      data.date = new Date().getTime();

      var obj = {};
      angular.copy(data, obj);

      var idx = findIndex(savedCanvas, function (canvas) {
        return canvas.id == obj.id;
      });

      if (idx < 0) {
        savedCanvas.push(obj);
      }
      else {
        savedCanvas[idx] = obj;
      }

      $cookies.putObject('thisplay.savedCanvas', savedCanvas);
    }

    function removeSavedCanvas(id) {
      savedCanvas.splice(findIndex(savedCanvas, function (canvas) {
        return canvas.id == id;
      }), 1);
      $cookies.putObject('thisplay.savedCanvas', savedCanvas);
    }

    return {
      data: data,
      getData: getData,
      setData: setData,
      savedCanvas: savedCanvas,
      save: save,
      removeSavedCanvas: removeSavedCanvas
    };
  });

  function findIndex(arr, callback) {
    for (var i = 0; i < arr.length; i++) {
      if (callback(arr[i])) return i;
    }
    return -1;
  }

})(angular);