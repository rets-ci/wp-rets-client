/**
 * Library Build.
 *
 * @author potanin@UD
 * @version 1.1.2
 * @param grunt
 */
module.exports = function build( grunt ) {

  // Automatically Load Tasks
  require( 'load-grunt-tasks' )( grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: 'devDependencies'
  } );

  grunt.initConfig( {

    // Read Composer File.
    pkg: grunt.file.readJSON( 'composer.json' ),

    // Compile LESS.
    less: {
      development: {
        options: {
          relativeUrls: true
        },
        files: {
          'styles/wp.theme.dev.css': [ 'styles/src/wp.theme.less' ]
        }
      },
      production: {
        options: {
          yuicompress: true,
          relativeUrls: true
        },
        files: {
          'styles/wp.theme.css': [ 'styles/src/wp.theme.less' ]
        }
      }
    },

    // Development Watch.
    watch: {
      options: {
        interval: 100,
        debounceDelay: 500
      },
      less: {
        files: [
          'styles/src/*.*'
        ],
        tasks: [ 'less' ]
      },
      js: {
        files: [
          'scripts/src/*.*'
        ],
        tasks: [ 'uglify' ]
      }
    },

    // Uglify Scripts.
    uglify: {
      development: {
        options: {
          preserveComments: true,
          beautify: true,
          wrap: false
        },
        files: [
          {
            expand: true,
            cwd: 'scripts/src',
            src: [ '*.js' ],
            dest: 'scripts'
          }
        ]
      },
      production: {
        options: {
          preserveComments: false,
          wrap: false
        },
        files: [
          {
            expand: true,
            cwd: 'scripts/src',
            src: [ '*.js' ],
            dest: 'scripts'
          }
        ]
      }
    },

    // Generate Markdown.
    markdown: {
      all: {
        files: [
          {
            expand: true,
            src: 'readme.md',
            dest: 'static/',
            ext: '.html'
          }
        ],
        options: {
          markdownOptions: {
            gfm: true,
            codeLines: {
              before: '<span>',
              after: '</span>'
            }
          }
        }
      }
    },

    // Clean for Development.
    clean: {
      all: [
        "vendor",
        "static/readme.md",
        "composer.lock",
        "styles/*.css",
        "scripts/*.js"
      ],
      update: [
        "composer.lock"
      ]
    },

    // CLI Commands.
    shell: {
      update: {
        options: {
          stdout: true
        },
        command: 'composer update --prefer-source'
      }
    },

    // Coverage Tests.
    mochacov: {
      options: {
        reporter: 'list',
        requires: [ 'should' ]
      },
      all: [ 'test/*.js' ]
    },

    // Usage Tests.
    mochacli: {
      options: {
        requires: [ 'should' ],
        reporter: 'list',
        ui: 'exports',
        bail: false
      },
      all: [
        'test/*.js'
      ]
    }

  });

  // Register NPM Tasks.
  grunt.registerTask( 'default', [ 'markdown', 'less', 'uglify' ] );

  // Build Distribution.
  grunt.registerTask( 'distribution', [ 'mochacli:all', 'mochacov:all', 'clean:all', 'markdown', 'less:production', 'uglify:production' ] );

  // Update Environment.
  grunt.registerTask( 'update', [ 'clean:update', 'shell:update' ] );

};