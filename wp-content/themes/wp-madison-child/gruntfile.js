/**
 * Build Theme
 *
 * @author Usability Dynamics, Inc.
 * @version 2.0.0
 * @param grunt
 */
module.exports = function build( grunt ) {

  // Automatically Load Tasks.
  require( 'load-grunt-tasks' )( grunt, {
    pattern: 'grunt-*',
    config: './package.json',
    scope: 'devDependencies'
  });

  grunt.initConfig( {

    // Compile LESS
    less: {
      production: {
        options: {
          yuicompress: true,
          relativeUrls: true
        },
        files: {
          'style.css' : 'static/less/style.less',
          'lib/so_widgets/so-property-carousel-widget/css/style.css' : 'lib/so_widgets/so-property-carousel-widget/css/style.less',
          'lib/so_widgets/so-tabs-unit-widget/css/style.css' : 'lib/so_widgets/so-tabs-unit-widget/css/style.less'
        }
      }
    },

    watch: {
      options: {
        interval: 100,
        debounceDelay: 500
      },
      less: {
        files: [
          'static/less/*.*',
          'lib/so_widgets/so-property-carousel-widget/css/*.*',
          'lib/so_widgets/so-tabs-unit-widget/css/*.*'
        ],
        tasks: [ 'less' ]
      },
      js: {
        files: [
          'static/js/src/*.*'
        ],
        tasks: [ 'uglify' ]
      }
    },

    uglify: {
      production: {
        options: {
          mangle: false,
          beautify: false
        },
        files: [
          {
            expand: true,
            cwd: 'static/js/src',
            src: [ '*.js' ],
            dest: 'static/js'
          }
        ]
      },
      staging: {
        options: {
          mangle: false,
          beautify: true
        },
        files: [
          {
            expand: true,
            cwd: 'static/js/src',
            src: [ '*.js' ],
            dest: 'static/js'
          }
        ]
      }
    }

  });

  // Register tasks
  grunt.registerTask( 'default', [ 'less' , 'uglify' ] );

};
