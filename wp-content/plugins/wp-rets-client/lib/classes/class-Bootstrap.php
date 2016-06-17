<?php
/**
 * Bootstrap
 *
 * @since 0.2.0
 */
namespace UsabilityDynamics\WPRETSC {

  if( !class_exists( 'UsabilityDynamics\WPRETSC\Bootstrap' ) ) {

    final class Bootstrap extends \UsabilityDynamics\WP\Bootstrap_Plugin {
      
      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type UsabilityDynamics\WPRETSC\Bootstrap object
       */
      protected static $instance = null;
      
      /**
       * Instantaite class.
       */
      public function init() {

        /**
         * Prevent blocking XML-RPC by third party plugins or themes
         */
        add_filter('xmlrpc_enabled', '__return_true', 100);

        add_action('init', function() {

          // Needed for import associationa and tracking of what schedule a listing came from
          register_taxonomy( 'rets_schedule', array( 'property' ), array(
            'hierarchical'      => false,
            //'update_count_callback' => null,
            'labels'            => array(
              'name'              => _x( 'Schedules', 'taxonomy general name' ),
              'singular_name'     => _x( 'Schedule', 'taxonomy singular name' ),
              'search_items'      => __( 'Search Schedules' ),
              'all_items'         => __( 'All Schedules' ),
              'parent_item'       => __( 'Parent Schedule' ),
              'parent_item_colon' => __( 'Parent Schedule:' ),
              'edit_item'         => __( 'Edit Schedule' ),
              'update_item'       => __( 'Update Schedule' ),
              'add_new_item'      => __( 'Add New Schedule' ),
              'new_item_name'     => __( 'New Schedule Name' ),
              'menu_name'         => __( 'Schedules' ),
            ),
            'show_ui'           => true,
            'show_admin_column' => false,
            'query_var'         => false,
            'rewrite'           => false
          ) );

        });

        /**
         * Delete Elasticsearch documents when RETS properties are deleted.
         *
         * @todo: we must not remove property on ES directly! Implement RETS API on `api.rets.ci` for it
         */
        add_action( 'before_delete_post', function( $post_id ) {

          // Do nothing if does not have a "rets_index"
          if( !$_rets_index = get_post_meta( $post_id, 'rets_index', true )) {
            return;
          }

          if( !defined( 'RETS_ES_LINK' ) ) {
            return;
          }

          // temporary hack to get post deletion/updates to work faster globally
          remove_filter( 'transition_post_status', '_update_term_count_on_transition_post_status', 10 );

          // this is a fire-and-forget event, we should be recording failure son our end to keep the WP process quicker
          wp_remote_request( trailingslashit( RETS_ES_LINK ) . $_rets_index . '/property/' . $post_id, array(
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

          $_methods['wpp.editProperty'] = array( $this, 'wpp_rpc_edit_property' );

          return $_methods;

        });

        /**
         * Filters in order to make remote images to work
         */
        add_filter( 'image_downsize', function( $false, $id, $size ) {

          if ( get_post_meta( $id, '_is_remote', 1 ) ) {
            return array( $this->fix_rets_image_url( $id, $size ) );
          }

          return $false;

        }, 10, 3);

        /**
         * Filters in order to make remote images to work
         */
        add_filter( 'wp_get_attachment_url', function( $url, $post_id ) {

          if ( get_post_meta( $post_id, '_is_remote', 1 ) ) {
            return $this->fix_rets_image_url( $post_id );
          }

          return $url;
        }, 10, 2);

        /**
         *
         */
        add_filter( 'wp_get_attachment_image_src', function( $image, $attachment_id, $size, $icon ){

          if ( get_post_meta( $attachment_id, '_is_remote', 1 ) ) {

            // get available image sizes
            $_image_sizes = \UsabilityDynamics\Utility::all_image_sizes();

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
            return array( $this->fix_rets_image_url( $attachment_id, $size ), $_image_sizes[$size]['width'], $_image_sizes[$size]['height'] );
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

      }

      /**
       *
       * @param $args
       * @return array
       */
      public function wpp_rpc_edit_property( $args ) {
        global $wp_xmlrpc_server, $wp_filter;

        $wp_xmlrpc_server->escape( $args );

        //$rest_json = file_get_contents("php://input");
        //$this->write_log($rest_json);

        // remove filter which slows down updates significantly. (experimental)
        remove_filter( 'transition_post_status', '_update_term_count_on_transition_post_status', 10 );

        //remove_filter( 'transition_post_status', '_transition_post_status', 5 );
        //remove_filter( 'transition_post_status', '_wp_auto_add_pages_to_menu', 10 );
        //remove_filter( 'transition_post_status', '__clear_multi_author_cache', 10 );


        // view used transition_post_status actiosn
        // $this->write_log( $wp_filter['transition_post_status'] );

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

        $this->write_log( 'Have request wpp.editProperty request' );

        // $this->write_log( '<pre>' . print_r( $post_data['meta_input'], true ) . '</pre>' );

        if( isset( $post_data['meta_input']['rets_id'] ) ) {
          $post_data['meta_input']['wpp::rets_pk'] = $post_data['meta_input']['rets_id'];
        }

        $post_data['meta_input']['wpp_import_time'] = time();

        if( $post_data['meta_input']['rets_id'] ) {
          $post_data['ID'] = $this->find_property_by_rets_id( $post_data['meta_input']['rets_id'] );
        } else {
          return array( 'ok' => false, 'error' => "Property missing RETS ID." );
        }

        // set post status to draft since it may be inserting for a while due to large amount of terms
        $post_data[ 'post_status' ] = 'draft';

        if( !empty( $post_data['ID'] ) ) {
          $this->write_log( 'Running wp_insert_post for [' . $post_data['ID'] . '].' );
          $_post = get_post( $post_data['ID'] );
          // If post_date is not set wp_insert_post function sets the current datetime.
          // So we are preventing to do it by setting already existing post_date. peshkov@UD
          $post_data[ 'post_date' ] = $_post->post_date;
          // Status could be changed manually by administrator.
          // So we are preventing to publish property again in case it was trashed. peshkov@UD
          $post_data[ 'post_status' ] = $_post->post_status;

        } else {
          $this->write_log( 'Running wp_insert_post for [new post].' );
        }


        $_post_id = wp_insert_post( $post_data, true );

        if( is_wp_error( $_post_id ) ) {
          $this->write_log( 'wp_insert_post error <pre>' . print_r( $_post_id, true ) . '</pre>' );
          $this->write_log( 'wp_insert_post $post_data <pre>' . print_r( $post_data, true ) . '</pre>' );

          return array(
            "ok" => false,
            "message" => "Unable to insert post",
            "error" => $_post_id->get_error_message()
          );

        } else {

          $this->write_log( 'Inserted property post as draft ' . $_post_id  );

          if(
            ( !isset( $post_data['meta_input'][ 'address_is_formatted' ] ) || !$post_data['meta_input'][ 'address_is_formatted' ] ) &&
            method_exists( 'WPP_F', 'revalidate_address' )
          ) {
            $this->write_log( 'Revalidate address if it was not done yet' );
            $r = \WPP_F::revalidate_address( $_post_id, array( 'skip_existing' => 'false' ) );
            if( !empty( $r[ 'status' ] ) && $r[ 'status' ] !== 'update' ) {
              $this->write_log( 'Address validation failed: ' . $r[ 'status' ] );
            }
          }

        }

        if ( !empty( $post_data['meta_input']['rets_media'] ) && is_array( $post_data['meta_input']['rets_media'] ) ) {

          $_already_attached_media = array();
          $_new_media = array();

          $attached_media = get_attached_media( 'image', $_post_id );


          // get simple url litst of already attached media
          if( $attached_media  ) {

            foreach( (array) $attached_media as $_attached_media_id => $_media ) {
              $_already_attached_media[ $_attached_media_id ] = $_media->guid;
            }

          }

          // delete all old attachments if the count of new media doesn't match up with old media
          $this->write_log( 'Deleting old media because count does not match.' );

          foreach( $attached_media as $_single_media_item ) {
            // $this->write_log( 'Deleting [' .  $_single_media_item->ID . '] media item.' );
            wp_delete_attachment( $_single_media_item->ID, true );
          }

          if( count( $attached_media ) != count( $post_data['meta_input']['rets_media'] ) ) {
          }


          foreach( $post_data['meta_input']['rets_media'] as $media ) {

            if( in_array( $media['url'], $_already_attached_media ) ) {
              // $this->write_log( "Skipping $media[url] because it's already attached to $_post_id" );
            }

            // attach media if a URL is set and it isn't already attached

            $filetype = wp_check_filetype( basename( $media['url'] ), null );

            $attachment = array(
              'guid'           => $media['url'],
              'post_mime_type' => ( !empty( $filetype['type'] ) ? $filetype['type'] : 'image/jpeg' ),
              'post_title'     => preg_replace( '/\.[^.]+$/', '', basename( $media['url'] ) ),
              'post_content'   => '',
              'post_status'    => 'inherit',
              'menu_order'     => $media['order'] ? ( (int) $media['order'] ) : null
            );

            $attach_id = wp_insert_attachment( $attachment, $media['url'], $_post_id );

            $_new_media[] = $media['url'];

            update_post_meta( $attach_id, '_is_remote', '1' );

            // $this->write_log( '$attach_id ' . $attach_id  . ' to ' . $_post_id );

            // set the item with order of 1 as the thumbnail
            if( (int) $media['order'] === 1 ) {
              //set_post_thumbnail( $_post_id, $attach_id );

              // No idea why but set_post_thumbnail() fails routinely as does update_post_meta, testing this method.
              delete_post_meta($_post_id, '_thumbnail_id');
              $_thumbnail_setting = add_post_meta( $_post_id, '_thumbnail_id', (int) $attach_id );

              if( $_thumbnail_setting ) {
                $this->write_log( 'setting thumbnail [' . $attach_id  . '] to post [' . $_post_id . '] because it has order of 1, result: ' );
              } else {
                $this->write_log( 'Error! Failured at setting thumbnail [' . $attach_id  . '] to post [' . $_post_id . ']'  );
              }

              //die('dying early!' );
            }

            // old logic of first checking that a new media url exists
            if ( !empty( $media['url'] ) && !in_array( $media['url'], $_already_attached_media ) ) {
            }


          }

          // newly inserted media is in $_new_media
          // old media is in $_already_attached_media
          // we get media that was attached before but not in new media

        }

        $this->write_log( 'Publishing property post ' . $_post_id  );

        $_update_post = wp_update_post(array(
          'ID'           => $_post_id,
          // If post already was added to DB, probably its status was changed manually, so let's set the latest status. peshkov@UD
          'post_status'  => ( !empty( $_post ) && !empty( $_post->post_status ) ? $_post->post_status : 'publish' )
        ));

        if( !is_wp_error( $_update_post ) ) {
          $this->write_log( 'Published property post ' . $_post_id  );
        } else {
          $this->write_log( 'Error publishign post ' . $_post_id  );
          $this->write_log( '<pre>' . print_r( $_update_post, true ) . '</pre>' );
        }

        return array(
          "ok" => true,
          "post_id" => $_post_id,
          "post" => get_post( $_post_id ),
          "permalink" => get_the_permalink( $_post_id )
        );

      }

      /**
       * @param $id
       * @param bool|false $size
       * @return mixed|string
       */
      public function fix_rets_image_url( $id, $size = false ) {

        // get available image sizes
        $_image_sizes = \UsabilityDynamics\Utility::all_image_sizes();

        // get image url of remote asset
        $_url = get_post_meta( $id, '_wp_attached_file', true );

        //die('$size'.$size);
        // if the size exists in image sizes, append the image-size spedific annex to url
        if( $size && array_key_exists( $size, $_image_sizes ) ) {
          $_extension = pathinfo( $_url, PATHINFO_EXTENSION );
          if( empty( $_extension ) ) {
            $_url .= '-' . $_image_sizes[$size]['width'] . 'x' . $_image_sizes[$size]['height'];
          } else {
            $_url = str_replace( '.' . $_extension, '-' . $_image_sizes[$size]['width'] . 'x' . $_image_sizes[$size]['height'] . '.' . $_extension, $_url );
          }
        }

        // return finished url
        return  $_url;

      }

      /**
       *
       * @param $rets_id
       * @return null
       */
      public function find_property_by_rets_id( $rets_id ) {
        global $wpdb;

        $_actual_post_id = $wpdb->get_col( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='rets_id' AND meta_value={$rets_id};" );

        // temp support for old format
        if( empty( $_actual_post_id ) ) {
          $_actual_post_id = $wpdb->get_col( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='rets.id' AND meta_value={$rets_id};" );
        }

        // this excludes any orphan meta as well as "inherit" posts, it will also use the post with ther LOWER ID meaning its more likely to be original
        $query = new \WP_Query( array(
          'post_status' => array( 'publish', 'draft', 'pending', 'trash', 'private', 'future' ),
          'post_type'   => 'property',
          'meta_key'    => ( defined( 'RETS_ID_KEY' ) ? RETS_ID_KEY : 'wpp::rets_pk' ),
          'meta_value'  => $rets_id,
        ) );

        // what if there is two - we fucked up somewhere before...
        if( count( $query->posts ) > 1 ) {
          $this->write_log( "Error! Multiple (".count( $query->posts ).") matches found for rets_id [" . $rets_id . "]." );
        }

        if( count( $query->posts ) > 0 ) {
          $this->write_log( 'Found ' . $query->posts[0]->ID . ' using $rets_id: ' . $rets_id);
          return $query->posts[0]->ID;
        } else {
          $this->write_log( 'Did not find any post ID using $rets_id [' . $rets_id . '].' );
        }

        return null;

      }

      /**
       *
       * By the time the post_data gets here it already has an ID because get_default_post_to_edit() is used to create it
       *  it is created with "auto-draft" status but all meta is already added to it.
       *
       * - all post meta/terms added by this thing are attached to the original post, it seems
       * @param $data
       */
      public function write_log( $data ) {
        file_put_contents( ABSPATH . 'debug-log.log', '' . print_r( $data, true ) . ' in ' . timer_stop() . ' seconds.' . "\n", FILE_APPEND  );
      }

      /**
       * Plugin Activation
       *
       */
      public function activate() {}

      /**
       * Plugin Deactivation
       *
       */
      public function deactivate() {}

    }

  }

}
