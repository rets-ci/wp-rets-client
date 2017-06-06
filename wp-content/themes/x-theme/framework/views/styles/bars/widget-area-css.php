<?php

// =============================================================================
// WIDGET-AREA-CSS.PHP
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

.$_el.x-bar-widget-area {
  font-size: $widget_area_base_font_size;
  @unless $widget_area_margin?? {
    margin: $widget_area_margin;
  }
  @unless $widget_area_border_width?? || $widget_area_border_style?? {
    border-width: $widget_area_border_width;
    border-style: $widget_area_border_style;
    border-color: $widget_area_border_color;
  }
  @unless $widget_area_border_radius?? {
    border-radius: $widget_area_border_radius;
  }
  @unless $widget_area_padding?? {
    padding: $widget_area_padding;
  }
  @unless $widget_area_bg_color === 'transparent' {
    background-color: $widget_area_bg_color;
  }
  @unless $widget_area_box_shadow_dimensions?? {
    box-shadow: $widget_area_box_shadow_dimensions $widget_area_box_shadow_color;
  }
}