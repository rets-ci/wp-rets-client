module.exports = function(grunt) {
  require('jit-grunt')(grunt);

  grunt.initConfig({
    less: {
      development: {
        options: {
          compress: false,
          yuicompress: false,
          optimization: 2
        },
        files: {
          "static/styles/style.css": "static/styles/src/style.less" // destination file and source file
        }
      }
    },
    watch: {
      styles: {
        files: ['static/styles/src/*'], // which files to watch
        tasks: ['lessDelayed'],
        options: {
          nospawn: true,
          debounceDelay: 500
        }
      }
    }
  });

  grunt.registerTask('lessDelayed', 'Delay LESS processing', function lessDelayed() {
    console.log( 'less delayed');

    // delay before runnign less
    setTimeout(function() {
      grunt.task.run('less');
    }, 2000 );


  });

  grunt.registerTask('default', ['less']);

};
