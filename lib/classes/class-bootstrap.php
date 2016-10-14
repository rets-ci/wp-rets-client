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
       * @var string
       */
      public $logfile = 'debug-log.log';

      /**
       * Instantaite class.
       */
      public function init() {

        // Initialize XML-RPC handler
        new XMLRPC();

        // Initialize Media handler
        new Media();

        // 3d-party compatibility
        new Connectors\Loader();

        add_action('init', function() {

          // Needed for import associationa and tracking of what schedule a listing came from
          register_taxonomy( 'rets_schedule', array( 'property' ), array(
            'hierarchical'      => false,
            //'update_count_callback' => null,
            'labels'            => array(
              'name'              => _x( 'Schedules', 'taxonomy general name', ud_get_wp_rets_client()->domain ),
              'singular_name'     => _x( 'Schedule', 'taxonomy singular name', ud_get_wp_rets_client()->domain ),
              'search_items'      => __( 'Search Schedules', ud_get_wp_rets_client()->domain ),
              'all_items'         => __( 'All Schedules', ud_get_wp_rets_client()->domain ),
              'parent_item'       => __( 'Parent Schedule', ud_get_wp_rets_client()->domain ),
              'parent_item_colon' => __( 'Parent Schedule:', ud_get_wp_rets_client()->domain ),
              'edit_item'         => __( 'Edit Schedule', ud_get_wp_rets_client()->domain ),
              'update_item'       => __( 'Update Schedule', ud_get_wp_rets_client()->domain ),
              'add_new_item'      => __( 'Add New Schedule', ud_get_wp_rets_client()->domain ),
              'new_item_name'     => __( 'New Schedule Name', ud_get_wp_rets_client()->domain ),
              'menu_name'         => __( 'Schedules' ),
            ),
            'show_ui'           => true,
            'show_in_menu'      => false,
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

        // Handle forced pre-release update checks.
        if ( is_admin() && isset( $_GET[ 'force-check' ] ) && $_GET[ 'force-check' ] === '1' ) {
          add_filter( 'site_transient_update_plugins', array( 'UsabilityDynamics\WPRETSC\Bootstrap', 'update_check_handler' ), 50, 2 );
        }

        // Handle regular pre-release checks.
        add_filter( 'pre_update_site_option__site_transient_update_plugins', array( 'UsabilityDynamics\WPRETSC\Bootstrap', 'update_check_handler' ), 50, 2 );

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

      /**
       * Determine if Utility class contains missed function
       * in other case, just return NULL to prevent ERRORS
       *
       * @author peshkov@UD
       * @param $name
       * @param $arguments
       * @return mixed|null
       */
      public function __call($name, $arguments) {
        if (is_callable(array("\\UsabilityDynamics\\WPRETSC\\Utility", $name))) {
          return call_user_func_array(array("\\UsabilityDynamics\\WPRETSC\\Utility", $name), $arguments);
        } else {
          return NULL;
        }
      }


      /**
       * Check pre-release updates.
       *
       * @author potanin@UD
       *
       * @param $response
       * @param $old_value
       *
       * @return mixed
       */
      static public function update_check_handler( $response, $old_value = null ) {

        // if ( current_filter() === 'pre_update_site_option__site_transient_update_plugins' ) {}
        // if ( current_filter() === 'site_transient_update_plugins' ) {}

        if ( ! $response || !isset( $response->response ) || ! is_array( $response->response ) ) {
          return $response;
        }

        // Last check was very recent. (This doesn't seem to be right place for this). That being said, if it's being forced, we ignore last time we tried.
        if ( current_filter() === 'site_transient_update_plugins' && !( isset( $_GET[ 'force-check' ] ) && $_GET[ 'force-check' ] === '1' ) && $response->last_checked && ( time() - $response->last_checked ) < 360 ) {
          return $response;
        }

        // e.g. "wp-rets-client", the clean directory name that we are runnig from.
        $_plugin_name = plugin_basename( dirname( dirname( __DIR__ ) ) );

        // e.g. "wp-rets-client/wp-rets-client.php". Directory name may vary but the main plugin file should not.
        $_plugin_local_id = $_plugin_name . '/wp-rets-client.php';

        // Bail, no composer.json file, something broken badly, or perhaps we are bundled into another product.
        if ( ! file_exists( WP_PLUGIN_DIR . '/' . $_plugin_name . '/composer.json' ) ) {
          return $response;
        }

        try {

          // Must be able to parse composer.json from plugin file, hopefully to detect the "_build.sha" field.
          $_composer = json_decode( file_get_contents( WP_PLUGIN_DIR . '/' . $_plugin_name . '/composer.json' ) );

          if ( is_object( $_composer ) && isset( $_composer->extra ) && isset( $_composer->extra->_build ) && isset( $_composer->extra->_build->sha ) ) {
            $_version = $_composer->extra->_build->sha;
          }

          // @todo Allow for latest branch to be swapped out for another track.
          $_response = wp_remote_get( 'https://api.usabilitydynamics.com/v1/product/updates/' . $_plugin_name . '/latest/' . ( isset( $_version ) && $_version ? '?version=' . $_version : '' ), array(
            "headers" => array(
              // "x-set-branch"=> "staging",
              // "cache-control"=> "no-cache",
              // "pragma"=> "no-cache"
            )
          ) );

          if ( wp_remote_retrieve_response_code( $_response ) === 200 ) {
            $_body = wp_remote_retrieve_body( $_response );
            $_body = json_decode( $_body );

            // If there is no "data" field then we have nothing to update.
            if ( isset( $_body->data ) ) {

              if( !isset( $response->response ) ) {
                $response->response = array();
              }

              if( !isset( $response->no_update ) ) {
                $response->no_update = array();
              }

              $response->response[ $_plugin_local_id ] = $_body->data;

              if ( isset( $response->no_update[ $_plugin_local_id ] ) ) {
                unset( $response->no_update[ $_plugin_local_id ] );
              }

            }

          }

        } catch( \Exception $e ) {}

        return $response;

      }

    }

  }

}
