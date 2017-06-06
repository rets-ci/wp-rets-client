<?php

// =============================================================================
// VIEWS/PARTIALS/PARTICLE.PHP
// -----------------------------------------------------------------------------
// Particle partial.
// =============================================================================

$particle_class = ( isset( $particle_class )   ) ? $particle_class                    : '';
$particle_scale = ( $particle_scale != 'none'  ) ? $particle_scale . ' '              : '';
$particle_style = ( ! empty( $particle_style ) ) ? ' style="' . $particle_style . '"' : '';


// Prepare Attr Values
// -------------------

$classes       = x_attr_class( array( 'x-particle', $particle_class ) );
$data_particle = $particle_scale . $particle_placement . '-' . $particle_location;


// Prepare Atts
// ------------

$atts = array(
  'class'           => $classes,
  'data-x-particle' => $data_particle,
  'aria-hidden'     => 'true',
);


// Output
// ------

?>

<span <?php echo x_atts( $atts ); ?>>
  <span<?php echo $particle_style; ?>></span>
</span>