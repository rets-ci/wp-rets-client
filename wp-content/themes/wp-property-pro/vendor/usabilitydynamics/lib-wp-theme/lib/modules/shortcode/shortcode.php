<?php

if( !class_exists( 'ShortcodeModule' ) ) {

  class ShortcodeModule extends cfct_build_module {
    protected $_deprecated_id = 'cfct_module_shortcode';

    /**
     * Set up the module
     */
    public function __construct() {
      $opts = array(
        'description' => __( 'Insert a shortcode into the layout.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );

      // use if this module is to have no user configurable options
      // Will suppress the module edit button in the admin module display
      # $this->editable = false

      parent::__construct( 'cfct-shortcode', __( 'Shortcode', 'carrington-build' ), $opts );
    }

    /**
     * Display the module content in the Post-Content
     *
     * @param array $data - saved module data
     *
     * @return array string HTML
     */
    public function display( $data ) {
      $text = do_shortcode( $data[ $this->get_field_name( 'content' ) ] );

      return $this->load_view( $data, compact( 'text' ) );
    }

    /**
     * Build the admin form
     *
     * @param array $data - saved module data
     *
     * @return string HTML
     */
    public function admin_form( $data ) {
      global $shortcode_tags;

      /*
      if( !empty( $shortcode_tags ) && is_array( $shortcode_tags ) ) {

        $tags = @array_unique( $shortcode_tags );

        ksort( $tags );

        foreach( (array) $tags as $shortcode => $func ) {
          if( is_array( $func ) && substr( $func[ 1 ], 0, 1 ) != '_' ) {
            $filtered_tags[ ] = $shortcode;
          } elseif( substr( $func, 0, 1 ) != '_' ) { // not sure how relevant this is any more
            $filtered_tags[ ] = $shortcode;
          }
        }

        $hints = '[' . implode( '], [', $filtered_tags ) . ']';

      } else {
        $hints = '(none)';
      } */

      return '
        <div>
          <label for="' . $this->get_field_id( 'content' ) . '">' . __( 'Enter a Shortcode <span class="help">include the [brackets]</span>', 'carrington-build' ) . '</label>
          <input type="text" name="' . $this->get_field_name( 'content' ) . '" id="' . $this->get_field_id( 'content' ) . '" value="' . ( !empty( $data[ $this->get_field_id( 'content' ) ] ) ? esc_attr( $data[ $this->get_field_id( 'content' ) ] ) : '' ) . '" />
        </div>';
        //<p>' . __( 'Available shortcodes:', 'carrington-build' ) . ' ' . $hints . '</p>';

    }

    /**
     * Return a textual representation of this module.
     *
     * @param array $data - saved module data
     *
     * @return string text
     */
    public function text( $data ) {
      // Some shortcodes, like [gallery], have problems if there isn't
      // a post.  There's not much we can do about that here, so @ to
      // silence the complaints.
      return strip_tags( @do_shortcode( $data[ $this->get_field_id( 'content' ) ] ) );
    }

    /**
     * Modify the data before it is saved, or not
     *
     * @param array $new_data
     * @param array $old_data
     *
     * @return array
     */
    public function update( $new_data, $old_data ) {
      return $new_data;
    }

    /**
     * Add custom css to the post/page admin
     *
     * @return string CSS
     */
    public function admin_css() {
      return '
#cfct-shortcode-edit-form .help {
	color: #777;
	font-size: 11px;
}
		';
    }
  }

}

