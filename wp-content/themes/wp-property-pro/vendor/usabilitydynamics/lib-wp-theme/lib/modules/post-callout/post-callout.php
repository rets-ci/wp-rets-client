<?php
if( !class_exists( 'PostCalloutModule' ) ) {
  class PostCalloutModule extends cfct_build_module {
    protected $_deprecated_id = 'cf-post-callout-module'; // deprecated property, not needed for new module development

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
      'images',
      'image-size-select',
      'layout_controls' => array(
        'header',
        'image',
        'content'
      )
    );

    protected $in_search = false;
    public $default_img_size;
    protected $focus_target = '#no-elm';

    public function __construct() {
      $opts = array(
        'description' => __( 'Show the title, excerpt and (optional) image of a post.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );
      parent::__construct( 'cf-post-callout-module', __( 'Post Callout', 'carrington-build' ), $opts );

      $this->default_img_size = apply_filters( $this->id_base . '-default-img-size', 'thumbnail' );
      $this->js_base          = 'cfct_pcm';

      // Add actions for handling requests
      add_action( 'wp_ajax_' . $this->js_base . '_post_search', array( $this, 'post_search' ) );
      add_action( 'wp_ajax_' . $this->js_base . '_post_load_images', array( $this, 'post_load_images' ) );

      if( is_admin() ) {
        $this->content_support = apply_filters( $this->id_base . '-content-items', $this->content_support );
      }
    }

    public function display( $data ) {
      $img_size  = ( !empty( $data[ $this->get_field_name( 'featured_image' ) . '-size' ] ) ? $data[ $this->get_field_name( 'featured_image' ) . '-size' ] : $this->default_img_size );
      $img_atts  = array(
        'class' => 'cfct-mod-image ' . ( !empty( $data[ $this->get_field_id( 'image-alignment' ) ] ) ? ' ' . $data[ $this->get_field_name( 'image-alignment' ) ] : '' ) . ' ' . $img_size
      );
      $permalink = get_permalink( $data[ $this->get_field_name( 'post_id' ) ] );

      $image = $title = $content = null;

      if( isset( $data[ $this->get_field_name( 'custom_values' ) ] ) && $data[ $this->get_field_name( 'custom_values' ) ] ) {
        if( !empty( $data[ $this->get_field_name( 'featured_image' ) ] ) ) {
          $image = wp_get_attachment_image( $data[ $this->get_field_name( 'featured_image' ) ], $img_size, false, $img_atts );
        }

        if( !empty( $data[ $this->get_field_name( 'title' ) ] ) ) {
          $title = $data[ $this->get_field_name( 'title' ) ];
        }

        if( !empty( $data[ $this->get_field_name( 'content' ) ] ) ) {
          $content = $data[ $this->get_field_name( 'content' ) ];
        }
      } else {
        $post = get_post( $data[ $this->get_field_name( 'post_id' ) ] );
        if( !empty( $post ) ) {
          $title   = $post->post_title;
          $content = $this->get_excerpt( $post );

          // Check if theme supports get_the_post_thumbnail
          if( function_exists( 'get_the_post_thumbnail' ) ) {
            $image = get_the_post_thumbnail( $post->ID, $img_size, $img_atts );
          } else {
            $image = wp_get_attachment_image( get_post_meta( $post->ID, '_thumbnail_id', true ), $img_size, false, $img_atts );
          }
        }
      }

      if( !empty( $title ) ) {
        $title = '<a href="' . $permalink . '">' . esc_html( $title ) . '</a>';
      }

      if( !empty( $content ) ) {
        $content = $this->wp_formatting( $content );
      }

      return $this->load_view( $data, compact( 'title', 'image', 'content', 'permalink' ) );
    }

    public function admin_form( $data ) {
      if( isset( $data[ $this->get_field_name( 'custom_values' ) ] ) ) {
        $checked = checked( $data[ $this->get_field_name( 'custom_values' ) ], true, false );
      } else {
        $checked = '';
      }

      if( empty( $checked ) && isset( $data[ $this->get_field_name( 'post_id' ) ] ) ) {
        $post = get_post( $data[ $this->get_field_name( 'post_id' ) ] );
        if( $post ) {
          $title         = $post->post_title;
          $content       = $post->post_content;
          $current_image = get_post_meta( $post->ID, '_thumbnail_id', TRUE );
        } else {
          $title         = null;
          $content       = null;
          $current_image = null;
        }
      } else {
        $title         = ( isset( $data[ $this->get_field_name( 'title' ) ] ) ? $data[ $this->get_field_name( 'title' ) ] : null );
        $content       = ( isset( $data[ $this->get_field_name( 'content' ) ] ) ? $data[ $this->get_field_name( 'content' ) ] : null );
        $current_image = ( isset( $data[ $this->get_field_name( 'featured_image' ) ] ) ? $data[ $this->get_field_name( 'featured_image' ) ] : null );
      }

      $current_image_link = '<p>' . __( 'No image', 'carrington-build' ) . '</p>';
      if( !empty( $current_image ) ) {
        $current_image_link = wp_get_attachment_image( $current_image, $this->default_img_size );
      }
      if( empty( $data[ $this->get_field_name( 'image-alignment' ) ] ) ) {
        $data[ $this->get_field_name( 'image-alignment' ) ] = 'left';
      }

      // search
      $ret = '
				<div id="' . $this->id_base . '-tabs" class="cfct-module-tabs">
					<ul>
						<li' . ( empty( $data[ $this->get_field_name( 'post_id' ) ] ) ? ' class="active"' : '' ) . '><a href="#' . $this->id_base . '-search-wrap">' . __( 'Find a Post', 'carrington-build' ) . '</a></li>
						<li' . ( !empty( $data[ $this->get_field_name( 'post_id' ) ] ) ? ' class="active"' : '' ) . '><a href="#' . $this->id_base . '-post-preview-wrap">' . __( 'Selected Post', 'carrington-build' ) . '</a></li>
					</ul>
				</div>
				<div id="' . $this->id_base . '-tab-contents" class="cfct-module-tab-contents">
				
					<!-- search -->
					<div id="' . $this->id_base . '-search-wrap"' . ( empty( $data[ $this->get_field_name( 'post_id' ) ] ) ? ' class="active"' : '' ) . '>
						<input placeholder="' . __( 'Search for a Post&hellip;', 'carrington-build' ) . '" type="text" name="' . $this->id_base . '-search" value="" id="' . $this->id_base . '-search" />
						
						<p>' . __( 'To get started, do a text search to find the post you&rsquo;re looking for.', 'carrington-build' ) . '</p>
						
						<input type="hidden" id="' . $this->id_base . '-post-id" name="' . $this->get_field_name( 'post_id' ) . '" value="' . ( isset( $data[ $this->get_field_name( 'post_id' ) ] ) ? $data[ $this->get_field_name( 'post_id' ) ] : '' ) . '" id="' . $this->get_field_id( 'post_id' ) . '" />
						<div class="results ' . $this->id_base . '-live-search-results"></div>
					</div> 
					<!-- / search -->';

      // formatting/existing content
      $ret .= '
					<!-- post preview -->
					<div id="' . $this->id_base . '-post-preview-wrap"' . ( !empty( $data[ $this->get_field_name( 'post_id' ) ] ) ? ' class="active"' : '' ) . '>
					
						<!-- content preview -->
						<div id="' . $this->id_base . '-post-preview-content" class="' . $this->id_base . '-c6-12">
							<div id="' . $this->id_base . '-post-callout-preview" class="' . $this->id_base . '-post-summary">
								' . ( isset( $data[ $this->get_field_name( 'post_id' ) ] ) ? $this->admin_post_preview( $data[ $this->get_field_name( 'post_id' ) ], $data ) : '' ) . '
							</div>
						</div>
						<!-- /content preview -->
						
						<!-- layout controls -->
						<div class="' . $this->id_base . '-c6-34">
							' . $this->post_layout_controls( $this->content_support[ 'layout_controls' ], $data ) . '
						</div>
						<div class="' . $this->id_base . '-c6-34">
							<p' . ( empty( $data[ $this->get_field_name( 'post_id' ) ] ) ? ' style="display: none"' : '' ) . ' id="' . $this->id_base . '-custom-check" class="customize">
								<span>
									<input type="checkbox" name="' . $this->get_field_name( 'custom_values' ) . '" value="1"' . $checked . ' id="' . $this->get_field_id( 'custom_values' ) . '" />
								</span>
								<label for="' . $this->get_field_id( 'custom_values' ) . '">' . __( 'Customize', 'carrington-build' ) . '</label>
							</p>
						</div>
						<!-- /layout controls -->';

      // custom content
      $ret .= '
						<!-- custom content -->
						<div class="hidden" id="' . $this->get_field_name( 'custom_values' ) . '_fields">
							<fieldset class="cfct-ftl-border">
								<legend>' . __( 'Override Post Content', 'carrington-build' ) . '</legend>
								<div class="">';

      if( $this->supports( 'title' ) ) {
        $ret .= '
									<p class="' . $this->id_base . '-module-title-wrapper">
										<input placeholder="Title" type="text" name="' . $this->get_field_name( 'title' ) . '" value="' . $title . '" id="' . $this->get_field_id( 'title' ) . '">
									</p>';
      }

      if( $this->supports( 'content' ) ) {
        $ret .= '

									<p class="' . $this->id_base . '-content-wrapper">
										<textarea name="' . $this->get_field_name( 'content' ) . '" id="' . $this->get_field_id( 'content' ) . '">' .
          htmlspecialchars( $content ) . '
										</textarea>
									</p>';
      }

      $ret .= '
								</div>';

      if( $this->supports( 'images' ) ) {
        // tabs
        $image_selector_tabs = array(
          $this->id_base . '-post-image-wrap'   => __( 'Post Images', 'carrington-build' ),
          $this->id_base . '-global-image-wrap' => __( 'All Images', 'carrington-build' )
        );

        $post_image     = $this->get_data( 'post_image', $data, 0 );
        $global_image   = $this->get_data( 'global_image', $data, 0 );
        $featured_image = $this->get_data( 'featured_image', $data, 0 );

        if( empty( $featured_image ) || ( $featured_image == $post_image ) ) {
          $active_tab = $this->id_base . '-post-image-wrap';
        } elseif( $featured_image == $global_image ) {
          $active_tab = $this->id_base . '-global-image-wrap';
        }

        $ret .= '
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
										</div>
									</div>
									<!-- / image selector tabs -->';
        if( $this->supports( 'image-size-select' ) ) {
          $selected_size = null;
          if( !empty( $data[ $this->get_field_name( 'featured_image' ) . '-size' ] ) ) {
            $selected_size = $data[ $this->get_field_name( 'featured_image' ) . '-size' ];
          }
          $ret .= $this->_image_selector_size_select( array(
            'field_name'    => 'featured_image',
            'selected_size' => $selected_size
          ) );
        }
      }

      $ret .= '
							
							</fieldset>
						</div> 
						<!-- /custom content -->
						
					</div> 
					<!-- / post preview -->
					
				</div> <!--/tab-contents-->
				<div class="clear"></div>';

      return $ret;
    }

    function post_image_selector( $data = false ) {
      $post_id = ( !empty( $data[ $this->get_field_name( 'post_id' ) ] ) ? $data[ $this->get_field_name( 'post_id' ) ] : 0 );
      if( !empty( $_POST[ 'action' ] ) && $_POST[ 'action' ] == 'cfcpm_post_load_images' ) {
        $ajax_args = cfcf_json_decode( stripslashes( $_POST[ 'args' ] ), true );
        $post_id   = intval( $ajax_args[ 'post_id' ] );
      }

      $selected = 0;
      if( !empty( $data[ $this->gfn( 'post_image' ) ] ) ) {
        $selected = $data[ $this->gfn( 'post_image' ) ];
      }

      $selected_size = null;
      if( !empty( $data[ $this->gfn( 'post_image' ) . '-size' ] ) ) {
        $selected_size = $data[ $this->gfn( 'post_image' ) . '-size' ];
      } else {
        $selected_size = 'thumbnail';
      }

      $args = array(
        'field_name'             => 'post_image',
        'selected_image'         => $selected,
        'selected_size'          => $selected_size,
        'post_id'                => $post_id,
        'select_no_image'        => true,
        'suppress_size_selector' => true
      );

      return $this->image_selector( 'post', $args );
    }

    function global_image_selector( $data = false ) {
      $selected = 0;
      if( !empty( $data[ $this->gfn( 'global_image' ) ] ) ) {
        $selected = $data[ $this->gfn( 'global_image' ) ];
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

    /**
     * Return a textual representation of this module.
     *
     * @param array $data
     *
     * @return string
     */
    public function text( $data ) {
      if( !empty( $data[ $this->get_field_name( 'custom_values' ) ] ) ) {
        return $data[ $this->get_field_name( 'title' ) ] . ' ' . $data[ $this->get_field_name( 'content' ) ];
      } else {
        $post = get_post( $data[ $this->get_field_name( 'post_id' ) ] );
        if( $post ) {
          $content = $this->get_excerpt( $post );

          return $post->post_title . ' ' . $content;
        }

        return '';
      }
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
      // remove search field from save data
      unset( $new_data[ $this->get_field_id( 'search' ) ] );

      // keep the image search field value from being saved
      unset( $new_data[ $this->get_field_name( 'global_image-image-search' ) ] );

      // normalize the selected image value in to a 'featured_image' value for easy output
      if( !empty( $new_data[ $this->get_field_name( 'post_image' ) ] ) ) {
        $new_data[ $this->get_field_name( 'featured_image' ) ] = $new_data[ $this->get_field_name( 'post_image' ) ];
      } elseif( !empty( $new_data[ $this->get_field_name( 'global_image' ) ] ) ) {
        $new_data[ $this->get_field_name( 'featured_image' ) ] = $new_data[ $this->get_field_name( 'global_image' ) ];
      }

      return $new_data;
    }

    public function admin_js() {
      $ret = '
					cfct_builder.addModuleLoadCallback("' . $this->id_base . '", function() {
						' . $this->cfct_module_tabs_js() . '
					});

					cfct_builder.addModuleSaveCallback("' . $this->id_base . '", function() {
						// find the non-active image selector and clear his value
						$("#' . $this->id_base . '-image-selectors .cfct-module-tab-contents>div:not(.active)").find("input:hidden").val("");
						return true;
					});
				';

      $ret .= $this->post_layout_controls_js();
      $ret .= $this->global_image_selector_js( 'global_image' );
      $ret .= require( 'js/module-admin-js.inc' );

      return $ret;
    }

    /**
     * Add some admin CSS for formatting
     *
     * @return void
     */
    public function admin_css() {
      $ret = require( 'css/module-css.inc' );

      return $ret;
    }

// Utility
    public function post_search() {
      $this->in_search = true;

      $term  = trim( stripslashes( $_POST[ 'term' ] ) );
      $posts = query_posts( apply_filters( 'cfct-' . $this->id_base . '-search-query-args', array(
          's'              => $term,
          'posts_per_page' => 20,
          'post__not_in'   => array( intval( $_POST[ 'post_id' ] ) )
        ) ) );
      $html  = '<div class="' . $this->id_base . '-posts">';
      if( count( $posts ) ) {
        foreach( $posts as $post ) {
          $html .= '<div class="' . $this->id_base . '-post-summary">' . $this->admin_post_preview( $post->ID ) . '</div>';
        }
      } else {
        $html = '<p>' . sprintf( __( 'No posts found for term "%s"', 'carrington-build' ), esc_html( $_POST[ 'term' ] ) ) . '</p>';
      }
      $html .= '</div>';
      echo cfcf_json_encode( compact( 'term', 'html' ) );
      exit();
    }

    public function post_load_images() {
      $html = $this->post_image_scroller( intval( $_POST[ 'post_id' ] ) );
      if( $html ) {
        $ret = array(
          'success' => true,
          'html'    => $html
        );
      } else {
        $ret = array(
          'success'    => false,
          'error_html' => '<p class="error">' . __( 'Could not retrieve images for the selected post', 'carrington-build' ) . '.</p>'
        );
      }
      echo cfcf_json_encode( $ret );
      exit;
    }

    public function admin_post_preview( $post_id = null, $data = false ) {
      global $post;
      $old_post = $post;
      $post     = $ret = false;
      $post     = get_post( $post_id, 'OBJECT' );
      if( $post ) {
        setup_postdata( $post );
        $cats          = trim( get_the_category_list( ', ' ) );
        $category_info = $cats ? ' in ' . $cats : '';

        if( !empty( $data ) && isset( $data[ $this->get_field_id( 'custom_values' ) ] ) && $data[ $this->get_field_id( 'custom_values' ) ] == 1 ) {
          $title   = $data[ $this->get_field_id( 'title' ) ];
          $image   = isset( $data[ $this->get_field_id( 'featured_image' ) ] ) ? wp_get_attachment_image( $data[ $this->get_field_id( 'featured_image' ) ], array( 75, 75 ) ) : '';
          $excerpt = $data[ $this->get_field_id( 'content' ) ];
        } else {
          $title   = get_the_title( $post_id );
          $image   = wp_get_attachment_image( get_post_meta( $post_id, '_thumbnail_id', true ), array( 75, 75 ) );
          $excerpt = $this->get_excerpt( $post );
        }

        $ret = '
					<h3 class="' . $this->id_base . '-post-title cfct-post-preview-title' . ( !$this->supports( 'title' ) ? ' suppressed' : null ) . '">' . $title . '</h3>
					<p class="meta">' . get_the_time( 'Y-m-d', $post ) . '' . $category_info . '</p>
					<div class="' . $this->id_base . '-post-content cfct-post-preview-content' . ( !empty( $data[ $this->get_field_name( 'image-alignment' ) ] ) ? ' ' . $data[ $this->get_field_name( 'image-alignment' ) ] : null ) . '">
						<span class="' . $this->id_base . '-post-thumbnail cfct-post-preview-thumbnail' . ( !$this->supports( 'images' ) ? ' suppressed' : null ) . '">' . $image . '</span>
						<span class="' . $this->id_base . '-post-excerpt cfct-post-preview-excerpt' . ( !$this->supports( 'content' ) ? ' suppressed' : null ) . '">' . $excerpt . '</span>
					</div>
					<a class="select" href="#id-' . $post_id . '" data-post-id="' . $post_id . '">Select</a>';
      } else {
        $ret = '<div class="' . $this->id_base . '-post-summary-none">' . __( 'No Selected Post <span>Click "Find a Post" to search for one</span>', 'carrington-build' ) . '</div>';
      }
      wp_reset_query();

      $post = $old_post;
      if( $post ) {
        setup_postdata( $post );
      }

      return $ret;
    }

    function post_image_scroller( $post_id, $data = false ) {
      if( empty( $post_id ) ) {
        return false;
      }

      $selected = 0;
      if( !empty( $data[ $this->get_field_id( 'post_image' ) ] ) ) {
        $selected = $data[ $this->get_field_id( 'post_image' ) ];
      } else {
        $featured = get_post_meta( $post_id, '_thumbnail_id', TRUE );
        if( $featured > 0 ) {
          $selected = $featured;
        }
      }

      $selected_size = null;
      if( !empty( $data[ $this->get_field_id( 'global_image' ) . '-size' ] ) ) {
        $selected_size = $data[ $this->get_field_id( 'global_image' ) . '-size' ];
      }

      $args = array(
        'post_id'                => $post_id,
        'field_name'             => 'post_image',
        'selected_image'         => $selected,
        'selected_size'          => $selected_size,
        'direction'              => 'horizontal',
        'suppress_size_selector' => true
      );

      return $this->image_selector( 'post', $args );
    }

    public function get_post( $post_id ) {
      $post     = get_post( $post_id );
      $image_id = get_post_meta( $result->ID, '_thumbnail_id', TRUE );
      $item     = array(
        'title'                 => $post->post_title,
        'content'               => $this->get_excerpt( $post ),
        'post_thumbnail'        => $image_id,
        'post_thumbnail_markup' => wp_get_attachment_image( $image_id, $this->default_img_size ),
      );

      return cfcf_json_encode( $item );
    }

    public function get_excerpt( $_post ) {
      global $post;
      $old_post = $post;
      $post     = $_post;
      if( $post ) {
        setup_postdata( $post );

        $output = $post->post_excerpt;
        if( post_password_required( $post ) ) {
          $output = __( 'There is no excerpt because this is a protected post.', 'carrington-build' );

          return $output;
        }
        $ret = apply_filters( 'get_the_excerpt', $output );

        $post = $old_post;
        if( $post ) {
          setup_postdata( $post );
        }

        return $ret;
      }

      return '';
    }

// Content Move Helpers

    protected $reference_fields = array( 'global_image', 'post_image', 'featured_image', 'post_id' );

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

