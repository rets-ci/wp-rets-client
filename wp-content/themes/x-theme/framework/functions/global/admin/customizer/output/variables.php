<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/CUSTOMIZER/OUTPUT/VARIABLES.PHP
// -----------------------------------------------------------------------------
// Variables to be used across all Stacks for global CSS output.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Layout and Design
//   02. Typography
//   03. Buttons
// =============================================================================

// Layout and Design
// =============================================================================

$x_stack                               = x_get_stack();
$x_layout_site                         = x_get_option( 'x_layout_site' );
$x_layout_site_max_width               = x_get_option( 'x_layout_site_max_width' );
$x_layout_site_width                   = x_get_option( 'x_layout_site_width' );
$x_layout_content                      = x_get_option( 'x_layout_content' );
$x_layout_content_width                = x_get_option( 'x_layout_content_width' );
$x_layout_sidebar_width                = x_get_option( 'x_layout_sidebar_width' );
$x_design_bg_color                     = x_get_option( 'x_design_bg_color' );
$x_design_bg_image_pattern             = x_get_option( 'x_design_bg_image_pattern' );
$x_design_bg_image_full                = x_get_option( 'x_design_bg_image_full' );
$x_design_bg_image_full_fade           = x_get_option( 'x_design_bg_image_full_fade' );



// Typography
// =============================================================================

$x_root_font_size_mode                 = x_get_option( 'x_root_font_size_mode' );
$x_root_font_size_stepped_unit         = x_get_option( 'x_root_font_size_stepped_unit' );
$x_root_font_size_stepped_xs           = x_get_option( 'x_root_font_size_stepped_xs' );
$x_root_font_size_stepped_sm           = x_get_option( 'x_root_font_size_stepped_sm' );
$x_root_font_size_stepped_md           = x_get_option( 'x_root_font_size_stepped_md' );
$x_root_font_size_stepped_lg           = x_get_option( 'x_root_font_size_stepped_lg' );
$x_root_font_size_stepped_xl           = x_get_option( 'x_root_font_size_stepped_xl' );
$x_root_font_size_scaling_unit         = x_get_option( 'x_root_font_size_scaling_unit' );
$x_root_font_size_scaling_min          = x_get_option( 'x_root_font_size_scaling_min' );
$x_root_font_size_scaling_max          = x_get_option( 'x_root_font_size_scaling_max' );
$x_root_font_size_scaling_lower_limit  = x_get_option( 'x_root_font_size_scaling_lower_limit' );
$x_root_font_size_scaling_upper_limit  = x_get_option( 'x_root_font_size_scaling_upper_limit' );
$x_body_font_size                      = x_get_option( 'x_body_font_size' );
$x_body_font_color                     = x_post_css_value( x_get_option( 'x_body_font_color' ), 'color' );
$x_content_font_size                   = x_get_option( 'x_content_font_size' );
$x_content_font_size_rem               = x_get_option( 'x_content_font_size_rem' );
$x_headings_font_color                 = x_post_css_value( x_get_option( 'x_headings_font_color' ), 'color' );
$x_h1_letter_spacing                   = x_get_option( 'x_h1_letter_spacing' );
$x_h2_letter_spacing                   = x_get_option( 'x_h2_letter_spacing' );
$x_h3_letter_spacing                   = x_get_option( 'x_h3_letter_spacing' );
$x_h4_letter_spacing                   = x_get_option( 'x_h4_letter_spacing' );
$x_h5_letter_spacing                   = x_get_option( 'x_h5_letter_spacing' );
$x_h6_letter_spacing                   = x_get_option( 'x_h6_letter_spacing' );
$x_headings_uppercase_enable           = x_get_option( 'x_headings_uppercase_enable');
$x_headings_widget_icons_enable        = x_get_option( 'x_headings_widget_icons_enable');
$x_site_link_color                     = x_post_css_value( x_get_option( 'x_site_link_color' ), 'color' );
$x_site_link_color_hover               = x_post_css_value( x_get_option( 'x_site_link_color_hover' ), 'color' );
$x_logo_width                          = x_get_option( 'x_logo_width' );
$x_logo_font_family                    = x_get_option( 'x_logo_font_family' );
$x_logo_font_size                      = x_get_option( 'x_logo_font_size' );
$x_logo_font_weight_and_style          = x_get_option( 'x_logo_font_weight' );
$x_logo_font_color                     = x_post_css_value( x_get_option( 'x_logo_font_color' ), 'color' );
$x_logo_letter_spacing                 = x_get_option( 'x_logo_letter_spacing' );
$x_logo_uppercase_enable               = x_get_option( 'x_logo_uppercase_enable');
$x_navbar_font_size                    = x_get_option( 'x_navbar_font_size' );
$x_navbar_link_color                   = x_post_css_value( x_get_option( 'x_navbar_link_color' ), 'color' );
$x_navbar_link_color_hover             = x_post_css_value( x_get_option( 'x_navbar_link_color_hover' ), 'color' );
$x_navbar_letter_spacing               = x_get_option( 'x_navbar_letter_spacing' );

if ( x_get_option( 'x_enable_font_manager' ) ) {

  $x_body_font_is_italic     = x_get_option( 'x_body_font_italic' );
  $x_headings_font_is_italic = x_get_option( 'x_headings_font_italic' );
  $x_logo_font_is_italic     = x_get_option( 'x_logo_font_italic' );
  $x_navbar_font_is_italic   = x_get_option( 'x_navbar_font_italic' );

  $x_body_font_weight     = x_post_css_value( x_get_option( 'x_body_font_weight_selection' ), 'font-weight');
  $x_headings_font_weight = x_post_css_value( x_get_option( 'x_headings_font_weight_selection' ), 'font-weight');
  $x_logo_font_weight     = x_post_css_value( x_get_option( 'x_logo_font_weight_selection' ), 'font-weight');
  $x_navbar_font_weight   = x_post_css_value( x_get_option( 'x_navbar_font_weight_selection' ), 'font-weight');

  $x_body_font_stack     = x_post_css_value( x_get_option( 'x_body_font_family_selection' ), 'font-family');
  $x_headings_font_stack = x_post_css_value( x_get_option( 'x_headings_font_family_selection' ), 'font-family');
  $x_logo_font_stack     = x_post_css_value( x_get_option( 'x_logo_font_family_selection' ), 'font-family');
  $x_navbar_font_stack   = x_post_css_value( x_get_option( 'x_navbar_font_family_selection' ), 'font-family');

} else {

  //
  // 1. Load font options
  // 2. Check if fonts are italic.
  // 3. Remove 'italic' from setting output if it exists to provide us with just
  //    the weight to work with.
  // 4. Get the font stack.
  //

  $x_body_font_family                    = x_get_option( 'x_body_font_family' );
  $x_body_font_weight_and_style          = x_get_option( 'x_body_font_weight' );
  $x_headings_font_family                = x_get_option( 'x_headings_font_family' );
  $x_headings_font_weight_and_style      = x_get_option( 'x_headings_font_weight' );
  $x_navbar_font_family                  = x_get_option( 'x_navbar_font_family' );
  $x_navbar_font_weight_and_style        = x_get_option( 'x_navbar_font_weight' );

  $x_body_font_is_italic                 = x_is_font_italic( $x_body_font_weight_and_style );
  $x_headings_font_is_italic             = x_is_font_italic( $x_headings_font_weight_and_style );
  $x_logo_font_is_italic                 = x_is_font_italic( $x_logo_font_weight_and_style );
  $x_navbar_font_is_italic               = x_is_font_italic( $x_navbar_font_weight_and_style );

  $x_body_font_weight                    = x_get_font_weight( $x_body_font_weight_and_style );
  $x_headings_font_weight                = x_get_font_weight( $x_headings_font_weight_and_style );
  $x_logo_font_weight                    = x_get_font_weight( $x_logo_font_weight_and_style );
  $x_navbar_font_weight                  = x_get_font_weight( $x_navbar_font_weight_and_style );

  $x_body_font_stack                     = x_get_font_data( $x_body_font_family, 'stack' );
  $x_headings_font_stack                 = x_get_font_data( $x_headings_font_family, 'stack' );
  $x_logo_font_stack                     = x_get_font_data( $x_logo_font_family, 'stack' );
  $x_navbar_font_stack                   = x_get_font_data( $x_navbar_font_family, 'stack' );

}



// Buttons
// =============================================================================

$x_button_style                        = x_get_option( 'x_button_style' );
$x_button_shape                        = x_get_option( 'x_button_shape' );
$x_button_size                         = x_get_option( 'x_button_size' );
$x_button_color                        = x_post_css_value( x_get_option( 'x_button_color' ), 'color' );
$x_button_background_color             = x_post_css_value( x_get_option( 'x_button_background_color' ), 'color' );
$x_button_border_color                 = x_post_css_value( x_get_option( 'x_button_border_color' ), 'color' );
$x_button_bottom_color                 = x_post_css_value( x_get_option( 'x_button_bottom_color' ), 'color' );
$x_button_color_hover                  = x_post_css_value( x_get_option( 'x_button_color_hover' ), 'color' );
$x_button_background_color_hover       = x_post_css_value( x_get_option( 'x_button_background_color_hover' ), 'color' );
$x_button_border_color_hover           = x_post_css_value( x_get_option( 'x_button_border_color_hover' ), 'color' );
$x_button_bottom_color_hover           = x_post_css_value( x_get_option( 'x_button_bottom_color_hover' ), 'color' );

?>
