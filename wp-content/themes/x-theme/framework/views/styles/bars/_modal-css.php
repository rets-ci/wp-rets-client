<?php

// =============================================================================
// _MODAL-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Base
//   02. Close
//   03. Content
// =============================================================================

// Base
// =============================================================================

?>

.$_el.x-modal {
  font-size: $modal_base_font_size;
}

.$_el.x-modal .x-modal-bg {
  @unless $modal_bg_color === 'transparent' {
    background-color: $modal_bg_color;
  }
}



<?php

// Close
// =============================================================================

?>

.$_el.x-modal .x-modal-close {
  width: calc(1em * $modal_close_dimensions);
  height: calc(1em * $modal_close_dimensions);
  font-size: $modal_close_font_size;
  color: $modal_close_color;
}

.$_el.x-modal .x-modal-close:hover,
.$_el.x-modal .x-modal-close:focus {
  color: $modal_close_color_alt;
}



<?php

// Content
// =============================================================================

?>

.$_el.x-modal .x-modal-content-inner {
  padding: calc($modal_close_font_size * $modal_close_dimensions);
}

.$_el.x-modal .x-modal-content {
  max-width: $modal_content_max_width;
  @unless $modal_content_border_width?? || $modal_content_border_style?? {
    border-width: $modal_content_border_width;
    border-style: $modal_content_border_style;
    border-color: $modal_content_border_color;
  }
  @unless $modal_content_border_radius?? {
    border-radius: $modal_content_border_radius;
  }
  @unless $modal_content_padding?? {
    padding: $modal_content_padding;
  }
  @unless $modal_content_bg_color === 'transparent' {
    background-color: $modal_content_bg_color;
  }
  @unless $modal_content_box_shadow_dimensions?? {
    box-shadow: $modal_content_box_shadow_dimensions $modal_content_box_shadow_color;
  }
}
