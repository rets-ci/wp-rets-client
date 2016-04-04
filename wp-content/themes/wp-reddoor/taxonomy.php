<?php
/**
 * Single taxonomy template.
 * Used for search results.
 */

global $wp_query;

$tax_args = array();
foreach( $wp_query->query as $taxonomy => $term ) {
  $tax_args[] = $taxonomy.'='.$term;
}
$tax_args = implode(' ', $tax_args);

get_header(); ?>

  <div class="container-fluid upToHeader">
    <div class="row">
      <?php echo do_shortcode("[supermap mode=advanced {$tax_args} per_page=5]"); ?>
    </div><!-- .row -->
  </div>

<?php get_footer(); ?>