<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/CUSTOMIZER/OUTPUT.PHP
// -----------------------------------------------------------------------------
// Sets up custom output from the Customizer.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. CSS: Get Output
//   02. CSS: Cache Output
//   02. JS: Generate Output
// =============================================================================

// CSS: Get Output
// =============================================================================

function x_customizer_get_css() {

  $outp_path = X_TEMPLATE_PATH . '/framework/functions/global/admin/customizer/output';

  include( $outp_path . '/variables.php' );

  ob_start();

    include( $outp_path . '/' . $x_stack . '.php' );
    include( $outp_path . '/base.php' );
    include( $outp_path . '/buttons.php' );
    include( $outp_path . '/widgets.php' );
    include( $outp_path . '/bbpress.php' );
    include( $outp_path . '/buddypress.php' );
    include( $outp_path . '/woocommerce.php' );
    include( $outp_path . '/gravity-forms.php' );

  $css = ob_get_clean();

  if ( function_exists('cornerstone_post_process_css' ) ) {
    $css = cornerstone_post_process_css( $css );
  }

  return x_get_clean_css( $css );

}

function x_customizer_output_css() {
  echo x_customizer_get_css();
}



// // CSS: Cache Output
// // =============================================================================

// //
// // Cache Customizer CSS.
// //

// function x_customizer_cache_css() {

//   $cached_css = get_option( 'x_cache_customizer_css', false );

//   if ( $cached_css == false ) {

//     $cached_css = x_customizer_get_css();

//     update_option( 'x_cache_customizer_css', $cached_css );

//   }

//   return $cached_css;

// }


// //
// // Cache bust.
// //

// function x_customizer_bust_css_cache() {

//   delete_option( 'x_cache_customizer_css' );

// }

// add_action( 'customize_save_after', 'x_customizer_bust_css_cache' );


// //
// // Bust Customizer CSS cache when certain plugins are activated.
// //

// function x_customizer_bust_css_cache_on_plugin_change( $plugin, $network_activation ) {

//   $plugins = array(
//     'bbpress/bbpress.php',
//     'buddypress/bp-loader.php',
//     'woocommerce/woocommerce.php',
//     'gravityforms/gravityforms.php'
//   );

//   if ( in_array( $plugin, $plugins ) ) {
//     x_customizer_bust_css_cache();
//   }

// }

// add_action( 'activated_plugin', 'x_customizer_bust_css_cache_on_plugin_change', 10, 2 );
// add_action( 'deactivated_plugin', 'x_customizer_bust_css_cache_on_plugin_change', 10, 2 );



// JS: Generate Output
// =============================================================================

function x_customizer_output_js() {

  $x_custom_scripts                     = x_get_option( 'x_custom_scripts' );
  $entry_id                             = get_the_ID();
  $x_entry_bg_image_full                = get_post_meta( $entry_id, '_x_entry_bg_image_full', true );
  $x_entry_bg_image_full_fade           = get_post_meta( $entry_id, '_x_entry_bg_image_full_fade', true );
  $x_entry_bg_image_full_duration       = get_post_meta( $entry_id, '_x_entry_bg_image_full_duration', true );
  $x_design_bg_image_full               = x_get_option( 'x_design_bg_image_full' );
  $x_design_bg_image_full_fade          = x_get_option( 'x_design_bg_image_full_fade' );

  ?>

  <?php if ( $x_custom_scripts ) : ?>

    <script id="x-customizer-js">
      <?php echo $x_custom_scripts; ?>
    </script>

  <?php endif; ?>

  <?php if ( $x_entry_bg_image_full && is_singular() ) : ?>

    <?php
    $page_bg_images_output = '';
    $page_bg_images        = explode( ',', $x_entry_bg_image_full );
    foreach ( $page_bg_images as $page_bg_image ) {
      $page_bg_images_output .= '"' . $page_bg_image . '", ';
    }
    $page_bg_images_output = trim( $page_bg_images_output, ', ' );
    ?>

    <script>jQuery.backstretch([<?php echo $page_bg_images_output; ?>], {duration: <?php echo $x_entry_bg_image_full_duration; ?>, fade: <?php echo $x_entry_bg_image_full_fade; ?>});</script>

  <?php elseif ( $x_design_bg_image_full ) : ?>

    <script>jQuery.backstretch(['<?php echo x_make_protocol_relative( $x_design_bg_image_full ); ?>'], {fade: <?php echo $x_design_bg_image_full_fade; ?>});</script>

  <?php endif;

}

add_action( 'wp_footer', 'x_customizer_output_js', 9999, 0 );
