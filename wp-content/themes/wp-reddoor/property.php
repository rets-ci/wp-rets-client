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
global $wp_properties;

// Start the Loop.
while (have_posts()) : the_post();
  $get_sale_type_terms = get_the_terms($property['ID'], 'sale_type');
  $get_bedrooms_terms = get_the_terms($property['ID'], 'bedrooms');
  $get_bathrooms_terms = get_the_terms($property['ID'], 'bathrooms');
  $get_location_city_terms = get_the_terms($property['ID'], 'location_city');
  $get_location_zip_terms = get_the_terms($property['ID'], 'location_zip');
  $get_living_area_terms = get_the_terms($property['ID'], 'total_living_area_sqft');
  $get_lot_dimensions_terms = get_the_terms($property['ID'], 'lot_dimensions');
  $get_updated_terms = get_the_terms($property['ID'], 'updated');
  $get_days_on_market_terms = get_the_terms($property['ID'], 'days_on_market');
  $get_elementary_school_terms = get_the_terms($property['ID'], 'elementary_school');
  $get_middle_school_terms = get_the_terms($property['ID'], 'middle_school');
  $get_high_school_terms = get_the_terms($property['ID'], 'high_school');
  $get_subdivision_terms = get_the_terms($property['ID'], 'subdivision');
  $get_inside_city_terms = get_the_terms($property['ID'], 'inside_city');
  $get_location_city_terms = get_the_terms($property['ID'], 'location_city');
  $get_location_county_terms = get_the_terms($property['ID'], 'location_county');
  $get_design_terms = get_the_terms($property['ID'], 'design');
  $get_style_terms = get_the_terms($property['ID'], 'style');
  $get_year_built_terms = get_the_terms($property['ID'], 'year_built');
  $get_new_construction_terms = get_the_terms($property['ID'], 'new_construction');
  $get_listing_agent_name_terms = get_the_terms($property['ID'], 'listing_agent_name');
  $get_listing_agent_phone_number_terms = get_the_terms($property['ID'], 'listing_agent_phone_number');
  $get_listing_agent_phone_extension_terms = get_the_terms($property['ID'], 'listing_agent_phone_extension');
  $get_listing_office_terms = get_the_terms($property['ID'], 'listing_office');
  $get_listing_office_phone_number_terms = get_the_terms($property['ID'], 'listing_office_phone_number');
  $get_mls_id_terms = get_the_terms($property['ID'], 'mls_id');
  $get_data_source_terms = get_the_terms($property['ID'], 'data_source');
  $get_listing_id_terms = get_the_terms($property['ID'], 'listing_id');


  $_propertyType = ($get_sale_type_terms[0]) ? $get_sale_type_terms[0]->slug : '';
  $singleBedrooms = ($get_bedrooms_terms[0]) ? $get_bedrooms_terms[0]->name : '';
  $singleBathrooms = ($get_bathrooms_terms[0]) ? $get_bathrooms_terms[0]->name : '';
  $totalLivingArea = ($get_living_area_terms[0]) ? $get_bathrooms_terms[0]->name : '' ;
  $lotDimensionsArea = ($get_lot_dimensions_terms[0]) ? $get_lot_dimensions_terms[0]->name : '';
  $locationCity = ($get_location_city_terms[0]) ? $get_location_city_terms[0]->name : '';
  $locationZip = ($get_location_zip_terms[0]) ? $get_location_zip_terms[0]->name : '';
  $updatedProperty = ($get_updated_terms[0]) ? $get_updated_terms[0]->name : '';
  $daysOnMarket = ($get_days_on_market_terms[0]) ? $get_days_on_market_terms[0]->name : '';
  $elementary_school = ($get_elementary_school_terms[0]) ? $get_elementary_school_terms[0]->name : '';
  $middle_school = ($get_middle_school_terms[0]) ? $get_middle_school_terms[0]->name : '';
  $high_school = ($get_high_school_terms[0]) ? $get_high_school_terms[0]->name : '';
  $subdivision = ($get_subdivision_terms[0]) ? $get_subdivision_terms[0]->name : '';
  $inside_city = ($get_inside_city_terms[0]) ? $get_inside_city_terms[0]->name : '';
  $location_city = ($get_location_city_terms[0]) ? $get_location_city_terms[0]->name : '';
  $location_county = ($get_location_county_terms[0]) ? $get_location_county_terms[0]->name : '';
  $design = ($get_design_terms[0]) ? $get_design_terms[0]->name : '';
  $style = ($get_style_terms[0]) ? $get_style_terms[0]->name : '';
  $year_built = ($get_year_built_terms[0]) ? $get_year_built_terms[0]->name : '';
  $new_construction = ($get_new_construction_terms[0]) ? $get_new_construction_terms[0]->name : '';
  $listing_agent_name = ($get_listing_agent_name_terms[0]) ? $get_listing_agent_name_terms[0]->name : '';
  $listing_agent_phone_number = ($get_listing_agent_phone_number_terms[0]) ? $get_listing_agent_phone_number_terms[0]->name : '';
  $listing_agent_phone_extension = ($get_listing_agent_phone_extension_terms[0]) ? $get_listing_agent_phone_extension_terms[0]->name : '';
  $listing_office = ($get_listing_office_terms[0]) ? $get_listing_office_terms[0]->name : '';
  $listing_office_phone_number = ($get_listing_office_phone_number_terms[0]) ? $get_listing_office_phone_number_terms[0]->name : '';
  $mls_id = ($get_mls_id_terms[0]) ? $get_mls_id_terms[0]->name : '';
  $data_source = ($get_data_source_terms[0]) ? $get_data_source_terms[0]->name : '';
  $listing_id = ($get_listing_id_terms[0]) ? $get_listing_id_terms[0]->name : '';

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
          <?php if (!empty($property['price_2'])) { ?>
            <li><span class="icon-wpproperty-status-rented-solid singlePropertyIcon"></span><?php _e('$');
            echo number_format($property['price_2']); ?></li><?php } ?>
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
              <a class="icon-wpproperty-social-linkedin-symbol" target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=<?php echo urlencode(get_the_permalink()); ?>&title=<?php echo urlencode($singleBedrooms . ' bed ' . $singleBathrooms . ' bath ' . $totalLivingArea . ' sqft in #' . $locationCity); ?>&summary=<?php (!empty($property['automated_property_detail_description'])) ? urlencode($property['automated_property_detail_description']) : '' ?>&source=Red%20Door%20Company"></a>
              </p>
              <p class="visEmail"><span>or mail vis email</span></p>
              <script>
              jQuery(document).ready(function(){
                jQuery('#sharingEmail').keyup(function(){
                  var value = jQuery(this).val();
                  jQuery('.goShare').attr('href', 'mailto:' + value + '?&subject=<?php echo urlencode($singleBedrooms . ' bed ' . $singleBathrooms . ' bath ' . $totalLivingArea . ' sqft in ' . $locationCity . '&body=' . (!empty($property['automated_property_detail_description'])) ?  urlencode($property['automated_property_detail_description']) : ''  . '0A%0ACheck%20it%20out%20at%20' . get_the_permalink()) ?>');
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
          <?php if(!empty($updatedProperty)){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-data-updated-outline"></span>
            </div>
            <span>Last Updated</span>
            <strong><?php echo $updatedProperty; ?></strong>
          </li>
          <?php } ?>
          <?php if(!empty($daysOnMarket)){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-data-days-outline"></span>
            </div>
            <span>Days on Market</span>
            <strong><?php echo $daysOnMarket; ?></strong>
          </li>
          <?php } ?>
        </ul>
      </div>
      <div class="col-lg-7 col-md-7">
        <h4><?php _e('Property Facts') ?></h4>
      </div>
      <div class="col-lg-8 col-md-8 bottomSeparate">
        <ul class="propertyFacts">
          <?php if(!empty($design)){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-listing-house-outline"></span>
            </div>
            <span><?php _e('Design'); ?></span>
            <strong><?php _e($design); ?></strong>
          </li>
          <?php } ?>
          <?php if(!empty($style)){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-residentialstyle-capecod-outline"></span>
            </div>
            <span><?php _e('Style'); ?></span>
            <strong><?php _e($style); ?></strong>
          </li>
          <?php } ?>
          <?php if($new_construction == 'Yes' ){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-attribute-exterior-outline"></span>
            </div>
            <span><?php _e('Year Built'); ?></span>
            <strong>
              <?php print_r($year_built . ', ') . _e('New Construction'); ?>
            </strong>
          </li>
          <?php } ?>
        </ul>
        <ul class="propertyFacts">
          <?php if(!empty($subdivision)){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-attribute-neighborhood-outline"></span>
            </div>
            <span><?php _e('Subdivision'); ?></span>
            <strong><?php _e($subdivision); ?></strong>
          </li>
          <?php } ?>
          <?php if($inside_city == 'Yes'){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-listing-commercial-hotel-outline"></span>
            </div>
            <span><?php _e('Inside City'); ?></span>
            <strong>
              <?php echo $inside_city . ', ' . $location_city; ?>
            </strong>
          </li>
          <?php } ?>
          <?php if(!empty($location_county)){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-listing-land-outline"></span>
            </div>
            <span><?php _e('County'); ?></span>
            <strong><?php _e($location_county); ?></strong>
          </li>
          <?php } ?>
        </ul>
        <ul class="propertyFacts">
          <?php if(!empty($elementary_school)){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-school-elementary-outline"></span>
            </div>
            <span><?php _e('Elementary School'); ?></span>
            <strong><?php _e($elementary_school); ?></strong>
          </li>
          <?php } ?>
          <?php if(!empty($middle_school)){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-school-middle-outline"></span>
            </div>
            <span><?php _e('Middle School'); ?></span>
            <strong><?php _e($middle_school); ?></strong>
          </li>
          <?php } ?>
          <?php if(!empty($high_school)){ ?>
          <li>
            <div>
              <span class="icon-wpproperty-school-high-outline"></span>
            </div>
            <span><?php _e('High School'); ?></span>
            <strong><?php _e($high_school); ?></strong>
          </li>
          <?php } ?>
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
      <?php
      $_post_meta = get_post_meta($property['ID']);
      (!empty($_post_meta['_ws_walkscore'])) ? $walkScoreMeta = $_post_meta['_ws_walkscore'] : $walkScoreMeta = '';
      (!empty($walkScoreMeta[0])) ? $walkScore = $walkScoreMeta[0] : $walkScore = '';
      if($walkScore <= 100 && $walkScore >= 70){
        $walkScoreColor = '#57BD04';
      }
      elseif($walkScore <= 69 && $walkScore >= 50){
        $walkScoreColor = '#e5af1c';
        $walkScoreSubtitle = 'Somewhat Walkable';
      }
      elseif($walkScore <= 49 && $walkScore >= 25){
        $walkScoreColor = '#e9822f';
        $walkScoreSubtitle = 'Car Dependent';
      }
      elseif($walkScore <= 24 && $walkScore >= 0){
        $walkScoreColor = '#e73f3f';
        $walkScoreSubtitle = 'Car Dependent';
      }
      if($walkScore <= 100 && $walkScore >= 90){
        $walkScoreSubtitle = 'Walker’s Paradise';
      }
      if($walkScore <= 89 && $walkScore >= 70){
        $walkScoreSubtitle = 'Very Walkable';
      }
      ?>
      <?php if(!empty($walkScore)){ ?>
      <div class="ambItem col-md-2 col-lg-2">
        <div style="background: <?php echo $walkScoreColor; ?>;"><?php echo $walkScore; ?></div>
        <span>Walk Score</span>
        <strong><?php echo $walkScoreSubtitle; ?></strong>
      </div>
      <?php } ?>
      <div class="ambItem col-md-2 col-lg-2">
        <div class="scoreComing"><span class="icon-wpproperty-status-expired-outline"></span></div>
        <span>Transit Score</span>
        <strong>Coming Soon</strong>
      </div>
      <div class="ambItem col-md-2 col-lg-2">
        <div class="scoreComing"><span class="icon-wpproperty-status-expired-outline"></span></div>
        <span>Bike Score</span>
        <strong>Coming Soon</strong>
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
            <?php echo do_shortcode('[property_walkscore_neighborhood ws_map_modules = "google_map";  ws_base_map = "google_map";]'); ?>
          </div>
          <div id="Commute" class="tab-pane fade">
            <p>Commute</p>
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
        <h4><?php _e('Property Details for '); echo (!empty($property['location_address'])) ? $property['location_address'] : ''; ?></h4>
      </div>
      <div class="col-lg-7  col-md-7">
        <?php echo (!empty($property['automated_property_detail_description'])) ? $property['automated_property_detail_description'] : ''; ?>
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
            <?php
            $listAttributes = array();
            $taxonomies = ud_get_wpp_terms( 'config.taxonomies', array() );
            foreach($wp_properties['property_stats_groups'] as $key => $value){
              if ($value == 'bedrooms') {
                if(array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if (!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                }
                else{
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-bedroom-outline"></span>
                </div>
                <span><?php _e('Bedrooms'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){

              if($value == 'bathrooms'){
                if(array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if(!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                }
                else{
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-bathroom-outline"></span>
                </div>
                <span><?php _e('Bathrooms'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value) {

              if ($value == 'living_area') {
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if (!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-livingarea-outline"></span>
                </div>
                <span><?php _e('Living Area'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value) {

              if ($value == 'other_rooms') {
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if (!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-rooms-outline"></span>
                </div>
                <span><?php _e('Other Rooms'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value) {

              if ($value == 'kitchen_dining_room') {
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if (!empty($get_term_value[0]->name)) {
                    $listAttributes[] =  '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-kitchen-outline"></span>
                </div>
                <span><?php _e('Kitchen & Dining Room'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <div class="clear"></div>
          </div>
          <div id="Features" class="tab-pane fade">
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){

              if($value == 'interior') {
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if (!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-interior-outline"></span>
                </div>
                <span><?php _e('Interior'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){
              if($value == 'exterior'){
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if(!empty($get_term_value[0]->name)) {
                    $listAttributes[] =  '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-exterior-outline"></span>
                </div>
                <span><?php _e('Exterior'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){
              if($value == 'heating_cooling'){
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if(!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-solid-outline"></span>
                </div>
                <span><?php _e('Heating & Cooling'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){
              if($value == 'utility'){
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if(!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-utility-outline"></span>
                </div>
                <span><?php _e('Utility'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){
              if($value == 'parking'){
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if(!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-parking-outline"></span>
                </div>
                <span><?php _e('Parking'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <div class="clear"></div>
          </div>
          <div id="Neighborhood" class="tab-pane fade">
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){
              if($value == 'schools'){
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if(!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-school-outline"></span>
                </div>
                <span><?php _e('Schools'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){
              if($value == 'homeowners_association'){
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if(!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-hoa-outline"></span>
                </div>
                <span><?php _e('Homeowners Association'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <div class="clear"></div>
          </div>
          <div id="PropertyLot" class="tab-pane fade">
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value) {
              if ($value == 'pricing_terms') {
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if (!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if(!empty($property["$key"])){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-price-outline"></span>
                </div>
                <span><?php _e('Pricing & Terms'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){
              if($value == 'building'){
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if(!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-listing-house-outline"></span>
                </div>
                <span><?php _e('Building'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <?php
            $listAttributes = array();
            foreach($wp_properties['property_stats_groups'] as $key => $value){
              if($value == 'lot'){
                if (array_key_exists($key, $taxonomies)) {
                  $get_term_value = get_the_terms($property['ID'], $key);
                  if(!empty($get_term_value[0]->name)) {
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>' . $get_term_value[0]->name . '</b></li>';
                  }
                } else {
                  if($property["$key"] == true){
                    $listAttributes[] = '<li>' . str_replace('_', ' ', ucwords($key)) . ': <b>Yes</b></li>';
                  }
                }
              }
            }
            ?>
            <?php if(!empty($listAttributes)){ ?>
            <div class="pdRoomsBlock">
              <section>
                <div>
                  <span class="icon-wpproperty-attribute-lot-outline"></span>
                </div>
                <span><?php _e('Lot'); ?></span>
                <b class="clear"></b>
              </section>
              <ul>
                <?php echo implode('', $listAttributes); ?>
              </ul>
            </div>
            <?php } ?>
            <div class="clear"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="container listingProvider">
    <div class="row">
      <div class="col-lg-7 col-md-7">
        <h4><?php _e('Listing Provider for '); echo (!empty($property['location_address'])) ? $property['location_address'] : ''; ?></h4>
      </div>
      <div class="col-lg-7 col-md-7">
        <ul>
          <li><?php _e('Agent: '); ?><b><?php _e($listing_agent_name); ?></b></li>
          <li><?php _e('Agent Phone Number: '); ?><b><?php echo $listing_agent_phone_number; if($listing_agent_phone_extension){ echo ', ' . $listing_agent_phone_extension;} ?></b></li>
          <li><?php _e('Office: '); ?><b><?php _e($listing_office); ?></b></li>
          <li><?php _e('Office Phone Number: '); ?><b><?php echo $listing_office_phone_number; ?></b></li>
          <li><?php _e('MLS ID: '); ?><b><?php echo $mls_id; ?></b></li>
        </ul>
        <ul>
          <li><img src="<?php echo (!empty($property['data_source_logo_2'])) ? $property['data_source_logo_2'] : ''; ?>" alt=""></li>
          <li><?php _e('Data Source: '); ?><b><?php _e($data_source); ?></b></li>
          <li><?php _e('Data Property ID: '); ?><b><?php echo $listing_id; ?></b></li>
          <li><?php _e('Last Checked: '); ?><b><?php echo date('Y-m-d H:i', current_time('timestamp')-60); ?></b></li>
          <li><?php _e('Last Updated: '); ?><b><?php
              $updateTime = str_split($updatedProperty);
              $updateTime[10] = ' '; $updateTime[16] = ''; $updateTime[17] = ''; $updateTime[18] = '';
              echo implode($updateTime);
              ?>
            </b>
          </li>
          <li><?php _e('Days on site: '); ?><b><?php echo human_time_diff(get_the_time('U'), current_time('timestamp'));  ?></b></li>
        </ul>
        <div class="clear"></div>
      </div>
      <div class="col-lg-7 col-md-7 italicText">
        <?php (!empty($property['data_source_disclaimer'])) ? _e($property['data_source_disclaimer']) : ''; ?>
      </div>
    </div>
  </div>

<?php endwhile; ?>


<?php get_footer(); ?>