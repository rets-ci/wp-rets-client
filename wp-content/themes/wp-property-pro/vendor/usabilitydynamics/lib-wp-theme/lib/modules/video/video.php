<?php

//** Ensure cfct_build_module class is loaded */
if( !class_exists( 'cfct_build_module' ) ) {
  return;
}

/**
 * Flawless Group Loop Module
 *
 * Used to query BuddyPress Groups when BuddyPress is active.
 *
 * @author potanin@UD
 */
class VideoModule extends cfct_build_module {

  public function __construct() {
    $opts = array(
      'description' => __( 'Embed Video.', 'flawless' ),
      'icon'        => plugins_url( '/icon.png', __DIR__ )
    );

    //** Not best option, but inherits some things we need */
    parent::__construct( 'cfct-module-loop', __( 'Video', 'flawless' ), $opts );

  }

  /**
   * Renders the screencast video.
   *
   * @param $data
   *
   * @return array
   */
  public function display( $data ) {

    if( !$data[ $this->get_field_id( 'have_result' ) ] ) {
      return;
    }

    return '<div class="screencast_video">' . $data[ $this->get_field_id( 'embed_object' ) ] . '</div>';

  }

  /**
   * Get the Embed Object on save and cache it
   *
   * @param array $new_data
   * @param array $old_data
   *
   * @return array
   */
  public function update( $new_data, $old_data ) {

    $url = $new_data[ $this->get_field_id( 'video_url' ) ];

    $new_data[ $this->get_field_id( 'have_result' ) ] = false;

    if( strpos( $url, 'youtube.com/' ) ) {
      $new_data[ $this->get_field_id( 'embed_object' ) ] = '<object width="425" height="350"><param name="movie" value="' . $url . '" /><param name="wmode" value="transparent" /><embed src="' . $url . '" type="application/x-shockwave-flash" wmode="transparent" width="425" height="350" />';
      $new_data[ $this->get_field_id( 'have_result' ) ]  = true;
    }

    if( preg_match( '/screencast.com\/t\//', $url ) > 0 ) {

      $html = file_get_html( $url );

      if( $new_data[ $this->get_field_id( 'width' ) ] > 0 ) {
        $html->find( 'object#scPlayer', 0 )->width = $new_data[ $this->get_field_id( 'width' ) ];
        $html->find( 'iframe', 0 )->width          = $new_data[ $this->get_field_id( 'width' ) ];
      } else {
        $html->find( 'object#scPlayer', 0 )->width = get_option( 'embed_size_w' );
        $html->find( 'iframe', 0 )->width          = get_option( 'embed_size_w' );
      }

      if( $new_data[ $this->get_field_id( 'height' ) ] > 0 ) {
        $html->find( 'object#scPlayer', 0 )->height = $new_data[ $this->get_field_id( 'height' ) ];
        $html->find( 'iframe', 0 )->height          = $new_data[ $this->get_field_id( 'height' ) ];
      } else {
        $html->find( 'object#scPlayer', 0 )->height = get_option( 'embed_size_h' );
        $html->find( 'iframe', 0 )->height          = get_option( 'embed_size_h' );
      }

      $embed = $html->find( 'div#mediaDisplayArea', 0 )->innertext;

      if( !empty( $embed ) ) {
        $new_data[ $this->get_field_id( 'embed_object' ) ] = $embed;
        $new_data[ $this->get_field_id( 'have_result' ) ]  = true;
      }

    }

    return $new_data;
  }

  /**
   * Output the Admin Form
   *
   * @param array $data - saved module data
   *
   * @return string HTML
   */
  public function admin_form( $data ) {

    $html[ ] = '<div id="' . $this->id_base . '-admin-form-wrapper">';
    ob_start(); ?>

    <script type="text/javascript">
        jQuery( document ).ready( function() {

          jQuery( "#<?php echo $this->get_field_id( 'width' ); ?>" ).change( function() {

            var height = Math.round( ( jQuery( this ).val() / 4 * 3 ) );
            jQuery( "#<?php echo $this->get_field_id( 'height' ); ?>" ).val( height );

          } );

        } );
      </script>
    
    <style type="text/css">
        .small_input {
          width: 50px !important;
        }
      </style>

    <label>Screencast.com URL
      <input type="text" id="<?php echo $this->get_field_id( 'video_url' ); ?>" name="<?php echo $this->get_field_name( 'video_url' ); ?>" value="<?php echo $data[ $this->get_field_name( 'video_url' ) ]; ?>"/>
      </label>

    <label>Width:
      <input type="text" class="small_input" id="<?php echo $this->get_field_id( 'width' ); ?>" name="<?php echo $this->get_field_name( 'width' ); ?>" value="<?php echo $data[ $this->get_field_name( 'width' ) ]; ?>"/>px
      </label>

    <label>Height:
      <input type="text" class="small_input" id="<?php echo $this->get_field_id( 'height' ); ?>" name="<?php echo $this->get_field_name( 'height' ); ?>" value="<?php echo $data[ $this->get_field_name( 'height' ) ]; ?>"/>px
      </label>

    <?php $html[ ] = ob_get_contents();
    ob_end_clean();

    $html[ ] = '</div>';

    $html = apply_filters( 'VideoModule::admin_form', $html, $this );

    return implode( '', ( array ) $html );

  }

  public function text( $data ) {
    if( $data[ $this->get_field_id( 'have_result' ) ] ) {
      return "Video loaded.";
    } else {
      return "Could not load video.";
    }

  }

}


