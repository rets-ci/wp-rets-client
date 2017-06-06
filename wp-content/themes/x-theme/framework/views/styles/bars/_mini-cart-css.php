<?php

// =============================================================================
// _MINI-CART-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Title
//   02. Items
//   03. Thumbnails
//   04. Links
//   05. Quantity
//   06. Total
//   07. Buttons
// =============================================================================

// Title
// =============================================================================

?>

@if $cart_title != '' {

  .$_el .x-mini-cart-title {
    margin: $cart_title_margin;
    font-family: $cart_title_font_family;
    font-size: $cart_title_font_size;
    font-style: $cart_title_font_style;
    font-weight: $cart_title_font_weight;
    line-height: $cart_title_line_height;
    @unless $cart_title_letter_spacing?? {
      letter-spacing: $cart_title_letter_spacing;
    }
    @unless $cart_title_text_align?? {
      text-align: $cart_title_text_align;
    }
    @unless $cart_title_text_decoration?? {
      text-decoration: $cart_title_text_decoration;
    }
    @unless $cart_title_text_shadow_dimensions?? {
      text-shadow: $cart_title_text_shadow_dimensions $cart_title_text_shadow_color;
    }
    @unless $cart_title_text_transform?? {
      text-transform: $cart_title_text_transform;
    }
    color: $cart_title_text_color;
  }

}

.$_el .x-mini-cart li.empty {
  line-height: $cart_links_line_height;
  @unless $cart_title_text_align?? {
    text-align: $cart_title_text_align;
  }
  color: $cart_links_text_color;
}



<?php

// Items
// =============================================================================

?>

.$_el .cart_list {
  -webkit-order: $cart_order_items;
          order: $cart_order_items;
}

.$_el .mini_cart_item {
  @unless $cart_items_margin?? {
    margin: $cart_items_margin;
  }
  @unless $cart_items_border_width?? || $cart_items_border_style?? {
    border-width: $cart_items_border_width;
    border-style: $cart_items_border_style;
    border-color: $cart_items_border_color;
  }
  @unless $cart_items_border_radius?? {
    border-radius: $cart_items_border_radius;
  }
  @unless $cart_items_padding?? {
    padding: $cart_items_padding;
  }
  @unless $cart_items_bg === 'transparent' {
    background-color: $cart_items_bg;
  }
  @unless $cart_items_box_shadow_dimensions?? {
    box-shadow: $cart_items_box_shadow_dimensions $cart_items_box_shadow_color;
  }
}

.$_el .mini_cart_item:hover {
  @unless $cart_items_border_width?? || $cart_items_border_style?? {
    border-color: $cart_items_border_color_alt;
  }
  background-color: $cart_items_bg_alt;
  @unless $cart_items_box_shadow_dimensions?? {
    box-shadow: $cart_items_box_shadow_dimensions $cart_items_box_shadow_color_alt;
  }
}

@if $cart_items_display_remove == false {
  .$_el .mini_cart_item .remove {
    display: none !important;
    visibility: hidden !important;
  }
}



<?php

// Thumbnails
// =============================================================================

?>

.$_el .mini_cart_item img {
  width: $cart_thumbs_width;
  margin-right: $cart_items_content_spacing;
  @unless $cart_thumbs_border_radius?? {
    border-radius: $cart_thumbs_border_radius;
  }
  @unless $cart_thumbs_box_shadow_dimensions?? {
    box-shadow: $cart_thumbs_box_shadow_dimensions $cart_thumbs_box_shadow_color;
  }
}

.rtl .$_el .mini_cart_item img {
  margin-left: $cart_items_content_spacing;
  margin-right: 0;
}



<?php

// Links
// =============================================================================

?>

.$_el .mini_cart_item a {
  font-family: $cart_links_font_family;
  font-size: $cart_links_font_size;
  font-style: $cart_links_font_style;
  font-weight: $cart_links_font_weight;
  line-height: $cart_links_line_height;
  @unless $cart_links_letter_spacing?? {
    letter-spacing: $cart_links_letter_spacing;
  }
  @unless $cart_links_text_align?? {
    text-align: $cart_links_text_align;
  }
  @unless $cart_links_text_decoration?? {
    text-decoration: $cart_links_text_decoration;
  }
  @unless $cart_links_text_shadow_dimensions?? {
    text-shadow: $cart_links_text_shadow_dimensions $cart_links_text_shadow_color;
  }
  @unless $cart_links_text_transform?? {
    text-transform: $cart_links_text_transform;
  }
  color: $cart_links_text_color;
}

.$_el .mini_cart_item a:hover,
.$_el .mini_cart_item a:focus {
  color: $cart_links_text_color_alt;
  @unless $cart_links_text_shadow_dimensions?? {
    text-shadow: $cart_links_text_shadow_dimensions $cart_links_text_shadow_color_alt;
  }
}

.$_el .mini_cart_item .remove {
  width: calc(1em * $cart_links_line_height);
  margin-left: $cart_items_content_spacing;
}

.rtl .$_el .mini_cart_item .remove {
  margin-left: 0;
  margin-right: $cart_items_content_spacing;
}



<?php

// Quantity
// =============================================================================

?>

.$_el .mini_cart_item .quantity {
  font-family: $cart_quantity_font_family;
  font-size: $cart_quantity_font_size;
  font-style: $cart_quantity_font_style;
  font-weight: $cart_quantity_font_weight;
  line-height: $cart_quantity_line_height;
  @unless $cart_quantity_letter_spacing?? {
    letter-spacing: $cart_quantity_letter_spacing;
  }
  @unless $cart_quantity_text_align?? {
    text-align: $cart_quantity_text_align;
  }
  @unless $cart_quantity_text_decoration?? {
    text-decoration: $cart_quantity_text_decoration;
  }
  @unless $cart_quantity_text_shadow_dimensions?? {
    text-shadow: $cart_quantity_text_shadow_dimensions $cart_quantity_text_shadow_color;
  }
  @unless $cart_quantity_text_transform?? {
    text-transform: $cart_quantity_text_transform;
  }
  color: $cart_quantity_text_color;
}



<?php

// Total
// =============================================================================

?>

.$_el .x-mini-cart .total {
  -webkit-order: $cart_order_total;
          order: $cart_order_total;
  margin: $cart_total_margin;
  @unless $cart_total_border_width?? || $cart_total_border_style?? {
    border-width: $cart_total_border_width;
    border-style: $cart_total_border_style;
    border-color: $cart_total_border_color;
  }
  @unless $cart_total_border_radius?? {
    border-radius: $cart_total_border_radius;
  }
  padding: $cart_total_padding;
  font-family: $cart_total_font_family;
  font-size: $cart_total_font_size;
  font-style: $cart_total_font_style;
  font-weight: $cart_total_font_weight;
  line-height: $cart_total_line_height;
  @unless $cart_total_letter_spacing?? {
    letter-spacing: $cart_total_letter_spacing;
  }
  @unless $cart_total_text_align?? {
    text-align: $cart_total_text_align;
  }
  @unless $cart_total_text_decoration?? {
    text-decoration: $cart_total_text_decoration;
  }
  @unless $cart_total_text_shadow_dimensions?? {
    text-shadow: $cart_total_text_shadow_dimensions $cart_total_text_shadow_color;
  }
  @unless $cart_total_text_transform?? {
    text-transform: $cart_total_text_transform;
  }
  color: $cart_total_text_color;
  @unless $cart_total_bg === 'transparent' {
    background-color: $cart_total_bg;
  }
  @unless $cart_total_box_shadow_dimensions?? {
    box-shadow: $cart_total_box_shadow_dimensions $cart_total_box_shadow_color;
  }
}



<?php

// Buttons
// =============================================================================

?>

.$_el .x-mini-cart .buttons {
  -webkit-order: $cart_order_buttons;
          order: $cart_order_buttons;
  -webkit-justify-content: $cart_buttons_justify_content;
          justify-content: $cart_buttons_justify_content;
  margin: $cart_buttons_margin;
  @unless $cart_buttons_border_width?? || $cart_buttons_border_style?? {
    border-width: $cart_buttons_border_width;
    border-style: $cart_buttons_border_style;
    border-color: $cart_buttons_border_color;
  }
  @unless $cart_buttons_border_radius?? {
    border-radius: $cart_buttons_border_radius;
  }
  padding: $cart_buttons_padding;
  @unless $cart_buttons_bg === 'transparent' {
    background-color: $cart_buttons_bg;
  }
  @unless $cart_buttons_box_shadow_dimensions?? {
    box-shadow: $cart_buttons_box_shadow_dimensions $cart_buttons_box_shadow_color;
  }
}