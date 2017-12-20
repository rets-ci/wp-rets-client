<?php
/**
 * @package leavesandlove-wp-plugin-util
 * @author Felix Arntz <felix-arntz@leaves-and-love.net>
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

if ( ! class_exists( 'LaL_WP_Plugin_Loader' ) ) {

	/**
	 * The plugin loader class.
	 *
	 * The only method you should ever interact with is `load_plugin()`.
	 *
	 * The class manages the complete plugin loading process.
	 * It checks for the plugin dependencies and only initializes the plugin if all dependencies are met.
	 * It also handles plugin install, activate, deactivate and uninstall processes,
	 * as well as showing a plugin status message and adding plugin action links if available.
	 *
	 * The class makes any plugin multisite-compatible by default by running its regular bootstrapping
	 * functions for each site in a network if the plugin is active network wide.
	 *
	 * The class also allows any plugin to be used as either a regular plugin, a must-use plugin or
	 * bundled into another dependency, for example as part of another plugin or theme.
	 *
	 * In addition to regular plugins, installation and activation processes are supported for must-use
	 * plugins as well.
	 *
	 * @since 1.5.0
	 */
	final class LaL_WP_Plugin_Loader {

		/**
		 * Required PHP version
		 */
		const REQUIRED_PHP = '5.3.0';

		/**
		 * Required WordPress version
		 */
		const REQUIRED_WP = '3.5.0';

		/**
		 * @since 1.5.0
		 * @var boolean Stores whether the plugin loader has been initialized yet.
		 */
		private static $initialized = false;

		/**
		 * @since 1.5.0
		 * @var array Stores the active and running plugin instances.
		 */
		private static $plugins = array();

		/**
		 * @since 1.5.0
		 * @var array Stores the active plugin basenames, whether running or not.
		 */
		private static $basenames = array();

		/**
		 * @since 1.5.0
		 * @var array Stores dependency errors of the active plugins that are not running.
		 */
		private static $errors = array();

		/**
		 * @since 1.6.1
		 * @var array|false Temporarily stores plugins that need to be initialized on 'plugins_loaded'.
		 */
		private static $plugins_queue = array();

		/**
		 * @since 1.6.1
		 * @var array|false Temporarily stores must-use plugins that need to be initialized on 'muplugins_loaded'.
		 */
		private static $muplugins_queue = array();

		/**
		 * Loads a plugin.
		 *
		 * Note that the plugin must use namespaces, and its main class must be called `App`.
		 * The class itself must extend `LaL_WP_Plugin` and implement the required methods.
		 * There are some additional static methods that will be automatically handled by the
		 * plugin loader class if they exist in the plugin main class.
		 *
		 * For more information, see the documentation of `LaL_WP_Plugin`.
		 *
		 * The `$args` array must contain basic plugin information.
		 *
		 * The following keys are required:
		 * * `slug`: the plugin slug, a hyphen-separated string, like the URL slug of the plugin on wordpress.org (the plugin does not need to be hosted there though)
		 * * `name`: the plugin name, for display to human readers
		 * * `version`: the plugin's current version
		 * * `main_file`: the plugin's main file (just run `__FILE__` from your plugin's main file)
		 * * `namespace`: the namespace of the plugin's main class
		 *
		 * The `$args` array may also contain the following keys:
		 * * `textdomain`: the textdomain of the plugin (default is empty for no textdomain)
		 * * `use_language_packs`: boolean to indicate whether the plugin should use wordpress.org language packs for its translations
		 * * `is_library`: boolean to indicate whether the plugin is a library plugin; this will allow other plugins and themes to bundle it
		 *
		 * The `LaL_WP_Plugin` base class will automatically load the plugin textdomain for you
		 * so you should not load it manually.
		 * If your plugin has a textdomain and does not use language packs, the plugin's translation
		 * files must be located in the immediate `/languages/` subdirectory of the plugin.
		 *
		 * The `$dependencies` array is optional and allows to store dependencies for the plugin.
		 *
		 * The following keys are valid:
		 * * `phpversion`: the required PHP version
		 * * `wpversion`: the required WordPress version
		 * * `functions`: an array of PHP functions to check for their existance (for example functions of a PHP extension that might not be always active)
		 * * `plugins`: an array of plugins and their required version numbers; the key can be either a plugin slug or a plugin basename while the key must be the version number; if an empty string is provided for the version number, the plugin loader will only check whether that plugin is active at all
		 *
		 * Note that the minimum required dependencies are PHP 5.3 and WordPress 3.5.
		 * The plugin loader itself however does not require PHP 5.3 and will ensure that the plugin
		 * fails gracefully even on a PHP 5.2 setup.
		 *
		 * This function must be called directly from the plugin's main file.
		 * It must not be attached to any hook as the plugin loader must run some processes before
		 * initializing the actual plugin. The loader will furthermore automatically initialize the
		 * plugin on the necessary hook (`plugins_loaded` or `muplugins_loaded`).
		 *
		 * @api
		 * @since 1.5.0
		 * @param array $args the basic plugin information
		 * @param array $dependencies the plugin dependencies (optional)
		 * @return bool true if the plugin was successfully initialized, otherwise false
		 */
		public static function load_plugin( $args, $dependencies = array() ) {
			if ( ! self::$initialized ) {
				self::_init();
			}

			$args = wp_parse_args( $args, array(
				'slug'					=> '',
				'name'					=> '',
				'version'				=> '1.0.0',
				'main_file'				=> '',
				'namespace'				=> '',
				'textdomain'			=> '',
				'use_language_packs'	=> false,
				'is_library'			=> false,
				'network_only'			=> false,
			) );

			$dependencies = wp_parse_args( $dependencies, array(
				'phpversion'			=> '',
				'wpversion'				=> '',
				'functions'				=> array(),
				'plugins'				=> array(),
			) );

			// prevent double instantiation of plugin
			if ( isset( self::$plugins[ $args['slug'] ] ) || isset( self::$errors[ $args['slug'] ] ) ) {
				return false;
			}

			// check for required arguments
			$required_args = array( 'slug', 'name', 'version', 'main_file', 'namespace' );
			foreach ( $required_args as $arg ) {
				if ( empty( $args[ $arg ] ) ) {
					return false;
				}
			}

			$running = true;

			// detect plugin mode
			$args['basename'] = plugin_basename( $args['main_file'] );
			if ( substr_count( $args['basename'], '/' ) > 1 ) {
				// only allow bundled plugin if it is a library
				if ( ! $args['is_library'] ) {
					return false;
				}
				$args['mode'] = 'bundled';
				if ( 0 === strpos( wp_normalize_path( $args['main_file'] ), wp_normalize_path( get_stylesheet_directory() ) ) ) {
					$args['mode'] .= '-childtheme';
				} elseif ( 0 === strpos( wp_normalize_path( $args['main_file'] ), wp_normalize_path( get_template_directory() ) ) ) {
					$args['mode'] .= '-theme';
				} elseif ( 0 === strpos( wp_normalize_path( $args['main_file'] ), wp_normalize_path( WPMU_PLUGIN_DIR ) ) ) {
					$args['mode'] .= '-muplugin';
				} else {
					$args['mode'] .= '-plugin';
				}
				$args['basename'] = basename( $args['main_file'] );
			} elseif ( 0 === strpos( wp_normalize_path( $args['main_file'] ), wp_normalize_path( WPMU_PLUGIN_DIR ) ) ) {
				$args['mode'] = 'muplugin';
			} else {
				$args['mode'] = 'plugin';
			}

			// set textdomain dir
			if ( $args['use_language_packs'] ) {
				$args['textdomain_dir'] = '';
			} else {
				if ( 0 === strpos( $args['mode'], 'bundled' ) ) {
					$args['textdomain_dir'] = dirname( $args['main_file'] ) . '/languages/';
				} elseif ( 'muplugin' === $args['mode'] ) {
					$args['textdomain_dir'] = $args['slug'] . '/languages/';
				} else {
					$args['textdomain_dir'] = dirname( $args['basename'] ) . '/languages/';
				}
			}

			// set base dependencies
			$base_dependencies = array(
				'phpversion'	=> self::REQUIRED_PHP,
				'wpversion'		=> self::REQUIRED_WP,
			);
			foreach ( $base_dependencies as $type => $value ) {
				if ( empty( $dependencies[ $type ] ) || version_compare( $dependencies[ $type ], $value ) < 0 ) {
					$dependencies[ $type ] = $value;
				}
			}

			// fix namespace
			$args['namespace'] = trim( $args['namespace'], '\\' );

			// store basename
			self::$basenames[ $args['slug'] ] = $args['basename'];

			// create errors array
			self::$errors[ $args['slug'] ] = array(
				'name'				=> $args['name'],
				'function_errors'	=> array(),
				'version_errors'	=> array(),
			);

			// check for missing functions
			foreach ( $dependencies['functions'] as $func ) {
				if ( ! is_callable( $func ) ) {
					$funcname = '';
					if ( is_array( $func ) ) {
						$func = array_values( $func );
						if ( 2 === count( $func ) ) {
							if ( is_object( $func[0] ) ) {
								$func[0] = get_class( $func[0] );
							}
							$funcname = implode( '::', $func );
						} else {
							$funcname = $func[0];
						}
					} else {
						$funcname = $func;
					}
					self::$errors[ $args['slug'] ]['function_errors'][] = $funcname;
					$running = false;
				}
			}

			// check PHP version
			$check = self::_check_php( $dependencies['phpversion'] );
			if ( $check !== true ) {
				self::$errors[ $args['slug'] ]['version_errors'][] = array(
					'slug'			=> 'php',
					'name'			=> 'PHP',
					'type'			=> 'php',
					'requirement'	=> $dependencies['phpversion'],
					'installed'		=> $check,
				);
				$running = false;
			}

			// check WordPress version
			$check = self::_check_wordpress( $dependencies['wpversion'] );
			if ( $check !== true ) {
				self::$errors[ $args['slug'] ]['version_errors'][] = array(
					'slug'			=> 'wordpress',
					'name'			=> 'WordPress',
					'type'			=> 'core',
					'requirement'	=> $dependencies['wpversion'],
					'installed'		=> $check,
				);
				$running = false;
			}

			// check for missing or outdated plugins
			$check_network_wide = self::_is_network_wide_plugin( $args['slug'] );
			foreach ( $dependencies['plugins'] as $plugin_slug => $version ) {
				$check = self::_check_plugin( $plugin_slug, $version, $check_network_wide );
				if ( $check !== true ) {
					self::$errors[ $args['slug'] ]['version_errors'][] = array(
						'slug'				=> $plugin_slug,
						'type'				=> 'plugin',
						'requirement'		=> $version,
						'installed'			=> $check,
					);
					$running = false;
				}
			}

			// if everything is fine, remove the errors array and store the plugin main class instance
			if ( $running ) {
				unset( self::$errors[ $args['slug'] ] );

				if ( ! class_exists( 'LaL_WP_Plugin' ) ) {
					require_once dirname( __FILE__ ) . '/leavesandlove-wp-plugin.php';
				}

				$classname = $args['namespace'] . '\\App';
				self::$plugins[ $args['slug'] ] = call_user_func( array( $classname, 'instance' ), $args );
			}

			// set up plugin hooks and run the plugin if everything is fine
			switch ( $args['mode'] ) {
				case 'bundled-plugin':
				case 'bundled-muplugin':
				case 'bundled-theme':
				case 'bundled-childtheme':
					if ( $running ) {
						self::$plugins[ $args['slug'] ]->_maybe_run();
					}
					break;
				case 'muplugin':
				case 'plugin':
					if ( 'muplugin' === $args['mode'] ) {
						if ( is_multisite() ) {
							$network_wide = true;
							$opt_mode = 'site_option';
						} else {
							$network_wide = false;
							$opt_mode = 'option';
						}
						$activated = call_user_func( 'get_' . $opt_mode, 'lalwpplugin_activated_muplugins', array() );
						if ( ! isset( $activated[ $args['slug'] ] ) ) {
							add_action( 'activate_' . self::$basenames[ $args['slug'] ], array( __CLASS__, 'activate' ), 10, 2 );
							do_action( 'activate_' . self::$basenames[ $args['slug'] ], $network_wide, true );
						}
					} else {
						register_activation_hook( $args['main_file'], array( __CLASS__, '_activate' ) );
						register_deactivation_hook( $args['main_file'], array( __CLASS__, '_deactivate' ) );
						register_uninstall_hook( $args['main_file'], array( __CLASS__, '_uninstall' ) );
					}

					if ( $running ) {
						if ( 'muplugin' === $args['mode'] ) {
							self::$muplugins_queue[] = $args['slug'];
						} else {
							self::$plugins_queue[] = $args['slug'];
						}
						add_filter( 'plugin_action_links_' . self::$basenames[ $args['slug'] ], array( __CLASS__, '_filter_action_links' ) );
						if ( self::_is_network_wide_plugin( $args['slug'] ) ) {
							add_filter( 'network_admin_plugin_action_links_' . self::$basenames[ $args['slug'] ], array( __CLASS__, '_filter_network_action_links' ) );
						}
					} else {
						add_filter( 'plugin_action_links_' . self::$basenames[ $args['slug'] ], array( __CLASS__, '_filter_invalid_plugin_action_links' ) );
						if ( self::_is_network_wide_plugin( $args['slug'] ) ) {
							add_filter( 'network_admin_plugin_action_links_' . self::$basenames[ $args['slug'] ], array( __CLASS__, '_filter_invalid_plugin_action_links' ) );
						}
					}
					break;
				default:
			}

			return $running;
		}

		/**
		 * Returns the instance of a specific plugin.
		 *
		 * This allows other plugins or themes to easily access a specific plugin's main class.
		 *
		 * The plugin must be running to be returned by this method.
		 *
		 * @api
		 * @since 1.5.0
		 * @param string $plugin_slug plugin slug of the plugin to get
		 * @return LaL_WP_Plugin|null the plugin's main class instance or null if not available
		 */
		public static function get_plugin( $plugin_slug ) {
			if ( isset( self::$plugins[ $plugin_slug ] ) ) {
				return self::$plugins[ $plugin_slug ];
			}
			return null;
		}

		/**
		 * The activation handler for `register_activation_hook()`.
		 *
		 * The plugin which should be handled by the hook is detected automatically.
		 *
		 * This method enhances the default WordPress experience by distinguishing between
		 * a plugin installation and activation. A plugin will only be installed if it not
		 * installed yet, but it will be activated on every activation.
		 *
		 * The following static methods will be called automatically by this handler if they exist
		 * in your plugin's main class:
		 * * `install()`: the plugin's installation method (for example to set up database tables)
		 * * `activate()`: the plugin's activation method (for example to set up rewrites)
		 * * `network_install()`: the plugin's network installation method (if the plugin is installed network-wide)
		 * * `network_activate()`: the plugin's network activation method (if the plugin is activated network-wide)
		 *
		 * Each of the above functions must return either `true` or `false`, depending on whether the
		 * process was successful.
		 *
		 * Note that the regular `install()` and `activate()` methods will also be called if the plugin
		 * is activated network-wide, for each site affected.
		 * The `network_install()` and `network_activate()` methods are only needed if something that is
		 * actually on the network level needs to be set up.
		 * If these methods exist, they are run before the regular methods though.
		 *
		 * @since 1.5.0
		 * @param boolean $network_wide whether the plugin is activated network-wide
		 * @param boolean $muplugin whether the plugin is a must-use plugin
		 */
		public static function _activate( $network_wide = false, $muplugin = false ) {
			global $wpdb;

			$slug = str_replace( 'activate_', '', current_action() );
			$slug = array_search( $slug, self::$basenames );

			if ( ! $slug ) {
				return;
			}

			if ( $network_wide ) {
				$context = 'network';
				$opt_mode = 'site_option';
				$prefix = 'network_';
			} else {
				$context = 'site';
				$opt_mode = 'option';
				$prefix = '';
			}

			if ( $muplugin ) {
				$option_name = 'lalwpplugin_activated_muplugins';
			} else {
				$option_name = 'lalwpplugin_activated_plugins';
			}

			// only activate the plugin if it has not been activated yet
			$activated = call_user_func( 'get_' . $opt_mode, $option_name, array() );
			if ( isset( $activated[ $slug ] ) ) {
				return;
			}

			// only run the activation methods if the plugin was successfully initialized
			if ( isset( self::$plugins[ $slug ] ) ) {
				$plugin_class = get_class( self::$plugins[ $slug ] );

				$global_status = true;

				// only install the plugin if it has not been installed yet
				$installed = call_user_func( 'get_' . $opt_mode, 'lalwpplugin_installed_plugins', array() );
				$do_install = ! isset( $installed[ $slug ] ) || ! $installed[ $slug ];

				$status = self::_activate_plugin( $plugin_class, $context, $do_install );
				if ( ! $status ) {
					$global_status = false;
				}

				// for network wide activations, run the regular activation process for each site of the network
				if ( 'network' === $context && ! call_user_func( array( $plugin_class, 'get_info' ), 'network_only' ) ) {
					$site_ids = self::_get_site_ids();
					foreach ( $site_ids as $site_id ) {
						switch_to_blog( $site_id );

						$status = self::_activate_plugin( $plugin_class, 'site', $do_install );
						if ( ! $status ) {
							$global_status = false;
						}
					}
					LaL_WP_Plugin_Util::restore_original_blog();
				}

				if ( $do_install ) {
					if ( $global_status ) {
						$installed[ $slug ] = true;
					} else {
						$installed[ $slug ] = false;
					}
					call_user_func( 'update_' . $opt_mode, 'lalwpplugin_installed_plugins', $installed );
				}
			}

			$activated[ $slug ] = 'activated';
			call_user_func( 'update_' . $opt_mode, $option_name, $activated );
		}

		/**
		 * The deactivation handler for `register_deactivation_hook()`.
		 *
		 * The plugin which should be handled by the hook is detected automatically.
		 *
		 * The following static methods will be called automatically by this handler if they exist
		 * in your plugin's main class:
		 * * `deactivate()`: the plugin's deactivation method (for example to remove rewrites)
		 * * `network_deactivate()`: the plugin's network deactivation method (if the plugin is deactivated network-wide)
		 *
		 * Each of the above functions must return either `true` or `false`, depending on whether the
		 * process was successful.
		 *
		 * Note that the regular `deactivate()` method will also be called if the plugin
		 * is deactivated network-wide, for each site affected.
		 * The `network_deactivate()` method is only needed if something that is
		 * actually on the network level needs to be "deactivated".
		 * If this method exists, it is run before the regular method though.
		 *
		 * @since 1.5.0
		 * @param boolean $network_wide whether the plugin is deactivated network-wide
		 * @param boolean $muplugin whether the plugin is a must-use plugin
		 */
		public static function _deactivate( $network_wide = false, $muplugin = false ) {
			$slug = str_replace( 'deactivate_', '', current_action() );
			$slug = array_search( $slug, self::$basenames );

			if ( ! $slug ) {
				return;
			}

			if ( $network_wide ) {
				$context = 'network';
				$opt_mode = 'site_option';
				$prefix = 'network_';
			} else {
				$context = 'site';
				$opt_mode = 'option';
				$prefix = '';
			}

			if ( $muplugin ) {
				$option_name = 'lalwpplugin_activated_muplugins';
			} else {
				$option_name = 'lalwpplugin_activated_plugins';
			}

			// only deactivate the plugin if it has not been deactivated yet
			$activated = call_user_func( 'get_' . $opt_mode, $option_name, array() );
			if ( ! isset( $activated[ $slug ] ) ) {
				return;
			}

			// only run the deactivation methods if the plugin was successfully initialized
			if ( isset( self::$plugins[ $slug ] ) && ! $muplugin ) {
				$plugin_class = get_class( self::$plugins[ $slug ] );

				$global_status = true;

				$status = self::_deactivate_plugin( $plugin_class, $context );
				if ( ! $status ) {
					$global_status = false;
				}

				// for network wide deactivations, run the regular deactivation process for each site of the network
				if ( 'network' === $context && ! call_user_func( array( $plugin_class, 'get_info' ), 'network_only' ) ) {
					$site_ids = self::_get_site_ids();
					foreach ( $site_ids as $site_id ) {
						switch_to_blog( $site_id );

						$status = self::_deactivate_plugin( $plugin_class, 'site' );
						if ( ! $status ) {
							$global_status = false;
						}
					}
					LaL_WP_Plugin_Util::restore_original_blog();
				}
			}

			unset( $activated[ $slug ] );
			if ( 0 === count( $activated ) ) {
				call_user_func( 'delete_' . $opt_mode, $option_name );
			} else {
				call_user_func( 'update_' . $opt_mode, $option_name, $activated );
			}
		}

		/**
		 * The uninstall handler for `register_uninstall_hook()`.
		 *
		 * The plugin which should be handled by the hook is detected automatically.
		 * The handler will also detect whether the plugin to uninstall is installed network-wide.
		 *
		 * The following static methods will be called automatically by this handler if they exist
		 * in your plugin's main class:
		 * * `uninstall()`: the plugin's uninstallation method (for example to remove database tables)
		 * * `network_uninstall()`: the plugin's network uninstallation method (if the plugin is uninstalled network-wide)
		 *
		 * Each of the above functions must return either `true` or `false`, depending on whether the
		 * process was successful.
		 *
		 * Note that the regular `uninstall()` method will also be called if the plugin
		 * is uninstalled network-wide, for each site affected.
		 * The `network_uninstall()` method is only needed if something that is
		 * actually on the network level needs to be removed.
		 * If this method exists, it is run before the regular method though.
		 *
		 * @since 1.5.0
		 */
		public static function _uninstall() {
			$slug = str_replace( 'uninstall_', '', current_action() );
			$slug = array_search( $slug, self::$basenames );

			if ( ! $slug ) {
				return;
			}

			// only run the uninstall methods if the plugin was successfully initialized
			if ( isset( self::$plugins[ $slug ] ) ) {
				$plugin_class = get_class( self::$plugins[ $slug ] );

				$global_status = true;

				$network_wide = self::_is_network_wide_plugin( $slug, true );

				if ( $network_wide ) {
					$context = 'network';
					$opt_mode = 'site_option';
					$prefix = 'network_';
				} else {
					$context = 'site';
					$opt_mode = 'option';
					$prefix = '';
				}

				// only uninstall the plugin if it has not been uninstalled yet
				$installed = call_user_func( 'get_' . $opt_mode, 'lalwpplugin_installed_plugins', array() );
				if ( ! isset( $installed[ $slug ] ) ) {
					return;
				}

				$status = self::_uninstall_plugin( $plugin_class, $context );
				if ( ! $status ) {
					$global_status = false;
				}

				// for network wide uninstallations, run the regular uninstall process for each site of the network
				if ( 'network' === $context && ! call_user_func( array( $plugin_class, 'get_info' ), 'network_only' ) ) {
					$site_ids = self::_get_site_ids();
					foreach ( $site_ids as $site_id ) {
						switch_to_blog( $site_id );

						$status = self::_uninstall_plugin( $plugin_class, 'site' );
						if ( ! $status ) {
							$global_status = false;
						}
					}
					LaL_WP_Plugin_Util::restore_original_blog();
				}

				unset( $installed[ $slug ] );
				if ( 0 === count( $installed ) ) {
					call_user_func( 'delete_' . $opt_mode, 'lalwpplugin_installed_plugins' );
				} else {
					call_user_func( 'update_' . $opt_mode, 'lalwpplugin_installed_plugins', $installed );
				}
			}
		}

		/**
		 * Filters the plugin action links in the regular plugins screen.
		 *
		 * If your plugin's main class contains the static method `filter_plugin_links()`,
		 * it will be called to easily adjust these links.
		 *
		 * @since 2.0.0
		 * @param array $links the unfiltered plugin action links
		 * @return array the filtered plugin action links
		 */
		public static function _filter_action_links( $links ) {
			$slug = str_replace( 'plugin_action_links_', '', current_filter() );
			$slug = array_search( $slug, self::$basenames );

			if ( ! $slug ) {
				return $links;
			}

			$plugin_class = get_class( self::$plugins[ $slug ] );
			if ( is_callable( array( $plugin_class, 'filter_plugin_links' ) ) ) {
				$links = call_user_func( array( $plugin_class, 'filter_plugin_links' ), $links );
			}

			return $links;
		}

		/**
		 * Filters the plugin action links in the network plugins screen.
		 *
		 * If your plugin's main class contains the static method `filter_network_plugin_links()`,
		 * it will be called to easily adjust these links.
		 *
		 * @since 2.0.0
		 * @param array $links the unfiltered network plugin action links
		 * @return array the filtered network plugin action links
		 */
		public static function _filter_network_action_links( $links ) {
			$slug = str_replace( 'network_admin_plugin_action_links_', '', current_filter() );
			$slug = array_search( $slug, self::$basenames );

			if ( ! $slug ) {
				return $links;
			}

			$plugin_class = get_class( self::$plugins[ $slug ] );
			if ( is_callable( array( $plugin_class, 'filter_network_plugin_links' ) ) ) {
				$links = call_user_func( array( $plugin_class, 'filter_network_plugin_links' ), $links );
			}

			return $links;
		}

		/**
		 * Displays dependency error messages as admin notices for any plugins that could not
		 * be initialized properly.
		 *
		 * If the current user has the required capabilities and if the related action is possible,
		 * the notices will also contain buttons to install, update or activate the required dependencies.
		 *
		 * @since 1.5.0
		 */
		public static function _display_error_messages() {
			if ( is_network_admin() ) {
				$context = 'network';
				$capability = 'manage_network_plugins';
				$network_plugin_cmp = true;
			} else {
				$context = 'site';
				$capability = 'activate_plugins';
				$network_plugin_cmp = false;
			}

			// bail if no errors exist or the user is missing capabilities
			if ( ! self::$errors || ! current_user_can( $capability ) ) {
				return;
			}

			// show information about missing dependencies for plugins
			foreach ( self::$errors as $slug => $data ) {
				if ( $network_plugin_cmp !== self::_is_network_wide_plugin( $slug ) ) {
					continue;
				}
				?>
				<div class="notice error">
					<h4><?php printf( __( 'Fatal error with plugin %s', 'lalwpplugin' ), '<em>' . $data['name'] . '</em>' ); ?></h4>
					<p><?php _e( 'Due to missing dependencies, the plugin cannot be initialized.', 'lalwpplugin' ); ?></p>
					<hr />
					<?php if ( 0 < count( $data['function_errors'] ) ) : ?>
						<p><?php _e( 'The following required PHP functions could not be found:', 'lalwpplugin' ); ?></p>
						<ul>
							<?php foreach ( $data['function_errors'] as $funcname ) : ?>
								<li><code><?php echo $funcname; ?></code></li>
							<?php endforeach; ?>
						</ul>
						<p><?php _e( 'There are probably some PHP extensions missing, or you might be using an outdated version of PHP. If you do not know how to fix this, please ask your hosting provider.', 'lalwpplugin' ); ?></p>
					<?php endif; ?>
					<?php if ( 0 < count( $data['version_errors'] ) ) : ?>
						<p><?php _e( 'The following required dependencies are either inactive or outdated:', 'lalwpplugin' ); ?></p>
						<ul>
							<?php foreach ( $data['version_errors'] as $dependency ) : ?>
								<?php $dependency = LaL_WP_Plugin_Util::extend_dependency( $dependency, $context ); ?>
								<li>
									<?php if ( ! $dependency['installed'] ) : ?>
										<?php printf( __( '%s could not be found.', 'lalwpplugin' ), $dependency['name'] ); ?>
									<?php elseif ( 'SITEONLY' === $dependency['installed'] ) : ?>
										<?php printf( __( '%s is active sitewide, but it must be activated across the entire network.', 'lalwpplugin' ), $dependency['name'] ); ?>
									<?php elseif ( 0 === strpos( $dependency['installed'], 'MU' ) ) : ?>
										<?php printf( __( '%1$s is outdated. You are using version %3$s, but version %2$s is required. Since this is a must-use plugin, you need to update it manually.', 'lalwpplugin' ), $dependency['name'], $dependency['requirement'], substr( $dependency['installed'], 2 ) ); ?>
									<?php else : ?>
										<?php printf( __( '%1$s is outdated. You are using version %3$s, but version %2$s is required.', 'lalwpplugin' ), $dependency['name'], $dependency['requirement'], $dependency['installed'] ); ?>
									<?php endif; ?>
									<?php if ( ! empty( $dependency['action_link'] ) ) : ?>
										<a href="<?php echo $dependency['action_link']; ?>" class="button"><?php echo $dependency['action_name']; ?></a>
									<?php endif; ?>
								</li>
							<?php endforeach; ?>
						</ul>
						<p><?php _e( 'Please update the above resources.', 'lalwpplugin' ); ?></p>
					<?php endif; ?>
				</div>
				<?php
			}
		}

		/**
		 * Displays status messages as admin notices for any plugins that are running successfully
		 * and that have a status message available.
		 *
		 * The following static methods will be called automatically by this handler if they exist
		 * in your plugin's main class:
		 * * `render_status_message`: should output a message to show to the admin
		 * * `render_network_status_message`: should output a message to show to the network admin
		 *
		 * While error messages (see `_display_error_messages()`) are permanent (as long as the plugin is
		 * not deactivated), these status messages can be dismissed and will not show again once
		 * dismissed.
		 *
		 * They will furthermore only show in their related context, for example a status message
		 * for a plugin that is activated network-wide will only show in the network admin.
		 *
		 * @since 2.0.0
		 */
		public static function _display_status_messages() {
			if ( is_network_admin() ) {
				$context = 'network';
				$opt_mode = 'site_option';
				$capability = 'manage_network_options';
				$funcname = 'render_network_status_message';
			} else {
				$context = 'site';
				$opt_mode = 'option';
				$capability = 'manage_options';
				$funcname = 'render_status_message';
			}

			$activated = call_user_func( 'get_' . $opt_mode, 'lalwpplugin_activated_plugins', array() );
			$activated_mu = call_user_func( 'get_' . $opt_mode, 'lalwpplugin_activated_muplugins', array() );

			$filtered_activated = array_diff_key( array_filter( $activated, array( __CLASS__, '_filter_for_status_message' ) ), self::$errors );
			$filtered_activated_mu = array_diff_key( array_filter( $activated_mu, array( __CLASS__, '_filter_for_status_message' ) ), self::$errors );

			// bail if no status messages exist or the user is missing capabilities
			if ( ! $filtered_activated && ! $filtered_activated_mu || ! current_user_can( $capability ) ) {
				return;
			}

			// render the script to permanently hide a plugin status message
			?>
			<script type="text/javascript">
				jQuery( document ).ready( function( $ ) {
					$( document ).on( 'click', '.lalwpplugin-notice .notice-dismiss', function( e ) {
						var id = $( this ).parents( '.lalwpplugin-notice' ).attr( 'id' ).replace( '-notice', '' );
						var type = $( this ).parents( '.lalwpplugin-notice' ).hasClass( 'mu' ) ? 'muplugin' : 'plugin';
						if ( ! id ) {
							return;
						}
						$.ajax( '<?php echo admin_url( "admin-ajax.php" ); ?>', {
							data: {
								action: 'lalwpplugin_dismiss_notice',
								plugin: id,
								type: type,
								context: '<?php echo $context; ?>'
							},
							dataType: 'json',
							method: 'POST'
						});
					});
				});
			</script>
			<?php

			// show status message for plugins
			foreach ( self::$plugins as $slug => $obj ) {
				$plugin_class = get_class( $obj );
				if ( ! is_callable( array( $plugin_class, $funcname ) ) ) {
					continue;
				}
				$value = '';
				$class = 'lalwpplugin-notice notice updated is-dismissible hide-if-no-js';
				if ( isset( $activated[ $slug ] ) && $activated[ $slug ] && 'no-message' !== $activated[ $slug ] ) {
					$value = $activated[ $slug ];
					$activated[ $slug ] = 'active';
				} elseif ( isset( $activated_mu[ $slug ] ) && $activated_mu[ $slug ] && 'no-message' !== $activated_mu[ $slug ] ) {
					$value = $activated_mu[ $slug ];
					$activated_mu[ $slug ] = 'active';
					$class .= ' mu';
				} else {
					continue;
				}
				?>
				<div id="<?php echo $slug; ?>-notice" class="<?php echo $class; ?>">
					<?php call_user_func( array( $plugin_class, $funcname ), $value ); ?>
				</div>
				<?php
			}

			call_user_func( 'update_' . $opt_mode, 'lalwpplugin_activated_plugins', $activated );
			call_user_func( 'update_' . $opt_mode, 'lalwpplugin_activated_muplugins', $activated_mu );
		}

		/**
		 * Runs plugins that are waiting in the queue.
		 *
		 * This method is run on the `plugins_loaded` hook.
		 *
		 * @since 1.6.1
		 */
		public static function _run_plugins() {
			if ( ! is_array( self::$plugins_queue ) ) {
				return;
			}

			// run all plugins in the queue
			foreach ( self::$plugins_queue as $slug ) {
				if ( ! isset( self::$plugins[ $slug ] ) ) {
					continue;
				}
				self::$plugins[ $slug ]->_maybe_run();
			}

			self::$plugins_queue = false;
		}

		/**
		 * Runs must-use plugins that are waiting in the queue.
		 *
		 * The method will also check for any must-use plugins that have been removed and
		 * remove their 'activated' flag.
		 *
		 * This method is run on the `muplugins_loaded` hook.
		 *
		 * @since 1.6.1
		 */
		public static function _run_muplugins() {
			if ( ! is_array( self::$muplugins_queue ) ) {
				return;
			}

			// remove the activated flag for mu-plugins that have been removed
			if ( is_multisite() ) {
				$opt_mode = 'site_option';
			} else {
				$opt_mode = 'option';
			}
			$activated = call_user_func( 'get_' . $opt_mode, 'lalwpplugin_activated_muplugins', array() );
			$fixed_activated = array_intersect_key( $activated, array_flip( self::$muplugins_queue ) );
			if ( count( $activated ) !== count( $fixed_activated ) ) {
				if ( 0 === count( $fixed_activated ) ) {
					call_user_func( 'delete_' . $opt_mode, 'lalwpplugin_activated_muplugins' );
				} else {
					call_user_func( 'update_' . $opt_mode, 'lalwpplugin_activated_muplugins', $fixed_activated );
				}
			}

			// run all muplugins in the queue
			foreach ( self::$muplugins_queue as $slug ) {
				if ( ! isset( self::$plugins[ $slug ] ) ) {
					continue;
				}
				self::$plugins[ $slug ]->_maybe_run();
			}

			self::$muplugins_queue = false;
		}

		/**
		 * AJAX handler to permanently hide a plugin status message once its notice is dismissed.
		 *
		 * @since 2.0.0
		 */
		public static function _ajax_dismiss_notice() {
			if ( ! isset( $_REQUEST['plugin'] ) ) {
				wp_send_json_error( sprintf( __( 'Missing request field %s.', 'lalwpplugin' ), '<code>plugin</code>' ) );
			}

			$plugin_slug = sanitize_text_field( $_REQUEST['plugin'] );

			if ( isset( $_REQUEST['context'] ) && 'network' === $_REQUEST['context'] ) {
				$context = 'network';
				$opt_mode = 'site_option';
				$capability = 'manage_network_options';
			} else {
				$context = 'site';
				$opt_mode = 'option';
				$capability = 'manage_options';
			}

			if ( isset( $_REQUEST['type'] ) && 'muplugin' === $_REQUEST['type'] ) {
				$option_name = 'lalwpplugin_activated_muplugins';
			} else {
				$option_name = 'lalwpplugin_activated_plugins';
			}

			if ( ! current_user_can( $capability ) ) {
				wp_send_json_error( __( 'Missing capabilities.', 'lalwpplugin' ) );
			}

			$activated = call_user_func( 'get_' . $opt_mode, $option_name, array() );
			if ( ! isset( $activated[ $plugin_slug ] ) || 'no-message' === $activated[ $plugin_slug ] ) {
				wp_send_json_error( sprintf( __( 'Notice for plugin %s has already been dismissed.', 'lalwpplugin' ), $plugin_slug ) );
			}

			$activated[ $plugin_slug ] = 'no-message';

			call_user_func( 'update_' . $opt_mode, $option_name, $activated );

			wp_send_json_success( sprintf( __( 'Notice for plugin %s dismissed.', 'lalwpplugin' ), $plugin_slug ) );
		}

		/**
		 * Filters the plugin action links to include a warning for missing dependencies.
		 *
		 * @since 2.0.0
		 * @param array $links the unfiltered network plugin action links
		 * @return array the filtered network plugin action links
		 */
		public static function _filter_invalid_plugin_action_links( $links ) {
			array_unshift( $links, '<span class="delete"><a href="#" class="delete"><strong>' . __( 'Error: Missing dependencies!', 'lalwpplugin' ) . '</a></strong></span>' );

			return $links;
		}

		/**
		 * Calls the installation and activation methods of a single plugin for a specific context.
		 *
		 * @since 2.0.0
		 * @param string $plugin_class the class name of the plugin's main class
		 * @param string $context either 'site' or 'network'
		 * @param boolean $install whether to also install the plugin (in addition to activating it)
		 * @return boolean status of the operation
		 */
		private static function _activate_plugin( $plugin_class, $context, $install = false ) {
			$status = true;

			$prefix = '';
			if ( 'network' === $context ) {
				$prefix = 'network_';
			}

			if ( $install && is_callable( array( $plugin_class, $prefix . 'install' ) ) ) {
				$status = call_user_func( array( $plugin_class, $prefix . 'install' ) );
			}

			if ( is_callable( array( $plugin_class, $prefix . 'activate' ) ) ) {
				call_user_func( array( $plugin_class, $prefix . 'activate' ) );
			}

			return $status;
		}

		/**
		 * Calls the deactivation method of a single plugin for a specific context.
		 *
		 * @since 2.0.0
		 * @param string $plugin_class the class name of the plugin's main class
		 * @param string $context either 'site' or 'network'
		 * @return boolean status of the operation
		 */
		private static function _deactivate_plugin( $plugin_class, $context ) {
			$status = true;

			$prefix = '';
			if ( 'network' === $context ) {
				$prefix = 'network_';
			}

			if ( is_callable( array( $plugin_class, $prefix . 'deactivate' ) ) ) {
				call_user_func( array( $plugin_class, $prefix . 'deactivate' ) );
			}

			return $status;
		}

		/**
		 * Calls the uninstall method of a single plugin for a specific context.
		 *
		 * @since 2.0.0
		 * @param string $plugin_class the class name of the plugin's main class
		 * @param string $context either 'site' or 'network'
		 * @return boolean status of the operation
		 */
		private static function _uninstall_plugin( $plugin_class, $context ) {
			$status = true;

			$prefix = '';
			if ( 'network' === $context ) {
				$prefix = 'network_';
			}

			if ( is_callable( array( $plugin_class, $prefix . 'uninstall' ) ) ) {
				call_user_func( array( $plugin_class, $prefix . 'uninstall' ) );
			}

			return $status;
		}

		/**
		 * Checks whether a specific PHP version dependency is met.
		 *
		 * Only the exact return value of a boolean `true` signalizes a successful check.
		 *
		 * @since 1.5.0
		 * @param string $version required version number
		 * @return boolean|string true if the dependency is met, otherwise the current version
		 */
		private static function _check_php( $version ) {
			if ( ! empty( $version ) ) {
				if ( version_compare( phpversion(), $version ) < 0 ) {
					return phpversion();
				}
			}

			return true;
		}

		/**
		 * Checks whether a specific WordPress version dependency is met.
		 *
		 * Only the exact return value of a boolean `true` signalizes a successful check.
		 *
		 * @since 1.5.0
		 * @param string $version required version number
		 * @return boolean|string true if the dependency is met, otherwise the current version
		 */
		private static function _check_wordpress( $version ) {
			global $wp_version;

			if ( ! empty( $version ) ) {
				if ( version_compare( $wp_version, $version ) < 0 ) {
					return $wp_version;
				}
			}

			return true;
		}

		/**
		 * Checks whether a specific plugin (version) dependency is met.
		 *
		 * If no version is provided, the method will simply check if the plugin is active in any version.
		 * The third parameter is used to ensure that a dependency is active network-wide, for example
		 * if the dependant plugin is activated network-wide.
		 *
		 * Only the exact return value of a boolean `true` signalizes a successful check.
		 *
		 * @since 1.5.0
		 * @param string $plugin either a plugin slug, plugin basename or plugin path
		 * @param string $version required version number (or empty if no specific version needed)
		 * @param boolean $must_network_wide whether the dependency must be active network-wide
		 * @return boolean|string true if the dependency is met, otherwise the current version or 'SITEONLY' or the current version prefixed with 'MU' for a must-use plugin
		 */
		private static function _check_plugin( $plugin, $version = '', $must_network_wide = false ) {
			$plugin_slug = LaL_WP_Plugin_Util::make_plugin_slug( $plugin );

			if ( isset( self::$plugins[ $plugin_slug ] ) ) {
				if ( $must_network_wide && ! self::_is_network_wide_plugin( $plugin_slug ) ) {
					return 'SITEONLY';
				}

				$plugin_class = get_class( self::$plugins[ $plugin_slug ] );
				$plugin_mode = call_user_func( array( $plugin_class, 'get_info' ), 'mode' );

				if ( 'muplugin' === $plugin_mode || 'plugin' === $plugin_mode ) {
					if ( ! empty( $version ) ) {
						$plugin_version = call_user_func( array( $plugin_class, 'get_info' ), 'version' );
						if ( version_compare( $plugin_version, $version ) < 0 ) {
							if ( 'muplugin' === $plugin_mode ) {
								return 'MU' . $plugin_version;
							}
							return $plugin_version;
						}
					}

					return true;
				}
			}

			if ( ! function_exists( 'get_plugin_data' ) ) {
				require_once ABSPATH . 'wp-admin/includes/plugin.php';
			}

			$muplugin_basename = LaL_WP_Plugin_Util::make_muplugin_basename( $plugin );
			if ( file_exists( WPMU_PLUGIN_DIR . '/' . $muplugin_basename ) ) {
				if ( ! empty( $version ) ) {
					$plugin_data = get_plugin_data( WPMU_PLUGIN_DIR . '/' . $muplugin_basename );
					if ( $plugin_data && isset( $plugin_data['Version'] ) ) {
						if ( version_compare( $plugin_data['Version'], $version ) < 0 ) {
							return 'MU' . $plugin_data['Version'];
						}
					}
				}

				return true;
			}

			$plugin_basename = LaL_WP_Plugin_Util::make_plugin_basename( $plugin );

			if ( is_plugin_active( $plugin_basename ) ) {
				if ( $must_network_wide && ! is_plugin_active_for_network( $plugin_basename ) ) {
					return 'SITEONLY';
				}

				if ( ! empty( $version ) ) {
					$plugin_data = get_plugin_data( WP_PLUGIN_DIR . '/' . $plugin_basename );
					if ( $plugin_data && isset( $plugin_data['Version'] ) ) {
						if ( version_compare( $plugin_data['Version'], $version ) < 0 ) {
							return $plugin_data['Version'];
						}
					}
				}

				return true;
			}

			return false;
		}

		/**
		 * Checks whether a plugin loaded with the plugin loader is active (or installed) network-wide.
		 *
		 * @since 2.0.0
		 * @param string $plugin_slug the plugin slug
		 * @param boolean $check_install whether to check the installation status instead of activation status
		 * @return boolean true if the plugin is active network-wide, otherwise false
		 */
		private static function _is_network_wide_plugin( $plugin_slug, $check_install = false ) {
			if ( is_multisite() ) {
				$option_name = 'lalwpplugin_activated_plugins';
				if ( $check_install ) {
					$option_name = 'lalwpplugin_installed_plugins';
				}

				$statuses = get_site_option( $option_name, array() );
				return isset( $statuses[ $plugin_slug ] );
			}

			return false;
		}

		/**
		 * Callback for `array_filter()` to filter out plugins that should not show a status message.
		 *
		 * @since 2.0.0
		 * @param string $status the activation status of any plugin
		 * @return boolean whether to keep this status in the array
		 */
		private static function _filter_for_status_message( $status ) {
			if ( 'no-message' === $status ) {
				return false;
			}

			return ! empty( $status );
		}

		/**
		 * Returns an array of site IDs.
		 *
		 * The function `wp_get_sites()` has been deprecated in WordPress 4.6 in favor of the new `get_sites()`.
		 *
		 * @since 2.0.2
		 * @param boolean $all_networks Whether to return not only sites in the current network, but from all networks.
		 * @return array Array of site IDs.
		 */
		private static function _get_site_ids( $all_networks = false ) {
			if ( ! function_exists( 'get_sites' ) || ! function_exists( 'get_current_network_id' ) ) {
				$args = array();
				if ( $all_networks ) {
					$args['network_id'] = 0;
				}

				$sites = wp_get_sites( $args );

				return wp_list_pluck( $sites, 'blog_id' );
			}

			$args = array( 'fields' => 'ids' );
			if ( ! $all_networks ) {
				$args['network_id'] = get_current_network_id();
			}

			return get_sites( $args );
		}

		/**
		 * Loads the plugin loader's textdomain.
		 *
		 * Since the plugin loader also outputs some notices, it needs to load its own translation files.
		 * This method does not load an actual plugin's textdomain.
		 *
		 * @since 1.5.0
		 * @return boolean status of the operation
		 */
		private static function _load_textdomain() {
			$domain = 'lalwpplugin';
			$locale = get_locale();
			$path = dirname( __FILE__ ) . '/languages/';
			$mofile = $domain . '-' . $locale . '.mo';

			if ( $loaded = load_textdomain( $domain, $path . $mofile ) ) {
				return $loaded;
			}

			return load_textdomain( $domain, WP_LANG_DIR . '/plugins/' . $mofile );
		}

		/**
		 * Initializes the plugin loader.
		 *
		 * The plugin loader will automatically initialize itself when the `load_plugin()` method
		 * is called for the first time.
		 *
		 * @since 1.5.0
		 */
		private static function _init() {
			if ( ! class_exists( 'LaL_WP_Plugin_Util' ) ) {
				require_once dirname( __FILE__ ) . '/leavesandlove-wp-plugin-util.php';
			}

			self::_load_textdomain();

			add_action( 'plugins_loaded', array( __CLASS__, '_run_plugins' ) );
			add_action( 'muplugins_loaded', array( __CLASS__, '_run_muplugins' ) );

			add_action( 'admin_notices', array( __CLASS__, '_display_error_messages' ) );
			add_action( 'network_admin_notices', array( __CLASS__, '_display_error_messages' ) );

			add_action( 'admin_notices', array( __CLASS__, '_display_status_messages' ) );
			add_action( 'network_admin_notices', array( __CLASS__, '_display_status_messages' ) );

			add_action( 'wp_ajax_lalwpplugin_dismiss_notice', array( __CLASS__, '_ajax_dismiss_notice' ) );

			self::$initialized = true;
		}

	}

}
