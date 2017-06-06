<?php

// =============================================================================
// BAR-CSS.PHP
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

.$_el.x-bar {
  @if $_region === 'top' {
    @if $bar_position_top === 'absolute' || $bar_sticky === true && $bar_sticky_hide_initially === true {
      width: calc(100% - ($bar_margin_sides * 2));
    }
    @if ( $bar_position_top === 'absolute' ) {
      margin-top: $bar_margin_top;
      margin-left: $bar_margin_sides;
      margin-right: $bar_margin_sides;
    }
  }
  @if $_region === 'left' || $_region === 'right' {
    width: $bar_width;
  }
  @if $_region === 'top' || $_region === 'bottom' || $_region === 'footer' {
    height: $bar_height;
  }
  @unless $bar_padding?? {
    padding: $bar_padding;
  }
  @unless $bar_border_width?? || $bar_border_style?? {
    border-width: $bar_border_width;
    border-style: $bar_border_style;
    border-color: $bar_border_color;
  }
  font-size: $bar_base_font_size;
  @unless $bar_bg_color === 'transparent' {
    background-color: $bar_bg_color;
  }
  @unless $bar_box_shadow_dimensions?? {
    box-shadow: $bar_box_shadow_dimensions $bar_box_shadow_color;
  }
  z-index: $bar_z_index;
}

.$_el.x-bar-content {
  @if $_region === 'left' || $_region === 'right' {
    -webkit-flex-direction: $bar_col_flex_direction;
            flex-direction: $bar_col_flex_direction;
    -webkit-justify-content: $bar_col_flex_justify;
            justify-content: $bar_col_flex_justify;
    -webkit-align-items: $bar_col_flex_align;
            align-items: $bar_col_flex_align;
    @if $bar_col_flex_wrap === true {
      -webkit-flex-wrap: wrap;
              flex-wrap: wrap;
      -webkit-align-content: $bar_col_flex_align;
              align-content: $bar_col_flex_align;
    }
  }
  @if $_region === 'top' || $_region === 'bottom' || $_region === 'footer' {
    -webkit-flex-direction: $bar_row_flex_direction;
            flex-direction: $bar_row_flex_direction;
    -webkit-justify-content: $bar_row_flex_justify;
            justify-content: $bar_row_flex_justify;
    -webkit-align-items: $bar_row_flex_align;
            align-items: $bar_row_flex_align;
    @if $bar_row_flex_wrap === true {
      -webkit-flex-wrap: wrap;
              flex-wrap: wrap;
      -webkit-align-content: $bar_row_flex_align;
              align-content: $bar_row_flex_align;
    }
  }
  @if $bar_content_length !== 'auto' {
    -webkit-flex: 0 1 $bar_content_length;
            flex: 0 1 $bar_content_length;
  }
  @if $_region === 'left' || $_region === 'right' {
    width: $bar_width;
    @unless $bar_content_max_length?? {
      max-height: $bar_content_max_length;
    }
  }
  @if $_region === 'top' || $_region === 'bottom' || $_region === 'footer' {
    height: $bar_height;
    @unless $bar_content_max_length?? {
      max-width: $bar_content_max_length;
    }
  }
}

.$_el.x-bar-outer-spacers:before,
.$_el.x-bar-outer-spacers:after {
  -webkit-flex-basis: $bar_outer_spacing;
          flex-basis: $bar_outer_spacing;
  width: $bar_outer_spacing;
  height: $bar_outer_spacing;
}



<?php

// Space
// =============================================================================

?>

.$_el.x-bar-space {
  font-size: $bar_base_font_size;
  @if $_region === 'top' || $_region === 'bottom' {
    height: $bar_height;
  }
  @if $_region === 'left' || $_region === 'right' {
    -webkit-flex-basis: $bar_width;
            flex-basis: $bar_width;
  }
}
