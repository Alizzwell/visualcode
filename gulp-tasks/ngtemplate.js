'use strict';

var gulp = require('gulp');
var ejs = require('gulp-ejs');
var htmlMin = require('gulp-htmlmin');
var ngTemplate = require('gulp-ng-template');
var htmlMin_options = {
  removeComments: true,
  collapseWhitespace: true,
  conservativeCollapse: false,
  collapseInlineTagWhitespace: true
};


gulp.task('ngtemplate', function () {

  return gulp.src([
    'client/views/**/*.tpl.html',
    'client/views/*/index.ejs',
    '!client/jspm_packages{,/**}'
  ])
  .pipe(ejs())
  .pipe(htmlMin(htmlMin_options))
  .pipe(ngTemplate({
    moduleName: 'HTMLTemplates',
    standalone: true,
    filePath: 'modules/html_templates/html_templates.module.js'
  }))
  .pipe(gulp.dest('client'));
});
