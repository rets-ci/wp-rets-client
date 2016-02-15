<?php

add_action('wp_enqueue_scripts', function () {
  wp_enqueue_script('jquery');
  wp_enqueue_script('less', get_bloginfo('stylesheet_directory') . '/static/scripts/src/less.js');
  wp_enqueue_style('bootstrap', get_bloginfo('stylesheet_directory') . '/static/styles/src/bootstrap.min.css');
  wp_enqueue_style('bootstrap-theme', get_bloginfo('stylesheet_directory') . '/static/styles/src/bootstrap-theme.min.css');
  wp_enqueue_script('bootstrap', get_bloginfo('stylesheet_directory') . '/static/scripts/src/bootstrap.js');
  wp_enqueue_script('svgxuse', 'https://i.icomoon.io/public/524f31be7a/rdc/svgxuse.js');
  wp_enqueue_style('style', get_bloginfo('stylesheet_directory') . '/style.css');
  wp_enqueue_style('style-svg', '/https://i.icomoon.io/public/524f31be7a/rdc/style-svg.css');
});


/* Theme support */
add_theme_support('post-thumbnails');

/* Register menu */
register_nav_menu('main-menu', 'Main menu');


/* Register sidebar */
if (function_exists('register_sidebar')) {
  register_sidebar(array(
    'name' => 'Footer area 1',
    'id' => 'footer_area_1',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h2 class="offscreen">',
    'after_title' => '</h2>',
  ));
  register_sidebar(array(
    'name' => 'Footer area 2',
    'id' => 'footer_area_2',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h2 class="offscreen">',
    'after_title' => '</h2>',
  ));
  register_sidebar(array(
    'name' => 'Footer area 3',
    'id' => 'footer_area_3',
    'before_widget' => '<div id="%1$s" class="widget %2$s">',
    'after_widget' => '</div>',
    'before_title' => '<h2 class="offscreen">',
    'after_title' => '</h2>',
  ));

}


/* Customize logo */
function rdc_theme_customizer($wp_customize)
{
  $wp_customize->add_section('rdc_logo_section', array(
    'title' => __('Logo', 'rdc'),
    'priority' => 30,
    'description' => 'Upload a logo to replace the default site name and description in the header',
  ));
  $wp_customize->add_setting('rdc_logo');
  $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'rdc_logo', array(
    'label' => __('Logo', 'rdc'),
    'section' => 'rdc_logo_section',
    'settings' => 'rdc_logo',
  )));
}

add_action('customize_register', 'rdc_theme_customizer');

function set_associations_posttype()
{
  register_post_type('associations', array(
    'labels' => array(
      'name' => 'Association',
      'singular_name' => 'Association',
      'add_new' => 'Add association',
      'add_new_item' => 'add new association',
      'edit_item' => 'Edit association',
      'new_item' => 'New association',
      'view_item' => 'View association',
      'search_items' => 'Search association',
      'not_found' => 'Association not found',
      'not_found_in_trash' => 'Association not found in trash',
      'parent_item_colon' => ''
    ),
    'public' => true,
    'supports' => array('title', 'thumbnail'),
    'has_archive' => false,
    'exclude_from_search' => true

  ));

}

add_action('init', 'set_associations_posttype');