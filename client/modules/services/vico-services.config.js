export default function VicoServicesConfig($provide) {
  'ngInject';

  function Canvas(canvas) {
    canvas = canvas || { };

    this._id = canvas._id || '';
    this.title = canvas.title || '';
    this.code = canvas.code || '';
    this.input = canvas.input || '';
    this.breaks = canvas.breaks || [];
    this.structures = canvas.structures || [];
  }

  $provide.factory('CanvasRepository', function ($http, $q, userType) {

    function CanvasRepository(canvas) {
      this.apiUrl = 
      (userType === 'user' ? '/api/canvas' : '/api/examples');
      this.data = new Canvas(canvas);
    }

    CanvasRepository.prototype.getData = function () {
      var deferred = $q.defer();
      var self = this;
      $http.get(this.apiUrl + '/' + this.data._id)
      .then(function (res) {
        self.data = new Canvas(res.data);
        deferred.resolve(res.data);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    CanvasRepository.prototype.save = function () {
      var deferred = $q.defer();
      var self = this;
      this.data._id = this.data._id || '';
      $http.post(this.apiUrl + '/' + this.data._id, this.data)
      .then(function (res) {
        self.data = new Canvas(res.data);
        deferred.resolve(res.data);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    CanvasRepository.prototype.remove = function () {
      var deferred = $q.defer();
      var self = this;
      $http.delete(this.apiUrl + '/' + this.data._id)
      .then(function (res) {
        delete self.data;
        deferred.resolve(res.data);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    CanvasRepository.prototype.upload = function () {
      var reqData = {
        code: this.data.code,
        input: this.data.input,
        design: {
          structures: {},
          draws: {}
        }
      };

      this.data.structures.forEach(function (item) {
        reqData.design.structures[item.id] = item.type;
      });

      this.data.breaks.forEach(function (bk) {
        if (!reqData.design.draws[bk.line + 1]) {
          reqData.design.draws[bk.line + 1] = {};
        }

        var draw = reqData.design.draws[bk.line + 1];

        bk.draws.forEach(function (item) {
          if (!draw[item.structure.id]) {
            draw[item.structure.id] = [];
          }

          var api = {
            name: item.api.name,
            params: []
          };

          item.api.params.forEach(function (param) {
            if (!param.value) {
              return;
            }
            api.params.push(param.value);
          });

          draw[item.structure.id].push(api);
        });
      });

      var deferred = $q.defer();
      $http.post('/api/canvas/upload', reqData)
      .then(function (res) {
        deferred.resolve(res.data);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    return CanvasRepository;
  });


  $provide.service('CanvasService', function ($http, $q, userType) {
    var apiUrl = 
      (userType === 'user' ? '/api/canvas' : '/api/examples');

    this.getCanvasList = function () {
      var deferred = $q.defer();
      $http.get(apiUrl)
      .then(function (res) {
        deferred.resolve(res.data);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    this.getCanvas = function (id) {
      var deferred = $q.defer();
      $http.get(apiUrl)
      .then(function (res) {
        deferred.resolve(new Canvas(res.data));
      })
      .catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
  });


  $provide.service('ExampleService', function ($http, $q, userType) {
    var apiUrl = '/api/examples';

    this.getExampleList = function () {
      var deferred = $q.defer();
      if (userType === 'admin') {
        return deferred.promise;
      }

      $http.get(apiUrl)
      .then(function (res) {
        deferred.resolve(res.data);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };

    this.getExample = function (id) {
      var deferred = $q.defer();
      if (userType === 'admin') {
        return deferred.promise;
      }
      
      $http.get(apiUrl + '/' + id)
      .then(function (res) {
        deferred.resolve(res.data);
      })
      .catch(function (err) {
        deferred.reject(err);
      });
      return deferred.promise;
    };
  });

}
