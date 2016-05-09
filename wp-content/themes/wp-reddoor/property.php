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

// Organization for property details laid out in tabs
$_property_detail_map = array(
  "Rooms" => array(
    "label" => "Rooms",
    "groups" => array(
      "bedrooms" => array( "label" => "Bedrooms", "icon" => "attribute-bedroom" ),
      "bathrooms" => array( "label" => "Bathrooms", "icon" => "attribute-bathroom" ),
      "kitchen_dining_room" => array( "label" => "Heating & Cooling", "icon" => "attribute-kitchen" ),
      "living_area" => array( "label" => "Utility", "icon" => "attribute-livingarea" ),
      "other_rooms" => array( "label" => "Exterior", "icon" => "attribute-rooms" )
    )
  ),
  "Features" => array(
    "label" => "Features",
    "groups" => array(
      "interior" => array( "label" => "Interior", "icon" => "attribute-interior" ),
      "exterior" => array( "label" => "Exterior", "icon" => "attribute-exterior" ),
      "heating_cooling" => array( "label" => "Heating & Cooling", "icon" => "attribute-solid" ),
      "utility" => array( "label" => "Utility", "icon" => "attribute-utility" ),
      "parking" => array( "label" => "Parking", "icon" => "attribute-parking" )
    )
  ),
  "NeighborhoodDetail" => array(
    "label" => "Neighborhood",
    "groups" => array(
      "schools" => array( "label" => "Schools", "icon" => "school" ),
      "homeowners_association" => array( "label" => "Homeowners Association", "icon" => "attribute-hoa" )
    )
  ),
  "PropertyLot" => array(
    "label" => "Property <span class='hidden-sm	hidden-xs'>& Pricing</span>",
    "groups" => array(
      "pricing_terms" => array( "label" => "Pricing & Terms", "icon" => "attribute-price" ),
      "building" => array( "label" => "Building", "icon" => "listing-house" ),
      "lot" => array( "label" => "Lot", "icon" => "attribute-lot" )
    )
  ),
);


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
  $get_days_on_market_terms = get_the_terms($property['ID'], 'added');
  $get_elementary_school_terms = get_the_terms($property['ID'], 'elementary_school');
  $get_middle_school_terms = get_the_terms($property['ID'], 'middle_school');
  $get_high_school_terms = get_the_terms($property['ID'], 'high_school');
  $get_subdivision_terms = get_the_terms($property['ID'], 'subdivision');
  $get_inside_city_terms = get_the_terms($property['ID'], 'inside_city');
  $get_location_city_terms = get_the_terms($property['ID'], 'location_city');
  $get_location_county_terms = get_the_terms($property['ID'], 'location_county');
  $get_year_built_terms = get_the_terms($property['ID'], 'year_built');
  $get_new_construction_terms = get_the_terms($property['ID'], 'new_construction');
  $get_listing_agent_phone_number_terms = get_the_terms($property['ID'], 'listing_agent_phone_number');
  $get_listing_agent_phone_extension_terms = get_the_terms($property['ID'], 'listing_agent_phone_extension');
  $get_listing_office_phone_number_terms = get_the_terms($property['ID'], 'listing_office_phone_number');
  $get_data_source_terms = get_the_terms($property['ID'], 'data_source');
  $get_listing_id_terms = get_the_terms($property['ID'], 'listing_id');


  $_propertyType = ($get_sale_type_terms[0]) ? $get_sale_type_terms[0]->slug : '';
  $singleBedrooms = ($get_bedrooms_terms[0]) ? $get_bedrooms_terms[0]->name : '';
  $singleBathrooms = ($get_bathrooms_terms[0]) ? $get_bathrooms_terms[0]->name : '';
  $totalLivingArea = ($get_living_area_terms[0]) ? $get_living_area_terms[0]->name : '' ;
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
  $listing_agent_phone_number = ($get_listing_agent_phone_number_terms[0]) ? $get_listing_agent_phone_number_terms[0]->name : '';
  $listing_agent_phone_extension = ($get_listing_agent_phone_extension_terms[0]) ? $get_listing_agent_phone_extension_terms[0]->name : '';
  $listing_office_phone_number = ($get_listing_office_phone_number_terms[0]) ? $get_listing_office_phone_number_terms[0]->name : '';
  $data_source = ($get_data_source_terms[0]) ? $get_data_source_terms[0]->name : '';
  $listing_id = ($get_listing_id_terms[0]) ? $get_listing_id_terms[0]->name : '';

  ?>
<div class="single-property">
  <div class="container-fluid ftrdImgGoTop">

    <?php get_template_part( 'static/views/property/slideshow' ); ?>

    <section id="propertyDetails" class="singlePropertyHeader">
      <div class="container">

        <div class="title">
          <span>Active</span>
          <div data-content-type="title"><?php the_title(); ?><span data-content-type="summary-location"><?php echo $locationCity ? ( _e( $locationCity ) . ',' ) : '' ?>
              <?php if( $locationZip ) {
                _e( 'NC ' . $locationZip );
              } ?></span></div>
          <b class="clear"></b>
        </div>

        <ul>
          <?php if( !empty( $property[ 'price_2' ] ) ) { ?>
            <li><span class="icon-wpproperty-status-rented-solid singlePropertyIcon"></span><?php _e( '$' );
            echo number_format( $property[ 'price_2' ] ); ?></li><?php } ?>
          <?php if( $singleBedrooms ) { ?>
            <li><span
              class="icon-wpproperty-attribute-bedroom-solid singlePropertyIcon"></span><?php _e( $singleBedrooms . ' Beds' ); ?>
            </li><?php } ?>
          <?php if( $singleBathrooms ) { ?>
            <li><span
              class="icon-wpproperty-attribute-bathroom-solid singlePropertyIcon"></span><?php _e( $singleBathrooms . ' Baths' ); ?>
            </li><?php } ?>
          <?php if( $totalLivingArea ) { ?>
            <li><span
              class="icon-wpproperty-attribute-size-solid singlePropertyIcon"></span><?php _e( number_format( $totalLivingArea ) . ' Sq.Ft.' ); ?>
            </li><?php } ?>
          <?php if( $approximateLotSize ) { ?>
            <li><span
              class="icon-wpproperty-attribute-lotsize-solid singlePropertyIcon"></span><?php _e( $approximateLotSize . ' Acres' ); ?>
            </li><?php } ?>
        </ul>

        <?php get_template_part( 'static/views/agent-card' ); ?>

      </div>
    </section>
  </div>

  <div class="container">

    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12 singleRemarks">
        <?php echo $property[ 'remarks' ]; ?>
      </div>
    </div>

    <div class="row no-gutter">
      <div class="col-md-8 col-lg-8 col-xs-12">
        <div class="container-fluid">

          <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-data-checked-outline"></span>
            </div>
            <span>Last Checked</span>
            <strong>1 minute ago</strong>
          </div>

          <?php if( !empty( $updatedProperty ) ) { ?>
          <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-data-updated-outline"></span>
            </div>
            <span>Last Updated</span>
            <strong><?php echo date( 'F j, Y', strtotime( "$updatedProperty GMT" ) ); ?></strong>
          </div>
          <?php } ?>

          <?php if( !empty( $daysOnMarket ) ) { ?>
          <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-data-days-outline"></span>
            </div>
            <span>Days on Market</span>
            <strong><?php
                echo human_time_diff(strtotime($daysOnMarket), current_time('timestamp'));
              ?></strong>
          </div>
          <?php } ?>

        </div>
      </div>
    </div>

    <div class="row" data-row-type="property-facts">
      <div class="col-xs-12 col-lg-8 col-md-12">
        <h4><?php _e( 'Property Highlights' ) ?></h4>
      </div>
    </div>

    <div class="row no-gutter" data-row-type="property-facts">
      <div class="col-md-8 col-lg-8 col-xs-12">
        <div class="container-fluid">

          <?php if( !empty( Utils::get_multiple_terms( 'design', $property[ 'ID' ], 'name' ) ) ){ ?>
          <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-listing-house-outline"></span>
            </div>
            <span><?php _e( 'Design' ); ?></span>
            <strong><?php echo Utils::get_multiple_terms( 'design', $property[ 'ID' ], 'name', 'a' ); ?></strong>
          </div>
          <?php } ?>

          <?php if( !empty( Utils::get_multiple_terms( 'style', $property[ 'ID' ], 'name' ) ) ) { ?>
          <div class="col-md-4 property-detail-wrapper">
              <div class="property-detail-icon-wrapper">
                <span class="icon-wpproperty-residentialstyle-capecod-outline"></span>
              </div>
              <span><?php _e( 'Style' ); ?></span>
              <strong><?php echo Utils::get_multiple_terms( 'style', $property[ 'ID' ], 'name', 'a' ); ?></strong>
            </div>
          <?php } ?>

          <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-attribute-exterior-outline"></span>
            </div>
            <span><?php _e( 'Year Built' ); ?></span>
            <strong>
              <?php if( $new_construction == 'Yes' ) {
                print_r( $year_built . ', ' ) . _e( 'New Construction' );
              } else {
                _e( $year_built );
              } ?>
            </strong>
          </div>

          <?php if( !empty( $subdivision ) ) { ?>
          <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-attribute-neighborhood-outline"></span>
            </div>
            <span><?php _e( 'Subdivision' ); ?></span>
            <strong><?php _e( $subdivision ); ?></strong>
          </div>
          <?php } ?>

          <?php if( !empty( $inside_city ) ) { ?>
            <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-listing-commercial-hotel-outline"></span>
            </div>
            <span><?php _e( 'Inside City' ); ?></span>
            <strong>
              <?php if( $inside_city == 'Yes' ) {
                echo $inside_city . ', ' . $location_city;
              } else {
                echo $inside_city;
              }
              ?>
            </strong>
          </div>
          <?php } ?>

          <?php if( !empty( $location_county ) ) { ?>
            <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-listing-land-outline"></span>
            </div>
            <span><?php _e( 'County' ); ?></span>
            <strong><?php _e( $location_county ); ?></strong>
          </div>
          <?php } ?>

          <?php if( !empty( $elementary_school ) ) { ?>
          <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-school-elementary-outline"></span>
            </div>
            <span><?php _e( 'Elementary School' ); ?></span>
            <strong><?php _e( $elementary_school ); ?></strong>
          </div>
          <?php } ?>

          <?php if( !empty( $middle_school ) ) { ?>
          <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-school-middle-outline"></span>
            </div>
            <span><?php _e( 'Middle School' ); ?></span>
            <strong><?php _e( $middle_school ); ?></strong>
          </div>
          <?php } ?>

          <?php if( !empty( $high_school ) ) { ?>
          <div class="col-md-4 property-detail-wrapper">
            <div class="property-detail-icon-wrapper">
              <span class="icon-wpproperty-school-high-outline"></span>
            </div>
            <span><?php _e( 'High School' ); ?></span>
            <strong><?php _e( $high_school ); ?></strong>
          </div>
          <?php } ?>

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
        <h4><?php _e( 'Area Map for ' );
          echo ( !empty( $property[ 'location_address' ] ) ) ? $property[ 'location_address' ] : ''; ?></h4>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12">
        <ul class="nav nav-tabs ws_nmaps">
          <li class="active"><a data-toggle="tab" href="#Neighborhood">Neighborhood</a></li>
          <li><a data-toggle="tab" href="#Commute">Commute</a></li>
          <li><a data-toggle="tab" href="#Street">Street View</a></li>
          <li><a data-toggle="tab" href="#Satellite">Satellite</a></li>
        </ul>

        <div class="tab-content">
          <div id="Neighborhood" class="tab-pane fade in active" data-nmap-options="<?php echo urldecode( http_build_query( array(
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
      $_post_meta = get_post_meta( $property[ 'ID' ] );
      ( !empty( $_post_meta[ '_ws_walkscore' ] ) ) ? $walkScoreMeta = $_post_meta[ '_ws_walkscore' ] : $walkScoreMeta = '';
      ( !empty( $walkScoreMeta[ 0 ] ) ) ? $walkScore = $walkScoreMeta[ 0 ] : $walkScore = '';
      if( $walkScore <= 100 && $walkScore >= 70 ) {
        $walkScoreColor = '#57BD04';
      } elseif( $walkScore <= 69 && $walkScore >= 50 ) {
        $walkScoreColor = '#e5af1c';
        $walkScoreSubtitle = 'Somewhat Walkable';
      } elseif( $walkScore <= 49 && $walkScore >= 25 ) {
        $walkScoreColor = '#e9822f';
        $walkScoreSubtitle = 'Car Dependent';
      } elseif( $walkScore <= 24 && $walkScore >= 0 ) {
        $walkScoreColor = '#e73f3f';
        $walkScoreSubtitle = 'Car Dependent';
      }
      if( $walkScore <= 100 && $walkScore >= 90 ) {
        $walkScoreSubtitle = 'Walker’s Paradise';
      }
      if( $walkScore <= 89 && $walkScore >= 70 ) {
        $walkScoreSubtitle = 'Very Walkable';
      }
      ?>
      <div class="col-xs-12 col-lg-8 col-md-12">
        <div class="container-fluid">
          <div class="row">
        <?php if( !empty( $walkScore ) ) { ?>

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
            <strong><?php _e( 'Temporarily Unavailable' ); ?></strong>
            </div>
          </div>
        <?php } ?>

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
        <h4><?php _e( 'Property Details for ' );
          echo ( !empty( $property[ 'location_address' ] ) ) ? $property[ 'location_address' ] : ''; ?></h4>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12 singleRemarks">
        <?php echo ( !empty( $property[ 'automated_property_detail_description' ] ) ) ? $property[ 'automated_property_detail_description' ] : ''; ?>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12">

        <ul class="nav nav-tabs attribute-filter">
          <?php foreach( $_property_detail_map as $tab_slug => $tab_detail ) { ?>
            <li class="attribute-filter-single-wrapper"><a data-filter=".wpp-category-<?php echo $tab_slug; ?>" href="#<?php echo $tab_slug; ?>" class="attribute-filter-single"><?php echo $tab_detail['label']; ?></a></li>
          <?php } ?>
          <li class="attribute-filter-single-wrapper active"><a data-filter="" href="#Rooms" class="attribute-filter-single">All</a></li>
        </ul>

        <div class="attribute-content">
          <div class="container-fluid">
          <div class="row">
          <?php foreach( $_property_detail_map as $tab_slug => $tab_detail ) { ?>
            <?php foreach( $tab_detail['groups'] as $group_slug => $group_detail ) { ?>
              <?php if( !empty( rdc_get_attribute_group( $group_slug) ) ) { ?>
              <div class="wpp-attribute-wrapper col-md-6 wpp-category-<?php echo $tab_slug; ?> wpp-group-<?php echo $group_slug; ?>" data-attribute-group="<?php echo $group_slug; ?>" data-attribute-category="<?php echo $group_slug; ?>">
                <div class="attributer-inner-wrapper">
                  <section class="attribute-group-title">
                    <div><span class="icon-wpproperty-<?php echo $group_detail['icon']; ?>-outline"></span></div>
                    <span><?php echo $group_detail['label']; ?></span>
                  </section>
                  <ul class="underlined-list"><?php echo implode( '', rdc_get_attribute_group( $group_slug ) ); ?></ul>
                </div>
              </div>
              <?php } ?>
            <?php } ?>
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

  <div class="container listingProvider">
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12">
        <h4><?php _e( 'Listing Provider for ' );
          echo ( !empty( $property[ 'location_address' ] ) ) ? $property[ 'location_address' ] : ''; ?></h4>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-8 col-md-12 singleRemarks">
        <?php ( !empty( $property[ 'data_source_disclaimer' ] ) ) ? _e( $property[ 'data_source_disclaimer' ] ) : ''; ?>
      </div>
    </div>
    <div class="row">

      <div class="col-md-8">

        <div class="row">

          <div class="col-md-6">

            <ul class="underlined-list">
              <li>
                <span class="field-label"><?php _e( 'Agent: ' ); ?></span>
                <span class="field-value"><?php echo Utils::get_multiple_terms( 'listing_agent_name', $property[ 'ID' ], 'name', 'a' ); ?></span>
              </li>

              <li>
                <span class="field-label"><?php _e( 'Agent Phone Number: ' ); ?></span>
                <span class="field-value"><?php echo ( !empty( $listing_agent_phone_number ) ) ? $listing_agent_phone_number : ''; if( $listing_agent_phone_extension ) { echo ', ' . $listing_agent_phone_extension;} ?></span>
              </li>
              <li>
                <span class="field-label"><?php _e( 'Office: ' ); ?></span>
                <span class="field-value"><?php echo Utils::get_multiple_terms( 'listing_office', $property[ 'ID' ], 'name', 'a' ); ?></span>
              </li>
              <li>
                <span class="field-label"><?php _e( 'Office Phone Number: ' ); ?></span>
                <span class="field-value"><?php echo Utils::get_multiple_terms( 'listing_office_phone_number', $property[ 'ID' ], 'name', 'a' ); ?></span>
              </li>
              <li>
                <span class="field-label"><?php _e( 'MLS ID: ' ); ?></span>
                <span class="field-value"><?php echo Utils::get_multiple_terms( 'mls_id', $property[ 'ID' ], 'name', 'a' ); ?></span>
              </li>
            </ul>

          </div>

          <div class="col-md-6">

            <ul class="underlined-list">
              <li>
                <span class="field-label"><?php _e( 'Data Source: ' ); ?></span>
                <span class="field-value"><?php _e( $data_source ); ?></span>
              </li>
              <li class="hidden">
                <span class="field-label"><?php _e( 'Data Property ID: ' ); ?></span>
                <span class="field-value"><?php echo $listing_id; ?></span>
              </li>
              <li>
                <span class="field-label"><?php _e( 'Last Checked: ' ); ?></span>
                <span class="field-value"><?php echo date( 'F j, Y g:i A T', current_time( 'timestamp' ) - 60 ); ?></span>
              </li>
              <li>
                <span class="field-label"><?php _e( 'Last Updated: ' ); ?>
                <span class="field-value"><?php echo date( 'F j, Y g:i A T', strtotime( "$updatedProperty GMT" ) ); ?></span>
              </li>
              <li>
                <span class="field-label"><?php _e( 'Days on site: ' ); ?></span>
                <span class="field-value"><?php echo human_time_diff( get_the_time( 'U' ), current_time( 'timestamp' ) ); ?></span>
              </li>
              <li>
                <span class="field-label"><img src="<?php echo ( !empty( $property[ 'data_source_logo_2' ] ) ) ? $property[ 'data_source_logo_2' ] : ''; ?>" alt=""></span>
              </li>

            </ul>

          </div>

        </div>

      </div>
    </div>
  </div>

</div>
<?php endwhile; ?>

<?php get_footer(); ?>