<?php

// =============================================================================
// VIEWS/BARS/CONTAINER.PHP
// -----------------------------------------------------------------------------
// Bar container module.
// =============================================================================

// Prepare Classes
// ---------------

$classes = array( $mod_id, 'x-bar-container', $class );


// Prepare Atts
// ------------

$atts = array(
  'class' => x_attr_class( $classes ),
);

if ( isset( $id ) && ! empty( $id ) ) {
  $atts['id'] = $id;
}


// Background Partial
// ------------------

if ( $container_bg_advanced == true ) {
  $data_bg      = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'bg' => '' ) ) );
  $container_bg = x_get_view( 'partials', 'bg', '', $data_bg, false );
}


// Output
// ------

?>

<div <?php echo x_atts( $atts ); ?>>

  <?php if ( isset( $container_bg ) ) { echo $container_bg; } ?>

  <?php do_action( 'x_bar_container', $_modules, $global ); ?>

</div>
