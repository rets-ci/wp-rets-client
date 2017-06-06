<?php

// =============================================================================
// VIEWS/BARS/CONTENT-AREA.PHP
// -----------------------------------------------------------------------------
// Content area module.
// =============================================================================

$classes = x_attr_class( array( $mod_id, 'x-bar-content-area', $class ) );


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
  <?php echo do_shortcode( $content ); ?>
</div>
