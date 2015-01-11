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
        src: ['public/js/*.js']
    },
    
    watch: {
      scripts: {
        files: ['public/js/*.js'],
        tasks: ['jshint']
      }
    }

  });

  grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-casperjs');

  grunt.registerTask('default', ['jasmine_node', 'jshint', 'mocha_casperjs']);

};