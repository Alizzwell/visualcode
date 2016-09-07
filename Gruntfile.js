module.exports = function (grunt) {

  var cssFiles = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/bootstrap/dist/css/bootstrap-theme.css',
    'bower_components/codemirror/lib/codemirror.css',
    'bower_components/codemirror/theme/bespin.css',
    'bower_components/codemirror/theme/blackboard.css',
    'bower_components/codemirror/theme/cobalt.css',
    'bower_components/codemirror/theme/dracula.css',
    'bower_components/codemirror/theme/eclipse.css',
    'bower_components/codemirror/theme/erlang-dark.css',
    'bower_components/codemirror/theme/the-matrix.css',
    'bower_components/codemirror/theme/zenburn.css',

    'src/css/*.css'
  ];

  var jsDependenciesFiles = [
    'bower_components/angular/angular.js',
    'bower_components/angular-bootstrap/ui-bootstrap.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
    'bower_components/angular-pageslide-directive/dist/angular-pageslide-directive.js',
    'bower_components/codemirror/lib/codemirror.js',
    'bower_components/codemirror/mode/clike/clike.js',
    'bower_components/codemirror/addon/edit/closebrackets.js',
    'bower_components/codemirror/addon/selection/active-line.js',
    'bower_components/angular-ui-codemirror/ui-codemirror.js'
  ];

  var jsFiles = [
    'src/*.js',
    'src/filter/*.js',
    'src/service/*.js',
    'src/controller/*.js'
  ];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js']
    },
    concat: {
      basic: {
        src: jsDependenciesFiles.concat(jsFiles),
        dest: 'public/assets/build/visualcode.js'
      }
    },
    uglify: {
      options: {
        banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */ ',
        mangle: false,
        preserveComments: false
      },
      build: {
        src: 'public/assets/build/visualcode.js',
        dest: 'public/assets/build/visualcode.min.js'
      }
    },
    cssmin: {
      target: {
        files: {
          'public/assets/build/visualcode.min.css':
          cssFiles
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']); 
  grunt.registerTask('js', ['jshint', 'concat', 'uglify']);
};