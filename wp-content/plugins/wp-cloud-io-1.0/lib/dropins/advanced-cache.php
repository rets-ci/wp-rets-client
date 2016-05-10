<?php
/**
 * Plugin Name: ElasticSearch Search Gateway API
 * Version: 0.2.3
 * Description: ElasticSearch Gateway Alpha Implementation.
 * Author: Usability Dynamics
 *
 * As far as by default all requests to api.discodonniepresents.com are being redirected to /wp-admin/admin-ajax.php
 * we need to separate ours from others. We decided to use _search word as a keyword that says: we are looking for 
 * ElasticSearch Gateway.
 *
 * ### Functions
 *
 * - Storage - Sets storage paths.
 * - ElasticSearch - Provides HTTP Gateway to ES index.
 *
 *
 * ### Test CURL Requests
 *
 * curl api.wpcloud.io:9200/sugu-jbud-rvfe-oipr/_search
 * curl "api.wpcloud.io:9200/sugu-jbud-rvfe-oipr/_search?source=%7B%22size%22%3A100%2C%22from%22%3A0%2C%22query%22%3A%7B%22filtered%22%3A%7B%22filter%22%3A%7B%22bool%22%3A%7B%22must%22%3A%5B%7B%22range%22%3A%7B%22start_date%22%3A%7B%22gte%22%3A%22now-1d%22%7D%7D%7D%5D%7D%7D%7D%7D%2C%22fields%22%3A%5B%22start_date%22%2C%22description%22%2C%22summary%22%2C%22venue.address.city%22%2C%22venue.address.state%22%2C%22url%22%2C%22image.poster%22%2C%22venue.name%22%2C%22artists.name%22%2C%22tickets%22%5D%2C%22facets%22%3A%7B%22artists.name%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22artists.name%22%2C%22size%22%3A100%7D%7D%2C%22venue.address.state%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22venue.address.state%22%2C%22size%22%3A100%7D%7D%2C%22venue.address.city%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22venue.address.city%22%2C%22size%22%3A100%7D%7D%2C%22venue.name%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22venue.name%22%2C%22size%22%3A100%7D%7D%2C%22promoters.name%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22promoters.name%22%2C%22size%22%3A100%7D%7D%2C%22tour.name%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22tour.name%22%2C%22size%22%3A100%7D%7D%2C%22event_type%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22event_type%22%2C%22size%22%3A100%7D%7D%2C%22artists.genre%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22artists.genre%22%2C%22size%22%3A100%7D%7D%2C%22age_restriction%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22age_restriction%22%2C%22size%22%3A100%7D%7D%7D%2C%22sort%22%3A%5B%7B%22start_date%22%3A%7B%22order%22%3A%22asc%22%7D%7D%5D%7D"
 *
 * curl -H "x-access-key:qccj-nxwm-etsk-niuu-xctg-ezsd-uixa-jhty" dayafter.com/wp-admin/admin-ajax.php?action=/_search
 *
 * curl -H "x-access-key:qccj-nxwm-etsk-niuu-xctg-ezsd-uixa-jhty" -H "host:dayafter.com" 'localhost/search/v2/event/_search?source=%7B%22size%22%3A100%2C%22from%22%3A0%2C%22query%22%3A%7B%22filtered%22%3A%7B%22filter%22%3A%7B%22bool%22%3A%7B%22must%22%3A%5B%7B%22range%22%3A%7B%22start_date%22%3A%7B%22gte%22%3A%22now-1d%22%7D%7D%7D%5D%7D%7D%7D%7D%2C%22fields%22%3A%5B%22start_date%22%2C%22description%22%2C%22summary%22%2C%22venue.address.city%22%2C%22venue.address.state%22%2C%22url%22%2C%22image.poster%22%2C%22venue.name%22%2C%22artists.name%22%2C%22tickets%22%5D%2C%22facets%22%3A%7B%22artists.name%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22artists.name%22%2C%22size%22%3A100%7D%7D%2C%22venue.address.state%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22venue.address.state%22%2C%22size%22%3A100%7D%7D%2C%22venue.address.city%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22venue.address.city%22%2C%22size%22%3A100%7D%7D%2C%22venue.name%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22venue.name%22%2C%22size%22%3A100%7D%7D%2C%22promoters.name%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22promoters.name%22%2C%22size%22%3A100%7D%7D%2C%22tour.name%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22tour.name%22%2C%22size%22%3A100%7D%7D%2C%22event_type%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22event_type%22%2C%22size%22%3A100%7D%7D%2C%22artists.genre%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22artists.genre%22%2C%22size%22%3A100%7D%7D%2C%22age_restriction%22%3A%7B%22terms%22%3A%7B%22field%22%3A%22age_restriction%22%2C%22size%22%3A100%7D%7D%7D%2C%22sort%22%3A%5B%7B%22start_date%22%3A%7B%22order%22%3A%22asc%22%7D%7D%5D%7D'
 *
 * @author korotkov@ud
 * @version alpha
 */
namespace wpCloud\AdvancedCache {

  if ( !class_exists( 'wpCloud\AdvancedCache\ElasticSearch' ) ) {

    /**
     * Proxy for elasticsearch lookup queries
     */
    class ElasticSearch {
      
      /**
       * Public Access Key
       */
      const ELASTIC_SEARCH_PUBLIC_KEY  = 'qccj-nxwm-etsk-niuu-xctg-ezsd-uixa-jhty';
      const ELASTIC_SEARCH_HEADER      = 'HTTP_X_ACCESS_KEY';
      const ELASTIC_SEARCH_SERVER_URL  = 'http://api.wpcloud.io';
      const ELASTIC_SEARCH_SERVER_PORT = 9200;
      
      /**
       * todo: make it get dynamicaly from key
       *
       */
      const ELASTIC_SEARCH_INDEX = 'sugu-jbud-rvfe-oipr';

      /**
       *
       * @var type
       */
      private $uri_prefix = '/search/v2';

      /**
       *
       * @var type
       */
      private $curl;

      /**
       *
       * @var type
       */
      private $response;

      /**
       *
       * @var type
       */
      private $get_args = array();

      /**
       *
       * @var type
       */
      private $controller;


      static public $_settings = array(
        "index" => "sugu-jbud-rvfe-oipr",
        "localPath" => "/search/v2",
        "publicKey" => "qccj-nxwm-etsk-niuu-xctg-ezsd-uixa-jhty",
        "searchHeader" => "HTTP_X_ACCESS_KEY",
        "serverUrl" => "http://api.wpcloud.io",
        "serverPort" => 9200
      );

      /**
       * Make things happen
       */
      public function __construct() {

        try {

          $this->apply_request_header_settings();

          if( isset( $_SERVER['HTTP_X_EDGE'] ) && $_SERVER['HTTP_X_EDGE'] === 'serve' ) {
            // die( '<pre>' . print_r( self::$_settings, true ) . '</pre>' );
          }

          /**
           * Make sure we need to do all this
           */
          if ( $this->correct_endpoint() && $this->has_permissions() ) {

            set_time_limit(0);
            
            /**
             * Parse GET
             */

            parse_str( substr_replace( $_REQUEST['action'], '', 0, strpos( $_REQUEST['action'], '?' )+1 ) , $this->get_args );

            $this->controller = substr( $_REQUEST['action'], 0, strpos( $_REQUEST['action'], '?' ) );

            if ( !function_exists( 'curl_init' ) ) {
              throw new \Exception( 'cURL not found.' );
            }

            $this->curl = curl_init();

            curl_setopt_array( $this->curl, $_config = array(
              CURLOPT_URL => $this->build_url( self::ELASTIC_SEARCH_SERVER_URL ),
              CURLOPT_PORT => self::ELASTIC_SEARCH_SERVER_PORT,
              CURLOPT_CUSTOMREQUEST => 'GET',
              CURLOPT_RETURNTRANSFER => 1,
              CURLOPT_TIMEOUT => 5,
              CURLOPT_CONNECTTIMEOUT => 5,
            ));

            if( !$this->response = curl_exec( $this->curl ) ) {

              $this->send_response(array(
                "ok" => false,
                "message" => "Request timed out.",
                "debug" => self::$_settings
              ));

            }

            curl_close( $this->curl );

          }
       
        } catch ( \Exception $e ) {

          if( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
            print_r( $e );
          } else {

            die(json_encode(array(
              "ok" => false,
              "error" => $e->getMessage()
            )));

          }

        }
        
      }

      public function send_response( $data = null ) {

        if( !$data ) {
          $data = $this->response;
        }

        // if string passed, we asume its json that needs to be decoded into an object.
        if( is_string( $data ) ) {
          $data = json_decode( $data );
        }

        // Conceal shards.
        if( isset( $data->_shards ) && $data->_shards ) {
          unset( $data->_shards );
        }

        // Slightly obfuscate ES response.
        if( isset( $data->timed_out ) ) {
          unset( $data->timed_out );
        }

        if( isset( $data->took ) ) {
          unset( $data->took );
        }

        if( !$data ) {
          $data = array(
            "message" => "no data",
            "hits" => array(
              "hits" => array()
            ),
            // "debug" => self::$_settings
          );
        }

        die(json_encode(array_merge( array(
          "ok" => true,
        ), (array) $data )));

      }
      
      /**
       * Checks if we are on correct end-point
       *
       * - must have "action" argument
       * - must make call to wp-admin/admina-ajax.php
       * - must have the string "_search" as part of the "action" argument's value
       * 
       * @return boolean
       */
      private function correct_endpoint() {
        return isset( $_REQUEST['action'] )
          && !empty( $_REQUEST['action'] )
          && $_SERVER['PHP_SELF'] == '/wp-admin/admin-ajax.php'
          && strpos( $_REQUEST['action'], '/_search' ) !== FALSE;
      }
      
      /**
       * 
       * @return type
       */
      private function has_permissions() {
        return !empty( $_SERVER[ self::ELASTIC_SEARCH_HEADER ] )
          && $_SERVER[ self::ELASTIC_SEARCH_HEADER ] == self::ELASTIC_SEARCH_PUBLIC_KEY;
      }

      /**
       *
       * @param string|type $base_url
       * @return type
       */
      private function build_url( $base_url = '' ) {

        return $base_url . '/'. self::ELASTIC_SEARCH_INDEX . str_replace( $this->uri_prefix, '', $this->controller ) . '?' . str_replace( $this->uri_prefix, '', http_build_query( $this->get_args ) );
      }
      
      /**
       * Let's just die, after we set CORS headers so JavaScript direct-access works.
       */
      public function __destruct() {
        if ( $this->correct_endpoint() ) {
          header( 'Content-Type:application/json' );
          header( 'Access-Control-Allow-Headers:x-access-key,content-type,x-set-backend,x-access-token' );
          header( 'Access-Control-Allow-Origin:*' );
          header( 'X-Advanced-Cache:v0.2.2' );
          header( 'X-Advanced-Cache-Tag:' . time() );
          $this->send_response( $this->response );
        }
      }

      /**
       *
       *
       * @return array
       */
      private function apply_request_header_settings() {

        if( !isset( $_SERVER[ 'HTTP_X_WP_ADVANCED_CACHE' ] ) ) {
          return self::$_settings;
        }

        foreach( (array) $_features = explode( ';', $_SERVER[ 'HTTP_X_WP_ADVANCED_CACHE' ] ) as $_features ) {
          // do something with settings
        }

        return self::$_settings;

      }

    }
    
    /**
     * Run.
     *
     */
    new ElasticSearch();
    
  }

  if ( !class_exists( 'wpCloud\AdvancedCache\Storage' ) ) {

    class Storage {

    }

  }
  
}

##
##
## end
