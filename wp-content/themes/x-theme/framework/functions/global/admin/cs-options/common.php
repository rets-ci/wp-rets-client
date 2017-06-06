<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/CS-OPTIONS/COMMON.PHP
// -----------------------------------------------------------------------------
// Lists, localized strings, and other common bits used multiple times
// throughout our option registration.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Lists
// =============================================================================

// Lists
// =============================================================================


$list_section_layouts = array(
  'sidebar'    => __( 'Use Global Content Layout', '__x__' ),
  'full-width' => __( 'Fullwidth', '__x__' )
);

$list_ethos_post_carousel_and_slider_display = array(
  'most-commented' => __( 'Most Commented', '__x__' ),
  'random'         => __( 'Random', '__x__' ),
  'featured'       => __( 'Featured', '__x__' )
);

$list_widget_areas = array(
  array( 'value' => 0, 'label' => __( 'None (Disabled)', '__x__' ) ),
  array( 'value' => 1, 'label' => __( 'One', '__x__' ) ),
  array( 'value' => 2, 'label' => __( 'Two', '__x__' ) ),
  array( 'value' => 3, 'label' => __( 'Three', '__x__' ) ),
  array( 'value' => 4, 'label' => __( 'Four', '__x__' ) )
);

$list_left_right_positioning = array(
  'left'  => __( 'Left', '__x__' ),
  'right' => __( 'Right', '__x__' )
);

$list_blog_styles = array(
  'standard' => __( 'Standard', '__x__' ),
  'masonry'  => __( 'Masonry', '__x__' )
);

$list_masonry_columns = array(
array( 'value' => 2, 'label' => __( 'Two', '__x__' ) ) ,
array( 'value' => 3, 'label' => __( 'Three', '__x__'  ) )
);

$list_shop_columns = array(
array( 'value' => 1, 'label' => __( 'One', '__x__' ) ) ,
array( 'value' => 2, 'label' => __( 'Two', '__x__' ) ) ,
array( 'value' => 3, 'label' => __( 'Three', '__x__' ) ) ,
array( 'value' => 4, 'label' => __( 'Four', '__x__'  ) )
);

$list_woocommerce_navbar_cart_content = array(
  'icon'  => __( 'Icon', '__x__' ),
  'total' => __( 'Cart Total', '__x__' ),
  'count' => __( 'Item Count', '__x__' )
);

$list_letter_spacing = array(
  'unit_mode' => 'unitless',
  'min'  => -0.15,
  'max'  => 0.5,
  'step' => 0.001
);
