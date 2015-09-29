<?php
/*
UpdraftPlus Addon: moredatabase:Multiple database backup options
Description: Provides the ability to encrypt database backups, and to back up external databases
Version: 1.1
Shop: /shop/moredatabase/
Latest Change: 1.9.32
*/

if (!defined('UPDRAFTPLUS_DIR')) die('No direct access allowed');

$updraftplus_addon_moredatabase = new UpdraftPlus_Addon_MoreDatabase;

class UpdraftPlus_Addon_MoreDatabase {

	public function __construct() {
		add_filter('updraft_backup_databases', array($this, 'backup_databases'));
		add_filter('updraft_database_encryption_config', array($this, 'database_encryption_config'));
		add_filter('updraft_encrypt_file', array($this, 'encrypt_file'), 10, 5);
		add_filter('updraft_database_moredbs_config', array($this, 'database_moredbs_config'));
		# This runs earlier than default, to allow users who were over-riding already with a filter to continue doing so
		add_filter('updraftplus_get_table_prefix', array($this, 'get_table_prefix'), 9);
		add_action('updraft_extradb_testconnection', array($this, 'extradb_testconnection'));
		add_action('updraftplus_restore_form_db', array($this, 'restore_form_db'), 9);
	}

	public function restore_form_db() {

		echo '<div class="updraft_restore_crypteddb" style="display:none;">'.__('Database decryption phrase','updraftplus').': ';

		$updraft_encryptionphrase = UpdraftPlus_Options::get_updraft_option('updraft_encryptionphrase');

		echo '<input type="'.apply_filters('updraftplus_admin_secret_field_type', 'text').'" name="updraft_encryptionphrase" id="updraft_encryptionphrase" value="'.esc_attr($updraft_encryptionphrase).'" style="width:132px" /></div><br>';
	}

	public function get_table_prefix($prefix) {
		if (UpdraftPlus_Options::get_updraft_option('updraft_backupdb_nonwp')) {
			global $updraftplus;
			$updraftplus->log("All tables found will be backed up (indicated by backupdb_nonwp option)");
			return '';
		}
		return $prefix;
	}

	public function extradb_testconnection() {

		if (empty($_POST['user'])) $ret['m'] = die(json_encode(array('r' => $_POST['row'], 'm' => '<p>'.sprintf(__("Failure: No %s was given.",'updraftplus').'</p>',__('user','updraftplus')))));

		if (empty($_POST['host'])) $ret['m'] = die(json_encode(array('r' => $_POST['row'], 'm' => '<p>'.sprintf(__("Failure: No %s was given.",'updraftplus').'</p>',__('host','updraftplus')))));

		if (empty($_POST['name'])) $ret['m'] = die(json_encode(array('r' => $_POST['row'], 'm' => '<p>'.sprintf(__("Failure: No %s was given.",'updraftplus').'</p>',__('database name','updraftplus')))));

		global $updraftplus_admin;
		$updraftplus_admin->logged = array();

		$ret = '';
		$failed = false;

		$wpdb_obj = new UpdraftPlus_WPDB_OtherDB_Test($_POST['user'], $_POST['pass'], $_POST['name'], $_POST['host']);
		if (!empty($wpdb_obj->error)) {
			$failed = true;
			$ret .= '<p>';$dbinfo['user'].'@'.$dbinfo['host'].'/'.$dbinfo['name']." : ".__('database connection attempt failed', 'updraftplus')."</p>";
			if (is_wp_error($wpdb_obj->error) || is_string($wpdb_obj->error)) {
				$ret .= '<ul style="list-style: disc inside;">';
				if (is_wp_error($wpdb_obj->error)) {
					$codes = $wpdb_obj->error->get_error_codes();
					if (is_array($codes)) {
						foreach ($codes as $code) {
							if ('db_connect_fail' == $code) {
								$ret .= "<li>".__('Connection failed: check your access details, that the database server is up, and that the network connection is not firewalled.', 'updraftplus')."</li>";
							} else {
								$err = $wpdb_obj->error->get_error_message($code);
								$ret .= "<li>".$err."</li>";
							}
						}
					}
				} else {
					$ret .= "<li>".$wpdb_obj->error."</li>";
				}
				$ret .= '</ul>';
			}
		}

		$ret_info = '';
		if (!$failed) {
			$all_tables = $wpdb_obj->get_results("SHOW TABLES", ARRAY_N);
			$all_tables = array_map(create_function('$a', 'return $a[0];'), $all_tables);
			if (empty($_POST['prefix'])) {
				$ret_info .= sprintf(__('%s table(s) found.', 'updraftplus'), count($all_tables));
			} else {
				$our_prefix = 0;
				foreach ($all_tables as $table) {
					if (0 === strpos($table, $_POST['prefix'])) $our_prefix++;
				}
				$ret_info .= sprintf(__('%s total table(s) found; %s with the indicated prefix.', 'updraftplus'), count($all_tables), $our_prefix);
			}
		}

		$ret_after = '';

		if (count($updraftplus_admin->logged) >0) {
			$ret_after .= "<p>".__('Messages:', 'updraftplus');
			$ret_after .= '<ul style="list-style: disc inside;">';

			foreach (array_unique($updraftplus_admin->logged) as $code => $err) {
				if ('db_connect_fail' === $code) $failed = true;
				$ret_after .= "<li><strong>$code:</strong> $err</li>";
			}
			$ret_after .= '</ul></p>';
		}

		if (!$failed) {
			$ret = '<p>'.__('Connection succeeded.', 'updraftplus').' '.$ret_info.'</p>'.$ret;
		} else {
			$ret = '<p>'.__('Connection failed.', 'updraftplus').'</p>'.$ret;
		}

		restore_error_handler();
		echo json_encode(array('r' => $_POST['row'], 'm' => $ret.$ret_after));
		die;

	}

	public function database_moredbs_config($ret) {
		global $updraftplus;
		$ret = '';
		$tp = $updraftplus->get_table_prefix(false);
		$updraft_backupdb_nonwp = UpdraftPlus_Options::get_updraft_option('updraft_backupdb_nonwp');

		$ret .= '<input type="checkbox"'.(($updraft_backupdb_nonwp) ? ' checked="checked"' : '').' id="updraft_backupdb_nonwp" name="updraft_backupdb_nonwp" value="1"><label for="updraft_backupdb_nonwp" title="'.sprintf(__('This option will cause tables stored in the MySQL database which do not belong to WordPress (identified by their lacking the configured WordPress prefix, %s) to also be backed up.', 'updraftplus'), $tp).'">'.__('Backup non-WordPress tables contained in the same database as WordPress', 'updraftplus').'</label><br>';
			$ret .= '<p><em>'.__('If your database includes extra tables that are not part of this WordPress site (you will know if this is the case), then activate this option to also back them up.', 'updraftplus').'</em></p>';
	
			$ret .= '<div id="updraft_backupextradbs" style="clear:both:float:left;"></div>';
			
			$ret .= '<div style="clear:both; float:left;"><a href="#" id="updraft_backupextradb_another">'.__('Add an external database to backup...', 'updraftplus').'</a></div>';

		add_action('admin_footer', array($this, 'admin_footer'));
		return $ret;
	}

	public function admin_footer() {
		?>
		<style type="text/css">
			.updraft_backupextradbs_row {
				border: 1px dotted;
				margin: 4px;
				padding: 4px;
			}
			.updraft_backupextradbs_row h3 {
				margin-top: 0px; padding-top: 0px; margin-bottom: 3px;
				font-size: 90%;
			}
			.updraft_backupextradbs_row .updraft_backupextradbs_testresultarea {
				float: left; clear: both;
				padding-bottom: 4px;
			}
			.updraft_backupextradbs_row .updraft_backupextradbs_row_label {
				float: left; width: 90px;
				padding-top:1px;
			}
			.updraft_backupextradbs_row .updraft_backupextradbs_row_textinput {
				float: left; width: 100px; clear:none; margin-right: 6px;
			}
			.updraft_backupextradbs_row_delete {
				float: right;
				cursor: pointer;
				font-size: 100%;
				padding: 1px 3px;
				margin: 0 6px;
			}
			.updraft_backupextradbs_row_delete:hover {
				cursor: pointer;
			}
		</style>
		<script>
			jQuery(document).ready(function() {
				var updraft_extra_dbs = 0;
				function updraft_extradbs_add(host, user, name, pass, prefix) {
					updraft_extra_dbs++;
					jQuery('#updraft_backupextradbs').append(
						'<div class="updraft_backupextradbs_row" id="updraft_backupextradbs_row_'+updraft_extra_dbs+'" style="float: left; clear: both">'+
						'<button type="button" title="<?php echo esc_attr(__('Remove', 'updraftplus'));?>" class="updraft_backupextradbs_row_delete">X</button>'+
						'<h3><?php echo esc_js(__('Backup external database', 'updraftplus'));?></h3>'+
						'<div class="updraft_backupextradbs_testresultarea"></div>'+
						'<div class="updraft_backupextradbs_row_label" style="clear:left;"><?php echo esc_js(__('Host', 'updraftplus'));?>:</div><input class="updraft_backupextradbs_row_textinput extradb_host" type="text" name="updraft_extradbs['+updraft_extra_dbs+'][host]" value="'+host+'">'+
						'<div class="updraft_backupextradbs_row_label"><?php echo esc_js(__('Username', 'updraftplus'));?>:</div><input class="updraft_backupextradbs_row_textinput extradb_user" type="text" name="updraft_extradbs['+updraft_extra_dbs+'][user]" value="'+user+'">'+
						'<div class="updraft_backupextradbs_row_label"><?php echo esc_js(__('Password', 'updraftplus'));?>:</div><input class="updraft_backupextradbs_row_textinput extradb_pass" type="<?php echo apply_filters('updraftplus_admin_secret_field_type', 'text'); ?>" name="updraft_extradbs['+updraft_extra_dbs+'][pass]" value="'+pass+'">'+
						'<div class="updraft_backupextradbs_row_label"><?php echo esc_js(__('Database', 'updraftplus'));?>:</div><input class="updraft_backupextradbs_row_textinput extradb_name" type="text" name="updraft_extradbs['+updraft_extra_dbs+'][name]" value="'+name+'">'+
						'<div class="updraft_backupextradbs_row_label" title="<?php echo esc_attr('If you enter a table prefix, then only tables that begin with this prefix will be backed up.', 'updraftplus');?>"><?php echo esc_js(__('Table prefix', 'updraftplus'));?>:</div><input class="updraft_backupextradbs_row_textinput extradb_prefix" title="<?php echo esc_attr('If you enter a table prefix, then only tables that begin with this prefix will be backed up.', 'updraftplus');?>" type="text" name="updraft_extradbs['+updraft_extra_dbs+'][prefix]" value="'+prefix+'">'+
						'<div class="updraft_backupextradbs_row_label" style="width: 180px; padding: 6px 0; text-align:right;"><a href="#" class="updraft_backupextradbs_row_testconnection"><?php echo esc_js(__('Test connection...', 'updraftplus'));?></a></div>'+
						'</div>');
				}
				jQuery('#updraft_backupextradb_another').click(function(e) {
					e.preventDefault();
					updraft_extradbs_add('', '', '', '', '');
				});
				jQuery('#updraft_backupextradbs').on('click', '.updraft_backupextradbs_row_delete', function() {
					jQuery(this).parents('.updraft_backupextradbs_row').slideUp('slow').delay(400).remove();
				});
				jQuery('#updraft_backupextradbs').on('click', '.updraft_backupextradbs_row_testconnection', function(e) {
					e.preventDefault();
					var row = jQuery(this).parents('.updraft_backupextradbs_row');
					jQuery(row).find('.updraft_backupextradbs_testresultarea').html('<p><em><?php _e('Testing...', 'updraftplus');?></em></p>');
					var data = {
						action: 'updraft_ajax',
						subaction: 'doaction',
						subsubaction: 'updraft_extradb_testconnection',
						row: jQuery(row).attr('id'),
						nonce: '<?php echo wp_create_nonce('updraftplus-credentialtest-nonce'); ?>',
						host: jQuery(row).children('.extradb_host').val(),
						user: jQuery(row).children('.extradb_user').val(),
						pass: jQuery(row).children('.extradb_pass').val(),
						name: jQuery(row).children('.extradb_name').val(),
						prefix: jQuery(row).children('.extradb_prefix').val()
					};
					jQuery.post(ajaxurl, data, function(data) {
						try {
							resp = jQuery.parseJSON(data);
							if (resp.m && resp.r) {
								jQuery('#'+resp.r).find('.updraft_backupextradbs_testresultarea').html(resp.m);
							} else {
								alert('<?php echo esc_js(__('Error: the server sent us a response (JSON) which we did not understand.', 'updraftplus'));?> '+resp);
							}
						} catch(err) {
							console.log(err);
							console.log(data);
						}
					});
				});
				<?php
				$extradbs = UpdraftPlus_Options::get_updraft_option('updraft_extradbs');
				if (is_array($extradbs)) {
					foreach ($extradbs as $db) {
						if (is_array($db) && !empty($db['host'])) echo "updraft_extradbs_add('".esc_js($db['host'])."', '".esc_js($db['user'])."', '".esc_js($db['name'])."', '".esc_js($db['pass'])."', '".esc_js($db['prefix'])."');\n";
					}
				}
				?>
			});
		</script>
		<?php
	}

	public function encrypt_file($result, $file, $encryption, $whichdb, $whichdb_suffix) {

		global $updraftplus;
		$updraft_dir = $updraftplus->backups_dir_location();
		$updraftplus->jobdata_set('jobstatus', 'dbencrypting'.$whichdb_suffix);
		$encryption_result = 0;
		$microstart = microtime(true);
		$file_size = @filesize($updraft_dir.'/'.$file)/1024;

		$encrypted = $this->encrypt($updraft_dir.'/'.$file, $encryption);

		if (false !== $encrypted && 0 != file_put_contents($updraft_dir.'/'.$file.'.crypt', $encrypted)) {

			$time_taken = max(0.000001, microtime(true)-$microstart);

			$sha = sha1_file($updraft_dir.'/'.$file.'.crypt');
			$updraftplus->jobdata_set('sha1-db'.(('wp' == $whichdb) ? '0' : $whichdb.'0').'.crypt', $sha);

			$updraftplus->log("$file: encryption successful: ".round($file_size,1)."Kb in ".round($time_taken,2)."s (".round($file_size/$time_taken, 1)."Kb/s) (SHA1 checksum: $sha)");
			# Delete unencrypted file
			@unlink($updraft_dir.'/'.$file);

			$updraftplus->jobdata_set('jobstatus', 'dbencrypted'.$whichdb_suffix);

			return basename($file.'.crypt');
		} else {
			$updraftplus->log("Encryption error occurred when encrypting database. Encryption aborted.");
			$updraftplus->log(__("Encryption error occurred when encrypting database. Encryption aborted.",'updraftplus'), 'error');
			return basename($file);
		}
	}

	public function database_encryption_config($x) {
		$updraft_encryptionphrase = UpdraftPlus_Options::get_updraft_option('updraft_encryptionphrase');

		$ret = '';

		if (!function_exists('mcrypt_encrypt')) {
			$ret .= '<p><strong>'.sprintf(__('Your web-server does not have the %s module installed.', 'updraftplus'), 'PHP/mcrypt').' '.__('Without it, encryption will be a lot slower.', 'updraftplus').'</strong></p>';
		}

		$ret .= '<input type="'.apply_filters('updraftplus_admin_secret_field_type', 'text').'" name="updraft_encryptionphrase" id="updraft_encryptionphrase" value="'.esc_attr($updraft_encryptionphrase).'" style="width:132px" />';

		$ret .= '<p>'.__('If you enter text here, it is used to encrypt database backups (Rijndael). <strong>Do make a separate record of it and do not lose it, or all your backups <em>will</em> be useless.</strong> This is also the key used to decrypt backups from this admin interface (so if you change it, then automatic decryption will not work until you change it back).','updraftplus').'</p>';

		return $ret;

	}

	public function backup_databases($w) {

		if (!is_array($w)) return $w;

		$extradbs = UpdraftPlus_Options::get_updraft_option('updraft_extradbs');
		if (empty($extradbs) || !is_array($extradbs)) return $w;

		$dbnum = 0;
		foreach ($extradbs as $db) {
			if (!is_array($db) || empty($db['host'])) continue;
			$dbnum++;
			$w[$dbnum] = array('dbinfo' => $db, 'status' => 'begun');
		}

		return $w;
	}

	private function encrypt($fullpath, $key, $rformat = 'inline') {
		global $updraftplus;
		if (!function_exists('mcrypt_encrypt')) {
			$updraftplus->log(sprintf(__('Your web-server does not have the %s module installed.', 'updraftplus'), 'PHP/mcrypt').' '.__('Without it, encryption will be a lot slower.', 'updraftplus'), 'warning', 'nomcrypt');
		}

		$updraftplus->ensure_phpseclib('Crypt_Rijndael', 'Crypt/Rijndael');
		$rijndael = new Crypt_Rijndael();
		$rijndael->setKey($key);
		if ('inline' === $rformat) {
			return $rijndael->encrypt(file_get_contents($fullpath));
		}
		
		return false;
	}

}

# Needs keeping in sync with the version in backup.php
class UpdraftPlus_WPDB_OtherDB_Test extends wpdb {
	// This adjusted bail() does two things: 1) Never dies and 2) logs in the UD log
	public function bail( $message, $error_code = 'updraftplus_default' ) {
// 		global $updraftplus_admin;
// 		if ('updraftplus_default' == $error_code) {
// 			$updraftplus_admin->logged[] = $message;
// 		} else {
// 			$updraftplus_admin->logged[$error_code] = $message;
// 		}
		# Now do the things that would have been done anyway
		if ( class_exists( 'WP_Error' ) )
			$this->error = new WP_Error($error_code, $message);
		else
			$this->error = $message;
		return false;
	}
}