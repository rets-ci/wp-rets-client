/**
 * Theme Build.
 *
 * @author potanin@UD
 * @version 1.1.2
 * @param grunt
 */
module.exports = function themeBuild( grunt ) {

  grunt.initConfig( {

    // Read Composer File.
    package: grunt.file.readJSON( 'composer.json' ),

    // Generate Documentation.
    yuidoc: {
      compile: {
        name: '<%= package.name %>',
        description: '<%= package.description %>',
        version: '<%= package.version %>',
        url: '<%= package.homepage %>',
        options: {
          paths: [ 'lib', 'scripts' ],
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
        files: [
          {
            expand: true,
            cwd: 'css/src',
            src: [ '*.less' ],
            dest: 'css',
            rename: function( dest, src, options ) {
              return dest + src.replace( '.less', '.css' );
            }
          }
        ]
      },
      production: {
        options: {
          yuicompress: true,
          relativeUrls: true
        },
        files: [
          {
            expand: true,
            cwd: 'css/src',
            src: [ '*.less' ],
            dest: 'css',
            rename: function( dest, src, options ) {
              return dest + src.replace( '.less', '.min.css' );
            }
          }
        ]
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
          'css/src/*.*'
        ],
        tasks: [ 'less' ]
      },
      js: {
        files: [
          'js/src/*.*'
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
            cwd: 'js/src',
            src: [ '*.js' ],
            dest: 'js'
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
            cwd: 'js/src',
            src: [ '*.js' ],
            dest: 'js'
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
    }

  });

  // Load NPM Tasks.
  grunt.loadNpmTasks( 'grunt-markdown' );
  grunt.loadNpmTasks( 'grunt-contrib-yuidoc' );
  grunt.loadNpmTasks( 'grunt-contrib-uglify' );
  grunt.loadNpmTasks( 'grunt-contrib-watch' );
  grunt.loadNpmTasks( 'grunt-contrib-less' );

  // Register  Default.
  grunt.registerTask( 'default', [ 'markdown', 'less' , 'yuidoc', 'uglify' ] );

  // Build Distribution.
  grunt.registerTask( 'distribution', [ 'markdown', 'less:production', 'uglify:production' ] );

  // Update.
  grunt.registerTask( 'update', [ 'markdown', 'yuidoc' ] );

};