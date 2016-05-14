<?php
/**
 * Our custom wp-config bootstrapper, it looks at the environment, and then loads config files
 * based on those environment variables - typically environment set in .htaccess, see
 * .htaccess.tpl
 *
 * Configs are loaded based on the following hierarchy, and you can do both folders and files:
 *  1) ENVIRONMENT variables, these supercede anything else, and can also define 'ENVIRONMENT'
 *  2) application/etc/wp-config/{ENVIRONMENT}/{FILE_NAME}
 *  3) application/etc/wp-config/{FILE_NAME}
 *  4) All items defined in composer.json, in the settings object key
 *
 *
 *
 * @author potanin@UD
 * @class UsabilityDynamics\Cluster\Config
 */
namespace UsabilityDynamics\Cluster {

  if ( ! class_exists( 'UsabilityDynamics\Cluster\Config' ) ) {

    class Config {

      /**
       * Holds the arrayed location of our config files/folders
       */
      private $configFolders = array();

      /**
       * This variable defines the config files which will be autoloaded in the class, can be a
       * directory (of which all files will be loaded), or a specific file - scope is defined
       * such that you might have to use $uds_config->get_config() if the variables aren't declared
       * globally
       *
       * - system - Holds variables such as 'path' or 'web host name' declarations
       * - constants - Our defines file, should hold all static declarations, replacement of old wp-config.php
       * - database - Our database settings
       * - debug - Any debug file, looks for 'debug.php' - g: prefix makes it global
       * - options - Looking for some options definition files in a directory (scans all files)
       *
       */
      private $autoload_files = array(
        'g:system',
        'g:constants',
        'g:database',
        'g:debug',
        'options',
      );

      /**
       * This variable will hold the config files that have already been included
       */
      private $loadedConfigs = array();

      /**
       * @var array
       */
      public $_settings = array();

      /**
       * @var array
       */
      private $serverParameters = array();

      /**
       * @var null
       */
      public $siteDomain = null;

      /**
       * @var null
       */
      public $defaultProtocol = null;

      /**
       * @var null
       */
      public $baseDir = null;

      /**
       * @var null
       */
      public $composer_file = null;

      /**
       * @var null
       */
      public $sunrise = null;

      /**
       * @var null
       */
      public $env = 'production';

      /**
       * @var array
       */
      private $appliedConstants = array();

      /**
       * This variable holds protected config variables (they cannot be defined in the config files)
       */
      private $protectedVariables = array(
        'slug',
        'file'
      );

      /**
       * The constants that should be dynamically generated
       */
      protected $protectedConstants = array(
        'WP_ALLOW_MULTISITE'
      );

      /**
       * On init, we're just going to setup and include all our config files
       *
       * @param string $base_dir Override the base dir to search for files (defaults to __DIR__)
       * @param bool $do_stuff Whether we should actually do initialization( needed for 'init' )
       *
       * @throws \Exception Plain exception when there is an issue
       */
      public function __construct( $base_dir = __DIR__, $do_stuff = true ) {

        if ( ! ( is_bool( $do_stuff ) && $do_stuff ) ) {
          return array();
        }

        $this->detectSiteRoot();

        $this->handleCLI();

        $this->processConfigFiles();

        $this->_settings = array_merge( $this->_settings, array(
          "wp_base_dir"         => $this->baseDir,
          "wp_site_domain"      => isset( $_SERVER[ 'HTTP_HOST' ] ) ? $_SERVER[ 'HTTP_HOST' ] : 'localhost',
          "wp_default_protocol" => $this->defaultProtocol = isset( $_SERVER[ 'HTTPS' ] ) && $_SERVER[ 'HTTPS' ] == 'on' ? 'https' : 'http',
          "wp_env"              => isset( $_SERVER[ 'WP_ENV' ] ) ? $_SERVER[ 'WP_ENV' ] : $this->env,
          "sunrise"             => $this->sunrise
        ) );

        // Get settings
        $this->_settings = array_merge( $this->_settings, Config::parseComposer( $this->composer_file ) );

        // Flatted nested object/aray
        $this->_settings = Config::flatten( $this->_settings );

        // Fix value types.
        $this->_settings = Config::normalize( $this->_settings );

        // Replace dynamic patterns
        $this->_settings = Config::replacePatterns( $this->_settings, $_SERVER );

        // Fix value types.
        $this->_settings = Config::normalize( $this->_settings, true );

        // Handle Database.
        $this->parseDatabase();

        // Intersect existing settings with settings passed with server.
        $this->addServerParameters();

        // Apply consants and save them to object for debugging
        $this->applyConstants();

        // Set global variables.
        $this->applyGlobals();

        return $this;

      }

      /**
       * @return array
       */
      public function show() {
        return $this->_settings;
      }

      /**
       * @internal param array $_settings
       */
      private function applyGlobals() {
        global $table_prefix;

        /** Is this needed? */
        if ( ! isset( $table_prefix ) ) {
          $table_prefix = defined( 'DB_PREFIX' ) ? DB_PREFIX : 'wp_';
        }

      }

      /**
       */
      private function processConfigFiles() {

        /** For these variables, make sure they exist */
        if ( $this->env ) {
          $this->configFolders[ ] = rtrim( $this->baseDir, '/' ) . '/application/static/etc/wp-config/' . $this->env . '/';
        }

        $this->configFolders[ ] = rtrim( $this->baseDir, '/' ) . '/application/static/etc/wp-config/';

        foreach ( $this->configFolders as $key => $value ) {
          if ( ! is_dir( $value ) ) {
            unset( $this->configFolders[ $key ] );
          }
        }

        /** Renumber the array */
        $this->configFolders = array_values( $this->configFolders );

        /** If we don't have any config folders, bail */
        if ( ! ( is_array( $this->configFolders ) && ! count( $this->configFolders ) ) ) {
          /** Now, go through our autoloaded configs, and bring them in */
          foreach ( $this->autoload_files as $autoload_file ) {
            /** See if it needs to be global or local */
            if ( substr( $autoload_file, 0, 2 ) == 'g:' ) {
              $autoload_scope = 'global';
              $autoload_file  = substr( $autoload_file, 2, strlen( $autoload_file ) - 2 );
            } else {
              $autoload_scope = 'local';
            }
            /** Include the files then */
            $this->get_config( $autoload_file, $autoload_scope );
          }

        }

      }

      /**
       */
      private function handleCLI() {

        /** If we've got WP_CLI, we need to fix the base dir */
        // If wp-cli then we should take current working directory
        if ( defined( 'WP_CLI' ) ) {
          $this->baseDir = $_SERVER[ 'PWD' ];
        }

      }

      /**
       * @return null
       */
      private function detectSiteRoot() {

        // If web-server that we can trust document root most of the time
        if ( isset( $_SERVER[ 'DOCUMENT_ROOT' ] ) ) {
          $this->baseDir = $_SERVER[ 'DOCUMENT_ROOT' ];
        }

        if ( isset( $_SERVER[ 'REDIRECT_DOCUMENT_ROOT' ] ) ) {
          $this->baseDir = $_SERVER[ 'REDIRECT_DOCUMENT_ROOT' ];
        }

        /** Finally, go through the composer.json file and add all the configs there */
        if ( is_file( $_SERVER[ 'DOCUMENT_ROOT' ] . '/sunrise.php' ) ) {
          $this->sunrise = true;
        }

        if ( is_file( $_SERVER[ 'DOCUMENT_ROOT' ] . '/composer.json' ) ) {
          $this->baseDir       = $_SERVER[ 'DOCUMENT_ROOT' ];
          $this->composer_file = $_SERVER[ 'DOCUMENT_ROOT' ] . '/composer.json';
        } else if ( is_file( $this->baseDir . '/composer.json' ) ) {
          $this->composer_file = $this->baseDir . '/composer.json';
        }
        
        // Still composer.json not detected? Try dirname() instead of $_SERVER[ 'DOCUMENT_ROOT' ] now. peshkov@UD
        if( !$this->composer_file && is_file( dirname( _FILE_ ) . '/composer.json' ) ) {
          $this->composer_file = dirname( _FILE_ ) . '/composer.json';
          $this->baseDir = dirname( _FILE_ );
        }

        return $this->baseDir;

      }

      /**
       * Loop through them, declaring them if they don't already previously exist
       *
       * @param $_settings
       *
       * @return array
       */
      private function applyConstants( $_settings = null ) {

        // Save original consants.
        $_originalConstants = get_defined_constants();

        $_settings = isset( $_settings ) ? $_settings : $this->_settings;

        foreach ( (array) $_settings as $key => $value ) {

          /** Ensure protected constants are not defined before the configs */
          if ( in_array( $key, $this->protectedConstants ) ) {
            continue;
          }

          if ( ! defined( $key ) ) {
            define( $key, $value );
          }

        }

        return $this->appliedConstants = array_diff_assoc( get_defined_constants(), $_originalConstants );

      }

      /**
       * Add Server Parameters
       *
       * @return $this
       */
      private function addServerParameters() {

        // Create an array of existing settings as well as accepted settings that may be set via $_SERVER even if not set in comoser.json
        $_acceptedKeys = array_merge( $this->_settings, array(
          'WP_DEBUG'          => null,
          'WP_SITEURL'          => null,
          'WP_HOME'          => null,
          'WP_DEBUG_DISPLAY'  => null,
          'WP_STATELESS_MEDIA_MODE'  => null,
          'DB_HOST'           => null,
          'DB_USER'           => null,
          'DB_NAME'           => null,
          'DB_PASSWORD'       => null,
          'DB_PREFIX'         => null,
          'WP_CACHE'          => null
        ) );

        // Extract valid server parameters that match available keys
        $this->serverParameters = array_intersect_key( Config::normalize( $_SERVER, true ), $_acceptedKeys );

        // Override extracted server parameters into settings
        $this->_settings = array_merge( $this->_settings, $this->serverParameters );

        return $this;

      }

      /**
       *
       */
      private function parseDatabase() {

        // Single database, do nothing.
        if ( isset( $this->_settings[ 'DB_HOST' ] ) && $this->_settings[ 'DB_HOST' ] ) {
          return;
        }

        // Multiple databases.
        if ( $this->_settings[ 'DB_0_HOST' ] ) {

          foreach( Config::find_by_prefix( $this->_settings, 'DB_0' ) as $_key => $_value ) {

            $this->_settings[ str_replace( '_0', '', $_key ) ]  = $_value;
            unset( $this->_settings[ $_key ] );
          }

        }

      }

      /**
       * @param $arr_main_array
       * @param string $prefix
       *
       * @return array
       */
      public function find_by_prefix( $arr_main_array, $prefix = '' ) {

        $arr_result = array();
        foreach ( $arr_main_array as $key => $value ) {
          //$exp_key = explode('_', $key);
          if ( strpos( $key, $prefix ) === 0 ) {
            $arr_result[ $key ] = $value;
          }
        }

        return $arr_result;
      }

      /**
       * @param array $array
       * @param string $prefix
       * @param string $seperator
       *
       * @return array
       */
      public function flatten( $array = array(), $prefix = '', $seperator = '_' ) {
        $result = array();

        foreach ( $array as $key => $value ) {

          if ( is_array( $value ) || is_object( $value ) ) {
            $result = $result + self::flatten( $value, $prefix . $key . $seperator, $seperator );
          } else {
            $result[ $prefix . $key ] = $value;
          }
        }

        return $result;

      }

      /**
       * Perform multiple pattern match searches.
       *
       * @param array $_settings
       *
       * @param array $extraPatterns
       * @return array
       */
      public function replacePatterns( $_settings = array(), $extraPatterns = array() ) {

        $_found_pattern = false;
        $_patternMap    = array_merge( (array) $_settings, array_change_key_case( $extraPatterns, false ) );

        foreach ( (array) $_settings as $key => $value ) {

          if ( preg_match_all( '/{([a-zA-Z\_\-]*?)}/ie', $value, $matches ) ) {
            $_found_pattern    = true;
            $_settings[ $key ] = preg_replace( '/{([a-zA-Z\_\-]*?)}/ie', '$_patternMap["$1"]', $value );
          }

        }

        if ( $_found_pattern ) {
          $_settings = self::replacePatterns( $_settings );
        }

        return $_settings;

      }

      /**
       * @param array $array
       *
       * @param bool $upper_key_case
       *
       * @return array
       */
      public function normalize( $array = array(), $upper_key_case = false ) {

        foreach ( (array) $array as $key => $value ) {

          if ( $value === 'false' ) {
            $array[ $key ] = false;
          }

          if ( $value === 'true' ) {
            $array[ $key ] = true;
          }

          if ( $value == '1' ) {
            $array[ $key ] = true;
          }

          if ( is_int( $value ) ) {
            $array[ $key ] = intval( $value );
          }

        }

        // Remove blanks.
        $array = array_filter( $array, create_function( '$a', 'return $a!=="";' ) );

        // Set array key case
        $array = array_change_key_case( $array, $upper_key_case );

        // Sort alphabetically.
        ksort( $array );

        return $array;

      }

      /**
       * This function lets us chain methods without having to instantiate first, YOU MUST COPY THIS TO ALL SUB CLASSES
       */
      static public function init() {
        return new self( __DIR__, false );
      }

      /**
       * This function looks through the configuration options that are stored and returns them
       *
       * @param string $config The config we're trying to load
       * @param mixed $value Whether we want to get a specific value from this config, or the whole thing
       *
       * @return mixed False on failure, config array on success
       */
      public function get_config( $config = null, $value = false ) {
        if ( isset( $this->loadedConfigs[ $config ] ) && is_array( $this->loadedConfigs[ $config ] ) && isset( $this->loadedConfigs[ $config ][ 'vars' ] ) ) {
          if ( is_string( $value ) && ! empty( $value ) && isset( $this->loadedConfigs[ $config ][ 'vars' ][ $value ] ) ) {
            return $this->loadedConfigs[ $config ][ 'vars' ][ $value ];
          } else {
            /** If there is only one item, return it directly */
            if ( count( $this->loadedConfigs[ $config ][ 'vars' ] ) == 1 ) {
              return array_pop( array_values( $this->loadedConfigs[ $config ][ 'vars' ] ) );
            } else {
              return $this->loadedConfigs[ $config ][ 'vars' ];
            }
          }
        } else {
          return false;
        }
      }

      /**
       * Parse comoser.json file for settings and extra.settings
       *
       * @author potanin@UD
       *
       * @param null $composer_file
       * @method parseComposer
       *
       * @return array
       */
      public function parseComposer( $composer_file = null ) {

        try {

          $_settings = array();

          $_composer = file_get_contents( $composer_file );
          $_composer = json_decode( $_composer, false, 512 );

        } catch( \Exception $error ) {
          // Most likely can't parse JSON file... Silently fail.
          return isset( $_settings ) ? $_settings : null;
        }

        if ( isset( $_composer->settings ) && is_object( $_composer->settings ) ) {
          foreach ( (array) $_composer->settings as $key => $value ) {
            $_settings[ $key ] = (array) $value;
          }
        }

        if ( isset( $_composer->extra ) && isset( $_composer->extra->settings ) && is_object( $_composer->extra->settings ) ) {
          foreach ( (array) $_composer->extra->settings as $key => $value ) {

            if ( isset( $_settings[ $key ] ) ) {
              $_settings[ $key ] = array_merge( $_settings[ $key ], $value );
            } else {
              $_settings[ $key ] = $value;
            }

          }

        }

        return (array) $_settings;

      }

      /**
       * This function basically looks for a way to load the specific config files, by first looking in the
       * current environment's folder, and then looking into the base config folder afterwards
       *
       * @param string $file The file we want to include
       * @param string $scope The scope for the variables, globally or locally, defaults to 'local'
       */
      private function load_config( $file, $scope = 'local' ) {
        /** Ok, make sure our variables are good */
        if ( ! ( is_string( $scope ) && $scope == 'global' ) ) {
          $scope = 'local';
        }
        $files = array();
        /** Loop through our config folders, stopping at the first one we can find and include */
        foreach ( $this->configFolders as $config_folder ) {
          if ( is_dir( $config_folder . $file ) ) {
            // echo 'Directory: ' . $config_folder . $file . "\r\n";
            $config_folder = $config_folder . $file . DIRECTORY_SEPARATOR;
            /** Scan the directory */
            $possibles = scandir( $config_folder );
            /** Loop through the possibles and include them if you can */
            foreach ( $possibles as $possible ) {
              /** Skip root folders */
              if ( $possible == '.' || $possible == '..' ) {
                continue;
              }
              /** Remove the '.php' file from the name if it has it */
              if ( substr( $possible, strlen( $possible ) - 4, 4 ) == '.php' ) {
                $possible = substr( $possible, 0, strlen( $possible ) - 4 );
              }
              /** Remove the '.json' file from the name if it has it */
              if ( substr( $possible, strlen( $possible ) - 5, 5 ) == '.json' ) {
                $possible = substr( $possible, 0, strlen( $possible ) - 5 );
              }
              /** Ok, now call ourselves, so we'll recurse through directories */
              $this->load_config( $file . DIRECTORY_SEPARATOR . $possible, $scope );
            }
          } elseif ( is_file( $config_folder . $file . '.php' ) ) {
            // echo 'File: ' . $config_folder . $file . '.php' . "\r\n";
            /** Try to include the file in our exclusions list, if not already included */
            if ( ! isset( $files[ $file ] ) ) {
              $files[ $file ] = array(
                'scope' => $scope,
                'file'  => $config_folder . $file . '.php'
              );
            }
          } elseif ( is_file( $config_folder . $file . '.json' ) ) {
            // echo 'File: ' . $config_folder . $file . '.json' . "\r\n";
            /** Try to include the file in our exclusions list, if not already included */
            if ( ! isset( $files[ $file ] ) ) {
              $files[ $file ] = array(
                'scope' => $scope,
                'file'  => $config_folder . $file . '.json'
              );
            }
          }
        }
        /** If we have a files array that is not empty, go through and include them */
        if ( is_array( $files ) && count( $files ) ) {
          /** Go ahead and require the file */
          foreach ( $files as $slug => $file ) {
            /** Ok, call our function (so we don't have to do a bunch of unsets) */
            $this->_try_load_config_file( $slug, $file );
          }
        }
      }

      /**
       * This function actually does the requiring
       *
       * @param string $slug File's slug to store
       * @param array $file File definition array as done in 'load_config'
       */
      private function _try_load_config_file( $slug, $file ) {
        if ( ! in_array( $slug, array_keys( $this->loadedConfigs ) ) ) {
          /** Now, require the file, base on the type it is */
          if ( substr( $file[ 'file' ], strlen( $file[ 'file' ] ) - 4, 4 ) == '.php' ) {
            require_once( $file[ 'file' ] );
            $file[ 'vars' ] = get_defined_vars();
          } elseif ( substr( $file[ 'file' ], strlen( $file[ 'file' ] ) - 5, 5 ) == '.json' ) {
            $file[ 'vars' ] = json_decode( file_get_contents( $file[ 'file' ] ), true );
            /** Loop through the items, and if they prefix with 'c:', they should be defined constants */
            foreach ( $file[ 'vars' ] as $key => $value ) {
              if ( substr( $key, 0, 2 ) == 'c:' ) {
                /** Let's go ahead and unset the key */
                unset( $file[ 'vars' ][ $key ] );
                /** Set the constant */
                define( substr( $key, 2, strlen( $key ) - 2 ), $value );
              }
            }
          }
          /** Go through and unset the protected variables */
          foreach ( $this->protectedVariables as $protected_variable ) {
            if ( isset( $file[ 'vars' ][ $protected_variable ] ) ) {
              unset( $file[ 'vars' ][ $protected_variable ] );
            }
          }
          /** Now, determine what to do with the vars */
          if ( isset( $file[ 'scope' ] ) && $file[ 'scope' ] == 'global' ) {
            foreach ( $file[ 'vars' ] as $key => $value ) {
              $GLOBALS[ $key ] = $value;
            }
          }
          /** No, add it to our loadedConfigs array */
          $this->loadedConfigs[ $slug ] = $file;
        }
      }

    }

  }

  /**
   * If we don't have the following defined, we should assume that we're directly including this file,
   * so we should initialize it
   */
  if ( ! isset( $wp_cluster ) || ! isset( $wp_cluster->config ) ) {
    global $wp_cluster;

    /** Init our config object */
    if ( ! is_object( $wp_cluster ) ) {
      $wp_cluster = new \stdClass();
    }

    /** Add to our object, if we don't have the config object */
    if ( ! isset( $wp_cluster->config ) ) {
      $wp_cluster->config = new Config();
    }

    // Now that we've done that, lets include our wp settings file, as per normal operations
    if ( file_exists( ABSPATH . 'wp-settings.php' ) ) {
      require_once( ABSPATH . 'wp-settings.php' );
    }

  }

}
