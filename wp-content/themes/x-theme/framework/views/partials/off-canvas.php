<?php

// =============================================================================
// VIEWS/PARTIALS/OFF-CANVAS.PHP
// -----------------------------------------------------------------------------
// Off canvas partial.
// =============================================================================

$mod_id = ( isset( $mod_id ) ) ? $mod_id : '';


// Prepare Attr Values
// -------------------

$classes_off_canvas         = x_attr_class( array( $mod_id, 'x-off-canvas', 'x-off-canvas-' . $off_canvas_location, $class ) );
$classes_off_canvas_close   = x_attr_class( array( 'x-off-canvas-close', 'x-off-canvas-close-' . $off_canvas_location ) );
$classes_off_canvas_content = x_attr_class( array( 'x-off-canvas-content', 'x-off-canvas-content-' . $off_canvas_location ) );


// Prepare Atts
// ------------

$atts_off_canvas = array(
  'class'             => $classes_off_canvas,
  'role'              => 'dialog',
  'tabindex'          => '-1',
  'data-x-toggleable' => $mod_id
);

if ( isset( $id ) && ! empty( $id ) ) {
  $atts_off_canvas['id'] = $id . '-off-canvas';
}

$atts_off_canvas_close = array(
  'class'               => $classes_off_canvas_close,
  'data-x-toggle-close' => true,
  'aria-label'          => 'Close'
);

$atts_off_canvas_content = array(
  'class'            => $classes_off_canvas_content,
  'data-x-scrollbar' => '{"suppressScrollX":true}',
  'role'             => 'document'
);


// Output
// ------

?>

<div <?php echo x_atts( $atts_off_canvas ); ?>>

  <span class="x-off-canvas-bg"></span>

  <button <?php echo x_atts( $atts_off_canvas_close ); ?>>
    <span>&times;</span>
  </button>

  <div <?php echo x_atts( $atts_off_canvas_content ); ?>>
    <?php echo do_shortcode( $off_canvas_content ); ?>
  </div>

</div>
