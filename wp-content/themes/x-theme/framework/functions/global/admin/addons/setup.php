<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/ADDONS/SETUP.PHP
// -----------------------------------------------------------------------------
// Initializes and sets up the X Addons section.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Set Path
//   02. Links
//   03. Helpers
//   04. Require Files
//   05. Setup Menu
//   06. Activation Redirect
//   07. Instantiate Addons
//   08. Validation Notice
// =============================================================================

// Set Path
// =============================================================================

$addn_path = X_TEMPLATE_PATH . '/framework/functions/global/admin/addons';



// Links
// =============================================================================

function x_addons_get_link_home() {
  return admin_url( 'admin.php?page=x-addons-home' );
}



// Helpers
// =============================================================================

function x_addons_preview_unlock( $box_class, $text = 'Setup Now' ) {

  ?>
    <a class="tco-btn tco-btn-nope" href="#" data-tco-toggle="<?php echo $box_class; ?> .tco-overlay"><?php _e( $text, '__x__' ); ?></a>
  <?php

}


function x_addons_preview_overlay( $box_class ) {

  ?>
    <div class="tco-overlay tco-overlay-box-content">
      <a class="tco-overlay-close" href="#" data-tco-toggle="<?php echo $box_class; ?> .tco-overlay"><?php x_tco()->admin_icon( 'no' ); ?></a>
      <h4 class="tco-box-content-title"><?php _e( 'How do I unlock this feature?', '__x__' ); ?></h4>
      <p><?php printf( x_i18n('overview', 'how-do-i-unlock' ), 'data-tco-focus="validation-input"'); ?></p>
    </div>
  <?php

}



// Require Files
// =============================================================================

//
// 1. Updates API.
// 2. Demo content API.
// 3. Addons home modules.
// 4. Home page.
//

require_once( $addn_path . '/updates/class-theme-updater.php' );
require_once( $addn_path . '/updates/class-plugin-updater.php' );

require_once( $addn_path . '/demo/legacy/ajax-handler.php' );
require_once( $addn_path . '/demo/class-x-demo-import-session.php' );
require_once( $addn_path . '/demo/class-x-demo-import-registry.php' );
require_once( $addn_path . '/demo/class-x-demo-import-processor.php' );

require_once( $addn_path . '/modules/class-addons-home.php' );
require_once( $addn_path . '/modules/class-addons-updates.php' );
require_once( $addn_path . '/modules/class-addons-validation.php' );
require_once( $addn_path . '/modules/class-addons-extensions.php' );

require_once( $addn_path . '/page-home.php' );


// Setup Menu
// =============================================================================

function x_addons_add_menu() {
  add_menu_page( 'Overview', X_TITLE, 'manage_options', 'x-addons-home', 'x_addons_page_home', 'dashicons-arrow-right-alt2', 3 );
  add_submenu_page( 'x-addons-home', 'Overview', 'Overview', 'manage_options', 'x-addons-home', 'x_addons_page_home' );
}

add_action( 'admin_menu', 'x_addons_add_menu' );



// Activation Redirect
// =============================================================================

function x_addons_theme_activation_redirect() {

  if ( isset( $_GET['activated'] ) ) {
    wp_redirect( x_addons_get_link_home() );
  }

}

add_action( 'admin_init', 'x_addons_theme_activation_redirect' );



// Instantiate Addons
// =============================================================================

if ( is_admin() ) {

  // var_dump( did_action('admin_init') ); die();

  X_Addons_Home::instance();
  X_Addons_Updates::instance();
  X_Addons_Extensions::instance();
  X_Addons_Validation::instance();

  do_action( 'x_overview_init' );

}



// Validation Notice
// =============================================================================

function x_addons_validation_notice() {

  if ( false === get_option( 'x_dismiss_validation_notice', false ) && ! x_is_validated() && ! in_array( get_current_screen()->parent_base, apply_filters( 'x_validation_notice_blocked_screens', array( 'x-addons-home' ) ) ) ) {

    x_tco()->admin_notice( array(
      'message' => sprintf( __( 'This X license is ​<strong>not validated</strong>​. <a href="%s">Fix</a>', '__x__' ), x_addons_get_link_home() ),
      'dismissible' => true,
      'ajax_dismiss' => 'x_dismiss_validation_notice'
    ) );

  }

}

add_action( 'admin_notices', 'x_addons_validation_notice' );
