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
                <?php if (!dynamic_sidebar('Footer area 1')) : ?>
                [ do default stuff if no widgets ]
                <?php endif; ?>
                <a href="#">Contact Us</a>
            </div>
        </div>
        <div class="col-md-4 col-lg-4">
            <div class="footerWidgetArea2">
                <?php if (!dynamic_sidebar('Footer area 2')) : ?>
                    [ do default stuff if no widgets ]
                <?php endif; ?>
                <span>In Association with</span><br/>
                <?php
                $args = array(
                  'posts_per_page'  => 3,
                  'orderby'         => 'post_date',
                  'order'           => 'ASC',
                  'post_type'       => 'associations',
                  'post_status'     => 'publish',
                  'suppress_filters' => true );
                $query = new WP_Query($args);
                while ($query->have_posts()) : $query->the_post();
                global $post;
                echo get_the_post_thumbnail($post->ID);
                endwhile;
                ?>
            </div>
        </div>
        <div class="col-md-4 col-lg-4">
            <div class="footerWidgetArea3">
             <!--   <h3>Latest Blogs</h3>
                <ul>
                    <li>
                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/sliderFootImg.png" alt="" />
                        <a href="#">How to Make Your Small Space Work for You</a>
                        <div>Posted on <span>20 Aug 2015</span></div>
                    </li>
                </ul> -->
                <?php if (!dynamic_sidebar('Footer area 3')) : ?>
                    [ do default stuff if no widgets ]
                <?php endif; ?>
            </div>
        </div>
        <?php get_template_part('templates/popups') ?>
    </div>
</div>
</div>
<div class="container-fluind footerBg2">
    <div class="container">
        <div class="row">
            <div class="col-lg-10">
                <?php wp_nav_menu(array('menu' => 'Footer menu')); ?>
            </div>
            <div class="col-lg-2">
                <?php wp_nav_menu(array('menu' => 'Social Footer Menu', 'menu_class' => 'socialFooterMenu')); ?>
            </div>
        </div>
    </div>
</div>

<?php wp_footer(); ?>


</body>
</html>
