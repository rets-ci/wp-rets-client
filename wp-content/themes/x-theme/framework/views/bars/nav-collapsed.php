<?php

// =============================================================================
// VIEWS/BARS/NAV-COLLAPSED.PHP
// -----------------------------------------------------------------------------
// Nav (collapsed) module.
// =============================================================================

// Data: Partials
// --------------

$data_menu = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'menu' => '', 'anchor' => '', 'sub_anchor' => '' ) ) );

// $_custom_data


// Output
// ------

?>

<?php

if ( $_region === 'top' || $_region === 'bottom' || $_region === 'footer' ) {

  $data_toggle     = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'toggle_anchor' => 'anchor', 'toggle' => '' ) ) );
  $data_off_canvas = x_get_partial_data( $_custom_data, array( 'find_data' => array( 'off_canvas' => '' ) ) );

  $off_canvas_content = array( 'off_canvas_content' => x_get_view( 'partials', 'menu', '', $data_menu, false ) );
  $data_off_canvas    = array_merge( $data_off_canvas, $off_canvas_content );

  x_get_view( 'partials', 'anchor', '', $data_toggle, true );
  x_set_view( 'x_before_site_end', 'partials', 'off-canvas', '', $data_off_canvas, 10 );

} else {

  x_get_view( 'partials', 'menu', '', $data_menu, true );

}

?>
