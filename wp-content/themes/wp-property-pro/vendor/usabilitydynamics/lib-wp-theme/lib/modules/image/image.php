<?php
if( !class_exists( 'ImageModule' ) ) {
  class ImageModule extends cfct_build_module {
    protected $_deprecated_id = 'cfct-module-image'; // deprecated property, not needed for new module development

    /**
     * Set up the module
     */
    public function __construct() {
      $opts = array(
        'description' => __( 'Add an image from the media library.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );

      parent::__construct( 'cfct-module-image', __( 'Image', 'carrington-build' ), $opts );
    }

    protected function img_size( $data = array() ) {
      return ( !empty( $data[ $this->get_field_id( 'link_img_size' ) ] ) ? $data[ $this->get_field_id( 'link_img_size' ) ] : 'large' );
    }

    protected function link_target( $data = array() ) {
      return ( !empty( $data[ $this->get_field_id( 'link_target' ) ] ) ? $data[ $this->get_field_id( 'link_target' ) ] : 'none' );
    }

    /**
     * Display the module content in the Post-Content
     *
     * @param array $data - saved module data
     *
     * @return array string HTML
     */
    public function display( $data ) {
      $image = '';
      if( !empty( $data[ $this->get_field_name( 'image_id' ) ] ) ) {
        $atts  = array(
          'class' => 'cfct-mod-image ' . $this->id_base . '-mod-image'
        );
        $size  = ( !empty( $data[ $this->get_field_name( 'image_id' ) . '-size' ] ) ? $data[ $this->get_field_name( 'image_id' ) . '-size' ] : 'thumbnail' );
        $image = wp_get_attachment_image( $data[ $this->get_field_name( 'image_id' ) ], $size, false, $atts );

        $url = $this->get_link_url( $data );
      }

      return $this->load_view( $data, compact( 'image', 'url' ) );
    }

    protected function get_link_url( $data ) {
      if( !empty( $data[ $this->get_field_name( 'link_target' ) ] ) ) {
        switch( $data[ $this->get_field_name( 'link_target' ) ] ) {
          case 'page':
            // get page URL from image
            $url = get_attachment_link( $data[ $this->get_field_name( 'image_id' ) ] );
            break;
          case 'img':
            // look at image size, or default to Large
            $size       = $this->img_size( $data );
            $link_image = wp_get_attachment_image_src( $data[ $this->get_field_name( 'image_id' ) ], $size, false );
            $url        = $link_image[ 0 ];
            break;
          case 'url':
            $url = esc_attr( $data[ $this->get_field_name( 'link_url' ) ] );
            break;
          case 'none':
          default:
            $url = '';
        }
      }

      return $url;
    }

    /**
     * Build the admin form
     *
     * @param array $data - saved module data
     *
     * @return string HTML
     */
    public function admin_form( $data ) {
      // tabs
      $image_selector_tabs = array(
        $this->id_base . '-post-image-wrap'   => __( 'Post Images', 'carrington-build' ),
        $this->id_base . '-global-image-wrap' => __( 'All Images', 'carrington-build' )
      );

      // set active tab
      $active_tab = $this->id_base . '-post-image-wrap';
      if( !empty( $data[ $this->get_field_name( 'global_image' ) ] ) ) {
        $active_tab = $this->id_base . '-global-image-wrap';
      }

      // set default link target
      $link_target = $this->link_target( $data );

      // set default image size
      $link_img_size = $this->img_size( $data );

      $html = '
				<fieldset>
					<!-- image selector tabs -->
					<div id="' . $this->id_base . '-image-selectors">
						<!-- tabs -->
						' . $this->cfct_module_tabs( $this->id_base . '-image-selector-tabs', $image_selector_tabs, $active_tab ) . '
						<!-- /tabs -->
					
						<div class="cfct-module-tab-contents">
							<!-- select an image from this post -->
							<div id="' . $this->id_base . '-post-image-wrap" ' . ( $active_tab == $this->id_base . '-post-image-wrap' ? ' class="active"' : null ) . '>
								' . $this->post_image_selector( $data ) . '
							</div>
							<!-- / select an image from this post -->
					
							<!-- select an image from media gallery -->
							<div id="' . $this->id_base . '-global-image-wrap" ' . ( $active_tab == $this->id_base . '-global-image-wrap' ? ' class="active"' : null ) . '>
								' . $this->global_image_selector( $data ) . '
							</div>
							<!-- /select an image from media gallery -->
						</div>
						<p>' . __( 'Link image to...', 'carrington-build' ) . '</p>
						<ul>
							<li>
								<input type="radio" name="' . $this->get_field_id( 'link_target' ) . '" value="none" id="' . $this->get_field_id( 'link_target' ) . '_none" ' . checked( 'none', $link_target, false ) . ' />
								<label for="' . $this->get_field_id( 'link_target' ) . '_none">' . __( 'No link', 'carrington-build' ) . '</label>
							</li>
							<li>
								<input type="radio" name="' . $this->get_field_id( 'link_target' ) . '" value="page" id="' . $this->get_field_id( 'link_target' ) . '_page" ' . checked( 'page', $link_target, false ) . ' />
								<label for="' . $this->get_field_id( 'link_target' ) . '_page">' . __( 'Image Page', 'carrington-build' ) . '</label>
							</li>
							<li>
								<input type="radio" name="' . $this->get_field_id( 'link_target' ) . '" value="img" id="' . $this->get_field_id( 'link_target' ) . '_img" ' . checked( 'img', $link_target, false ) . ' />
								<label for="' . $this->get_field_id( 'link_target' ) . '_img">' . __( 'Image Size', 'carrington-build' ) . '</label>
								' . $this->_image_selector_size_select_node( array(
          'field_name'    => $this->get_field_id( 'link_img_size' ),
          'selected_size' => $link_img_size
        ) ) . '
							</li>
							<li>
								<input type="radio" name="' . $this->get_field_id( 'link_target' ) . '" value="url" id="' . $this->get_field_id( 'link_target' ) . '_url" ' . checked( 'url', $link_target, false ) . ' />
								<label for="' . $this->get_field_id( 'link_url' ) . '">' . __( 'URL', 'carrington-build' ) . '</label>
								<input type="text" name="' . $this->get_field_name( 'link_url' ) . '" id="' . $this->get_field_id( 'link_url' ) . '" value="' . ( !empty( $data[ $this->get_field_name( 'link_url' ) ] ) ? esc_attr( $data[ $this->get_field_name( 'link_url' ) ] ) : '' ) . '" style="width: 550px;" />
							</li>
						</ul>
					</div>
					<!-- / image selector tabs -->
				</fieldset>
				';

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
      $image = '';
      if( !empty( $data[ $this->get_field_name( 'image_id' ) ] ) ) {
        $image = get_post( $data[ $this->get_field_name( 'image_id' ) ] );
        if( $image ) {
          $image = $image->post_title;
        }
      }

      return esc_html( $image );
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
      // keep the image search field value from being saved
      unset( $new_data[ $this->get_field_name( 'global_image-image-search' ) ] );

      // normalize the selected image value in to a 'featured_image' value for easy output
      if( !empty( $new_data[ $this->get_field_name( 'post_image' ) ] ) ) {
        $new_data[ $this->get_field_name( 'image_id' ) ]           = $new_data[ $this->get_field_name( 'post_image' ) ];
        $new_data[ $this->get_field_name( 'image_id' ) . '-size' ] = $new_data[ $this->get_field_name( 'post_image' ) . '-size' ];
      } elseif( !empty( $new_data[ $this->get_field_name( 'global_image' ) ] ) ) {
        $new_data[ $this->get_field_name( 'image_id' ) ]           = $new_data[ $this->get_field_name( 'global_image' ) ];
        $new_data[ $this->get_field_name( 'image_id' ) . '-size' ] = $new_data[ $this->get_field_name( 'global_image' ) . '-size' ];
      }

      return $new_data;
    }

    /**
     * Add custom javascript to the post/page admin
     *
     * @return string JavaScript
     */
    public function admin_js() {
      $js = '
				cfct_builder.addModuleLoadCallback("' . $this->id_base . '", function() {
					' . $this->cfct_module_tabs_js() . '
					$("#' . $this->get_field_id( 'link_url' ) . '").click(function() {
						$("#' . $this->get_field_id( 'link_target' ) . '_url").attr("checked", true);
					});
				});
				
				cfct_builder.addModuleSaveCallback("' . $this->id_base . '", function() {
					// find the non-active image selector and clear his value
					$("#' . $this->id_base . '-image-selectors .cfct-module-tab-contents>div:not(.active)").find("input:hidden").val("");
					return true;
				});
			';

      $js .= $this->global_image_selector_js( 'global_image', array( 'direction' => 'horizontal' ) );

      return $js;
    }

    public function admin_css() {
      return '
				#' . $this->id_base . '-image-selectors .' . $this->id_base . '-url-input label {
					display: block;
					float: left;
					width: 100px;
				}
				#' . $this->id_base . '-image-selectors .' . $this->id_base . '-url-input input {
					float: left;
					width: 650px;
				}
			';
    }

    // helpers
    function post_image_selector( $data = false, $multiple = false ) {
      $ajax_args = cfcf_json_decode( ( !empty( $_POST[ 'args' ] ) ? stripslashes( $_POST[ 'args' ] ) : '' ), true );

      $selected = 0;
      if( !empty( $data[ $this->get_field_id( 'post_image' ) ] ) ) {
        $selected = $data[ $this->get_field_id( 'post_image' ) ];
      }

      $selected_size = null;
      if( !empty( $data[ $this->get_field_name( 'post_image' ) . '-size' ] ) ) {
        $selected_size = $data[ $this->get_field_name( 'post_image' ) . '-size' ];
      }

      $args = array(
        'field_name'     => 'post_image',
        'selected_image' => $selected,
        'selected_size'  => $selected_size,
        'allow_multiple' => $multiple,
        'post_id'        => $ajax_args[ 'post_id' ]
      );

      return $this->image_selector( 'post', $args );
    }

    function global_image_selector( $data = false ) {
      $selected = 0;
      if( !empty( $data[ $this->get_field_id( 'global_image' ) ] ) ) {
        $selected = $data[ $this->get_field_id( 'global_image' ) ];
      }

      $selected_size = null;
      if( !empty( $data[ $this->get_field_name( 'global_image' ) . '-size' ] ) ) {
        $selected_size = $data[ $this->get_field_name( 'global_image' ) . '-size' ];
      }

      $args = array(
        'field_name'     => 'global_image',
        'selected_image' => $selected,
        'selected_size'  => $selected_size
      );

      return $this->image_selector( 'global', $args );
    }

// Content Move Helpers

    protected $reference_fields = array( 'global_image', 'post_image', 'image_id' );

    public function get_referenced_ids( $data ) {
      $references = array();
      foreach( $this->reference_fields as $field ) {
        $id = $this->get_data( $field, $data );
        if( $id ) {
          $post                 = get_post( $id );
          $references[ $field ] = array(
            'type'      => 'post_type',
            'type_name' => $post->post_type,
            'value'     => $id
          );
        }
      }

      return $references;
    }

    public function merge_referenced_ids( $data, $reference_data ) {
      if( !empty( $reference_data ) && !empty( $data ) ) {
        foreach( $this->reference_fields as $field ) {
          if( isset( $data[ $this->gfn( $field ) ] ) && isset( $reference_data[ $field ] ) ) {
            $data[ $this->gfn( $field ) ] = $reference_data[ $field ][ 'value' ];
          }
        }
      }

      return $data;
    }
  }
}

