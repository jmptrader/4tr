module.exports = function (grunt) {

  // Load task libs -----------------------
  grunt.loadNpmTasks('grunt-mocha-test');


  // Prepare a banner ---------------------
  var banner = '/*\n<%= pkg.name %> <%= pkg.version %>';
      banner += '- <%= pkg.description %>\n<%= pkg.repository.url %>\n';
      banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n';


  // Project configuration ----------------
  grunt.initConfig({

    // Test suite
    mochaTest: {

      // Unit tests = The smallest unit of functionality that can be tested
      unit: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          require: [
            './tests/helpers/chai', 
            './tests/helpers/utils'
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
            './tests/helpers/chai', 
            './tests/helpers/utils'
          ]
        },
        src: ['tests/integration/**/*.spec.js']
      } 

    }

  });

  // Define tasks -----------------------

  // Regsiter Testing tasks
  grunt.registerTask('test', ['mochaTest:unit', 'mochaTest:integration']);  
  grunt.registerTask('unit', ['mochaTest:unit']);  
  grunt.registerTask('integration', ['mochaTest:integration']);  

  // Default task sequyence
  grunt.registerTask('default', ['unit']);

};