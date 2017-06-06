<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/CS-OPTIONS/SETUP.PHP
// -----------------------------------------------------------------------------
// Setup Cornerstone Options Framework
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Set Path
//   02. Require Files
//   03. Register Mappings
//   04. Setup Preview
//   05. Fonts
// =============================================================================

// Set Path
// =============================================================================

$csoptions_path = X_TEMPLATE_PATH . '/framework/functions/global/admin/cs-options';



// Require Files
// =============================================================================

require_once( $csoptions_path . '/register.php' );


// Register Mappings
// =============================================================================

function x_cornerstone_options_register() {
  cornerstone_options_register_sections( x_cornerstone_options_map() );

  cornerstone_options_enable_custom_css( 'x_custom_styles' );
  cornerstone_options_enable_custom_js( 'x_custom_scripts' );
}

add_action( 'cornerstone_options_register', 'x_cornerstone_options_register' );



// Setup preview
// =============================================================================

function x_cornerstone_options_preview_setup() {
  remove_action('x_head_css', 'x_customizer_output_custom_css');
  add_filter( 'pre_option_x_cache_google_fonts_request', 'x_get_google_fonts_request' );
}

add_action('cs_options_preview_setup', 'x_cornerstone_options_preview_setup' );




// Fonts
// =============================================================================

add_filter( 'cs_font_data', 'x_fonts_data' );
