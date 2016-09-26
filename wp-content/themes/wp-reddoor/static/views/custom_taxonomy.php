<?php
/**
 * New Single taxonomy template.
 * Used for custom permalinks results.
 */

global $wp_query;
$query = implode($atts, ' ');
//print_r($query);
get_header(); ?>

  <div class="container-fluid upToHeader">
    <div class="row">
      <?php echo do_shortcode("[supermap mode=advanced get_listings=false per_page=30 {$query}]"); ?>
    </div><!-- .row -->
  </div>


<?php get_footer(); ?>