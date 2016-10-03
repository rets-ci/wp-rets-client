<?php

add_filter('site_transient_update_plugins', function( $response, $transient ) {

  return $response;
  
  //die( '<pre>' . print_r( $_response['body'], true ) . '</pre>' );
  if( !$response || !is_array( $response->response )) {
    return $response;
  }

  // Last check was very recent. (This doesn't seem to be right place for this)
  // if( $response->last_checked && ( time() - $response->last_checked ) < 30 ) { return $response; }

  try {

    // Must be able to parse composer.json from plugin file, hopefully to detect the "_build.sha" field.
    $_composer = json_decode( file_get_contents( WP_PLUGIN_DIR . '/wp-rabbit/composer.json' )  );

    if( is_object( $_composer ) && $_composer->extra && $_composer->extra->_build && $_composer->extra->_build->sha ) {
      $_version = $_composer->extra->_build->sha;
    }

  } catch ( \Exception $e ) {}

  // todo use real plugin version if there is no build.sha in composer.json
  if( !isset( $_version ) || !$_version ) {
    $_version = '2.0';
  }

  // Make API call which will tell us if we are using the latest version or not.
  $_response = wp_remote_get( 'https://api.usabilitydynamics.com/v1/product/updates/wp-rabbit/latest/?version=' . $_version );
  die( '<pre>' . print_r( $_response, true ) . '</pre>' );
  if( wp_remote_retrieve_response_code( $_response ) === 200 ) {
    $_body = wp_remote_retrieve_body( $_response );
    $_body = json_decode( $_body );

    // If there is no "data" field then we have nothing to update.
    if( $_body->data ) {
      $response->response['wp-rabbit/wp-rabbit.php'] = $_body->data;
      unset( $response->no_update['wp-rabbit/wp-rabbit.php'] );
    }

  }

  return $response;

}, 10, 2 );

// show a custom message next to the update nag, perhaps display last commit message or something
add_action( 'in_plugin_update_message-wp-rabbit/wp-rabbit.php', function( $plugin_data, $response  ) {
  if( $response && $response->message ) {
    echo $response->message;
  } else {
    echo 'You are seeing this because you subscribed to latest updates.';
  }
}, 10, 2);
