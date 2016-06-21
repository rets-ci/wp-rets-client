<?php
/**
 * Bootstrap
 *
 * @since 4.0.0
 */
namespace UsabilityDynamics\WPRETSC {

  if( !class_exists( 'UsabilityDynamics\WPRETSC\Utility' ) ) {

    final class Utility {

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

        // @TODO: check if query returned result! And there is no Error! peshkov@UD

        // what if there is two - we fucked up somewhere before...
        if( count( $query->posts ) > 1 ) {
          ud_get_wp_rets_client()->write_log( "Error! Multiple (".count( $query->posts ).") matches found for rets_id [" . $rets_id . "]." );
        }

        if( count( $query->posts ) > 0 ) {
          ud_get_wp_rets_client()->write_log( 'Found ' . $query->posts[0]->ID . ' using $rets_id: ' . $rets_id);
          return $query->posts[0]->ID;
        } else {
          ud_get_wp_rets_client()->write_log( 'Did not find any post ID using $rets_id [' . $rets_id . '].' );
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

    }

  }

}
