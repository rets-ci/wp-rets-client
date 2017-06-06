<?php

// =============================================================================
// VIEWS/BARS/LOGIN-MODAL.PHP
// -----------------------------------------------------------------------------
// Login (modal) module.
// =============================================================================

// Data: Partials
// --------------

$data_toggle = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'toggle_anchor' => 'anchor', 'toggle' => '' ) ) );
$data_login  = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'login' => '' ) ) );
$data_modal  = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'modal' => '' ) ) );
$data_modal  = array_merge( $data_modal, array( 'modal_content' => x_get_view( 'partials', 'login', '', $data_login, false ) ) );


// Set Dual Output
// ---------------

x_set_view( 'x_before_site_end', 'partials', 'modal', '', $data_modal, 18 );


// Output
// ------

?>

<?php x_get_view( 'partials', 'anchor', '', $data_toggle, true ); ?>