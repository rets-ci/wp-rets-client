<?php
if( !class_exists( 'DividerModule' ) ) {
  class DividerModule extends cfct_build_module {
    protected $_deprecated_id = 'cfct-divider'; // deprecated property, not needed for new module development

    /**
     * Set up the module
     */
    public function __construct() {
      $opts = array(
        'description' => __( 'Separate sections of the layout.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );

      // use if this module is to have no user configurable options
      // Will suppress the module edit button in the admin module display
      # $this->editable = false

      parent::__construct( 'cfct-divider', __( 'Divider', 'carrington-build' ), $opts );
    }

    /**
     * Display the module content in the Post-Content
     *
     * @param array $data - saved module data
     *
     * @return array string HTML
     */
    public function display( $data ) {
      return $this->load_view( $data );
    }

    /**
     * Build the admin form
     *
     * @param array $data - saved module data
     *
     * @return string HTML
     */
    public function admin_form( $data ) {
      $classes = apply_filters(
        'cfct-module-divider-css-classes',
        array(
          'cfct-div-solid'      => 'Solid',
          'cfct-div-solid-wide' => 'Solid Wide',
          'cfct-div-blue'       => 'Blue',
          'cfct-div-blue-wide'  => 'Blue Wide',
        )
      );
      if( !is_array( $classes ) || !count( $classes ) ) {
        return '<p class="padded">' . __( 'No options for this module.', 'carrington-build' ) . '</p>';
      }
      $output = '
<div>
	<label for="' . $this->get_field_id( 'css_class' ) . '">' . __( 'Divider Style', 'carrington-build' ) . '</label>
	<select name="' . $this->get_field_name( 'css_class' ) . '" id="' . $this->get_field_id( 'css_class' ) . '">
			';
      foreach( $classes as $class => $display ) {
        $output .= '
		<option value="' . esc_attr( $class ) . '" ' . selected( $class, isset( $data[ $this->get_field_id( 'css_class' ) ] ) ? $data[ $this->get_field_id( 'css_class' ) ] : '', false ) . '>' . esc_html( $display ) . '</option>
				';
      }
      $output .= '
	</select>
</div>
			';

      return $output;
    }

    /**
     * Return a textual representation of this module.
     *
     * @param array $data - saved module data
     *
     * @return string text
     */
    public function text( $data ) {
      return "\n---\n\n";
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
#cfct-divider-edit-form .padded {
	line-height: 30px;
	padding: 20px 0 60px;
	text-align: center;
}
			';
    }
  }

  // register the module with Carrington Build
  cfct_build_register_module( 'DividerModule' );
}
?>