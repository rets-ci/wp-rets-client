/**
 * Library Build.
 *
 * @author potanin@UD
 * @version 1.1.2
 * @param grunt
 */
module.exports = function build( grunt ) {

  grunt.initConfig( {

    // Read Composer File.
    pkg: grunt.file.readJSON( 'composer.json' ),

    // Generate Documentation.
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          paths: 'lib',
          outdir: 'static/codex/'
        }
      }
    },

    // Compile LESS.
    less: {
      development: {
        options: {
          relativeUrls: true
        },
        files: {
        }
      },
      production: {
        options: {
          yuicompress: true,
          relativeUrls: true
        },
        files: {
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
          'static/styles/src/*.*'
        ],
        tasks: [ 'less' ]
      },
      js: {
        files: [
          'static/scripts/src/*.*'
        ],
        tasks: [ 'uglify' ]
      }
    },

    // Uglify Scripts.
    uglify: {
      production: {
        options: {
          preserveComments: false,
          wrap: false
        },
        files: [
          {
            expand: true,
            cwd: 'static/scripts/src',
            src: [ '*.js' ],
            dest: 'static/scripts'
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
        "static/styles/*.css",
        "static/scripts/*.js"
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

  // Load NPM Tasks.
  grunt.loadNpmTasks( 'grunt-markdown' );
  grunt.loadNpmTasks( 'grunt-requirejs' );
  grunt.loadNpmTasks( 'grunt-contrib-yuidoc' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-less' );
  grunt.loadNpmTasks( 'grunt-contrib-concat' );
  grunt.loadNpmTasks( 'grunt-contrib-clean' );
  grunt.loadNpmTasks( 'grunt-shell' );
  grunt.loadNpmTasks( 'grunt-mocha-cli' );
  grunt.loadNpmTasks( 'grunt-mocha-cov' );

  // Register NPM Tasks.
  grunt.registerTask( 'default', [ 'markdown', 'less' , 'yuidoc', 'uglify' ] );

  // Build Distribution.
  grunt.registerTask( 'distribution', [ 'mochacli:all', 'mochacov:all', 'clean:all', 'markdown', 'less:production', 'uglify:production' ] );

  // Update Environment.
  grunt.registerTask( 'update', [ 'clean:update', 'shell:update' ] );

};