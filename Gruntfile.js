module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {pattern: ['grunt-*', 'assemble']});

  // Load Custom Tasks
  // grunt.loadTasks('tasks');

  // Project configuration.
  grunt.initConfig({

    watch: {
      coffee: {
        files: ['src/*.coffee'],
        tasks: ['rebuild-js']
      }
    },

    clean: {
      dist: ['dist'],
      docs: ['docs/assets']
    },

    coffee: {
      compile: {
        files: {
          'dist/responsivify.js' : 'src/responsivify.coffee'
        }
      }
    },

    uglify: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/responsivify.min.js': ['dist/responsivify.js']
        }
      }
    },

    bowercopy: {
      options: {
        srcPrefix: 'bower_components'
      },
      site: {
        options: {
          destPrefix: 'docs/assets/vendor'
        },
        files: {
          'jquery/jquery.js'         : 'jquery/dist/jquery.min.js',
          'underscore/underscore.js' : 'underscore/underscore-min.js'
        }
      }
    },

    copy: {
      site: {
        files: [
          {src:['dist/responsivify.js'], dest:'docs/assets/javascripts/responsivify.js'}
        ]
      }
    },

  });

  grunt.registerTask('rebuild', ['clean', 'bowercopy']);
  grunt.registerTask('rebuild-js', ['coffee','uglify','copy']);

  // Default task.
  // grunt.registerTask('default', ['clean', 'coffee', 'uglify', 'bowercopy', 'watch']);
  grunt.registerTask('default', ['rebuild', 'rebuild-js', 'watch']);

};