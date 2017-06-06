<?php

// =============================================================================
// VIEWS/PARTIALS/DROPDOWN.PHP
// -----------------------------------------------------------------------------
// Menu partial.
// =============================================================================

$mod_id = ( isset( $mod_id )                                ) ? $mod_id : '';
$tag    = ( isset( $dropdown_is_list ) && $dropdown_is_list ) ? 'ul' : 'div';


// Prepare Attr Values
// -------------------

$classes = x_attr_class( array( $mod_id, 'x-dropdown', $class ) );


// Prepare Atts
// ------------

$atts = array(
  'class'             => $classes,
  'data-x-stem'       => NULL,
  'data-x-stem-top'   => NULL,
  'data-x-toggleable' => $mod_id,
  'tabindex'          => -1
);

if ( isset( $_region ) && $_region === 'left' ) {
  $atts['data-x-stem-top'] = 'h';
}

if ( isset( $_region ) && $_region === 'right' ) {
  $atts['data-x-stem-top'] = 'rh'; 
}

if ( isset( $id ) && ! empty( $id ) ) {
  $atts['id'] = $id . '-dropdown';
}


// Output
// ------

?>

<<?php echo $tag ?> <?php echo x_atts( $atts ); ?>>
  <?php echo do_shortcode( $dropdown_content ); ?>
</<?php echo $tag ?>>
