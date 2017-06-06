<?php

// =============================================================================
// NAV-COLLAPSED-CSS.PHP
// -----------------------------------------------------------------------------
// Generated styling.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Include Partial CSS
// =============================================================================

// Include Partial CSS
// =============================================================================

$anchor_selector = '.x-anchor-toggle';
$anchor_k_pre    = 'toggle';

?>

@if $_region === 'top' || $_region === 'bottom' || $_region === 'footer' {
  <?php include( '_anchor-css.php' ); ?>
  <?php include( '_off-canvas-css.php' ); ?>
}

<?php

include( '_menu-css.php' );

?>

.$_el.x-menu > li > .sub-menu {
  margin: $sub_menu_margin;
}

<?php

$anchor_selector = '.x-menu > li > .x-anchor';
$anchor_k_pre    = '';

include( '_anchor-css.php' );

$anchor_selector = ' .sub-menu .x-anchor';
$anchor_k_pre    = 'sub';

include( '_anchor-css.php' );