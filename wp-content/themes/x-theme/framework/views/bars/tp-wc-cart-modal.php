<?php

// =============================================================================
// VIEWS/BARS/TP-WC-CART-MODAL.PHP
// -----------------------------------------------------------------------------
// WooCommerce cart (modal) module.
// =============================================================================

// Data: Partials
// --------------

$data_toggle = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'toggle_anchor' => 'anchor', 'toggle' => '' ) ) );
$data_modal  = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'modal' => '' ) ) );
$data_cart   = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'cart' => '' ) ) );


// Set Modal Content
// -----------------

$modal_content = array( 'modal_content' => x_get_view( 'partials', 'mini-cart', '', $data_cart, false ) );
$data_modal    = array_merge( $data_modal, $modal_content );


// Output
// ------

x_get_view( 'partials', 'anchor', '', $data_toggle, true );
x_set_view( 'x_before_site_end', 'partials', 'modal', '', $data_modal, 100 );