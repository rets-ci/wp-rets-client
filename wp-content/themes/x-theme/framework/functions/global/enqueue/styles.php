<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ENQUEUE/STYLES.PHP
// -----------------------------------------------------------------------------
// Theme styles.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Enqueue Site Styles
//   02. Enqueue Admin Styles
//   03. Enqueue Customizer Styles
//   04. Output Generated Styles
//   05. Filter Style Loader Tags
// =============================================================================

// Enqueue Site Styles
// =============================================================================

if ( ! function_exists( 'x_enqueue_site_styles' ) ) :
  function x_enqueue_site_styles() {

    //
    // Stack data.
    //

    $stack  = x_get_stack();
    $design = x_get_option( 'x_integrity_design' );

    if ( $stack == 'integrity' && $design == 'light' ) {
      $ext = '-light';
    } elseif ( $stack == 'integrity' && $design == 'dark' ) {
      $ext = '-dark';
    } else {
      $ext = '';
    }



    //
    // Enqueue styles.
    //

    wp_enqueue_style( 'x-stack', X_TEMPLATE_URL . '/framework/css/dist/site/stacks/' . $stack . $ext . '.css', NULL, X_ASSET_REV, 'all' );

    do_action( 'x_enqueue_styles' );

    if ( is_child_theme() && apply_filters( 'x_enqueue_parent_stylesheet', false ) ) {
      $rev = ( defined( 'X_CHILD_ASSET_REV' ) ) ? X_CHILD_ASSET_REV : X_ASSET_REV;
      wp_enqueue_style( 'x-child', get_stylesheet_directory_uri() . '/style.css', array(), $rev, 'all' );
    }

    if ( is_rtl() ) {
      wp_enqueue_style( 'x-rtl', X_TEMPLATE_URL . '/framework/css/dist/site/rtl/' . $stack . '.css', NULL, X_ASSET_REV, 'all' );
    }

    if ( X_BBPRESS_IS_ACTIVE ) {
      if ( x_is_bbpress() ) {
        wp_deregister_style( 'buttons' );
      }
      wp_deregister_style( 'bbp-default' );
      wp_enqueue_style( 'x-bbpress', X_TEMPLATE_URL . '/framework/css/dist/site/bbpress/' . $stack . $ext . '.css', NULL, X_ASSET_REV, 'all' );
    }

    if ( X_BUDDYPRESS_IS_ACTIVE ) {
      wp_deregister_style( 'bp-legacy-css' );
      wp_deregister_style( 'bp-admin-bar' );
      wp_enqueue_style( 'x-buddypress', X_TEMPLATE_URL . '/framework/css/dist/site/buddypress/' . $stack . $ext . '.css', NULL, X_ASSET_REV, 'all' );
    }

    if ( X_WOOCOMMERCE_IS_ACTIVE ) {
      wp_deregister_style( 'woocommerce-layout' );
      wp_deregister_style( 'woocommerce-general' );
      wp_deregister_style( 'woocommerce-smallscreen' );
      wp_enqueue_style( 'x-woocommerce', X_TEMPLATE_URL . '/framework/css/dist/site/woocommerce/' . $stack . $ext . '.css', NULL, X_ASSET_REV, 'all' );
    }

    if ( X_GRAVITY_FORMS_IS_ACTIVE ) {
      wp_enqueue_style( 'x-gravity-forms', X_TEMPLATE_URL . '/framework/css/dist/site/gravity_forms/' . $stack . $ext . '.css', NULL, X_ASSET_REV, 'all' );
    }

    if ( X_CONTACT_FORM_7_IS_ACTIVE ) {
      wp_deregister_style( 'contact-form-7' );
    }

    x_enqueue_google_fonts();

  }
endif;

add_action( 'wp_enqueue_scripts', 'x_enqueue_site_styles' );



// Enqueue Admin Styles
// =============================================================================

if ( ! function_exists( 'x_enqueue_admin_styles' ) ) :
  function x_enqueue_admin_styles( $hook ) {

    wp_enqueue_style( x_tco()->handle( 'admin-css' ) );
    wp_enqueue_style( 'x-base', X_TEMPLATE_URL . '/framework/css/dist/admin/base.css', NULL, X_ASSET_REV, 'all' );
    wp_enqueue_style( 'wp-color-picker' );

    if ( strpos( $hook, 'x-extensions' ) != false ) {
      wp_enqueue_style( 'x-datepicker', X_TEMPLATE_URL . '/framework/css/dist/admin/datepicker.css', NULL, X_ASSET_REV, 'all' );
    }

    if ( X_VISUAL_COMOPSER_IS_ACTIVE ) {
      wp_enqueue_style( 'x-visual-composer', X_TEMPLATE_URL . '/framework/css/dist/admin/visual-composer.css', NULL, X_ASSET_REV, 'all' );
    }

  }
endif;

add_action( 'admin_enqueue_scripts', 'x_enqueue_admin_styles' );



// Enqueue Customizer Styles
// =============================================================================

if ( ! function_exists( 'x_enqueue_customizer_controls_styles' ) ) :
  function x_enqueue_customizer_controls_styles() {

    wp_enqueue_style( 'x-customizer', X_TEMPLATE_URL . '/framework/css/dist/admin/customizer.css', NULL, X_ASSET_REV, 'all' );

  }
endif;

add_action( 'customize_controls_print_styles', 'x_enqueue_customizer_controls_styles' );



// Output Generated Styles
// =============================================================================

if ( ! function_exists( 'x_output_generated_styles' ) ) :
  function x_output_generated_styles() {

    echo '<style id="x-generated-css" type="text/css">';
    do_action( 'x_head_css' );
    echo '</style>';

  }
endif;

add_action( 'wp_head', 'x_output_generated_styles', 9998, 0 );
add_action( 'x_head_css', 'x_customizer_output_css' );
add_action( 'x_head_css', 'x_customizer_output_custom_css', 25 );

function x_customizer_output_custom_css() {
  echo x_get_option( 'x_custom_styles' );
}



// Filter Style Loader Tags
// =============================================================================

if ( ! function_exists( 'x_filter_style_loader_tag' ) ) :
  function x_filter_style_loader_tag( $tag, $handle ) {

    if ( X_BBPRESS_IS_ACTIVE ) {
      if ( $handle == 'editor-buttons' && x_is_bbpress() && ! is_admin() ) {
        $tag = '';
      }
    }

    return $tag;

  }
endif;

add_filter( 'style_loader_tag', 'x_filter_style_loader_tag', 10, 2 );
