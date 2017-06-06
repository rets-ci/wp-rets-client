<?php

// =============================================================================
// VIEWS/BARS/BAR.PHP
// -----------------------------------------------------------------------------
// Bar module.
// =============================================================================

// Prepare Classes
// ---------------

$class_region_specific = 'x-bar-' . $_region;
$class_region_general  = ( ( $_region === 'left' || $_region === 'right' ) ? 'x-bar-v' : 'x-bar-h' );
$class_position        = 'x-bar-' . $bar_position;

$classes = array( $mod_id, 'x-bar', $class_region_specific, $class_region_general, $class_position, $class );

if ( $bar_scroll == false ) {
  $classes[] = 'x-bar-outer-spacers';
}


// Prepare Data
// ------------

$bar_data = array(
  'id'     => $mod_id,
  'region' => $_region,
);

if ( $_region === 'left' || $_region === 'right' ) {
  $bar_data['width'] = $bar_width;
}

if ( $_region === 'top' || $_region === 'bottom' || $_region === 'footer' ) {
  $bar_data['height'] = $bar_height;
}

if ( $_region == 'top' && $bar_sticky == true ) {
  $bar_data['sticky']          = true;
  $bar_data['keepMargin']      = $bar_sticky_keep_margin;
  $bar_data['hideInitially']   = $bar_sticky_hide_initially;
  $bar_data['zStack']          = $bar_sticky_z_stack;
  $bar_data['triggerOffset']   = $bar_sticky_trigger_offset;
  $bar_data['triggerSelector'] = $bar_sticky_trigger_selector;
  $bar_data['shrink']          = $bar_sticky_shrink;
}


// Atts: Bar
// ---------

$atts_bar = array(
  'class'      => x_attr_class( $classes ),
  'data-x-bar' => x_attr_json( $bar_data ),
);

if ( isset( $id ) && ! empty( $id ) ) {
  $atts_bar['id'] = $id;
}

if ( $bar_sticky_hide_initially ) {
  if ( ! isset( $atts_bar['style'] ) ) {
    $atts_bar['style'] = '';
  }
  $atts_bar['style'] = $atts_bar['style'] . 'visibility:hidden;';
}


// Atts: Bar Scroll
// ----------------

$bar_scroll_begin = '';
$bar_scroll_end   = '';

if ( $bar_scroll == true && $bar_height !== 'auto' ) {

  $suppress_scroll      = ( $_region === 'top' || $_region === 'bottom' || $_region === 'footer' ) ? 'suppressScrollY' : 'suppressScrollX';
  $atts_bar_scroll_data = array( $suppress_scroll => true );
  $atts_bar_scroll      = array( 'class' => x_attr_class( array( $mod_id, 'x-bar-scroll', 'x-bar-outer-spacers' ) ), 'data-x-scrollbar' => x_attr_json( $atts_bar_scroll_data ) );

  $bar_scroll_begin = '<div ' . x_atts( $atts_bar_scroll ) . '>';
  $bar_scroll_end   = '</div>';

  // $atts_bar_scroll_outer = array( 'class' => x_attr_class( array( $mod_id, 'x-bar-scroll-outer' ) ) );
  // $atts_bar_scroll_inner = array( 'class' => x_attr_class( array( $mod_id, 'x-bar-scroll-inner', 'x-bar-outer-spacers' ) ) );

  // $bar_scroll_begin = '<div ' . x_atts( $atts_bar_scroll_outer ) . '><div ' . x_atts( $atts_bar_scroll_inner ) . '>';
  // $bar_scroll_end   = '</div></div>';

}


// Defer Bar Spaces
// ----------------
// Runs concurrently with code from the bar setup functions to allow for
// proper output of spaces to hooks.
//
// 01. Does not run on the frontend as output has already occurred, but is
//     utilized by the preview system.
// 02. Output for both the frontend and preview system from this template.

$bar_space_actions = array(
  'left'   => 'x_before_site_begin',    // 01
  'right'  => 'x_before_site_begin',    // 01
  'bottom' => 'x_before_site_end'       // 02
);

if ( isset( $bar_space_actions[$_region] ) && $bar_position === 'fixed' ) {
  x_set_view( $bar_space_actions[$_region], 'bars', 'bar', 'space', $_custom_data );
}


// Background Partial
// ------------------

if ( $bar_bg_advanced == true ) {
  $data_bg = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'bg' => '' ) ) );
  $bar_bg  = x_get_view( 'partials', 'bg', '', $data_bg, false );
}


// Output
// ------

if ( $_region === 'top' && $bar_position_top === 'relative' && $bar_sticky === true && $bar_sticky_hide_initially === false ) {
  x_get_view( 'bars', 'bar', 'space', $_custom_data );
}

?>

<div <?php echo x_atts( $atts_bar ); ?>>

  <?php if ( isset( $bar_bg ) ) { echo $bar_bg; } ?>

  <?php echo $bar_scroll_begin; ?>
    <div class="<?php echo $mod_id; ?> x-bar-content">
      <?php do_action( 'x_bar', $_modules, $global ); ?>
    </div>
  <?php echo $bar_scroll_end; ?>

</div>