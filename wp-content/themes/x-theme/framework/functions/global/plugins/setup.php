<?php

// =============================================================================
// FUNCTIONS/GLOBAL/PLUGINS/SETUP.PHP
// -----------------------------------------------------------------------------
// Conditionally load plugin integration logic
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Define Constants
//   02. Require Files
// =============================================================================

// Define Constants
// =============================================================================

define( 'X_BBPRESS_IS_ACTIVE', class_exists( 'bbPress' ) );
define( 'X_BUDDYPRESS_IS_ACTIVE', class_exists( 'BuddyPress' ) );
define( 'X_CONTACT_FORM_7_IS_ACTIVE', class_exists( 'WPCF7_ContactForm' ) );
define( 'X_CONVERTPLUG_IS_ACTIVE', class_exists( 'Convert_Plug' ) );
define( 'X_ENVIRA_GALLERY_IS_ACTIVE', class_exists( 'Envira_Gallery' ) );
define( 'X_ESSENTIAL_GRID_IS_ACTIVE', class_exists( 'Essential_Grid' ) );
define( 'X_GRAVITY_FORMS_IS_ACTIVE', class_exists( 'GFForms' ) );
define( 'X_LAYERSLIDER_IS_ACTIVE', class_exists( 'LS_Sliders' ) );
define( 'X_REVOLUTION_SLIDER_IS_ACTIVE', class_exists( 'RevSlider' ) );
define( 'X_SOLILOQUY_IS_ACTIVE', class_exists( 'Soliloquy' ) );
define( 'X_VISUAL_COMOPSER_IS_ACTIVE', defined( 'WPB_VC_VERSION' ) );
define( 'X_WOOCOMMERCE_IS_ACTIVE', class_exists( 'WC_API' ) );
define( 'X_WPML_IS_ACTIVE', defined( 'ICL_SITEPRESS_VERSION' ) );
define( 'X_UBERMENU_IS_ACTIVE', class_exists( 'UberMenu' ) );
define( 'X_THE_GRID_IS_ACTIVE', class_exists( 'The_Grid_Plugin' ) );
define( 'X_EP_PAYMENT_FORM_IS_ACTIVE', class_exists( 'LFB_Core' ) );



// Require Files
// =============================================================================

$plgn_path = X_TEMPLATE_PATH . '/framework/functions/global/plugins';

require_once( $plgn_path . '/cornerstone.php' );

if ( X_BBPRESS_IS_ACTIVE ) {
  require_once( $plgn_path . '/bbpress.php' );
}

if ( X_BUDDYPRESS_IS_ACTIVE ) {
  require_once( $plgn_path . '/buddypress.php' );
}

if ( X_CONVERTPLUG_IS_ACTIVE ) {
  require_once( $plgn_path . '/convertplug.php' );
}

if ( X_ENVIRA_GALLERY_IS_ACTIVE ) {
  require_once( $plgn_path . '/envira-gallery.php' );
}

if ( X_ESSENTIAL_GRID_IS_ACTIVE ) {
  require_once( $plgn_path . '/essential-grid.php' );
}

if ( X_LAYERSLIDER_IS_ACTIVE ) {
  require_once( $plgn_path . '/layerslider.php' );
}

if ( X_REVOLUTION_SLIDER_IS_ACTIVE ) {
  require_once( $plgn_path . '/revolution-slider.php' );
}

if ( X_SOLILOQUY_IS_ACTIVE ) {
  require_once( $plgn_path . '/soliloquy.php' );
}

if ( X_VISUAL_COMOPSER_IS_ACTIVE ) {
  require_once( $plgn_path . '/visual-composer.php' );
}

if ( X_WOOCOMMERCE_IS_ACTIVE ) {
  require_once( $plgn_path . '/woocommerce.php' );
}

if ( X_WPML_IS_ACTIVE ) {
  require_once( $plgn_path . '/wpml.php' );
}

if ( X_UBERMENU_IS_ACTIVE ) {
  require_once( $plgn_path . '/ubermenu.php' );
}

if ( X_THE_GRID_IS_ACTIVE && x_is_validated() ) {
	require_once( $plgn_path . '/the-grid.php' );
}

if ( X_EP_PAYMENT_FORM_IS_ACTIVE ) {
	require_once $plgn_path . '/estimation-form.php';
}
