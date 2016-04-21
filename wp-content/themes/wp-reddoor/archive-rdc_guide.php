<?php
/**
 * Archive Page for Guide post type
 */
get_header('guide'); ?>
  <div class="container-fluid">
    <div class="row site-content">
      <?php while (have_posts()) : the_post(); ?>
        <?php
          the_content();
        ?>
      <?php endwhile; // end of the loop. ?>
    </div><!-- .row -->
  </div>


<?php get_footer('guide'); ?>