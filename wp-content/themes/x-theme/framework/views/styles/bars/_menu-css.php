<?php

// =============================================================================
// _MENU-CSS.PHP
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

.$_el.x-menu {
  @if $menu_type === 'inline' {
    @if $_region === 'left' || $_region === 'right' {
      -webkit-flex-direction: $menu_col_flex_direction;
              flex-direction: $menu_col_flex_direction;
      -webkit-justify-content: $menu_col_flex_justify;
              justify-content: $menu_col_flex_justify;
      -webkit-align-items: $menu_col_flex_align;
              align-items: $menu_col_flex_align;
      @if $menu_col_flex_wrap === true {
        -webkit-flex-wrap: wrap;
                flex-wrap: wrap;
        -webkit-align-content: $menu_col_flex_align;
                align-content: $menu_col_flex_align;
      }
    }
    @if $_region === 'top' || $_region === 'bottom' || $_region === 'footer' {
      -webkit-flex-direction: $menu_row_flex_direction;
              flex-direction: $menu_row_flex_direction;
      -webkit-justify-content: $menu_row_flex_justify;
              justify-content: $menu_row_flex_justify;
      -webkit-align-items: $menu_row_flex_align;
              align-items: $menu_row_flex_align;
      @if $menu_row_flex_wrap === true {
        -webkit-flex-wrap: wrap;
                flex-wrap: wrap;
        -webkit-align-content: $menu_row_flex_align;
                align-content: $menu_row_flex_align;
      }
    }
    -webkit-align-self: $menu_align_self;
            align-self: $menu_align_self;
    -webkit-flex: $menu_flex;
            flex: $menu_flex;
  }
  @if $menu_type !== 'dropdown' {
    margin: $menu_margin;
    font-size: $menu_base_font_size;
  }
}

.$_el.x-menu > li,
.$_el.x-menu > li > a {
  @if $menu_type === 'inline' {
    -webkit-flex: $menu_items_flex;
            flex: $menu_items_flex;
  }
}