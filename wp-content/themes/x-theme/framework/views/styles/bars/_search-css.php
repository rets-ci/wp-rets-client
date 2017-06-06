<?php

// =============================================================================
// _SEARCH-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Base
//   02. Input
//   03. Buttons
// =============================================================================

// Base
// =============================================================================

?>

.$_el.x-search {
  width: $search_width;
  max-width: $search_max_width;
  height: $search_height;
  @unless $search_margin?? {
    margin: $search_margin;
  }
  @unless $search_border_width?? || $search_border_style?? {
    border-width: $search_border_width;
    border-style: $search_border_style;
    border-color: $search_border_color;
  }
  @unless $search_border_radius?? {
    border-radius: $search_border_radius;
  }
  font-size: $search_base_font_size;
  @unless $search_bg_color === 'transparent' {
    background-color: $search_bg_color;
  }
  @unless $search_box_shadow_dimensions?? {
    @if $search_box_shadow_color === 'transparent' {
      box-shadow: none;
    }
    @if $search_box_shadow_color !== 'transparent' {
      box-shadow: $search_box_shadow_dimensions $search_box_shadow_color;
    }
  }
}

.$_el.x-search.x-search-focused {
  @unless $search_border_width?? || $search_border_style?? {
    border-color: $search_border_color_alt;
  }
  @unless $search_bg_color_alt === 'transparent' {
    background-color: $search_bg_color_alt;
  }
  @unless $search_box_shadow_dimensions?? {
    @if $search_box_shadow_color_alt === 'transparent' {
      box-shadow: none;
    }
    @if $search_box_shadow_color_alt !== 'transparent' {
      box-shadow: $search_box_shadow_dimensions $search_box_shadow_color_alt;
    }
  }
}



<?php

// Input
// =============================================================================

?>

.$_el.x-search .x-search-input {
  order: $search_order_input;
  margin: $search_input_margin;
  font-family: $search_input_font_family;
  font-size: $search_input_font_size;
  font-style: $search_input_font_style;
  font-weight: $search_input_font_weight;
  line-height: $search_input_line_height;
  @unless $search_input_letter_spacing?? {
    letter-spacing: $search_input_letter_spacing;
  }
  @unless $search_input_text_align?? {
    text-align: $search_input_text_align;
  }
  @unless $search_input_text_decoration?? {
    text-decoration: $search_input_text_decoration;
  }
  @unless $search_input_text_transform?? {
    text-transform: $search_input_text_transform;
  }
  color: $search_input_text_color;
}

.$_el.x-search.x-search-has-content .x-search-input {
  color: $search_input_text_color_alt;
}



<?php

// Buttons
// =============================================================================

?>

.$_el.x-search .x-search-btn-submit {
  order: $search_order_submit;
  width: $search_submit_width;
  height: $search_submit_height;
  @unless $search_submit_margin?? {
    margin: $search_submit_margin;
  }
  @unless $search_submit_border_style?? || $search_submit_border_width?? {
    border-style: $search_submit_border_style;
    border-width: $search_submit_border_width;
    border-color: $search_submit_border_color;
  }
  @unless $search_submit_border_radius?? {
    border-radius: $search_submit_border_radius;
  }
  font-size: $search_submit_font_size;
  color: $search_submit_color;
  background-color: $search_submit_bg_color;
  @unless $search_submit_box_shadow_dimensions?? {
    @if $search_submit_box_shadow_color === 'transparent' {
      box-shadow: none;
    }
    @if $search_submit_box_shadow_color !== 'transparent' {
      box-shadow: $search_submit_box_shadow_dimensions $search_submit_box_shadow_color;
    }
  }
}

.$_el.x-search .x-search-btn-submit:hover,
.$_el.x-search .x-search-btn-submit:focus {
  color: $search_submit_color_alt;
  @unless $search_submit_border_style?? || $search_submit_border_width?? {
    border-color: $search_submit_border_color_alt;
  }
  background-color: $search_submit_bg_color_alt;
  @unless $search_submit_box_shadow_dimensions?? {
    @if $search_submit_box_shadow_color_alt === 'transparent' {
      box-shadow: none;
    }
    @if $search_submit_box_shadow_color_alt !== 'transparent' {
      box-shadow: $search_submit_box_shadow_dimensions $search_submit_box_shadow_color_alt;
    }
  }
}

.$_el.x-search .x-search-btn-clear {
  order: $search_order_clear;
  width: $search_clear_width;
  height: $search_clear_height;
  @unless $search_clear_margin?? {
    margin: $search_clear_margin;
  }
  @unless $search_clear_border_style?? || $search_clear_border_width?? {
    border-style: $search_clear_border_style;
    border-width: $search_clear_border_width;
    border-color: $search_clear_border_color;
  }
  @unless $search_clear_border_radius?? {
    border-radius: $search_clear_border_radius;
  }
  font-size: $search_clear_font_size;
  color: $search_clear_color;
  background-color: $search_clear_bg_color;
  @unless $search_clear_box_shadow_dimensions?? {
    @if $search_clear_box_shadow_color === 'transparent' {
      box-shadow: none;
    }
    @if $search_clear_box_shadow_color !== 'transparent' {
      box-shadow: $search_clear_box_shadow_dimensions $search_clear_box_shadow_color;
    }
  }
}

.$_el.x-search .x-search-btn-clear:hover,
.$_el.x-search .x-search-btn-clear:focus {
  color: $search_clear_color_alt;
  @unless $search_clear_border_style?? || $search_clear_border_width?? {
    border-color: $search_clear_border_color_alt;
  }
  background-color: $search_clear_bg_color_alt;
  @unless $search_clear_box_shadow_dimensions?? {
    @if $search_clear_box_shadow_color_alt === 'transparent' {
      box-shadow: none;
    }
    @if $search_clear_box_shadow_color_alt !== 'transparent' {
      box-shadow: $search_clear_box_shadow_dimensions $search_clear_box_shadow_color_alt;
    }
  }
}