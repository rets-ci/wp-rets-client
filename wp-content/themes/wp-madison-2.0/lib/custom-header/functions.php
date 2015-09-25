<?php
/**
 * Functions for creating a highly customized
 * header for our theme.
 * 
 * @package Madison
 * @author Justin Kopepasah
*/

/**
 * Add theme support for the custom header.
 * 
 * @since 1.0.0
*/
function madison_custom_header_setup() {
	$defaults = array(
		'default-image'          => get_template_directory_uri() . '/lib/custom-header/images/custom-logo.png',
		'flex-height'            => true,
		'flex-width'             => false,
		'width'                  => 900,
		'height'                 => 200,
		'header-text'            => false,
		'wp-head-callback'       => 'madison_header_style',
		'admin-head-callback'    => 'madison_admin_header_style',
		'admin-preview-callback' => 'madison_admin_preview_callback'
	);
  
  /**
   * Hack for Wordpress 3.9 which has the bug with default-image. 
   * We remove default-image from our parameters but we set it again in madison_header_style() function.
   * See: https://core.trac.wordpress.org/ticket/27850
   */   
  if( version_compare( $GLOBALS['wp_version'], '3.9', '==' ) ) {
    unset( $defaults[ 'default-image' ] );
  }

	add_theme_support( 'custom-header', apply_filters( 'madison_custom_header_args', $defaults ) );
}
add_action( 'after_setup_theme', 'madison_custom_header_setup', 11 );

/**
 * Style the header text displayed on the site.
 *
 * @since 1.0.0
 * @return void
 */
function madison_header_style() {
	$custom_header = get_custom_header();
	$header_image = get_header_image();

	if ( ! empty( $custom_header->url ) ) {
		$url = $custom_header->url;
  } 
  /**
   * Hack for Wordpress 3.9 which has the bug with default-image.
   * Set our default-image here.
   * See: https://core.trac.wordpress.org/ticket/27850
   */
  else if ( version_compare( $GLOBALS['wp_version'], '3.9', '==' ) ) {
    $url = get_template_directory_uri() . '/lib/custom-header/images/custom-logo.png';
	}
  else {
    // If header image is empty, let's bail.
    if ( empty( $header_image ) ) {
      return;
    }
		$url = $header_image;
	}

	?>
	<style type="text/css" id="madison-custom-header-styles">
		#site-header .site-title a {
			display: block;
		}
		#site-header .site-title img {
			display: block;
		}
		#site-header .site-tagline {
			display: none;
		}
		#site-header .site-branding .site-title a {
			display: block;
			width: 100%;
			max-width: <?php echo round( $custom_header->width / 2 ) ?>px;
			height: <?php echo round( $custom_header->height / 2 ) ?>px;
/*			margin: <?php echo round( $custom_header->height / 2 / 4 ) ?>px 0;*/
			padding: 0;
			background: url("<?php echo $url; ?>") no-repeat scroll center left !important;
			background-size: contain !important;
			text-indent: -999em;
		}
		#site-header .site-navigation .menu > li > a {
			padding-top: <?php echo ( round( $custom_header->height / 2 ) - 21 ) / 2; ?>px;
			padding-bottom: <?php echo ( round( $custom_header->height / 2 ) - 21 ) / 2; ?>px;
		}
	</style>
	<?php
}

/**
 * Callback for outputing the preview for the
 * header image.
 * 
 * @since 1.0.0
*/
function madison_admin_preview_callback() {
	$custom_header = get_custom_header();
	$header_image = get_header_image();

	?>
		<?php if ( $header_image == false ) : ?>
			<div id="headimg" class="no-image">
				<p><?php _e( 'Use this page to upload a custom logo for your real estate site.', 'madison' ); ?></p>
			</div>
		<?php else : ?>
			<div id="headimg">
				<img src="<?php echo esc_url( $header_image ) ?>" alt="" />
			</div>
			<p><?php _e( 'Your image width has been scaled down from ' . $custom_header->width . 'px to ' . $custom_header->width / 2 . 'px (half it\'s size) to display correctly on Retina and other high resolution screens. For best results, upload an image that is double the size you want displayed. For example, is you want an image that is 300px wide, upload and image that has a width of 600px.', 'madison' ); ?></p>
		<?php endif; ?>
	<?php
}

/**
 * Style the header image displayed on the Appearance > Header admin panel.
 *
 * @since 1.0.0
 * @return void
 */
function madison_admin_header_style() {
	$custom_header = get_custom_header();
	$background = get_theme_mod( 'property_header_background_color' );
?>
	<style type="text/css" id="madison-admin-custom-header-styles">
		.appearance_page_custom-header #headimg {
			background: #<?php echo ( $background ) ? $background : 'E75B67'; ?>;
			border: none;
		}
		.appearance_page_custom-header #headimg.no-image {
			background: #FFF;
			border-left: 3px solid #DB8A38;
		}
		.appearance_page_custom-header #headimg p {
			padding: 1em;
		}
		.appearance_page_custom-header #headimg img {
			margin-left: 1em;
			max-width: <?php echo round( $custom_header->width / 2 ) ?>px;
		}
	</style>
<?php
}