<?php

// =============================================================================
// IMAGE-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Base
// =============================================================================

// Base
// =============================================================================

?>

@if $image_type !== 'scaling' {
  .$_el.x-image {
    @if $image_styled_width !== 'auto' {
      width: $image_styled_width;
    }
    @unless $image_styled_max_width?? {
      max-width: $image_styled_max_width;
    }
    @unless $image_margin?? {
      margin: $image_margin;
    }
    @unless $image_border_width?? || $image_border_style?? {
      border-width: $image_border_width;
      border-style: $image_border_style;
      border-color: $image_border_color;
    }
    @unless $image_outer_border_radius?? {
      border-radius: $image_outer_border_radius;
    }
    @unless $image_padding?? {
      padding: $image_padding;
    }
    @unless $image_bg_color === 'transparent' {
      background-color: $image_bg_color;
    }
    @unless $image_box_shadow_dimensions?? {
      box-shadow: $image_box_shadow_dimensions $image_box_shadow_color;
    }
  }

  .$_el.x-image img {
    @unless $image_inner_border_radius?? {
      border-radius: $image_inner_border_radius;
    }
  }
}

@if $image_link === true {
  a.$_el.x-image:hover {
    @unless $image_border_width?? || $image_border_style?? {
      border-color: $image_border_color_alt;
    }
    background-color: $image_bg_color_alt;
    @unless $image_box_shadow_dimensions?? {
      box-shadow: $image_box_shadow_dimensions $image_box_shadow_color_alt;
    }
  }
}