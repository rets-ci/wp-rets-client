<?php
/*
Template Name: RDC-Guide
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


<?php wp_footer(); ?>


</body>
</html>