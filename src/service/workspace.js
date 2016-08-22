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
      data.title = "";
      data.code = "";
      data.input = "";
      data.date = "";
      angular.copy({}, data.structures);
      data.breaks = [];
    }

    function setData(_data) {
      // TODO: _data validation check
      data.id = _data.id;
      data.title = _data.title;
      data.code = _data.code;
      data.input = _data.input;
      data.date = _data.date;
      angular.copy(_data.structures, data.structures);
      data.breaks = _data.breaks; 
    }

    function save() {
      // TODO: validation

      if (!data.id) {
        data.id = new Date().getTime();
        data.date = new Date().getTime();
        while (!savedCanvas.add(data)) {
          data.id--;
        }
        return true;
      }
      else {
        data.date = new Date().getTime();
        return savedCanvas.update(data);
      }
    }

    return {
      data: data,
      getInitData: getInitData,
      setInitData: setInitData,
      setData: setData,
      save: save,
      selected: {}
    };
  });

})(angular);