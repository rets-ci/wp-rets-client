(function( window, $ ) {

  var current_image;
  var isOpen = false;
  $( document ).ready( function() {
    $( '#toggle-advanced' ).click( function() {
      if( isOpen ) {
        $( this ).attr( 'value', 'Show advanced settings' );
        $( '#advanced_settings' ).fadeOut();
      } else {
        $( this ).attr( 'value', 'Hide advanced settings' );
        $( '#advanced_settings' ).fadeIn();
      }

      isOpen = !isOpen;
    } );

    // Uploading files for 3.5
    var file_frame;
    if( window.wp ) {
      $( '.upload_image' ).bind( 'click', function( event ) {

        var _this = $( this );
        event.preventDefault();

        // Create the media frame.
        file_frame = wp.media.frames.file_frame = wp.media( {
          title: $( this ).data( 'uploader_title' ),
          button: {
            text: $( this ).data( 'uploader_button_text' )
          },
          multiple: false  // Set to true to allow multiple files to be selected
        } );

        // When an image is selected, run a callback.
        file_frame.on( 'select', function() {
          // We set multiple to false so only get one image from the uploader
          attachment = file_frame.state().get( 'selection' ).first().toJSON();

          // Do something with attachment.id and/or attachment.url here
          _this.siblings( '.image_input' ).val( attachment.url );
          _this.siblings( '.image_holder' ).attr( 'src', attachment.url ).show();
        } );

        // Finally, open the modal
        file_frame.open();
      } );

    } else {
      // Uploading files for pre 3.5
      $( '.upload_image' ).click( function() {
        current_image = $( this );
        formfield = current_image.siblings( '.image_input' ).attr( 'name' );
        tb_show( '', 'media-upload.php?type=image&amp;TB_iframe=true' );
        return false;
      } );
      // send url back to plugin editor
      window.send_to_editor = function( html ) {
        imgurl = $( 'img', html ).attr( 'src' );
        current_image.siblings( '.image_input' ).val( imgurl );
        current_image.siblings( '.image_holder' ).attr( 'src', imgurl ).show();
        tb_remove();
      }
    }

    $( '.remove_image' ).bind( 'click', function( event ) {
      var _this = $( this );
      _this.siblings( '.image_input' ).val( '' );
      _this.siblings( '.image_holder' ).removeAttr( 'src' ).hide();
    } );

  } );

})( window, jQuery );