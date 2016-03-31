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
      <section id="propertyDetails" class="singlePropertyHeader">
        <div class="container">
          <div class="title">
            <span>Active</span>
            <div>5000 Davitson Ct<span>Parkland, FL 33076</span></div>
            <b class="clear"></b>
          </div>
          <ul>
            <li><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg><span><?php _e('$'); echo $property['price']; ?></span></li>
            <li><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg><span><?php print_r($property['beds']); echo ' '; _e('Beds'); ?></span></li>
            <li><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg><span><?php print_r($property['baths']); echo ' '; _e('Baths'); ?></span></li>
            <li><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg><span><?php print_r($property['apartment_area']); echo ' '; _e('Sq.ft'); ?></span></li>
            <li><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg><span><?php print_r($property['ground_area']); echo ' '; _e('acres'); ?></span></li>
          </ul>
          <div class="oneAgent">
            <ul class="socialButtons">
              <li><a href="#"><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></a></li>
              <li><a href="#"><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></a></li>
            </ul>

            <div class="rdc-agents-carousel-container">

            <div class="rdc-agents-carousel-wrapper">

              <div class="rdc-agents-carousel-title">

              <a href="#" class="rdc-agents-carousel-previous" title="Previous"></a>

              <a href="#" class="rdc-agents-carousel-next" title="Next"></a>

              </div>

              <ul class="rdc-agents-carousel-items">

            <?php

            if(!empty($property['wpp_agents'])) {
              foreach ($property['wpp_agents'] as $agentId) {

                echo '<li class="rdc-agents-carousel-item">';

                $image_ids = get_user_meta($agentId, 'agent_images', true);

                $user_data = get_userdata($agentId);

                echo wp_get_attachment_image($image_ids[0], 'thumbnail') . '</br>';

                echo '<h3>' . $user_data->display_name . '</h3></br>';

                echo '<span>Red Door Company</span></li>';

              }
            }

            ?>

                </ul>
            </div>

              </div>

            <script>

              jQuery(document).ready(function(){

                jQuery( function($){
                  // The carousel widget
                  jQuery('.rdc-agents-carousel-wrapper').each(function(){

                    var $$ = jQuery(this),
                      $postsContainer = $$.closest('.rdc-agents-carousel-container'),
                      $container = $$.closest('.rdc-agents-carousel-container').parent(),
                      $itemsContainer = $$.find('.rdc-agents-carousel-items'),
                      $items = $$.find('.rdc-agents-carousel-item'),
                      $firstItem = $items.eq(0);

                    var position = 0,
                      page = 1,
                      fetching = false,
                      numItems = $items.length,
                      totalPosts = $$.data('found-posts'),
                      complete = numItems == totalPosts,
                      itemWidth = ( $firstItem.width() + parseInt($firstItem.css('margin-right')) ),
                      isRTL = $postsContainer.hasClass('js-rtl'),
                      updateProp = isRTL ? 'margin-right' : 'margin-left';

                    var updatePosition = function() {
                      if ( position < 0 ) position = 0;
                      if ( position >= $$.find('.rdc-agents-carousel-item').length - 1 ) {
                        position = $$.find('.rdc-agents-carousel-item').length - 1;
                        // Fetch the next batch
                        if( !fetching &&  !complete ) {
                          fetching = true;
                          page++;
                          $itemsContainer.append('<li class="rdc-agents-carousel-item rdc-agents-carousel-loading"></li>');

                          jQuery.get(
                            $$.data('ajax-url'),
                            {
                              query : $$.data('query'),
                              action : 'sow_carousel_load',
                              paged : page
                            },
                            function (data, status){
                              var $items = $(data.html);
                              $items.appendTo( $itemsContainer ).hide().fadeIn();
                              $$.find('.rdc-agents-carousel-loading').remove();
                              numItems = $$.find('.rdc-agents-carousel-item').length;
                              complete = numItems == totalPosts;
                              fetching = false;
                            }
                          )
                        }
                      }
                      $itemsContainer.css('transition-duration', "0.45s");
                      $itemsContainer.css(updateProp, -( itemWidth * position) + 'px' );
                    };

                    $container.on( 'click', 'a.rdc-agents-carousel-previous',
                      function(e){
                        e.preventDefault();
                        position -= isRTL ? -1 : 1;
                        updatePosition();
                      }
                    );

                    $container.on( 'click', 'a.rdc-agents-carousel-next',
                      function(e){
                        e.preventDefault();
                        position += isRTL ? -1 : 1;
                        updatePosition();
                      }
                    );
                    var validSwipe = false;
                    var prevDistance = 0;
                    var startPosition = 0;
                    var velocity = 0;
                    var prevTime = 0;
                    var posInterval;
                    var negativeDirection = isRTL ? 'right' : 'left';

                    // Verify "swipe" method exists prior to invoking it.
                    if( 'function' === typeof $$.swipe ) {
                      $$.swipe( {
                        excludedElements: "",
                        triggerOnTouchEnd: true,
                        threshold: 75,
                        swipeStatus: function (event, phase, direction, distance, duration, fingerCount, fingerData) {
                          if ( phase == "start" ) {
                            startPosition = -( itemWidth * position);
                            prevTime = new Date().getTime();
                            clearInterval(posInterval);
                          }
                          else if ( phase == "move" ) {
                            if( direction == negativeDirection ) distance *= -1;
                            setNewPosition(startPosition + distance);
                            var newTime = new Date().getTime();
                            var timeDelta = (newTime - prevTime) / 1000;
                            velocity = (distance - prevDistance) / timeDelta;
                            prevTime = newTime;
                            prevDistance = distance;
                          }
                          else if ( phase == "end" ) {
                            validSwipe = true;
                            if( direction == negativeDirection ) distance *= -1;
                            if(Math.abs(velocity) > 400) {
                              velocity *= 0.1;
                              var startTime = new Date().getTime();
                              var cumulativeDistance = 0;
                              posInterval = setInterval(function () {
                                var time = (new Date().getTime() - startTime) / 1000;
                                cumulativeDistance += velocity * time;
                                var newPos = startPosition + distance + cumulativeDistance;
                                var decel = 30;
                                var end = (Math.abs(velocity) - decel) < 0;
                                if(direction == negativeDirection) {
                                  velocity += decel;
                                } else {
                                  velocity -= decel;
                                }
                                if(end || !setNewPosition(newPos)) {
                                  clearInterval(posInterval);
                                  setFinalPosition();
                                }
                              }, 20);
                            } else {
                              setFinalPosition();
                            }
                          }
                          else if( phase == "cancel") {
                            updatePosition();
                          }
                        }
                      } );
                    }


                    var setNewPosition = function(newPosition) {
                      if(newPosition < 50 && newPosition >  -( itemWidth * numItems )) {
                        $itemsContainer.css('transition-duration', "0s");
                        $itemsContainer.css(updateProp, newPosition + 'px' );
                        return true;
                      }
                      return false;
                    };
                    var setFinalPosition = function() {
                      var finalPosition = parseInt( $itemsContainer.css(updateProp) );
                      position = Math.abs( Math.round( finalPosition / itemWidth ) );
                      updatePosition();
                    };
                    $$.on('click', '.rdc-agents-carousel-item a',
                      function (event) {
                        if(validSwipe) {
                          event.preventDefault();
                          validSwipe = false;
                        }
                      }
                    )
                  } );
                } );

              });

            </script>
            <style>

              .rdc-agents-carousel-title {
                display: inline-block;
                padding-right: 15px;
                height: 20px;
              }
              .rdc-agents-carousel-title a.rdc-agents-carousel-next,
              .rdc-agents-carousel-title a.rdc-agents-carousel-previous {
                font-family: 'carousel-arrows';
                speak: none;
                display: block;
                float: right;
                overflow: hidden;
                margin-left: 2px;
                margin-top: 3px;
                font-style: normal;
                font-weight: normal;
                font-variant: normal;
                text-transform: none;
                font-size: 8px;
                line-height: 18px;
                width: 18px;
                text-align: center;
                /* Better Font Rendering =========== */
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                text-decoration: none;
                color: #FFFFFF;
                background: #333333;
                border-radius: 2px;
              }

              .rdc-agents-carousel-title a.rdc-agents-carousel-next{
                position: absolute;
                right: 15px;
                top: 50%;
              }
              .rdc-agents-carousel-title a.rdc-agents-carousel-previous {
                left: 15px;
                position: absolute;
                top: 50%;
              }

              .rdc-agents-carousel-title a.rdc-agents-carousel-next:hover,
              .rdc-agents-carousel-title a.rdc-agents-carousel-previous:hover {
                background: #444444;
              }
              .rdc-agents-carousel-title a.rdc-agents-carousel-next:before {
                content: "\e601";
              }
              .rdc-agents-carousel-title a.rdc-agents-carousel-previous:before {
                content: "\e600";
              }
              @media screen and (max-width: 600px) {
                .rdc-agents-carousel-title a.rdc-agents-carousel-previous {
                  display: none;
                }
                .rdc-agents-carousel a.rdc-agents-carousel-next {
                  display: none;
                }
              }
              .widget_rdc-agents-carousel {
                overflow-x: hidden;
                overflow-y: hidden;
              }
              .rdc-agents-carousel-wrapper {
                overflow: hidden;
                position: relative;
                left: 0;
                right: 0;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items {
                list-style: none;
                -webkit-transition: all 0.45s ease;
                -moz-transition: all 0.45s ease;
                -o-transition: all 0.45s ease;
                transition: all 0.45s ease;
                height: 200px;
                margin: 0;
                padding: 0;
                zoom: 1;
                width: 99999px;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items:before {
                content: '';
                display: block;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items:after {
                content: '';
                display: table;
                clear: both;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item {
                list-style: none;
                margin-left: 0;
                padding: 0;
                display: block;
                float: left;
                margin-right: 15px;
                width: 370px;
                overflow-x: hidden;
                overflow-y: hidden;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item:last-child {
                margin-right: 0;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item.rtl {
                float: right;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item.rtl:last-child {
                margin-right: 15px;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item .rdc-agents-carousel-thumbnail {
                line-height: 0;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item .rdc-agents-carousel-thumbnail a {
                display: block;
                width: 370px;
                height: 162px;
                background-size: 370px 162px;
                background-position: center center;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item .rdc-agents-carousel-thumbnail a,
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item .rdc-agents-carousel-thumbnail a span.overlay {
                -webkit-transition: all 0.35s ease;
                -moz-transition: all 0.35s ease;
                -o-transition: all 0.35s ease;
                transition: all 0.35s ease;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item .rdc-agents-carousel-thumbnail a span.overlay {
                display: block;
                width: 100%;
                height: 100%;
                background: #3279BB;
                opacity: 0;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item .rdc-agents-carousel-thumbnail a:hover span {
                opacity: 0;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item .rdc-agents-carousel-default-thumbnail {
                display: block;
                width: 370px;
                height: 162px;
                background: #E8E8E8;
                background: -webkit-gradient(linear, left bottom, left top, color-stop(0, #E0E0E0), color-stop(1, #E8E8E8));
                background: -ms-linear-gradient(bottom, #E0E0E0, #E8E8E8);
                background: -moz-linear-gradient(center bottom, #E0E0E0 0%, #E8E8E8 100%);
                background: -o-linear-gradient(#E8E8E8, #E0E0E0);
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item h3 {
                font-size: 15px;
                text-align: center;
                font-weight: 500;
                color: #474747;
                margin: 10px 0 0 0;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-item h3 a {
                text-decoration: none;
                color: inherit;
              }
              .rdc-agents-carousel-wrapper ul.rdc-agents-carousel-items li.rdc-agents-carousel-loading {
                display: block;
                width: 370px;
                height: 162px;
                float: left;
                background: url(images/carousel-loader.gif) #F6F6F6 center center no-repeat;
                margin: 0;
              }
              a.rdc-agents-carousel-previous {
                display: none;
              }
              a.rdc-agents-carousel-next {
                display: none;
              }


            </style>

            <div class="oneAgentLinksBlock">
              <a href="#">Request Information</a>
            </div>
          </div>
        </div>
      </section>
  </div>
  <div class="container">
    <div class="row">
      <div class="col-lg-7 col-md-7">
        This brand new home has more features than we can name here but just a few are: 10ft ceilings on the 1st floor & 9ft ceilings on the 2nd floor,
        granite countertops, ceramic tile floors, an enormous sitting room located in the master retreat.
      </div>
      <div class="col-lg-8 col-md-8">
        <ul class="propertyAttribute">
          <li>
            <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
            <span>Last Checked</span>
            <strong>12 minutes ago</strong>
          </li>
          <li>
            <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
            <span>Last Updated</span>
            <strong>12 minutes ago</strong>
          </li>
          <li>
            <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
            <span>Publiced on Site</span>
            <strong>12 minutes ago</strong>
          </li>
        </ul>
      </div>
      <div class="col-lg-7 col-md-7">
        <h4>Property Facts</h4>
      </div>
      <div class="col-lg-8 col-md-8 bottomSeparate">
        <ul class="propertyAttribute">
          <li>
            <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
            <span>Listing Type</span>
            <strong>3 Full, 1 Half</strong>
          </li>
          <li>
            <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
            <span>Lot size</span>
            <strong>2.23 acres</strong>
          </li>
          <li>
            <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
            <span></span>
            <strong>Traditional</strong>
          </li>
          <li>
            <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
            <span>Bathrooms</span>
            <strong>2 Full, 1 Half</strong>
          </li>
          <li>
            <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
            <span>Consutructed in</span>
            <strong>in 2014</strong>
          </li>
          <li>
            <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
            <span>Property Type</span>
            <strong>Condo</strong>
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        Utsa laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
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
        5000 Daviston Ct is house in Fuquay Varina, NC 27526. This 3,200 square foot house sits on a 2.23 acre lot and features
        4 bedrooms and 4 bathrooms. This house has been listed on Redfin since January 22, 2016 and is currently priced at $499,000.
        This property was built in 2016. The closest school is West Lake Middle School. 5000 Daviston Ct is near Action Park and South Park.
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
                <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
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
                <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
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
                <div><svg class="icon icon-management"><use xlink:href="#icon-management"/></svg></div>
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
        Information Not Guaranteed. ©2016 Triangle MLS Inc. All rights reserved. Listings marked with an <b style="font-style: normal; color: #000">TMLS IDX&#153;</b>
        icon are provided courtesy of the Triangle MLS, Inc. of North Carolina, Internet Data Exchange Database.
      </div>
    </div>
  </div>

<?php endwhile; ?>


<?php get_footer(); ?>