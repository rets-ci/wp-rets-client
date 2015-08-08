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
          'general_settings' => sprintf( __( 'To use %sWalkScore%s on your site you must setup the options below at first.', $this->domain ), '<a href="https://www.walkscore.com/professional/" target="_blank">', '</a>' ),
          'api_settings' => __( 'WalkScore API', $this->domain ),
          'api_key' => __( 'API Key', $this->domain ),
          'desc_api_key' => sprintf( __( 'WalkScore requires API Key to start. %sGet your API Key%s', $this->domain ), '<a href="https://www.walkscore.com/professional/api-sign-up.php" target="_blank">', '</a>' ),
          'neighborhood_map' => sprintf( __( 'Neighborhood Map', $this->domain ) ),
          'desc_neighborhood_map' => sprintf( __( '<p>Setup your %s shortcode advanced settings below. The current shortcode renders %sNeighborhood Map%s.</p><p>By default, shortcode uses current property for showing map. But if you want to show another property or use shortcode on non-property page you can use attribute <strong>property_id</strong>. Example: <code>[property_walkscore_neighborhood property_id=777]</code>.<br/>Also, you are able to use custom coordinates instead of property_id. Example: <code>[property_walkscore_neighborhood ws_lat="37.720309" ws_lon="-122.390668"]</code></p><p><strong>Note</strong>, you can overwrite any option manually in your shortcode. See shortcode\'s available attribute under option you want to change. Example: %s</p><p>Do you want to use widget instead of the current shortcode? Well, just go to %sWidgets%s settings and setup your <strong>WalkScore Neighborhood Map</strong> widget there.</p><p>Need more information? You can find Neighborhood Map\'s API Documentation %shere%s.</p><p><strong>Attention!</strong> To prevent issues, you must not use more than one Neighborhood Map on page!', $this->domain ), '<code>[property_walkscore_neighborhood]</code>', '<a href="https://www.walkscore.com/professional/neighborhood-map.php" target="_blank">', '</a>', '<code>[property_walkscore_neighborhood ws_width=600 ws_height=300 ws_layout=vertical]</code>', '<a href="' . admin_url( 'widgets.php' ) . '" target="_blank">', '</a>', '<a href="https://www.walkscore.com/professional/neighborhood-map-docs.php" target="_blank">', '</a>' ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
          '' => sprintf( __( '', $this->domain ) ),
        ) );
      }

    }

  }

}
