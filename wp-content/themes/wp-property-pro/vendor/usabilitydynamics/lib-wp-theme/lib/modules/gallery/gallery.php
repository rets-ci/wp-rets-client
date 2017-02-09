<?php
if( !class_exists( 'ImageModule' ) ) {
  require_once( dirname( dirname( __FILE__ ) ) . '/image/image.php' );
}
if( !class_exists( 'GalleryModule' ) && class_exists( 'ImageModule' ) ) {
  class GalleryModule extends ImageModule {
    protected $_deprecated_id = 'cfct-module-gallery'; // deprecated property, not needed for new module development

    /**
     * Set up the module
     */
    public function __construct() {
      $opts = array(
        'description' => __( 'Select and insert images as a gallery.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );

      cfct_build_module::__construct( 'cfct-module-gallery', __( 'Gallery', 'carrington-build' ), $opts );
    }

    /**
     * Display the module content in the Post-Content
     *
     * @param array $data - saved module data
     *
     * @return array string HTML
     */
    public function display( $data ) {
      if( !empty( $data[ $this->get_field_name( 'post_image' ) ] ) ) {
        $gallery_atts = array(
          'id'      => 0,
          'include' => $data[ $this->get_field_name( 'post_image' ) ],
          'size'    => $data[ $this->get_field_name( 'post_image' ) . '-size' ]
        );

        if( !empty( $data[ $this->get_field_name( 'link_target' ) ] ) ) {
          switch( $data[ $this->get_field_name( 'link_target' ) ] ) {
            case 'img':
              $gallery_atts[ 'link' ] = 'file';
              break;
            case 'page':
            default:
              $gallery_atts[ 'link' ] = 'page';
              break;
          }
        }

        remove_filter( 'post_gallery', 'cfct_post_gallery', 10, 2 );
        $gallery_html = gallery_shortcode( $gallery_atts );
        add_filter( 'post_gallery', 'cfct_post_gallery', 10, 2 );
        remove_filter( '', array( $this, 'get_link_url' ) );
      } else {
        $gallery_html = null;
      }

      return $this->load_view( $data, compact( 'gallery_html' ) );
    }

    /**
     * Build the admin form
     *
     * @param array $data - saved module data
     *
     * @return string HTML
     */
    public function admin_form( $data ) {
      $link_target = $this->link_target( $data );

      $html = '
				<div id="' . $this->id_base . '-post-image-wrap">
					' . $this->post_image_selector( $data, true ) . '
				</div>
				<p>' . __( 'Link image to...', 'carrington-build' ) . '</p>
				<ul>
					<li>
						<input type="radio" name="' . $this->get_field_id( 'link_target' ) . '" value="page" id="' . $this->get_field_id( 'link_target' ) . '_page" ' . checked( 'page', $link_target, false ) . ' />
						<label for="' . $this->get_field_id( 'link_target' ) . '_page">' . __( 'Image Page', 'carrington-build' ) . '</label>
					</li>
					<li>
						<input type="radio" name="' . $this->get_field_id( 'link_target' ) . '" value="img" id="' . $this->get_field_id( 'link_target' ) . '_img" ' . checked( 'img', $link_target, false ) . ' />
						<label for="' . $this->get_field_id( 'link_target' ) . '_img">' . __( 'Image File', 'carrington-build' ) . '</label>
					</li>
				</ul>';

      return $html;
    }

    /**
     * Return a textual representation of this module.
     *
     * @param array $data - saved module data
     *
     * @return string text
     */
    public function text( $data ) {
      $items = __( 'No Images Selected', 'carrington-build' );
      if( !empty( $data[ $this->get_field_name( 'post_image' ) ] ) ) {
        $num_items = count( explode( ',', $data[ $this->get_field_name( 'post_image' ) ] ) );
        $items     = $num_items == 1 ? __( '1 Image Selected', 'carrington-build' ) : sprintf( __( '%s Images Selected', 'carrington-build' ), $num_items );
      }

      return strip_tags( 'Gallery: ' . $items );
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
     * Add custom javascript to the post/page admin
     *
     * @return string JavaScript
     */
    public function admin_js() {
      $js = '
				cfct_builder.addModuleSaveCallback("' . $this->id_base . '", function() {
					// find the non-active image selector and clear his value
					$("#' . $this->id_base . '-image-selectors .cfct-module-tab-contents>div:not(.active)").find("input:hidden").val("");
					return true;
				});
			';

      return $js;
    }

// Content Move Helpers

    public function get_referenced_ids( $data ) {
      $reference_data[ 'post_image' ] = array(
        'type'      => 'post_type',
        'type_name' => 'attachment',
        'value'     => explode( ',', $data[ $this->gfn( 'post_image' ) ] )
      );

      return $reference_data;
    }

    public function merge_referenced_ids( $data, $reference_data ) {
      if( !empty( $reference_data[ 'post_image' ][ 'value' ] ) ) {
        $data[ $this->gfn( 'post_image' ) ] = implode( ',', $reference_data[ 'post_image' ][ 'value' ] );
      }

      return $data;
    }

  }

}