<?php

require_once get_template_directory() . '/lib/classes/class-utils.php';
require_once get_template_directory() . '/lib/classes/class-bootstrap.php';
require_once get_template_directory() . '/lib/classes/class-widgets.php';
require_once get_template_directory() . '/lib/classes/class-property-hooks.php';
require_once get_template_directory() . '/lib/classes/class-customizer.php';
require_once get_template_directory() . '/lib/classes/class-ajax.php';
require_once get_template_directory() . '/lib/classes/class-shortcodes.php';

## Post Types
require_once get_template_directory() . '/lib/post-types/guide.php';

if (class_exists('SiteOrigin_Widget')) {
  require_once 'lib/widgets/rdc-post-carousel/post-carousel.php';
  require_once 'lib/widgets/rdc-tabbed-content/tabbed_content.php';
  require_once 'lib/widgets/rdc-masthead/rdc_masthead.php';
}

// Site icons
require_once get_template_directory() . '/static/icons/icons.php';

add_action('wp_enqueue_scripts', function () {

  // we need supermap on home page for search thing
  if (is_home() || is_front_page() || is_404()) {
    wp_enqueue_script('supermap-advanced');
  }

});

add_action('admin_enqueue_scripts', function () {
  wp_enqueue_style('rdc-admin', get_template_directory_uri() . '/static/styles/admin/style.css', false, '1.0.0');

});

new \UsabilityDynamics\RDC\Bootstrap();

/**
 *
 * @author potanin@UD
 * @param $name
 * @return array
 */
function rdc_get_attribute_group($name, $_propertySaleType, $pet_policy, $office)
{
  global $wp_properties, $post, $property;

  $listAttributes = array();
  $taxonomies = ud_get_wpp_terms('config.taxonomies', array());
  foreach ($wp_properties['property_stats_groups'] as $key => $value) {
    if ($value == $name) {
      if (array_key_exists($key, $taxonomies)) {
        $get_term_value = get_the_terms($property['ID'], $key);
        if (!empty($get_term_value[0]->name)) {
          $taxLabelName = get_taxonomy($key)->labels->name;
          $listAttributes[] = '<li><span class="field-label">' . $taxLabelName . ':</span> <span class="field-value">';
          if (($taxLabelName == 'Pet Policy') && (petPolicyChecking($_propertySaleType, $pet_policy, $office) == true)) :
            $listAttributes[] .= '<a href="' . get_site_url() . '/rent/pet-policy" target="_blank">';
            $listAttributes[] .= $get_term_value[0]->name;
            $listAttributes[] .= '</a>';
          else :
            $listAttributes[] .= $get_term_value[0]->name;
          endif;
          $listAttributes[] .= '</span></li>';
        }
      } else {
        if (isset($property["$key"]) && $property[$key] == true) {
          $listAttributes[] = '<li><span class="field-label">' . str_replace('_', ' ', ucwords($key)) . ':</span> <span class="field-value">Yes</span></li>';
        }
      }
    }
  }

  return $listAttributes;

}

/**
 * @author kavaribes@UD
 * @param $propertyDetailsAttrs
 * @return string
 * call in property.php
 */

function rdc_get_property_details_description($propertyDetailsAttrs)
{
  if (empty($propertyDetailsAttrs)) {
    return;
  } else {
    $propertyDetailsDescription = $propertyDetailsAttrs['location_address'];
    $propertyDetailsDescription .= ' is a ';
    $propertyDetailsDescription .= $propertyDetailsAttrs['property_type'];
    $propertyDetailsDescription .= ' for ';
    $propertyDetailsDescription .= $propertyDetailsAttrs['sale_type'];
    $propertyDetailsDescription .= ' in ';
    $propertyDetailsDescription .= $propertyDetailsAttrs['city'];
    $propertyDetailsDescription .= ', ';
    $propertyDetailsDescription .= $propertyDetailsAttrs['state'];
    $propertyDetailsDescription .= ' ';
    $propertyDetailsDescription .= $propertyDetailsAttrs['postal_code'];
    $propertyDetailsDescription .= '. This ';
    if ($propertyDetailsAttrs['total_living_area_sqft']) {
      $propertyDetailsDescription .= $propertyDetailsAttrs['total_living_area_sqft'] . ' square foot ';
    } else {
      $propertyDetailsDescription .= ' ';
    }
    $propertyDetailsDescription .= $propertyDetailsAttrs['property_type'];
    if ($propertyDetailsAttrs['approximate_lot_size']) {
      $propertyDetailsDescription .= ' sits on a ';
      $propertyDetailsDescription .= $propertyDetailsAttrs['approximate_lot_size'];
      $propertyDetailsDescription .= ' lot and features ';
    } else {
      $propertyDetailsDescription .= ' features ';
    }
    $propertyDetailsDescription .= $propertyDetailsAttrs['bedrooms'];
    $propertyDetailsDescription .= ' bedrooms and ';
    $propertyDetailsDescription .= $propertyDetailsAttrs['bathrooms'];
    $propertyDetailsDescription .= ' bathrooms. Built in ';
    $propertyDetailsDescription .= $propertyDetailsAttrs['year_built'];
    $propertyDetailsDescription .= ', this ';
    $propertyDetailsDescription .= $propertyDetailsAttrs['property_type'];
    $propertyDetailsDescription .= ' has been on the market for a total of ';
    $propertyDetailsDescription .= $propertyDetailsAttrs['cumulative_days_on_market'];
    $propertyDetailsDescription .= ' and is currently priced at $';
    $propertyDetailsDescription .= number_format($propertyDetailsAttrs['price']);

    if ($propertyDetailsAttrs['sale_type'] == 'rent') {
      $propertyDetailsDescription .= ' a month.';
    } else {
      $propertyDetailsDescription .= '.';
    }

    return $propertyDetailsDescription;
  }
}

add_filter('body_class', function ($classes, $class) {

  if (is_tax()) {
    $classes[] = 'is-taxonomy';
  }

  return $classes;
}, 20, 2);


/**
 * @author vorobjov@UD
 * @param $sale_value , $petpolicy_value, $office
 * @return boolean
 * call in property.php
 */

function petPolicyChecking($sale_value, $petpolicy_value, $office)
{
  if (($office == 'Red Door Company') && ($sale_value == 'rent') && ($petpolicy_value == 'Pets Negotiable' || $petpolicy_value == 'Pet Deposit' || $petpolicy_value == 'Pet Fee' || $petpolicy_value == 'Cats Allowed' || $petpolicy_value == 'Dogs Allowed' || $petpolicy_value == 'Dogs Allowed/Size Limit')) :
    return true;
  endif;
}

/**
 * @author vorobjov@UD
 * @param $template , $atts
 * call in functions.php
 */

function rdc_get_template_part($template, $atts = array())
{
  extract($atts);
  require locate_template($template . '.php');
}


/**
 * @author vorobjov@UD
 *
 */
function rdc_template_redirect()
{
//  global $wp_query;
//
//  if ($wp_query->is_404) {
//
//    $REQUEST_URI = $_SERVER['REQUEST_URI'];
//    if($REQUEST_URI !== '/sale/city/apex') {
//      return false;
//    }
//    $REQUEST_URI = substr($REQUEST_URI, 1);
//    $request = explode('/', $REQUEST_URI);
//
//    $sale = '/^sale/';
//    $city = '/^city/';
//
//    preg_match($sale, $request[0], $sale_type_matches);
//    if ($sale_type_matches !== '') {
//      $sale_type = 'sale_type=' . implode($sale_type_matches, ',');
//    }
//    preg_match($city, $request[1], $city_type_matches);
//    if ($city_type_matches !== '') {
//      $city_type = 'location_city=' . $request[2];
//    }
//
//    $atts = array(
//      $sale_type, $city_type
//    );
//
//    rdc_get_template_part('static/views/new_taxonomy', $atts);
//    status_header(200);
//    die();
//  }
}

//add_action('template_redirect', 'rdc_template_redirect');
