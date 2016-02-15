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
  <div class="row">
    <?php
    // Start the Loop.
    while ( have_posts() ) : the_post();

    ?>
    <div class="col-lg-12">
      <h1 class="singleTitle"><?php the_title(); ?></h1>
      <span class="postedOn">Posted on <?php the_date(); ?></span>
    </div>
    <div class="col-lg-12">
      <article class="content">
      <?php

        the_content();

      endwhile;
      ?>
      </article>
    </div>
  </div>
</div>

<?php get_footer(); ?>
