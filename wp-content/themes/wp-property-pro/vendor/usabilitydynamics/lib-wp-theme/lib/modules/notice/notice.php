<?php

if( !class_exists( 'NoticeModule' ) ) {
  class NoticeModule extends cfct_build_module {
    protected $_deprecated_id = 'cfct-notice'; // deprecated property, not needed for new module development

    // remove padding from the popup-content form
    protected $admin_form_fullscreen = true;

    public function __construct() {
      $opts = array(
        'description' => __( 'Add a notice/alert area to the layout.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );
      parent::__construct( 'cfct-notice', __( 'Notice', 'carrington-build' ), $opts );
    }

    public function display( $data ) {
      $content = $this->wp_formatting( $data[ $this->get_field_id( 'content' ) ] );

      return $this->load_view( $data, compact( 'content' ) );

    }

    public function admin_form( $data ) {
      $ret = '
				<div class="cfct-textarea-wrapper-plain">
					<textarea class="cfct-textarea-full" name="' . $this->get_field_name( 'content' ) . '" id="' . $this->get_field_id( 'content' ) . '">' .
        ( isset( $data[ $this->get_field_name( 'content' ) ] ) ? htmlspecialchars( $data[ $this->get_field_name( 'content' ) ] ) : null ) .
        '</textarea>
      </div>
      ';

      return $ret;
    }

    /**
     * Return a textual representation of this module.
     *
     * @param array $data
     *
     * @return string
     */
    public function text( $data ) {
      return $data[ $this->get_field_name( 'content' ) ];
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
     * Add some admin CSS for formatting
     *
     * @return void
     */
    public function admin_css() {
      return '
				#' . $this->get_field_id( 'content' ) . ' {
					height: 300px;
				}
			';
    }

    /**
     * Add some client side CSS
     *
     * @return void
     */
    public function css() {
      return '
				.' . $this->id_base . ' {
					display: block;
					position: relative;
					padding: 0;
					padding: 10px 0 10px 10px;
				}
				.' . $this->id_base . ' .' . $this->id_base . '-inner {
					display: block;
					margin: 0;
					padding: 0;
					border-left: 0;
					line-height: 1.5em;
				}
				';
    }
  }

  cfct_build_register_module( 'NoticeModule' );
}

?>