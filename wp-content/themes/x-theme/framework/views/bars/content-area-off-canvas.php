<?php

// =============================================================================
// VIEWS/BARS/CONTENT-AREA-OFF-CANVAS.PHP
// -----------------------------------------------------------------------------
// Content area (off canvas) module.
// =============================================================================

// Data: Partials
// --------------

$data_toggle     = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'toggle_anchor' => 'anchor', 'toggle' => '' ) ) );
$data_off_canvas = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'off_canvas' => '' ) ) );


// Output
// ------

x_get_view( 'partials', 'anchor', '', $data_toggle, true );
x_set_view( 'x_before_site_end', 'partials', 'off-canvas', '', $data_off_canvas, 100 );