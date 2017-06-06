<?php

// =============================================================================
// VIEWS/BARS/TP-BBP-DROPDOWN.PHP
// -----------------------------------------------------------------------------
// bbPress (dropdown) module.
// =============================================================================

$classes = x_attr_class( array( $mod_id, 'x-mod-container', $class ) );


// Prepare Atts
// ------------

$atts = array(
  'class' => $classes
);

if ( isset( $id ) && ! empty( $id ) ) {
  $atts['id'] = $id;
}


// Prepare Content
// ---------------

ob_start();

if ( X_BBPRESS_IS_ACTIVE ) {

  $submenu_items  = '';
  $submenu_items .= '<li><a href="' . bbp_get_search_url() . '"><span>' . __( 'Forums Search', '__x__' ) . '</span></a></li>';

  if ( is_user_logged_in() ) {
    $submenu_items .= '<li><a href="' . bbp_get_favorites_permalink( get_current_user_id() ) . '"><span>' . __( 'Favorites', '__x__' ) . '</span></a></li>';
    $submenu_items .= '<li><a href="' . bbp_get_subscriptions_permalink( get_current_user_id() ) . '"><span>' . __( 'Subscriptions', '__x__' ) . '</span></a></li>';
  }

  if ( ! X_BUDDYPRESS_IS_ACTIVE ) {
    if ( ! is_user_logged_in() ) {
      $submenu_items .= '<li><a href="' . wp_login_url() . '"><span>' . __( 'Log in', '__x__' ) . '</span></a></li>';
    } else {
      $submenu_items .= '<li><a href="' . bbp_get_user_profile_url( get_current_user_id() ) . '"><span>' . __( 'Profile', '__x__' ) . '</span></a></li>';
    }
  }

} else {
  $submenu_items = '';
}

echo $submenu_items;

$dropdown_content = ob_get_clean();


// Data: Partials
// --------------

$data_toggle   = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'toggle_anchor' => 'anchor', 'toggle' => '' ) ) );
$data_dropdown = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'dropdown' => '' ) ) );


// Set Dropdown Content
// --------------------

$dropdown_content = array( 'dropdown_content' => $dropdown_content );
$data_dropdown    = array_merge( $data_dropdown, $dropdown_content );


// Output
// ------

?>

<div <?php echo x_atts( $atts ); ?>>
  <?php x_get_view( 'partials', 'anchor', '', $data_toggle, true ); ?>
  <?php x_get_view( 'partials', 'dropdown', '', $data_dropdown, true ); ?>
</div>