<?php
/**
 * Plugin Name: Shameless Hacks
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: System hacks.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */

add_filter( 'ud:errors:admin_notices', function() { return null; });
add_filter( 'ud:messages:admin_notices', function() { return null; });
add_filter( 'ud:warnings:admin_notices', function() { return null; });

// force non-minified version of siteorigin scripts
define( 'SOW_BUNDLE_JS_SUFFIX', '' );

// stop sa bunch of options being written to wp_options table for things that'll be cached by varnish/cloudfront anyway.
add_filter('wpseo_enable_xml_sitemap_transient_caching','__return_false');



/**
 * Ported from [wp-content/themes/wp-reddoor/static/icons/icons.php], which seems to be loaded too late.
 *
 * @param $families
 * @return mixed
 */
function rdc_widgets_icon_families_filter( $families ){

  $bundled = array(
    'reddoorcompany' => __( 'Reddoorcompany', 'so-widgets-bundle' ),
    'wpproperty' => __( 'Wp-property', 'so-widgets-bundle' ),
  );

  foreach ( $bundled as $font => $name) {

    include_once get_template_directory(). '/static/icons/' . $font . '/filter.php';

    $families[$font] = array(
      'name' => $name,
      'style_uri' => get_template_directory_uri() . '/static/icons/' . $font . '/style.css?v=' . rand(),
      'icons' => apply_filters('siteorigin_widgets_icons_' . $font, array() ),
    );
  }

  return $families;

}

add_filter( 'siteorigin_widgets_icon_families', 'rdc_widgets_icon_families_filter' );

// Only activate tests when on a 'develop' branch.
if( isset( $_SERVER['GIT_BRANCH'] ) && strpos( $_SERVER['GIT_BRANCH'], 'develop' && isset( $_GET['_debug'] ) ) !== false ) {
  header( 'cache-control:no-cache, private' );

  $_event_map = array(
    "init" => [ 5, 10, 20 ],
    "after_setup_theme" => [ 5, 10, 20 ],
    "plugins_loaded" => [ 5, 10, 20 ],
    "wp" => [ 5, 10, 20 ],
    "wp_loaded" => [ 5, 10, 20 ],
    "template_redirect" => [ 5, 10, 20 ],
    "get_header" => [ 5, 10, 20 ],
  );

  foreach( $_event_map as $_action => $levels ) {
    //print_r($_action);die();

    foreach( $levels as $level ) {

      add_action($_action, function() {

        if( !headers_sent() ) {
          $data = '[time:' . timer_stop() . '],[action:' . current_action() . ']';

          if( isset( $__level ) && $__level ) {
            $data .= '[level:' . $__level . ']';
          }

          header( 'x-set-flag:' . $data, false );
        }

      }, $level );

    }

  }
  // time curl "https://www.reddoorcompany.com/listing_office/red-door-company/?wpp_search%5Bsale_type%5D=Rent" -H "x-set-branch:develop-andy" -H "x-edge:andy" -H "cache-control:no-cache" -H "pragma:no-cache" -I
  // time curl "http://localhost/listing_office/red-door-company/?wpp_search%5Bsale_type%5D=Rent" -H "x-set-branch:develop-andy" -H "x-edge:andy" -H "cache-control:no-cache" -H "pragma:no-cache" -H "x-forwarded-proto:https" -I

  // use to debug manually...
  // die('death. ' . __FILE__ . ' - ' . __LINE__ . ' - ' . timer_stop() );

  add_action('wp_print_scripts', function() {
    //die(current_action() . ' - ' . time()  . ' - ' . timer_stop());
  }, 0 );


}

// special handling for production branch
if( isset( $_SERVER['GIT_BRANCH'] ) && $_SERVER['GIT_BRANCH'] === '__production' ) {

  // disable plugin check
  remove_action('load-update-core.php','wp_update_plugins');

  // flush some update transient?
  add_filter('pre_site_transient_update_plugins','__return_null');


  // hide core update nag
  add_action('admin_menu',function() {
    remove_action( 'admin_notices', 'update_nag', 3 );
  });

  function rdc_remove_core_updates(){
    global $wp_version;

    return(object) array(
      'last_checked'=> time(),
      'version_checked'=> $wp_version
    );

  }
  // overwrite transients for core, plugin and theme updates
  add_filter('pre_site_transient_update_core','rdc_remove_core_updates');
  add_filter('pre_site_transient_update_plugins','rdc_remove_core_updates');
  add_filter('pre_site_transient_update_themes','rdc_remove_core_updates');

}

// override default wpp setttings
add_filter('wpp:supermap:defaults', function( $defaults ) {

  // makes supermap pages load much faster since all requesets are done via ajax calls
  $defaults['get_listings'] = 'false';
  return $defaults;
});

// Add support for /listing/{property_id} redirection

add_action( 'wp', 'rdc_wp_ghetto_term_redirection' );

/**
 * Ghetto Term Fallback.
 *
 * Elasticsearch will redirect to urls like "/elementary_school/highland-elementary-school"
 * which are not known to WP. So we reach-back to ES, find first document that has "highland-elementary-school" slug,
 * and get its tax_input, then use that to lookup the real term in WP.
 *
 * This is fucking terrible, I know, but can't think of any other way to deal with aggregated terms.
 *
 * @author potanin@UD
 * @param $query
 */
function rdc_wp_ghetto_term_redirection( $query ) {
  global $wp_query,$wp_properties;

  if(!$wp_query->is_404() || !defined( 'RETS_ES_LINK' ) || !$wp_query || !$wp_query->tax_query || !$wp_query->tax_query->queries ) {
    return;
  }

  $_data = array(
    "taxonomy" => $wp_query->tax_query->queries[0]['taxonomy'],
    "term" => $wp_query->tax_query->queries[0]['terms'][0]
  );

  // must be a known WPP taxonomy for us to consider.
  if( !in_array( $_data['taxonomy'], array_keys($wp_properties['taxonomies'])  ) ) {
    return;
  }

  // WP did not recognize taxonomy at all or if its wpp_location, which we are ignoring on purpose right now since its permalinks are not refined.
  if( !$_data['taxonomy'] || isset( $_data['taxonomy'] )  && $_data['taxonomy'] === 'wpp_location'  ) {
    return;
  }

  // when cached this is preetty snappy.
  if( $_cached = wp_cache_get( $query->request, 'retsci_term_redirection' ) ) {
    header('x-note:cached-redirection for [' . $query->request . '] key.' );
    die(wp_redirect( $_cached . ( $_SERVER['QUERY_STRING'] ? '?' . $_SERVER['QUERY_STRING'] : '' ) ) ) ;
  }

  // Search for term...
  $_request = wp_remote_post(RETS_ES_LINK . "/v5/property/_search", array(
    "headers" => array(),
    "body" => '{"size":1,"query": {"match": {"_search.' .  $_data['taxonomy'] . '":{"query": "' . $_data['term'] . '"}}}}'
  ));

  $_response = wp_remote_retrieve_body($_request);

  // This is bad. We identified the taxonomy and term but couldn't find any docs in ES.
  if( !count( json_decode( $_response )->hits->hits ) ) {
    $_link = get_home_url( null, '/buy' );
    //$_link = get_home_url( null, '/buy' ) . '?' . $_SERVER['QUERY_STRING'];
    wp_cache_set( $query->request, $_link, 'retsci_term_redirection' ) ;
    die(wp_redirect( $_link ));
  }

  // Get taxnomy VALUE of match in tax_input.
  $_term_name = json_decode( $_response )->hits->hits[0]->_source->tax_input->{$_data['taxonomy']}[0];

  // Query the term in WP
  $_term =  get_term_by('name', $_term_name, $_data['taxonomy']);

  // Get link to the term
  $_link = get_term_link($_term->term_id, $_term->taxonomy);

  if( $_cached = wp_cache_set( $query->request, $_link, 'retsci_term_redirection' ) ) {
  }

  // Redirect to it.
  header('x-note:uncached redirection');
  die(wp_redirect( $_link . (  $_SERVER['QUERY_STRING'] ? '?' . $_SERVER['QUERY_STRING'] : '' )));

}


add_action('wp_loaded', function() {
  global $wp_rewrite;

  if( isset($wp_rewrite) && isset($wp_rewrite->rules) && !isset( $wp_rewrite->rules['^listing/([0-9]+)/?$'])) {
    add_rewrite_rule('^listing/([0-9]+)/?$', 'index.php?p=$matches[1]', 'top');
    $wp_rewrite->flush_rules(true);
    // die( '<pre>' . print_r( get_option( 'rewrite_rules', true ), true ) . '</pre>' );
    // die('flushed rules');
  }

}, 20);
