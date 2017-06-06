<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/CUSTOMIZER/OUTPUT/RENEW.PHP
// -----------------------------------------------------------------------------
// Renew CSS ouptut.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Site Link Color Accents
//   02. Layout Sizing
//   03. Custom Fonts
//   04. Custom Fonts - Colors
//   05. Responsive Styling
//   06. Adminbar Styling
// =============================================================================

$x_renew_entry_icon_color               = x_post_css_value( x_get_option( 'x_renew_entry_icon_color' ), 'color' );
$x_renew_entry_icon_position            = x_get_option( 'x_renew_entry_icon_position' );
$x_renew_entry_icon_position_vertical   = x_get_option( 'x_renew_entry_icon_position_vertical' );
$x_renew_entry_icon_position_horizontal = x_get_option( 'x_renew_entry_icon_position_horizontal' );

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
.x-comment-time:hover,
#reply-title small a,
.comment-reply-link:hover,
.x-comment-author a:hover,
.x-recent-posts a:hover .h-recent-posts {
  color: <?php echo $x_site_link_color; ?>;
}

a:hover,
#reply-title small a:hover {
  color: <?php echo $x_site_link_color_hover; ?>;
}

.entry-title:before {
  color: <?php echo $x_renew_entry_icon_color; ?>;
}

<?php if ( X_WOOCOMMERCE_IS_ACTIVE ) : ?>

  .woocommerce .price > .amount,
  .woocommerce .price > ins > .amount,
  .woocommerce li.product .entry-header h3 a:hover,
  .woocommerce .star-rating:before,
  .woocommerce .star-rating span:before {
    color: <?php echo $x_site_link_color; ?>;
  }

<?php endif; ?>


/*
// Border color.
*/

a.x-img-thumbnail:hover,
li.bypostauthor > article.comment {
  border-color: <?php echo $x_site_link_color; ?>;
}

<?php if ( X_WOOCOMMERCE_IS_ACTIVE ) : ?>

  .woocommerce li.comment.bypostauthor .star-rating-container {
    border-color: <?php echo $x_site_link_color; ?> !important;
  }

<?php endif; ?>


/*
// Background color.
*/

.flex-direction-nav a,
.flex-control-nav a:hover,
.flex-control-nav a.flex-active,
.x-dropcap,
.x-skill-bar .bar,
.x-pricing-column.featured h2,
.h-comments-title small,
.x-pagination a:hover,
.x-entry-share .x-share:hover,
.entry-thumb,
.widget_tag_cloud .tagcloud a:hover,
.widget_product_tag_cloud .tagcloud a:hover,
.x-highlight,
.x-recent-posts .x-recent-posts-img:after,
.x-portfolio-filters {
  background-color: <?php echo $x_site_link_color; ?>;
}

.x-portfolio-filters:hover {
  background-color: <?php echo $x_site_link_color_hover; ?>;
}

<?php if ( X_WOOCOMMERCE_IS_ACTIVE ) : ?>

  .woocommerce .onsale,
  .widget_price_filter .ui-slider .ui-slider-range,
  .woocommerce #comments li.comment.bypostauthor article.comment:before {
    background-color: <?php echo $x_site_link_color; ?>;
  }

<?php endif; ?>



/* Layout Sizing
// ========================================================================== */

.x-main {
  width: <?php echo $x_layout_content_width - 3.20197 . '%'; ?>;
}

.x-sidebar {
  width: <?php echo 100 - 3.20197 - $x_layout_content_width . '%'; ?>;
}



/* Custom Fonts
// ========================================================================== */

.h-landmark {
  font-weight: <?php echo $x_body_font_weight; ?>;
  <?php if ( $x_body_font_is_italic ) : ?>
    font-style: italic;
  <?php endif; ?>
}



/* Custom Fonts - Colors
// ========================================================================== */

/*
// Body.
*/

.x-comment-author a {
  color: <?php echo $x_body_font_color; ?>;
}

<?php if ( X_WOOCOMMERCE_IS_ACTIVE ) : ?>

  .woocommerce .price > .from,
  .woocommerce .price > del,
  .woocommerce p.stars span a:after,
  .widget_price_filter .price_slider_amount .button,
  .widget_shopping_cart .buttons .button {
    color: <?php echo $x_body_font_color; ?>;
  }

<?php endif; ?>


/*
// Headings.
*/

.x-comment-author a,
.comment-form-author label,
.comment-form-email label,
.comment-form-url label,
.comment-form-rating label,
.comment-form-comment label,
.widget_calendar #wp-calendar caption,
.widget_calendar #wp-calendar th,
.x-accordion-heading .x-accordion-toggle,
.x-nav-tabs > li > a:hover,
.x-nav-tabs > .active > a,
.x-nav-tabs > .active > a:hover {
  color: <?php echo $x_headings_font_color; ?>;
}

.widget_calendar #wp-calendar th {
  border-bottom-color: <?php echo $x_headings_font_color; ?>;
}

.x-pagination span.current,
.x-portfolio-filters-menu,
.widget_tag_cloud .tagcloud a,
.h-feature-headline span i,
.widget_price_filter .ui-slider .ui-slider-handle {
  background-color: <?php echo $x_headings_font_color; ?>;
}



/* Responsive Styling
// ========================================================================== */

@media (max-width: 979px) {



}


<?php if ( is_home() && $x_renew_entry_icon_position == 'creative' && x_get_option( 'x_blog_style' ) == 'standard'  ) : ?>

  @media (min-width: 980px) {
    .x-full-width-active .entry-title:before,
    .x-content-sidebar-active .entry-title:before {
      position: absolute;
      width: 70px;
      height: 70px;
      margin-top: -<?php echo $x_renew_entry_icon_position_vertical . 'px'; ?>;
      margin-left: -<?php echo $x_renew_entry_icon_position_horizontal . '%'; ?>;
      font-size: 32px;
      font-size: 3.2rem;
      line-height: 70px;
      border-radius: 100em;
    }
  }

<?php endif; ?>
