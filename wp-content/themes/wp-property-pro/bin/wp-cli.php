<?php
if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly.
}
WP_CLI::add_command( 'saved-search', 'WPP_CLI_Saved_Search_Command' );

/**
 * CLI Commands for Saved Search stuff
 *
 */
class WPP_CLI_Saved_Search_Command extends WP_CLI_Command {

  /**
   * Create Saved Search index
   *
   * wp saved-search put-mapping
   *
   * @subcommand put-mapping
   * @param array $args
   * @param array $assoc_args
   */
  public function put_mapping( $args, $assoc_args ) {

    $this->_is_elasticpress_enabled();
    $this->_connect_check();

    $index = ep_get_index_name();
    $search_index = $index . '-search';

    if( !ep_index_exists( $index ) ) {
      WP_CLI::error( sprintf( __( '[%s] index does not exists. You must run [wp elasticpress put-mapping] at first' ), $index ) );
    }

    if( ep_index_exists( $search_index ) ) {
      WP_CLI::error( sprintf( __( '[%s] index already exists' ), $search_index ) );
    }

    $r = ep_remote_request( ep_get_index_name() );

    if( is_wp_error( $r ) ) {
      WP_CLI::error( $r->get_error_message() );
    }

    if ( is_wp_error( $r ) || 200 !== wp_remote_retrieve_response_code( $r ) ) {
      WP_CLI::error( "Invalid response from Elasticsearch." );
    }

    $body = wp_remote_retrieve_body( $r );
    $body = json_decode( $body, true );
    $mapping = @$body[ $index ][ 'mappings' ][ 'post' ][ 'properties' ];
    $settings = @$body[ $index ][ 'settings' ][ 'index' ];

    if ( !$mapping || !$settings ) {
      WP_CLI::error( "Could not determine the mapping" );
    }

    WP_CLI::log( sprintf( __( 'Put mapping for [%s] index...' ), $index ) );

    $request_args = array(
      'body'    => json_encode( array(
        'settings' => array(
          'index' =>  array(
            'number_of_shards' => ( isset( $settings[ 'number_of_shards' ] ) ? $settings[ 'number_of_shards' ] : "3" ),
            'number_of_replicas' => ( isset( $settings[ 'number_of_replicas' ] ) ? $settings[ 'number_of_replicas' ] : "0" ),
            'analysis' => ( isset( $settings[ 'analysis' ] ) ? $settings[ 'analysis' ] : array() )
          )
        ),
        'mappings' => array(
          'doctype' => array(
            'properties' => $mapping
          ),
          'search' => array(
            'properties' => array(
              'query' => array(
                'type' => 'percolator'
              )
            )
          )
        )
      ) ),
      'method'  => 'PUT',
    );

    $r = ep_remote_request( $search_index, $request_args );

    if ( ! is_wp_error( $r ) && 200 === wp_remote_retrieve_response_code( $r ) ) {
      WP_CLI::success( __( 'Done!' ) );
    } else if ( is_wp_error( $r ) ) {
      WP_CLI::error( $r->get_error_message() );
    } else {
      $body = wp_remote_retrieve_body( $r );
      print_r( $body );
      die();
    }

  }

  /**
   * Detects if WP-Property Elasticsearch feature is enabled
   * and initialized.
   *
   */
  private function _is_elasticpress_enabled() {
    if(
      !defined( 'WP_PROPERTY_ELASTICSEARCH_SERVICE' ) ||
      !WP_PROPERTY_ELASTICSEARCH_SERVICE ||
      !function_exists( 'ep_get_host' )
    ) {
      WP_CLI::error( __( 'WP-Property Elasticsearch feature is not enabled' ) );
    } else {
      WP_CLI::log( __( 'WP-Property Elasticsearch feature enabled. Continue...' ) );
    }
  }

  /**
   * Detects if connection to Elasticsearch exists
   */
  private function _connect_check() {
    $host = ep_get_host();

    if ( empty( $host) ) {
      WP_CLI::error( __( 'There is no Elasticsearch host set up. Either add one through the dashboard or define one in wp-config.php' ) );
    } elseif ( ! ep_get_elasticsearch_version() ) {
      WP_CLI::error( __( 'Unable to reach Elasticsearch Server! Check that service is running.' ) );
    }
  }

}
