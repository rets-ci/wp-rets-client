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
</div><!-- Container -->

<div class="container-fluind footerBg1">
<div class="container">
    <div class="row">
        <div class="col-md-4 col-lg-4">
        <?php if (!function_exists('dynamic_sidebar') || !dynamic_sidebar('Footer area 1')) : ?>
            [ do default stuff if no widgets ]
        <?php endif; ?>
        </div>
        <div class="col-md-4 col-lg-4">
        <?php if (!function_exists('dynamic_sidebar') || !dynamic_sidebar('Footer area 2')) : ?>
            [ do default stuff if no widgets ]
        <?php endif; ?>
        </div>
        <div class="col-md-4 col-lg-4">
        <?php if (!function_exists('dynamic_sidebar') || !dynamic_sidebar('Footer area 3')) : ?>
            [ do default stuff if no widgets ]
        <?php endif; ?>
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
