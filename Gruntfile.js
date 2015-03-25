module.exports = function(grunt){

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    mocha_casperjs: {
      options: {
      },
      files: {
        src: ['test/*.js']
      }
    },

    jasmine_node: {
      options: {
        forceExit: true,
      },
      all: ['spec/']
    },

    jshint: {
        src: ['public/js/app.js', 'public/js/game.js', 'public/js/missile.js', 'public/js/ship.js']
    },

    jasmine: {
      pivotal: {
        src: ['public/js/ship.js', 'public/js/missile.js', 'public/js/game.js'],
        tasks: 'jasmine:pivotal:build',
        options: {
          specs: 'spec/*Spec.js'
        }
      }
    },
    
    watch: {
      scripts: {
        files: ['public/js/*.js', 'spec/*Spec.js', 'test/*.js'],
        tasks: ['express:test', 'jshint', 'jasmine', 'mocha_casperjs']
      }
    },

    express: {
      test: {
        options: {
          script: 'server.js',
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-casperjs');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-express-server');

  grunt.registerTask('default', ['express:test', 'jshint', 'jasmine', 'mocha_casperjs']);

};