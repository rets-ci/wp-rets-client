<?php

// =============================================================================
// VIEWS/PARTIALS/MENU.PHP
// -----------------------------------------------------------------------------
// Menu partial.
// =============================================================================

$mod_id           = ( isset( $mod_id )       ) ? $mod_id       : '';
$menu_type        = ( isset( $menu_type )    ) ? $menu_type    : 'inline';
$menu_data_walker = ( isset( $_custom_data ) ) ? $_custom_data : array();

$menu_is_collapsed = $menu_type === 'collapsed';
$menu_is_dropdown  = $menu_type === 'dropdown';
$menu_is_inline    = $menu_type === 'inline';
$menu_is_modal     = $menu_type === 'modal';


// Atts
// ----

$atts = array(
  'id'    => '%1$s',
  'class' => '%2$s',
);

if ( $menu_is_dropdown || $menu_is_inline ) {
  if ( isset( $id ) && ! empty( $id ) ) {
    $atts['id'] = $id;
  }
}


// Notes: "data-x-stem-top" Attribute
// ----------------------------------
// This "data-x-stem-top" logic is implemented in the bars helper.php
// file for "inline" navigation and in the menu partial for "dropdown"
// navigation as their first dropdown is contextually different (e.g.
// the first dropdown for "inline" navigation is at $depth === 0 in the
// helper walker, but the first dropdown for "dropdown" navigation is the
// menu partial itself (these notes duplicated in both spots).
// 
// "r" to reverse direction
// "h" to begin flowing horizontally

if ( $menu_is_dropdown ) {
  $atts['class']            .= ' x-dropdown';
  $atts['data-x-stem']       = NULL;
  $atts['data-x-stem-top']   = NULL;
  $atts['data-x-toggleable'] = $mod_id;
  $atts['tabindex']          = -1;

  if ( $_region === 'left' ) {
    $atts['data-x-stem-top'] = 'h';
  }

  if ( $_region === 'right' ) {
    $atts['data-x-stem-top'] = 'rh'; 
  }
}


// Prepare Arg Values
// ------------------

if ( $menu_is_collapsed || $menu_is_modal ) {
  $class = '';
}

$classes    = x_attr_class( array( $mod_id, 'x-menu', 'x-menu-' . $menu_type, $class ) );
$items_wrap = '<ul ' . x_atts( $atts ) . '>%3$s</ul>';
$walker     = new X_Walker_Nav_Menu( $menu_data_walker );


// Args
// ----

$args = array(
  'menu_class'  => $classes,
  'container'   => false,
  'items_wrap'  => $items_wrap,
  'walker'      => $walker,
  'fallback_cb' => 'x_wp_nav_menu_fallback'
);

if ( 0 === strpos( $menu, 'sample:' ) ) {
  $args['sample_menu'] = str_replace( 'sample:', '', $menu );
}

if ( 0 === strpos( $menu, 'menu:' ) ) {
  $args['menu'] = str_replace( 'menu:', '', $menu );
}

if ( 0 === strpos( $menu, 'location:' ) ) {
  $args['theme_location'] = str_replace( 'location:', '', $menu );
}

if ( $menu_is_modal ) {
  $args['depth'] = 1;
}


// Output
// ------

wp_nav_menu( $args );
