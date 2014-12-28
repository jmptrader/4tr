module.exports = function (grunt) {


  // Prepare a banner
  var banner = '/*\n<%= pkg.name %> <%= pkg.version %>';
      banner += '- <%= pkg.description %>\n<%= pkg.repository.url %>\n';
      banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n';


  // Task configurations
  grunt.initConfig({

    
    /*--------------------------------*
     *        Code Conventions        *
     *--------------------------------*/

    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['tests/coverage/**/*.js']
      },
      files: {
        src: ['models/**/*.js', 'tests/**/*.js']
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },


    /*--------------------------------*
     *          Test suite            *
     *--------------------------------*/

    mochaTest: {

      // Unit tests = The smallest unit of functionality that can be tested
      unit: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          require: [
            './tests/helpers/chai-helper', 
            './tests/helpers/require-helper', 
            './tests/helpers/utils-helper'
          ]
        },
        src: ['tests/unit/**/*.spec.js']
      }, 
      
      // Integration tests = Testing the interaction of two or more objects
      integration: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          require: [
            './tests/helpers/chai-helper', 
            './tests/helpers/require-helper', 
            './tests/helpers/utils-helper'
          ]
        },
        src: ['tests/integration/**/*.spec.js']
      } 

    },


    /*--------------------------------*
     *         Code Coverage          *
     *--------------------------------*/

    // Clean out old test coverage reports before each run
    clean: {
      coverage: {
        src: ['tests/coverage/']
      }
    },

    // Copy all of the app files to a dir for coverage analysis 
    copy: {
      application: {
        expand: true,
        flatten: true,
        src: ['models/*'],
        dest: 'tests/coverage/instrument/models'
      }
    },

    // Add coverage instrumentation to the copies of the app files
    instrument: {
      files: 'models/*.js',
      options: {
        lazy: false,
        basePath: 'tests/coverage/instrument/'
      }
    },

    // Point the test runner at the dir with the instrumentated app files
    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../../tests/coverage/instrument/models/'
      }
    },

    // Save the raw coverage analysis data
    storeCoverage: {
      options: {
        dir: 'tests/coverage/reports'
      }
    },

    // Generate a coverage report from the raw coverage analysis data
    makeReport: {
      src: 'tests/coverage/reports/**/*.json',
      options: {
        type: [ 'lcov', 'text' ],
        dir: 'tests/coverage/reports',
        print: 'detail'
      }
    },

    // Enforce minimum thresholds of code coverage
    coverage: {
      options: {
        thresholds: {
          'statements': 90,
          'branches': 90,
          'lines': 90,
          'functions': 90
        },
        root: 'tests',
        dir: 'coverage/reports/'
      }
    },


    /*--------------------------------*
     *    Code Monitoring Triggers    *
     *--------------------------------*/
    
    // Run tasks whenever watched files change
    watch: {
      lint: {
        files: '<%= jshint.files.src %>',
        tasks: 'jshint'
      },
      test: {
        files: ['tests/unit/*.js'],
        tasks: ['jshint', 'unit']
      }
    },

    // Restart npm server whenever watched files change
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          ext: 'js,json'
        }
      }
    },

    // Run two or more grunt tasks at once in seperate processes
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },


  });


  // Load task plugins
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-istanbul');
  grunt.loadNpmTasks('grunt-istanbul-coverage');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  // Define tasks -----------------------

  // Testing tasks
  grunt.registerTask('test', ['mochaTest:unit', 'mochaTest:integration']);  
  grunt.registerTask('unit', ['mochaTest:unit']);  
  grunt.registerTask('integration', ['mochaTest:integration']);  

  // Code coverage task
  grunt.registerTask('cover', ['jshint', 'clean', 'copy:application', 'env:coverage', 'instrument', 'test', 'storeCoverage', 'makeReport', 'coverage']);

  // Code monitoring - Watch for code changes and run tests or restart server as necessary
  grunt.registerTask('server', ['concurrent:target']);

  // Default to syntax help and code monitoring
  grunt.registerTask('default', ['jshint', 'server']);


};
