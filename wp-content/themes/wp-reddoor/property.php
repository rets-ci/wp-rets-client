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

<?php get_header();

global $property;

// Start the Loop.
while (have_posts()) : the_post();
  $get_sale_type_terms = get_the_terms($property['ID'], 'sale_type');
  $get_bedrooms_terms = get_the_terms($property['ID'], 'bedrooms');
  $get_bathrooms_terms = get_the_terms($property['ID'], 'bathrooms');
  $get_full_bathrooms_terms = get_the_terms($property['ID'], 'full_bathrooms');
  $get_half_bathrooms_terms = get_the_terms($property['ID'], 'half_bathrooms');
  $get_location_city_terms = get_the_terms($property['ID'], 'location_city');
  $get_location_zip_terms = get_the_terms($property['ID'], 'location_zip');
  $get_living_area_terms = get_the_terms($property['ID'], 'total_living_area_sqft');
  $get_lot_dimensions_terms = get_the_terms($property['ID'], 'lot_dimensions');
  $get_updated_terms = get_the_terms($property['ID'], 'updated');
  $get_days_on_market_terms = get_the_terms($property['ID'], 'days_on_market');



  $_propertyType = $get_sale_type_terms[0]->slug;

  $singleBedrooms = $get_bedrooms_terms[0]->name;
  $singleBathrooms = $get_bathrooms_terms[0]->name;
  $singleBathroomsFull = $get_full_bathrooms_terms[0]->name;
  $singleBathroomsHalf = $get_half_bathrooms_terms[0]->name;
  $totalLivingArea = $get_living_area_terms[0]->name;
  $lotDimensionsArea = $get_lot_dimensions_terms[0]->name;
  $locationCity = $get_location_city_terms[0]->name;
  $locationZip = $get_location_zip_terms[0]->name;
  $updatedProperty = $get_updated_terms[0]->name;
  $daysOnMarket = $get_days_on_market_terms[0]->name;


  ?>

  <div class="container-fluid ftrdImgGoTop">
    <section>
      <?php if (function_exists('ud_get_wpp_resp_slideshow')) { ?>
        <?php echo do_shortcode('[property_responsive_slideshow slider_type=12mosaic]'); ?>
      <?php } else { ?>
        <?php if (has_post_thumbnail()) { ?>
          <div class="slideshowHeadImage"
               style="background-image: url('<?php echo get_the_post_thumbnail_url(); ?>')"></div>
        <?php } else { ?>
          <div class="slideshowHeadImage"
               style="background-image: url('<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/default_property.JPG')"></div>
        <?php } ?>
      <?php } ?>
    </section>
    <section id="propertyDetails" class="singlePropertyHeader">
      <div class="container">
        <?php //die( '<pre>' . print_r( $property, true ) . '</pre>' ); ?>
        <div class="title">
          <span>Active</span>
          <div><?php the_title(); ?><span><?php _e($locationCity) . ' ,' ?>
              <?php if($locationZip){_e('NC ' . $locationZip);} ?></span></div>
          <b class="clear"></b>
        </div>

        <ul>
          <?php if ($property['price']) { ?>
            <li><span class="icon-wpproperty-status-rented-solid singlePropertyIcon"></span><?php _e('$');
            echo $property['price']; ?></li><?php } ?>
          <?php if ($singleBedrooms) { ?>
            <li><span
              class="icon-wpproperty-attribute-bedroom-solid singlePropertyIcon"></span><?php _e($singleBedrooms . ' Beds'); ?>
            </li><?php } ?>
          <?php if ($singleBathrooms) { ?>
            <li><span
              class="icon-wpproperty-attribute-bathroom-solid singlePropertyIcon"></span><?php _e($singleBathrooms . ' Baths'); ?>
            </li><?php } ?>
          <?php if ($totalLivingArea) { ?>
            <li><span
              class="icon-wpproperty-attribute-size-solid singlePropertyIcon"></span><?php _e(number_format($totalLivingArea) . ' Sq.ft'); ?>
            </li><?php } ?>
          <?php if ($lotDimensionsArea) { ?>
            <li><span
              class="icon-wpproperty-attribute-lotsize-solid singlePropertyIcon"></span><?php _e($lotDimensionsArea . ' acres'); ?>
            </li><?php } ?>
        </ul>
        <?php if(!empty($property)){ ?>
        <div class="oneAgent">
          <?php if ($_propertyType == 'sale') { ?>
            <ul class="socialButtons">
              <li><a href="javascript:void(0);"><span class="icon-wpproperty-interface-share-solid shareButton"></span></a></li>
              <li><a target="_blank" href="<?php echo do_shortcode('[property_flyer urlonly=yes]'); ?>"><span class="icon-wpproperty-interface-print-solid"></span></a></li>
              <!-- <li><a href="#"><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></a></li>
              <li><a href="#"><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></a></li> -->
            </ul>
            <div class="singleShareContainer">
              <h4>Share this property</h4>
              <p>
              <a class="icon-wpproperty-social-facebook-symbol" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_the_permalink()); ?>"></a>
              <a class="icon-wpproperty-social-twitter-symbol" target="_blank" href="https://twitter.com/home?status=<?php echo urlencode('Check out this ' . $singleBedrooms . ' bed ' . $singleBathrooms . ' bath ' . $totalLivingArea . ' sqft in #' . $locationCity . ' on @RedDoorCompany at ' . get_the_permalink()) ?>"></a>
              <a class="icon-wpproperty-social-linkedin-symbol" target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=<?php echo urlencode(get_the_permalink()); ?>&title=<?php echo urlencode($singleBedrooms . ' bed ' . $singleBathrooms . ' bath ' . $totalLivingArea . ' sqft in #' . $locationCity); ?>&summary=<?php echo urlencode($property['automated_property_detail_description']) ?>&source=Red%20Door%20Company"></a>
              </p>
              <p class="visEmail"><span>or mail vis email</span></p>
              <script>
              jQuery(document).ready(function(){
                jQuery('#sharingEmail').keyup(function(){
                  var value = jQuery(this).val();
                  jQuery('.goShare').attr('href', 'mailto:' + value + '?&subject=<?php echo urlencode($singleBedrooms . ' bed ' . $singleBathrooms . ' bath ' . $totalLivingArea . ' sqft in ' . $locationCity . '&body=' . $property['automated_property_detail_description'] . '0A%0ACheck%20it%20out%20at%20' . get_the_permalink()) ?>');
                });
              });
              </script>
              <input type="email" placeholder="Enter email" id="sharingEmail" />
              <a class="goShare" href="mailto:YOUR_MAIL?&subject=<?php echo urlencode($singleBedrooms . ' bed ' . $singleBathrooms . ' bath ' . $totalLivingArea . ' sqft in ' . $locationCity . '&body=' . $property['automated_property_detail_description'] . '0A%0ACheck%20it%20out%20at%20' . get_the_permalink()) ?>">Share</a>
            </div>
          <?php } ?>

          <div class="rdc-agents-carousel-container">

            <div class="rdc-agents-carousel-wrapper">

              <?php if (empty($property['wpp_agents']) || $_propertyType == 'rent') { ?>

                <div class="rdc-agents-carousel-title">

                  <a href="#" class="rdc-agents-carousel-previous" title="Previous"></a>

                  <a href="#" class="rdc-agents-carousel-next" title="Next"></a>

                </div>

              <?php } ?>

              <ul class="rdc-agents-carousel-items">

                <?php

                if (!empty($property['wpp_agents'])) {
                  foreach ($property['wpp_agents'] as $agentId) {

                    echo '<li class="rdc-agents-carousel-item">';

                    $image_ids = get_user_meta($agentId, 'agent_images', true);

                    $user_data = get_userdata($agentId);

                    if (!empty($image_ids[0])) {
                      $imageId = $image_ids[0];
                    }

                    echo wp_get_attachment_image($imageId, 'thumbnail') . '</br>';

                    echo '<h3>' . $user_data->display_name . '</h3>';

                    echo '<span>Red Door Company</span><div class="oneAgentLinksBlock"><a href="#">Request Information</a></div></li>';

                  }
                } else {
                  $usersAgentsObjects = get_users(array('role' => 'agent'));

                  foreach ($usersAgentsObjects as $userAgentId) {

                    echo '<li class="rdc-agents-carousel-item">';

                    if ($_propertyType == 'sale') {

                      $image_ids = get_user_meta($userAgentId->ID, 'agent_images', true);

                      $user_data = get_userdata($userAgentId->ID);

                      if (!empty($image_ids[0])) {
                        $imageId = $image_ids[0];
                      }
//                else{
//                  $imageId = '14311';
//                }

                      echo wp_get_attachment_image($imageId, 'thumbnail') . '</br>';

                      echo '<h3>' . $user_data->display_name . '</h3>';

                      echo '<span>Red Door Company</span>';

                    }

                    echo '<div class="oneAgentLinksBlock"><a href="#">Request Information</a></div></li>';


                  }
                }

                ?>

              </ul>

            </div>

          </div>

        </div>
    <?php } ?>
      </div>
    </section>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-lg-7 col-md-7">
        <?php echo $property['remarks']; ?>
      </div>
      <div class="col-lg-8 col-md-8">
        <ul class="propertyAttribute">
          <li>
            <div>
              <span class="icon-wpproperty-data-checked-outline"></span>
            </div>
            <span>Last Checked</span>
            <strong>1 minute ago</strong>
          </li>
          <li>
            <div>
              <span class="icon-wpproperty-data-updated-outline"></span>
            </div>
            <span>Last Updated</span>
            <strong><?php echo $updatedProperty; ?></strong>
          </li>
          <li>
            <div>
              <span class="icon-wpproperty-data-days-outline"></span>
            </div>
            <span>Days on Market</span>
            <strong><?php echo $daysOnMarket; ?></strong>
          </li>
        </ul>
      </div>
      <div class="col-lg-7 col-md-7">
        <h4>Property Facts</h4>
      </div>
      <div class="col-lg-8 col-md-8 bottomSeparate">
        <ul class="propertyAttribute">
          <li>
            <div>
              <svg class="icon icon-management">
                <use xlink:href="#icon-management"/>
              </svg>
            </div>
            <span>Listing Type</span>
            <strong><?php echo ucfirst($_propertyType); ?></strong>
          </li>
          <li>
            <div>
              <svg class="icon icon-management">
                <use xlink:href="#icon-management"/>
              </svg>
            </div>
            <span>Lot size</span>
            <strong>2.23 acres</strong>
          </li>
          <li>
            <div>
              <svg class="icon icon-management">
                <use xlink:href="#icon-management"/>
              </svg>
            </div>
            <span></span>
            <strong>Traditional</strong>
          </li>
          <li>
            <div>
              <span class="icon-wpproperty-attribute-bathroom-solid"></span>
            </div>
            <span>Bathrooms</span>
            <strong>
              <?php
                if($singleBathroomsFull){
                  _e($singleBathroomsFull . ' Full');
                }
                if($singleBathroomsHalf){
                  echo ', ';
                  _e($singleBathroomsHalf . ' Half');
                }
              ?>
            </strong>
          </li>
          <li>
            <div>
              <svg class="icon icon-management">
                <use xlink:href="#icon-management"/>
              </svg>
            </div>
            <span>Consutructed in</span>
            <strong>in 2014</strong>
          </li>
          <li>
            <div>
              <svg class="icon icon-management">
                <use xlink:href="#icon-management"/>
              </svg>
            </div>
            <span>Property Type</span>
            <strong><?php echo ucfirst($property['property_type']); ?></strong>
          </li>
        </ul>
      </div>

    </div>
  </div>
  <div class="container areaMapBlock">
    <div class="row">
      <div class="col-md-7 col-lg-7">
        <h4>Area Map for 5000 Daviston Ct</h4>
      </div>
      <div class="col-md-7 col-lg-7">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua.
        Utsa laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit
        esse cillum dolore
        eurev fugiat nulla pariatur.
      </div>
    </div>
    <div class="row">
      <div class="ambItem col-md-2 col-lg-2">
        <div>70</div>
        <span>Walk Score</span>
        <strong>Very Walkable</strong>
      </div>
      <div class="ambItem col-md-2 col-lg-2">
        <div>50</div>
        <span>Transit Score</span>
        <strong>Good Transit</strong>
      </div>
      <div class="ambItem col-md-2 col-lg-2">
        <div>90</div>
        <span>Bike Score</span>
        <strong>Biker’s Paradise</strong>
      </div>
    </div>
    <div class="row">
      <div class="col-lg-8 col-md-8 bottomSeparate">
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab" href="#Ameneties">Ameneties</a></li>
          <li><a data-toggle="tab" href="#Commute">Commute</a></li>
          <li><a data-toggle="tab" href="#Street">Street View</a></li>
          <li><a data-toggle="tab" href="#Satellite">Satellite</a></li>
        </ul>

        <div class="tab-content">
          <div id="Ameneties" class="tab-pane fade in active">
            <p>Some content Ameneties.</p>
          </div>
          <div id="Commute" class="tab-pane fade">
            <p>Some content Commute.</p>
          </div>
          <div id="Street" class="tab-pane fade">
            <p>Some content Street.</p>
          </div>
          <div id="Satellite" class="tab-pane fade">
            <p>Some content Satellite.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container propertyDetails">
    <div class="row">
      <div class="col-lg-7 col-md-7">
        <h4>Property Details for 5000 Daviston Ct</h4>
      </div>
      <div class="col-lg-7  col-md-7">
        5000 Daviston Ct is house in Fuquay Varina, NC 27526. This 3,200 square foot house sits on a 2.23 acre lot and
        features
        4 bedrooms and 4 bathrooms. This house has been listed on Redfin since January 22, 2016 and is currently priced
        at $499,000.
        This property was built in 2016. The closest school is West Lake Middle School. 5000 Daviston Ct is near Action
        Park and South Park.
      </div>
      <div class="col-lg-8 col-md-8 bottomSeparate">
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab" href="#Rooms">Rooms</a></li>
          <li><a data-toggle="tab" href="#Features">Features</a></li>
          <li><a data-toggle="tab" href="#Neighborhood">Neighborhood</a></li>
          <li><a data-toggle="tab" href="#PropertyLot">Property & Lot</a></li>
        </ul>

        <div class="tab-content">
          <div id="Rooms" class="tab-pane fade in active">
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <svg class="icon icon-management">
                    <use xlink:href="#icon-management"/>
                  </svg>
                </div>
                <span>Bedroom Info</span>
                <b class="clear"></b>
              </section>
              <ul>
                <li>Master Bedroom Floor: <b>Second</b></li>
                <li>2nd Bedroom Floor: <b>Second</b></li>
                <li>3rd Bedroom Floor: <b>Second</b></li>
                <li>4th Bedroom Floor: <b>Main</b></li>
              </ul>
            </div>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <svg class="icon icon-management">
                    <use xlink:href="#icon-management"/>
                  </svg>
                </div>
                <span>Bathroom Info</span>
                <b class="clear"></b>
              </section>
              <ul>
                <li># of Bathrooms (Full): <b>3</b></li>
                <li># of Bathrooms (1/2): <b>1</b></li>
                <li>Bath Features: <b>Bath, Shower, Tub</b></li>
              </ul>
            </div>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <svg class="icon icon-management">
                    <use xlink:href="#icon-management"/>
                  </svg>
                </div>
                <span>Living Area</span>
                <b class="clear"></b>
              </section>
              <ul>
                <li>Other Room 1 Description: <b>MstrSitRm</b></li>
                <li>Other Room 1 Level: <b>Second</b></li>
                <li>Family Room Floor: <b>Main</b></li>
                <li>Total Other Area Sq. Ft.: <b>1,127</b></li>
                <li>Living Area Above Grade: <b>3,200</b></li>
              </ul>
            </div>
            <div class="clear"></div>
          </div>
          <div id="Features" class="tab-pane fade">
            <p>Some content Features.</p>
          </div>
          <div id="Neighborhood" class="tab-pane fade">
            <p>Some content Neighborhood.</p>
          </div>
          <div id="PropertyLot" class="tab-pane fade">
            <p>Some content PropertyLot.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container listingProvider">
    <div class="row">
      <div class="col-lg-7 col-md-7">
        <h4>Listing Provider for 5000 Daviston CT</h4>
      </div>
      <div class="col-lg-7 col-md-7">
        <ul>
          <li>Other Room 1 Description: <b>MstrSitRm</b></li>
          <li>Other Room 1 Level: <b>Second</b></li>
          <li>Family Room Floor: <b>Main</b></li>
          <li>Total Other Area Sq. Ft.: <b>1,127</b></li>
          <li>Living Area Above Grade: <b>3,200</b></li>
        </ul>
        <ul>
          <li>Other Room 1 Description: <b>MstrSitRm</b></li>
          <li>Other Room 1 Level: <b>Second</b></li>
          <li>Family Room Floor: <b>Main</b></li>
          <li>Total Other Area Sq. Ft.: <b>1,127</b></li>
          <li>Living Area Above Grade: <b>3,200</b></li>
        </ul>
        <div class="clear"></div>
      </div>
      <div class="col-lg-7 col-md-7 italicText">
        Information Not Guaranteed. ©2016 Triangle MLS Inc. All rights reserved. Listings marked with an <b
          style="font-style: normal; color: #000">TMLS IDX&#153;</b>
        icon are provided courtesy of the Triangle MLS, Inc. of North Carolina, Internet Data Exchange Database.
      </div>
    </div>
  </div>

<?php endwhile; ?>


<?php get_footer(); ?>