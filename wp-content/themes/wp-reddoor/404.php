<?php get_header(); ?>

<div class="container-fluid upToHeader page404">
  <div class="row no-padding">
    <?php
    global $wp_query;

    if ($wp_query->is_404) {

      // its a "draft"
      $the_query = new WP_Query(array('page_id' => '5573968', 'post_status' => 'draft'));

      if ($the_query->have_posts()) : while ($the_query->have_posts()) : $the_query->the_post();

        global $post;
        echo '<pre>';
        print_r($post);
        echo '</pre>';

        the_content();
      endwhile; endif;

      wp_reset_query();

    }

    ?>
  </div>
</div>


<?php get_footer(); ?>

