<?php

// =============================================================================
// VIEWS/BARS/TP-WC-CART-OFF-CANVAS.PHP
// -----------------------------------------------------------------------------
// WooCommerce cart (off canvas) module.
// =============================================================================

// Data: Partials
// --------------

$data_toggle     = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'toggle_anchor' => 'anchor', 'toggle' => '' ) ) );
$data_off_canvas = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'off_canvas' => '' ) ) );
$data_cart       = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'cart' => '' ) ) );


// Set Off Canvas Content
// ----------------------

$off_canvas_content = array( 'off_canvas_content' => x_get_view( 'partials', 'mini-cart', '', $data_cart, false ) );
$data_off_canvas    = array_merge( $data_off_canvas, $off_canvas_content );


// Output
// ------

x_get_view( 'partials', 'anchor', '', $data_toggle, true );
x_set_view( 'x_before_site_end', 'partials', 'off-canvas', '', $data_off_canvas, 100 );