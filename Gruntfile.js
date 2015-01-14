module.exports = function (grunt) {

/* 

  Practical Continuous Dployment
  From: http://blogs.atlassian.com/2014/04/practical-continuous-deployment/

  * Use an issue tracker for everything
  * Create a separate branch for this work, tagged with the issue number
  * Develop on this branch, and continuously test and integrate it
  * Optional: Push your changes to a rush box
  * When ready, create a pull request for the branch. All merges must come through a pull request
  ** All pull requests must have approval from at least one reviewer
  ** The Bamboo tests for this branch must pass.
  * Merge and release
  * Deploy to staging
  * Promote to production

  Deployment Sequence

  Dev
    setup
      check dependencies
      install
      start services
      healthchecks
    branch ([issue-#]_[bugfix|feature|enhancement]
      pull
      branch
    check style
    coverage
      clean
      clone
      instrument
      test:unit
      store coverage
    build
      preprocess
      compile
      generate docs
      SASS
      minify
        JS
        CSS
    test:integration
    test:functional
    tar
    deploy:ci
  CI
    test
      unit
      integration
      functional
    merge
    bump version
    tag in github
    deploy:stage
      upload
      unpack
      update symlink
      restart server
  Stage
    test
      unit
      integration
      functional
      acceptance
        health status for Reliability
        benchmakr apis for Scalabilitiy
        check usability
        check security
        check push mechanisims for Maintainability
        check configurability
        check compatibility against 3rd party APIs & clients
        check transferability
      Deploy:Production
    deploy:production
  Production
    health checks

*/

  // Prepare to calculate paths
  var path = require('path');
  var root = path.resolve();

  // Lets time grunt execution
  require('time-grunt')(grunt);

  // Prepare a banner
  var banner = '/*\n<%= pkg.name %> <%= pkg.version %>';
      banner += '- <%= pkg.description %>\n<%= pkg.repository.url %>\n';
      banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n';

  // Common paths for our tasks to use
  
  var gc = {
    githubAccount: "jwtd",
    root: root,
    //gruntConfigDir: "<%= gc.root %>/grunt-base/config",
    srcDir: "src",
      modelsSrcDir: "src/models",
      routesSrcDir: "src/routes",
      viewsSrcDir:  "src/views",
      docsSrcDir:   "src/docs",
    testsDir: "tests",
    toolsDir: "tools",
    dataDir:  "data",
    buildDir: "build"
    //sassDir: "<%= gc.root %>/sass",
    //cssDir: "<%= gc.root %>/css",
    //jsDir: "<%= gc.root %>/js"
  };

  // Task configurations
  grunt.initConfig({

    // Pull in the package details
    pkg: grunt.file.readJSON('package.json'),

    // Common paths for our tasks to use
    gc: gc,

    /*--------------------------------*
     *        Code Conventions        *
     *--------------------------------*/

    // Static code analysis and code style enforcement
    jshint: {
      options: {
        jshintrc: '<%= gc.toolsDir %>/jshintrc.json',
        ignores: ['<%= gc.testsDir %>/coverage/**/*.js']
      },
      files: {
        src: ['<%= gc.modelsSrcDir %>/**/*.js', '<%= gc.testsDir %>/**/*.js']
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },

    // Code formatting : https://www.npmjs.com/package/grunt-jsbeautifier
    // Exclude files : ['!foo/bar.js'],
    jsbeautifier : {
      // Make changes
      modify: {
        src: [
          'Gruntfile.js',
          'apgc.js',  
          '<%= gc.modelsSrcDir %>/**/*.js',
          '<%= gc.routesSrcDir %>/**/*.js',
          '<%= gc.testsDir %>/**/*.js'
        ],
        options: {
          config: '<%= gc.toolsDir %>/jsbeautifyrc.json'
        }
      },
      // Check syntax only
      verify: {
        src: [
          'Gruntfile.js',
          'apgc.js',  
          '<%= gc.modelsSrcDir %>/**/*.js',
          '<%= gc.routesSrcDir %>/**/*.js',
          '<%= gc.testsDir %>/**/*.js'
        ],
        options: {
          mode: 'VERIFY_ONLY',
          config: '<%= gc.toolsDir %>/jsbeautifyrc.json'
        }
      }
    },


    /*--------------------------------*
     *          Test suite            *
     *--------------------------------*/

    mochaTest: {

      // Runs a single test
      // Matches any spec name in the tests directory
      // Format for calling is     grunt spec:mochaTest:api-collections
      spec: {
        src: 'src/**/*.js',
        options: {
          specs: ['<%= gc.testsDir %>/**/<%= gc.file %>.spec.js']
        }
      },

      // Unit tests = The smallest unit of functionality that can be tested
      unit: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          require: [
            '<%= gc.testsDir %>/helpers/chai-helper', 
            '<%= gc.testsDir %>/helpers/require-helper', 
            '<%= gc.testsDir %>/helpers/utils-helper'
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
            '<%= gc.testsDir %>/helpers/chai-helper', 
            '<%= gc.testsDir %>/helpers/require-helper', 
            '<%= gc.testsDir %>/helpers/utils-helper'
          ]
        },
        src: ['<%= gc.testsDir %>/integration/**/*.spec.js']
      },

      // functional tests = Tests the interface between systems
      functional: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          require: [
            '<%= gc.testsDir %>/helpers/chai-helper', 
            '<%= gc.testsDir %>/helpers/require-helper', 
            '<%= gc.testsDir %>/helpers/utils-helper'
          ]
        },
        src: ['<%= gc.testsDir %>/functional/**/*.spec.js']
      } 

    },


    /*--------------------------------*
     *         Code Coverage          *
     *--------------------------------*/

    // Clean out old test coverage reports before each run
    clean: {
      coverage: {
        src: ['<%= gc.testsDir %>/coverage/']
      }
    },

    // Copy all of the app files to a dir for coverage analysis 
    copy: {
      application: {
        expand: true,
        flatten: false,
        src: ['<%= gc.srcDir %>/**'],
        dest: '<%= gc.testsDir %>/coverage/instrument/'
      }
    },

    // Add coverage instrumentation to the copies of the app files
    instrument: {
      files: [
        'src/**/*.js'
      ],
      options: {
        lazy: false,
        basePath: '<%= gc.testsDir %>/coverage/instrument/'
      }
    },

    // Point the test runner at the dir with the instrumentated app files
    env: {
      coverage: {
        APP_DIR_FOR_CODE_COVERAGE: '../../<%= gc.testsDir %>/coverage/instrument/src/'
      }
    },

    // Save the raw coverage analysis data
    storeCoverage: {
      options: {
        dir: '<%= gc.testsDir %>/coverage/reports'
      }
    },

    // Generate a coverage report from the raw coverage analysis data
    makeReport: {
      src: '<%= gc.testsDir %>/coverage/reports/**/*.json',
      options: {
        type: [ 'lcov', 'text' ],
        dir: '<%= gc.testsDir %>/coverage/reports',
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
        root: '<%= gc.testsDir %>',
        dir: 'coverage/reports/'
      }
    },


    /*--------------------------------*
     *    Code Monitoring Triggers    *
     *--------------------------------*/
    
    // Run tasks whenever watched files change
    watch: {
      clear: {
        //clear terminal on any watch task
        //files: ['**/*'], 
        //or be more specific
        files: ['<%= gc.testsDir %>/**/*'], 
        tasks: ['clear']
      },
      lint: {
        files: '<%= gc.jshint.files.src %>',
        tasks: 'jshint'
      },
      // test: {
      //   files: [
      //     '<%= gc.testsDir %>/unit/*.js',
      //     '<%= gc.testsDir %>/integration/*.js'
      //     ],
      //   tasks: ['jshint', 'unit', 'integration']
      // },
      unit: {
        files: ['<%= gc.testsDir %>/unit/*.js'],
        tasks: ['jshint', 'unit']
      },
      integration: {
        files: ['<%= gc.testsDir %>/integration/*.js'],
        tasks: ['jshint', 'integration']
      }
    },

    // Restart npm server whenever watched files change
    nodemon: {
      dev: {
        script: 'apgc.js',
        options: {
          ext: 'js,json'
        }
      }
    },


    /*--------------------------------*
     *    Build Performance Helpers   *
     *--------------------------------*/

    // Run two or more grunt tasks at once in seperate processes
    concurrent: {
      target: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    },


    /*--------------------------------*
     *      Project Documentation     *
     *--------------------------------*/


    git_changelog: {  // jshint ignore:line
      //cwd: '<%= gc.buildDir %>',
      manifest: "package.json",
      history: "<%= gc.docsSrcDir %>/history.txt",
      changelog: "<%= gc.docsSrcDir %>/verb/git-changelog.md",
      changesSeparator: '\n\t*********',
      masks: [
        {
          title: 'IMPLEMENTED:\n',
          mask: /(([^\.]+\s)*(Task)(\s[^\.]+)*)/gim,
          // see http://git-scm.com/docs/git-log for mapping content
          format: ' - #%h %an %ad: %s %b', 
        },
        {
          title: 'FIXED:\n',
          mask: /(([^\.]+\s)*(Bug)(\s[^\.]+)*)/gim,
          format: ' - #%h %an %ad: %s %b'
        },
        {
          title: 'OTHERS:\n',
          mask: /./gim,
          format: ' - #%h: %s %b'
        }
      ]
    },


    // Generate README.md using verb
    verb: {
      docs: "<%= gc.docsSrcDir %>/verb",
      data: [
         "<%= gc.root %>/package.json",
         "<%= gc.docsSrcDir %>/verb/*.{json,yml}"
      ],
      readme: {
        files:[ 
          // {
          //   expand: true, 
          //   cwd: '<%= gc.docsSrcDir %>/verb', 
          //   src: ['<%= gc.docsSrcDir %>/verb/**/*.src.md'], 
          //   dest: '.', 
          //   ext: '.md'
          // },
          { 
            src:  "<%= gc.docsSrcDir %>/verb/authors.src.md", 
            dest: "<%= gc.docsSrcDir %>/verb/authors.md"
          },
          { 
            src:  "<%= gc.docsSrcDir %>/verb/README.src.md", 
            dest: "README.md"
          }
        ]
      }
    },

    // Generate docco doxs with 
    docco: {
      debug: {
        src: [
          '<%= gc.modelsSrcDir %>/**/*.js', 
          '<%= gc.testsDir %>/unit/**/*.js'
        ],
        options: {
          output: '<%= gc.buildDir %>/docs/docco'
        }
      }
    },

    // Generate JSDocs with 
    jsdoc : {
      dist : {
        //src: ['src/*.js', 'test/*.js'], 
        src: [
          '<%= gc.modelsSrcDir %>/**/*.js',
          '<%= gc.routesSrcDir %>/**/*.js',
          '<%= gc.viewsSrcDir %>/**/*.js'
        ], 
        options: {
          destination: '<%= gc.buildDir %>/docs/jsdoc',
          template: '<%= gc.root %>/node_modules/ink-docstrap/template',
          configure: "<%= gc.toolsDir %>/jsdoc.json"
        }
      }
    },

    // Generate jsdoc markdown via grunt-jsdoc-to-markdown
    jsdoc2md: {
      compileSingleFile: {
        src: [
          '<%= gc.modelsSrcDir %>/**/*.js',
          '<%= gc.routesSrcDir %>/**/*.js',
          '<%= gc.viewsSrcDir %>/**/*.js'
        ],
        dest: "<%= gc.buildDir %>/docs/jsdoc/md/singlefile_doc_markdown_for_<%= pkg.name %>.md"
      },
      compileSeperateFiles: {
        files: [
          {
            src: "<%= gc.modelsSrcDir %>/channel-type.js", 
            dest: "<%= gc.buildDir %>/docs/jsdoc/md/channel-type.md"
          }
        ]
      }
      // withOptions: {
      //     options: {
      //         index: true
      //     },
      //     src: "models/wardrobe.js",
      //     dest: "doc/with-index.md"
      // }
    },

    // Generate yuidoc via grunt-contrib-yuidoc
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        // Options mirror cli flags http://yui.github.io/yuidoc/args/index.html
        options: {
          paths: [
            '<%= gc.modelsSrcDir %>',
            '<%= gc.routesSrcDir %>',
            '<%= gc.viewsSrcDir %>'
          ],
          outdir: '<%= gc.buildDir %>/docs/yuidoc',
          exclude: "lib,docs,build",
          themedir: "node_modules/yuidoc-bootstrap-theme",
          helpers: ["node_modules/yuidoc-bootstrap-theme/helpers/helpers.js"]
        }
      }
    },

    // Push new version of docs to doc server using git
    exec: {
      // Prevents running everything with grunt exec (that would be weird)
      blocker: {
        cmd: 'echo "Do not run grunt exec by itself" && exit 1'
      },

      // Remove and rebuild the docs repository
      docsDestroy: {
        cmd: 'rm -rf <%= gc.buildDir %>/docs'
      }
      // docs_init: {
      //   cmd: 'git clone repo@myHost.ing:user/project-docs.git docs'
      // },

      // // checks for a working repository, checks for material to commit, and then performs a simple commit and a push
      // docs_publish: {
      //   // If we have initialized the docs directory, and if have something to commit, then commit it with the current message and then push
      //   cmd: '[[ ! -d .git ]] && echo "docs directory not a repository - stopping..." || (git diff-index --quiet HEAD && echo "No changes to commit" || (git commit -a -m "Docs as of `date`" && git push))',
      //   cwd: 'docs/'
      // },

      // // Verifies that we are on the branch that the docs should come from (master in this case)
      // docs_branchCheck: {
      //   cmd: '[[ "$(git rev-parse --abbrev-ref HEAD)" == "master" ]] || exit 1'
      // }

    },

 
    /*--------------------------------*
     *        Build Preparation       *
     *--------------------------------*/

    clean: {
      build: ["build"],
      release: ["release"]
    },

    /*--------------------------------*
     *        Release Automation      *
     *--------------------------------*/

    // Release automation with https://github.com/geddski/grunt-release
    // grunt release
    // grunt release:patch
    // grunt release:minor
    // grunt release:major
    // grunt release:prerelease
    release: {
      options: {
        bump: true,
        file: "<%= gc.root %>/package.json", 
        add: true,
        commit: true,
        tag: false,             //default: true
        push: true,
        pushTags: false,        //default: true
        npm: false,             //default: true
        //folder: 'folder/to/publish/to/npm', //default project root
        //tagName: 'some-tag-<%= gc.version %>', //default: '<%= gc.version %>'
        commitMessage: 'Release <%= pkg.name %> v<%= gc.version %>', //default: 'release <%= gc.version %>'
        //tagMessage: 'tagging version <%= gc.version %>', //default: 'Version <%= gc.version %>',
        github: {
          repo: "<%= gc.githubAccount %>/<%= pkg.name %>",   // Github repo here
          usernameVar: 'GITHUB_USERNAME', //ENVIRONMENT VARIABLE that contains Github username
          passwordVar: 'GITHUB_PASSWORD'  //ENVIRONMENT VARIABLE that contains Github password
        }
      }
    },

    // Maintain a build number in https://github.com/creynders/grunt-build-number
    buildnumber: {
      //files: ['package.json', 'bower.json'],
      package : {}
    },

    // Get the git revision code
    "git-describe": {
      options: {
        template: "{%=tag%}-{%=since%}-{%=object%}{%=dirty%}"
      }
    }


  });

  // Allows you to run a test on a single file
  grunt.registerTask('spec', 'Runs a task on a specified file', function (taskName, fileName) {
    gc.file = fileName;
    grunt.log.writeln(gc.file);
    grunt.log.writeln(taskName + ':spec');
    grunt.task.run(taskName + ':spec');
  });


  // Load grunt tasks from package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  // Define tasks -----------------------

  // Collect git info to determine a version tag
  grunt.registerTask('saveRevision', function() {
    grunt.event.once('git-describe', function (rev) {
      grunt.option('gitRevision', rev);
    });
    grunt.task.run('git-describe');
  });

  // Save the git info to version.json
  grunt.registerTask('tagRevision', 'Tag the current build revision', function () {
    grunt.task.requires('git-describe');
    // Make sure our package details are current
    var p = grunt.file.readJSON('package.json');
    grunt.file.write('public/version.json', JSON.stringify({
      build: gc.build,
      version: grunt.config('pkg.version'),
      revision: grunt.option('gitRevision'),
      date: grunt.template.today()
    }));
  });

  // Update public/version.json
  grunt.registerTask('version', ['saveRevision', 'tagRevision']);
  
  // Rebuild the changelog
  grunt.registerTask('changelog', ['git_changelog']);  

  // Rebuild the readme
  grunt.registerTask('readme', ['verb:readme']);  

  // Bumps the build number and updates the version file
  grunt.registerTask('build', [
    'buildnumber',   // Increment the build numbers
    'version',       // Generate the version.json
    'readme'         // Rebuild the readme
  ]); 

  // Check or enforce coding standards
  grunt.registerTask('polish', ['jsbeautifier:modify', 'jshint']);
  grunt.registerTask('verify', ['jsbeautifier:verify', 'jshint']);

  // Testing tasks
  grunt.registerTask('test', ['mochaTest:unit', 'mochaTest:integration', 'mochaTest:functional']);  
  grunt.registerTask('unit', ['mochaTest:unit']);  
  grunt.registerTask('integration', ['mochaTest:integration']);  
  grunt.registerTask('functional', ['mochaTest:functional']);  

  // Code coverage task
  grunt.registerTask('cover', [
    'jshint', 
    'clean', 
    'copy:application', 
    'env:coverage', 
    'instrument', 
    'test', 
    'storeCoverage', 
    'makeReport', 
    'coverage'
  ]);

  // Tasks for generating docs
  grunt.registerTask("doc", ['exec:docsDestroy', 'docco', 'jsdocs', 'yuidocs', 'verb:readme']);
  grunt.registerTask("jsdocs", ['jsdoc', 'jsdoc2md']);
  grunt.registerTask('yuidocs', ['yuidoc:compile']);
  //grunt.registerTask('docs', ['exec:docs_branchCheck', 'yuidoc:compile', 'exec:docs_publish']);
  //grunt.registerTask('docs_fix', ['exec:docs_destroy', 'exec:docs_init']);

  // Code monitoring - Watch for code changes and run tests or restart server as necessary
  grunt.registerTask('server', ['concurrent:target']);

  // Default to syntax help and code monitoring
  grunt.registerTask('default', ['jshint', 'server']);


};
