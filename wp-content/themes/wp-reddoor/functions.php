<?php
function reddor_init() {
    wp_enqueue_script('jquery');
    wp_enqueue_script('less', get_bloginfo('stylesheet_directory') . '/static/scripts/src/less.js');
    wp_enqueue_style('bootstrap', get_bloginfo('stylesheet_directory') . '/static/styles/src/bootstrap.min.css');
    wp_enqueue_style('bootstrap-theme', get_bloginfo('stylesheet_directory') . '/static/styles/src/bootstrap-theme.min.css');
    wp_enqueue_script('bootstrap', get_bloginfo('stylesheet_directory') . '/static/scripts/src/bootstrap.js');
    wp_enqueue_style('style', get_bloginfo('stylesheet_directory') . '/style.css');
}

add_action( 'wp_enqueue_scripts', 'reddor_init' );


/* Theme support */
add_theme_support('post-thumbnails');
add_image_size('sliderC-thumbnail', 152, 115, true);


/* Register menu */
register_nav_menu('main-menu', 'Main menu');


/* Register sidebar */
$args = array(
    'name' => __('Sidebar Left'),
    'id' => 'sidebar-left');
register_sidebar($args);
