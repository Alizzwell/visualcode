import $ from 'jquery';
import angular from 'angular';
import 'angular-ui-router';

import 'bootstrap/css/bootstrap.css!';
import 'style.css!';
import 'angular-bootstrap';

import Home from 'modules/home/home.module';

import MainConfig from './main.config';
import MainCtrl from './main.controller';

const main = angular
  .module('vicoApp', [
    'ui.router',
    'ui.bootstrap',
    Home.name
  ])
  .config(MainConfig)
  .controller('MainCtrl', MainCtrl);

export default main;


angular.element(document).ready(function () {
  $.post('/api/login', function (user) {
    main.constant('userType', user);
    return angular.bootstrap(document, [main.name]);
  });
});
