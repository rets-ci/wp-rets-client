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
 * Template redirect from 404 on new template with new permalink
 *
 * @author vorobjov@UD
 */
function rdc_template_redirect()
{
  global $wp_query;

  if ($wp_query->is_404) {

    $REQUEST_URI = strtok($_SERVER['REQUEST_URI'], '?');
    $REQUEST_URI = substr($REQUEST_URI, 1);
    $request = explode('/', $REQUEST_URI);
    // Check on sale_type
    $sale_type_matches = array('sale', 'rent', 'commercial', 'sold');
    if (!in_array($request[0], $sale_type_matches)) { // if has not matches going to 404
      return false;
    }

    // Check on taxonomy
    $args = array(
      'public' => true,
      '_builtin' => false
    );
    $output = 'names';
    $operator = 'and';
    $taxonomies = get_taxonomies($args, $output, $operator);
    $taxonomy_type_matches = array();
    if ($taxonomies) {
      foreach ($taxonomies as $taxonomy) {
        $taxonomy_type_matches[] = $taxonomy;
      }
    }
    if (!in_array($request[1], $taxonomy_type_matches)) { // if has not matches going to 404
      return false;
    }

    // Check on terms
    $terms = get_terms(array('taxonomy' => $request[1]));
    $term_type_matches = array();
    if ($terms) {
      foreach ($terms as $term) {
        $term_type_matches[] = $term->slug;
      }
    }
    if (!in_array($request[2], $term_type_matches)) { // if has not matches going to 404
      return false;
    }

    $sale_type = 'sale_type=' . ucfirst($request[0]);
    $taxonomy_type = $request[1] . '=' . ucfirst($request[2]);

    $atts = array(
      $sale_type, $taxonomy_type
    );

    $wp_query->is_404 = false;
    add_filter('wp_title', 'custom_tax_title', 99, 2); // Page title hook
    rdc_rewrite_query($request);
    rdc_get_template_part('static/views/custom_taxonomy', $atts);
    status_header(200);
    die();
  }
}

add_action('template_redirect', 'rdc_template_redirect');

/**
 * wp_title Filter for new pages
 *
 * @author vorobjov@UD
 */
function custom_tax_title()
{
  $REQUEST_URI = strtok($_SERVER['REQUEST_URI'], '?');
  $REQUEST_URI = substr($REQUEST_URI, 1);
  $request = explode('/', $REQUEST_URI);

  $term = get_term_by('slug', $request[2], $request[1]);

  if (!empty(get_option('custom_seo_tax_title_' . $request[1] . '_' . $request[0]))) {
    $seo_title = get_option('custom_seo_tax_title_' . $request[1] . '_' . $request[0]);
  } else {
    $seo_option = get_option('wpseo_titles');
    $title_name = 'title-tax-' . $request[1];
    $seo_title = $seo_option[$title_name];
  }

  if (!empty(get_option('custom_seo_tax_description_' . $request[1] . '_' . $request[0]))) {
    add_filter('wpseo_metadesc', function ($seo_description) {
      $REQUEST_URI = strtok($_SERVER['REQUEST_URI'], '?');
      $REQUEST_URI = substr($REQUEST_URI, 1);
      $request = explode('/', $REQUEST_URI);
      $seo_description = get_option('custom_seo_tax_description_' . $request[1] . '_' . $request[0]);
      $term = get_term_by('slug', $request[2], $request[1]);
      $seo_description = str_replace('%%term_title%%', $term->name, $seo_description);

      return $seo_description;
    });
  }

  $sep = '|';
  $sitename = get_bloginfo('name');

  $seo_title = str_replace('%%term_title%%', $term->name, $seo_title);
  $seo_title = str_replace('%%sep%%', $sep, $seo_title);
  $seo_title = str_replace('%%sitename%%', $sitename, $seo_title);
  return $seo_title;
}

/**
 * Seo plugin meta rdc_rewrite_query()
 *
 * @author vorobjov@UD
 */
function rdc_rewrite_query($data)
{
  global $wp_query;

  $term_data = get_term_by('slug', $data[2], $data[1]);

  $wp_query->is_tax = true;
  $wp_query->is_archive = true;

  if ($wp_query->query['error'] == '404') {
    unset($wp_query->query['error']);
    $wp_query->query[$data[1]] = $data[2];
  }
  if ($wp_query->query_vars['error'] == '404') {
    $wp_query->query_vars['error'] = '';
    $wp_query->query_vars[$data[1]] = $data[2];
    $wp_query->query_vars['taxonomy'] = $data[1];
    $wp_query->query_vars['term'] = $data[2];
  }
  $wp_query->tax_query->queries = array(array(
    'taxonomy' => $data[1],
    'terms' => array($data[2]),
    'field' => 'slug',
    'operator' => 'IN',
    'include_children' => 1
  ));

  $wp_query->tax_query->queried_terms = array(
    $data[1] => array(
      'terms' => array($data[2]),
      'field' => 'slug'
    )
  );

  $wp_query->queried_object = $term_data;
  $wp_query->queried_object_id = $term_data->term_id;

  $get_posts = get_posts(array(
    'posts_per_page' => 6,
    'post_type' => 'property',
    'category' => 'taxonomy',
    'order_by' => 'post_date',
    'tax' => $term_data->term_taxonomy_id
  ));
  $get_post = get_post($get_posts[0]->ID);

  $wp_query->posts = $get_posts;
  $wp_query->post = $get_post;

  wpseo_frontend_head_init();

  add_filter('wpseo_opengraph_title', 'new_wpseo_title');
  add_filter('wpseo_twitter_title', 'new_wpseo_title');
  add_filter('wpseo_canonical', 'new_wpseo_canonical');
  add_filter('wpseo_next_rel_link', '__return_false'); // disable next link gag
}

function new_wpseo_canonical($canonical)
{
  $canonical = strtok($_SERVER['REQUEST_URI'], '?');
  $canonical = site_url() . $canonical;
  return $canonical;
}

function new_wpseo_title($title)
{
  $REQUEST_URI = strtok($_SERVER['REQUEST_URI'], '?');
  $REQUEST_URI = substr($REQUEST_URI, 1);
  $request = explode('/', $REQUEST_URI);

  $term = get_term_by('slug', $request[2], $request[1]);

  if (!empty(get_option('custom_seo_tax_title_' . $request[1] . '_' . $request[0]))) {
    $title = get_option('custom_seo_tax_title_' . $request[1] . '_' . $request[0]);
  } else {
    $seo_option = get_option('wpseo_titles');
    $title_name = 'title-tax-' . $request[1];
    $title = $seo_option[$title_name];
  }
  $sep = '|';
  $sitename = get_bloginfo('name');

  $title = str_replace('%%term_title%%', $term->name, $title);
  $title = str_replace('%%sep%%', $sep, $title);
  $title = str_replace('%%sitename%%', $sitename, $title);
  return $title;
}

add_action('admin_menu', function () {
  add_menu_page(__('RDC Custom SEO Settings', 'reddoor'), __('RDC SEO Settings', 'reddoor'), 'manage_options', 'site-options', 'rdc_custom_seo_settings', '', 99.1);
  add_action('admin_init', 'register_rdc_custom_seo_settings');
});

function register_rdc_custom_seo_settings()
{
  $taxonomies = get_taxonomies(array('public' => true), 'objects');
  foreach ($taxonomies as $tax) {
    register_setting('rdc-custom-seo-settings', 'custom_seo_tax_title_' . $tax->name . '_sale');
    register_setting('rdc-custom-seo-settings', 'custom_seo_tax_description_' . $tax->name . '_sale');
    register_setting('rdc-custom-seo-settings', 'custom_seo_tax_title_' . $tax->name . '_rent');
    register_setting('rdc-custom-seo-settings', 'custom_seo_tax_description_' . $tax->name . '_rent');
    register_setting('rdc-custom-seo-settings', 'custom_seo_tax_sitemap_' . $tax->name . '_sale');
    register_setting('rdc-custom-seo-settings', 'custom_seo_tax_sitemap_' . $tax->name . '_rent');
  }
}

function rdc_custom_seo_settings()
{
  $taxonomies = get_taxonomies(array('public' => true), 'objects');
  ?>
  <div class="wrap">

    <h1><?php _e('Custom taxonomies SEO settings'); ?></h1>

    <form action="options.php" method="POST">
      <?php

      settings_fields('rdc-custom-seo-settings');
      do_settings_sections('rdc-custom-seo-settings');

      foreach ($taxonomies as $tax) {
        $sale_title = get_option('custom_seo_tax_title_' . $tax->name . '_sale');
        $rent_title = get_option('custom_seo_tax_title_' . $tax->name . '_rent');
        $sale_description = get_option('custom_seo_tax_description_' . $tax->name . '_sale');
        $rent_description = get_option('custom_seo_tax_description_' . $tax->name . '_rent');
        $sale_sitemap = get_option('custom_seo_tax_sitemap_' . $tax->name . '_sale');
        $rent_sitemap = get_option('custom_seo_tax_sitemap_' . $tax->name . '_rent');

        echo '<div class="tax-box">';
        echo '<div class="tax-box-sale">';
        echo '<h2>' . esc_html(ucfirst($tax->labels->name)) . __(' (Sale)', 'reddoor') . '</h2>';
        echo '<table><tr>';
        echo '<td style="vertical-align: top"><label>' . __('Title', 'reddoor') . '</label></td>';
        echo '<td><input style="width: 400px; margin: 0px 0px 10px;" class="all-options" type="text" value="' . $sale_title . '" name="custom_seo_tax_title_' . $tax->name . '_sale" placeholder="' . __('Title', 'reddoor') . '" /></td>';
        echo '</tr><tr><td style="vertical-align: top"><label>' . __('Description', 'reddoor') . '</label></td>';
        echo '<td><textarea style="width: 400px" class="all-options" rows="5" name="custom_seo_tax_description_' . $tax->name . '_sale" placeholder="' . __('Description', 'reddoor') . '">' . $sale_description . '</textarea></td>';
        echo '</tr><tr><td style="vertical-align: top"><label>' . __('Sitemap options', 'reddoor') . '</label></td>';
        echo '<td><label><input type="radio" value="1" name="custom_seo_tax_sitemap_' . $tax->name . '_sale" ' . checked($sale_sitemap, '1', false) . ' class="" /> ' . __('In sitemap', 'reddoor') . '</label><br />';
        echo '<label><input type="radio" value="" name="custom_seo_tax_sitemap_' . $tax->name . '_sale" ' . checked($sale_sitemap, '', false) . ' class="" /> ' . __('Not in sitemap', 'reddoor') . '</label></td>';
        echo '</tr></table>';
        echo '</div>'; // Sale box

        echo '<div class="tax-box-rent">';
        echo '<h2>' . esc_html(ucfirst($tax->labels->name)) . __(' (Rent)', 'reddoor') . '</h2>';
        echo '<table><tr>';
        echo '<td style="vertical-align: top"><label>' . __('Title', 'reddoor') . '</label></td>';
        echo '<td><input style="width: 400px; margin: 0px 0px 10px;" class="all-options" type="text" value="' . $rent_title . '" name="custom_seo_tax_title_' . $tax->name . '_rent" placeholder="' . __('Title', 'reddoor') . '" /></td>';
        echo '</tr><tr><td style="vertical-align: top"><label>' . __('Description', 'reddoor') . '</label></td>';
        echo '<td><textarea style="width: 400px" class="all-options" rows="5" name="custom_seo_tax_description_' . $tax->name . '_rent" placeholder="' . __('Description', 'reddoor') . '">' . $rent_description . '</textarea></td>';
        echo '</tr><tr><td style="vertical-align: top"><label>' . __('Sitemap options', 'reddoor') . '</label></td>';
        echo '<td><label><input type="radio" value="1" name="custom_seo_tax_sitemap_' . $tax->name . '_rent" ' . checked($rent_sitemap, '1', false) . ' class="" /> ' . __('In sitemap', 'reddoor') . '</label><br />';
        echo '<label><input type="radio" value="" name="custom_seo_tax_sitemap_' . $tax->name . '_rent" ' . checked($rent_sitemap, '', false) . ' class="" /> ' . __('Not in sitemap', 'reddoor') . '</label></td>';
        echo '</tr></table>';
        echo '</div>'; // Rent box

        echo '</div>'; // box
        echo '<br />';
        echo '<br />';

      } // end foreach of taxonomies
      submit_button();
      ?>
    </form>
  </div>
  <?php
}

add_action('init', function () {
  $taxonomies = get_taxonomies(array('public' => true), 'objects');
  foreach ($taxonomies as $tax) {
    add_filter('wpseo_sitemap_' . $tax->name . '_content', function () {
      $current_filter = current_filter();
      $current_filter = str_replace('wpseo_sitemap_', '', $current_filter);
      $tax_name = str_replace('_content', '', $current_filter);
      $terms = get_terms(array('taxonomy' => $tax_name));
      $siteurl = site_url();
      $permalinks = '';
      $sale_sitemap = get_option('custom_seo_tax_sitemap_' . $tax_name . '_sale');
      $rent_sitemap = get_option('custom_seo_tax_sitemap_' . $tax_name . '_rent');
      foreach ($terms as $term) {
        if ($sale_sitemap && $sale_sitemap == true || $sale_sitemap && $sale_sitemap == 1) {
          $permalinks .= '<url><loc>' . $siteurl . '/sale/' . $tax_name . '/' . $term->slug . '</loc>
          <lastmod></lastmod>
		<changefreq></changefreq>
		<priority></priority>
	</url>';
        }
        if ($rent_sitemap && $rent_sitemap == true || $rent_sitemap && $rent_sitemap == 1) {
          $permalinks .= '<url><loc>' . $siteurl . '/rent/' . $tax_name . '/' . $term->slug . '</loc>
          <lastmod></lastmod>
		<changefreq></changefreq>
		<priority></priority>
	</url>';
        }
      }
      return $permalinks;
    });
  }
});