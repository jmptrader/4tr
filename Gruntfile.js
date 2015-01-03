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

  // Lets time grunt execution
  require('time-grunt')(grunt);

  // Load grunt tasks from package.json
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


  // Prepare a banner
  var banner = '/*\n<%= pkg.name %> <%= pkg.version %>';
      banner += '- <%= pkg.description %>\n<%= pkg.repository.url %>\n';
      banner += 'Built on <%= grunt.template.today("yyyy-mm-dd") %>\n*/\n';

  // Task configurations
  grunt.initConfig({

    // Pull in the package details
    pkg: grunt.file.readJSON('package.json'),

    /*--------------------------------*
     *        Release Automation      *
     *--------------------------------*/

    git_changelog: {
      cwd: 'changes',
      manifest: "../package.json",
      history: "history.txt",
      changelog: "changelog.txt",
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


    // Release automation with https://github.com/geddski/grunt-release
    // grunt release
    // grunt release:patch
    // grunt release:minor
    // grunt release:major
    // grunt release:prerelease
    release: {
      options: {
        bump: true,
        file: 'package.json', 
        add: true,
        commit: true,
        tag: false,             //default: true
        push: true,
        pushTags: false,        //default: true
        npm: false,             //default: true
        //folder: 'folder/to/publish/to/npm', //default project root
        //tagName: 'some-tag-<%= version %>', //default: '<%= version %>'
        commitMessage: 'Release <%= pkg.name %> v<%= version %>', //default: 'release <%= version %>'
        //tagMessage: 'tagging version <%= version %>', //default: 'Version <%= version %>',
        github: {
          repo: 'jwtd/<%= pkg.name %>',   // Github repo here
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
      },
      your_target: {
        // Target-specific file lists and/or options go here.
      },
    },


    /*--------------------------------*
     *        Code Conventions        *
     *--------------------------------*/

    // Static code analysis and code style enforcement
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

    // Code formatting : https://www.npmjs.com/package/grunt-jsbeautifier
    // Exclude files : ['!foo/bar.js'],
    jsbeautifier : {
      modify: {
        src: ['Gruntfile.js', 'models/**/*.js'],
        options: {
          config: '.jsbeautifyrc'
        }
      },
      verify: {
        src: ['Gruntfile.js', 'models/**/*.js'],
        options: {
          mode: 'VERIFY_ONLY',
          config: '.jsbeautifyrc'
        }
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

    // Generate docco doxs with 
    docco: {
      debug: {
        src: ['models/**/*.js', 'tests/unit/**/*.js'],
        options: {
          output: 'docs/docco'
        }
      }
    },

    // Generate JSDocs with 
    jsdoc : {
      dist : {
        //src: ['src/*.js', 'test/*.js'], 
        src: ['models/**/*.js'], 
        options: {
          destination: 'docs/jsdoc',
          template: './node_modules/ink-docstrap/template',
          configure: ".jsdoc"
        }
      }
    },

    // Generate jsdoc markdown via grunt-jsdoc-to-markdown
    jsdoc2md: {
      compileSingleFile: {
        src: "models/**/*.js",
        dest: "docs/jsdoc/md/singlefile_doc_markdown_for_<%= pkg.name %>.md"
      },
      compileSeperateFiles: {
        files: [
          {src: "models/channel-type.js", dest: "docs/jsdoc/md/channel-type.md"}
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
          paths: 'models',
          outdir: 'docs/yuidoc',
          exclude: "lib,docs,build",
          themedir: "node_modules/yuidoc-bootstrap-theme",
          helpers: ["node_modules/yuidoc-bootstrap-theme/helpers/helpers.js"]
        }
      }
    },

    // Doc generation helpers
    exec: {
      // Prevents running everything with grunt exec (that would be weird)
      blocker: {
        cmd: 'echo "Do not run grunt exec by itself" && exit 1'
      },

      // Remove and rebuild the docs repository
      docs_destroy: {
        cmd: 'rm -rf docs'
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
    }

  });

  // Define tasks -----------------------

  // Collect git info to determine a version tag
  grunt.registerTask('saveRevision', function() {
    grunt.event.once('git-describe', function (rev) {
      grunt.option('gitRevision', rev);
    });
    grunt.task.run('git-describe');
  });

  // Save the git info to version.json
  grunt.registerTask('tag-revision', 'Tag the current build revision', function () {
    grunt.task.requires('git-describe');
    // Make sure our package details are current
    var p = grunt.file.readJSON('package.json')
    grunt.file.write('public/version.json', JSON.stringify({
      build: p.build,
      version: grunt.config('pkg.version'),
      revision: grunt.option('gitRevision'),
      date: grunt.template.today()
    }));
  });

  // Generate/update a public/version.json
  grunt.registerTask('version', ['saveRevision', 'tag-revision']);

  // Bumps the build number and updates the version file
  grunt.registerTask('build', [
    'buildnumber',   // Increment the build numbers
    'version'        // Generate the version.json
  ]); 

  // Check or enforce coding standards
  grunt.registerTask('polish', ['jsbeautifier:modify', 'jshint']);
  grunt.registerTask('verify', ['jsbeautifier:verify', 'jshint']);

  // Testing tasks
  grunt.registerTask('test', ['mochaTest:unit', 'mochaTest:integration']);  
  grunt.registerTask('unit', ['mochaTest:unit']);  
  grunt.registerTask('integration', ['mochaTest:integration']);  

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
  grunt.registerTask("doc", ['exec:docs_destroy', 'docco', 'jsdocs', 'yuidocs']);
  grunt.registerTask("jsdocs", ['jsdoc', 'jsdoc2md']);
  grunt.registerTask('yuidocs', ['yuidoc:compile']);
  //grunt.registerTask('docs', ['exec:docs_branchCheck', 'yuidoc:compile', 'exec:docs_publish']);
  //grunt.registerTask('docs_fix', ['exec:docs_destroy', 'exec:docs_init']);

  // Code monitoring - Watch for code changes and run tests or restart server as necessary
  grunt.registerTask('server', ['concurrent:target']);

  // Default to syntax help and code monitoring
  grunt.registerTask('default', ['jshint', 'server']);


};
