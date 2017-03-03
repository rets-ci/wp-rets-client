<?php

/**
 *
 */
namespace UsabilityDynamics\WPRETSC {

  if( !class_exists( '\UsabilityDynamics\WPRETSC\Widget' ) ) {

    /**
     * Class Widget
     * @package UsabilityDynamics\WPRETSC
     */
    class Widget extends \UsabilityDynamics\WPRETSC\Dashboard_Widget {

      /**
       * @var string
       */
      public $widget_id = 'wpp_rets_client_widget';

      /**
       * @var string
       */
      public $widget_title = 'rets.ci';

      /**
       * Widget constructor.
       */
      public function __construct() {
        parent::__construct(array());
      }

      /**
       *
       */
      private function is_ud_site_id_registered() {
        return get_site_option( 'ud_site_id' );
      }

      /**
       *
       */
      private function is_ud_site_secret_token_registered() {
        return get_site_option( 'ud_site_secret_token' );
      }

      /**
       * @return mixed
       */
      private function is_ud_site_public_key_registered() {
        return get_site_option( 'ud_site_public_key' );
      }

      /**
       * @param \UsabilityDynamics\WPP\type $args
       * @param \UsabilityDynamics\WPP\type $instance
       * @return string
       */
      public function widget($args, $instance) {

        /**
         * Do nothing if was not able to register on UD
         */

        if( defined( 'UD_RETSCI_AJAX_API_URL' ) ) {
          $api_url = trailingslashit(UD_RETSCI_AJAX_API_URL);
        } else {
          $api_url = 'https://api.rets.ci/';
        }

        wp_enqueue_script( 'wpp_retsci_app', ud_get_wp_rets_client()->path( 'static/scripts/app.js', 'url' ), array( 'jquery' ) );

        wp_localize_script( 'wpp_retsci_app', 'wpp_retsci_client', array(
          'timezone' => get_option( 'timezone_string' ),
          'time_format' => get_option( 'time_format' ),
        ) );

        /**
         * If not registered on rets ci yet
         */
        if ( !$this->is_ud_site_id_registered() || !$this->is_ud_site_secret_token_registered() || !$this->is_ud_site_public_key_registered() ) {

          $data = json_encode(array(
            'ud_site_id' => $this->is_ud_site_id_registered(),
            'ud_site_secret_token' => $this->is_ud_site_secret_token_registered(),
            'security' => wp_create_nonce( "wpp_retsci_signin" ),
            'api_url' => $api_url
          ));

          ob_start();
          include_once ud_get_wp_rets_client()->path( 'static/views/widget-register.php', 'dir' );
          echo apply_filters( 'wpp_retsci_widget_register_content', ob_get_clean() );

          return;
        }

        /**
         * Show stats
         */
        $data = json_encode(array(
          'site_id' => $this->is_ud_site_id_registered(),
          'site_secret_token' => $this->is_ud_site_secret_token_registered(),
          'api_url' => $api_url
        ));

        ob_start();
        include_once ud_get_wp_rets_client()->path( 'static/views/widget-stats.php', 'dir' );
        echo apply_filters( 'wpp_retsci_widget_stats_content', ob_get_clean() );

      }

    }
  }
}