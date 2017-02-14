/**
 * Model Loader
 *
 */
define( 'udx.model', [ 'udx.utility', 'async', 'jquery' ], function Model() {
  console.debug( 'udx.utility.model', 'loaded' );

  var Auto      = require( 'async' ).auto;
  var Series    = require( 'async' ).series;
  var Utility   = require( 'udx.utility' );

  return {

    /**
     * Load Model
     *
     * @constructor
     */
    load: function getModel( model, callback ) {
      console.debug( 'udx.utility.model', 'load()' );

      return jQuery.ajax({
        url: _ajax,
        cache: false,
        dataType: 'json',
        data: {
          action: 'wpp_xmli_model',
          model: model || 'state'
        },
        complete: function haveResponse() {
          var response;

          if( arguments[0].responseJSON ) {
            response = arguments[0].responseJSON;
          }

          if( 'object' === typeof response && response.ok && response.data ) {
            return callback( null, response.data );
          }

          return callback( new Error( 'Could not load model.' ) );

        }
      });

    },

    /**
     * Load Multiple Models
     *
     */
    loadMultiple: function loadMultiple() {}

  }



});