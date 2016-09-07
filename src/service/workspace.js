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


    var workspace = {
      data: getInitData(),
      getInitData: getInitData,
      setInitData: setInitData,
      dumpData: dumpData,
      save: save
    };

    return workspace;

  });

})(angular, JSON);