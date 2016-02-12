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
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/footer-logo.png" alt="" />
                <p>2530 Meridian Pkwy #300,
                Durham, NC 27713, USA</p>
                <a href="#">Contact Us</a>
            </div>
        </div>
        <div class="col-md-4 col-lg-4">
        <?php //if (!dynamic_sidebar('Footer area 2')) : ?>
            <!-- [ do default stuff if no widgets ] -->
        <?php //endif; ?>
            <div class="footerWidgetArea2">
                <h3>About Us</h3>
                <div>
                    Red Door Company was created in 2006
                    to make owning investment real estate
                    easy and profitable. Simply put, we provide
                    the best property management service in
                    the business. How do we do it?
                </div>
                <span>In Association with</span><br/>
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/partner1.png" alt="" />
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/partner2.png" alt="" />
                <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/partner3.png" alt="" />
            </div>
        </div>
        <div class="col-md-4 col-lg-4">
        <?php //if (!dynamic_sidebar('Footer area 3')) : ?>
            <!-- [ do default stuff if no widgets ] -->
        <?php //endif; ?>
            <div class="footerWidgetArea3">
                <h3>Latest Blogs</h3>
                <ul>
                    <li>
                        <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/sliderFootImg.png" alt="" />
                        <a href="#">How to Make Your Small Space Work for You</a>
                        <div>Posted on <span>20 Aug 2015</span></div>
                    </li>
                </ul>
            </div>
        </div>



    </div>
</div>
</div>
<div class="container-fluind footerBg2">
    <div class="container">
        <div class="row">
            <?php wp_nav_menu(array('menu' => 'Footer menu')); ?>
        </div>
    </div>
</div>

<?php wp_footer(); ?>


</body>
</html>
