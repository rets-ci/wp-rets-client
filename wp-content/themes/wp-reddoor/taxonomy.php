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
      <?php echo do_shortcode("[supermap mode=advanced per_page=30 sale_type=Sale,Rent {$tax_args}]"); ?>
    </div><!-- .row -->
  </div>

  <?php

    if(isset($_REQUEST['wpp_search']) && isset($_REQUEST['wpp_search']['sale_type'])){
      if($_REQUEST['wpp_search']['sale_type'] == 'Rent'){
        ?>
          <script type="text/javascript">
            jQuery(document).ready(function(){
              jQuery( '#menu-header li' ).removeClass( 'current-menu-item' );
              jQuery( '.rentBtnForm' ).addClass( 'current-menu-item' );
            })
          </script>
        <?php
      }
    }
  ?>


<?php get_footer(); ?>