<?php

// =============================================================================
// VIEWS/PARTIALS/ANCHOR.PHP
// -----------------------------------------------------------------------------
// Anchor partial.
// =============================================================================

$mod_id                = ( isset( $mod_id )                ) ? $mod_id                : '';
$atts                  = ( isset( $atts )                  ) ? $atts                  : array();
$anchor_before_content = ( isset( $anchor_before_content ) ) ? $anchor_before_content : '';
$anchor_after_content  = ( isset( $anchor_after_content )  ) ? $anchor_after_content  : '';


// Prepare Attr Values
// -------------------

if ( $anchor_type === 'menu-item' ) {
  $class = '';
}

$classes = array( $mod_id, 'x-anchor', 'x-anchor-' . $anchor_type, $class );


// Atts
// ----

$atts = array_merge( array(
  'class'    => x_attr_class( $classes ),
  'tabindex' => 0
), $atts );

if ( $anchor_type !== 'menu-item' ) {
  if ( isset( $id ) && ! empty( $id ) ) {
    $atts['id'] = $id . '-anchor-' . $anchor_type;
  }
}

if ( isset( $anchor_href ) && ! empty( $anchor_href ) ) {
  $atts['href'] = $anchor_href;
}

if ( isset( $anchor_blank ) && $anchor_blank == true ) {
  $atts['target'] = '_blank';
}

if ( isset( $anchor_nofollow ) && $anchor_nofollow == true ) {
  $atts['rel'] = 'nofollow';
}

if ( $anchor_type == 'toggle' ) {
  // $atts['tabindex']          = 0;
  $atts['data-x-toggle']     = true;
  $atts['data-x-toggleable'] = $mod_id;
  $atts['aria-label']        = __( 'Toggle', '__x__' );
}


// Text
// ----

if ( isset( $anchor_text ) && $anchor_text == true ) {

  $p_atts = array( 'class' => 'x-anchor-text-primary'   );
  $s_atts = array( 'class' => 'x-anchor-text-secondary' );

  if ( $anchor_text_interaction != 'none' ) {
    $p_atts['data-x-anchor-anim'] = $anchor_text_interaction;
    $s_atts['data-x-anchor-anim'] = $anchor_text_interaction;
  }

  $p = ( ! empty( $anchor_text_primary_content )   ) ? '<span ' . x_atts( $p_atts ) . '>' . $anchor_text_primary_content . '</span>'   : '';
  $s = ( ! empty( $anchor_text_secondary_content ) ) ? '<span ' . x_atts( $s_atts ) . '>' . $anchor_text_secondary_content . '</span>' : '';

  $anchor_text_order   = ( $anchor_text_reverse == true ) ? $s . $p : $p . $s;
  $anchor_text_content = '<span class="x-anchor-text">' . $anchor_text_order . '</span>';

}


// Graphic
// -------

if ( isset( $anchor_graphic ) && $anchor_graphic == true ) {

  $anchor_graphic_content_atts = array(
    'class'       => 'x-anchor-graphic',
    'aria-hidden' => 'true',
  );

  switch ( $anchor_graphic_type ) {


    // Graphic - Icon
    // --------------
    // 01. Anchor interaction is a class-based transition if primary and
    //     secondary icons are both present.
    // 02. Anchor interaction is an animation if only the primary icon is
    //     present.

    case 'icon' :

      $has_secondary_icon       = $anchor_graphic_icon_alt_enable == true;
      $has_interaction          = $anchor_graphic_interaction != 'none';
      $anchor_interaction_class = ( $has_secondary_icon && $has_interaction ) ? $anchor_graphic_interaction : ''; // 01

      $p_atts = array(
        'class'       => x_attr_class( array( 'x-anchor-graphic-primary', 'x-anchor-graphic-icon', $anchor_interaction_class ) ),
        'data-x-icon' => '&#x' . fa_unicode( $anchor_graphic_icon ) . ';'
      );

      if ( ! $has_secondary_icon && $has_interaction ) {
        $p_atts['data-x-anchor-anim'] = $anchor_graphic_interaction; // 02
      }

      $anchor_graphic_content = '<i ' . x_atts( $p_atts ) . '></i>';

      if ( $has_secondary_icon ) {

        $s_atts = array(
          'class'       => x_attr_class( array( 'x-anchor-graphic-secondary', 'x-anchor-graphic-icon', $anchor_interaction_class ) ),
          'data-x-icon' => '&#x' . fa_unicode( $anchor_graphic_icon_alt ) . ';'
        );

        $anchor_graphic_content .= '<i ' . x_atts( $s_atts ) . '></i>';

      }

      break;


    // Graphic - Image
    // ---------------
    // 01. Anchor interaction is a class-based transition if primary and
    //     secondary icons are both present.
    // 02. Anchor interaction is an animation if only the primary icon is
    //     present.

    case 'image' :

      $has_secondary_image      = $anchor_graphic_image_alt_enable == true;
      $has_interaction          = $anchor_graphic_interaction != 'none';
      $anchor_interaction_class = ( $has_secondary_image && $has_interaction ) ? $anchor_graphic_interaction : ''; // 01

      $add_in = array(
        'class' => x_attr_class( array( 'x-anchor-graphic-primary', 'x-anchor-graphic-image', $anchor_interaction_class ) )
      );

      if ( ! $has_secondary_image && $has_interaction ) {
        $add_in['atts'] = array( 'data-x-anchor-anim' => $anchor_graphic_interaction ); // 02
      }

      $data_image_p_args = array(
        'add_in'    => $add_in,
        'keep_out'  => array( 'anchor_graphic_image_src_alt' ),
        'find_data' => array( 'anchor_graphic_image' => 'image' )
      );

      $data_image_p           = x_get_partial_data( $_custom_data, $data_image_p_args ); // x_dump( $_custom_data );
      $anchor_graphic_content = x_get_view( 'partials', 'image', '', $data_image_p, false );

      if ( $has_secondary_image ) {

        $data_image_s_args = array(
          'add_in'    => array( 'class' => x_attr_class( array( 'x-anchor-graphic-secondary', 'x-anchor-graphic-image', $anchor_interaction_class ) ) ),
          'keep_out'  => array( 'anchor_graphic_image_src' ),
          'find_data' => array( 'anchor_graphic_image' => 'image' )
        );

        $data_image_s            = x_get_partial_data( $_custom_data, $data_image_s_args );
        $anchor_graphic_content .= x_get_view( 'partials', 'image', '', $data_image_s, false );

      }

      break;


    // Graphic - Toggle
    // ----------------

    case 'toggle' :

      $anchor_graphic_content = x_get_view( 'partials', 'toggle', '', array_merge( $_custom_data, array( 'toggle_class' => 'x-anchor-graphic-toggle' ) ), false );

      break;

  }

  $anchor_graphic_content = '<span ' . x_atts( $anchor_graphic_content_atts ) . '>' . $anchor_graphic_content . '</span>';

}


// Sub Indicator
// -------------

if ( $anchor_type == 'menu-item' && isset( $anchor_sub_indicator ) && $anchor_sub_indicator == true ) {

  if ( ! empty( $anchor_sub_indicator_icon ) ) {

    $anchor_sub_indicator_atts = array(
      'class'       => 'x-anchor-sub-indicator',
      'data-x-icon' => '&#x' . fa_unicode( $anchor_sub_indicator_icon ) . ';'
    );

    $anchor_sub_indicator_content = '<i ' . x_atts( $anchor_sub_indicator_atts ) . '></i>';

  }

}


// Particles
// ---------

$has_primary_particle   = isset( $anchor_primary_particle ) && $anchor_primary_particle == true;
$has_secondary_particle = isset( $anchor_secondary_particle ) && $anchor_secondary_particle == true;

if ( $has_primary_particle || $has_secondary_particle ) {

  $anchor_particle_content = '';

  if ( $has_primary_particle ) {
    $data_particle_p          = x_get_partial_data( $_custom_data, array( 'add_in' => array( 'particle_class' => 'x-anchor-particle-primary' ), 'find_data' => array( 'anchor_primary_particle' => 'particle' ) ) );
    $anchor_particle_content .= x_get_view( 'partials', 'particle', '', $data_particle_p, false );
  }

  if ( $has_secondary_particle ) {
    $data_particle_s          = x_get_partial_data( $_custom_data, array( 'add_in' => array( 'particle_class' => 'x-anchor-particle-secondary' ), 'find_data' => array( 'anchor_secondary_particle' => 'particle' ) ) );
    $anchor_particle_content .= x_get_view( 'partials', 'particle', '', $data_particle_s, false );
  }

}


// Output
// ------

?>

<a <?php echo x_atts( $atts ); ?>>

  <?php echo $anchor_before_content; ?>

  <span class="x-anchor-content">
    <?php if ( isset( $anchor_graphic_content )       ) : echo $anchor_graphic_content;       endif; ?>
    <?php if ( isset( $anchor_text_content )          ) : echo $anchor_text_content;          endif; ?>
    <?php if ( isset( $anchor_sub_indicator_content ) ) : echo $anchor_sub_indicator_content; endif; ?>
    <?php if ( isset( $anchor_particle_content )      ) : echo $anchor_particle_content;      endif; ?>
  </span>

  <?php echo $anchor_after_content; ?>

</a>
