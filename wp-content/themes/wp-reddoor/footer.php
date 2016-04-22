<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the "site-content" div and all content after.
 *
 * @package WordPress
 * @subpackage Twenty_Fifteen
 * @since Twenty Fifteen 1.0
 */
?>

<div class="container-fluind footerBg1">
<div class="container">
    <div class="row">
        <div class="col-md-4 col-lg-4">
            <div class="footerWidgetArea1">
                <?php if( !dynamic_sidebar( 'Footer area 1' ) ) : ?>
                  <p><?php _e( 'No widgets for display' ); ?></p>
                <?php endif; ?>
            </div>
        </div>
        <div class="col-md-4 col-lg-4">
            <div class="footerWidgetArea2">
                <?php if( !dynamic_sidebar( 'Footer area 2' ) ) : ?>
                  <p><?php _e( 'No widgets for display' ); ?></p>
                <?php endif; ?>
              <span>In Association with</span><br/>
              <?php
              $args = array(
                'posts_per_page' => 3,
                'orderby' => 'post_date',
                'order' => 'ASC',
                'post_type' => 'associations',
                'post_status' => 'publish',
                'suppress_filters' => true );
              $query = new WP_Query( $args );
              while( $query->have_posts() ) : $query->the_post();
                global $post;
                echo get_the_post_thumbnail( $post->ID, 'footer_association' );
              endwhile;
              ?>
            </div>
        </div>
        <div class="col-md-4 col-lg-4">
            <div class="footerWidgetArea3">
                <?php if( !dynamic_sidebar( 'Footer area 3' ) ) : ?>
                  <p><?php _e( 'No widgets for display' ); ?></p>
                <?php endif; ?>
            </div>
        </div>
    </div>
</div>
</div>
<div class="container-fluind footerBg2">
    <div class="container">
        <div class="row">
            <div class="col-lg-10">
                <?php wp_nav_menu( array( 'menu' => 'Footer menu' ) ); ?>
            </div>
            <div class="col-lg-2">
                <?php wp_nav_menu( array( 'menu' => 'Social Footer Menu', 'menu_class' => 'socialFooterMenu' ) ); ?>
            </div>
        </div>
    </div>
</div>

<?php get_template_part( 'static/views/popups' ) ?>

<?php wp_footer(); ?>
</body>
</html>
