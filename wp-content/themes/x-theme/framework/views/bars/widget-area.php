<?php

// =============================================================================
// VIEWS/BARS/WIDGET-AREA.PHP
// -----------------------------------------------------------------------------
// Content area module.
// =============================================================================

$classes = x_attr_class( array( $mod_id, 'x-bar-widget-area', $class ) );


// Prepare Atts
// ------------

$atts = array(
  'class' => $classes
);

if ( isset( $id ) && ! empty( $id ) ) {
  $atts['id'] = $id;
}


// Output
// ------

?>

<div <?php echo x_atts( $atts ); ?>>
  <?php dynamic_sidebar( $widget_area_sidebar ); ?>
</div>
