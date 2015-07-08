<?php
/**
 * Madison functions and definitions
 *
 * @package Madison
 * @author Justin Kopepasah
*/

// Let's set some globals for use.
$GLOBALS['koop_theme_data']['prefix'] = 'madison';
$GLOBALS['koop_theme_data']['version'] = '1.0.0';

/**
 * Set the content width value because the large
 * featured image is resized by this setting.
 *
 * @since 1.0.0
*/
if ( ! isset( $content_width ) ) {
	$content_width = 700;
}

/**
 * Madison only works in WordPress 3.6 or later.
 * Let's make sure users do not run into any
 * troubles when trying to activate Madison on WP
 * versions less than 3.6.
 *
 * @since 1.0.0
*/
if ( version_compare( $GLOBALS['wp_version'], '3.6', '<' ) ) {
	require_once( dirname( __FILE__ ) . '/compatibility/init.php' );
}

/**
 * Load the contents of the lib directory.
 *
 * @since 1.0.0
*/
require_once( dirname( __FILE__ ) . '/load.php' );

/**
 * Sets up theme defaults and registers support
 * for various WordPress features.
 *
 * @since 1.0.0
*/
function madison_setup() {
	// Make theme available for translation.
	load_theme_textdomain( 'madison', get_template_directory() . '/languages' );

	// Add default posts and comments RSS feed links to head.
	add_theme_support( 'automatic-feed-links' );

	// Add editor style.
	add_editor_style( 'css/editor.css' );

	// Enable support for Post Thumbnails on posts and pages.
	add_theme_support( 'post-thumbnails' );

	// Add theme support for Less, using Less Theme Support plugin.
	// REMOVE Remove less support befor tagging 1.0.0.
	add_theme_support( 'less', array(
		'enable'  => true,
		'develop' => true,
		'watch'   => true,
		'minify'  => true
	) );

	/**
	 * Set up the name and data for each of the image
	 * sizes used within the theme.
	 *
	 * For each of those image sizes ($image_sizes)
	 * output the add_image_size function.
	**/
	$image_sizes = array(
		'content-featured' => array(
			'width'  => 800,
			'height' => 450,
			'crop'   => true
		),
		'content-gallery' => array(
			'width'  => 1050,
			'height' => 700,
			'crop'   => true
		),
		'property-overview-featured' => array(
			'width'  => 600,
			'height' => 400,
			'crop'   => true
		),
		'property-featured-image' => array(
			'width'  => 800,
			'height' => 600,
			'crop'   => true
		),
		'property-overview-featured-full' => array(
			'width'  => 2000,
			'height' => 600,
			'crop'   => true
		),
		'supermap-slides-thumb' => array(
			'width'  => 300,
			'height' => 200,
			'crop'   => true
		),
		'wpp-nivoslider' => array(
			'width'  => 600,
			'height' => 400,
			'crop'   => true
		),
	);

	foreach ( $image_sizes as $name => $data ) {
		add_image_size( $name, $data['width'], $data['height'], $data['crop'] );
	}

	// This theme uses wp_nav_menu() in one location.
	register_nav_menus( array(
		'header' => __( 'Header Menu', 'madison' ),
	) );

	// Enable support for Post Formats.
	add_theme_support( 'post-formats', array( 'gallery', 'audio', 'video' ) );

	// Ad theme support for Jetpack's Infinite Scroll.
	add_theme_support( 'infinite-scroll', array(
		'type'           => 'click',
		'container'      => 'site-main',
		'wrapper'        => false,
		'posts_per_page' => get_option( 'posts_per_page' ),
	) );
}
add_action( 'after_setup_theme', 'madison_setup' );

/**
 * Register widgetized area and update sidebar
 * with default widgets.
 *
 * @since 1.0.0
*/
function madison_widgets_init() {
	register_sidebar( array(
		'name'          => __( 'Sidebar', 'madison' ),
		'id'            => 'sidebar-1',
		'description'   => __( 'Default sidebar for this theme. It will appear either on the left or right side of your content (depending on the layout setting.)', 'madison' ),
		'before_widget' => '<aside id="%1$s" class="widget %2$s">',
		'after_widget'  => '</aside>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );

	register_sidebar( array(
		'name'          => __( 'Footer', 'madison' ),
		'id'            => 'footer-1',
		'description'   => __( 'Widget area for the footer. If no widgets are provided, this footer will not appear.', 'madison' ),
		'before_widget' => '<aside id="%1$s" class="widget column col-4-12 %2$s"><div class="col-inner">',
		'after_widget'  => '</div></aside>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'madison_widgets_init', 11 );

/**
 * Enqueue scripts and styles.
 *
 * @since 1.0.0
*/
function madison_scripts() {
	// Enqueue the main stylesheet (style.css).

	wp_enqueue_style( 'bootstrap-css', '//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css' );
	wp_enqueue_style( 'madison', get_stylesheet_uri() );
	wp_enqueue_style( 'madison-fa-icons', get_template_directory_uri() . '/fonts/icons/fa/css/font-awesome.min.css', array(), '4.0.3' );

	// Register libraries that are used by the theme.
	wp_register_script( 'colorbox', get_template_directory_uri() . '/js/colorbox.min.js', array( 'jquery' ), '1.4.33', true );
	wp_register_script( 'fitvids', get_template_directory_uri() . '/js/fitvids.js', array( 'jquery' ), false, true );
	wp_register_script( 'slides', get_template_directory_uri() . '/js/slides.min.js', array( 'jquery' ), '3.0.4', true );

	if ( ! wp_script_is( 'spin', 'registered' ) ) {
		wp_register_script( 'spin', get_template_directory_uri() . '/js/spin.min.js', array(), '1.3.3', true );
	}

	wp_register_script( 'modernizr', 'http://modernizr.com/downloads/modernizr-latest.js', array(), '2.7.1', false );

	// Enqueue the global script.
	wp_enqueue_script( 'madison-global', get_template_directory_uri() . '/js/global.js', array( 'fitvids', 'modernizr' ), $GLOBALS['koop_theme_data']['version'], true );

	// Enqueue comment reply script.
	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}

	// Enqueue singluar for the gallery.
	if ( is_singular() && has_post_format( 'gallery' ) && ( class_exists( 'Jetpack' ) && Jetpack::is_module_active( 'carousel' ) != true ) ) {
		wp_enqueue_script( 'madison-gallery', get_template_directory_uri() . '/js/gallery.js', array( 'colorbox' ), $GLOBALS['koop_theme_data']['version'], true );
	}

	if ( is_home() ) {
		wp_enqueue_script( 'slides' );
	}
}
add_action( 'wp_enqueue_scripts', 'madison_scripts' );

/**
 * WP Property specific code.
 *
 * @since 1.0.0
*/
if ( defined( 'WPP_Version' ) ) {

  if( !function_exists( 'madison_wpp_mode' ) ) {
    /**
     * Adds WP-Property plugin modifications and customizations
     */
    function madison_wpp_mode() {
      require_once( get_template_directory() . '/wp-property/functions.php' );
    }
    
    /**
     * @used WPP_Core::init_lower() ( wp-property/core/class_core.php )
     */
    add_action( 'wpp_post_init', 'madison_wpp_mode', 100 );
  }
	
}