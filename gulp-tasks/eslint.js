'use strict';

var gulp = require('gulp');
var eslint = require('gulp-eslint');

gulp.task('eslint', function () {
 
  return gulp.src([
    'client/modules/**/*.js',
    '!client/modules/html_templates/html_templates.module.js',
    'gulp-tasks/**/*.js',
    'server/**/*.js',
    '!server/node_modules{,/**}',
    '*.js'
  ])
  .pipe(eslint())
  .pipe(eslint.format());
});