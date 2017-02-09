<?php
if( !class_exists( 'CalloutModule' ) ) {
  class CalloutModule extends cfct_build_module {
    protected $_deprecated_id = 'cfct-callout'; // deprecated property, not needed for new module development

    /**
     * Feature support in the Callout module and anything that extends it
     * may be easily controlled by modifying this array in one of two ways:
     *  1. when extending the module, redefine the array
     *  2. on a filtered basis using the supplied `cfct-callout-content-items` filter
     *
     * @var array
     */
    protected $content_support = array(
      'title',
      'content',
      'url',
      'images',
      'image-size-select',
      'layout_controls' => array(
        'header',
        'image',
        'content'
      )
    );

    public function __construct() {
      $opts = array(
        'description' => __( 'Display a headline, (optional) image and brief text with a link.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );
      parent::__construct( 'cfct-callout', __( 'Callout', 'carrington-build' ), $opts );

      if( is_admin() ) {
        $this->content_support = apply_filters( $this->id_base . '-content-items', $this->content_support );
      }
    }

    // put it all together
    public function display( $data ) {
      // url
      $url = null;
      if( !empty( $data[ $this->get_field_name( 'url' ) ] ) ) {
        $url = esc_attr( $data[ $this->get_field_name( 'url' ) ] );
      }

      $title = null;
      if( !empty( $data[ $this->get_field_name( 'title' ) ] ) ) {
        $title = esc_html( $data[ $this->get_field_name( 'title' ) ] );
        if( !empty( $url ) ) {
          $title = '<a href="' . $url . '">' . $title . '</a>';
        }
      }

      $image = null;
      if( !empty( $data[ $this->get_field_name( 'featured_image' ) ] ) ) {
        $img_id    = intval( $data[ $this->get_field_name( 'featured_image' ) ] );
        $the_image = get_post( $img_id );
        if( !empty( $the_image ) ) {
          $atts  = array(
            'class' => 'cfct-mod-image ' . ( !empty( $data[ $this->get_field_id( 'image-alignment' ) ] ) ? ' ' . $data[ $this->get_field_name( 'image-alignment' ) ] : '' )
          );
          $size  = ( !empty( $data[ $this->get_field_name( 'featured_image' ) . '-size' ] ) ? $data[ $this->get_field_name( 'featured_image' ) . '-size' ] : 'thumbnail' );
          $image = wp_get_attachment_image( $the_image->ID, $size, false, $atts );
        }
        if( !empty( $url ) && !empty( $image ) ) {
          $image = '<a href="' . $url . '">' . $image . '</a>';
        }
      }

      // content
      $content = null;
      if( !empty( $data[ $this->get_field_name( 'content' ) ] ) ) {
        $content = $this->wp_formatting( $data[ $this->get_field_name( 'content' ) ] );
      }

      return $this->load_view( $data, compact( 'title', 'image', 'content', 'url' ) );
    }

    public function admin_form( $data ) {
      // basic info
      $html = '
				<!-- basic info -->
				<div id="' . $this->id_base . '-content-info">
					
					<!-- inputs -->
					<div id="' . $this->id_base . '-content-fields">';

      if( $this->supports( 'title' ) ) {
        $html .= '
						<div>
							<label for="' . $this->get_field_id( 'title' ) . '">' . __( 'Title' ) . '</label>
							<input type="text" name="' . $this->get_field_name( 'title' ) . '" id="' . $this->get_field_id( 'title' ) . '" value="' . ( !empty( $data[ $this->get_field_name( 'title' ) ] ) ? esc_html( $data[ $this->get_field_name( 'title' ) ] ) : '' ) . '" />
						</div>';
      }

      if( $this->supports( 'content' ) ) {
        $html .= '
						<div>
							<label for="' . $this->get_field_id( 'content' ) . '">' . __( 'Content' ) . '</label>
							<textarea name="' . $this->get_field_name( 'content' ) . '" id="' . $this->get_field_id( 'content' ) . '">'
          . ( !empty( $data[ $this->get_field_name( 'content' ) ] ) ? htmlspecialchars( $data[ $this->get_field_name( 'content' ) ] ) : '' ) .
          '</textarea>
        </div>';
      }

      if( $this->supports( 'url' ) ) {
        $html .= '
						<div>
							<label for="' . $this->get_field_id( 'url' ) . '">' . __( 'URL' ) . '</label>
							<input type="text" name="' . $this->get_field_name( 'url' ) . '" id="' . $this->get_field_id( 'url' ) . '" value="' . ( !empty( $data[ $this->get_field_name( 'url' ) ] ) ? esc_html( $data[ $this->get_field_name( 'url' ) ] ) : '' ) . '" />
						</div>';
      }

      $html .= '
					</div>
					<!-- /inputs -->
					
					<!-- styling -->
					<div id="' . $this->id_base . '-content-styles" class="' . $this->id_base . '-c6-34">
						' . $this->post_layout_controls( $this->content_support[ 'layout_controls' ], $data ) . '
					</div>
					<!-- /styling -->
					
				</div>
				<!-- / basic info -->
				<div class="clear" />
				';

      if( $this->supports( 'images' ) ) {
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

        $html .= '
					<!-- image selector tabs -->
					<div id="' . $this->id_base . '-image-selectors">
						<!-- tabs -->
						' . $this->cfct_module_tabs( $this->id_base . '-image-selector-tabs', $image_selector_tabs, $active_tab ) . '
						<!-- /tabs -->
					
						<div class="cfct-module-tab-contents">
							<!-- select an image from this post -->
							<div id="' . $this->id_base . '-post-image-wrap" ' . ( empty( $active_tab ) || $active_tab == $this->id_base . '-post-image-wrap' ? ' class="active"' : null ) . '>
								' . $this->post_image_selector( $data ) . '
							</div>
							<!-- / select an image from this post -->
					
							<!-- select an image from media gallery -->
							<div id="' . $this->id_base . '-global-image-wrap" ' . ( $active_tab == $this->id_base . '-global-image-wrap' ? ' class="active"' : null ) . '>
								' . $this->global_image_selector( $data ) . '
							</div>
							<!-- /select an image from media gallery -->
						</div>';

        if( $this->supports( 'image-size-select' ) ) {
          $selected_size = null;
          if( !empty( $data[ $this->get_field_name( 'featured_image' ) . '-size' ] ) ) {
            $selected_size = $data[ $this->get_field_name( 'featured_image' ) . '-size' ];
          }
          $html .= $this->_image_selector_size_select( array(
            'field_name'    => 'featured_image',
            'selected_size' => $selected_size
          ) );
        }

        $html .= '
					</div>
					<!-- / image selector tabs -->';
      }

      return $html;
    }

    /**
     * Return a textual representation of this module.
     *
     * @param array $data
     *
     * @return string
     */
    public function text( $data ) {
      $title = null;
      if( !empty( $data[ $this->get_field_name( 'title' ) ] ) ) {
        $title = esc_html( $data[ $this->get_field_name( 'title' ) ] );
      }
      $content = null;
      if( !empty( $data[ $this->get_field_name( 'content' ) ] ) ) {
        $content = esc_html( $data[ $this->get_field_name( 'content' ) ] );
      }

      return $title . PHP_EOL . $content . PHP_EOL;
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

      // make sure that the url is url formatted and scrubbed
      if( !empty( $new_data[ $this->get_field_name( 'url' ) ] ) ) {
        $new_data[ $this->get_field_name( 'url' ) ] = esc_url( $new_data[ $this->get_field_name( 'url' ) ] );
      }

      // normalize the selected image value in to a 'featured_image' value for easy output
      if( !empty( $new_data[ $this->get_field_name( 'post_image' ) ] ) ) {
        $new_data[ $this->get_field_name( 'featured_image' ) ] = $new_data[ $this->get_field_name( 'post_image' ) ];
      } elseif( !empty( $new_data[ $this->get_field_name( 'global_image' ) ] ) ) {
        $new_data[ $this->get_field_name( 'featured_image' ) ] = $new_data[ $this->get_field_name( 'global_image' ) ];
      }

      return $new_data;
    }

    public function admin_js() {
      $js = '
				cfct_builder.addModuleLoadCallback("' . $this->id_base . '", function() {
					' . $this->cfct_module_tabs_js() . '
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
				#' . $this->id_base . '-content-fields {
					width: 440px;
					margin-right: 20px;
					float: left;
				}
				#' . $this->id_base . '-content-styles {
					width: 280px;
					float: left;
					margin-top: 20px;
				}
				#' . $this->id_base . '-image-selectors div#' . $this->id_base . '-image-selector-tabs {
					margin-top: 15px;
				}
				textarea#' . $this->id_base . '-content {
					height: 200px;
				}
			';
    }

    function post_image_selector( $data = false ) {
      if( isset( $_POST[ 'args' ] ) ) {
        $ajax_args = cfcf_json_decode( stripslashes( $_POST[ 'args' ] ), true );
      } else {
        $ajax_args = null;
      }

      $selected = 0;
      if( !empty( $data[ $this->get_field_id( 'post_image' ) ] ) ) {
        $selected = $data[ $this->get_field_id( 'post_image' ) ];
      }

      $selected_size = null;
      if( !empty( $data[ $this->get_field_name( 'post_image' ) . '-size' ] ) ) {
        $selected_size = $data[ $this->get_field_name( 'post_image' ) . '-size' ];
      }

      $args = array(
        'field_name'             => 'post_image',
        'selected_image'         => $selected,
        'selected_size'          => $selected_size,
        'post_id'                => isset( $ajax_args[ 'post_id' ] ) ? $ajax_args[ 'post_id' ] : null,
        'select_no_image'        => true,
        'suppress_size_selector' => true
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
        'field_name'             => 'global_image',
        'selected_image'         => $selected,
        'selected_size'          => $selected_size,
        'suppress_size_selector' => true
      );

      return $this->image_selector( 'global', $args );
    }

// Content Move Helpers

    protected $reference_fields = array( 'global_image', 'post_image', 'featured_image' );

    public function get_referenced_ids( $data ) {
      $references = array();
      foreach( $this->reference_fields as $field ) {
        $id = $this->get_data( $field, $data );
        if( $id ) {
          $references[ $field ] = array(
            'type'      => 'post_type',
            'type_name' => 'attachment',
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
