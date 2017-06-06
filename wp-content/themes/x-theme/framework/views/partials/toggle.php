<?php

// =============================================================================
// VIEWS/PARTIALS/TOGGLE.PHP
// -----------------------------------------------------------------------------
// Toggle partial.
// =============================================================================

$toggle_class              = ( isset( $toggle_class ) ) ? ' ' . $toggle_class : '';
$toggle_type_group         = preg_replace( '/-\d/', '', $toggle_type );
$toggle_type_deconstructed = explode( '-', $toggle_type );
$toggle_type_number        = end( $toggle_type_deconstructed );

?>

<span class="x-toggle x-toggle-<?php echo $toggle_type_group; echo $toggle_class; ?>" aria-hidden="true">

  <?php if ( $toggle_type_group == 'burger' ) : ?>

    <span class="x-toggle-burger-bun-t" data-x-toggle-anim="xBunT-<?php echo $toggle_type_number; ?>"></span>
    <span class="x-toggle-burger-patty" data-x-toggle-anim="xPatty-<?php echo $toggle_type_number; ?>"></span>
    <span class="x-toggle-burger-bun-b" data-x-toggle-anim="xBunB-<?php echo $toggle_type_number; ?>"></span>

  <?php elseif ( $toggle_type_group == 'grid' ) : ?>

    <span class="x-toggle-grid-center" data-x-toggle-anim="xGrid-<?php echo $toggle_type_number; ?>"></span>

  <?php elseif ( $toggle_type_group == 'more-h' || $toggle_type_group == 'more-v' ) : ?>

    <span class="x-toggle-more-1" data-x-toggle-anim="xMore1-<?php echo $toggle_type_number; ?>"></span>
    <span class="x-toggle-more-2" data-x-toggle-anim="xMore2-<?php echo $toggle_type_number; ?>"></span>
    <span class="x-toggle-more-3" data-x-toggle-anim="xMore3-<?php echo $toggle_type_number; ?>"></span>

  <?php endif; ?>

</span>

<?php

// <span class="x-toggle-grid-tl"></span>
// <span class="x-toggle-grid-t"></span>
// <span class="x-toggle-grid-tr"></span>
// <span class="x-toggle-grid-l"></span>
// <span class="x-toggle-grid-c"></span>
// <span class="x-toggle-grid-r"></span>
// <span class="x-toggle-grid-bl"></span>
// <span class="x-toggle-grid-b"></span>
// <span class="x-toggle-grid-br"></span>

?>