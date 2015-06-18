<?php
/**
 * Plugin Name: GitHub Sync
 * Description: Synchronize a local git branch with a remote, using the GitHub Post-Receive Hooks. Uses "exec"
 * Author: Pierre Bertet
 * Version: 1.0.0
 * Author URI: http://pierrebertet.net/
 *
 *
 *
 */
namespace wpCloud\Stateless {

	function add_plugin( $path, $message ) {

		$absolutePath = wp_normalize_path( $_SERVER[ 'DOCUMENT_ROOT' ] . '/' .  $path );
		$commitMessage = "$message [ci skip]";

		passthru( "git add $absolutePath --all 2>&1", $_add );

		//passthru( "git commit -m $commitMessage 2>&1", $_commit );
		//passthru( "git push  2>&1", $_push );

		$_actions = (object) array(
			"add" => $_add,
			"commit" => $_commit,
			"push" => $_push
		);

		die( '<pre>' . print_r( $_actions, true ) . '</pre>');

		if ( $return_code == 0 ) {
			die( "\n\nComposer has been ran. Please reload." );
		} else {
			die( 'Composer was attempted to be installed, but an error occured' );
		}
	}

	// add_plugin( 'vendor/plugins/gravityforms', 'Updated gravityforms plugin.' );

	if( defined( 'WP_CLI' ) && class_exists( 'WP_CLI_Command' ) && !class_exists( 'GitHub_Command' ) ) {

		/**
		 * DreamHost Migrate Plugin
		 *
		 * @package DH_Migrate_Command
		 * @subpackage commands/community
		 * @maintainer Mike Schroder
		 */
		class GitHub_Command extends \WP_CLI_Command {

			/**
			 * Backup entire WordPress install, including core, plugins and database.
			 *
			 * @subcommand upload
			 *
			 * @alias upload
			 *
			 * @param array $args
			 * @param array $assoc_args
			 */
			function upload( $args, $assoc_args ) {
				WP_CLI::line( 'uploading...' );

				//
				// -L ./log.log
				//$_cmd = '/Users/andy.potanin/devtools/gsutil/gsutil -a cp /Users/andy.potanin/Sites/www.wpcloud.io/wp-content/public/www.wpcloud.io/stereo-cat.jpg gs://media.wpcloud.io';
				$_cmd = '/Users/andy.potanin/devtools/gsutil/gsutil -m cp -a public-read -L gce.log -v /Users/andy.potanin/Sites/www.wpcloud.io/wp-content/public/www.wpcloud.io/stereo-cat.jpg gs://media.wpcloud.io';
				// $_cmd = '/Users/andy.potanin/devtools/gsutil/gsutil -m cp -a public-read -v /Users/andy.potanin/Sites/www.wpcloud.io/wp-content/public/www.wpcloud.io/stereo-cat.jpg gs://media.wpcloud.io';

				$_test = \WP_CLI::launch($_cmd, false, true);

				WP_CLI::print_value( $_test->return_code );

			}

			/**
			 * Backup entire WordPress install, including core, plugins and database.
			 *
			 * @subcommand backup
			 *
			 * @alias mv
			 *
			 * @param array $args
			 * @param array $assoc_args
			 * @synopsis [backup_filename] [--no-db] [--db-name=<filename>]
			 */
			function backup( $args, $assoc_args ) {
				$filename         = $dbname = null;
				$backup_directory = '../';

				// If a filename isn't specified, default to "Site's Title.tar.gz".
				if ( empty( $args ) ) {
					$filename = $backup_directory . get_bloginfo() . '.tar.gz';
				} else {
					$filename = $args[ 0 ];
				}

				// If --no-db is specified, don't include the database in backup
				if ( ! isset( $assoc_args[ 'no-db' ] ) ) {
					$dbname = isset( $assoc_args[ 'db-name' ] ) ? $assoc_args[ 'db-name' ] : 'database_backup.sql';

					WP_CLI::run_command( array( 'db', 'export', $backup_directory . $dbname ), array() );
				}

				// Using esc_cmd to automatically escape parameters.
				// We can't use --exclude-vcs, because it's not available on OSX.
				WP_CLI::line( "Backing up to $filename ..." );
				$result = \WP_CLI::launch( WP_CLIUtilsesc_cmd( "
				tar
					--exclude '.git'
					--exclude '.svn'
					--exclude '.hg'
					--exclude '.bzr'
					-czf %s . -C %s %s
			", $filename, $backup_directory, $dbname ), false );

				// If we created a database backup, remove the temp file.
				if ( $dbname && ! unlink( $backup_directory . $dbname ) ) {
					WP_CLI::warning( "Couldn't remove temporary database backup, '$dbname'." );
				}

				if ( 0 == $result ) {
					WP_CLI::success( "Backup Complete." );
				} else {
					WP_CLI::error( "Backup Failed." );
				}
			}
		}

		// \WP_CLI::add_command( 'github', 'wpCloud\Stateless\GitHub_Command' );

	}

	add_filter( 'upgrader_pre_download', function( $false, $package, $this ) {
		return $false;
	}, 10, 3 );

	add_filter( 'downloading_package', function( $package ) {
		return $package;
	});

	add_filter( 'automatic_updates_is_vcs_checkout', function( $checkout, $context ) {
		return $checkout;
	}, 10, 2);

	add_filter( 'auto_update_plugin', function( $update, $item ) {
		return $update;
	}, 10, 2);

	add_filter( 'auto_update_theme', function( $update, $item ) {
		return $update;
	}, 10, 2);

	add_filter( 'auto_update_translation', function( $update, $item ) {
		return $update;
	}, 10, 2);

	// Notice messages
	add_action('admin_notices', function(){
		$messages = array();
		if (!function_exists('exec')) {
			$messages[] = 'the PHP <code>exec()</code> function needs to be activated.';
		}
		if (!defined('GITHUB_SYNC_DIR')) {
			// $messages[] = 'you have to define the <code>GITHUB_SYNC_DIR</code> setting.';
		}
		if (!defined('GITHUB_SYNC_REPO_ID')) {
			// $messages[] = 'you have to define the <code>GITHUB_SYNC_REPO_ID</code> setting.';
		}
		foreach ($messages as $message) {
			echo '<div class="error"><p>The GitHub Sync plugin is not working: '.$message.'</p></div>';
		}
	}, 0);

	// Authorized IPs (default: GitHub IPs)
	if (!defined('GITHUB_SYNC_IPS')) {
		define('GITHUB_SYNC_IPS', '207.97.227.253, 50.57.128.197, 108.171.174.178');
	}

	// Git branch (default: master)
	if (!defined('GITHUB_SYNC_BRANCH')) {
		define('GITHUB_SYNC_BRANCH', 'master');
	}

	// Git remote (default: origin)
	if (!defined('GITHUB_SYNC_REMOTE')) {
		define('GITHUB_SYNC_REMOTE', 'origin');
	}

	// Log file (default: NULL)
	if (!defined('GITHUB_SYNC_LOG')) {
		define('GITHUB_SYNC_LOG', NULL);
	}

	// Repo directory (no default, required)
	if (!defined('GITHUB_SYNC_DIR')) {
		return;
	}

	// Repo GitHub ID, owner/project (eg. bpierre/wp-github-sync)
	if (!defined('GITHUB_SYNC_REPO_ID')) {
		return;
	}

	function log_msg($msg) {
		if (GITHUB_SYNC_LOG !== NULL) {
			file_put_contents(GITHUB_SYNC_LOG, $msg . "\n", FILE_APPEND);
		}
	}

	function check_request() {

		// HTTP method
		if ($_SERVER['REQUEST_METHOD'] != 'POST') {
			log_msg('Error: the request method is not POST');
			return FALSE;
		}

		// Authorized IPs
		$authorized_ips = array_map(function($ip){ return trim($ip); }, explode(',', GITHUB_SYNC_IPS));
		if (!in_array($_SERVER['REMOTE_ADDR'], $authorized_ips)) {
			log_msg('Error: IP not authorized ('. $_SERVER['REMOTE_ADDR'] .')');
			return FALSE;
		}

		// Payload parameter
		if (!isset($_POST['payload'])) {
			log_msg('Error: missing "payload" parameter.');
			return FALSE;
		}

		return TRUE;
	}

	function update_repository($raw_content) {
		$content = json_decode($raw_content);

		if ($content == NULL
		    || !property_exists($content, 'ref')
		    || !property_exists($content, 'repository')
		    || !property_exists($content->repository, 'name')
		    || !property_exists($content->repository, 'owner')
		    || !property_exists($content->repository->owner, 'name')) {
			log_msg('Error: malformed JSON.');
			return;
		}

		if ($content->ref === 'refs/heads/'.GITHUB_SYNC_BRANCH // Branch updated
		    && "{$content->repository->owner->name}/{$content->repository->name}" === GITHUB_SYNC_REPO_ID) { // Valid repository
			chdir(GITHUB_SYNC_DIR);
			exec('git pull '.escapeshellarg(GITHUB_SYNC_REMOTE).' '.escapeshellarg(GITHUB_SYNC_BRANCH));
			log_msg('Repository updated.');
		} else {
			log_msg('Error: wrong branch (configured: '. GITHUB_SYNC_BRANCH .', pushed: '. end(explode('/', $content->ref)) .')');
		}
	}

	add_filter('__rewrite_rules_array', function($rules) {
		$new_rules = array('^github-sync\/?$' => 'index.php?github_sync=1');
		return $new_rules + $rules;
	});

	add_filter('__query_vars', function($qvars) {
		$qvars[] = 'github_sync';
		return $qvars;
	});

	add_action('template_redirect', function(){
		if (get_query_var('github_sync') == '1') {
			log_msg("\n\nNew update request. Check...");
			if (check_request()) {
				log_msg('All check tests passed. Update repository...');
				update_repository(stripcslashes($_POST['payload']));
			} else {
				wp_die(__('You are not authorized to view this page.'), '', array( 'response' => 403 ) );
			}
		}
	});

}