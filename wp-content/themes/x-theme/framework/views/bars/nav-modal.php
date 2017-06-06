<?php

// =============================================================================
// VIEWS/BARS/NAV-MODAL.PHP
// -----------------------------------------------------------------------------
// Nav (modal) module.
// =============================================================================

// Data: Partials
// --------------

$data_toggle = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'toggle_anchor' => 'anchor', 'toggle' => '' ) ) );
$data_modal  = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'modal' => '' ) ) );
$data_menu   = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'menu' => '', 'anchor' => '' ) ) );


// Set Modal Content
// -----------------

$modal_content = array( 'modal_content' => x_get_view( 'partials', 'menu', '', $data_menu, false ) );
$data_modal    = array_merge( $data_modal, $modal_content );


// Output
// ------

x_get_view( 'partials', 'anchor', '', $data_toggle, true );
x_set_view( 'x_before_site_end', 'partials', 'modal', '', $data_modal, 10 );