<?php
/**
 * Various filters to modify the way things work.
 *
 * @package Madison
 * @author Justin Kopepasah
*/

/**
 * Get our wp_nav_menu() fallback, wp_page_menu(), to show a home link.
 *
 * @since 1.0.0
 * @param array $args Configuration arguments.
 * @return array
*/
function madison_page_menu_args( $args ) {
	$args['show_home'] = true;
	return $args;
}
add_filter( 'wp_page_menu_args', 'madison_page_menu_args' );

/**
 * Adds custom classes to the array of body classes.
 *
 * @since 1.0.0
 * @param array $classes Classes for the body element.
 * @return array
*/
function madison_body_classes( $classes ) {
	// Adds a class of group-blog to blogs with more than 1 published author.
	if ( is_multi_author() ) {
		$classes[] = 'group-blog';
	}

	if ( is_active_sidebar( 'sidebar-1' ) ) {
		$classes[] = 'has-sidebar';
	}

	return $classes;
}
add_filter( 'body_class', 'madison_body_classes', 10000 );

/**
 * Adds custom classes to the array of post classes.
 *
 * @since 1.0.0
 * @param array $classes Classes for the post element.
 * @return array
*/
function madison_post_classes( $classes ) {
	if ( has_post_thumbnail() ) {
		$classes[] = 'has-post-thumbnail';
	} else {
		$classes[] = 'no-post-thumbnail';
	}

	$classes[] = 'content-article';

	if ( is_singular( 'property' ) && ! empty( $GLOBALS['post']->property_type ) ) {
		$classes[] = $GLOBALS['post']->property_type;
	}

	return $classes;
}
add_filter( 'post_class', 'madison_post_classes' );

/**
 * Filter the post content for gallery post format.
 *
 * @since 1.0.0
 * @param string The content.
*/
function madison_gallery_filter_the_content( $content ) {
	if ( is_singular() || get_post_format() != 'gallery' ) {
		return $content;
	}

	ob_start();
	?>
	<script type="text/javascript">
	(function(madison_post_format_gallery_<?php echo get_the_ID(); ?>) {
		madison_post_format_gallery_<?php echo get_the_ID(); ?>(window.jQuery, window, document);
		}(function($, window, document) {
			$(function() {
				$( '#post-<?php echo get_the_ID(); ?> .entry-gallery').slidesjs({
					width: 1050,
					height: 700,
					pagination: false,
					navigation: {
						active: false,
						effect: 'fade'
					},
					effect: {
						fade: {
							speed: 300,
						}
					}
				}).css( 'max-height', 'none' );
			});
		})
	);
	</script>
	<?php

	$script = ob_get_clean();

	$content = $content . $script;

	return $content;
}
add_filter( 'the_content', 'madison_gallery_filter_the_content' );

/**
 * Filters wp_title to print a neat <title> tag based on what is being viewed.
 *
 * @since 1.0.0
 * @param string $title Default title text for current view.
 * @param string $sep Optional separator.
 * @return string The filtered title.
*/
function madison_wp_title( $title, $sep ) {
	global $page, $paged;

	if ( is_feed() )
		return $title;

	// Add the blog name
	$title .= get_bloginfo( 'name' );

	// Add the blog description for the home/front page.
	$site_description = get_bloginfo( 'description', 'display' );
	if ( $site_description && ( is_home() || is_front_page() ) )
		$title .= " $sep $site_description";

	// Add a page number if necessary:
	if ( $paged >= 2 || $page >= 2 )
		$title .= " $sep " . sprintf( __( 'Page %s', 'madison' ), max( $paged, $page ) );

	return $title;
}
add_filter( 'wp_title', 'madison_wp_title', 10, 2 );

/**
 * Remove gallery styles from [gallery] shortcode
 * because we provide our own.
*/
add_filter( 'use_default_gallery_style', '__return_false' );

/**
 * Filter the comment form fields to change the way
 * they are displayed.
 *
 * @since 1.0.0
*/
function madison_filter_comment_form_fields( $fields ) {
	$post_id = get_the_ID();
	$commenter = wp_get_current_commenter();
	$user = wp_get_current_user();
	$user_identity = $user->exists() ? $user->display_name : '';

	$req      = get_option( 'require_name_email' );
	$aria_req = ( $req ? " aria-required='true'" : '' );
	$html5    = 'html5';

	$fields   =  array(
		'author' => '<div class="column-wrapper"><div class="column col-4-12"><p class="comment-form-author"><input id="author" name="author" type="text" placeholder="Johnny Appleseed" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30"' . $aria_req . ' />' . ( $req ? ' <span class="required">*</span>' : '' ) . '</p></div>',
		'email'  => '<div class="column col-4-12"><p class="comment-form-email"><input id="email" name="email" ' . ( $html5 ? 'type="email"' : 'type="text"' ) . ' placeholder="johnny@appleseed.com" value="' . esc_attr(  $commenter['comment_author_email'] ) . '" size="30"' . $aria_req . ' />' . ( $req ? ' <span class="required">*</span>' : '' ) . '</p></div>',
		'url'    => '<div class="column col-4-12"><p class="comment-form-url"><input id="url" name="url" ' . ( $html5 ? 'type="url"' : 'type="text"' ) . ' placeholder="appleseed.com" value="' . esc_attr( $commenter['comment_author_url'] ) . '" size="30" /></p></div></div>',
	);

	return $fields;
}
add_filter( 'comment_form_default_fields', 'madison_filter_comment_form_fields' );

/**
 * Filter the comment previous link attributes to
 * add an icon class.
 *
 * @since 1.0.0
*/
function madison_filter_previous_comments_link_attributes( $attributes ) {
	$attributes .= 'class="fa fa-chevron-left btn" title="' . __( 'Previous Comments', 'madison' ) . '"';

	return $attributes;
}
add_filter( 'previous_comments_link_attributes', 'madison_filter_previous_comments_link_attributes' );

/**
 * Filter the comment next link attributes to add
 * an icon class.
 *
 * @since 1.0.0
*/
function madison_filter_next_comments_link_attributes( $attributes ) {
	$attributes .= 'class="fa fa-chevron-left btn" title="' . __( 'Next Comments', 'madison' ) . '"';

	return $attributes;
}
add_filter( 'next_comments_link_attributes', 'madison_filter_next_comments_link_attributes' );

/**
 * Filter Breadcrumb Trail items to add property
 * to the end when viewing the properties page.
 *
 * @since 1.0.0
*/
function madison_filter_breadcrumb_trail_html( $items ) {
	if ( defined( 'WPP_Version' ) && is_property_overview_page() && $GLOBALS['wp_properties']['configuration']['base_slug'] == 'property' ) {
		$items[] = __( 'Property', 'madison' );
	}

	return $items;
}
add_filter( 'breadcrumb_trail_items', 'madison_filter_breadcrumb_trail_html' );

/**
 * Filter Easy Google Font's default fonts and
 * add our own.
 *
 * @since 1.0.0
*/
function madison_filter_easy_google_fonts_options( $options ) {
	// First let's unset the defaults.
	foreach ( $options as $key => $value ) {
		if ( preg_match( '/tt_default_.*/', $key, $match ) ) {
			unset( $options[ $match[0] ] );
		}
	}

	// Now let's create our own.
	$custom_options = array(
		'madison_body_font' => array(
			'name'        => 'madison_body_font',
			'title'       => __( 'Main Body Font', 'madison' ),
			'description' => __( "Please select a font for the theme's main body text", 'madison' ),
			'properties'  => array( 
				'selector' => 'body',
			),
			'default'     => array(
				'subset'            => 'latin',
				'font_id'           => 'open_sans',
				'font_name'         => 'Open Sans',
				'font_weight'       => '400',
				'font_style'        => 'normal',
				'font_weight_style' => 'regular',
			),
		),
		'madison_header_font' => array(
			'name'        => 'madison_header_font',
			'title'       => __( 'Header Fonts', 'madison' ),
			'description' => __( "Please select a font for the theme's headers.", 'madison' ),
			'properties'  => array( 
				'selector' => 'h1,h2,h3,h4,h5,h6,.supermap_list_title',
			),
			'default'     => array(
				'subset'            => 'latin',
				'font_id'           => 'raleway',
				'font_name'         => 'Raleway',
				'font_weight'       => '600',
				'font_style'        => 'normal',
				'font_weight_style' => '600',
			),
		),
		'madison_title_font' => array(
			'name'        => 'madison_title_font',
			'title'       => __( 'Title Font', 'madison' ),
			'description' => __( "Please select a font for the theme's title.", 'madison' ),
			'properties'  => array( 
				'selector' => '#site-header .site-title a',
			),
			'default'     => array(
				'subset'            => 'latin',
				'font_id'           => 'raleway',
				'font_name'         => 'Raleway',
				'font_weight'       => '200',
				'font_style'        => 'normal',
				'font_weight_style' => '200',
			),
		),
		'madison_tagline_font' => array(
			'name'        => 'madison_tagline_font',
			'title'       => __( 'Tagline Font', 'madison' ),
			'description' => __( "Please select a font for the theme's tagline.", 'madison' ),
			'properties'  => array( 
				'selector' => '#site-header .site-tagline',
			),
			'default'     => array(
				'subset'            => 'latin',
				'font_id'           => 'raleway',
				'font_name'         => 'Raleway',
				'font_weight'       => '400',
				'font_style'        => 'normal',
				'font_weight_style' => 'regular',
			),
		),
		'madison_menu_items_font' => array(
			'name'        => 'madison_menu_items_font',
			'title'       => __( 'Menu Item Font', 'madison' ),
			'description' => __( "Please select a font for the theme's menu items.", 'madison' ),
			'properties'  => array( 
				'selector' => '#site-header .site-navigation a',
			),
			'default'     => array(
				'subset'            => 'latin',
				'font_id'           => 'raleway',
				'font_name'         => 'Raleway',
				'font_weight'       => '400',
				'font_style'        => 'normal',
				'font_weight_style' => 'regular',
			),
		),
		'madison_price_font' => array(
			'name'        => 'madison_price_font',
			'title'       => __( 'Pricing Fonts', 'madison' ),
			'description' => __( "Please select a font for the theme's monetary values.", 'madison' ),
			'properties'  => array( 
				'selector' => '.property_price, .property-price',
			),
			'default'     => array(
				'subset'            => 'latin',
				'font_id'           => 'raleway',
				'font_name'         => 'Raleway',
				'font_weight'       => '600',
				'font_style'        => 'normal',
				'font_weight_style' => '600',
			),
		),
	);

	$options = array_merge( $custom_options, $options );

	return $options;
}
add_filter( 'tt_font_get_option_parameters', 'madison_filter_easy_google_fonts_options' );

/**
 * Change Jetpack's Infinite Scroll text.
 *
 * @since 1.0.0
*/
function madison_filter_jetpack_infinite_scroll_js_settings( $settings ) {
	$settings['text'] = sprintf( __( 'Load More %s', 'madison' ), '<i class="fa fa-plus"></i>' );

	return $settings;
}
add_filter( 'infinite_scroll_js_settings', 'madison_filter_jetpack_infinite_scroll_js_settings' );