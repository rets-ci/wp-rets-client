<?php

// =============================================================================
// _TOGGLE-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Base
//   02. Type: Burger
//   03. Type: Grid
//   04. Type: More
// =============================================================================

// Base
// =============================================================================

?>

.$_el .x-toggle {
  color: $toggle_color;
}

.$_el[class*="active"] .x-toggle,
.$_el .x-toggle[class*="active"] {
  color: $toggle_color_alt;
}



<?php

// Type: Burger
// =============================================================================

?>

@if $toggle_type LIKE 'burger%' {
  .$_el .x-toggle-burger {
    width: $toggle_burger_width;
    margin: $toggle_burger_spacing 0;
    font-size: $toggle_burger_size;
  }

  .$_el .x-toggle-burger-bun-t { transform: translate3d(0, -$toggle_burger_spacing, 0); }
  .$_el .x-toggle-burger-bun-b { transform: translate3d(0, $toggle_burger_spacing, 0);  }
}



<?php

// Type: Grid
// =============================================================================

?>

@if $toggle_type LIKE 'grid%' {
  .$_el .x-toggle-grid {
    margin: $toggle_grid_spacing;
    font-size: $toggle_grid_size;
  }

  .$_el .x-toggle-grid-center {
    box-shadow: -$toggle_grid_spacing -$toggle_grid_spacing, 0 -$toggle_grid_spacing, $toggle_grid_spacing -$toggle_grid_spacing, -$toggle_grid_spacing 0, $toggle_grid_spacing 0, -$toggle_grid_spacing $toggle_grid_spacing, 0 $toggle_grid_spacing, $toggle_grid_spacing $toggle_grid_spacing;
  }
}



<?php

// Type: More
// =============================================================================

?>

@if $toggle_type LIKE 'more%' {
  .$_el .x-toggle-more-h,
  .$_el .x-toggle-more-v {
    margin: $toggle_more_spacing;
    font-size: $toggle_more_size;
  }

  .$_el .x-toggle-more-1 { transform: translate3d(-$toggle_more_spacing, 0, 0); }
  .$_el .x-toggle-more-3 { transform: translate3d($toggle_more_spacing, 0, 0);  }
}