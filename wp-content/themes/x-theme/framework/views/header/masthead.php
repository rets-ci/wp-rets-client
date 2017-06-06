<?php

// =============================================================================
// VIEWS/HEADER/MASTHEAD.PHP
// -----------------------------------------------------------------------------
// Masthead markup.
// =============================================================================

$atts = x_atts( array(
  'class' => 'x-masthead',
  'role'  => 'banner'
) );

?>

<?php do_action( 'x_before_masthead_begin' ); ?>

  <header <?php echo $atts; ?>>

    <?php do_action( 'x_after_masthead_begin' ); ?>

    <?php do_action( 'x_masthead' ); ?>

    <?php do_action( 'x_before_masthead_end' ) ?>

  </header>

<?php do_action( 'x_after_masthead_end' ); ?>
