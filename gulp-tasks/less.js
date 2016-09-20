'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');
var less = require('gulp-less');
var LessAutoPrefixPlugin = require('less-plugin-autoprefix');
var LessCleanCssPlugin = require('less-plugin-clean-css');

var less_autoprefix = new LessAutoPrefixPlugin({
  browsers: ['last 2 versions']
});

var less_clean_css = new LessCleanCssPlugin({
  advanced: true
});


gulp.task('less', function () {

  return gulp.src(['client/style.less'])
    .pipe(
      inject(gulp.src(['css/**/*.less', '!jspm_packages{,/**}'], {
        read: false,
        cwd: 'client'
      }), {
        relative: true,
        starttag: '/* inject:less-imports */',
        endtag: '/* endinject */',
        transform: function (filepath) {
          return '@import "' + filepath + '";';
        }
      })
    )
    .pipe(less({
      plugins: [less_autoprefix, less_clean_css]
    }))
    .pipe(gulp.dest('client'));
});
