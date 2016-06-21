<?php
/**
 * Bootstrap
 *
 * @since 0.2.0
 */
namespace UsabilityDynamics\WPRETSC {

  if( !class_exists( 'UsabilityDynamics\WPRETSC\XMLRPC' ) ) {

    final class XMLRPC {

      /**
       * Constructor
       *
       */
      public function __construct() {

        // Prevent blocking XML-RPC by third party plugins or themes
        add_filter('xmlrpc_enabled', '__return_true', 100);

        // add ability to get wpp_settings so we can extra mapping settings
        add_filter( 'xmlrpc_blog_options', function( $options ) {

          $options['wpp_settings'] = array(
            'desc'          => __( 'WP-Property options.', ud_get_wp_rets_client()->domain ),
            'readonly'      => true,
            'option'        => 'wpp_settings'
          );

          return $options;

        });

        // Add custom XML-RPC methods
        add_filter( 'xmlrpc_methods', array( $this, 'xmlrpc_methods' ) );

      }

      /**
       * Add custom XML-RPC methods
       *
       * @param $_methods
       * @return mixed
       */
      public function xmlrpc_methods( $_methods ) {
        $_methods['wpp.editProperty'] = array( $this, 'rpc_edit_property' );
        $_methods['wpp.removeDuplicatedMLS'] = array( $this, 'rpc_remove_duplicated_mls' );
        return $_methods;
      }

      /**
       * Parse XML-RPC request
       * Make sure credentials are valid.
       *
       */
      protected function parseRequest( $args ) {
        global $wp_xmlrpc_server;

        $wp_xmlrpc_server->escape( $args );

        if ( !$user = $wp_xmlrpc_server->login( $args[1], $args[2] ) ) {
          return array(
            'ok' => false,
            'invalid' => $user,
            'error' => $wp_xmlrpc_server->error,
            'username' => $args[1],
            'password' => $args[2],
          );
        }

        // remove filter which slows down updates significantly. (experimental)
        remove_filter( 'transition_post_status', '_update_term_count_on_transition_post_status', 10 );

        return $args[3];
      }

      /**
       *
       * @param $args
       * @return array
       */
      public function rpc_edit_property( $args ) {
        global $wp_xmlrpc_server;

        $post_data = $this->parseRequest( $args );
        if( !empty( $wp_xmlrpc_server->error ) ) {
          return $post_data;
        }

        ud_get_wp_rets_client()->write_log( 'Have request wpp.editProperty request' );

        if( isset( $post_data['meta_input']['rets_id'] ) ) {
          $post_data['meta_input']['wpp::rets_pk'] = $post_data['meta_input']['rets_id'];
        }

        $post_data['meta_input']['wpp_import_time'] = time();

        if( !empty( $post_data['meta_input']['rets_id'] ) ) {
          $post_data['ID'] = ud_get_wp_rets_client()->find_property_by_rets_id( $post_data['meta_input']['rets_id'] );
        } else {
          return array( 'ok' => false, 'error' => "Property missing RETS ID." );
        }

        // set post status to draft since it may be inserting for a while due to large amount of terms
        $post_data[ 'post_status' ] = 'draft';

        if( !empty( $post_data['ID'] ) ) {
          ud_get_wp_rets_client()->write_log( 'Running wp_insert_post for [' . $post_data['ID'] . '].' );
          $_post = get_post( $post_data['ID'] );
          // If post_date is not set wp_insert_post function sets the current datetime.
          // So we are preventing to do it by setting already existing post_date. peshkov@UD
          $post_data[ 'post_date' ] = $_post->post_date;
          // Status could be changed manually by administrator.
          // So we are preventing to publish property again in case it was trashed. peshkov@UD
          $post_data[ 'post_status' ] = $_post->post_status;

        } else {
          ud_get_wp_rets_client()->write_log( 'Running wp_insert_post for [new post].' );
        }


        $_post_id = wp_insert_post( $post_data, true );

        if( is_wp_error( $_post_id ) ) {
          ud_get_wp_rets_client()->write_log( 'wp_insert_post error <pre>' . print_r( $_post_id, true ) . '</pre>' );
          ud_get_wp_rets_client()->write_log( 'wp_insert_post $post_data <pre>' . print_r( $post_data, true ) . '</pre>' );

          return array(
            "ok" => false,
            "message" => "Unable to insert post",
            "error" => $_post_id->get_error_message()
          );

        } else {

          ud_get_wp_rets_client()->write_log( 'Inserted property post as draft ' . $_post_id  );

          if(
            ( !isset( $post_data['meta_input'][ 'address_is_formatted' ] ) || !$post_data['meta_input'][ 'address_is_formatted' ] ) &&
            method_exists( 'WPP_F', 'revalidate_address' )
          ) {
            ud_get_wp_rets_client()->write_log( 'Revalidate address if it was not done yet' );
            $r = \WPP_F::revalidate_address( $_post_id, array( 'skip_existing' => 'false' ) );
            if( !empty( $r[ 'status' ] ) && $r[ 'status' ] !== 'updated' ) {
              ud_get_wp_rets_client()->write_log( 'Address validation failed: ' . $r[ 'status' ] );
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
          ud_get_wp_rets_client()->write_log( 'Deleting old media because count does not match.' );

          foreach( $attached_media as $_single_media_item ) {
            // ud_get_wp_rets_client()->write_log( 'Deleting [' .  $_single_media_item->ID . '] media item.' );
            wp_delete_attachment( $_single_media_item->ID, true );
          }

          if( count( $attached_media ) != count( $post_data['meta_input']['rets_media'] ) ) {
          }


          foreach( $post_data['meta_input']['rets_media'] as $media ) {

            if( in_array( $media['url'], $_already_attached_media ) ) {
              // ud_get_wp_rets_client()->write_log( "Skipping $media[url] because it's already attached to $_post_id" );
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

            // ud_get_wp_rets_client()->write_log( '$attach_id ' . $attach_id  . ' to ' . $_post_id );

            // set the item with order of 1 as the thumbnail
            if( (int) $media['order'] === 1 ) {
              //set_post_thumbnail( $_post_id, $attach_id );

              // No idea why but set_post_thumbnail() fails routinely as does update_post_meta, testing this method.
              delete_post_meta($_post_id, '_thumbnail_id');
              $_thumbnail_setting = add_post_meta( $_post_id, '_thumbnail_id', (int) $attach_id );

              if( $_thumbnail_setting ) {
                ud_get_wp_rets_client()->write_log( 'setting thumbnail [' . $attach_id  . '] to post [' . $_post_id . '] because it has order of 1, result: ' );
              } else {
                ud_get_wp_rets_client()->write_log( 'Error! Failured at setting thumbnail [' . $attach_id  . '] to post [' . $_post_id . ']'  );
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

        ud_get_wp_rets_client()->write_log( 'Publishing property post ' . $_post_id  );

        $_update_post = wp_update_post(array(
          'ID'           => $_post_id,
          // If post already was added to DB, probably its status was changed manually, so let's set the latest status. peshkov@UD
          'post_status'  => ( !empty( $_post ) && !empty( $_post->post_status ) ? $_post->post_status : 'publish' )
        ));

        if( !is_wp_error( $_update_post ) ) {
          ud_get_wp_rets_client()->write_log( 'Published property post ' . $_post_id  );
        } else {
          ud_get_wp_rets_client()->write_log( 'Error publishign post ' . $_post_id  );
          ud_get_wp_rets_client()->write_log( '<pre>' . print_r( $_update_post, true ) . '</pre>' );
        }

        return array(
          "ok" => true,
          "post_id" => $_post_id,
          "post" => get_post( $_post_id ),
          "permalink" => get_the_permalink( $_post_id )
        );

      }

      /**
       * Removes properties with duplicated MLS
       *
       * @param $args
       * @return array
       */
      public function rpc_remove_duplicated_mls( $args ) {
        global $wp_xmlrpc_server;

        $data = $this->parseRequest( $args );
        if( !empty( $wp_xmlrpc_server->error ) ) {
          return $data;
        }

        ud_get_wp_rets_client()->write_log( 'Have request wpp.removeDuplicatedMLS request' );
      }

    }

  }

}
