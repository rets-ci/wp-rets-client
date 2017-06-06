<?php

// =============================================================================
// VIEWS/PARTIALS/SEARCH.PHP
// -----------------------------------------------------------------------------
// Search partial.
// =============================================================================

$mod_id = ( isset( $mod_id ) ) ? $mod_id : '';


// Prepare Attr Values
// -------------------

if ( $search_type !== 'inline' ) {
  $class = '';
}

$classes = x_attr_class( array( $mod_id, 'x-search', $class ) );
$data    = x_attr_json( array( 'search' => true ) );
$action  = esc_url( home_url( '/' ) );


// Prepare Atts
// ------------

$atts_search_form = array(
  'class'         => $classes,
  'data-x-search' => $data,
  'action'        => $action,
  'method'        => 'get'
);

if ( isset( $id ) && ! empty( $id ) ) {
  if ( $search_type === 'inline' ) {
    $atts_search_form['id'] = $id . '-search';
  }
}

$atts_search_label = array(
  'class' => 'visually-hidden',
  'for'   => 's-' . $mod_id
);

$atts_search_submit = array(
  'class'                => 'x-search-btn x-search-btn-submit',
  'type'                 => 'button',
  'data-x-search-submit' => '',
  'tabindex'             => ''
);

$atts_search_input = array(
  'id'       => 's-' . $mod_id,
  'class'    => 'x-search-input',
  'type'     => 'search',
  'name'     => 's',
  'tabindex' => ''
);

if ( ! empty( $search_placeholder ) ) {
  $atts_search_input['placeholder'] = $search_placeholder;
}

$atts_search_clear = array(
  'class'               => 'x-search-btn x-search-btn-clear',
  'type'                => 'button',
  'data-x-search-clear' => '',
  'tabindex'            => ''
);


// Prepare Button Content
// ----------------------

$text_submit = '<span class="visually-hidden">' . __( 'Submit', '__x__' ) . '</span>';
$text_clear  = '<span class="visually-hidden">' . __( 'Clear', '__x__' ) . '</span>';

$svg_submit = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1 -1 25 25"><circle fill="none" stroke-width="' . $search_submit_stroke_width . '" stroke-linecap="square" stroke-miterlimit="10" cx="10" cy="10" r="9" stroke-linejoin="miter"/><line fill="none" stroke-width="' . $search_submit_stroke_width . '" stroke-linecap="square" stroke-miterlimit="10" x1="22" y1="22" x2="16.4" y2="16.4" stroke-linejoin="miter"/></svg>'; // viewBox 0 0 24 24
$svg_clear  = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="-1 -1 25 25"><line fill="none" stroke-width="' . $search_clear_stroke_width . '" stroke-linecap="square" stroke-miterlimit="10" x1="19" y1="5" x2="5" y2="19" stroke-linejoin="miter"/><line fill="none" stroke-width="' . $search_clear_stroke_width . '" stroke-linecap="square" stroke-miterlimit="10" x1="19" y1="19" x2="5" y2="5" stroke-linejoin="miter"/></svg>'; // viewBox 0 0 24 24


// Output
// ------

?>

<form <?php echo x_atts( $atts_search_form ); ?>>

  <label <?php echo x_atts( $atts_search_label ); ?>><?php _e( 'Search', '__x__' ); ?></label>

  <input <?php echo x_atts( $atts_search_input ); ?>>
  <button <?php echo x_atts( $atts_search_submit ); ?>><?php echo $text_submit . $svg_submit; ?></button>
  <button <?php echo x_atts( $atts_search_clear ); ?>><?php echo $text_clear . $svg_clear; ?></button>

</form>
