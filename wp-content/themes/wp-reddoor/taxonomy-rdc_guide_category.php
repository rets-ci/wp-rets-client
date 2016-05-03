<?php
/**
 * Guide Category Page
 *
 * - Shows a random placeholder image on the left side, fixed
 * - Shows second-level category titles and their articles on right side, with another random image
 *
 * @todo make sure https://www.reddoorcompany.com/guides/home-buyers/assembling-your-real-estate-team redirects to parent
 */

$_term  = rdc_get_guide_category();
$_all_categories = rdc_generate_guide_overview();
$_this_category = null;

// iterate over all categories to find the one we're currently viewing
foreach( $_all_categories as $_maybe_this_category ) {
  if( isset( $_maybe_this_category['term_id'] ) && isset( $_term ) && is_object( $_term ) && $_maybe_this_category['term_id'] === $_term->term_id)  {
    $_this_category = $_maybe_this_category;
  }
}

$_this_category_guides = rdc_generate_guide_overview( array( 'parent' => ( is_object( $_term ) ? $_term->term_id : null ) ) );

// Try to detect a second-level child Guide category and redirect to parent if possible.
if( empty( $_this_category_guides ) && isset( $_term->parent ) && $_term->parent ) {
  wp_redirect( get_term_link( $_term->parent, 'rdc_guide_category' ) );
  die();
}

//die( '<pre>' . print_r( $_all_categories, true ) . '</pre>' );
?>
<?php get_header(''); ?>
<div class="container-fluid guide-wrapper">
  <div class="row site-content">

    <div class="col-md-6 guide-block" style="background-image: linear-gradient(rgba(90, 89, 92, 0.4),rgba(90, 89, 92, 0.4)), url('<?php echo $_this_category['image']; ?>');">
      <div class="guide-block-inner">
        <h2 class="guide-title"><?php echo $_this_category['name']; ?></h2>
        <p class="guide-description"><?php echo $_this_category['description']; ?></p>
      </div>
    </div>

    <div class="col-md-6 guide-overview-list">
      <?php foreach( $_this_category_guides as $_some_guide ) { ?>
        <div class="guide-group-wrapper">

          <div class="row">

              <div class="col-md-8">
                <div class="guide-group-inner-wrapper">
                  <h3 class="guide-group-title"><?php echo $_some_guide[ 'name' ]; ?></h3>

                  <ul class="guide-list">
                  <?php foreach( $_some_guide['posts'] as $_single_post ) { ?>
                    <li><a href="<?php echo get_permalink( $_single_post['ID'] ); ?>"><?php echo $_single_post['title']; ?></a></li>
                  <?php } ?>
                  </ul>

                </div>

              </div>

              <div class="col-md-4 guide-group-image" style="background-image: linear-gradient(rgba(90, 89, 92, 0.4),rgba(90, 89, 92, 0.4)), url('<?php echo $_some_guide['image']; ?>');"></div>

          </div>

        </div>
      <?php } ?>
    </div>

  </div>
</div>
<?php get_footer('guide'); ?>