<?php
 
// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/CUSTOMIZER/OUTPUT/BASE.PHP
// -----------------------------------------------------------------------------
// Base global CSS output.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. <html>
//   02. <body>
//   03. Headings
//   04. Container Sizing
//   05. Content
//   06. Custom Fonts
//   07. Custom Fonts - Colors
// =============================================================================

?>

/* <html>
// ========================================================================== */

<?php if ( $x_root_font_size_mode == 'stepped' ) : ?>

  html {
    font-size: <?php echo $x_root_font_size_stepped_xs . $x_root_font_size_stepped_unit; ?>;
  }

  @media (min-width: 480px) {
    html {
      font-size: <?php echo $x_root_font_size_stepped_sm . $x_root_font_size_stepped_unit; ?>;
    }
  }

  @media (min-width: 767px) {
    html {
      font-size: <?php echo $x_root_font_size_stepped_md . $x_root_font_size_stepped_unit; ?>;
    }
  }

  @media (min-width: 979px) {
    html {
      font-size: <?php echo $x_root_font_size_stepped_lg . $x_root_font_size_stepped_unit; ?>;
    }
  }

  @media (min-width: 1200px) {
    html {
      font-size: <?php echo $x_root_font_size_stepped_xl . $x_root_font_size_stepped_unit; ?>;
    }
  }

<?php elseif ( $x_root_font_size_mode == 'scaling' ) : ?>

  html {
    font-size: <?php echo $x_root_font_size_scaling_min . $x_root_font_size_scaling_unit; ?>;
  }

  @media (min-width: <?php echo $x_root_font_size_scaling_lower_limit . $x_root_font_size_scaling_unit; ?>) {
    html {
      font-size: calc(<?php echo $x_root_font_size_scaling_min . $x_root_font_size_scaling_unit; ?> + (<?php echo $x_root_font_size_scaling_max; ?> - <?php echo $x_root_font_size_scaling_min; ?>) * ((100vw - <?php echo $x_root_font_size_scaling_lower_limit . $x_root_font_size_scaling_unit; ?>) / (<?php echo $x_root_font_size_scaling_upper_limit; ?> - <?php echo $x_root_font_size_scaling_lower_limit; ?>)));
    }
  }

  @media (min-width: <?php echo $x_root_font_size_scaling_upper_limit . $x_root_font_size_scaling_unit; ?>) {
    html {
      font-size: <?php echo $x_root_font_size_scaling_max . $x_root_font_size_scaling_unit; ?>;
    }
  }

<?php endif; ?>



/* <body>
// ========================================================================== */

body {
  font-style: <?php echo ( $x_body_font_is_italic ) ? 'italic' : 'normal'; ?>;
  font-weight: <?php echo $x_body_font_weight; ?>;
  color: <?php echo $x_body_font_color; ?>;
  <?php if ( $x_design_bg_image_pattern == '' ) : ?>
    background-color: <?php echo $x_design_bg_color; ?>;
  <?php else : ?>
    background: <?php echo $x_design_bg_color; ?> url(<?php echo x_make_protocol_relative( $x_design_bg_image_pattern ); ?>) center top repeat;
  <?php endif; ?>
}

.w-b {
  font-weight: <?php echo $x_body_font_weight; ?> !important;
}



/* Headings
// ========================================================================== */

h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6 {
  font-family: <?php echo $x_headings_font_stack; ?>;
  font-style: <?php echo ( $x_headings_font_is_italic ) ? 'italic' : 'normal'; ?>;
  font-weight: <?php echo $x_headings_font_weight; ?>;
  <?php if ( $x_headings_uppercase_enable == '1' ) : ?>
    text-transform: uppercase;
  <?php endif; ?>
}

h1, .h1 {
  letter-spacing: <?php echo $x_h1_letter_spacing . 'em'; ?>;
}

h2, .h2 {
  letter-spacing: <?php echo $x_h2_letter_spacing . 'em'; ?>;
}

h3, .h3 {
  letter-spacing: <?php echo $x_h3_letter_spacing . 'em'; ?>;
}

h4, .h4 {
  letter-spacing: <?php echo $x_h4_letter_spacing . 'em'; ?>;
}

h5, .h5 {
  letter-spacing: <?php echo $x_h5_letter_spacing . 'em'; ?>;
}

h6, .h6 {
  letter-spacing: <?php echo $x_h6_letter_spacing . 'em'; ?>;
}

.w-h {
  font-weight: <?php echo $x_headings_font_weight; ?> !important;
}



/* Container Sizing
// ========================================================================== */

.x-container.width {
  width: <?php echo $x_layout_site_width . '%'; ?>;
}

.x-container.max {
  max-width: <?php echo $x_layout_site_max_width . 'px'; ?>;
}

<?php if ( $x_layout_site == 'boxed' ) : ?>

  .site,
  .x-site {
    width: <?php echo $x_layout_site_width . '%'; ?>;
    max-width: <?php echo $x_layout_site_max_width . 'px'; ?>;
  }

<?php endif; ?>



/* Content
// ========================================================================== */

.x-main.full {
  float: none;
  display: block;
  width: auto;
}

@media (max-width: 979px) {
  .x-main.full,
  .x-main.left,
  .x-main.right,
  .x-sidebar.left,
  .x-sidebar.right {
    float: none;
    display: block;
    width: auto !important;
  }
}

.entry-header,
.entry-content {
  font-size: <?php echo $x_content_font_size_rem . 'rem'; ?>;
}



/* Custom Fonts
// ========================================================================== */

body,
input,
button,
select,
textarea {
  font-family: <?php echo $x_body_font_stack; ?>;
}



/* Custom Fonts - Colors
// ========================================================================== */

/*
// Headings.
*/

h1, h2, h3, h4, h5, h6, .h1, .h2, .h3, .h4, .h5, .h6, h1 a, h2 a, h3 a, h4 a, h5 a, h6 a, .h1 a, .h2 a, .h3 a, .h4 a, .h5 a, .h6 a, blockquote {
  color: <?php echo $x_headings_font_color; ?>;
}

.cfc-h-tx { color:            <?php echo $x_headings_font_color; ?> !important; }
.cfc-h-bd { border-color:     <?php echo $x_headings_font_color; ?> !important; }
.cfc-h-bg { background-color: <?php echo $x_headings_font_color; ?> !important; }


/*
// Body.
*/

.cfc-b-tx { color:            <?php echo $x_body_font_color; ?> !important; }
.cfc-b-bd { border-color:     <?php echo $x_body_font_color; ?> !important; }
.cfc-b-bg { background-color: <?php echo $x_body_font_color; ?> !important; }