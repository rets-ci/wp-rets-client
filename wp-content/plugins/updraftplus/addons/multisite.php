<?php
/*
UpdraftPlus Addon: multisite:Multisite/Network
Description: Makes UpdraftPlus compatible with a WordPress Network (a.k.a. multi-site) and adds Network-related features
Version: 2.2
Shop: /shop/network-multisite/
Latest Change: 1.11.7
*/

if (!defined('UPDRAFTPLUS_DIR')) die('No direct access allowed');

// Options handling
if (!defined ('ABSPATH')) die ('No direct access allowed');

if (class_exists('UpdraftPlus_Options')) return;

if (is_multisite()) {

	class UpdraftPlus_Options {

		public static function user_can_manage() {
			$user_can_manage = is_super_admin();
			// true: multisite add-on
			return apply_filters('updraft_user_can_manage', $user_can_manage, true);
		}

		public static function options_table() {
			return 'sitemeta';
		}

		public static function get_updraft_option($option, $default = false) {
			$tmp = get_site_option('updraftplus_options');
			if (isset($tmp[$option])) {
				return $tmp[$option];
			} else {
				return $default;
			}
		}

		public static function update_updraft_option($option, $value, $use_cache = true) {
			$tmp = get_site_option('updraftplus_options', array(), $use_cache);
			if (!is_array($tmp)) $tmp = array();
			$tmp[$option] = $value;
			update_site_option('updraftplus_options', $tmp);
		}

		public static function delete_updraft_option($option) {
			$tmp = get_site_option('updraftplus_options');
			if (is_array($tmp)) {
				if (isset($tmp[$option])) unset($tmp[$option]);
			} else {
				$tmp = array();
			}
			update_site_option('updraftplus_options', $tmp);
		}

		public static function admin_page_url() {
			return network_admin_url('settings.php');
		}

		public static function admin_page() {
			return 'settings.php';
		}

		public static function add_admin_pages() {
			if (is_super_admin()) add_submenu_page('settings.php', 'UpdraftPlus', __('UpdraftPlus Backups','updraftplus'), 'manage_options', 'updraftplus', array('UpdraftPlus_Options', 'options_printpage'));
		}

		public static function setdefaults() {
			$tmp = get_site_option('updraftplus_options');
			if (!is_array($tmp)) {
				$arr = array(
					'updraft_encryptionphrase' => '',
					'updraft_service' => '',

					'updraftplus_dismissedautobackup' => 0,
					'updraftplus_dismisseddashnotice' => 0,
					'updraftplus_dismissedexpiry' => 0,

					'updraft_s3' => array(),
					'updraft_ftp' => array(),
					'updraft_s3generic' => array(),
					'updraft_dreamobjects' => array(),
					'updraft_cloudfiles' => array(),
					'updraft_bitcasa' => array(),
					'updraft_copycom' => array(),
					'updraft_openstack' => array(),
					'updraft_googledrive' => array(),
					'updraft_dropbox' => array(),
					'updraft_onedrive' => array(),
					'updraft_sftp_settings' => array(),
					'updraft_webdav_settings' => array(),

					'updraft_log_syslog' => 0,
					'updraft_ssl_nossl' => 0,
					'updraft_ssl_useservercerts' => 0,
					'updraft_ssl_disableverify' => 0,
					'updraft_split_every' => 500,

					'updraft_dir' => '',
					'updraft_email' => '',
					'updraft_report_warningsonly' => array(),
					'updraft_report_wholebackup' => array(),

					'updraft_databases' => array(),
					'updraft_backupdb_nonwp' => 0,

					'updraft_remotesites' => array(),
					'updraft_migrator_localkeys' => array(),

					'updraft_autobackup_default' => 1,
					'updraft_delete_local' => 1,
					'updraft_debug_mode' => 1,
					'updraft_include_plugins' => 1,
					'updraft_include_themes' => 1,
					'updraft_include_uploads' => 1,
					'updraft_include_others' => 1,
					'updraft_include_wpcore' => 0,
					'updraft_include_wpcore_exclude' => '',
					'updraft_include_more' => 0,
					'updraft_include_more_path' => '',
					'updraft_include_muplugins' => 1,
					'updraft_include_blogs' => 1,
					'updraft_include_others_exclude' => UPDRAFT_DEFAULT_OTHERS_EXCLUDE,
					'updraft_include_uploads_exclude' => UPDRAFT_DEFAULT_UPLOADS_EXCLUDE,
					'updraft_interval' => 'manual',
					'updraft_interval_increments' => 'none',
					'updraft_interval_database' => 'manual',
					'updraft_retain' => 1,
					'updraft_retain_db' => 1,
					'updraft_retain_extra' => array(),
					'updraft_starttime_files' => date('H:i', time()+600),
					'updraft_starttime_db' => date('H:i', time()+600),
					'updraft_startday_files' => date('w', time()+600),
					'updraft_startday_db' => date('w', time()+600)
				);
				update_site_option('updraftplus_options', $arr);
			}
		}

		public static function options_form_begin($settings_fields = 'updraft-options-group', $allow_autocomplete = true, $get_params = array()) {

			$page = '';
			if (!empty($get_params)) {
				$page .= '?';
				$first_one = true;
				foreach ($get_params as $k => $v) {
					if ($first_one) {
						$first_one = false;
					} else {
						$page .= '&';
					}
					$page .= urlencode($k).'='.urlencode($v);
				}
			}

			if (!$page) $page = '?page=updraftplus';

			echo '<form method="post" action="'.$page.'"';
			if (!$allow_autocomplete) echo ' autocomplete="off"';
			echo '>';
		}

		public static function admin_init() {
			global $updraftplus, $updraftplus_admin;
			$updraftplus->plugin_title .= " - ".__('Multisite Install','updraftplus');
		}

		# This is the function outputing the HTML for our options page
		public static function options_printpage() {
			if (!self::user_can_manage())  {
				wp_die( __('You do not have sufficient permissions to access this page.') );
			}

			if (isset($_POST['action']) && $_POST['action'] == 'update' && isset($_POST['updraft_interval'])) {
				$result = self::update_wpmu_options();
				if (count($result) > 0) {
					echo "<div class='error'>\n";
					echo implode("<br />\n", $result);
					echo "</div>\n";
				}
			}

			global $updraftplus_admin;
			$updraftplus_admin->settings_output();

		}

		public static function update_wpmu_options() {

			if ( !self::user_can_manage() ) wp_die( __( 'You do not have permission to access this page.' ) );

			global $updraftplus, $updraftplus_admin;

			$options=get_site_option('updraftplus_options');

			$errors = array();

			foreach ($_POST as $key => $value) {
				if ('updraft_include_others_exclude' == $key || 'updraft_include_uploads_exclude' == $key || 'updraft_include_wpcore_exclude' == $key) {
					$options[$key] = $updraftplus->strip_dirslash($value);
				} elseif ('updraft_include_more_path' == $key) {
					$options[$key] = $updraftplus->remove_empties($value);
				} elseif ('updraft_delete_local' == $key || 'updraft_debug_mode' == $key || (preg_match('/^updraft_include_/', $key))) {
					# Booleans/numeric
					$options[$key] = absint($value);
				} elseif ('updraft_googledrive' == $key && is_array($value)) {
					$options[$key] = $updraftplus->googledrive_checkchange($value);
				} elseif ('updraft_dropbox' == $key && is_array($value)) {
					$options[$key] = $updraftplus->dropbox_checkchange($value);
				} elseif ('updraft_ftp' == $key && is_array($value)) {
					$options[$key] = $updraftplus->ftp_sanitise($value);
				} elseif ('updraft_s3' == $key && is_array($value)) {
					$options[$key] = $updraftplus->s3_sanitise($value);
				} elseif ('updraft_bitcasa' == $key && is_array($value)) {
					$options[$key] = $updraftplus->bitcasa_checkchange($value);
				} elseif ('updraft_copycom' == $key && is_array($value)) {
					$options[$key] = $updraftplus->copycom_checkchange($value);
				} elseif ('updraft_split_every' == $key) {
					$options[$key] = $updraftplus_admin->optionfilter_split_every($value);
				} elseif ('updraft_retain' == $key || 'updraft_retain_db' == $key) {
					$options[$key] = $updraftplus->retain_range($value);
				} elseif ('updraft_interval' == $key) {
					$options[$key] = $updraftplus->schedule_backup($value);
				} elseif ('updraft_interval_database' == $key) {
					$options[$key] = $updraftplus->schedule_backup_database($value);
				} elseif ('updraft_service' == $key) {
					$options[$key] = $updraftplus->just_one($value);
				} elseif ('updraft_webdav_settings' == $key) {
					$options[$key] = $updraftplus->replace_http_with_webdav($value);
				} elseif ('updraft_email' == $key) {
					$options[$key] = $updraftplus->just_one_email($value);
				} elseif ('updraft_starttime_files' == $key || 'updraft_starttime_db' == $key) {
					if (preg_match("/^([0-2]?[0-9]):([0-5][0-9])$/", $value, $matches)) {
						$options[$key] = sprintf("%02d:%s", $matches[1], $matches[2]);
					} elseif ($value == '') {
						$options[$key] = date('H:i', time()+300);
					} else {
						$options[$key] = '00:00';
					}
				} elseif ('updraft_startday_files' == $key || 'updraft_startday_db' == $key) {
					$value=absint($value);
					if ($value>28) $value=1;
					$options[$key] = $value;
				} elseif ('updraft_dir' == $key) {
					$options[$key] = $updraftplus_admin->prune_updraft_dir_prefix($value);
				} elseif (preg_match("/^updraft_/", $key)) {
					$options[$key] = $value;
				}
			}

			foreach (array('updraft_delete_local', 'updraft_debug_mode', 'updraft_include_plugins', 'updraft_include_themes', 'updraft_include_uploads', 'updraft_include_others', 'updraft_include_blogs', 'updraft_include_wpcore', 'updraft_include_more', 'updraft_include_mu-plugins', 'updraft_ssl_useservercerts', 'updraft_ssl_disableverify', 'updraft_ssl_nossl', 'updraft_log_syslog', 'updraft_autobackup_default') as $key) {
				if (empty($_POST[$key])) $options[$key] = false;
			}

			if (empty($_POST['updraft_service'])) $options['updraft_service'] = 'none';
			if (empty($_POST['updraft_email'])) $options['updraft_email'] = '';

			if (empty($_POST['updraft_report_warningsonly'])) $_POST['updraft_report_warningsonly'] = array();
			if (empty($_POST['updraft_report_wholebackup'])) $_POST['updraft_report_wholebackup'] = array();

			$options['updraft_report_warningsonly'] = $updraftplus_admin->return_array($_POST['updraft_report_warningsonly']);
			$options['updraft_report_wholebackup'] = $updraftplus_admin->return_array($_POST['updraft_report_wholebackup']);

			update_site_option('updraftplus_options', $options);

			return $errors;
		}


	}

	register_activation_hook('updraftplus', array('UpdraftPlus_Options', 'setdefaults'));

	add_action('network_admin_menu', array('UpdraftPlus_Options', 'add_admin_pages'));
	add_action('admin_init', array('UpdraftPlus_Options', 'admin_init'), 15);

	class UpdraftPlusAddOn_MultiSite {
		public static function add_backupable_file_entities($arr, $full_info) {
			// Post-3.5, WordPress multisite puts uploads from blogs by default into the uploads directory (i.e. no separate location). This is indicated not by the WP version number, but by the option ms_files_rewriting (which won't exist pre-3.5). See wp_upload_dir()
			// This is a compatible way of getting the current blog's upload directory. Because of our access setup, that always resolves to the site owner's upload directory
			if ($full_info) {
				$arr['mu-plugins'] = array(
					'path' => WPMU_PLUGIN_DIR,
					'description' => __('Must-use plugins','updraftplus')
				);
				if (!get_option('ms_files_rewriting') && defined('UPLOADBLOGSDIR')) {
					$ud = wp_upload_dir();
					if (strpos(UPLOADBLOGSDIR, $ud['basedir'] === false)) {
						$arr['blogs'] = array(
							'path' => ABSPATH.UPLOADBLOGSDIR,
							'description' => __('Blog uploads','updraftplus')
						);
					}
				}
			} else {
				$arr['mu-plugins'] = WPMU_PLUGIN_DIR;
				if (!get_option('ms_files_rewriting') && defined('UPLOADBLOGSDIR')) {
					$ud = wp_upload_dir();
					if (strpos(UPLOADBLOGSDIR, $ud['basedir'] === false)) {
						$arr['blogs'] = ABSPATH.UPLOADBLOGSDIR;
					}
				}
			}
			return $arr;
		}

		public static function updraft_admin_menu_hook($h) { return 'network_admin_menu'; }

		public static function add_networkadmin_page() {
			global $wp_admin_bar;
			
			if (!is_object($wp_admin_bar) || !is_super_admin() || !function_exists('is_admin_bar_showing') || !is_admin_bar_showing()) {
				return;
			}
			
			$wp_admin_bar->add_node(array(
				'parent' => 'network-admin',
				'id' => 'updraftplus-admin-settings',
				'title' => __('UpdraftPlus Backups', 'updraftplus'),
				'href' => UpdraftPlus_Options::admin_page_url().'?page=updraftplus'
			));
		}

	}

	add_filter('updraft_backupable_file_entities', array('UpdraftPlusAddOn_MultiSite', 'add_backupable_file_entities'), 10, 2);
	add_filter('updraft_admin_menu_hook', array('UpdraftPlusAddOn_MultiSite', 'updraft_admin_menu_hook'));

	add_action('wp_before_admin_bar_render', array('UpdraftPlusAddOn_MultiSite', 'add_networkadmin_page'));

}
