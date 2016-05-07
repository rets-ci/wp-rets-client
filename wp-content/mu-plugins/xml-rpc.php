<?php
/**
 *
 *
 * To debug, tail:
 * - /var/www/wp-content/debug.log
 * - /var/www/debug-log.log
 *
 * @version 0.5.0
 */

/**
 * Delete Elasticsearch documents when RETS properties are deleted.
 *
 * curl -XDELETE https://site:1d5f77cffa8e5bbc062dab552a3c2093@dori-us-east-1.searchly.com/v5/property/3215457
 *
 */
add_action('before_delete_post', function( $post_id ) {

  // Do nothing if does not have a "rets_index"
  if( !$_rets_index = get_post_meta( $post_id, 'rets_index', true ) ) {
    return;
  }

  // temporary hack to get post deletion/updates to work faster globally
  remove_filter( 'transition_post_status', '_update_term_count_on_transition_post_status', 10 );

  // this is a fire-and-forget event, we should be recording failure son our end to keep the WP process quicker
  wp_remote_request('https://site:1d5f77cffa8e5bbc062dab552a3c2093@dori-us-east-1.searchly.com/' . $_rets_index . '/property/' . $post_id, array(
    'method' => 'DELETE',
    'blocking' => false
  ));

});

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

    // get available image sizes
    $_image_sizes = UsabilityDynamics\Utility::all_image_sizes();

    // add "full" and "medium_large" sizes which are now standard
    if( !isset( $_image_sizes['full'] ) ) {
      $_image_sizes['full']['width'] = get_option('large_size_w');
      $_image_sizes['full']['height'] = get_option('large_size_h');
    }

    if( !isset( $_image_sizes['medium_large'] ) ) {
      $_image_sizes['medium_large']['width'] = get_option('medium_large_size_w');
      $_image_sizes['medium_large']['height'] = get_option('medium_large_size_h');
    }

    // return expected array of url, width, height
    return array( rdc_fix_rets_image_url( $attachment_id, $size ), $_image_sizes[$size]['width'], $_image_sizes[$size]['height'] );
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

  $response['sizes']['full'] = array(
      'height' => 'auto',
      'width' => 'auto',
      'url' => $attachment_url,
      'orientation' => 'landscape'
  );

  return $response;
} , 10, 3  );

add_filter( 'wp_get_attachment_metadata', function( $data, $post_id ) {
  global $_wp_additional_image_sizes;

  //die( '<pre>' . print_r( $_wp_additional_image_sizes, true ) . '</pre>' );
  // already have data, do nothing
  if( !empty( $data ) ) {
    return $data;
  }

  // check if this is one of our "remote files", if not, do nothing
  if ( !get_post_meta( $post_id, '_is_remote', 1 ) ) {
    return $data;
  }

  $_wp_attached_file = get_post_meta( $post_id, '_wp_attached_file', 1 );
  // get URL of attached file
  //_wp_attached_file
  $_intermediate_image_sizes = get_intermediate_image_sizes();


  $data = array(
    'width' => get_option('large_size_w'),
    'height' => get_option('large_size_h'),
    'file' => $_wp_attached_file,
    'sizes' => array(
      'thumbnail' => array(
        'file' => $_wp_attached_file,
        'width' => get_option('thumbnail_size_w'),
        'height' => get_option('thumbnail_size_h'),
      ),
      'medium' => array(
        'file' => $_wp_attached_file,
        'width' => get_option('medium_size_w'),
        'height' => get_option('medium_size_h'),
      ),
      'large' => array(
        'file' => $_wp_attached_file,
        'width' => get_option('large_size_w'),
        'height' => get_option('large_size_h'),
      ),
      'medium_large' => array(
        'file' => $_wp_attached_file,
        'width' => get_option('medium_large_size_w'),
        'height' => get_option('medium_large_size_h'),
      ),
    ),
    'image_meta' => array(
      'aperture' => '0',
      'credit' => '',
      'camera' => '',
      'caption' => '',
      'created_timestamp' => '0',
      'copyright' => '',
      'focal_length' => '0',
      'iso' => '0',
      'shutter_speed' => '0',
      'title' => '',
      'orientation' => '0',
      'keywords' => array()
    )
  );

  // add our intermediate image sizes
  foreach( $_wp_additional_image_sizes as $_size_name => $_size_detail ) {
    $data['sizes'][$_size_name] = array(
      'file' => $_wp_attached_file,
      'width' => $_size_detail['width'],
      'height' => $_size_detail['height'],
    );

  }

  //die( '<pre>' . print_r( $_intermediate_image_sizes, true ) . '</pre>' );
  //die( '<pre>' . print_r( $post_id, true ) . '</pre>' );
  return $data;

}, 10, 2 );

/**
 * @param $args
 * @return array
 */
function WPP_RPC_editProperty( $args ) {
  global $wp_xmlrpc_server, $wp_filter;

  $wp_xmlrpc_server->escape( $args );

  //$rest_json = file_get_contents("php://input");
  //rdc_write_log($rest_json);

  // remove filter which slows down updates significantly. (experimental)
  remove_filter( 'transition_post_status', '_update_term_count_on_transition_post_status', 10 );

  //remove_filter( 'transition_post_status', '_transition_post_status', 5 );
  //remove_filter( 'transition_post_status', '_wp_auto_add_pages_to_menu', 10 );
  //remove_filter( 'transition_post_status', '__clear_multi_author_cache', 10 );


  // view used transition_post_status actiosn
  // rdc_write_log( $wp_filter['transition_post_status'] );

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

  rdc_write_log( 'Have request wpp.editProperty request' );

  // rdc_write_log( '<pre>' . print_r( $post_data['meta_input'], true ) . '</pre>' );

  if( $post_data['meta_input']['rets_id'] ) {
    $post_data['ID'] = find_property_by_rets_id( $post_data['meta_input']['rets_id'] );
  } else {
    return array( 'ok' => false, 'error' => "Property missing RETS ID." );
  }

  // set post status to draft since it may be inserting for a while due to large amount of terms
  $post_data[ 'post_status' ] = 'draft';

  $_post_id = wp_insert_post( $post_data, true );

  if( is_wp_error( $_post_id ) ) {
    rdc_write_log( 'wp_insert_post error <pre>' . print_r( $_post_id, true ) . '</pre>' );
    rdc_write_log( 'wp_insert_post $post_data <pre>' . print_r( $post_data, true ) . '</pre>' );

    return array(
      "ok" => false,
      "message" => "Unable to insert post",
      "error" => $_post_id->get_error_message()
    );

  } else {

    rdc_write_log( 'Inserted property post as draft ' . $_post_id  );

  }

  if ( !empty( $post_data['meta_input']['rets_media'] ) && is_array( $post_data['meta_input']['rets_media'] ) ) {

    $_already_attached_media = array();
    $_new_media = array();

    $attached_media = get_attached_media( 'image', $_post_id );


    // get simple url litst of already attached media
    if( $attached_media  ) {

      // rdc_write_log( 'attached_media' . print_r($_already_attached_media, true ) );

      foreach( (array) $attached_media as $_attached_media_id => $_media ) {
        $_already_attached_media[ $_attached_media_id ] = $_media->guid;
      }

    }

    // delete all old attachments if the count of new media doesn't match up with old media
    // rdc_write_log( 'Deleting old media because count does not match.' );

    foreach( $attached_media as $_single_media_item ) {
      // rdc_write_log( 'Deleting [' .  $_single_media_item->ID . '] media item.' );
      wp_delete_attachment( $_single_media_item->ID, true );
    }

    if( count( $attached_media ) != count( $post_data['meta_input']['rets_media'] ) ) {
    }


    foreach( $post_data['meta_input']['rets_media'] as $media ) {

      if( in_array( $media['url'], $_already_attached_media ) ) {
        // rdc_write_log( "Skipping $media[url] because it's already attached to $_post_id" );
      }

    // attach media if a URL is set and it isn't already attached

      $filetype = wp_check_filetype( basename( $media['url'] ), null );

      $attachment = array(
        'guid'           => $media['url'],
        'post_mime_type' => $filetype['type'],
        'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $media['url'] ) ),
        'post_content'   => '',
        'post_status'    => 'inherit',
        'menu_order'     => $media['order'] ? ( (int) $media['order'] ) : null
      );

      $attach_id = wp_insert_attachment( $attachment, $media['url'], $_post_id );

      //rdc_update_media_metadata();

      $_new_media[] = $media['url'];

      update_post_meta( $attach_id, '_is_remote', '1' );

      // rdc_write_log( '$attach_id ' . $attach_id  . ' to ' . $_post_id );

      // set the item with order of 1 as the thumbnail
      if( (int) $media['order'] === 1 ) {
        set_post_thumbnail( $_post_id, $attach_id );
        // rdc_write_log( 'setting thumbnail ' . $attach_id  . ' to ' . $_post_id . ' because it has order of 1' );
      }

      // old logic of first checking that a new media url exists
      if ( !empty( $media['url'] ) && !in_array( $media['url'], $_already_attached_media ) ) {
      }


    }

    // newly inserted media is in $_new_media
    // old media is in $_already_attached_media
    // we get media that was attached before but not in new media

  }

  rdc_write_log( 'Publishing property post ' . $_post_id  );

  $_update_post = wp_update_post(array(
    'ID'           => $_post_id,
    'post_status'  => 'publish'
  ));

  if( !is_wp_error( $_update_post ) ) {
    rdc_write_log( 'Published property post ' . $_post_id  );
  } else {
    rdc_write_log( 'Error publishign post ' . $_post_id  );
    rdc_write_log( '<pre>' . print_r( $_update_post, true ) . '</pre>' );
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

  $_actual_post_id = $wpdb->get_col( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='rets_id' AND meta_value={$rets_id};" );

  // temp support for old format
  if( empty( $_actual_post_id ) ) {
    $_actual_post_id = $wpdb->get_col( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='rets.id' AND meta_value={$rets_id};" );
  }

  // this excludes any orphan meta as well as "inherit" posts, it will also use the post with ther LOWER ID meaning its more likely to be original
  $query = new WP_Query( array(
    'post_type'   => 'property',
    'meta_key'    => 'rets_id',
    'meta_value'  => $rets_id,
  ) );

  // what if there is two - we fucked up somewhere before...
  if( count( $query->posts ) > 0 ) {
    rdc_write_log( "Error! Multiple matches found for rets_id [" . $rets_id . "]." );
  }

  if( count( $query->posts ) > 0 ) {
    rdc_write_log( 'Found ' . $query->posts[0]->ID . ' using $rets_id: ' . $rets_id);
    return $query->posts[0]->ID;
  } else {
    rdc_write_log( 'Did not find any post ID using $rets_id [' . $rets_id . '].' );
  }

  return null;

}

/**
 * May need to do this to update metadata for images.
 *
 */
function rdc_update_media_metadata() {
  update_post_meta( $attach_id, '_wp_attachment_metadata', array(
    'width' => 2048,
    'height' => 1365,
    'file' => '2015/11/4738fd40-mature-real-estate-agent-meeting-future-homeowner.jpg',
    'sizes' =>
      array(
        'thumbnail' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-380x280.jpg',
            'width' => 380,
            'height' => 280,
            'mime-type' => 'image/jpeg',
          ),
        'medium' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-1200x800.jpg',
            'width' => 1200,
            'height' => 800,
            'mime-type' => 'image/jpeg',
          ),
        'large' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-2000x1333.jpg',
            'width' => 2000,
            'height' => 1333,
            'mime-type' => 'image/jpeg',
          ),
        'alm-thumbnail' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-150x150.jpg',
            'width' => 150,
            'height' => 150,
            'mime-type' => 'image/jpeg',
          ),
        'supermap_marker' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-32x21.jpg',
            'width' => 32,
            'height' => 21,
            'mime-type' => 'image/jpeg',
          ),
        'rdc-carousel-default' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-272x182.jpg',
            'width' => 272,
            'height' => 182,
            'mime-type' => 'image/jpeg',
          ),
        'sow-carousel-default' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-272x182.jpg',
            'width' => 272,
            'height' => 182,
            'mime-type' => 'image/jpeg',
          ),
        'ud-carousel-default' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-255x186.jpg',
            'width' => 255,
            'height' => 186,
            'mime-type' => 'image/jpeg',
          ),
        'slideshow' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-800x250.jpg',
            'width' => 800,
            'height' => 250,
            'mime-type' => 'image/jpeg',
          ),
        'property_carousel' =>
          array(
            'file' => '4738fd40-mature-real-estate-agent-meeting-future-homeowner-275x200.jpg',
            'width' => 275,
            'height' => 200,
            'mime-type' => 'image/jpeg',
          ),
      ),
    'image_meta' =>
      array(
        'aperture' => '0',
        'credit' => '',
        'camera' => '',
        'caption' => '',
        'created_timestamp' => '0',
        'copyright' => '',
        'focal_length' => '0',
        'iso' => '0',
        'shutter_speed' => '0',
        'title' => '',
        'orientation' => '0',
        'keywords' =>
          array(),
      ),
  ) );
}


/**
 * By the time the post_data gets here it already has an ID because get_default_post_to_edit() is used to create it
 *  it is created with "auto-draft" status but all meta is already added to it.
 *
 * - all post meta/terms added by this thing are attached to the original post, it seems
 * @param $data
 */
function rdc_write_log( $data ) {
  file_put_contents( '/var/www/debug-log.log', '' . print_r( $data, true ) . ' in ' . timer_stop() . ' seconds.' . "\n", FILE_APPEND  );
}
