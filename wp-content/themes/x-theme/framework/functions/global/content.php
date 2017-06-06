<?php

// =============================================================================
// FUNCTIONS/GLOBAL/CONTENT.PHP
// -----------------------------------------------------------------------------
// Functions pertaining to content output.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Alternate Title
//   02. Link Pages
//   03. Excerpt Length
//   04. Excerpt More String
//   05. Content More String
//   06. Entry Navigation
//   07. Does Not Need Entry Meta
//   08. Scroll Top Anchor
//   09. Legacy Header Widget Areas
//   10. Legacy Slider Below with New Masthead
//   11. Legacy Slider Above with New Masthead
// =============================================================================

// Alternate Title
// =============================================================================

if ( ! function_exists( 'x_the_alternate_title' ) ) :
  function x_the_alternate_title() {

    $meta  = get_post_meta( get_the_ID(), '_x_entry_alternate_index_title', true );
    $title = ( $meta != '' ) ? $meta : get_the_title();

    echo $title;

  }
endif;



// Link Pages
// =============================================================================

if ( ! function_exists( 'x_link_pages' ) ) :
  function x_link_pages() {

    wp_link_pages( array(
      'before' => '<div class="page-links">' . __( 'Pages:', '__x__' ),
      'after'  => '</div>'
    ) );

  }
endif;



// Excerpt Length
// =============================================================================

if ( ! function_exists( 'x_excerpt_length' ) ) :
  function x_excerpt_length( $length ) {

    return x_get_option( 'x_blog_excerpt_length' );

  }
  add_filter( 'excerpt_length', 'x_excerpt_length' );
endif;



// Excerpt More String
// =============================================================================

if ( ! function_exists( 'x_excerpt_string' ) ) :
  function x_excerpt_string( $more ) {
    
    $stack = x_get_stack();

    if ( $stack == 'integrity' ) {
      return ' ... <div><a href="' . get_permalink() . '" class="more-link">' . __( 'Read More', '__x__' ) . '</a></div>';
    } else if ( $stack == 'renew' ) {
      return ' ... <a href="' . get_permalink() . '" class="more-link">' . __( 'Read More', '__x__' ) . '</a>';
    } else if ( $stack == 'icon' ) {
      return ' ...';
    } else if ( $stack == 'ethos' ) {
      return ' ...';
    }

  }
  add_filter( 'excerpt_more', 'x_excerpt_string' );
endif;



// Content More String
// =============================================================================

if ( ! function_exists( 'x_content_string' ) ) :
  function x_content_string( $more ) {

    return '<a href="' . get_permalink() . '" class="more-link">' . __( 'Read More', '__x__' ) . '</a>';

  }
  add_filter( 'the_content_more_link', 'x_content_string' );
endif;



// Entry Navigation
// =============================================================================

if ( ! function_exists( 'x_entry_navigation' ) ) :
  function x_entry_navigation() {

  $stack = x_get_stack();

  if ( $stack == 'ethos' ) {
    $left_icon  = '<i class="x-icon-chevron-left" data-x-icon="&#xf053;"></i>';
    $right_icon = '<i class="x-icon-chevron-right" data-x-icon="&#xf054;"></i>';
  } else {
    $left_icon  = '<i class="x-icon-arrow-left" data-x-icon="&#xf060;"></i>';
    $right_icon = '<i class="x-icon-arrow-right" data-x-icon="&#xf061;"></i>';
  }

  $is_ltr    = ! is_rtl();
  $prev_post = get_adjacent_post( false, '', false );
  $next_post = get_adjacent_post( false, '', true );
  $prev_icon = ( $is_ltr ) ? $left_icon : $right_icon;
  $next_icon = ( $is_ltr ) ? $right_icon : $left_icon;

  ?>

  <div class="x-nav-articles">

    <?php if ( $prev_post ) : ?>
      <a href="<?php echo get_permalink( $prev_post ); ?>" title="<?php __( 'Previous Post', '__x__' ); ?>" class="prev">
        <?php echo $prev_icon; ?>
      </a>
    <?php endif; ?>

    <?php if ( $next_post ) : ?>
      <a href="<?php echo get_permalink( $next_post ); ?>" title="<?php __( 'Next Post', '__x__' ); ?>" class="next">
        <?php echo $next_icon; ?>
      </a>
    <?php endif; ?>

  </div>

  <?php

  }
endif;



// Does Not Need Entry Meta
// =============================================================================

//
// Returns true if a condition is met where displaying the entry meta data is
// not desirable.
//

if ( ! function_exists( 'x_does_not_need_entry_meta' ) ) :
  function x_does_not_need_entry_meta() {

    $post_type           = get_post_type();
    $page_condition      = $post_type == 'page';
    $post_condition      = $post_type == 'post' && x_get_option( 'x_blog_enable_post_meta' ) == '';
    $portfolio_condition = $post_type == 'x-portfolio' && x_get_option( 'x_portfolio_enable_post_meta' ) == '';

    if ( $page_condition || $post_condition || $portfolio_condition ) {
      return true;
    } else {
      return false;
    }

  }
endif;



// Scroll Top Anchor
// =============================================================================

if ( ! function_exists( 'x_scroll_top_anchor' ) ) :
  function x_scroll_top_anchor() {

    if ( x_get_option( 'x_footer_scroll_top_display' ) == '1' ) : ?>

      <a class="x-scroll-top <?php echo x_get_option( 'x_footer_scroll_top_position' ); ?> fade" title="<?php esc_attr_e( 'Back to Top', '__x__' ); ?>">
        <i class="x-icon-angle-up" data-x-icon="&#xf106;"></i>
      </a>

      <script>

      jQuery(document).ready(function($) {

        var windowObj            = $(window);
        var body                 = $('body');
        var bodyOffsetBottom     = windowObj.scrollBottom();             // 1
        var bodyHeightAdjustment = body.height() - bodyOffsetBottom;     // 2
        var bodyHeightAdjusted   = body.height() - bodyHeightAdjustment; // 3
        var scrollTopAnchor      = $('.x-scroll-top');

        function sizingUpdate(){
          var bodyOffsetTop = windowObj.scrollTop();
          if ( bodyOffsetTop > ( bodyHeightAdjusted * <?php echo x_get_option( 'x_footer_scroll_top_display_unit' ) / 100; ?> ) ) {
            scrollTopAnchor.addClass('in');
          } else {
            scrollTopAnchor.removeClass('in');
          }
        }

        windowObj.bind('scroll', sizingUpdate).resize(sizingUpdate);
        sizingUpdate();

        scrollTopAnchor.click(function(){
          $('html, body').animate({ scrollTop: 0 }, 850, 'easeInOutExpo');
          return false;
        });

      });

      </script>

    <?php endif;

  }
  add_action( 'x_after_site_end', 'x_scroll_top_anchor' );
endif;



// Legacy Header Widget Areas
// =============================================================================

if ( ! function_exists( 'x_legacy_header_widget_areas' ) ) :
  function x_legacy_header_widget_areas() {

    $n = x_get_option( 'x_header_widget_areas' );

    if ( ! apply_filters( 'x_legacy_cranium_headers', true ) || $n == 0 || x_is_blank( 3 ) || x_is_blank( 6 ) || x_is_blank( 7 ) || x_is_blank( 8 ) ) {
      return;
    }

    ?>

    <div class="x-widgetbar collapse">
      <div class="x-widgetbar-inner">
        <div class="x-container max width">

          <?php

          $i = 0; while ( $i < $n ) : $i++;

            $last = ( $i == $n ) ? ' last' : '';

            echo '<div class="x-column x-md x-1-' . $n . $last . '">';
              dynamic_sidebar( 'header-' . $i );
            echo '</div>';

          endwhile;

          ?>

        </div>
      </div>
    </div>

    <a href="#" class="x-btn-widgetbar collapsed" data-toggle="collapse" data-target=".x-widgetbar">
      <i class="x-icon-plus-circle" data-x-icon="&#xf055;"><span class="visually-hidden"><?php _e( 'Toggle the Widgetbar', '__x__' ); ?></span></i>
    </a>

    <?php

  }
  add_action( 'x_after_site_end', 'x_legacy_header_widget_areas' );
endif;



// Legacy Slider Below with New Masthead
// =============================================================================

if ( ! function_exists( 'x_legacy_slider_above_with_new_masthead' ) ) :
  function x_legacy_slider_above_with_new_masthead() {
    x_get_view( 'global', '_slider-above' );
  }
  add_action( 'x_before_masthead_begin', 'x_legacy_slider_above_with_new_masthead' );
endif;



// Legacy Slider Above with New Masthead
// =============================================================================

if ( ! function_exists( 'x_legacy_slider_below_with_new_masthead' ) ) :
  function x_legacy_slider_below_with_new_masthead() {
    x_get_view( 'global', '_slider-below' );
  }
  add_action( 'x_after_masthead_end', 'x_legacy_slider_below_with_new_masthead' );
endif;