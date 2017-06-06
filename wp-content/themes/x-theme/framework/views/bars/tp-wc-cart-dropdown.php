<?php

// =============================================================================
// VIEWS/BARS/TP-WC-CART-DROPDOWN.PHP
// -----------------------------------------------------------------------------
// WooCommerce cart (dropdown) module.
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


// Data: Partials
// --------------

$data_toggle   = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'toggle_anchor' => 'anchor', 'toggle' => '' ) ) );
$data_dropdown = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'dropdown' => '' ) ) );
$data_cart     = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'cart' => '' ) ) );


// Set Dropdown Content
// --------------------

$dropdown_content = array( 'dropdown_content' => x_get_view( 'partials', 'mini-cart', '', $data_cart, false ) );
$data_dropdown    = array_merge( $data_dropdown, $dropdown_content );


// Output
// ------

?>

<div <?php echo x_atts( $atts ); ?>>
  <?php x_get_view( 'partials', 'anchor', '', $data_toggle, true ); ?>
  <?php x_get_view( 'partials', 'dropdown', '', $data_dropdown, true ); ?>
</div>