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

use UsabilityDynamics\RDC\Utils;

global $property;
global $wp_properties;

get_header();

// Start the Loop.
while (have_posts()) : the_post();
  $get_sale_type_terms = get_the_terms($property['ID'], 'sale_type');
  $get_bedrooms_terms = get_the_terms($property['ID'], 'bedrooms');
  $get_bathrooms_terms = get_the_terms($property['ID'], 'bathrooms');
  $get_location_city_terms = get_the_terms($property['ID'], 'location_city');
  $get_location_zip_terms = get_the_terms($property['ID'], 'location_zip');
  $get_living_area_terms = get_the_terms($property['ID'], 'total_living_area_sqft');
  $get_approximate_lot_size_terms = get_the_terms($property['ID'], 'approximate_lot_size');
  $get_updated_terms = get_the_terms($property['ID'], 'updated');
  $get_days_on_market_terms = get_the_terms($property['ID'], 'days_on_market');
  $get_elementary_school_terms = get_the_terms($property['ID'], 'elementary_school');
  $get_middle_school_terms = get_the_terms($property['ID'], 'middle_school');
  $get_high_school_terms = get_the_terms($property['ID'], 'high_school');
  $get_subdivision_terms = get_the_terms($property['ID'], 'subdivision');
  $get_inside_city_terms = get_the_terms($property['ID'], 'inside_city');
  $get_location_city_terms = get_the_terms($property['ID'], 'location_city');
  $get_location_county_terms = get_the_terms($property['ID'], 'location_county');
  $get_year_built_terms = get_the_terms($property['ID'], 'year_built');
  $get_new_construction_terms = get_the_terms($property['ID'], 'new_construction');
  $get_listing_agent_phone_extension_terms = get_the_terms($property['ID'], 'listing_agent_phone_extension');
  $get_listing_office_phone_number_terms = get_the_terms($property['ID'], 'listing_office_phone_number');
  $get_data_source_terms = get_the_terms($property['ID'], 'data_source');
  $get_listing_id_terms = get_the_terms($property['ID'], 'listing_id');


  $_propertyType = ($get_sale_type_terms[0]) ? $get_sale_type_terms[0]->slug : '';
  $singleBedrooms = ($get_bedrooms_terms[0]) ? $get_bedrooms_terms[0]->name : '';
  $singleBathrooms = ($get_bathrooms_terms[0]) ? $get_bathrooms_terms[0]->name : '';
  $totalLivingArea = ($get_living_area_terms[0]) ? $get_bathrooms_terms[0]->name : '' ;
  $approximateLotSize = ($get_approximate_lot_size_terms[0]) ? $get_approximate_lot_size_terms[0]->name : '';
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
  $year_built = ($get_year_built_terms[0]) ? $get_year_built_terms[0]->name : '';
  $new_construction = ($get_new_construction_terms[0]) ? $get_new_construction_terms[0]->name : '';
  $listing_agent_phone_extension = ($get_listing_agent_phone_extension_terms[0]) ? $get_listing_agent_phone_extension_terms[0]->name : '';
  $listing_office_phone_number = ($get_listing_office_phone_number_terms[0]) ? $get_listing_office_phone_number_terms[0]->name : '';
  $data_source = ($get_data_source_terms[0]) ? $get_data_source_terms[0]->name : '';
  $listing_id = ($get_listing_id_terms[0]) ? $get_listing_id_terms[0]->name : '';

  ?>
<div class="single-property">
  <div class="container-fluid ftrdImgGoTop">

    <?php get_template_part('static/views/property/slideshow'); ?>
    
    <section id="propertyDetails" class="singlePropertyHeader">
      <div class="container">
        <?php //die( '<pre>' . print_r( $property, true ) . '</pre>' ); ?>
        <div class="title">
          <span>Active</span>
          <div><?php the_title(); ?><span><?php echo _e($locationCity) . ',' ?>
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
              class="icon-wpproperty-attribute-size-solid singlePropertyIcon"></span><?php _e(number_format($totalLivingArea) . ' Sq.Ft'); ?>
            </li><?php } ?>
          <?php if ($approximateLotSize) { ?>
            <li><span
              class="icon-wpproperty-attribute-lotsize-solid singlePropertyIcon"></span><?php _e($approximateLotSize . ' Acres'); ?>
            </li><?php } ?>
        </ul>

        <?php get_template_part('static/views/agent-card'); ?>

      </div>
    </section>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12 singleRemarks">
        <?php echo $property['remarks']; ?>
      </div>
    </div>
  <div class="row">
    <div class="col-md-12 col-lg-8 col-xs-12">
      <div class="container-fluid">
        <div class="row propertyAttribute">
      <div class="col-xs-12 col-lg-4 col-md-4">
            <div>
              <span class="icon-wpproperty-data-checked-outline"></span>
            </div>
            <span>Last Checked</span>
            <strong>1 minute ago</strong>
      </div>
          <?php if(!empty($updatedProperty)){ ?>
      <div  class="col-xs-12 col-lg-4 col-md-4">
          <div>
            <span class="icon-wpproperty-data-updated-outline"></span>
          </div>
          <span>Last Updated</span>
          <strong>
            <?php $dateUpdt = strtotime("$updatedProperty GMT");
            echo date('F j, Y', $dateUpdt);
            ?>
          </strong>
      </div>
          <?php } ?>
          <?php if(!empty($daysOnMarket)){ ?>
      <div  class="col-xs-12 col-lg-4 col-md-4">
        <div>
          <span class="icon-wpproperty-data-days-outline"></span>
        </div>
        <span>Days on Market</span>
        <strong><?php echo $daysOnMarket; ?></strong>
      </div>
      <?php } ?>
      </div>
      </div>
      </div>
      </div>
      <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12">
        <h4><?php _e('Property Facts') ?></h4>
      </div>
      </div>
      <div class="row">
        <div class="col-md-12 col-lg-8 col-xs-12">
          <div class="container-fluid">
            <div class="row">
          <?php if(!empty(Utils::get_multiple_terms('design', $property['ID'], 'name'))){ ?>

          <div class="col-xs-12 col-md-4 col-lg-4 propertyFacts">

          <div class="col-md-12">
            <div>
              <span class="icon-wpproperty-listing-house-outline"></span>
            </div>
            <span><?php _e('Design'); ?></span>
            <strong><?php echo Utils::get_multiple_terms('design', $property['ID'], 'name', 'a'); ?></strong>
          </div>
          <?php } ?>
          <?php if(!empty(Utils::get_multiple_terms('style', $property['ID'], 'name'))){ ?>
          <div class="col-md-12">
            <div>
              <span class="icon-wpproperty-residentialstyle-capecod-outline"></span>
            </div>
            <span><?php _e('Style'); ?></span>
            <strong><?php echo Utils::get_multiple_terms('style', $property['ID'], 'name', 'a'); ?></strong>
          </div>
          <?php } ?>
          <div class="col-md-12">
            <div>
              <span class="icon-wpproperty-attribute-exterior-outline"></span>
            </div>
            <span><?php _e('Year Built'); ?></span>
            <strong>
              <?php if($new_construction == 'Yes' ){
               print_r($year_built . ', ') . _e('New Construction');
               } else {
                 _e($year_built);
               } ?>
            </strong>
          </div>
        </div>
        <div class="col-xs-12 col-md-4 col-lg-4 propertyFacts">
          <?php if(!empty($subdivision)){ ?>
            <div class="col-md-12">
            <div>
              <span class="icon-wpproperty-attribute-neighborhood-outline"></span>
            </div>
            <span><?php _e('Subdivision'); ?></span>
            <strong><?php _e($subdivision); ?></strong>
          </div>
          <?php } ?>
          <?php if(!empty($inside_city)){ ?>
          <div class="col-md-12">
            <div>
              <span class="icon-wpproperty-listing-commercial-hotel-outline"></span>
            </div>
            <span><?php _e('Inside City'); ?></span>
            <strong>
              <?php if($inside_city == 'Yes'){
                echo $inside_city . ', ' . $location_city;
               } else {
                echo $inside_city;
               }
              ?>
            </strong>
          </div>
           <?php } ?>
          <?php if(!empty($location_county)){ ?>
          <div class="col-md-12">
            <div>
              <span class="icon-wpproperty-listing-land-outline"></span>
            </div>
            <span><?php _e('County'); ?></span>
            <strong><?php _e($location_county); ?></strong>
          </div>
          <?php } ?>
        </div>
        <div class="col-xs-12 col-md-4 col-lg-4 propertyFacts">
          <?php if(!empty($elementary_school)){ ?>
          <div class="col-md-12">
            <div>
              <span class="icon-wpproperty-school-elementary-outline"></span>
            </div>
            <span><?php _e('Elementary School'); ?></span>
            <strong><?php _e($elementary_school); ?></strong>
          </div>
          <?php } ?>
          <?php if(!empty($middle_school)){ ?>
          <div class="col-md-12">
            <div>
              <span class="icon-wpproperty-school-middle-outline"></span>
            </div>
            <span><?php _e('Middle School'); ?></span>
            <strong><?php _e($middle_school); ?></strong>
          </div>
          <?php } ?>
          <?php if(!empty($high_school)){ ?>
          <div class="col-md-12">
            <div>
              <span class="icon-wpproperty-school-high-outline"></span>
            </div>
            <span><?php _e('High School'); ?></span>
            <strong><?php _e($high_school); ?></strong>
          </div>
          <?php } ?>
        </div>
        </div>
        </div>
        </div>
      </div>
    <div class="row">
      <div class="col-xs-12 col-md-12 col-lg-8">
        <div class="bottomSeparate"></div>
      </div>
    </div>
  </div>
  <div class="container areaMapBlock">
    <div class="row">
      <div class="col-xs-12 col-md-12 col-lg-7">
        <h4>Area Map for 5000 Daviston Ct</h4>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12">
        <ul class="nav nav-tabs ws_nmaps">
          <li class="active"><a data-toggle="tab" href="#Ameneties">Ameneties</a></li>
          <li><a data-toggle="tab" href="#Commute">Commute</a></li>
          <li><a data-toggle="tab" href="#Street">Street View</a></li>
          <li><a data-toggle="tab" href="#Satellite">Satellite</a></li>
        </ul>

        <div class="tab-content">
          <div id="Ameneties" class="tab-pane fade in active" data-nmap-options="<?php echo urldecode( http_build_query( array(
            "property_id" => $property[ 'ID' ],
            "ws_commute" => "false",
            "ws_map_modules" => "all",
            "ws_base_map" => "google_map",
            "ws_show_reviews" => "false",
            "ws_hide_bigger_map" => "true",
            "ws_no_link_info_bubbles" => "true",
            "ws_map_icon_type" => "house",
            "ws_layout" => ( $_SERVER[ 'HTTP_X_USER_DEVICE' ] == "mobile" ? "vertical" : "horizontal" )
          ) ) ); ?>"></div>
          <div id="Commute" class="tab-pane fade" data-nmap-options="<?php echo urldecode( http_build_query( array(
            "property_id" => $property[ 'ID' ],
            "ws_commute" => "true",
            "ws_map_modules" => "all",
            "ws_base_map" => "google_map",
            "ws_show_reviews" => "false",
            "ws_hide_bigger_map" => "true",
            "ws_no_link_info_bubbles" => "true",
            "ws_map_icon_type" => "house",
            "ws_layout" => ( $_SERVER[ 'HTTP_X_USER_DEVICE' ] == "mobile" ? "vertical" : "horizontal" )
          ) ) ); ?>"></div>
          <div id="Street" class="tab-pane fade" data-nmap-options="<?php echo urldecode( http_build_query( array(
            "property_id" => $property[ 'ID' ],
            "ws_commute" => "false",
            "ws_map_modules" => "all",
            "ws_base_map" => "street_view",
            "ws_show_reviews" => "false",
            "ws_hide_bigger_map" => "true",
            "ws_no_link_info_bubbles" => "true",
            "ws_map_icon_type" => "house",
            "ws_layout" => ( $_SERVER[ 'HTTP_X_USER_DEVICE' ] == "mobile" ? "vertical" : "horizontal" )
          ) ) ); ?>"></div>
          <div id="Satellite" class="tab-pane fade" data-nmap-options="<?php echo urldecode( http_build_query( array(
            "property_id" => $property[ 'ID' ],
            "ws_commute" => "false",
            "ws_map_modules" => "all",
            "ws_base_map" => "satellite",
            "ws_show_reviews" => "false",
            "ws_hide_bigger_map" => "true",
            "ws_no_link_info_bubbles" => "true",
            "ws_map_icon_type" => "house",
            "ws_layout" => ( $_SERVER[ 'HTTP_X_USER_DEVICE' ] == "mobile" ? "vertical" : "horizontal" )
          ) ) ); ?>"></div>
        </div>
      </div>
    </div>
    <div class="row singleWalkScore">
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
      <div class="col-xs-12 col-lg-8 col-md-12">
        <div class="container-fluid">
          <div class="row">
        <?php if(!empty($walkScore)){ ?>

          <div class="col-xs-12 col-md-4 col-lg-4">

            <div class="ambItem">
              <div style="background: <?php echo $walkScoreColor; ?>;"><?php echo $walkScore; ?></div>
              <span>Walk Score</span>
              <strong><?php echo $walkScoreSubtitle; ?></strong>
            </div>
          </div>
        <?php } else { ?>

          <div class="col-xs-12 col-md-4 col-lg-4">

            <div class="ambItem">
            <div class="scoreComing"><span class="icon-wpproperty-status-expired-outline"></span></div>
            <span>Walk Score</span>
            <strong><?php _e('Temporarily Unavailable'); ?></strong>
            </div>
          </div>
        <?php }  ?>

        <div class="col-xs-12 col-md-4 col-lg-4">

          <div class="ambItem">
          <div class="scoreComing"><span class="icon-wpproperty-status-expired-outline"></span></div>
          <span>Transit Score</span>
          <strong>Coming Soon</strong>
          </div>
        </div>

        <div class="col-xs-12 col-md-4 col-lg-4">

          <div class="ambItem">
            <div class="scoreComing"><span class="icon-wpproperty-status-expired-outline"></span></div>
            <span>Bike Score</span>
            <strong>Coming Soon</strong>
          </div>
        </div>
        </div>
        </div>
      </div>
      </div>
    <div class="row">
      <div class="col-xs-12 col-md-12 col-lg-8">
        <div class="bottomSeparate"></div>
      </div>
    </div>
  </div>
  <div class="container propertyDetails">
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12">
        <h4><?php _e('Property Details for '); echo (!empty($property['location_address'])) ? $property['location_address'] : ''; ?></h4>
      </div>
    </div>
      <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12 singleRemarks">
        <?php echo (!empty($property['automated_property_detail_description'])) ? $property['automated_property_detail_description'] : ''; ?>
      </div>
      </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12">
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab" href="#Rooms">Rooms</a></li>
          <li><a data-toggle="tab" href="#Features">Features</a></li>
          <li><a data-toggle="tab" href="#Neighborhood">Neighborhood</a></li>
          <li><a data-toggle="tab" href="#PropertyLot">Property & Pricing</a></li>
        </ul>

        <div class="tab-content">
          <div id="Rooms" class="tab-pane fade in active grid">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
          <div id="Features" class="tab-pane fade grid">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
          <div id="Neighborhood" class="tab-pane fade grid">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
          <div id="PropertyLot" class="tab-pane fade grid">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
            <div class="pdRoomsBlock grid-item">
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
    <div class="row">
      <div class="col-xs-12 col-md-12 col-lg-8">
        <div class="bottomSeparate"></div>
      </div>
    </div>
  </div>
  <div class="container listingProvider">
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12">
        <h4><?php _e('Listing Provider for '); echo (!empty($property['location_address'])) ? $property['location_address'] : ''; ?></h4>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12 singleRemarks">
        <?php (!empty($property['data_source_disclaimer'])) ? _e($property['data_source_disclaimer']) : ''; ?>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12">
        <ul class="col-xs-12">
          <li><?php _e('Agent: '); ?><b><?php echo Utils::get_multiple_terms('listing_agent_name', $property['ID'], 'name', 'a'); ?></b></li>
          <li><?php _e('Agent Phone Number: '); ?><b><?php echo (!empty($listing_agent_phone_number)) ? $listing_agent_phone_number : ''; if($listing_agent_phone_extension){ echo ', ' . $listing_agent_phone_extension;} ?></b></li>
          <li><?php _e('Office: '); ?><b><?php echo Utils::get_multiple_terms('listing_office', $property['ID'], 'name', 'a'); ?></b></li>
          <li><?php _e('Office Phone Number: '); ?><b><?php echo Utils::get_multiple_terms('listing_office_phone_number', $property['ID'], 'name', 'a'); ?></b></li>
          <li><?php _e('MLS ID: '); ?><b><?php echo Utils::get_multiple_terms('mls_id', $property['ID'], 'name', 'a'); ?></b></li>
        </ul>
        <ul class="col-xs-12">
          <li><img src="<?php echo (!empty($property['data_source_logo_2'])) ? $property['data_source_logo_2'] : ''; ?>" alt=""></li>
          <li><?php _e('Data Source: '); ?><b><?php _e($data_source); ?></b></li>
          <li><?php _e('Data Property ID: '); ?><b><?php echo $listing_id; ?></b></li>
          <li><?php _e('Last Checked: '); ?><b><?php echo date('F j, Y g:i A T', current_time('timestamp')-60); ?></b></li>
          <li><?php _e('Last Updated: '); ?><b><?php
              $dateUpdt = '';
              $dateUpdt = strtotime("$updatedProperty GMT");
              echo date('F j, Y g:i A T', $dateUpdt);
              ?>
            </b>
          </li>
          <li><?php _e('Days on site: '); ?><b><?php echo human_time_diff(get_the_time('U'), current_time('timestamp'));  ?></b></li>
        </ul>
        <div class="clear"></div>
      </div>
      </div>
  </div>

<?php endwhile; ?>
</div>

<?php get_footer(); ?>