<?php

// =============================================================================
// VIEWS/BARS/CONTENT-AREA-DROPDOWN.PHP
// -----------------------------------------------------------------------------
// Content area (dropdown) module.
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


// Output
// ------

?>

<div <?php echo x_atts( $atts ); ?>>
  <?php x_get_view( 'partials', 'anchor', '', $data_toggle, true ); ?>
  <?php x_get_view( 'partials', 'dropdown', '', $data_dropdown, true ); ?>
</div>