/**
 * Admin
 *
 */
define( 'udx.wp.admin', [ 'udx.utility' ], function Admin() {
  console.debug( 'udx.wp.admin', 'loaded' );

  return function domnReady() {
    console.debug( 'udx.wp.admin', 'ready' );

    if( typeof prettyPrint == 'function' ) {
      prettyPrint();
    }

    if( typeof jQuery.prototype.datepicker === 'function' ) {
      jQuery( '.flawless_datepicker' ).datepicker();
    }

    if( typeof jQuery.fn.sortable == 'function' ) {
      jQuery( ".flawless_sortable_wrapper" ).each( function() {
        jQuery( ".flawless_sortable_attributes", this ).sortable();
      } );
    }

    jQuery( "#cfct-copy-build-data" ).click( "live", function( event ) {
      event.preventDefault();

      var params = {};

      params.action = 'cbc_get_page_build';
      params.post_id = jQuery( "input#post_ID" ).val();

      jQuery.post( ajaxurl, params, function( result ) {

        jQuery( ".cb_page_data" ).remove();

        jQuery( "<div class='cb_page_data'><textarea style='width: 100%;margin: 0 0 10px 0; height: 200px;' readonly='true'>" + result.content + "</textarea></div>" ).insertAfter( "#titlediv" );

      }, "json" );

    } );

    jQuery( "#cfct-paste-build-data" ).click( "live", function( event ) {
      event.preventDefault();

      var params = {};

      var post_data = prompt( "Paste the serialized data below." );

      params.action = 'cbc_insert_page_build';
      params.post_id = jQuery( "input#post_ID" ).val();
      params.post_data = post_data;

      jQuery.ajax( {
        url: ajaxurl,
        data: params,
        type: "post",
        dataType: "json",
        success: function( result ) {

          jQuery( ".cb_page_data" ).remove();

          if( result.success == 'true' ) {
            alert( 'Done. Reload page.' );
          } else {
            alert( 'Error.' );
          }

        }
      } );

    } );

    /**
     * Set custom class for entire build
     *
     * @author Usability Dynamics, Inc.
     */
    jQuery( '#cfct-set-build-class' ).live( 'click', function( e ) {

      e.preventDefault();

      var this_button = this;

      var current_setting = jQuery( this_button ).attr( 'current_setting' ) ? jQuery( this_button ).attr( 'current_setting' ) : '';
      var post_id = jQuery( "#post_ID" ).val();

      var new_setting = prompt( "Build Class:", current_setting );

      /* If "Cancel" is pressed */
      if( new_setting === null ) {
        return;
      }

      if( new_setting == current_setting ) {
        return;
      }

      jQuery.ajax( {
        url: ajaxurl,
        data: {
          action: 'flawless_cb_build_class',
          post_id: post_id,
          new_class: new_setting
        },
        success: function( result ) {
          jQuery( this_button ).attr( 'current_setting', new_setting );
        },
        dataType: "json"
      } );

    } );

    /**
     * Adds click handlers for the change post type option under edit posts.
     *
     * @author Willis@UD
     */
    jQuery( '.misc-pub-section.curtime.misc-pub-section-last' ).removeClass( 'misc-pub-section-last' );

    jQuery( '#edit-post-type-change' ).click( function( e ) {
      jQuery( this ).hide();
      jQuery( '#post-type-select' ).slideDown();
      e.preventDefault();
    } );

    jQuery( '#save-post-type-change' ).click( function( e ) {
      jQuery( '#post-type-select' ).slideUp();
      jQuery( '#edit-post-type-change' ).show();
      jQuery( '#post-type-display' ).text( jQuery( '#flawless_cpt_post_type :selected' ).text() );
      e.preventDefault();
    } );

    jQuery( '#cancel-post-type-change' ).click( function( e ) {
      jQuery( '#post-type-select' ).slideUp();
      jQuery( '#edit-post-type-change' ).show();
      e.preventDefault();
    } );

    /**
     * Shows custom row class entry box and saves it via AJAX
     *
     * @todo Test how this works with new posts that don't have an ID
     * @author Usability Dynamics, Inc.
     */
    jQuery( '#cfct-sortables' ).find( '.cfct-add-row-class' ).live( 'click', function( e ) {

      e.preventDefault();

      var this_button = this;

      var row_class = jQuery( this_button ).attr( 'data-row-class' );
      var current_setting = jQuery( this_button ).attr( 'data-current-setting' ) ? jQuery( this_button ).attr( 'data-current-setting' ) : '';
      var row_element = jQuery( this_button ).closest( "." + row_class );
      var row_id = jQuery( row_element ).attr( "id" );
      var post_id = jQuery( "#post_ID" ).val();

      var new_setting = prompt( "Row Class:", current_setting );

      /* If "Cancel" is pressed */
      if( new_setting === null ) {
        return;
      }

      if( new_setting == current_setting ) {
        return;
      }

      jQuery.ajax( {
        url: ajaxurl,
        data: {
          action: 'flawless_cb_row_class',
          post_id: post_id,
          row_id: row_id,
          row_class: row_class,
          new_class: new_setting
        },
        success: function( result ) {
          jQuery( this_button ).attr( 'data-current-setting', new_setting );
        },
        dataType: "json"
      } );

    } );

    return this;

  };

} );

