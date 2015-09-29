<?php
/*
UpdraftPlus Addon: autobackup:Automatic Backups
Description: Save time and worry by automatically create backups before updating WordPress components
Version: 2.0
Shop: /shop/autobackup/
Latest Change: 1.10.2
*/

if (!defined('UPDRAFTPLUS_DIR')) die('No direct access allowed');

if (defined('UPDRAFTPLUS_NOAUTOBACKUPS') && UPDRAFTPLUS_NOAUTOBACKUPS) return;

$updraftplus_addon_autobackup = new UpdraftPlus_Addon_Autobackup;

class UpdraftPlus_Addon_Autobackup {

	// Has to be synced with WP_Automatic_Updater::run()
	private $lock_name = 'auto_updater.lock';
	private $already_backed_up = array();
	private $inpage_restrict = '';

	public function __construct() {
		add_filter('updraftplus_autobackup_blurb', array($this, 'updraftplus_autobackup_blurb'));
		add_action('admin_action_update-selected',  array($this, 'admin_action_update_selected'));
		add_action('admin_action_update-selected-themes', array($this, 'admin_action_update_selected_themes'));
		add_action('admin_action_do-plugin-upgrade', array($this, 'admin_action_do_plugin_upgrade'));
		add_action('admin_action_do-theme-upgrade', array($this, 'admin_action_do_theme_upgrade'));
		add_action('admin_action_do-theme-upgrade', array($this, 'admin_action_do_theme_upgrade'));
		add_action('admin_action_upgrade-plugin', array($this, 'admin_action_upgrade_plugin'));
		add_action('admin_action_upgrade-theme', array($this, 'admin_action_upgrade_theme'));
		add_action('admin_action_do-core-upgrade', array($this, 'admin_action_do_core_upgrade'));
		add_action('admin_action_do-core-reinstall', array($this, 'admin_action_do_core_upgrade'));
		add_action('ud_wp_maybe_auto_update', array($this, 'ud_wp_maybe_auto_update'));
		add_action('updraftplus_configprint_expertoptions', array($this, 'configprint_expertoptions'));
		// Somewhat inelegant... see: https://core.trac.wordpress.org/ticket/30441
		add_filter('auto_update_plugin', array($this, 'auto_update_plugin'), PHP_INT_MAX, 2);
		add_filter('auto_update_theme', array($this, 'auto_update_theme'), PHP_INT_MAX, 2);
		add_filter('auto_update_core', array($this, 'auto_update_core'), PHP_INT_MAX, 2);
		add_action('pre_current_active_plugins', array($this, 'pre_current_active_plugins'));
		add_action('install_plugins_pre_plugin-information', array($this, 'install_plugins_pre_plugin'));
	}

	public function install_plugins_pre_plugin() {
		if (!current_user_can('update_plugins')) return;
		$this->inpage_restrict = 'plugins';
		add_action('admin_footer', array($this, 'admin_footer_inpage_backup'));
	}

	public function wpcore_description($desc) {
		return __('WordPress core (only)', 'updraftplus');
	}

	public function ud_wp_maybe_auto_update($lock_value) {
		$lock_result = get_option( $this->lock_name );
		if ($lock_result != $lock_value) return;

		// Remove the lock, to allow the WP updater to claim it and proceed
		delete_option( $lock_name );

		$this->do_not_filter_auto_backup = true;
		wp_maybe_auto_update();
	}

	public function configprint_expertoptions() {
		?>
		<tr class="expertmode" style="display:none;">
			<th><?php _e('UpdraftPlus Automatic Backups', 'updraftplus');?>:</th>
			<td><?php $this->auto_backup_form(false, 'updraft_autobackup_default', '1');?></td>
		</tr>
		<?php
	}

	public function initial_jobdata($jobdata) {
		if (!is_array($jobdata)) return $jobdata;
		$jobdata[] = 'reschedule_before_upload';
		$jobdata[] = true;
		return $jobdata;
	}

	public function initial_jobdata2($jobdata) {
		if (!is_array($jobdata)) return $jobdata;
		$jobdata[] = 'is_autobackup';
		$jobdata[] = true;
		$jobdata[] = 'label';
		$jobdata[] = __('Automatic backup before update', 'updraftplus');
		return $jobdata;
	}

	public function auto_update_plugin($update, $item) {
		return $this->auto_update($update, $item, 'plugins');
	}

	public function auto_update_theme($update, $item) {
		return $this->auto_update($update, $item, 'themes');
	}

	public function auto_update_core($update, $item) {
		return $this->auto_update($update, $item, 'core');
	}

	public function auto_update($update, $item, $type) {
		if (!$update || !empty($this->do_not_filter_auto_backup) || in_array($type, $this->already_backed_up) || !$this->doing_filter('wp_maybe_auto_update') || !UpdraftPlus_Options::get_updraft_option('updraft_autobackup_default')) return $update;

		if ('core' == $type) {
			// This has to be copied from WP_Automatic_Updater::should_update() because it's another reason why the eventual decision may be false.
			// If it's a core update, are we actually compatible with its requirements?
			global $wpdb;
			$php_compat = version_compare( phpversion(), $item->php_version, '>=' );
			if ( file_exists( WP_CONTENT_DIR . '/db.php' ) && empty( $wpdb->is_mysql ) )
				$mysql_compat = true;
			else
				$mysql_compat = version_compare( $wpdb->db_version(), $item->mysql_version, '>=' );
			if ( ! $php_compat || ! $mysql_compat )
				return false;
		}

		$time_began = time();

		// Go ahead - it's auto-backup-before-auto-update time.
		// Add job data to indicate that a resumption should be scheduled if the backup completes before the cloud-backup stage
		add_filter('updraftplus_initial_jobdata', array($this, 'initial_jobdata'));
		add_filter('updraftplus_initial_jobdata', array($this, 'initial_jobdata2'));

		// Reschedule the real background update for 10 minutes from now (i.e. lessen the risk of a timeout by chaining it).
		$this->reschedule(600);

		global $updraftplus;

		$backup_database = !in_array('db', $this->already_backed_up);

		if ('core' == $type) {
			$entities = $updraftplus->get_backupable_file_entities();
			if (isset($entities['wpcore'])) {
				$backup_files = true;
				$backup_files_array = array('wpcore');
			} else {
				$backup_files = false;
				$backup_files_array = false;
			}
		} else {
			$backup_files = true;
			$backup_files_array = array($type);
		}

		if ('core' == $type) {
			add_filter('updraftplus_dirlist_wpcore_override', array($this, 'updraftplus_dirlist_wpcore_override'), 10, 2);
			add_filter('updraft_wpcore_description', array($this, 'wpcore_description'));
		}

		$updraftplus->boot_backup($backup_files, $backup_database, $backup_files_array, true);

		$this->already_backed_up[] = $type;
		if ($backup_database) $this->already_backed_up[] = 'db';

		// The backup apparently completed. Reschedule for very soon, in case not enough PHP time remains to complete an update too.
		$this->reschedule(120);

		// But then, also go ahead anyway, in case there's enough time (we want to minimise the time between the backup and the update)
		return $update;
	}

	public function updraftplus_dirlist_wpcore_override($l, $whichdir) {
		// This does not need to include everything - only code
		$possible = array('wp-admin', 'wp-includes', 'index.php', 'xmlrpc.php', 'wp-config.php', 'wp-activate.php', 'wp-app.php', 'wp-atom.php', 'wp-blog-header.php', 'wp-comments-post.php', 'wp-commentsrss2.php', 'wp-cron.php', 'wp-feed.php', 'wp-links-opml.php', 'wp-load.php', 'wp-login.php', 'wp-mail.php', 'wp-pass.php', 'wp-rdf.php', 'wp-register.php', 'wp-rss2.php', 'wp-rss.php', 'wp-settings.php', 'wp-signup.php', 'wp-trackback.php');

		$wpcore_dirlist = array();
		$whichdir = trailingslashit($whichdir);

		foreach ($possible as $file) {
			if (file_exists($whichdir.$file)) $wpcore_dirlist[] = $whichdir.$file;
		}

		return (!empty($wpcore_dirlist)) ? $wpcore_dirlist : $l;
	}

	private function reschedule($how_long) {
		wp_clear_scheduled_hook('ud_wp_maybe_auto_update');
		if (!$how_long) return;
		global $updraftplus;
		$updraftplus->log("Rescheduling WP's automatic update check for $how_long seconds ahead");
		$lock_result = get_option( $this->lock_name );
		wp_schedule_single_event(time() + $how_long, 'ud_wp_maybe_auto_update', array($lock_result));
	}

	# This appears on the page listing several updates
	public function updraftplus_autobackup_blurb() {
		$ret = '<input '.((UpdraftPlus_Options::get_updraft_option('updraft_autobackup_default', true)) ? 'checked="checked"' : '').' type="checkbox" id="updraft_autobackup" value="doit" name="updraft_autobackup"> <label for="updraft_autobackup">'.__('Automatically backup (where relevant) plugins, themes and the WordPress database with UpdraftPlus before updating', 'updraftplus').'</label><br><input checked="checked" type="checkbox" value="set" name="updraft_autobackup_setdefault" id="updraft_autobackup_sdefault"> <label for="updraft_autobackup_sdefault">'.__('Remember this choice for next time (you will still have the chance to change it)', 'updraftplus').'</label><br><em><a href="http://updraftplus.com/automatic-backups/">'.__('Read more about how this works...','updraftplus').'</a></em>';
		// New-style widgets
		add_action('admin_footer', array($this, 'admin_footer_inpage_backup'));
		add_action('admin_footer', array($this, 'admin_footer_insertintoform'));
		return $ret;
	}

	public function admin_footer_insertintoform() {
		$def = UpdraftPlus_Options::get_updraft_option('updraft_autobackup_default', true);
		$godef = ($def) ? 'yes' : 'no';
		// Note - now, in the new-style widgetised setup (Feb 2015), we always set updraftplus_noautobackup=1 - because the actual backup will be done in-page. But that is not done here - it is done when the form is submitted, in updraft_try_inpage();
		echo <<<ENDHERE
		<script>
		jQuery(document).ready(function() {
			jQuery('form.upgrade').append('<input type="hidden" name="updraft_autobackup" class="updraft_autobackup_go" value="$godef">');
			jQuery('form.upgrade').append('<input type="hidden" name="updraft_autobackup_setdefault" class="updraft_autobackup_setdefault" value="yes">');
			jQuery('#updraft_autobackup').click(function() {
				var doauto = jQuery(this).attr('checked');
				if ('checked' == doauto) {
					jQuery('.updraft_autobackup_go').attr('value', 'yes');
				} else {
					jQuery('.updraft_autobackup_go').attr('value', 'no');
				}
			});
			jQuery('#updraft_autobackup_sdefault').click(function() {
				var sdef = jQuery(this).attr('checked');
				if ('checked' == sdef) {
					jQuery('.updraft_autobackup_setdefault').attr('value', 'yes');
				} else {
					jQuery('.updraft_autobackup_setdefault').attr('value', 'no');
				}
			});
		});
		</script>
ENDHERE;
	}

	public function admin_footer() {
		if (!current_user_can('update_'.$this->internaltype)) return;
		$creating = esc_js(sprintf(__('Creating %s and database backup with UpdraftPlus...', 'updraftplus'), $this->type).' '.__('(logs can be found in the UpdraftPlus settings page as normal)...', 'updraftplus'));
		$lastlog = esc_js(__('Last log message', 'updraftplus')).':';
		$updraft_credentialtest_nonce = wp_create_nonce('updraftplus-credentialtest-nonce');
		global $updraftplus;
		$updraftplus->log(__('Starting automatic backup...','updraftplus'));

		$unexpected_response = esc_js(__('Unexpected response:','updraftplus'));

		echo <<<ENDHERE
			<script>
				jQuery('h2:first').after('<p>$creating</p><p>$lastlog <span id="updraft_lastlogcontainer"></span></p><div id="updraft_activejobs"></div>');
				var lastlog_sdata = {
					action: 'updraft_ajax',
					subaction: 'activejobs_list',
					oneshot: 'yes'
				};
				setInterval(function(){updraft_autobackup_showlastlog(true);}, 3000);
				function updraft_autobackup_showlastlog(repeat){
					lastlog_sdata.nonce = '$updraft_credentialtest_nonce';
					jQuery.get(ajaxurl, lastlog_sdata, function(response) {
						try {
							resp = jQuery.parseJSON(response);
							if (resp.l != null) { jQuery('#updraft_lastlogcontainer').html(resp.l); }
							if (resp.j != null && resp.j != '') {
								jQuery('#updraft_activejobs').html(resp.j);
							} else {
								if (!jQuery('#updraft_activejobs').is(':hidden')) {
									jQuery('#updraft_activejobs').hide();
								}
							}
						} catch(err) {
							console.log('$unexpected_response '+response);
						}
					});
				}
			</script>
ENDHERE;
	}

	private function process_form() {
		# We use 0 instead of false, because false is the default for get_option(), and thus setting an unset value to false with update_option() actually sets nothing (since update_option() first checks for the existing value) - which is unhelpful if you want to call get_option() with a different default (as we do)
		$autobackup = (isset($_POST['updraft_autobackup']) && $_POST['updraft_autobackup'] == 'yes') ? 1 : 0;
		if (!empty($_POST['updraft_autobackup_setdefault']) && 'yes' == $_POST['updraft_autobackup_setdefault']) UpdraftPlus_Options::update_updraft_option('updraft_autobackup_default', $autobackup);

		# Having dealt with the saving, now see if we really wanted to do it
		if (!empty($_REQUEST['updraftplus_noautobackup'])) $autobackup = 0;
		UpdraftPlus_Options::update_updraft_option('updraft_autobackup_go', $autobackup);

		if ($autobackup) add_action('admin_footer', array($this, 'admin_footer'));
	}

	# The initial form submission from the updates page
	public function admin_action_do_plugin_upgrade() {
		if (!current_user_can('update_plugins')) return;
		$this->type = __('plugins', 'updraftplus');
		$this->internaltype = 'plugins';
		$this->process_form();
	}

	public function admin_action_do_theme_upgrade() {
		if (!current_user_can('update_themes')) return;
		$this->type = __('themes', 'updraftplus');
		$this->internaltype = 'themes';
		$this->process_form();
	}

	# Into the updating iframe...
	public function admin_action_update_selected() {
		if ( !current_user_can('update_plugins') ) return;
		$autobackup = UpdraftPlus_Options::get_updraft_option('updraft_autobackup_go');
		if ($autobackup) $this->autobackup_go('plugins');
	}

	public function admin_action_update_selected_themes() {
		if ( !current_user_can('update_themes') ) return;
		$autobackup = UpdraftPlus_Options::get_updraft_option('updraft_autobackup_go');
		if ($autobackup) $this->autobackup_go('themes');
	}

	public function admin_action_do_core_upgrade() {
		if (!isset($_POST['upgrade'])) return;
		if (!empty($_REQUEST['updraftplus_noautobackup'])) return;
		if (!current_user_can('update_core')) wp_die( __( 'You do not have sufficient permissions to update this site.' ) );
		check_admin_referer('upgrade-core');

		# It is important to not use (bool)false here, as that conflicts with using get_option() with a non-false default value
		$autobackup = (isset($_POST['updraft_autobackup']) && $_POST['updraft_autobackup'] == 'yes') ? 1 : 0;

		if (!empty($_POST['updraft_autobackup_setdefault']) && 'yes' == $_POST['updraft_autobackup_setdefault']) UpdraftPlus_Options::update_updraft_option('updraft_autobackup_default', $autobackup);

		if ($autobackup) {
			require_once(ABSPATH . 'wp-admin/admin-header.php');

			$creating = __('Creating database backup with UpdraftPlus...', 'updraftplus').' '.__('(logs can be found in the UpdraftPlus settings page as normal)...', 'updraftplus');

			$lastlog = __('Last log message', 'updraftplus').':';
			$updraft_credentialtest_nonce = wp_create_nonce('updraftplus-credentialtest-nonce');
			$unexpected_response = esc_js(__('Unexpected response:','updraftplus'));

			global $updraftplus;
			$updraftplus->log(__('Starting automatic backup...','updraftplus'));

			echo '<div class="wrap"><h2>'.__('Automatic Backup','updraftplus').'</h2>';

			echo "<p>$creating</p><p>$lastlog <span id=\"updraft_lastlogcontainer\"></span></p><div id=\"updraft_activejobs\" style=\"clear:both;\"></div>";

			echo <<<ENDHERE
				<script>
					var lastlog_sdata = {
						action: 'updraft_ajax',
						subaction: 'activejobs_list',
						oneshot: 'yes'
					};
					setInterval(function(){updraft_autobackup_showlastlog(true);}, 3000);
					function updraft_autobackup_showlastlog(repeat){
						lastlog_sdata.nonce = '$updraft_credentialtest_nonce';
						jQuery.get(ajaxurl, lastlog_sdata, function(response) {
							try {
								resp = jQuery.parseJSON(response);
								if (resp.l != null) { jQuery('#updraft_lastlogcontainer').html(resp.l); }
								if (resp.j != null && resp.j != '') {
									jQuery('#updraft_activejobs').html(resp.j);
								} else {
									if (!jQuery('#updraft_activejobs').is(':hidden')) {
										jQuery('#updraft_activejobs').hide();
									}
								}
							} catch(err) {
								console.log('$unexpected_response '+response);
							}
						});
					}
				</script>
ENDHERE;

			$this->type = 'core';
			$this->internaltype = 'core';
			$this->autobackup_go('core', true);
			echo '</div>';
		}

	}

	// This is in WP 3.9 and later as a global function (but we support earlier)
	private function doing_filter($filter = null) {
		if (function_exists('doing_filter')) return doing_filter($filter);
		global $wp_current_filter;
		if ( null === $filter ) {
			return ! empty( $wp_current_filter );
		}
		return in_array( $filter, $wp_current_filter );
	}

	private function autobackup_go($entity, $jquery = false) {
		define('UPDRAFTPLUS_BROWSERLOG', true);
		echo '<p style="clear:left; padding-top:6px;">'.__('Creating backup with UpdraftPlus...', 'updraftplus')."</p>";
		@ob_end_flush();
		echo '<pre id="updraftplus-autobackup-log">';
		global $updraftplus;

		if ('core' == $entity) {
			$entities = $updraftplus->get_backupable_file_entities();
			if (isset($entities['wpcore'])) {
				$backup_files = true;
				$backup_files_array = array('wpcore');
			} else {
				$backup_files = false;
				$backup_files_array = false;
			}
		} else {
			$backup_files = true;
			$backup_files_array = array($entity);
		}

		if ('core' == $entity) {
			add_filter('updraftplus_dirlist_wpcore_override', array($this, 'updraftplus_dirlist_wpcore_override'), 10, 2);
			add_filter('updraft_wpcore_description', array($this, 'wpcore_description'));
		}

		add_filter('updraftplus_initial_jobdata', array($this, 'initial_jobdata2'));

		$updraftplus->boot_backup($backup_files, true, $backup_files_array, true);
		echo '</pre>';
		if ($updraftplus->error_count() >0) {
			echo '<h2>'.__("Errors have occurred:", 'updraftplus').'</h2>';
			$updraftplus->list_errors();
			if ($jquery) include(ABSPATH . 'wp-admin/admin-footer.php');
			die;
		}
		$this->autobackup_finish($jquery);
	}

	private function autobackup_finish($jquery = false) {

		global $wpdb;
		if (method_exists($wpdb, 'check_connection') && !$wpdb->check_connection(false)) {
			$updraftplus->log("It seems the database went away, and could not be reconnected to");
			die;
		}

		echo "<script>var h = document.getElementById('updraftplus-autobackup-log'); h.style.display='none';</script>";

		if ($jquery) {
			echo '<p>'.__('Backup succeeded', 'updraftplus').' <a href="#updraftplus-autobackup-log" onclick="jQuery(\'#updraftplus-autobackup-log\').slideToggle();">'.__('(view log...)', 'updraftplus').'</a> - '.__('now proceeding with the updates...', 'updraftplus').'</p>';
		} else {
			echo '<p>'.__('Backup succeeded', 'updraftplus').' <a href="#updraftplus-autobackup-log" onclick="var s = document.getElementById(\'updraftplus-autobackup-log\'); s.style.display = \'block\';">'.__('(view log...)', 'updraftplus').'</a> - '.__('now proceeding with the updates...', 'updraftplus').'</p>';
		}

	}

	public function admin_action_upgrade_plugin() {
		if ( ! current_user_can('update_plugins') ) return;

		$plugin = isset($_REQUEST['plugin']) ? trim($_REQUEST['plugin']) : '';
		check_admin_referer('upgrade-plugin_' . $plugin);

		$autobackup = $this->get_setting_and_check_default_setting_save();

		if (!empty($_REQUEST['updraftplus_noautobackup'])) return;

		$title = __('Update Plugin');
		$parent_file = 'plugins.php';
		$submenu_file = 'plugins.php';
		require_once(ABSPATH . 'wp-admin/admin-header.php');

		$this->inpage_restrict = 'plugins';

		# Did the user get the opportunity to indicate whether they wanted a backup?
		if (!isset($_POST['updraft_autobackup_answer'])) $this->auto_backup_form_and_die();

		if ($autobackup) {
			echo '<div class="wrap"><h2>'.__('Automatic Backup','updraftplus').'</h2>';
			$this->autobackup_go('plugins', true);
			echo '</div>';
		}

		# Now, the backup is (if chosen) done... but the upgrade may not directly proceed. If WP needed filesystem credentials, then it may put up an intermediate screen, which we need to insert a field in to prevent an endless circle
		add_filter('request_filesystem_credentials', array($this, 'request_filesystem_credentials'));

	}

	public function get_setting_and_check_default_setting_save() {
		# Do not use bools here - conflicts with get_option() with a non-default value
		$autobackup = (isset($_REQUEST['updraft_autobackup']) && $_REQUEST['updraft_autobackup'] == 'yes') ? 1 : 0;

		if (!empty($_REQUEST['updraft_autobackup_setdefault']) && 'yes' == $_REQUEST['updraft_autobackup_setdefault']) UpdraftPlus_Options::update_updraft_option('updraft_autobackup_default', $autobackup);

		return $autobackup;
	}

	public function request_filesystem_credentials($input) {
		echo <<<ENDHERE
<script>
	jQuery(document).ready(function(){
		jQuery('#upgrade').before('<input type="hidden" name="updraft_autobackup_answer" value="1">');
	});
</script>
ENDHERE;
		return $input;
	}

	public function admin_action_upgrade_theme() {

		if ( ! current_user_can('update_themes') ) return;
		$theme = isset($_REQUEST['theme']) ? urldecode($_REQUEST['theme']) : '';
		check_admin_referer('upgrade-theme_' . $theme);

		$autobackup = $this->get_setting_and_check_default_setting_save();

		if (!empty($_REQUEST['updraftplus_noautobackup'])) return;

		$title = __('Update Theme');
		$parent_file = 'themes.php';
		$submenu_file = 'themes.php';
		require_once(ABSPATH.'wp-admin/admin-header.php');

		$this->inpage_restrict = 'themes';

		# Did the user get the opportunity to indicate whether they wanted a backup?
		if (!isset($_POST['updraft_autobackup_answer'])) $this->auto_backup_form_and_die();

		if ($autobackup) {
			echo '<div class="wrap"><h2>'.__('Automatic Backup','updraftplus').'</h2>';
			$this->autobackup_go('themes', true);
			echo '</div>';
		}

		# Now, the backup is (if chosen) done... but the upgrade may not directly proceed. If WP needed filesystem credentials, then it may put up an intermediate screen, which we need to insert a field in to prevent an endless circle
		add_filter('request_filesystem_credentials', array($this, 'request_filesystem_credentials'));

	}

	private function auto_backup_form_and_die() {
		$this->auto_backup_form();
		// Prevent rest of the page - unnecessary since we die() anyway
		// unset($_GET['action']);
		add_action('admin_footer', array($this, 'admin_footer_inpage_backup'));
		include(ABSPATH . 'wp-admin/admin-footer.php');
		die;
	}

	public function pre_current_active_plugins() {
		if (!current_user_can('update_plugins')) return;
		$this->inpage_restrict = 'plugins';
		add_action('admin_footer', array($this, 'admin_footer_inpage_backup'));
	}

	// New-style (Feb 2015) in-page backup widget
	// Basically, this function renders the minimum necessary of the admin furniture to be able to get everything up and running. It is an _alternative_ to the full set of furniture.
	// Mar 2015: Tweaks added for WP's new "shiny updates" method (wp-admin/js/updates.js) - principally, the update lock.
	public function admin_footer_inpage_backup() {

		if (!empty($this->inpage_restrict) && !current_user_can('update_'.$this->inpage_restrict)) return;
		global $updraftplus_admin, $wp_version;
		$updraftplus_admin->render_admin_css();
		$updraftplus_admin->admin_enqueue_scripts();
		?>
			<script type="text/javascript">
				var updraft_credentialtest_nonce='<?php echo wp_create_nonce('updraftplus-credentialtest-nonce');?>';
				var updraft_siteurl = '<?php echo esc_js(site_url());?>';
				var updraft_autobackup_cleared_to_go = 0;
				var updraft_actually_proceeding = true;
				jQuery(document).ready(function($) {

					var updraft_bulk_updates_proceed = false;
					var something_happening = false;

					// Shiny updates in WP 4.2+ . We are particularly interested in wp.updates.updateLock and wp.updates.queueChecker();
					window.wp = window.wp || {};
					var wp = window.wp;
					var shiny_updates = (wp.hasOwnProperty('updates') && wp.updates.hasOwnProperty('updateLock')) ? 1 : 0;

					if (shiny_updates) {
						console.log('UpdraftPlus: WP shiny updates (4.2+) detected: lock');
						// We lock at this early stage, because jQuery doesn't give us a way (without fiddling with internals) to change the event order to make our click handler go first and lock then.
						wp.updates.updateLock = true;

						jQuery(window).off('beforeunload', wp.updates.beforeunload);
 
						jQuery(window).on('beforeunload', function(){
							if (something_happening) { return wp.updates.beforeunload(); }
							// Otherwise: let the unload proceed
						});

						// Trigger provided after Trac report - first time, in wrong place... corrected in WP 4.2 RC 1 - phew!
						jQuery(document).on('wp-plugin-update-success', function() {
							if (wp.updates.updateQueue.length == 0) {
								console.log("UpdraftPlus: detected newly-empty queue: locking");
								wp.updates.updateLock = true;
								something_happening = false;
							}
						});
						// Ugly, ugly... but there was (until the trigger came) no other way to allow a second individual plugin update on the plugins page to be cancelled from our dialog - the lock is left open otherwise
// 						setInterval(function(){
// 							if (wp.updates.updateQueue.length == 0) {
// 								if (wp.updates.updateLock == false) {
// 									console.log("UpdraftPlus: detected newly-empty queue: locking");
// 									something_happening = false;
// 									wp.updates.updateLock = true;
// 								}
// 							}
// 						}, 250);

						jQuery(document).on('wp-plugin-update-success', function() {
							if (wp.updates.updateQueue.length == 0) {
								wp.updates.updateLock = true;
							}
						});

					}

					function shiny_updates_cancel() {
						updraft_actually_proceeding = false;
						if (!shiny_updates) { return; }
						// This function does everything needed
						if (wp.updates.updateQueue.length > 0) { wp.updates.requestForCredentialsModalCancel(); }

// 						wp.updates.updateQueue = [];
// 						jQuery('.update-message').removeClass( 'updating-message' ).text('<?php _e('Update cancelled - reload page to try again.', 'updraftplus'); ?>');
						wp.updates.updateLock = true;
						something_happening = false;
					}
					
					function shiny_updates_complete() {
						if (!shiny_updates || updraft_actually_proceeding) { return; }
						if (wp.updates.updateQueue.length > 0) { return shiny_updates_cancel(); }
						wp.updates.updateQueue = [];
						something_happening = false;
// 						jQuery('.plugin-update').remove();
// 						jQuery('.update-message').remove();
						wp.updates.updateLock = true;
					}
					
					function shiny_updates_proceed() {
						something_happening = true;
						var qlen = wp.updates.updateQueue.length;
						console.log('UpdraftPlus: WP shiny updates: release lock; queue length: '+qlen);
						// FTP credentials, if necessary
						wp.updates.updateLock = false;
						if ( wp.updates.shouldRequestFilesystemCredentials && ! wp.updates.updateLock ) {
							// This will set the lock back to true, if necessary
							wp.updates.requestFilesystemCredentials();
						}
						// This won't do anything if the lock is set
						wp.updates.queueChecker();
						updraft_actually_proceeding = false;
					}

					function updates_intercept(e, passthis, checklink, via_shiny_updates) {

						updraft_actually_proceeding = false;

						if (via_shiny_updates && !wp.updates.updateLock) {
							console.log('UpdraftPlus: WP shiny updates: lock');
							something_happening = true;
							wp.updates.updateLock = true;
						}

						var detecting_pluginfo = jQuery(passthis).parents('#plugin-information-footer');
						var detecting_pluginfo_len = jQuery(passthis).parents('#plugin-information-footer').length;

						var link;
						if (checklink) {
							link = jQuery(passthis).attr('href');
							if (link.indexOf('action=upgrade-plugin') < 0) { return; }
						} else {
							// No longer true: (previous comment - Irrelevant: checklink = false is only called with shiny updates)
// 							link = '';
							link = document.location;
						}

						e.preventDefault();
						var updraft_inpage_modal_buttons = {};
						updraft_inpage_modal_buttons[updraftlion.cancel] = function() {
							updraft_actually_proceeding = false;
							if (via_shiny_updates) { shiny_updates_cancel(); }
							jQuery(this).dialog("close");
						};
						updraft_inpage_modal_buttons[updraftlion.proceedwithupdate] = function() {
							// Don't let the old-style autobackup fire as well
							var newlink = link+'&updraftplus_noautobackup=1';
							var $dialog = jQuery(this);
							if (jQuery('#updraft_autobackup_setdefault').is(':checked')) {
								newlink = newlink + '&updraft_autobackup_setdefault=yes';
								var autobackup;
								if (jQuery('#updraft_autobackup').is(':checked')) {
									newlink = newlink + '&updraft_autobackup=yes';
									autobackup = 1;
								} else  {
									newlink = newlink + '&updraft_autobackup=';
									autobackup = 0;
								}
								jQuery.post(ajaxurl,  {
									action: 'updraft_ajax',
									subaction: 'set_autobackup_default',
									nonce: '<?php echo esc_js(wp_create_nonce('updraftplus-credentialtest-nonce'));?>',
									default: autobackup
								}, function(response) {
									console.log(response);
								});
							}
							if (jQuery('#updraft_autobackup').is(':checked')) {
								updraft_backupnow_inpage_go(function() {
									updraft_actually_proceeding = true;
									$dialog.dialog('close');
									if (via_shiny_updates && detecting_pluginfo_len == 0) {
										shiny_updates_proceed();
									} else {
										// Proceed to update
										if (jQuery(passthis).find('#bulk-action-selector-top').length > 0) {
											updraft_bulk_updates_proceed = true;
											jQuery(passthis).submit();
										} else {
											window.location.href = newlink;
										}
									}
								}, '<?php echo esc_js($this->inpage_restrict);?>', 'autobackup');
							} else {
								// Not auto backup needed - just proceed
								updraft_actually_proceeding = true;
								$dialog.dialog('close');
								// Proceed to update
								if (via_shiny_updates && detecting_pluginfo_len == 0) {
									shiny_updates_proceed();
								} else {
									if (jQuery(passthis).find('#bulk-action-selector-top').length > 0) {
										updraft_bulk_updates_proceed = true;
										jQuery(passthis).submit();
									} else {
										window.location.href = newlink;
									}
								}
							}
						};
						jQuery('#updraft-backupnow-inpage-modal').dialog('option', 'buttons', updraft_inpage_modal_buttons);
						jQuery('#updraft_inpage_backup').hide();
						jQuery('#updraft-backupnow-inpage-modal').bind('dialogclose', function(event) {
							if (updraft_actually_proceeding) { return; }
							//shiny_updates_cancel();
							shiny_updates_complete();
						});
						jQuery('#updraft-backupnow-inpage-modal').dialog('open');
						jQuery('#updraft_inpage_prebackup').show();

					}

					<?php if (version_compare($wp_version, '3.3', '>=')) { ?>
					// Bulk action form
					jQuery( '#bulk-action-form' ).on( 'submit', function( e ) {
						if (!shiny_updates || updraft_bulk_updates_proceed) { return; }
						var $checkbox, plugin, slug;

						if ( jQuery( '#bulk-action-selector-top' ).val() == 'update-selected' ) {

							var are_there_any = false;
							jQuery( 'input[name="checked[]"]:checked' ).each( function( index, elem ) {
								$checkbox = jQuery( elem );
								plugin = $checkbox.val();
								slug = $checkbox.parents( 'tr' ).prop( 'id' );
								are_there_any = true;
							} );
							// Shiny updates unchecks the check boxes. So, we also need to check the queue.
							
							if (!are_there_any && wp.updates.updateQueue.length == 0) { return; }
							
							// The 0 here is because shiny updates have been disabled on bulk action forms for now
							updates_intercept(e, this, false, 0);
							// Remove lock, for the same reason - otherwise, the "do you really want to move away?" message pops up.
							something_happening = false;
							wp.updates.updateLock = false;
						}
					} );

// 					$('tr.plugin-update-tr a, #plugin-information-footer a.button').click(function(e) {
// 						updates_intercept(e, this, true);
// 					});
					jQuery('tr.plugin-update-tr').on('click', 'a', function(e) {
						updates_intercept(e, this, true, shiny_updates);
					});
					jQuery('#plugin-information-footer').on('click', ' a.button', function(e) {
						updates_intercept(e, this, true, shiny_updates);
					});

					<?php } ?>

					jQuery('form.upgrade').submit(function() {
						var name=jQuery(this).attr('name');
						var entity = 'plugins';
						if ('upgrade' == name) {
							entity = 'wpcore';
						} else if ('upgrade-themes' == name) {
							entity = 'themes';
						} else if ('upgrade-plugins' == name) {
							entity = 'plugins';
						} else {
							console.log("UpdraftPlus Error: do not know which entity to backup (will default to plugins): "+name);
						}
						console.log("UpdraftPlus: upgrade form submitted; form="+name+", entity="+entity);
						var doit = updraft_try_inpage('form[name="'+name+'"]', entity);
						if (doit) {
							jQuery('form[name="'+name+'"]').append('<input type="hidden" name="updraftplus_noautobackup" value="1">');
						}
						return doit;
					});

				});

				function updraft_try_inpage(which_form_to_finally_submit, restrict) {
					if (updraft_autobackup_cleared_to_go) { return true; }
					var doit = jQuery('#updraft_autobackup').is(':checked');
					// If no auto-backup, then just carry on
					if (!doit) { return true;}
					if ('' == restrict) { restrict = '<?php echo esc_js($this->inpage_restrict);?>'; }
					updraft_backupnow_inpage_go(function() {
						jQuery(which_form_to_finally_submit).append('<input type="hidden" name="updraftplus_noautobackup" value="1">');
						// Prevent infinite backup loop
						updraft_autobackup_cleared_to_go = 1;
						if ('wpcore' == restrict) {
							jQuery(which_form_to_finally_submit).append('<input type="hidden" name="upgrade" value="Update Now">');
							jQuery(which_form_to_finally_submit).submit();
						} else {
							jQuery(which_form_to_finally_submit).submit();
						}
					}, restrict, 'autobackup');
					// Don't proceed with form submission yet - that's done in the callback
					return false;
				}
			</script>

			<div id="updraft-poplog" >
				<pre id="updraft-poplog-content" style="white-space: pre-wrap;"></pre>
			</div>

			<div id="updraft-backupnow-inpage-modal" title="UpdraftPlus - <?php _e('Automatic backup before update', 'updraftplus'); ?>">

				<div id="updraft_inpage_prebackup" style="float:left;clear:both;">
					<?php $this->auto_backup_form(true, 'updraft_autobackup', 'yes', false); ?>
				</div>

				<div id="updraft_inpage_backup" style="float:left;clear:both;">

					<h2><?php _e('Automatic backup before update', 'updraftplus');?></h2>

					<div id="updraft_backup_started" class="updated" style="display:none; max-width: 560px; font-size:100%; line-height: 100%; padding:6px; clear:left;"></div>

					<?php
					$updraftplus_admin->render_active_jobs_and_log_table(true, false);
					?>
				</div>
<!-- 				<h2></h2> -->
			</div>
		<?php
	}

	private function auto_backup_form($include_wrapper = true, $id='updraft_autobackup', $value='yes', $form_tags = true) {

		if ($include_wrapper) {
			?>

			<?php if ($form_tags) { ?><h2><?php echo __('UpdraftPlus Automatic Backups', 'updraftplus');?></h2><?php } ?>
			<?php if ($form_tags) { ?><form method="post" id="updraft_autobackup_form" onsubmit="return updraft_try_inpage('#updraft_autobackup_form', '');"><?php } ?>
			<div id="updraft-autobackup" <?php if ($form_tags) echo 'class="updated"'; ?> style="<?php if ($form_tags) { echo 'border: 1px dotted; '; } ?>padding: 6px; margin:8px 0px; max-width: 540px;">
			<h3 style="margin-top: 0px;"><?php _e('Be safe with an automatic backup','updraftplus');?></h3>
			<?php
		}
		?>
		<input <?php if (UpdraftPlus_Options::get_updraft_option('updraft_autobackup_default', true)) echo 'checked="checked"';?> type="checkbox" id="<?php echo $id;?>" value="<?php echo $value;?>" name="<?php echo $id;?>">
		<?php if (!$include_wrapper) echo '<br>'; ?>
		<label for="<?php echo $id;?>"><?php echo __('Backup (where relevant) plugins, themes and the WordPress database with UpdraftPlus before updating', 'updraftplus');?></label><br>
		<?php
		if ($include_wrapper) {
			?>
			<input checked="checked" type="checkbox" value="yes" name="updraft_autobackup_setdefault" id="updraft_autobackup_setdefault"> <label for="updraft_autobackup_setdefault"><?php _e('Remember this choice for next time (you will still have the chance to change it)', 'updraftplus');?></label><br><em>
			<?php
		}
		?>
		<p><a href="http://updraftplus.com/automatic-backups/"><?php _e('Read more about how this works...','updraftplus'); ?></a></p>
		<?php
		if ($include_wrapper) {
		?></em>
		<?php if ($form_tags) { ?><p><em><?php _e('Do not abort after pressing Proceed below - wait for the backup to complete.', 'updraftplus'); ?></em></p><?php } ?>
		<?php if ($form_tags) { ?><input style="clear:left; margin-top: 6px;" name="updraft_autobackup_answer" type="submit" value="<?php _e('Proceed with update', 'updraftplus');?>"><?php } ?>
		</div>
		<?php
		if ($form_tags) echo '</form>';
		}
	}

}
