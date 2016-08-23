;(function (angular) {
  'use strict';
  
  var app = angular.module('thisplayApp');

  app.factory('workSpace', function (savedCanvas) {
    var data = getInitData();

    function getInitData() {
      return {
        title: "",
        code: "",
        input: "",
        date: "",
        structures: {},
        breaks: []
      }
    }

    function setInitData() {
      delete data.id;
      deepCopy(getInitData(), data);
    }

    function setData(_data) {
      // TODO: _data validation check
      deepCopy(_data, data);
    }

    function deepCopy(src, dest) {
      dest.id = src.id;
      dest.title = src.title;
      dest.code = src.code;
      dest.input = src.input;
      dest.date = src.date;
      angular.copy(JSON.parse(JSON.stringify(src.structures)), dest.structures);
      angular.copy(JSON.parse(JSON.stringify(src.breaks)), dest.breaks);
    }

    function save() {
      // TODO: validation

      var obj = getInitData();
      deepCopy(data, obj);

      obj.breaks.forEach(function (bp) {
        delete bp.marker;
      });

      if (!obj.id) {
        obj.id = new Date().getTime();
        obj.date = new Date().getTime();
        while (!savedCanvas.add(obj)) {
          obj.id--;
        }
        data.id = obj.id;
        data.date = obj.date;
        return true;
      }
      else {
        data.date = obj.date = new Date().getTime();
        return savedCanvas.update(obj);
      }
    }

    return {
      data: data,
      getInitData: getInitData,
      setInitData: setInitData,
      setData: setData,
      deepCopy: deepCopy,
      save: save,
      selected: {}
    };
  });

})(angular);