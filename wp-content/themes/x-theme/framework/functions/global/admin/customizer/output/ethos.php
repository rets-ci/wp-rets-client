<?php

// =============================================================================
// FUNCTIONS/GLOBAL/ADMIN/CUSTOMIZER/OUTPUT/ETHOS.PHP
// -----------------------------------------------------------------------------
// Ethos CSS ouptut.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Site Link Color Accents
//   02. Layout Sizing
//   03. Design Options
//   04. Post Slider
//   05. Custom Fonts - Colors
//   06. Responsive Styling
// =============================================================================

$x_ethos_sidebar_widget_headings_color = x_post_css_value( x_get_option( 'x_ethos_sidebar_widget_headings_color' ), 'color' );
$x_ethos_sidebar_color                 = x_post_css_value( x_get_option( 'x_ethos_sidebar_color' ), 'color' );
$x_ethos_post_slider_blog_height       = x_get_option( 'x_ethos_post_slider_blog_height' );
$x_ethos_post_slider_archive_height    = x_get_option( 'x_ethos_post_slider_archive_height' );

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
.x-comment-author a:hover,
.x-comment-time:hover,
.p-meta > span > a:hover,
.format-link .link a:hover,
.x-main .widget ul li a:hover,
.x-main .widget ol li a:hover,
.x-main .widget_tag_cloud .tagcloud a:hover,
.x-sidebar .widget ul li a:hover,
.x-sidebar .widget ol li a:hover,
.x-sidebar .widget_tag_cloud .tagcloud a:hover,
.x-portfolio .entry-extra .x-ul-tags li a:hover {
  color: <?php echo $x_site_link_color; ?>;
}

a:hover {
  color: <?php echo $x_site_link_color_hover; ?>;
}

<?php if ( X_WOOCOMMERCE_IS_ACTIVE ) : ?>

  .woocommerce .price > .amount,
  .woocommerce .price > ins > .amount,
  .woocommerce .star-rating:before,
  .woocommerce .star-rating span:before {
    color: <?php echo $x_site_link_color; ?>;
  }

<?php endif; ?>


/*
// Border color.
*/

a.x-img-thumbnail:hover {
  border-color: <?php echo $x_site_link_color; ?>;
}


/*
// Background color.
*/

<?php if ( X_WOOCOMMERCE_IS_ACTIVE ) : ?>

  .woocommerce .onsale,
  .widget_price_filter .ui-slider .ui-slider-range {
    background-color: <?php echo $x_site_link_color; ?>;
  }

<?php endif; ?>



/* Layout Sizing
// ========================================================================== */

/*
// Main structural elements.
*/

.x-main {
  width: <?php echo $x_layout_content_width . '%'; ?>;
}

.x-sidebar {
  width: <?php echo 100 - $x_layout_content_width . '%'; ?>;
}


/*
// Main content background.
*/

.x-post-slider-archive-active .x-container.main:before {
  top: 0;
}

.x-content-sidebar-active .x-container.main:before {
  right: <?php echo 100 - $x_layout_content_width . '%'; ?>;
}

.x-sidebar-content-active .x-container.main:before {
  left: <?php echo 100 - $x_layout_content_width . '%'; ?>;
}

.x-full-width-active .x-container.main:before {
  left: -5000em;
}



/* Design Options
// ========================================================================== */

/*
// Color.
*/

.h-landmark,
.x-main .h-widget,
.x-main .h-widget a.rsswidget,
.x-main .h-widget a.rsswidget:hover,
.x-main .widget.widget_pages .current_page_item a,
.x-main .widget.widget_nav_menu .current-menu-item a,
.x-main .widget.widget_pages .current_page_item a:hover,
.x-main .widget.widget_nav_menu .current-menu-item a:hover,
.x-sidebar .h-widget,
.x-sidebar .h-widget a.rsswidget,
.x-sidebar .h-widget a.rsswidget:hover,
.x-sidebar .widget.widget_pages .current_page_item a,
.x-sidebar .widget.widget_nav_menu .current-menu-item a,
.x-sidebar .widget.widget_pages .current_page_item a:hover,
.x-sidebar .widget.widget_nav_menu .current-menu-item a:hover {
  color: <?php echo $x_ethos_sidebar_widget_headings_color; ?>;
}

.x-main .widget,
.x-main .widget a,
.x-main .widget ul li a,
.x-main .widget ol li a,
.x-main .widget_tag_cloud .tagcloud a,
.x-main .widget_product_tag_cloud .tagcloud a,
.x-main .widget a:hover,
.x-main .widget ul li a:hover,
.x-main .widget ol li a:hover,
.x-main .widget_tag_cloud .tagcloud a:hover,
.x-main .widget_product_tag_cloud .tagcloud a:hover,
.x-main .widget_shopping_cart .buttons .button,
.x-main .widget_price_filter .price_slider_amount .button,
.x-sidebar .widget,
.x-sidebar .widget a,
.x-sidebar .widget ul li a,
.x-sidebar .widget ol li a,
.x-sidebar .widget_tag_cloud .tagcloud a,
.x-sidebar .widget_product_tag_cloud .tagcloud a,
.x-sidebar .widget a:hover,
.x-sidebar .widget ul li a:hover,
.x-sidebar .widget ol li a:hover,
.x-sidebar .widget_tag_cloud .tagcloud a:hover,
.x-sidebar .widget_product_tag_cloud .tagcloud a:hover,
.x-sidebar .widget_shopping_cart .buttons .button,
.x-sidebar .widget_price_filter .price_slider_amount .button {
  color: <?php echo $x_ethos_sidebar_color; ?>;
}


/*
// Border color.
*/

.x-main .h-widget,
.x-main .widget.widget_pages .current_page_item,
.x-main .widget.widget_nav_menu .current-menu-item,
.x-sidebar .h-widget,
.x-sidebar .widget.widget_pages .current_page_item,
.x-sidebar .widget.widget_nav_menu .current-menu-item {
  border-color: <?php echo $x_ethos_sidebar_widget_headings_color; ?>;
}



/* Post Slider
// ========================================================================== */

.x-post-slider {
  height: <?php echo $x_ethos_post_slider_blog_height . 'px'; ?>;
}

.archive .x-post-slider {
  height: <?php echo $x_ethos_post_slider_archive_height . 'px'; ?>;
}

.x-post-slider .x-post-slider-entry {
  padding-bottom: <?php echo $x_ethos_post_slider_blog_height . 'px'; ?>;
}

.archive .x-post-slider .x-post-slider-entry {
  padding-bottom: <?php echo $x_ethos_post_slider_archive_height . 'px'; ?>;
}



/* Custom Fonts - Colors
// ========================================================================== */

/*
// Body.
*/

.format-link .link a,
.x-portfolio .entry-extra .x-ul-tags li a {
  color: <?php echo $x_body_font_color; ?>;
}


/*
// Headings.
*/

.p-meta > span > a,
.x-nav-articles a,
.entry-top-navigation .entry-parent,
.option-set .x-index-filters,
.option-set .x-portfolio-filters,
.option-set .x-index-filters-menu >li >a:hover,
.option-set .x-index-filters-menu >li >a.selected,
.option-set .x-portfolio-filters-menu > li > a:hover,
.option-set .x-portfolio-filters-menu > li > a.selected {
  color: <?php echo $x_headings_font_color; ?>;
}

.x-nav-articles a,
.entry-top-navigation .entry-parent,
.option-set .x-index-filters,
.option-set .x-portfolio-filters,
.option-set .x-index-filters i,
.option-set .x-portfolio-filters i {
  border-color: <?php echo $x_headings_font_color; ?>;
}

.x-nav-articles a:hover,
.entry-top-navigation .entry-parent:hover,
.option-set .x-index-filters:hover i,
.option-set .x-portfolio-filters:hover i {
  background-color: <?php echo $x_headings_font_color; ?>;
}



/* Responsive Styling
// ========================================================================== */

@media (max-width: 979px) {

  .x-content-sidebar-active .x-container.main:before,
  .x-sidebar-content-active .x-container.main:before {
    left: -5000em;
  }

  body .x-main .widget,
  body .x-main .widget a,
  body .x-main .widget a:hover,
  body .x-main .widget ul li a,
  body .x-main .widget ol li a,
  body .x-main .widget ul li a:hover,
  body .x-main .widget ol li a:hover,
  body .x-sidebar .widget,
  body .x-sidebar .widget a,
  body .x-sidebar .widget a:hover,
  body .x-sidebar .widget ul li a,
  body .x-sidebar .widget ol li a,
  body .x-sidebar .widget ul li a:hover,
  body .x-sidebar .widget ol li a:hover {
    color: <?php echo $x_body_font_color; ?>;
  }

  body .x-main .h-widget,
  body .x-main .widget.widget_pages .current_page_item a,
  body .x-main .widget.widget_nav_menu .current-menu-item a,
  body .x-main .widget.widget_pages .current_page_item a:hover,
  body .x-main .widget.widget_nav_menu .current-menu-item a:hover,
  body .x-sidebar .h-widget,
  body .x-sidebar .widget.widget_pages .current_page_item a,
  body .x-sidebar .widget.widget_nav_menu .current-menu-item a,
  body .x-sidebar .widget.widget_pages .current_page_item a:hover,
  body .x-sidebar .widget.widget_nav_menu .current-menu-item a:hover {
    color: <?php echo $x_headings_font_color; ?>;
  }

  body .x-main .h-widget,
  body .x-main .widget.widget_pages .current_page_item,
  body .x-main .widget.widget_nav_menu .current-menu-item,
  body .x-sidebar .h-widget,
  body .x-sidebar .widget.widget_pages .current_page_item,
  body .x-sidebar .widget.widget_nav_menu .current-menu-item {
    border-color: <?php echo $x_headings_font_color; ?>;
  }

}

@media (max-width: 767px) {
  .x-post-slider,
  .archive .x-post-slider {
    height: auto !important;
  }

  .x-post-slider .x-post-slider-entry,
  .archive .x-post-slider .x-post-slider-entry {
    padding-bottom: 65% !important;
  }
}
