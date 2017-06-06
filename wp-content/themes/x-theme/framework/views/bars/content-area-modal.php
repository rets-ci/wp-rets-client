<?php

// =============================================================================
// VIEWS/BARS/CONTENT-AREA-MODAL.PHP
// -----------------------------------------------------------------------------
// Content area (modal) module.
// =============================================================================

// Data: Partials
// --------------

$data_toggle = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'toggle_anchor' => 'anchor', 'toggle' => '' ) ) );
$data_modal  = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'modal' => '' ) ) );


// Output
// ------

x_get_view( 'partials', 'anchor', '', $data_toggle, true );
x_set_view( 'x_before_site_end', 'partials', 'modal', '', $data_modal, 100 );