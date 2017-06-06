<?php

// =============================================================================
// VIEWS/PARTIALS/TEXT.PHP
// -----------------------------------------------------------------------------
// Text partial.
// =============================================================================

$mod_id = ( isset( $mod_id ) ) ? $mod_id : '';
$tag    = ( isset( $text_tag ) ) ? $text_tag : 'div';


// Prepare Atts
// ------------

$atts = array(
  'class' => x_attr_class( array( $mod_id, 'x-text', 'x-text-' . $text_type, $class ) )
);

if ( isset( $id ) && ! empty( $id ) ) {
  $atts['id'] = $id;
}


// Output
// ------

?>

<<?php echo $tag; ?> <?php echo x_atts( $atts ); ?>>
  <span><?php echo do_shortcode( $text_content ); ?></span>
</<?php echo $tag; ?>>
