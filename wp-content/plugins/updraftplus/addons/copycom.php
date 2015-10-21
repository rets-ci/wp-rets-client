<?php
/*
UpdraftPlus Addon: copycom:Copy.Com Support
Description: Allows UpdraftPlus to back up to Copy.Com cloud storage
Version: 1.2
Shop: /shop/copycom/
Include: copy
IncludePHP: methods/addon-base.php
RequiresPHP: 5.3.3
Latest Change: 1.10.4
*/

# https://developers.copy.com/documentation
# Undocumented (amongst much else): Paths are case-sensitive (your specified folder must match the case), but clashes are prevented (two paths which differ only by case are not allowed).

if (!defined('UPDRAFTPLUS_DIR')) die('No direct access allowed');

/*
do_bootstrap($possible_options_array, $connect = true) # Return a WP_Error object if something goes wrong
do_upload($file) # Return true/false
do_listfiles($match)
do_delete($file) - return true/false
do_download($file, $fullpath, $start_offset) - return true/false
do_config_print()
do_config_javascript()
do_credentials_test_parameters() - return an array: keys = required _POST parameters; values = description of each
do_credentials_test($testfile) - return true/false
do_credentials_test_deletefile($testfile)
*/

if (!class_exists('UpdraftPlus_RemoteStorage_Addons_Base')) require_once(UPDRAFTPLUS_DIR.'/methods/addon-base.php');

class UpdraftPlus_Addons_RemoteStorage_copycom extends UpdraftPlus_RemoteStorage_Addons_Base {

	private $copy_rest_url = 'https://api.copy.com';

	# Copy.Com actually will store using these chunks internally
	private $chunk_size = 2097152;

	public function __construct() {
		# 3rd parameter: chunking? 4th: Test button?
		parent::__construct('copycom', 'Copy.Com', true, false);
		add_filter('updraft_copycom_action_auth', array($this, 'action_auth'));
		if (defined('UPDRAFTPLUS_UPLOAD_CHUNKSIZE') && UPDRAFTPLUS_UPLOAD_CHUNKSIZE>0) $this->chunk_size = UPDRAFTPLUS_UPLOAD_CHUNKSIZE;
	}

	public function do_upload($file, $from) {

		global $updraftplus;

		$message = "Copy.Com user/profile did not return the expected data";

		# Note: the Copy binary API can cope with already-sent parts; the only purpose of us doing our own tracking is to prevent many HTTP round-trips if the entity being uploaded is large.
		$parts = $updraftplus->jobdata_get('copycres_'.md5($file));
		$this->parts = (empty($parts) || !is_array($parts)) ? array() : $parts;
		$this->next_partno = count($this->parts);
		if ($this->next_partno > 0) $updraftplus->log($this->description.": Some chunks have already been uploaded; next chunk number is: ".(string)($this->next_partno+1));

		$uploaded_size = $this->next_partno * $this->chunk_size;

		try {
			$profile = $this->storage->get('rest/user');
		} catch (Exception $e) {
			$profile = $e->getMessage().' ('.get_class($e).') (line: '.$e->getLine().', file: '.$e->getFile().')';
		}

		if (!is_string($profile) || (null === ($prof = json_decode($profile)))) {
			$message .= ": ".serialize($profile);
		} elseif (is_object($prof) && is_object($prof->storage)) {
			
			try {
				if (!empty($prof->storage)) {

					$quota_info = $prof->storage;
					$total_quota = max($quota_info->quota, 0);
					$used_quota = $quota_info->used;
					$available_quota = ($total_quota > -1 ) ? $total_quota - $used_quota : PHP_INT_MAX;
					$used_perc = ($total_quota > 0) ? round($used_quota*100/$total_quota, 1) : 0;

					$message = sprintf('Your %s quota usage: %s %% used, %s available', 'Copy.Com', $used_perc, round($available_quota/1048576, 1).' Mb');
				}
				// We don't actually abort now - there's no harm in letting it try and then fail
				$filesize = filesize($from);

				if (isset($available_quota) && $available_quota != -1 && $available_quota < $filesize-$uploaded_size) {
					$updraftplus->log("File upload expected to fail: file data remaining to upload ($file) size is ".($filesize-$uploaded_size)." b (overall file size; $filesize b), whereas available quota is only $available_quota b");
					$updraftplus->log(sprintf(__("Account full: your %s account has only %d bytes left, but the file to be uploaded has %d bytes remaining (total size: %d bytes)",'updraftplus'), 'Copy.Com', $available_quota, $filesize-$uploaded_size, $filesize), 'error');
				}

			} catch (Exception $e) {
				$message .= " ".get_class($e).": ".$e->getMessage();
			}

		}
		$updraftplus->log($message);

		$this->folder = (empty($this->options['folder'])) ? '' : untrailingslashit($this->options['folder']);
		if (substr($this->folder, 0, 1) == '/') $this->folder = substr($this->folder, 1);

		# Does the folder exist?
		# The copy.com documentation says that all but the last element needs to exist. Testing shows otherwise.
		if ($this->folder) $finddir = $this->storage->post('rest/files/'.$this->folder.'?overwrite=true');

		$this->oos_msg_logged = false;

		# We send 0 for the uploaded_size parameter, as we handle already-uploaded chunks later, and also copy.com can copy with re-sends; but in fact, the method hardly uses the parameter in any case
		return $updraftplus->chunked_upload($this, $file, $this->method."://".$this->folder."/".$file, $this->description, $this->chunk_size, 0, true);

	}

	public function chunked_upload($file, $fp, $i, $upload_size, $upload_start, $upload_end) {
		global $updraftplus;

		# $i (chunk number) starts from 1, whereas part numbers are from 0
		if (isset($this->parts[$i-1])) {
			// Already uploaded
			// In fact, we could still do the upload, as the remote end is happy with that (it uses fingerprints to avoid duplication); but we prefer to avoid the HTTP round trips
			// Returning 1 rather than true prevents unnecessary logging
			return 1;
		}

		if ($i != $this->next_partno + 1 && !isset($this->parts[$this->next_partno]) && !$this->oos_msg_logged) {
			$updraftplus->log("Out-of-sequence chunk number received ($i): expecting ".($this->next_partno+1));
			$this->oos_msg_logged = true;
		}

		$updraftplus->log($this->description.": Chunk $i ($upload_start - $upload_end): begin upload");

		try {
			$data = fread($fp, $upload_size);
			$part = $this->storage->sendData($data);
			$this->parts[$i-1] = $part;
			$this->next_partno = $i;
			$updraftplus->jobdata_set('copycres_'.md5($file), $this->parts);
		} catch (Exception $e) {
			$updraftplus->log($this->description." chunk upload: error: ($file / $i) (".$e->getMessage().") (line: ".$e->getLine().', file: '.$e->getFile().')');
			return false;
		}
		return true;
	}

	public function chunked_upload_finish($file) {
		$path = ($this->folder) ? '/'.$this->folder.'/' : '/';
		return $this->storage->createFile($path.$file, $this->parts);
	}

	public function do_download($file, $fullpath, $start_offset) {

		global $updraftplus;

		$folder = (empty($this->options['folder'])) ? '/' : trailingslashit($this->options['folder']);

		$listpath = $this->storage->listPath($folder.$file, array("include_parts" => true));

		# Could we not just go straight to the GET?
		if (!is_array($listpath) || 1 != count($listpath)) {
			$updraftplus->log($folder.$file.": ".sprintf(__('The %s object was not found', 'updraftplus'), 'Copy.Com'), 'error');
			$updraftplus->log($folder.$file.": Not found at copy.com");
			return false;
		}

		$item = array_shift($listpath);

		if (!is_object($item) || !isset($item->size) || (!isset($item->parts) && (!isset($item->revisions) || !is_array($item->revisions)))) {
		}

		if (is_object($item) && isset($item->size) && (isset($item->parts) || (isset($item->revisions) && is_array($item->revisions)))) {
			if (isset($item->parts)) {
				$parts = $item->parts;
			} else {
				# We know that $item->revisions is an array
				foreach ($item->revisions as $rev) {
					if (!is_object($rev) || !isset($rev->latest) || !$rev->latest || !isset($rev->parts)) continue;
					$parts = $rev->parts;
				}
			}
		}

		if (!isset($parts)) {
			$updraftplus->log("Copy.Com: $file: Could not access the object");
			$updraftplus->log(sprintf(__('The %s object was not found', 'updraftplus'), 'Copy.Com'), 'error');
			return false;
		}

		return $updraftplus->chunked_download($file, $this, $item->size, true, array($folder, $parts));
	}

	public function chunked_download($file, $headers, $data) {
		global $updraftplus;
		$folder = $data[0];
		if ('/' == substr($folder, 0, 1)) $folder=substr($folder,1);

		$parts = $data[1];
		$start = 0;

		if (is_array($headers) && !empty($headers['Range']) && preg_match('/bytes=(\d+)-(\d+)$/', $headers['Range'], $matches)) {
			$start = $matches[1];
		}

		$seek = 0;
		foreach ($parts as $part) {
			if ($start >= $part->offset && $start<$part->offset+$part->size) {
				# This is our chunk
				if ($start > $part->offset) {
					$updraftplus->log("Available part (".$part->offset.") does not align with current download ($start); will prune data.");
					return substr($this->storage->getPart($part->fingerprint, $part->size), $start - $part->offset);
					
				}
				return $this->storage->getPart($part->fingerprint, $part->size);
			}
		}

		$updraftplus->log("Copy.Com: Range request could not be satisfied ($start)");
		return false;
	}

	public function do_delete($file) {
		$folder = (empty($this->options['folder'])) ? '' : untrailingslashit($this->options['folder']);
		if ($folder && '/' != substr($folder, 0, 1)) $folder = '/'.$folder;
		return $this->storage->removeFile($folder.'/'.$file);
	}

	public function do_listfiles($match = 'backup_') {
		
		$path = (empty($this->options['folder'])) ? '/' : trailingslashit($this->options['folder']);
		if (substr($path, 0, 1) == '/' && '/' != $path) $path = substr($path, 1);

		$items = $this->storage->listPath($path, array("include_parts" => false));
		if (!is_array($items)) return array();

		$results = array();

		foreach ($items as $item) {
			if (!is_object($item) || empty($item->path)) continue;
			$parsed_path = (substr($item->path, 0, 1) == '/') ? substr($item->path, 1) : $item->path;
			if ('/' != $path && strtolower(substr($parsed_path, 0, strlen($path))) != strtolower($path)) continue;
			$name = ('/' == $path ) ? $parsed_path : substr($parsed_path, strlen($path));
			if (!$match || 0 === strpos($name, $match)) {
				$res = array('name' => $name);
				if (isset($item->size)) $res['size'] = (int)$item->size;
				$results[] = $res;
			}
		}

		return $results;

	}

	public function do_bootstrap($opts, $connect = true) {

		if (!class_exists('ComposerAutoloaderInit184d22c7bc4be57cf693b6ee20677d34')) require_once(UPDRAFTPLUS_DIR.'/copy/autoload.php');

		global $updraftplus;
		$ssl_disableverify = $updraftplus->get_job_option('updraft_ssl_disableverify');
		$ssl_useservercerts = $updraftplus->get_job_option('updraft_ssl_useservercerts');

		try {
			# Check settings exist
			if (empty($opts['clientid']) || empty($opts['secret'])) throw new Exception(sprintf(__('You have not yet configured and saved your %s credentials', 'updraftplus'), 'Copy.Com'));
			# Check authentication
			if ($connect && (empty($opts['token']) || empty($opts['tokensecret']))) throw new Exception(sprintf(__('You do not appear to be authenticated with %s','updraftplus'), 'Copy.Com'));

			if (empty($opts['token'])) {
				$token = '';
				$tokensecret = '';
			} else {
				$token = $opts['token'];
				$tokensecret = empty($opts['tokensecret']) ? '' : $opts['tokensecret'];
			}

			$copy = new UpdraftPlus_CopyCom_API_WordPress(
				$opts['clientid'], $opts['secret'], $token, $tokensecret,
				false,
				array('disableverify' => $ssl_disableverify, 'useservercerts' => $ssl_useservercerts)
			);
		} catch (Exception $e) {
			return new WP_Error('no_bootstrap', "Copy.Com error: ".$e->getMessage().' ('.get_class($e).') (line: '.$e->getLine().', file: '.$e->getFile().')');
		}

		return $copy;
	}

	protected function options_exist($opts) {
		if (is_array($opts) && !empty($opts['clientid']) && !empty($opts['secret']) && !empty($opts['token'])) return true;
		return false;
	}

	public function action_auth() {
		# That then sends us abck to something like:
		# options-general.php?action=updraftmethod-copycom-auth&updraftcopycomparms=?oauth_token=(etc)&oauth_verifier=(etc)

		global $updraftplus;
		$this->options = $this->get_opts();

		# Some weird things get sent back - not sure if it's the webserver or Copy that mangles it...
		$oauth_token = false;
		if (is_array($_REQUEST)) {
			foreach ($_REQUEST as $k => $v) {
				if ($p = (false !== strpos($k, '?oauth_token'))) {
					$oauth_token = $v;
				}
			}
		}

		if (isset($_REQUEST['oauth_verifier']) && (isset($_REQUEST['oauth_token']) || false !== $oauth_token || isset($_REQUEST['updraftcopycomparms']))) {
			# This should already be set from when we obtained the request token
			if (empty($this->options['tokensecret'])) {
				return $updraftplus->log('Missing request tokensecret ('.serialize($_REQUEST).')', 'error');
			}
			# Copy.Com is a bit dumb in how it handles URL parameters
			if (!empty($_REQUEST['oauth_token'])) {
				$token = $_REQUEST['oauth_token'];
			} elseif (false !== $oauth_token) {
				$token = $oauth_token;
			} else {
				parse_str($_REQUEST['updraftcopycomparms'], $parsed);
				$token = (!empty($parsed['?oauth_token'])) ? $parsed['?oauth_token'] : $parsed['oauth_token'];
			}

			if (empty($token)) {
				return $updraftplus->log('Could not process the returned data: '.serialize($_REQUEST), 'error');
			}

			# "3: 3RD PARTY asks COPY API for an ACCESS TOKEN" - https://developers.copy.com/documentation - which finally gives us back a token and a token secret
			$this->options['token'] = $token;

			# false: we don't yet have the tokensecret
			$this->storage = false;
			$this->storage = $this->bootstrap($this->options, true);
			if (is_wp_error($this->storage)) return $updraftplus->log_wp_error($this->storage, false, true);

			# Re-bootstrap - ?
			# Use $token;

			$get_access_token_request = $this->storage->get('oauth/access', array(
				'oauth_verifier' => $_REQUEST['oauth_verifier']
			));

			parse_str($get_access_token_request, $access_tokens);
			
			if (empty($access_tokens['oauth_token']) || empty($access_tokens['oauth_token_secret'])) {
				return $updraftplus->log('Could not process the returned token data: '.serialize($access_tokens), 'error');
			}

			if ($token) {
				$this->token = $token;
				$this->options['token'] = $access_tokens['oauth_token'];
				$this->options['tokensecret'] = $access_tokens['oauth_token_secret'];
				UpdraftPlus_Options::update_updraft_option('updraft_copycom', $this->options);
				# Get the new storage object using our new tokens
				$this->storage = false;
				$this->storage = $this->bootstrap($this->options, true);
				if (!is_wp_error($this->storage)) add_action('all_admin_notices', array($this, 'show_authed_admin_warning'));
			}

		} elseif (isset($_GET['updraftplus_copycomauth'])) {

			// Clear out the existing credentials
			if ('doit' == $_GET['updraftplus_copycomauth']) {
				unset($this->options['ownername']);
				unset($this->options['token']);
				unset($this->options['tokensecret']);
				UpdraftPlus_Options::update_updraft_option('updraft_copycom', $this->options);
			}

			$this->storage = false;
			$this->storage = $this->bootstrap($this->options, false);
			if (is_wp_error($this->storage)) return $updraftplus->log_wp_error($this->storage, false, true);

			try {
				$this->auth_request();
			} catch (Exception $e) {
				global $updraftplus;
				$updraftplus->log(sprintf(__("%s error: %s", 'updraftplus'), sprintf(__("%s authentication", 'updraftplus'), 'Copy.Com'), $e->getMessage()), 'error');
			}
		}
	}

	public function show_authed_admin_warning() {
		global $updraftplus_admin, $updraftplus;

		if (empty($this->options['token']) || empty($this->options['tokensecret'])) return false;

		$message = "<strong>".__('Success:', 'updraftplus').'</strong> '.sprintf(__('you have authenticated your %s account', 'updraftplus'),'Copy');
		# We log, because otherwise people get confused by the most recent log message and raise support requests
		$updraftplus->log(__('Success:', 'updraftplus').' '.sprintf(__('you have authenticated your %s account', 'updraftplus'),'Copy'));

		try {
			$profile = $this->storage->get('rest/user');
		} catch (Exception $e) {
			$profile = $e->getMessage().' ('.get_class($e).') (line: '.$e->getLine().', file: '.$e->getFile().')';
		}

		if (!is_string($profile) || (null === ($prof = json_decode($profile)))) {
			$message .= " (".__('though part of the returned information was not as expected - your mileage may vary','updraftplus').") - ".serialize($profile);
		} elseif (is_object($prof) && is_object($prof->storage)) {
			
			try {
				if (!empty($prof->first_name) && !empty($prof->last_name)) {
					$this->options['ownername'] = $prof->first_name.' '.$prof->last_name;
					UpdraftPlus_Options::update_updraft_option('updraft_copycom', $this->options);

					$message .= ". <br>".sprintf(__('Your %s account name: %s','updraftplus'), 'Copy.Com', htmlspecialchars($this->options['ownername']));

					$quota_info = $prof->storage;
					$total_quota = max($quota_info->quota, 0);
					$used_quota = $quota_info->used;
					$available_quota = ($total_quota > -1 ) ? $total_quota - $used_quota : PHP_INT_MAX;
					$used_perc = ($total_quota > 0) ? round($used_quota*100/$total_quota, 1) : 0;
					$message .= ' <br>'.sprintf(__('Your %s quota usage: %s %% used, %s available','updraftplus'), 'Copy.Com', $used_perc, round($available_quota/1048576, 1).' Mb');

				}
			} catch (Exception $e) {
				#$updraftplus->log( $e->getMessage().' ('.get_class($e).') (line: '.$e->getLine().', file: '.$e->getFile().')');
			}

		}

		$updraftplus_admin->show_admin_warning($message);

	}

	/*
	{
	"profile": {
	"read": true,
	"write": true,
	"email": {
		"read": true
	}
	},
	"inbox": {
	"read": true
	},
	"links": {
	"read": true,
	"write": true
	},
	"filesystem": {
	"read": true,
	"write": true
	}
	}
	*/

	private function get_copycom_perms() {
		return json_encode(array(
			'profile' => array('read' => true),
			'filesystem' => array('read' => true, 'write' => true)
		));
	}

	private function auth_request() {

		# &updraftcopycomparms=, because copy.com is dumb and always appends '?param=value' regardless of the supplied format...
		# i.e. we get sent back to somewhere like:
		# options-general.php?action=updraftmethod-copycom-auth&updraftcopycomparms=?oauth_token=(etc)&oauth_verifier=(etc)
		$callback_url = UpdraftPlus_Options::admin_page_url().'?action=updraftmethod-copycom-auth&updraftcopycomparms=';

		$get_request = $this->storage->get('oauth/request?scope='.$this->get_copycom_perms().'&oauth_callback='.urlencode($callback_url));

		if (!is_string($get_request)) throw new Exception('Unexpected HTTP result returned ('.serialize($get_request).')');

		parse_str($get_request, $result);

		# Also, there's oauth_callback_confirmed - not sure it's any use (it should be 'true')
		if (empty($result['oauth_token']) || empty($result['oauth_token_secret'])) {
			throw new Exception('Unexpected HTTP result returned ('.serialize($get_request).')');
		}

		# We will need this. But don't set token yet, as that is taken to indicate that all is finished
		$this->options['tokensecret'] = $result['oauth_token_secret'];
		UpdraftPlus_Options::update_updraft_option('updraft_copycom', $this->options);

		# Next: request an authorize screen

		#$auth_request = $this->storage->get('applications/authorize');

		# N.B. It's www.copy.com - not the api_url in the storage
		$authurl = 'https://www.copy.com/applications/authorize?oauth_token='.urlencode($result['oauth_token']);

		# = wp_remote_get($this->storage->api_url.'?oauth_token='.urlencode($result['oauth_token']));
		#if (is_wp_error($auth_request))  { global $updraftplus; return $updraftplus->log_wp_error($auth_request, false, true); }

		if (!headers_sent()) {
			header('Location: '.$authurl);
			exit;
		} else {
			throw new Exception(sprintf(__('The %s authentication could not go ahead, because something else on your site is breaking it. Try disabling your other plugins and switching to a default theme. (Specifically, you are looking for the component that sends output (most likely PHP warnings/errors) before the page begins. Turning off any debugging settings may also help).', 'updraftplus'), 'Copy.Com'));
		}

	}

	private function api_keys($opts) {
		if (defined('UPDRAFTPLUS_COPYCOM_CUSTOMKEYS') && true == UPDRAFTPLUS_COPYCOM_CUSTOMKEYS) {
			$clientid = (empty($this->options['clientid'])) ? '' : $this->options['clientid'];
			$secret = (empty($this->options['secret'])) ? '' : $this->options['secret'];
			return array($clientid, $secret);
		} else {
			return array(
				'MLFsHYJBXMlgcK4t6ZGn5sGKhvKGbYlr', 'PvjiddOeEs67J7dVImqcczLGVEXGbV79gR8FTcnKZpUy2ytb'
			);
		}
	}

	public function do_config_print($opts) {
		global $updraftplus_admin;

		$folder = (empty($opts['folder'])) ? '' : untrailingslashit($opts['folder']);

		$apikey_text = (defined('UPDRAFTPLUS_COPYCOM_CUSTOMKEYS') && true == UPDRAFTPLUS_COPYCOM_CUSTOMKEYS) ? '<br><a href="https://www.copy.com/developer/">'.sprintf(__('To get your credentials, log in at the %s developer portal.', 'updraftplus'), 'Copy.Com').'</a>' : '';
			' '.__("After logging in, create a sandbox app. You can leave all of the questions for creating an app blank (except for the app's name).", 'updraftplus');

		$updraftplus_admin->storagemethod_row(
			'copycom',
			'',
			'<img alt="Copy.Com" src="'.UPDRAFTPLUS_URL.'/images/copycom.png">'.$apikey_text
		);

		list($clientid, $secret) = $this->api_keys($opts);

		if (defined('UPDRAFTPLUS_COPYCOM_CUSTOMKEYS') && true == UPDRAFTPLUS_COPYCOM_CUSTOMKEYS) {
			$updraftplus_admin->storagemethod_row(
				'copycom',
				'Copy '.__('API Key', 'updraftplus'),
				'<input type="text" style="width:442px" name="updraft_copycom[clientid]" value="'.esc_attr($clientid).'">'
			);
			$updraftplus_admin->storagemethod_row(
				'copycom',
				'Copy '.__('API Secret', 'updraftplus'),
				'<input type="'.apply_filters('updraftplus_admin_secret_field_type', 'password').'" style="width:442px" name="updraft_copycom[secret]" value="'.esc_attr($secret).'">'
			);
		} else {
			echo '<input type="hidden" style="width:442px" name="updraft_copycom[clientid]" value="'.esc_attr($clientid).'">';
			echo '<input type="hidden" style="width:442px" name="updraft_copycom[secret]" value="'.esc_attr($secret).'">';
		}

		$updraftplus_admin->storagemethod_row(
			'copycom',
			'Copy.Com '.__('Folder', 'updraftplus').' '.__('(case-sensitive)', 'updraftplus'),
			'<input title="'.esc_attr(sprintf(__('Enter the path of the %s folder you wish to use here.', 'updraftplus'), 'Copy').' '.__('If the folder does not already exist, then it will be created.').' '.sprintf(__('e.g. %s', 'updraftplus'), 'MyBackups/WorkWebsite.').' '.sprintf(__('If you leave it blank, then the backup will be placed in the root of your %s', 'updraftplus'), 'Copy.Com account').' '.sprintf(__('N.B. Copy is case-sensitive.', 'updraftplus'), 'Copy')).'" type="text" style="width:442px" name="updraft_copycom[folder]" value="'.esc_attr($folder).'">'
		);

		$updraftplus_admin->storagemethod_row(
			'copycom', 
			sprintf(__('Authenticate with %s', 'updraftplus'), 'Copy.Com').':',
			'<p>'.(!empty($opts['token']) ? "<strong>".__('(You appear to be already authenticated).', 'updraftplus').'</strong>' : '').
			((!empty($opts['token']) && !empty($opts['ownername'])) ? ' '.sprintf(__("Account holder's name: %s.", 'updraftplus'), htmlspecialchars($opts['ownername'])).' ' : '').
			'</p><p><a href="?page=updraftplus&action=updraftmethod-copycom-auth&updraftplus_copycomauth=doit">'.sprintf(__('<strong>After</strong> you have saved your settings (by clicking \'Save Changes\' below), then come back here once and click this link to complete authentication with %s.','updraftplus'), 'Copy.Com').'</a></p>'
		);
		# Not explicitly required: we use wp_remote_get|post(), and the API only requires basic GET/POST functionality
		# .$updraftplus_admin->curl_check('Copy.Com', false, 'copycom', false)
	}

}

$updraftplus_addons_copycom = new UpdraftPlus_Addons_RemoteStorage_copycom;
