<?php
/**
 * Guide Category Page
 *
 * - Shows a random placeholder image on the left side, fixed
 * - Shows second-level category titles and their articles on right side, with another random image
 *
 * @todo make sure https://www.reddoorcompany.com/guides/home-buyers/assembling-your-real-estate-team redirects to parent
 */

global $wp_query;
$_rdc_guide_category = $wp_query->query_vars['rdc_guide_category'];
$_term = get_term_by( 'slug', $_rdc_guide_category, 'rdc_guide_category' );
$_all_categories = rdc_generate_guide_overview();
$_this_category = null;

// iterate over all categories to find the one we're currently viewing
foreach( $_all_categories as $_maybe_this_category ) {
  if( isset( $_maybe_this_category['term_id'] ) && isset( $_term ) && is_object( $_term ) && $_maybe_this_category['term_id'] === $_term->term_id)  {
    $_this_category = $_maybe_this_category;
  }
}

$_this_category_guides = rdc_generate_guide_overview( array( 'parent' => ( is_object( $_term ) ? $_term->term_id : null ) ) );

// @hack to double number of guides
$_this_category_guides = array_merge( $_this_category_guides, rdc_generate_guide_overview( array( 'parent' => ( is_object( $_term ) ? $_term->term_id : null ) ) ) );

//die( '<pre>' . print_r( $_all_categories, true ) . '</pre>' );
?>
<?php get_header(''); ?>
<div class="container-fluid guide-wrapper">
  <div class="row site-content">

      <div class="col-lg-6 guide-block" style="background-image: url('<?php echo $_this_category['image']; ?>');">
        <h2 class="guide-title"><?php echo $_this_category['name']; ?></h2>
        <p class="guide-description"><?php echo $_this_category['description']; ?></p>
      </div>

      <div class="col-lg-6 guide-overview-list">
        <?php foreach( $_this_category_guides as $_some_guide ) { ?>
          <div class="guide-group-wrapper">

            <div class="row">

                <div class="col-lg-8">
                  <div class="guide-group-wrapper">
                    <h3 class="guide-group-title"><?php echo $_some_guide[ 'name' ]; ?></h3>
  
                    <ul class="guide-list">
                    <?php foreach( $_some_guide['posts'] as $_single_post ) { ?>
                      <li><a href="<?php echo get_permalink( $_single_post['ID'] ); ?>"><?php echo $_single_post['title']; ?></a></li>
                    <?php } ?>
                    </ul>
                      
                  </div>

                </div>

                <div class="col-lg-4">
                  <img src="<?php echo $_some_guide['thumbnail']; ?>" class="guide-group-image"/>
                </div>

            </div>

          </div>
        <?php } ?>
      </div>

    </div>

  </div>
</div>
<?php get_footer('guide'); ?>