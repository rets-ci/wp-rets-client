<?php

// =============================================================================
// FUNCTIONS.PHP
// -----------------------------------------------------------------------------
// Theme functions for X.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Define Path / URL Constants
//   02. Set Paths
//   03. Preboot
//   04. Set Asset Revision Constant
//   05. Require Files
// =============================================================================

function x_boot() {

  // Define Path / URL Constants
  // ---------------------------

  define( 'X_TEMPLATE_PATH', get_template_directory() );
  define( 'X_TEMPLATE_URL', get_template_directory_uri() );


  // Set Paths
  // ---------

  $load_path = X_TEMPLATE_PATH . '/framework/load';
  $func_path = X_TEMPLATE_PATH . '/framework/functions';
  $glob_path = X_TEMPLATE_PATH . '/framework/functions/global';
  $admn_path = X_TEMPLATE_PATH . '/framework/functions/global/admin';
  $lgcy_path = X_TEMPLATE_PATH . '/framework/legacy';
  $eque_path = X_TEMPLATE_PATH . '/framework/functions/global/enqueue';
  $plgn_path = X_TEMPLATE_PATH . '/framework/functions/global/plugins';


  // Preboot
  // -------

  $x_boot_files = glob( "$load_path/*.php" );

  sort( $x_boot_files );

  foreach ( $x_boot_files as $filename ) {
    $file = basename( $filename, '.php' );
    if ( file_exists( $filename ) && apply_filters( "x_pre_boot_$file", '__return_true' ) ) {
      require_once( $filename );
    }
  }


  // Set Asset Revision Constant (For Cache Busting)
  // -----------------------------------------------

  define( 'X_ASSET_REV', X_VERSION );


  // Require Files
  // -------------

  $require_files = apply_filters( 'x_boot_files', array(

    $glob_path . '/debug.php',
    $glob_path . '/conditionals.php',
    $glob_path . '/helpers.php',
    $glob_path . '/stack-data.php',
    $glob_path . '/tco-setup.php',

    $admn_path . '/thumbnails/setup.php',
    $admn_path . '/setup.php',
    $admn_path . '/meta/setup.php',
    $admn_path . '/sidebars.php',
    $admn_path . '/widgets.php',
    $admn_path . '/custom-post-types.php',
    $admn_path . '/cs-options/setup.php',
    $admn_path . '/customizer/setup.php',
    $admn_path . '/addons/setup.php',

    $lgcy_path . '/setup.php',

    $eque_path . '/styles.php',
    $eque_path . '/scripts.php',

    $glob_path . '/class-view-routing.php',
    $glob_path . '/class-action-defer.php',
    $glob_path . '/meta.php',
    $glob_path . '/featured.php',
    $glob_path . '/pagination.php',
    $glob_path . '/breadcrumbs.php',
    $glob_path . '/classes.php',
    $glob_path . '/portfolio.php',
    $glob_path . '/social.php',
    $glob_path . '/content.php',
    $glob_path . '/remove.php',

    $func_path . '/integrity.php',
    $func_path . '/renew.php',
    $func_path . '/icon.php',
    $func_path . '/ethos.php',

    $plgn_path . '/setup.php'

  ));

  foreach ( $require_files as $filename ) {
    if ( file_exists( $filename ) ) {
      require_once( $filename );
    }
  }

}

x_boot();
