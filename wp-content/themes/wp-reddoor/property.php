<?php
/**
 * Property Default Template for Single Property View
 *
 * Overwrite by creating your own in the theme directory called either:
 * property.php
 * or add the property type to the end to customize further, example:
 * property-building.php or property-floorplan.php, etc.
 *
 * By default the system will look for file with property type suffix first,
 * if none found, will default to: property.php
 *
 * Copyright 2010 Andy Potanin <andy.potanin@twincitiestech.com>
 *
 * @version 1.3
 * @author Andy Potanin <andy.potnain@twincitiestech.com>
 * @package WP-Property
*/

?>

<?php get_header(); ?>


<?php
$property = prepare_property_for_display( get_the_ID() );
// Start the Loop.
while ( have_posts() ) : the_post();

?>

  <div class="container-fluid ftrdImgGoTop">
      <section>
        <?php if( function_exists('ud_get_wpp_resp_slideshow') ){ ?>
         <?php echo do_shortcode('[property_responsive_slideshow]'); ?>
      <?php } else { ?>
          <div class="slideshowHeadImage" style="background-image: url('<?php echo get_the_post_thumbnail_url(); ?>')"></div>
        <?php } ?>
      </section>
      <section class="singlePropertyHeader">
        <div class="container">
          <div class="title">
            <span>Active</span>
            <div>5000 Davitson Ct<span>Parkland, FL 33076</span></div>
            <b class="clear"></b>
          </div>
          <ul>
            <li>$ <?php echo $property['price'] ?></li>
            <li><?php print_r($property['beds']); echo ' '; _e('Beds'); ?></li>
            <li><?php print_r($property['baths']); echo ' '; _e('Baths'); ?></li>
            <li><?php print_r($property['apartment_area']); echo ' '; _e('Sq.ft'); ?></li>
            <li><?php print_r($property['ground_area']); echo ' '; _e('acres'); ?></li>
          </ul>
        </div>
      </section>
  </div>


<?php endwhile; ?>


<?php get_footer(); ?>