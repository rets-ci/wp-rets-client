<?php
if( !class_exists( 'HTMLModule' ) ) {
  /**
   * Plain Text Carrington Build Module
   * Simple plain text box that stores and displays exactly what it is given.
   * Good for displaying raw HTML and/or JavaScript
   */
  class HTMLModule extends cfct_build_module {
    protected $_deprecated_id = 'cfct-html'; // deprecated property, not needed for new module development

    public function __construct() {
      $opts = array(
        'description' => __( 'Add raw HTML or JavaScript. This content is not altered.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );

      parent::__construct( 'cfct-html', __( 'HTML', 'carrington-build' ), $opts );

    }

    public function display( $data ) {
      $data[ $this->get_field_name( 'content' ) ] = do_shortcode( $data[ $this->get_field_name( 'content' ) ] );

      return $this->load_view( $data );
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
      return strip_tags( $data[ $this->get_field_name( 'content' ) ] );
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

    public function admin_js() {
      return '
				// automatically set focus on the rich text editor
				cfct_builder.addModuleLoadCallback("' . $this->id_base . '",function(form) {
					$("#' . $this->get_field_id( 'content' ) . '").focus();
				});
				';
    }
  }
}
