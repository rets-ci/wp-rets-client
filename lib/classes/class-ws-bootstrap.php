<?php
/**
 * Bootstrap
 *
 * @since 1.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\WS_Bootstrap' ) ) {

    final class WS_Bootstrap extends \UsabilityDynamics\WP\Bootstrap_Plugin {
      
      /**
       * Singleton Instance Reference.
       *
       * @protected
       * @static
       * @property $instance
       * @type \UsabilityDynamics\WPP\WS_Bootstrap object
       */
      protected static $instance = null;
      
      /**
       * Instantaite class.
       */
      public function init() {

        $this->define_settings();

        /**
         * May be load Shortcodes
         */
        if( class_exists( '\UsabilityDynamics\Shortcode\Shortcode' ) ) {
          $this->load_files( $this->path('lib/shortcodes', 'dir') );
        }

        /**
         * May be load Widgets
         */
        $this->load_files( $this->path('lib/widgets', 'dir') );

        /**
         * Load Admin UI
         */
        if( is_admin() ) {
          new WS_Admin();
        }
        
      }

      /**
       * Define Plugin Settings
       *
       */
      private function define_settings() {
        $this->settings = new \UsabilityDynamics\Settings( array(
          'key'  => 'wpp_walkscore_settings',
          'store'  => 'options',
          'data' => array(
            'name' => $this->name,
            'version' => $this->args[ 'version' ],
            'domain' => $this->domain,
          )
        ) );
      }

      /**
       * Includes all PHP files from specific folder
       *
       * @param string $dir Directory's path
       * @author peshkov@UD
       */
      public function load_files($dir = '') {
        $dir = trailingslashit($dir);
        if (!empty($dir) && is_dir($dir)) {
          if ($dh = opendir($dir)) {
            while (( $file = readdir($dh) ) !== false) {
              if (!in_array($file, array('.', '..')) && is_file($dir . $file) && 'php' == pathinfo($dir . $file, PATHINFO_EXTENSION)) {
                include_once( $dir . $file );
              }
            }
            closedir($dh);
          }
        }
      }

      /**
       * Return localization's list.
       *
       * Example:
       * If schema in composer.json contains l10n.{key} values:
       *
       * { 'config': 'l10n.hello_world' }
       *
       * the current function should return something below:
       *
       * return array(
       *   'hello_world' => __( 'Hello World', $this->domain ),
       * );
       *
       * @author peshkov@UD
       * @return array
       */
      public function get_localization() {
        return apply_filters( 'wpp::walkscore::localization', array(
          'walkscore' => __( 'WalkScore', $this->domain ),
          'settings_page_title' => __( 'WP-Property: WalkScore Settings', $this->domain ),
          'general' => __( 'General', $this->domain ),
          'general_settings' => __( 'The tab contains required settings. Please, be sure you have setup them all and provided data is valid.', $this->domain ),
          'api_settings' => __( 'WalkScore API', $this->domain ),
          'api_key' => __( 'API Key', $this->domain ),
          'desc_api_key' => sprintf( __( 'WalkScore requires API Key to start. %sGet you API Key%s', $this->domain ), '<a href="https://www.walkscore.com/professional/api-sign-up.php" target="_blank">', '</a>' ),
        ) );
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
