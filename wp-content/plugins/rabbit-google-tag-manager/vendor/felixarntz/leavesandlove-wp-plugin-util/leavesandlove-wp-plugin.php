<?php
/**
 * @package leavesandlove-wp-plugin-util
 * @author Felix Arntz <felix-arntz@leaves-and-love.net>
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

if ( ! class_exists( 'LaL_WP_Plugin' ) ) {

	/**
	 * The base plugin main class.
	 *
	 * The main class of each plugin that should use the plugin loader must extend this class.
	 *
	 * The class uses a singleton pattern and uses late static binding (one reason that PHP 5.3
	 * is required). The class will only be instantiated if all dependencies are met, so this will
	 * not cause a fatal error on PHP 5.2 setups.
	 *
	 * You must never instantiate your plugin class manually as it will be handled by the plugin loader.
	 * When you call the singleton handler, make sure to not specify any arguments to prevent an invalid
	 * instantiation.
	 *
	 * There are three things that you must implement in your derived class:
	 * * a protected static variable called `$_args` to store basic plugin information (this base class automatically handles it)
	 * * a protected class constructor that takes one argument and passes it on to its parent constructor
	 * * a protected method `run()` that actually bootstraps the plugin and its processes (except for loading the plugin textdomain as the base class already takes care of this)
	 *
	 * In addition the following static methods will be automatically called by the plugin loader if they exist:
	 * * `install()`: performs a site-wide installation (must return `true` or `false`)
	 * * `network_install()`: performs a network-wide installation (must return `true` or `false`)
	 * * `uninstall()`: performs a site-wide uninstallation (must return `true` or `false`)
	 * * `network_uninstall()`: performs a network-wide uninstallation (must return `true` or `false`)
	 * * `activate()`: performs a site-wide activation (must return `true` or `false`)
	 * * `network_activate()`: performs a network-wide activation (must return `true` or `false`)
	 * * `deactivate()`: performs a site-wide deactivation (must return `true` or `false`)
	 * * `network_deactivate()`: performs a network-wide deactivation (must return `true` or `false`)
	 * * `filter_plugin_links( $links )`: filters the site-wide plugin action links (must return the filtered `$links`)
	 * * `filter_network_plugin_links( $links )`: filters the network-wide plugin action links (must return the filtered `$links`)
	 * * `render_status_message()`: renders a plugin status message for a site-wide plugin (will be shown inside an admin notice)
	 * * `render_network_status_message()`: renders a plugin status message for a network-wide plugin (will be shown inside an admin notice)
	 *
	 * For more information about how these methods are called check the `LaL_WP_Plugin_Loader` documentation.
	 *
	 * In addition to the methods that you must or may implement, the base class also contains some static
	 * utility methods that the plugin can (and maybe even should!) use, for example to access basic plugin
	 * data like name, version, path, URL and more or to output PHP notices when the plugin is being used
	 * incorrectly.
	 *
	 * @since 1.5.0
	 */
	abstract class LaL_WP_Plugin {

		/**
		 * @since 1.5.0
		 * @var array Stores all instances of plugins based on this class.
		 */
		protected static $instances = array();

		/**
		 * @since 1.5.0
		 * @var array Contains basic plugin information. Variable must be redefined in the extending class.
		 */
		protected static $_args = array();

		/**
		 * Singleton handler.
		 *
		 * Uses late static binding and therefore must not be redefined in child class.
		 *
		 * @since 1.5.0
		 * @param array $args plugin data (passed automatically on instantiation)
		 * @return LaL_WP_Plugin_Util|null a plugin's main class instance or null if not instantiated yet
		 */
		public static function instance( $args = array() ) {
			$slug = '';
			if ( isset( $args['slug'] ) ) {
				$slug = $args['slug'];
			} elseif ( isset( static::$_args['slug'] ) ) {
				$slug = static::$_args['slug'];
			}

			if ( empty( $slug ) ) {
				return null;
			}

			if ( ! isset( self::$instances[ $slug ] ) ) {
				self::$instances[ $slug ] = new static( $args );
			}
			return self::$instances[ $slug ];
		}

		/**
		 * @since 1.5.0
		 * @var boolean Stores whether the `run()` method has already been called to prevent double initialization.
		 */
		protected $_run_method_called = false;

		/**
		 * Protected constructor for singleton.
		 *
		 * Should be redefined in child class, calling this constructor from there.
		 *
		 * @since 1.5.0
		 * @param array $args plugin data (passed automatically on instantiation)
		 */
		protected function __construct( $args ) {
			static::$_args = $args;
		}

		/**
		 * Internal method to initialize the plugin class.
		 *
		 * @since 1.5.0
		 */
		public function _maybe_run() {
			if ( ! $this->_run_method_called ) {
				$this->_run_method_called = true;
				$this->load_textdomain();
				$this->run();
			}
		}

		/**
		 * Abstract method that should actually bootstrap and initialize the plugin's processes.
		 *
		 * @since 1.5.0
		 */
		protected abstract function run();

		/**
		 * Loads the plugin textdomain.
		 *
		 * This method is automatically called by this base class and therefore should not be called manually.
		 *
		 * @since 1.5.0
		 * @return boolean status of the operation
		 */
		protected function load_textdomain() {
			if ( ! empty( static::$_args['textdomain'] ) ) {
				if ( ! empty( static::$_args['textdomain_dir'] ) ) {
					if ( 0 === strpos( static::$_args['mode'], 'bundled' ) ) {
						$locale = apply_filters( 'plugin_locale', get_locale(), static::$_args['textdomain'] );
						return load_textdomain( static::$_args['textdomain'], static::$_args['textdomain_dir'] . static::$_args['textdomain'] . '-' . $locale . '.mo' );
					} elseif ( 'muplugin' === static::$_args['mode'] ) {
						return load_muplugin_textdomain( static::$_args['textdomain'], static::$_args['textdomain_dir'] );
					} else {
						return load_plugin_textdomain( static::$_args['textdomain'], false, static::$_args['textdomain_dir'] );
					}
				} else {
					if ( 0 === strpos( static::$_args['mode'], 'bundled' ) ) {
						$locale = apply_filters( 'plugin_locale', get_locale(), static::$_args['textdomain'] );
						return load_textdomain( static::$_args['textdomain'], WP_LANG_DIR . '/plugins/' . static::$_args['textdomain'] . '-' . $locale . '.mo' );
					} else {
						// As of WordPress 4.6 there's no need to manually load the textdomain.
						if ( version_compare( get_bloginfo( 'version' ), '4.6', '>=' ) ) {
							return true;
						}
						if ( 'muplugin' === static::$_args['mode'] ) {
							return load_muplugin_textdomain( static::$_args['textdomain'] );
						} else {
							return load_plugin_textdomain( static::$_args['textdomain'] );
						}
					}
				}
			}
			return false;
		}

		/**
		 * Returns basic information about the plugin.
		 *
		 * If the first parameter is provided, the method will return the field's value (or false if invalid field).
		 * Otherwise it will return the full array of plugin information.
		 *
		 * Possible field names are:
		 * * `slug`
		 * * `name`
		 * * `version`
		 * * `main_file`
		 * * `basename` (for the plugin basename)
		 * * `mode` (either 'plugin', 'muplugin', 'bundled-plugin', 'bundled-muplugin', 'bundled-theme' or 'bundled-childtheme')
		 * * `namespace`
		 * * `textdomain`
		 * * `textdomain_dir`
		 * * `use_language_packs` (whether the plugin uses wordpress.org language packs)
		 * * `is_library` (whether the plugin is a library)
		 * * `network_only` (whether the plugin is network only)
		 *
		 * @since 1.5.0
		 * @param string $field field name to get value of (or empty to get all fields)
		 * @return string|boolean|array the plugin information field/s
		 */
		public static function get_info( $field = '' ) {
			if ( ! empty( $field ) ) {
				if ( isset( static::$_args[ $field ] ) ) {
					return static::$_args[ $field ];
				}
				return false;
			}
			return static::$_args;
		}

		/**
		 * Creates a full path from a path relative to the plugin's directory.
		 *
		 * @since 1.5.0
		 * @param string $path path relative to this plugin's directory
		 * @return string full path to be used in PHP
		 */
		public static function get_path( $path = '' ) {
			$base_path = '';
			switch ( static::$_args['mode'] ) {
				case 'bundled-childtheme':
					$base_path = get_stylesheet_directory() . str_replace( wp_normalize_path( get_stylesheet_directory() ), '', wp_normalize_path( dirname( static::$_args['main_file'] ) ) );
					break;
				case 'bundled-theme':
					$base_path = get_template_directory() . str_replace( wp_normalize_path( get_template_directory() ), '', wp_normalize_path( dirname( static::$_args['main_file'] ) ) );
					break;
				case 'muplugin':
					$base_path = plugin_dir_path( dirname( static::$_args['main_file'] ) . '/' . static::$_args['slug'] . '/composer.json' );
					break;
				case 'bundled-muplugin':
				case 'bundled-plugin':
				case 'plugin':
				default:
					$base_path = plugin_dir_path( static::$_args['main_file'] );
			}

			return \LaL_WP_Plugin_Util::build_path( $base_path, $path );
		}

		/**
		 * Creates a full URL from a path relative to the plugin's directory.
		 *
		 * @since 1.5.0
		 * @param string $path path relative to this plugin's directory
		 * @return string full URL to be used for loading assets for example
		 */
		public static function get_url( $path = '' ) {
			$base_path = '';
			switch ( static::$_args['mode'] ) {
				case 'bundled-childtheme':
					$base_path = get_stylesheet_directory_uri() . str_replace( wp_normalize_path( get_stylesheet_directory() ), '', wp_normalize_path( dirname( static::$_args['main_file'] ) ) );
					break;
				case 'bundled-theme':
					$base_path = get_template_directory_uri() . str_replace( wp_normalize_path( get_template_directory() ), '', wp_normalize_path( dirname( static::$_args['main_file'] ) ) );
					break;
				case 'muplugin':
					$base_path = plugin_dir_url( dirname( static::$_args['main_file'] ) . '/' . static::$_args['slug'] . '/composer.json' );
					break;
				case 'bundled-muplugin':
				case 'bundled-plugin':
				case 'plugin':
				default:
					$base_path = plugin_dir_url( static::$_args['main_file'] );
			}

			return \LaL_WP_Plugin_Util::build_path( $base_path, $path );
		}

		/**
		 * Outputs a PHP notice for a misused function of this plugin.
		 *
		 * The notice will only be triggered if `WP_DEBUG` is enabled.
		 *
		 * @since 1.5.0
		 * @param string $function this should be either `__FUNCTION__` or `__METHOD__` from the calling function
		 * @param string $message notice to show
		 * @param string $version version number where this notice was added
		 */
		public static function doing_it_wrong( $function, $message, $version ) {
			if ( WP_DEBUG && apply_filters( 'doing_it_wrong_trigger_error', true ) ) {
				$version = sprintf( __( 'This message was added in %1$s version %2$s.', 'lalwpplugin' ), '&quot;' . static::$_args['name'] . '&quot;', $version );
				trigger_error( sprintf( __( '%1$s was called <strong>incorrectly</strong>: %2$s %3$s', 'lalwpplugin' ), $function, $message, $version ) );
			}
		}

		/**
		 * Outputs a PHP deprecated notice for a function of this plugin.
		 *
		 * The notice will only be triggered if `WP_DEBUG` is enabled.
		 *
		 * @since 1.5.0
		 * @param string $function either `__FUNCTION__` or `__METHOD__` from the calling function
		 * @param string $version version number where this function was deprecated
		 * @param string|null $replacement function or method name to use as a replacement (if available)
		 */
		public static function deprecated_function( $function, $version, $replacement = null ) {
			if ( WP_DEBUG && apply_filters( 'deprecated_function_trigger_error', true ) ) {
				if ( null === $replacement ) {
					trigger_error( sprintf( __( '%1$s is <strong>deprecated</strong> as of %4$s version %2$s with no alternative available.', 'lalwpplugin' ), $function, $version, '', '&quot;' . static::$_args['name'] . '&quot;' ) );
				} else {
					trigger_error( sprintf( __( '%1$s is <strong>deprecated</strong> as of %4$s version %2$s. Use %3$s instead!', 'lalwpplugin' ), $function, $version, $replacement, '&quot;' . static::$_args['name'] . '&quot;' ) );
				}
			}
		}

		/**
		 * Outputs a PHP deprecated notice for an action hook of this plugin.
		 *
		 * The notice will only be triggered if `WP_DEBUG` is enabled.
		 *
		 * @since 1.7.0
		 * @param string $tag the hook name of the deprecated action hook
		 * @param string $version version number where this action hook was deprecated
		 * @param string|null $replacement hook name to use as a replacement (if available)
		 */
		public static function deprecated_action( $tag, $version, $replacement = null ) {
			if ( WP_DEBUG && apply_filters( 'deprecated_action_trigger_error', true ) ) {
				if ( null === $replacement ) {
					trigger_error( sprintf( __( 'The action %1$s is <strong>deprecated</strong> as of %4$s version %2$s with no alternative available.', 'lalwpplugin' ), $function, $version, '', '&quot;' . static::$_args['name'] . '&quot;' ) );
				} else {
					trigger_error( sprintf( __( 'The action %1$s is <strong>deprecated</strong> as of %4$s version %2$s. Use %3$s instead!', 'lalwpplugin' ), $function, $version, $replacement, '&quot;' . static::$_args['name'] . '&quot;' ) );
				}
			}
		}

		/**
		 * Outputs a PHP deprecated notice for a filter hook of this plugin.
		 *
		 * The notice will only be triggered if `WP_DEBUG` is enabled.
		 *
		 * @since 1.7.0
		 * @param string $tag the hook name of the deprecated filter hook
		 * @param string $version version number where this filter hook was deprecated
		 * @param string|null $replacement hook name to use as a replacement (if available)
		 */
		public static function deprecated_filter( $tag, $version, $replacement = null ) {
			if ( WP_DEBUG && apply_filters( 'deprecated_filter_trigger_error', true ) ) {
				if ( null === $replacement ) {
					trigger_error( sprintf( __( 'The filter %1$s is <strong>deprecated</strong> as of %4$s version %2$s with no alternative available.', 'lalwpplugin' ), $function, $version, '', '&quot;' . static::$_args['name'] . '&quot;' ) );
				} else {
					trigger_error( sprintf( __( 'The filter %1$s is <strong>deprecated</strong> as of %4$s version %2$s. Use %3$s instead!', 'lalwpplugin' ), $function, $version, $replacement, '&quot;' . static::$_args['name'] . '&quot;' ) );
				}
			}
		}

		/**
		 * Outputs a PHP deprecated notice for an argument of a function of this plugin.
		 *
		 * The notice will only be triggered if `WP_DEBUG` is enabled.
		 *
		 * @since 1.5.0
		 * @param string $function either `__FUNCTION__` or `__METHOD__` from the calling function
		 * @param string $version version number where this argument was deprecated
		 * @param string|null $message additional notice about a replacement (if available)
		 */
		public static function deprecated_argument( $function, $version, $message = null ) {
			if ( WP_DEBUG && apply_filters( 'deprecated_argument_trigger_error', true ) ) {
				if ( null === $message ) {
					trigger_error( sprintf( __( '%1$s was called with an argument that is <strong>deprecated</strong> as of %4$s version %2$s. %3$s', 'lalwpplugin' ), $function, $version, '', '&quot;' . static::$_args['name'] . '&quot;' ) );
				} else {
					trigger_error( sprintf( __( '%1$s was called with an argument that is <strong>deprecated</strong> as of %4$s version %2$s with no alternative available.', 'lalwpplugin' ), $function, $version, $message, '&quot;' . static::$_args['name'] . '&quot;' ) );
				}
			}
		}

	}

}
