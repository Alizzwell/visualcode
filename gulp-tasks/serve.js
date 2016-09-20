'use strict';

var browserSync = require('browser-sync').create();
var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var reload = browserSync.reload;


gulp.task('serve',
  [
    'browser-sync'
  ],
  function () {
    gulp.watch([
      'client/modules/**/*.js',
      'client/config.js'
    ]).on('change', reload);

    gulp.watch([
      'client/style.css',
      'client/index.html',
      'client/error.ejs'
    ]).on('change', reload);

    // trigger to change style.css
    gulp.watch([
      'client/css/**/*.less',
      'client/style.less'
    ], ['less']);

     // trigger to change html_templates.module.js
    gulp.watch([
      'client/views/**/*.ejs',
      'client/views/**/*.tpl.html'
    ], ['ngtemplate']);
  }
);


gulp.task('browser-sync',
  [
    'nodemon'
  ],
  function() {
    browserSync.init(null, {
      proxy: 'http://localhost:20080',
      port: 10080
    });
  }
);


gulp.task('nodemon',
  [
    'eslint',
    'less',
    'ngtemplate'
  ],
  function (done) {
    var running = false;

    return nodemon({
      script: 'server/app.js',
      watch: [
        'server/**/*.*',
        '!server/node_modules{,/**}',
        '!server/tmp{,/**}'
      ]
    })
    .on('start', function () {
      if (!running) {
        done();
      }
      running = true;
    })
    .on('restart', function () {
      setTimeout(function () {
        reload();
      }, 500);
    });
  }
);
