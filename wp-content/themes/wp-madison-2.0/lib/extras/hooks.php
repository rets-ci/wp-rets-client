<?php
/**
 * Various hooks.
 *
 * @author Justin Kopepasah
 * @package WordPress
 * @package Madison
*/

/**
 * Add the mobile menu to the main menu.
 *
 * @since 1.0.0
*/
function madison_header_menu_items( $items, $args ) {
	if ( $args->theme_location != 'header' ) {
		return $items;
	}

	// Mobile menu toggle.
	// <a href id="mobile-menu-toggle"><span class="fa fa-toggle-down"></span></a>
	$close = '<li id="mobile-menu-close" class="menu-item menu-item-hidden"><a href>' . __( 'Close', 'madison' ) . '<i class="fa fa-times"></i></a></li>';

	$close .= $items;

	$items = $close;

	return $items;
}
add_action( 'wp_nav_menu_items' , 'madison_header_menu_items', 100, 2 );