<?php
/**
 * The main template file.
 * @package
 * @subpackage Wp-reddoor
 * @since Wp-reddoor 1.0
 */
get_header(); ?>

<?php get_template_part('templates/page-header'); ?>
<div class="container">
  <div class="row site-content">
    <?php while (have_posts()) : the_post(); ?>
      <?php get_template_part('templates/content-main'); ?>
      <?php //comments_template( '', true ); ?>
    <?php endwhile; // end of the loop. ?>
  </div><!-- .row -->
</div>


<?php get_footer(); ?>
