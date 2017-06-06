<?php

// =============================================================================
// CONTAINER-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Base
//   02. Space
// =============================================================================

// Base
// =============================================================================

?>

.$_el.x-bar-container {
  @if $_region === 'left' || $_region === 'right' {
    -webkit-flex-direction: $container_col_flex_direction;
            flex-direction: $container_col_flex_direction;
    -webkit-justify-content: $container_col_flex_justify;
            justify-content: $container_col_flex_justify;
    -webkit-align-items: $container_col_flex_align;
            align-items: $container_col_flex_align;
    @if $container_col_flex_wrap === true {
      -webkit-flex-wrap: wrap;
              flex-wrap: wrap;
      -webkit-align-content: $container_col_flex_align;
              align-content: $container_col_flex_align;
    }
  }
  @if $_region === 'top' || $_region === 'bottom' || $_region === 'footer' {
    -webkit-flex-direction: $container_row_flex_direction;
            flex-direction: $container_row_flex_direction;
    -webkit-justify-content: $container_row_flex_justify;
            justify-content: $container_row_flex_justify;
    -webkit-align-items: $container_row_flex_align;
            align-items: $container_row_flex_align;
    @if $container_row_flex_wrap === true {
      -webkit-flex-wrap: wrap;
              flex-wrap: wrap;
      -webkit-align-content: $container_row_flex_align;
              align-content: $container_row_flex_align;
    }
  }
  -webkit-flex: $container_flex;
          flex: $container_flex;
  @unless $container_max_height?? {
    max-height: $container_max_height;
  }
  @unless $container_max_width?? {
    max-width: $container_max_width;
  }
  @unless $container_margin?? {
    margin: $container_margin;
  }
  @unless $container_border_width?? || $container_border_style?? {
    border-width: $container_border_width;
    border-style: $container_border_style;
    border-color: $container_border_color;
  }
  @unless $container_border_radius?? {
    border-radius: $container_border_radius;
  }
  @unless $container_padding?? {
    padding: $container_padding;
  }
  @unless $container_bg_color === 'transparent' {
    background-color: $container_bg_color;
  }
  @unless $container_box_shadow_dimensions?? {
    box-shadow: $container_box_shadow_dimensions $container_box_shadow_color;
  }
}