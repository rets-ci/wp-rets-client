<?php
/**
 *
 * 
 * 
 * @version 0.5.0
 */



// add ability to get wpp_settings so we can extra mapping settings
add_filter( 'xmlrpc_blog_options', function( $options ) {

  $options['wpp_settings'] = array(
    'desc'          => __( 'WP-Property options.' ),
    'readonly'      => true,
    'option'        => 'wpp_settings'
  );

  return $options;

});

add_filter( 'xmlrpc_methods', function( $_methods ) {

  $_methods['wpp.editProperty'] = 'WPP_RPC_editProperty';

  return $_methods;

});

/**
 * Filters in order to make remote images to work
 */
add_filter( 'image_downsize', function( $false, $id, $size ) {

  if ( get_post_meta( $id, '_is_remote', 1 ) ) {
    return array( rdc_fix_rets_image_url( $id, $size ) );
  }

  return $false;

}, 10, 3);

/**
 * Filters in order to make remote images to work
 */
add_filter( 'wp_get_attachment_url', function( $url, $post_id ) {

  if ( get_post_meta( $post_id, '_is_remote', 1 ) ) {
    return rdc_fix_rets_image_url( $post_id );
  }

  return $url;
}, 10, 2);

/**
 *
 */
add_filter( 'wp_get_attachment_image_src', function( $image, $attachment_id, $size, $icon ){

  if ( get_post_meta( $attachment_id, '_is_remote', 1 ) ) {
    return array( rdc_fix_rets_image_url( $attachment_id, $size ) );
  }

  return $image;
}, 10, 4);

/**
 * Filters in order to make remote images to work
 */
add_filter ( 'wp_prepare_attachment_for_js',  function( $response, $attachment, $meta ){

  $size_array = get_intermediate_image_sizes();

  $response['sizes'] = array();

  foreach ( $size_array as $size ) {

    $attachment_url = wp_get_attachment_url($attachment->ID);

    $response['sizes'][$size] = array(
        'height' => 'auto',
        'width' => 'auto',
        'url' => $attachment_url,
        'orientation' => 'landscape'
    );

  }

  return $response;
} , 10, 3  );

function WPP_RPC_editProperty( $args ) {
  global $wp_xmlrpc_server;

  $wp_xmlrpc_server->escape( $args );

  $username = $args[1];
  $password = $args[2];
  $post_data = $args[3];

  if ( !$user = $wp_xmlrpc_server->login($username, $password) ) {
    return array(
      'ok' => false,
      'invalid' => $user,
      'error' => $wp_xmlrpc_server->error,
      'username' => $username,
      'password' => $password,
    );
  }

  write_log( 'Have request wpp.editProperty request' );

  if( $post_data['meta_input']['rets_id'] ) {
    $post_data['ID'] = find_property_by_rets_id( $post_data['meta_input']['rets_id'] );
  }

  $_post_id = wp_insert_post( $post_data, true );

  write_log( 'Inserted property post ' . $_post_id  );

  if ( !empty( $post_data['meta_input']['rets_media'] ) && is_array( $post_data['meta_input']['rets_media'] ) ) {

    $_already_attached_media = array();

    // get simple url litst of already attached media
    if( $attached_media = get_attached_media( 'image', $_post_id ) ) {

      // write_log( 'attached_media' . print_r($_already_attached_media, true ) );

      foreach( (array) $attached_media as $_attached_media_id => $_media ) {
        $_already_attached_media[ $_attached_media_id ] = $_media->guid;
      }

    }

    if( !empty( $_already_attached_media ) ) {
      // write_log( '$_post_id ' . $_post_id . ' already has already_attached_media ' . count( $_already_attached_media  ) );
    }

    foreach( $post_data['meta_input']['rets_media'] as $media ) {

      if( in_array( $media['url'], $_already_attached_media ) ) {
        // write_log( "Skipping $media[url] because it's already attached to $_post_id" );
      }

      // attach media if a URL is set and it isn't already attached
      if ( !empty( $media['url'] ) && !in_array( $media['url'], $_already_attached_media ) ) {

        $filetype = wp_check_filetype( basename( $media['url'] ), null );

        $attachment = array(
          'guid'           => $media['url'],
          'post_mime_type' => $filetype['type'],
          'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $media['url'] ) ),
          'post_content'   => '',
          'post_status'    => 'inherit'
        );

        $attach_id = wp_insert_attachment( $attachment, $media['url'], $_post_id );

        update_post_meta( $attach_id, '_is_remote', '1' );

        // write_log( '$attach_id ' . $attach_id  . ' to ' . $_post_id );

        // set the item with order of 1 as the thumbnail
        if( $media['order'] === 1 ) {
          set_post_thumbnail( $_post_id, $attach_id );
          write_log( 'setting thumbnail ' . $attach_id  . ' to ' . $_post_id . ' because it has order of 1' );
        }

      }


    }

    //array_values($array)[0];

    // write_log( 'already_attached_media' . print_r($_already_attached_media, true));
    // write_log( 'new media' . print_r($post_data['meta_input']['rets.media'], true));


  }

  return array(
    "ok" => true,
    "post_id" => $_post_id,
    "permalink" => get_the_permalink( $_post_id ),
    //"args" => $args,
    //"user" => $user
  );

}

function rdc_fix_rets_image_url( $id, $size = false ) {

  // get available image sizes
  $_image_sizes = UsabilityDynamics\Utility::all_image_sizes();

  // get image url of remote asset
  $_url = get_post_meta( $id, '_wp_attached_file', true );

  //die('$size'.$size);
  // if the size exists in image sizes, append the image-size spedific annex to url
  if( $size && array_key_exists( $size, $_image_sizes ) ) {
    $_extension = pathinfo( $_url, PATHINFO_EXTENSION );
    $_url = str_replace( '.' . $_extension, '-' . $_image_sizes[$size]['width'] . 'x' . $_image_sizes[$size]['height'] . '.' . $_extension, $_url );
  }

  // return finished url
  return  $_url;

}

function find_property_by_rets_id( $rets_id ) {
  global $wpdb;

  $_actual_post_id = $wpdb->get_var( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='rets_id' AND meta_value={$rets_id};" );

  // temp support for old format
  if( !$_actual_post_id ) {
    $_actual_post_id = $wpdb->get_var( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='rets.id' AND meta_value={$rets_id};" );
  }

  if( $_actual_post_id ) {
    write_log( 'Found ' . $_actual_post_id . ' using $rets_id: ' . $rets_id);
    return $_actual_post_id;
  }


  return null;


}

/**
 * By the time the post_data gets here it already has an ID because get_default_post_to_edit() is used to create it
 *  it is created with "auto-draft" status but all meta is already added to it.
 *
 * - all post meta/terms added by this thing are attached to the original post, it seems
 * @param $data
 */
function write_log( $data ) {
  file_put_contents( '/var/www/debug-log.log', '' . print_r( $data, true ) . ' in ' . timer_stop() . ' seconds.' . "\n", FILE_APPEND  );
}
