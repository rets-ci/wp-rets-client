<?php
/*
Template Name: Full-width
*/

get_header(); ?>
  <div class="container-fluid full-width-totop">
    <div class="row site-content">
      <?php while (have_posts()) : the_post(); ?>
        <?php
          the_content();
        ?>
      <?php endwhile; // end of the loop. ?>
    </div><!-- .row -->
  </div>

<?php get_footer(); ?>