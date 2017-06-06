<?php

// =============================================================================
// _DROPDOWN-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Base
// =============================================================================

// Base
// =============================================================================

?>

.$_el .x-dropdown {
  width: $dropdown_width;
  @unless $dropdown_border_width?? || $dropdown_border_style?? {
    border-width: $dropdown_border_width;
    border-style: $dropdown_border_style;
    border-color: $dropdown_border_color;
  }
  @unless $dropdown_border_radius?? {
    border-radius: $dropdown_border_radius;
  }
  @unless $dropdown_padding?? {
    padding: $dropdown_padding;
  }
  font-size: $dropdown_base_font_size;
  @unless $dropdown_bg_color === 'transparent' {
    background-color: $dropdown_bg_color;
  }
  @unless $dropdown_box_shadow_dimensions?? {
    box-shadow: $dropdown_box_shadow_dimensions $dropdown_box_shadow_color;
  }
}

.$_el .x-dropdown[data-x-stem-top] {
  @unless $dropdown_margin?? {
    margin: $dropdown_margin;
  }
}