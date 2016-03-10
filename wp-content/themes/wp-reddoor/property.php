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
            <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/OneAgent.png" alt="" />
            <h3>Denis Zabelin</h3>
            <span>Red Door Company</span>
            <div class="oneAgentLinksBlock">
              <a href="#">Request Information</a>
            </div>
          </div>
        </div>
      </section>
  </div>
  <div class="container bottomSeparate">
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
      <div class="col-lg-8 col-md-8">
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
      <div class="col-lg-7 col-md-7">
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab" href="#Ameneties">Ameneties</a></li>
          <li><a data-toggle="tab" href="#Commute">Commute</a></li>
          <li><a data-toggle="tab" href="#Street">Street View</a></li>
          <li><a data-toggle="tab" href="#Satellite">Satellite</a></li>
        </ul>

        <div class="tab-content">
          <div id="Ameneties" class="tab-pane fade in active">
            <p>Some content.</p>
          </div>
          <div id="Commute" class="tab-pane fade">
            <p>Some content in menu 1.</p>
          </div>
          <div id="Street" class="tab-pane fade">
            <p>Some content in menu 1.</p>
          </div>
          <div id="Satellite" class="tab-pane fade">
            <p>Some content in menu 1.</p>
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
      <div class="col-lg-7 col-md-7">
        <ul class="nav nav-tabs">
          <li class="active"><a data-toggle="tab" href="#Rooms">Rooms</a></li>
          <li><a data-toggle="tab" href="#Features">Features</a></li>
          <li><a data-toggle="tab" href="#Neighborhood">Neighborhood</a></li>
          <li><a data-toggle="tab" href="#PropertyLot">Property & Lot</a></li>
        </ul>

        <div class="tab-content">
          <div id="Rooms" class="tab-pane fade in active">
            <p>Some content.</p>
          </div>
          <div id="Features" class="tab-pane fade">
            <p>Some content in menu 1.</p>
          </div>
          <div id="Neighborhood" class="tab-pane fade">
            <p>Some content in menu 1.</p>
          </div>
          <div id="PropertyLot" class="tab-pane fade">
            <p>Some content in menu 1.</p>
          </div>
        </div>
      </div>
    </div>
  </div>


<?php endwhile; ?>


<?php get_footer(); ?>