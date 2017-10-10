<?php
/**
 * The file can be used separately of plugin.
 * Just copy it to mu-plugins folder ( `wp-content/mu-plugins/` ).
 *
 * Adds WP-CLI commands:
 *
 * wp property trigger
 * wp property scroll
 * wp property delete
 *
 * wp wpp-term cleanup
 * wp wpp-term delete
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly.
}

if ( !defined('WP_CLI') || !WP_CLI ) {
  return;
}

if( !class_exists( 'UD_CLI_EP_Command' ) ) {

  /**
   * CLI Commands for WP-Property posts
   *
   */
  class UD_CLI_EP_Command extends WP_CLI_Command {

    /**
     * (re)Index of particular post
     *
     * Example: wp ep index --post-id=13067122
     *
     * @synopsis [--post-id] [--blog-id]
     * @param array $args
     * @param array $assoc_args
     */
    public function index( $args, $assoc_args ) {

      if ( empty( $assoc_args['post-id'] ) ) {
        WP_CLI::error( __( '--post-id argument is not provided' ) );
      }

      $post_id = $assoc_args['post-id'];

      $post_type = get_post_type( $post_id );

      if ( empty( $post_type ) ) {
        WP_CLI::error( __( 'Could not get post_type. Check if provided post ID exists.' ) );
      }

      timer_start();

      $this->_connect_check();

      WP_CLI::log( sprintf( __( 'Starting indexing [%s] with ID [%s]' ), $post_type, $post_id ) );

      if ( isset( $assoc_args['blog-id'] ) && is_multisite() ) {
        if ( ! is_numeric( $assoc_args['blog-id'] ) ){
          $assoc_args['blog-id'] = 1;
        }
        switch_to_blog( $assoc_args['blog-id'] );
      }

      /*
      add_filter( 'wpp:elastic:title_suggest', function( $title_suggest, $post_args, $post_id ) {

        $title_suggest[ 'input' ] = array_merge( array(
          '114 Go Fuck, Durham, NC 27713',
          //'114 Hollow Oak',
        ), $title_suggest[ 'input' ]);

        //$title_suggest[ 'input' ] = array();

        //array_push( $title_suggest[ 'input' ], 'gonahuy' );
        return $title_suggest;
      } );
      //*/

      $result = ep_sync_post( $post_id );

      WP_CLI::log( "Result: " . json_encode( $result ) );

      WP_CLI::log( WP_CLI::colorize( '%Y' . __( 'Total time elapsed: ', ud_get_wp_property()->domain ) . '%N' . timer_stop() ) );

      WP_CLI::success( __( 'Done!', ud_get_wp_property()->domain ) );
    }

    /**
     * Provide better error messaging for common connection errors
     *
     * @since 0.9.3
     */
    private function _connect_check() {
      $host = ep_get_host();

      if ( empty( $host) ) {
        WP_CLI::error( __( 'There is no Elasticsearch host set up. Either add one through the dashboard or define one in wp-config.php', 'elasticpress' ) );
      } elseif ( ! ep_get_elasticsearch_version() ) {
        WP_CLI::error( __( 'Unable to reach Elasticsearch Server! Check that service is running.', 'elasticpress' ) );
      }
    }

  }

  WP_CLI::add_command( 'ep', 'UD_CLI_EP_Command' );

}