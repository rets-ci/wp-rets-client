<?php
/**
 * Purge Varnish Cache
 *
 *
 * @todo Use IO_WPCLOUD_DEPLOYMENT_HASH or CI_RABBIT_HASH for x-access-token ID.
 */

// varnish cache purging
add_action( 'save_post', 'rabbit_save_post_purging_handler', 50 );

/**
 * Save post purging handler
 *
 * @param $post_id
 */
function rabbit_save_post_purging_handler( $post_id ) {

  if(get_transient('rabbit_transient_' . $post_id)){
    return;
  }

  $r_args = array(
    "post_id" => $post_id,
    "post_link" => get_permalink( $post_id )
  );

  set_transient( 'rabbit_transient_' . $post_id, $r_args, 3 );

  // If this is just a revision, don't send the email.
  if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
    return;
  }

  // If not public PT
  if ( ! get_post_type_object( get_post( $post_id )->post_type )->public ) {
    return;
  }

  $post_url = get_permalink( $post_id );

  // Removes the URL added by WP, we need the original.
  $post_url = str_replace( '__trashed', '', $post_url );

  if( !$post_url ) {
    return;
  }

  rabbit_purge_url( $post_url );

}

/**
 * Purge Entire Site on Permalink Change.
 *
 *
 */
add_filter( 'generate_rewrite_rules', function( $wp_rewrite ) {

  // disabled for now, seems to run all the time on UD, for instance.
  // rabbit_purge_url( home_url( '/*' ) );

  return $wp_rewrite->rules;

}, 50 );

/**
 * Write to file log.
 *
 * @param $data
 */
function rabbit_write_log( $data ) {

  $data = "\n" . date("F j, Y, g:i a") . " - " . $data;

  if( file_exists( '/var/log/wpcloud.site/deployment.log' ) ) {
    @file_put_contents('/var/log/wpcloud.site/deployment.log', $data, FILE_APPEND );
  }

}

/**
 * Purge URL in Varnish/CloudFront. This is a nob-blocking request by default.
 *
 * This method will automatically utilize the current branch.
 *
 * Purge all cache:
 *
 *    rabbit_purge_url( home_url('/*') );
 *
 * Purge custom URL
 *    rabbit_purge_url( home_url('/my-custom-url') );
 *
 * Purge custom URL with custom get arguments.
 *    rabbit_purge_url( home_url('/my-custom-url?test=one') );
 *
 * Purge a permalink post.
 *    rabbit_purge_url( get_permalink('123456') );
 *
 * All purge activity written to /var/log/wpcloud.site/deployment.log file.
 *
 * @param $url
 * @param array $args
 * @return bool
 */
function rabbit_purge_url( $url, $args = array() ) {

  $args = wp_parse_args($args, array(
    'blocking' => defined( "WP_DEBUG" ) && WP_DEBUG ? true : false
  ));

  if( !$url ) {
    return false;
  }

  $parse = parse_url($url);

  if( !isset( $parse['path'] ) || !$parse['path'] ) {
    return false;
  }

  // The x-access-token is arbitrary.
  $purge_request_args = array(
    "method" => "PURGE",
    "headers" => array(
      "X-Access-Token" => isset( $_SERVER['HTTP_X_SELECTED_CONTAINER'] ) ? $_SERVER['HTTP_X_SELECTED_CONTAINER'] : '',
      "Host" => $parse['host'],
      "X-Set-Branch" => isset( $_SERVER['GIT_BRANCH'] ) ? $_SERVER['GIT_BRANCH'] : ''
    ),
    "blocking" => isset( $args['blocking'] ) ? $args['blocking'] : false
  );

  $_purge_url =  "http://c.rabbit.ci" . $parse['path'];

  if( isset( $parse['query'] ) ) {
    $_purge_url = $_purge_url . '?' . $parse['query'];
  }
  
  $_branch = isset($_SERVER['GIT_BRANCH'])?$_SERVER['GIT_BRANCH']:'';

  // make purge request to wpcloud.io. (this gets public DNS of wpcloud servers and then uses GCE load balancers to purge the appropriate machien based on hostname)
  $_purge = wp_remote_request( $_purge_url, $purge_request_args );

  if( isset( $args['post_id'] ) ) {
    rabbit_write_log( 'Post [' . $args['post_id']. '] updated. Purging cache at [' . $parse['host'] . str_replace( 'http://c.rabbit.ci', '', $_purge_url ) . '] url for ['.$_branch.'] branch.' );
  } else {
    rabbit_write_log( 'Purging cache at [' . $parse['host'] . str_replace( 'http://c.rabbit.ci', '', $_purge_url )  . '] url for ['.$_branch.'] branch.' );
  }

  if( $_purge && wp_remote_retrieve_body( $_purge ) && defined( "WP_DEBUG" ) ) {


    try {
      $_response = json_decode( wp_remote_retrieve_body( $_purge ), true );
	    $_response  = (object) array_merge( array( "branch" => $_branch, "url" => $_purge_url ), $_response  );
      rabbit_write_log( 'Purge response for [' . str_replace( 'http://c.rabbit.ci', '', $_purge_url )  . '], [' . $_response->message . '].' );
    } catch ( Exception $e ) {
      rabbit_write_log( ' - Unable to parse purge response.' );
    }

  }

  return isset( $_response ) ? $_response : true;

}


