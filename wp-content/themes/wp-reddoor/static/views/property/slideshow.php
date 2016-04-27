<?php
/**
 * Shows property slideshow/image/google maps street view
 *
 * - we use a pitch of 12 for google street view since we bottom-center the image to show the google logo
 *
 * @author potanin@UD
 */
global $property;

use UsabilityDynamics\WPP\Property_Factory;

// get Property Images for count
$_images = Property_Factory::get_images($property['ID']);

?>
<section class="sp-slideshow-block" data-template="static/views/property/slideshow">

  <?php if( empty( $_images )  && isset( $property['latitude'] ) && isset( $property['longitude'] ) ) { ?>
    <div class="wpp-google-streetview-image" style="background-image: url(<?php echo 'https://maps.googleapis.com/maps/api/streetview?size=1600x300&location=' . $property['latitude'] . ',' . $property['longitude'] . '&pitch=10&key=AIzaSyAry82nr4I2Z57zobDmCkSqAM-vhPmCWss'; ?>)"></div>
  <?php } else { ?>
  <?php if (function_exists('ud_get_wpp_resp_slideshow')) { ?>
    <?php echo do_shortcode('[property_responsive_slideshow slider_type=12grid slideshow_type=standard slideshow_layout=fullwidth slider_width=50% slider_height=660 grid_image_size=thumbnail]'); ?>
  <?php } else { ?>
    <?php if (has_post_thumbnail()) { ?>
      <div class="slideshowHeadImage" style="background-image: url('<?php echo get_the_post_thumbnail_url(); ?>')"></div>
    <?php } else { ?>
      <div class="slideshowHeadImage" style="background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/default_property.JPG')"></div>
    <?php } ?>
  <?php } ?>

  <?php } ?>

  <div class="hero-overlay"></div>
</section>
