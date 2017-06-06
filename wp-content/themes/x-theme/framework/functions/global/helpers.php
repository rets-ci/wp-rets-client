<?php

// =============================================================================
// FUNCTIONS/GLOBAL/HELPERS.PHP
// -----------------------------------------------------------------------------
// Helper functions for various tasks.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Get / Set View
//   02. Get / Set View Transient
//   03. X Is Validated
//   04. Make Protocol Relative
//   05. Get Featured Image URL
//   06. Get Featured Image URL (With Social Fallback Image)
//   07. Return an Array of Integer Values from String
//   08. Get The ID
//   09. Get Post by Title
//   10. Get Page by Title
//   11. Get Portfolio Item by Title
//   12. Get Slider Shortcode
//   13. Get Clean CSS
//   14. Generate HTML Attribute
//   15. Generate HTML Attributes
//   16. Generate Class Attribute
//   17. Generate Data Attribute JSON
//   18. Generate Inline CSS
//   19. Generate CSS Block
//   20. Prepare Post CSS Value
//   21. Get Current Admin Color Scheme
//   22. i18n helper
//   23. Deprecated
// =============================================================================

// Get / Set View
// =============================================================================

function x_get_view( $directory, $file_base, $file_extension = '', $custom_data = array(), $echo = true ) {

  $file_action = $directory . '_' . $file_base . ( empty( $file_extension ) ? '' : '-' . $file_extension );

  $view = array(
    'base'      => 'framework/views/' . $directory . '/' . $file_base,
    'extension' => $file_extension
  );

  $view = apply_filters( 'x_get_view', $view, $directory, $file_base, $file_extension );

  if ( '' === $view['base'] ) {
    return;
  }

  $template = X_View_Router::locate( $view['base'], $view['extension'] );

  if ( ! $template ) {
    return;
  }

  do_action( 'x_before_view_' . $file_action );

  $output = X_View_Router::render( $template, $custom_data, $echo );

  do_action( 'x_after_view_' . $file_action );

  return $output;

}


function x_set_view( $action, $directory, $file_base, $file_extension = '', $data = NULL, $priority = 10, $override = false ) {
  X_View_Router::set( $action, $directory, $file_base, $file_extension, $data, $priority, $override );
}



// Get / Set View Transient
// =============================================================================

function x_get_view_transient( $key ) {

  GLOBAL $x_view_transients;

  if ( ! isset( $x_view_transients ) ) {
    $x_view_transients = array();
  }

  return $x_view_transients[$key];

}


function x_set_view_transient( $key, $value ) {

  GLOBAL $x_view_transients;

  if ( ! isset( $x_view_transients ) ) {
    $x_view_transients = array();
  }

  $x_view_transients[$key] = $value;

}



// Action Defer
// =============================================================================

function x_action_defer( $action, $function, $args = array(), $priority = 10, $array_args = false  ) {
  X_Action_Defer::defer( $action, $function, $args, $priority, $array_args );
}



// X Is Validated
// =============================================================================

function x_is_validated() {

  if ( get_option( 'x_product_validation_key' ) != false ) {
    return true;
  } else {
    return false;
  }

}



// Make Protocol Relative
// =============================================================================

//
// Accepts a string and replaces any instances of "http://" and "https://" with
// the protocol relative "//" instead.
//

function x_make_protocol_relative( $string ) {

  $output = str_replace( array( 'http://', 'https://' ), '//', $string );

  return $output;

}



// Get Featured Image URL
// =============================================================================

if ( ! function_exists( 'x_get_featured_image_url' ) ) :
  function x_get_featured_image_url( $size = 'full' ) {

    $featured_image     = wp_get_attachment_image_src( get_post_thumbnail_id(), $size );
    $featured_image_url = $featured_image[0];

    return $featured_image_url;

  }
endif;



// Get Featured Image URL (With Social Fallback Image)
// =============================================================================

if ( ! function_exists( 'x_get_featured_image_with_fallback_url' ) ) :
  function x_get_featured_image_with_fallback_url( $size = 'full' ) {

    $featured_image_url        = x_get_featured_image_url( $size );
    $social_fallback_image_url = get_option( 'x_social_fallback_image' );

    if ( $featured_image_url != NULL ) {
      $image_url = $featured_image_url;
    } else {
      $image_url = $social_fallback_image_url;
    }

    return $image_url;

  }
endif;



// Return an Array of Integer Values from String
// =============================================================================

//
// Removes all whitespace from the provided string, separates values delimited
// by comma, and returns an array of integer values.
//

function x_intval_explode( $string ) {

  $output = array_map( 'intval', explode( ',', preg_replace( '/\s+/', '', $string ) ) );

  return $output;

}



// Get The ID
// =============================================================================

//
// Gets the ID of the current page, post, et cetera. Can be used outside of the
// loop and also returns the ID for blog and shop index pages.
//

function x_get_the_ID() {

  GLOBAL $post;

  if ( is_home() ) {
    $id = get_option( 'page_for_posts' );
  } elseif ( x_is_shop() ) {
    $id = ( function_exists( 'wc_get_page_id' ) ) ? wc_get_page_id( 'shop' ) : woocommerce_get_page_id( 'shop' );
  } elseif ( is_404() ) {
    $id = NULL;
  } else {
    $id = $post->ID;
  }

  return $id;

}



// Get Post by Title
// =============================================================================

function x_get_post_by_title( $title ) {

  return get_page_by_title( $title, 'ARRAY_A', 'post' );

}



// Get Page by Title
// =============================================================================

function x_get_page_by_title( $title ) {

  return get_page_by_title( $title, 'ARRAY_A', 'page' );

}



// Get Portfolio Item by Title
// =============================================================================

function x_get_portfolio_item_by_title( $title ) {

  return get_page_by_title( $title, 'ARRAY_A', 'x-portfolio' );

}



// Get Slider Shortcode
// =============================================================================

//
// Accepts an identifier string to determine which shortcode should be output.
// These strings are generated by default in the slider meta options and look
// something like "x-slider-ls-2", which explains that this is a slider from
// the LayerSlider plugin with an ID of 2. If a string not beginning with
// "x-slider" is input, it is assumed to be a slug for Revolution Slider and
// is output using that shortcode.
//

function x_get_slider_shortcode( $string ) {

  //
  // Conditionals.
  //

  $is_new_slug             = strpos( $string, 'x-slider-' ) !== false;
  $is_new_layerslider_slug = strpos( $string, 'x-slider-ls-' ) !== false;


  //
  // Get shortcode.
  //

  $shortcode = ( $is_new_layerslider_slug ) ? 'layerslider' : 'rev_slider';


  //
  // Get shortcode parameter.
  //

  $parameter = ( $is_new_layerslider_slug ) ? 'id' : 'alias';


  //
  // Get shortcode parameter value.
  //

  if ( $is_new_slug ) {
    $string_pieces   = explode( '-', $string );
    $slider_id       = end( $string_pieces );
    $parameter_value = $slider_id;
  } else {
    $parameter_value = $string;
  }


  //
  // Return shortcode format.
  //

  return "[{$shortcode} {$parameter}=\"{$parameter_value}\"]";

}



// Get Clean CSS
// =============================================================================

function x_get_clean_css( $css ) {

  //
  // 1. Remove comments.
  // 2. Remove whitespace.
  // 3. Remove starting whitespace.
  //

  $output = preg_replace( '#/\*.*?\*/#s', '', $css );            // 1
  $output = preg_replace( '/\s*([{}|:;,])\s+/', '$1', $output ); // 2
  $output = preg_replace( '/\s\s+(.*)/', '$1', $output );        // 3

  return $output;

}



// Generate HTML Attribute
// =============================================================================

function x_attr( $attr, $value, $echo = false ) {

  $result = '';

  if ( is_null( $value ) ) {
    $result = $attr . ' ';
  } else {
    $result = $attr . '="' . esc_attr( $value ) . '" ';
  }

  if ( $echo ) {
    echo $result;
  }

  return $result;

}



// Generate HTML Attributes
// =============================================================================

function x_atts( $atts, $echo = false ) {

  $result = '';

  foreach ( $atts as $attr => $value ) {
    $result .= x_attr( $attr, $value, false ) . ' ';
  }

  if ( $echo ) {
    echo $result;
  }

  return $result;

}



// Generate Class Attribute
// =============================================================================

function x_attr_class( $classes = array() ) {

  $result = '';

  if ( ! empty( $classes ) ) {
    $result = implode( ' ', array_filter( $classes ) );
  }

  return $result;

}



// Generate Data Attribute JSON
// =============================================================================

function x_attr_json( $params = array() ) {

  $result = '';

  if ( ! empty( $params ) ) {
    $result = htmlspecialchars( wp_json_encode( array_filter( $params, 'strlen' ) ), ENT_QUOTES, 'UTF-8' );
  }

  return $result;

}



// Generate Inline CSS
// =============================================================================

function x_inline_css( $styles = array() ) {

  $result = '';

  if ( ! empty( $styles ) ) {

    foreach ( $styles as $property => $value ) :
      $result .= $property . ': ' . $value . '; ';
    endforeach;

  }

  return $result;

}



// Generate CSS Block
// =============================================================================

function x_css_block( $css = array(), $breakpoint = false, $scoped = false, $id = null ) {

  $scoped   = ( $scoped )     ? ' scoped' : '';
  $bp_open  = ( $breakpoint ) ? '@media ' . $breakpoint . ' {' : '';
  $bp_close = ( $breakpoint ) ? '}' : '';

  echo '<style' . $scoped . '>';
    echo $bp_open;
      foreach ( $css as $selector => $styles ) {

        if ( ! is_null( $id ) ) {
          $selector = str_replace( '$el', '.hm' . $id, $selector );
        }

        echo $selector . '{';
          echo x_inline_css( $styles );
        echo '}';

      }
    echo $bp_close;
  echo '</style>';

}



// Prepare Post CSS Value
// =============================================================================

function x_post_css_value( $value, $designation ) {
  return ( function_exists('cornerstone_post_process_color') ) ? "%%post $designation%%$value%%/post%%" : $value;
}

function x_post_process_color( $value ) {
  return ( function_exists('cornerstone_post_process_color') ) ? cornerstone_post_process_color( $value ) : $value;
}




// Get Current Admin Color Scheme
// =============================================================================

function x_get_current_admin_color_scheme( $type = 'colors' ) {

  GLOBAL $_wp_admin_css_colors;

  $current_color_scheme = get_user_option( 'admin_color' );
  $admin_colors         = $_wp_admin_css_colors;
  $user_colors          = (array) $admin_colors[$current_color_scheme];

  return ( $type == 'icons' ) ? $user_colors['icon_colors'] : $user_colors['colors'];

}

function x_i18n( $namespace, $key ) {

  static $i18n = array();

  if ( ! isset( $i18n[$namespace] ) ) {
    $filename = X_I18N_PATH . "/theme-{$namespace}.php";
    if ( file_exists( $filename ) ) {
      $i18n[$namespace] = include( $filename );
    } else {
      $i18n[$namespace] = array();
    }
  }

  return isset( $i18n[$namespace][$key] ) ? $i18n[$namespace][$key] : '';

}


// Deprecated
// =============================================================================

if ( ! function_exists( 'x_header_widget_areas_count' ) ) :
  function x_header_widget_areas_count() {

    return x_get_option( 'x_header_widget_areas' );

  }
endif;

if ( ! function_exists( 'x_footer_widget_areas_count' ) ) :
  function x_footer_widget_areas_count() {

    return x_get_option( 'x_footer_widget_areas' );

  }
endif;
