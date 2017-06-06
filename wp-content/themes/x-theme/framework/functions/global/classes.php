<?php

// =============================================================================
// FUNCTIONS/GLOBAL/CLASSES.PHP
// -----------------------------------------------------------------------------
// Outputs custom classes for various elements, sometimes depending on options
// selected in the Customizer.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Body Class
//   02. Post Class
//   03. Main Content Class
//   04. Sidebar Class
//   05. Portfolio Entry Class
// =============================================================================

// Body Class
// =============================================================================

if ( ! function_exists( 'x_body_class' ) ) :
  function x_body_class( $output ) {

    $stack                            = x_get_stack();
    $entry_id                         = get_the_ID();

    $is_blog                          = is_home();
    $blog_style_masonry               = x_get_option( 'x_blog_style' ) == 'masonry';
    $post_meta_disabled               = x_get_option( 'x_blog_enable_post_meta' ) == '';

    $is_archive                       = is_archive();
    $archive_style_masonry            = x_get_option( 'x_archive_style' ) == 'masonry';
    $is_shop                          = x_is_shop();

    $is_page                          = is_page();
    $page_title_disabled              = get_post_meta( $entry_id, '_x_entry_disable_page_title', true ) == 'on';

    $is_portfolio                     = is_page_template( 'template-layout-portfolio.php' );
    $portfolio_meta_disabled          = x_get_option( 'x_portfolio_enable_post_meta' ) == '';

    $integrity_design_dark            = x_get_option( 'x_integrity_design' ) == 'dark';
    $icon_blank_sidebar_active        = $stack == 'icon' && get_post_meta( $entry_id, '_x_icon_blank_template_sidebar', true ) == 'Yes'; 
    $ethos_post_slider_blog_active    = $stack == 'ethos' && is_home() && x_get_option( 'x_ethos_post_slider_blog_enable' ) == 1;
    $ethos_post_slider_archive_active = $stack == 'ethos' && ( is_category() || is_tag() ) && x_get_option( 'x_ethos_post_slider_archive_enable' ) == 1;

    $custom_class                     = get_post_meta( $entry_id, '_x_entry_body_css_class', true );


    //
    // Stack.
    //

    $output[] .= 'x-' . $stack;

    if ( $stack == 'integrity' ) {
      if ( $integrity_design_dark ) {
        $output[] .= 'x-integrity-dark';
      } else {
        $output[] .= 'x-integrity-light';
      }
    }


    //
    // Site layout.
    //

    switch ( x_get_site_layout() ) {
      case 'boxed' :
        $output[] .= 'x-boxed-layout-active';
        break;
      case 'full-width' :
        $output[] .= 'x-full-width-layout-active';
        break;
    }


    //
    // Content layout.
    //

    switch ( x_get_content_layout() ) {
      case 'content-sidebar' :
        $output[] .= 'x-content-sidebar-active';
        break;
      case 'sidebar-content' :
        $output[] .= 'x-sidebar-content-active';
        break;
      case 'full-width' :
        $output[] .= 'x-full-width-active';
        break;
    }


    //
    // Blog and posts.
    //

    if ( $is_blog ) {
      if ( $blog_style_masonry ) {
        $output[] .= 'x-masonry-active x-blog-masonry-active';
      } else {
        $output[] .= 'x-blog-standard-active';
      }
    }

    if ( $post_meta_disabled ) {
      $output[] .= 'x-post-meta-disabled';
    }


    //
    // Archives.
    //

    if ( $is_archive && ! $is_shop ) {
      if ( $archive_style_masonry ) {
        $output[] .= 'x-masonry-active x-archive-masonry-active';
      } else {
        $output[] .= 'x-archive-standard-active';
      }
    }


    //
    // Pages.
    //

    if ( $is_page ) {
      if ( $page_title_disabled ) {
        $output[] .= 'x-page-title-disabled';
      }
    }


    //
    // Portfolio.
    //

    if ( $is_portfolio ) {
      $output[] .= 'x-masonry-active x-portfolio-masonry-active';
    }

    if ( $portfolio_meta_disabled ) {
      $output[] .= 'x-portfolio-meta-disabled';
    }


    //
    // Icon.
    //

    if ( $icon_blank_sidebar_active ) {
      $output[] .= 'x-blank-template-sidebar-active';
    }


    //
    // Ethos.
    //

    if ( $ethos_post_slider_blog_active ) {
      $output[] .= 'x-post-slider-blog-active';
    }

    if ( $ethos_post_slider_archive_active ) {
      $output[] .= 'x-post-slider-archive-active';
    }


    //
    // Custom.
    //

    if ( $custom_class != '' ) {
      $output[] .= $custom_class;
    }

    return $output;

  }
  add_filter( 'body_class', 'x_body_class' );
endif;


if ( ! function_exists( 'x_body_class_info' ) ) :
  function x_body_class_info( $output ) {

    if ( is_child_theme() ) {
      $output[] = 'x-child-theme-active';
    }

    return $output;

  }
  add_filter( 'body_class', 'x_body_class_info', 10000 );
endif;



// Post Class
// =============================================================================

if ( ! function_exists( 'x_post_class' ) ) :
  function x_post_class( $output ) {

    switch ( has_post_thumbnail() ) {
      case true :
        $output[] = 'has-post-thumbnail';
        break;
      case false :
        $output[] = 'no-post-thumbnail';
        break;
    }

    return $output;

  }
  add_filter( 'post_class', 'x_post_class' );
endif;



// Main Content Class
// =============================================================================

if ( ! function_exists( 'x_main_content_class' ) ) :
  function x_main_content_class() {

    switch ( x_get_content_layout() ) {
      case 'content-sidebar' :
        $output = 'x-main left';
        break;
      case 'sidebar-content' :
        $output = 'x-main right';
        break;
      case 'full-width' :
        $output = 'x-main full';
        break;
    }

    echo $output;

  }
endif;



// Sidebar Class
// =============================================================================

if ( ! function_exists( 'x_sidebar_class' ) ) :
  function x_sidebar_class() {

    switch ( x_get_content_layout() ) {
      case 'content-sidebar' :
        $output = 'x-sidebar right';
        break;
      case 'sidebar-content' :
        $output = 'x-sidebar left';
        break;
      default :
        $output = 'x-sidebar right';
    }

    echo $output;

  }
endif;



// Portfolio Entry Class
// =============================================================================

if ( ! function_exists( 'x_portfolio_entry_classes' ) ) :
  function x_portfolio_entry_classes( $classes ) {

    GLOBAL $post;
    $terms = wp_get_object_terms( $post->ID, 'portfolio-category' );
    foreach ( $terms as $term ) {
      $classes[] = 'x-portfolio-' . md5( $term->slug );
    }
    return $classes;

  }
  add_filter( 'post_class', 'x_portfolio_entry_classes' );
endif;
