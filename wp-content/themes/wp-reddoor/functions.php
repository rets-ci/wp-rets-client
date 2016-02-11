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
if (function_exists('register_sidebar')) {
    register_sidebar(array(
        'name'=> 'Footer area 1',
        'id' => 'footer_area_1',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h2 class="offscreen">',
        'after_title' => '</h2>',
    ));
    register_sidebar(array(
        'name'=> 'Footer area 2',
        'id' => 'footer_area_2',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h2 class="offscreen">',
        'after_title' => '</h2>',
    ));
    register_sidebar(array(
        'name'=> 'Footer area 3',
        'id' => 'footer_area_3',
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h2 class="offscreen">',
        'after_title' => '</h2>',
    ));

}


/* Customize logo */
function themeslug_theme_customizer( $wp_customize ) {
    $wp_customize->add_section( 'themeslug_logo_section' , array(
        'title'       => __( 'Logo', 'themeslug' ),
        'priority'    => 30,
        'description' => 'Upload a logo to replace the default site name and description in the header',
    ) );
    $wp_customize->add_setting( 'themeslug_logo' );
    $wp_customize->add_control( new WP_Customize_Image_Control( $wp_customize, 'themeslug_logo', array(
        'label'    => __( 'Logo', 'themeslug' ),
        'section'  => 'themeslug_logo_section',
        'settings' => 'themeslug_logo',
    ) ) );
}
add_action( 'customize_register', 'themeslug_theme_customizer' );
