<?php
/**
 * Theme Icons
 */
if( !defined( 'SITEORIGIN_WIDGETS_ICONS' ) ) {
  define( 'SITEORIGIN_WIDGETS_ICONS', true );
}

function rdc_widgets_icon_families_filter( $families ){
  $bundled = array(
    'reddoorcompany' => __( 'Reddoorcompany', 'so-widgets-bundle' ),
    'wpproperty' => __( 'Wp-property', 'so-widgets-bundle' ),
  );

  foreach ( $bundled as $font => $name) {
    include_once get_template_directory(). '/static/icons/' . $font . '/filter.php';
    $families[$font] = array(
      'name' => $name,
      'style_uri' => get_template_directory_uri() . '/static/icons/' . $font . '/style.css',
      'icons' => apply_filters('siteorigin_widgets_icons_' . $font, array() ),
    );
  }

  return $families;
}
add_filter( 'siteorigin_widgets_icon_families', 'rdc_widgets_icon_families_filter' );