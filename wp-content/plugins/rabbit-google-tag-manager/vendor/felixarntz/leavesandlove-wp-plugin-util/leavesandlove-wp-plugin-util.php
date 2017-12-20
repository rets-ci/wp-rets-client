<?php
/**
 * @package leavesandlove-wp-plugin-util
 * @author Felix Arntz <felix-arntz@leaves-and-love.net>
 */

if ( ! defined( 'ABSPATH' ) ) {
	die();
}

if ( ! class_exists( 'LaL_WP_Plugin_Util' ) ) {

	/**
	 * This class contains some static utility functions.
	 *
	 * They should only be used by the plugin loader itself and are not suited for public usage.
	 *
	 * @since 1.0.0
	 */
	final class LaL_WP_Plugin_Util {

		/**
		 * This function merges two parts of a path together into one.
		 *
		 * If the additional path is empty, the returned path will not have a trailing slash.
		 * Otherwise it depends on the additional path.
		 *
		 * @since 1.5.0
		 * @param string $base_path the base path
		 * @param string $path additional path to append to base path
		 * @return string the combined path
		 */
		public static function build_path( $base_path, $path = '' ) {
			$base_path = untrailingslashit( $base_path );
			if ( ! empty ( $path ) ) {
				return $base_path . '/' . ltrim( $path, '/\\' );
			}
			return $base_path;
		}

		/**
		 * Transforms a string into a plugin slug.
		 *
		 * This method is based on the assumption that a plugin's main file has the same name as its directory.
		 *
		 * @since 2.0.0
		 * @param string $plugin either a plugin slug, plugin basename or plugin path
		 * @return string the plugin slug
		 */
		public static function make_plugin_slug( $plugin ) {
			if ( strpos( $plugin, '.php' ) === strlen( $plugin ) - 4 ) {
				$plugin = substr( $plugin, 0, strlen( $plugin ) - 4 );
			}
			if ( strpos( $plugin, '/' ) !== false ) {
				$plugin = explode( '/', $plugin );
				$plugin = $plugin[ count( $plugin ) - 2 ];
			}

			return $plugin;
		}

		/**
		 * Transforms a string into a plugin basename.
		 *
		 * This method is based on the assumption that a plugin's main file has the same name as its directory.
		 *
		 * @since 1.5.0
		 * @param string $plugin either a plugin slug, plugin basename or plugin path
		 * @return string the plugin basename
		 */
		public static function make_plugin_basename( $plugin ) {
			if ( strpos( $plugin, '.php' ) === strlen( $plugin ) - 4 ) {
				$plugin = substr( $plugin, 0, strlen( $plugin ) - 4 );
			}
			if ( strpos( $plugin, '/' ) === false ) {
				$plugin .= '/' . $plugin;
			}
			$plugin .= '.php';

			return $plugin;
		}

		/**
		 * Transforms a string into a must-use plugin basename.
		 *
		 * This method is based on the assumption that a plugin's main file has the same name as its directory.
		 *
		 * @since 2.0.0
		 * @param string $plugin either a plugin slug, plugin basename or plugin path
		 * @return string the must-use plugin basename
		 */
		public static function make_muplugin_basename( $plugin ) {
			if ( strpos( $plugin, '.php' ) === strlen( $plugin ) - 4 ) {
				$plugin = substr( $plugin, 0, strlen( $plugin ) - 4 );
			}
			if ( strpos( $plugin, '/' ) !== false ) {
				$plugin = explode( '/', $plugin );
				$plugin = $plugin[ count( $plugin ) - 1 ];
			}
			$plugin .= '.php';

			return $plugin;
		}

		/**
		 * Extends a dependency's fields to include action links to install, activate or update (if available).
		 *
		 * @since 2.0.0
		 * @param array $dependency a dependency array created by `LaL_WP_Plugin_Loader`
		 * @param string $context either 'site' or 'network'
		 * @return array the extended dependency
		 */
		public static function extend_dependency( $dependency, $context = 'site' ) {
			if ( ! isset( $dependency['name'] ) || empty( $dependency['name'] ) ) {
				$dependency['name'] = $dependency['slug'];
			}
			if ( ! isset( $dependency['action_link'] ) ) {
				$dependency['action_link'] = '';
			}
			if ( ! isset( $dependency['action_name'] ) ) {
				$dependency['action_name'] = '';
			}

			if ( 'network' === $context ) {
				$activate_capability = 'manage_network_plugins';
				$install_capability = 'install_plugins';
				$update_capability = 'update_plugins';
			} else {
				$activate_capability = 'activate_plugins';
				$install_capability = 'install_plugins';
				$update_capability = 'update_plugins';
			}

			switch ( $dependency['type'] ) {
				case 'plugin':
					if ( ! function_exists( 'plugins_api' ) ) {
						require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
					}
					$plugin_file = self::make_plugin_basename( $dependency['slug'] );
					$api_data = plugins_api( 'plugin_information', array(
						'slug'		=> self::make_plugin_slug( $dependency['slug'] ),
						'fields'	=> array(
							'sections'		=> false,
							'tags'			=> false,
							'banners'		=> false,
							'reviews'		=> false,
							'ratings'		=> false,
							'compatibility'	=> false,
						),
					) );
					if ( ! is_wp_error( $api_data ) && isset( $api_data->name ) ) {
						$dependency['name'] = $api_data->name;
					}
					if ( ! $dependency['installed'] ) {
						if ( file_exists( WP_PLUGIN_DIR . '/' . $plugin_file ) ) {
							// if not activated, create activation link
							if ( current_user_can( $activate_capability ) ) {
								if ( 'network' === $context ) {
									$dependency['action_name'] = __( 'Network Activate', 'lalwpplugin' );
								} else {
									$dependency['action_name'] = __( 'Activate', 'lalwpplugin' );
								}
								$dependency['action_link'] = wp_nonce_url( self_admin_url( 'plugins.php?action=activate&plugin=' . $plugin_file . '&plugin_status=all&paged=1' ), 'activate-plugin_' . $plugin_file );
							}
						} else {
							// if not installed, create installation link
							if ( current_user_can( $install_capability ) ) {
								if ( ! is_wp_error( $api_data ) && isset( $api_data->slug ) ) {
									$dependency['action_name'] = __( 'Install', 'lalwpplugin' );
									$dependency['action_link'] = wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=' . $api_data->slug ), 'install-plugin_' . $api_data->slug );
								}
							}
						}
					} elseif ( 'SITEONLY' === $dependency['installed'] ) {
						if ( file_exists( WP_PLUGIN_DIR . '/' . $plugin_file ) && 'network' === $context ) {
							// if not network-active, create activation link
							if ( current_user_can( $activate_capability ) ) {
								$dependency['action_name'] = __( 'Network Activate', 'lalwpplugin' );
								$dependency['action_link'] = wp_nonce_url( self_admin_url( 'plugins.php?action=activate&plugin=' . $plugin_file . '&plugin_status=all&paged=1' ), 'activate-plugin_' . $plugin_file );
							}
						}
					} elseif ( 0 !== strpos( $dependency['installed'], 'MU' ) ) {
						if ( file_exists( WP_PLUGIN_DIR . '/' . $plugin_file ) ) {
							// if outdated, create update link
							if ( current_user_can( $update_capability ) ) {
								if ( ! is_wp_error( $api_data ) && isset( $api_data->version ) && version_compare( $dependency['requirement'], $api_data->version ) <= 0 ) {
									$dependency['action_name'] = __( 'Update', 'lalwpplugin' );
									$dependency['action_link'] = wp_nonce_url( self_admin_url( 'update.php?action=upgrade-plugin&plugin=' . $plugin_file ), 'upgrade-plugin_' . $plugin_file );
								}
							}
						}
					}
					break;
				default:
					break;
			}

			return $dependency;
		}

		/**
		 * Restores the original site after switching between multiple sites in a network.
		 *
		 * @since 2.0.0
		 * @return boolean whether the operation was successful
		 */
		public static function restore_original_blog() {
			if ( ! is_multisite() ) {
				return false;
			}

			if ( empty( $GLOBALS['_wp_switched_stack'] ) ) {
				return false;
			}

			$GLOBALS['_wp_switched_stack'] = array( $GLOBALS['_wp_switched_stack'][0] );

			return restore_current_blog();
		}

	}

}
