<?php

// =============================================================================
// _TEXT-CSS.PHP
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

.$_el.x-text {
  @if $text_width !== 'auto' {
    width: $text_width;
  }
  @unless $text_max_width?? {
    max-width: $text_max_width;
  }
  margin: $text_margin;
  @unless $text_border_width?? || $text_border_style?? {
    border-width: $text_border_width;
    border-style: $text_border_style;
    border-color: $text_border_color;
  }
  @unless $text_border_radius?? {
    border-radius: $text_border_radius;
  }
  padding: $text_padding;
  font-family: $text_font_family;
  font-size: $text_font_size;
  font-style: $text_font_style;
  font-weight: $text_font_weight;
  line-height: $text_line_height;
  letter-spacing: $text_letter_spacing;
  @unless $text_text_align?? {
    text-align: $text_text_align;
  }
  @unless $text_text_decoration?? {
    text-decoration: $text_text_decoration;
  }
  @unless $text_text_shadow_dimensions?? {
    text-shadow: $text_text_shadow_dimensions $text_text_shadow_color;
  }
  text-transform: $text_text_transform;
  color: $text_text_color;
  @unless $text_text_bg_color === 'transparent' {
    background-color: $text_bg_color;
  }
  @unless $text_box_shadow_dimensions?? {
    box-shadow: $text_box_shadow_dimensions $text_box_shadow_color;
  }
}

@if $text_type === 'headline' {
  .$_el.x-text > span {
    margin-right: calc($text_letter_spacing * -1);
    @if $text_overflow === true {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}