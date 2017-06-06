<?php

// =============================================================================
// VIEWS/PARTIALS/IMAGE.PHP
// -----------------------------------------------------------------------------
// Image partial.
// =============================================================================

// Notes
// -----
// 01. Sometimes the image source key passed down will end with "_alt", so we
//     account for and allow this if it is the value provided.
// 02. A default image "alt" attribute is generated in case one is not provided.

$mod_id    = ( isset( $mod_id )                             ) ? $mod_id        : '';
$atts      = ( isset( $atts )                               ) ? $atts          : array();
$image_src = ( isset( $image_src_alt )                      ) ? $image_src_alt : $image_src; // 01
$image_alt = ( isset( $image_alt ) && ! empty( $image_alt ) ) ? $image_alt     : __( 'Image', '__x__' ); // 01


// Prepare Attr Values
// -------------------

$classes = x_attr_class( array( $mod_id, 'x-image', $class ) );


// Prepare Atts
// ------------

$atts = array_merge( array(
  'class' => $classes,
), $atts );

if ( isset( $id ) && ! empty( $id ) ) {
  $atts['id'] = $id;
}

$atts_image = array(
  'alt' => $image_alt,
);


// Image Setup
// -----------
// 01. If an integer is provided as the $image_src, we assume it is the
//     WordPress attachment ID.
// 02. If not an integer, we assume for a valid URL. If empty, a placeholder
//     is generated until the true resource is assigned.

if ( is_int( $image_src ) ) { // 01

  $image_attachment_meta = wp_get_attachment_image_src( $image_src, 'full', false );

  $image_w = ( $image_retina === true ) ? $image_attachment_meta[1] / 2 : $image_attachment_meta[1];
  $image_h = ( $image_retina === true ) ? $image_attachment_meta[2] / 2 : $image_attachment_meta[2];

  $atts_image['src']    = $image_attachment_meta[0];
  $atts_image['width']  = $image_w;
  $atts_image['height'] = $image_h;

} else { // 02

  if ( empty( $image_src ) && function_exists( 'cornerstone_make_placeholder_image_uri' ) ) {

    $image_w = ( $image_retina === true ) ? 48 / 2 : 48;
    $image_h = ( $image_retina === true ) ? 48 / 2 : 48;

    $atts_image['src']    = cornerstone_make_placeholder_image_uri( 48, 48, 'rgba(0, 0, 0, 0.35)' );
    $atts_image['width']  = $image_w;
    $atts_image['height'] = $image_h;

  } else {

    $image_w = ( $image_retina === true ) ? $image_width / 2  : $image_width;
    $image_h = ( $image_retina === true ) ? $image_height / 2 : $image_height;

    $atts_image['src']    = $image_src;
    $atts_image['width']  = round( $image_w );
    $atts_image['height'] = round( $image_h );

  }

}


// Scaling
// -------

if ( isset( $_region ) && isset( $image_type ) && $image_type === 'scaling' ) {

  $scaling_style = 'width: 100%; max-width: ' . $image_w . 'px;';

  if ( $_region === 'top' || $_region === 'bottom' || $_region === 'footer' ) {
    $scaling_style = 'height: 100%; max-height: ' . $image_h . 'px;';
  }

  $atts['class'] .= ' x-image-preserve-ratio';

  if ( isset( $atts['style'] ) ) {
    $atts['style'] .= ' ' . $scaling_style;
  } else {
    $atts['style'] = $scaling_style;
  }

}


// Linked vs. Not
// --------------

if ( isset( $image_link ) && $image_link === true ) {

  $tag = 'a';

  $atts['href'] = ( ! empty( $image_href ) ) ? $image_href : '#';

  if ( $image_blank === true ) {
    $atts['target'] = '_blank';
  }

  if ( $image_nofollow === true ) {
    $atts['rel'] = 'nofollow';
  }

} else {

  $tag = 'span';

}


// Output
// ------

?>

<<?php echo $tag; ?> <?php echo x_atts( $atts ); ?>>
  <img <?php echo x_atts( $atts_image ); ?>>
</<?php echo $tag; ?>>