<?php

// =============================================================================
// _PARTICLE-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Setup
//   02. Base
// =============================================================================

// Setup
// =============================================================================

$particle_selector = ( isset( $particle_selector )                       ) ? $particle_selector    : ' .x-particle';
$particle_k_pre    = ( isset( $particle_k_pre ) && $particle_k_pre != '' ) ? $particle_k_pre . '_' : '';



// Base
// =============================================================================

?>

.$_el<?php echo $particle_selector; ?> {
  width: $<?php echo $particle_k_pre; ?>particle_width;
  height: $<?php echo $particle_k_pre; ?>particle_height;
  @unless $<?php echo $particle_k_pre; ?>particle_border_radius?? {
    border-radius: $<?php echo $particle_k_pre; ?>particle_border_radius;
  }
  color: $<?php echo $particle_k_pre; ?>particle_color;
  transform-origin: $<?php echo $particle_k_pre; ?>particle_transform_origin;
}

.$_el<?php echo $particle_selector; ?>[class*="active"] {
  @unless $<?php echo $particle_k_pre; ?>particle_delay?? {
    transition-delay: $<?php echo $particle_k_pre; ?>particle_delay;
  }
}