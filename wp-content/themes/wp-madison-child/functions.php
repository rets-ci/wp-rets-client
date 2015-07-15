<?php
/**
 * RDC child theme based on WP-Madison 2.0
 */

/**
 * Enqueue parent style hook
 */
add_action( 'wp_enqueue_scripts', 'theme_enqueue_styles' );

/**
 * Enqueue parent style
 */
function theme_enqueue_styles() {
  wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
}

/**
 * Register additional nav menu
 */
register_nav_menu( 'header-secondary', __('Secondary Header Menu') );

