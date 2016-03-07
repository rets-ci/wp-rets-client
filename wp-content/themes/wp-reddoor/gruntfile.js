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
        tasks: ['less'],
        options: {
          nospawn: true
        }
      }
    }
  });

  grunt.registerTask('default', ['less']);

};
