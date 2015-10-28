<?php
/**
 * RDC child theme based on WP-Madison 2.0
 */

/**
 * Load the contents of the lib directory.
 *
 * @since 1.0.0
 */
require_once( dirname( __FILE__ ) . '/lib/load.php' );

/**
 * Register widgets
 */
add_action('widgets_init', 'rdc_register_widgets');
function rdc_register_widgets() {
  register_widget( 'RDCScheduleShowing' );
  register_widget( 'RDCProspectLandlordForm' );
  register_widget( 'RDCContactForm' );
  register_widget( 'RDCFeedbackForm' );
  register_widget( 'RDCReferralProgramForm' );
}

/**
 * Enqueue parent style hook
 */
add_action( 'wp_enqueue_scripts', 'rdc_theme_enqueue_scripts' );

/**
 * Enqueue parent style
 */
function rdc_theme_enqueue_scripts() {
  wp_enqueue_style( 'parent-style', get_template_directory_uri() . '/style.css' );
  wp_enqueue_script( 'rdc-common', get_stylesheet_directory_uri() . '/static/js/rdc-common.js', array( 'jquery' ) );
  wp_enqueue_style( 'rdc-icons', get_stylesheet_directory_uri() . '/static/fonts/rdc/style.css', array(), '4.0.3' );

  $recaptcha = get_theme_mod( 'rdc_recaptcha_key' );
  if( !empty( $recaptcha ) ) {
    wp_enqueue_script( 'google-recaptcha-api', 'https://www.google.com/recaptcha/api.js' );
  }
}

/**
 * Register additional nav menu
 */
register_nav_menu( 'header-secondary', __('Secondary Header Menu') );
register_nav_menu( 'footer', __('Footer Menu') );

/**
 * Change property CPT a bit
 */
add_filter( 'wpp_post_type', 'rdc_property_rewrite' );
function rdc_property_rewrite( $args ) {
  $args['rewrite']['with_front'] = false;
  return $args;
}

/**
 * Fix permalinks for tax
 */
add_filter( 'wpp::register_taxonomy', 'rdc_tax_rewrite', 10, 2 );
function rdc_tax_rewrite( $args, $tax ) {
  $args['rewrite']['with_front'] = false;
  return $args;
}

/**
 * Change default image
 */
add_filter( 'madison_custom_header_args', function( $defaults ) {
  $defaults[ 'default-image' ] = get_stylesheet_directory_uri() . '/static/images/default-logo.png';
  $defaults[ 'width' ] = 540;
  $defaults[ 'height' ] = 200;
  return $defaults;
} );

/**
 * Multi Purpose Search Logic
 */
add_action( 'template_redirect', function(){

  if( isset( $_REQUEST[ 'mps' ] ) ) {
    $url = untrailingslashit( home_url() );
    $query = !empty( $_REQUEST[ 's' ] ) ? $_REQUEST[ 's' ] : '';
    if( !empty( $_REQUEST[ 'post_type' ] ) && $_REQUEST[ 'post_type' ] == 'property' ) {
      if( !function_exists( 'ud_get_wp_property' ) ) {
        return;
      }
      $url .= '/' . ud_get_wp_property( 'configuration.base_slug' ) . '?wpp_search[s]=' . urlencode( $query );
    } else {
      $url .= '?s=' . urlencode( $query );
    }
    wp_redirect( $url );
  }

}, 99 );

/**
 * Enable only Post and Pages post types for global search.
 */
add_action( 'parse_request', function( $query ) {

  if( isset( $_REQUEST[ 's' ] ) && !isset( $_REQUEST[ 'wpp_search' ] ) ) {

    add_filter( 'pre_get_posts', function( $query ) {
      if( !empty( $query->query_vars[ 's' ] ) ) {
        $query->set('post_type', array( 'post' ) );
      }
      return $query;
    } );

  }

  return $query;
}, 99 );


/**
 * Register(Un-register) widgetized area and update sidebar
 * with default widgets.
 */
add_action( 'widgets_init', function(){
  unregister_sidebar( 'footer-1' );
}, 99 );

/**
 * HACK
 * Fixes EXTRA output in header.
 *
 * In some cases Wordpress SEO prints HTML content of post to header when SiteOrigin is enabled for post
 *
 * @author peshkov@UD
 */
add_action( 'wp_head', function() {
  remove_action( 'the_content', 'siteorigin_panels_filter_content' );
}, 1 );
add_action( 'wp_head', function() {
  add_filter( 'the_content', 'siteorigin_panels_filter_content' );
}, 999 );

/**
 * Add spaces after comma for imported values
 *
 * @author peshkov@UD
 */
add_filter( 'wpp_xml_import_value_on_import', function( $value ){
  $value = preg_replace( '#([a-z,0-9])(,)([a-z,0-9])#i', '$1, $3', $value );
  return $value;
}, 10 );


/**
 * Validate reCAPTCHA and send form to external server.
 *
 */
add_action( 'template_redirect', function() {

  if( isset( $_REQUEST[ 'rdc_action' ] ) && $_REQUEST[ 'rdc_action' ] == 'submit_form' && !empty( $_POST[ 'rdc_fyb' ] ) ) {

    $key = get_theme_mod( 'rdc_recaptcha_key' );
    $secret = get_theme_mod( 'rdc_recaptcha_secret' );
    $redirect = isset( $_POST[ 'ignore_redirecturl' ] ) ? $_POST[ 'ignore_redirecturl' ] : '';

    try {

      if( !empty( $key ) && !empty( $secret ) ) {

        if (empty($_POST['g-recaptcha-response'])) {
          throw new Exception('No captcha response');
        }

        $recaptcha = $_POST['g-recaptcha-response'];
        unset($_POST['g-recaptcha-response']);

        $request = wp_remote_post('https://www.google.com/recaptcha/api/siteverify?secret=' . $secret . '&response=' . $recaptcha);

        if (is_wp_error($request) || wp_remote_retrieve_response_code($request) != 200) {
          throw new Exception('Invalid response from Captcha API');
        }

        $response = wp_remote_retrieve_body($request);
        $response = @json_decode($response, true);

        if (empty($response['success']) || !$response['success']) {
          throw new Exception('Captcha is not valid');
        }

      }

      $url = $_POST[ 'rdc_fyb' ];

      unset( $_POST[ 'rdc_fyb' ] );

      $data = $_POST;
      $data[ 'ignore_redirecturl' ] = '';

      $response = wp_remote_post( $url, array(
        'body' => $data,
      ) );

      if( is_wp_error( $response ) || wp_remote_retrieve_response_code( $response ) != 200 ) {
        throw new Exception( 'Invalid response from CRM Server' );
      }

      /**
       * If not error - autoincrement review count
       */
      global $post;
      if ( $page_widgets = get_post_meta($post->ID, 'panels_data', 1) ) {
        if ( !empty($page_widgets['widgets']) && is_array($page_widgets['widgets']) ) {
          foreach ($page_widgets['widgets'] as &$widget) {
            if ( $widget['panels_info']['class'] == 'SiteOrigin_Widget_Rating_Widget' ) {
              $widget['total_reviews']++;
              update_post_meta($post->ID, 'panels_data', $page_widgets);
              break;
            }
          }
        }
      }

    } catch( Exception $e ) {

      wp_redirect( home_url() . '/success/error' );

    }

    if( !empty( $redirect ) ) {
      wp_redirect( $redirect );
    } else {
      wp_redirect( home_url() );
    }

  }

} );

/**
 * Convert date format
 */
add_filter( 'wpp::attribute::display', function( $attribute_value, $meta_key ) {
  global $wp_properties;
  if ( empty( $wp_properties['admin_attr_fields'][$meta_key] ) || $wp_properties['admin_attr_fields'][$meta_key] != 'date' ) return $attribute_value;
  return date(get_option('date_format'), strtotime( $attribute_value ));
}, 10, 2);