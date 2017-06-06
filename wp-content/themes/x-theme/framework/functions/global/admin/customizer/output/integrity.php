<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/CUSTOMIZER/OUTPUT/INTEGRITY.PHP
// -----------------------------------------------------------------------------
// Integrity CSS ouptut.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Site Link Color Accents
//   02. Layout Sizing
//   03. Footer
//   04. Custom Fonts
//   05. Custom Fonts - Colors
//   06. Responsive Styling
// =============================================================================

?>

/* Site Link Color Accents
// ========================================================================== */

/*
// Color.
*/

a,
h1 a:hover,
h2 a:hover,
h3 a:hover,
h4 a:hover,
h5 a:hover,
h6 a:hover,
.x-breadcrumb-wrap a:hover,
.widget ul li a:hover,
.widget ol li a:hover,
.widget.widget_text ul li a,
.widget.widget_text ol li a,
.widget_nav_menu .current-menu-item > a,
.x-accordion-heading .x-accordion-toggle:hover,
.x-comment-author a:hover,
.x-comment-time:hover,
.x-recent-posts a:hover .h-recent-posts {
  color: <?php echo $x_site_link_color; ?>;
}

a:hover,
.widget.widget_text ul li a:hover,
.widget.widget_text ol li a:hover,
.x-twitter-widget ul li a:hover {
  color: <?php echo $x_site_link_color_hover; ?>;
}

<?php if ( X_WOOCOMMERCE_IS_ACTIVE ) : ?>

  .woocommerce .price > .amount,
  .woocommerce .price > ins > .amount,
  .woocommerce .star-rating:before,
  .woocommerce .star-rating span:before,
  .woocommerce li.product .entry-header h3 a:hover {
    color: <?php echo $x_site_link_color; ?>;
  }

<?php endif; ?>


/*
// Border color.
*/

.rev_slider_wrapper,
a.x-img-thumbnail:hover,
.x-slider-container.below,
.page-template-template-blank-3-php .x-slider-container.above,
.page-template-template-blank-6-php .x-slider-container.above {
  border-color: <?php echo $x_site_link_color; ?>;
}


/*
// Background color.
*/

.entry-thumb:before,
.x-pagination span.current,
.flex-direction-nav a,
.flex-control-nav a:hover,
.flex-control-nav a.flex-active,
.mejs-time-current,
.x-dropcap,
.x-skill-bar .bar,
.x-pricing-column.featured h2,
.h-comments-title small,
.x-entry-share .x-share:hover,
.x-highlight,
.x-recent-posts .x-recent-posts-img:after {
  background-color: <?php echo $x_site_link_color; ?>;
}

<?php if ( X_WOOCOMMERCE_IS_ACTIVE ) : ?>

  .woocommerce .onsale,
  .widget_price_filter .ui-slider .ui-slider-range {
    background-color: <?php echo $x_site_link_color; ?>;
  }

<?php endif; ?>


/*
// Box shadow.
*/

.x-nav-tabs > .active > a,
.x-nav-tabs > .active > a:hover {
  box-shadow: inset 0 3px 0 0 <?php echo $x_site_link_color; ?>;
}



/* Layout Sizing
// ========================================================================== */

.x-main {
  width: <?php echo $x_layout_content_width - 2.463055 . '%'; ?>;
}

.x-sidebar {
  width: <?php echo 100 - 2.463055 - $x_layout_content_width . '%'; ?>;
}



/* Custom Fonts
// ========================================================================== */

.x-comment-author,
.x-comment-time,
.comment-form-author label,
.comment-form-email label,
.comment-form-url label,
.comment-form-rating label,
.comment-form-comment label,
.widget_calendar #wp-calendar caption,
.widget.widget_rss li .rsswidget {
font-family: <?php echo $x_headings_font_stack; ?>;
font-weight: <?php echo $x_headings_font_weight; ?>;
<?php if ( $x_headings_font_is_italic ) : ?>
  font-style: italic;
<?php endif; ?>
<?php if ( $x_headings_uppercase_enable == 1 ) : ?>
  text-transform: uppercase;
<?php endif; ?>
}

.p-landmark-sub,
.p-meta,
input,
button,
select,
textarea {
  font-family: <?php echo $x_body_font_stack; ?>;
}



/* Custom Fonts - Colors
// ========================================================================== */

/*
// Body.
*/

.widget ul li a,
.widget ol li a,
.x-comment-time {
  color: <?php echo $x_body_font_color; ?>;
}

<?php if ( X_WOOCOMMERCE_IS_ACTIVE ) : ?>

  .woocommerce .price > .from,
  .woocommerce .price > del,
  .woocommerce p.stars span a:after {
    color: <?php echo $x_body_font_color; ?>;
  }

<?php endif; ?>

.widget_text ol li a,
.widget_text ul li a {
  color: <?php echo $x_site_link_color; ?>;
}

.widget_text ol li a:hover,
.widget_text ul li a:hover {
  color: <?php echo $x_site_link_color_hover; ?>;
}


/*
// Headings.
*/

.comment-form-author label,
.comment-form-email label,
.comment-form-url label,
.comment-form-rating label,
.comment-form-comment label,
.widget_calendar #wp-calendar th,
.p-landmark-sub strong,
.widget_tag_cloud .tagcloud a:hover,
.widget_tag_cloud .tagcloud a:active,
.entry-footer a:hover,
.entry-footer a:active,
.x-breadcrumbs .current,
.x-comment-author,
.x-comment-author a {
  color: <?php echo $x_headings_font_color; ?>;
}

.widget_calendar #wp-calendar th {
  border-color: <?php echo $x_headings_font_color; ?>;
}

.h-feature-headline span i {
  background-color: <?php echo $x_headings_font_color; ?>;
}



/* Responsive Styling
// ========================================================================== */

@media (max-width: 979px) {



}
