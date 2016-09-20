export default function VicoServicesConfig($provide) {
  'ngInject';


  $provide.factory('CanvasRepository', function ($http, $q) {
    var apiUrl = '/api/canvas';

    function Canvas(canvas) {
      canvas = canvas || { };

      this._id = canvas._id || '';
      this.title = canvas.title || '';
      this.code = canvas.code || '';
      this.input = canvas.input || '';
      this.breaks = canvas.breaks || [];
      this.structures = canvas.structures || [];
    }

    function CanvasRepository(canvas) {
      this.data = new Canvas(canvas);
    }


    CanvasRepository.prototype.getData = function () {
      var deferred = $q.defer();
      var self = this;
      $http.get(apiUrl + '/' + this.data._id)
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
      $http.post(apiUrl + '/' + this.data._id, this.data)
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
      $http.delete(apiUrl + '/' + this.data._id)
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
            api.params.push(param.value);
          });

          draw[item.structure.id].push(api);
        });
      });

      var deferred = $q.defer();
      $http.post(apiUrl + '/upload', reqData)
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


  $provide.service('UserService', function ($http, $q) {
    var apiUrl = '/api/users';

    this.regist = function () {
      $http.post(apiUrl, {}).catch(function () {
        throw new Error('Cannot regist user info');
      });
    };

    this.getCanvasList = function () {
      var deferred = $q.defer();
      $http.get(apiUrl + '/canvas-list')
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
