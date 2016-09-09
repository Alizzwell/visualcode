;(function (angular, JSON) {
  'use strict';
  
  var app = angular.module('visualcodeApp');

  app.factory('workSpace', function (userService) {
    
    function getInitData() {
      return {
        title: "",
        code: "",
        input: "",
        date: "",
        structures: [],
        breaks: []
      };
    }


    function setInitData() {
      workspace.data = getInitData();
    }


    function dumpData() {
      return JSON.parse(JSON.stringify(workspace.data));
    }


    function save(callback) {
      userService.saveCanvas(workspace.data, function (data) {
        workspace.data = data;
        callback(data);
      });
    }


    function upload(callback) {
      var data = {
        code: workspace.data.code,
        input: workspace.data.input,
        design: {
          structures: {},
          draws: {}
        }
      };

      workspace.data.structures.forEach(function (item) {
        data.design.structures[item.id] = item.type;
      });

      workspace.data.breaks.forEach(function (bp) {
        if (!data.design.draws[bp.line + 1]) {
          data.design.draws[bp.line + 1] = {};
        }

        var draw = data.design.draws[bp.line + 1];

        bp.draws.forEach(function (item) {
          if (!draw[item.structure.id]) {
            draw[item.structure.id] = [];
          }

          var api = {
            name: item.api.name,
            params: []
          };

          item.api.params.forEach(function (param) {
            api.params.push(param.value);
          });

          draw[item.structure.id].push(api);
        });
      });

      userService.upload(data, function (err, resData) {
        callback(err, resData);
      });
    }

    var workspace = {
      data: getInitData(),
      getInitData: getInitData,
      setInitData: setInitData,
      dumpData: dumpData,
      save: save,
      upload: upload
    };

    return workspace;

  });

})(angular, JSON);