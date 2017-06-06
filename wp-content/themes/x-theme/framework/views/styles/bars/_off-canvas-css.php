<?php

// =============================================================================
// _OFF-CANVAS-CSS.PHP
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

.$_el.x-off-canvas {
  font-size: $off_canvas_base_font_size;
}

.$_el.x-off-canvas .x-off-canvas-bg {
  @unless $off_canvas_bg_color === 'transparent' {
    background-color: $off_canvas_bg_color;
  }
}



<?php

// Close
// =============================================================================

?>

.$_el.x-off-canvas .x-off-canvas-close {
  width: calc(1em * $off_canvas_close_dimensions);
  height: calc(1em * $off_canvas_close_dimensions);
  font-size: $off_canvas_close_font_size;
  color: $off_canvas_close_color;
}

.$_el.x-off-canvas .x-off-canvas-close:hover,
.$_el.x-off-canvas .x-off-canvas-close:focus {
  color: $off_canvas_close_color_alt;
}



<?php

// Content
// =============================================================================

?>

.$_el.x-off-canvas .x-off-canvas-content {
  max-width: $off_canvas_content_max_width;
  @unless $off_canvas_content_border_width?? || $off_canvas_content_border_style?? {
    border-width: $off_canvas_content_border_width;
    border-style: $off_canvas_content_border_style;
    border-color: $off_canvas_content_border_color;
  }
  padding: calc($off_canvas_close_font_size * $off_canvas_close_dimensions);
  @unless $off_canvas_content_bg_color === 'transparent' {
    background-color: $off_canvas_content_bg_color;
  }
  @unless $off_canvas_content_box_shadow_dimensions?? {
    box-shadow: $off_canvas_content_box_shadow_dimensions $off_canvas_content_box_shadow_color;
  }
}
