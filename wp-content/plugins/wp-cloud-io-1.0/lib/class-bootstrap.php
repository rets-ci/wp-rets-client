<?php
/**
 *
 *
 * @author potanin@UD
 */
namespace wpCloud {

  use wpplex\WP_AutoUpdate;
  use WP_CLI;

  if ( !class_exists( 'wpCloud\Bootstrap' ) ) {

    /**
     *
     */
    class Bootstrap {

      /**
       *
       * @var type
       */
      public static $instance = null;

      /**
       * @var object
       */
      private $_config;

      static public $version = '';

      /**
       * @var
       */
      static public $_dir;

      /**
       * @var
       */
      static public $_path;

      /**
       * @var
       */
      static public $_url;

      /**
       * @var
       */
      static public $text_domain;

      /**
       * @var Updater
       */
      static public $updater;

      /**
       * @param array $config
       */
      public function __construct( $config = array() ) {
        global $current_blog;

        // $plugin_data = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin );

        $this->_config = (object) $config;

        self::$_url = isset( $this->_config->_url ) ? $this->_config->_url : 'http://localhost';
        self::$_dir = Utility::normalize_path( isset( $this->_config->_dir ) ? $this->_config->_dir : __DIR__ );
        self::$_path = Utility::normalize_path( isset( $this->_config->_path ) ? $this->_config->_path : dirname( __DIR__ ) . '/wp-cloud.php' );
        self::$text_domain = isset( $this->_config->_domain ) ? $this->_config->_domain : 'wp-cloud';

        self::$updater = Updater::register(array(
          'update_path' => 'https://updates.usabilitydynamics.com/v2.0/index.php',
          'plugin_slug' => 'wp-cloud-1.0/wp-cloud.php',
          'current_version' => '1.0',
          'license_user' => $current_blog->domain,
          'license_key' => 'some-key'
        ));

        //delete_site_transient( 'update_plugins' );

        // force
        // wp_update_plugins();

        //die( '<pre>st ' . print_r( get_site_transient( 'update_plugins' ), true ) . '</pre>' );

        add_action( 'init', function() {
          // self::$updater->update();
        }, 1000);

        // die( '<pre>' . print_r( self::$updater , true ) . '</pre>' );

        // add_action( 'init', array( $this, 'init' ), 100 );
        // add_action( 'admin_init', array( $this, 'admin_init' ), 100 );
        // add_action( 'admin_menu', array( $this, '_admin_menu' ), 150 );
        // add_action( 'network_admin_menu', array( $this, '_admin_menu' ), 8 );
        // add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ), 20 );

        // add_filter( 'wp_generate_attachment_metadata', array( $this, 'generate_attachment_metadata' ), 20, 2 );
        // add_filter( 'cron_schedules', array( $this, 'cron_add_minute' ), 20 );
        // add_filter( 'upload_mimes', array( $this, 'upload_mimes' ), 100 );

        // add_filter( 'wpCloud:manager:templates', array( $this, 'getTemplates' ), 20 );
        // add_filter( 'wpCloud:controller:controllers', array( $this, 'cleanControllers' ), 100 );


        if( class_exists( 'WP_CLI' ) && class_exists( 'wpCloud\CLI\Cloud_CLI_Command' )) {
          WP_CLI::add_command( 'cloud', 'wpCloud\CLI\Cloud_CLI_Command' );
        }

      }

    }

  }

}