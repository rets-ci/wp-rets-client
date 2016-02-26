<?php
/* Template Name: Single-Property */

get_header(); ?>

<div class="container-fluid">
  <div class="row">

  </div>
</div>

<div class="container">
  <div class="row">
    <div class="col-lg-12">
      <article class="content">
        <?php
        // Start the Loop.
        while ( have_posts() ) : the_post();
          the_content();

        endwhile; ?>
      </article>
    </div>
  </div>

</div>


<?php get_footer(); ?>
