<?php

/*
This class provides methods for encrypting, sending, receiving and decrypting messages of arbitrary length, using standard encryption methods and including protection against replay attacks

Example:

// Set a key and encrypt with it
$ud_rpc = new UpdraftPlus_Remote_Communications($name_indicator); // $name_indicator is a key indicator - indicating which key is being used.
$ud_rpc->set_key_local($key);
$encrypted = $ud_rpc->encrypt_message('blah blah');

// Use the saved WP site option
$ud_rpc = new UpdraftPlus_Remote_Communications($name_indicator); // $name_indicator is a key indicator - indicating which key is being used.
$ud_rpc->set_option_name('udrpc_localkey');
if (!$ud_rpc->get_key_local()) throw new Exception('...');
$encrypted = $ud_rpc->encrypt_message('blah blah');

// Generate a new key
$ud_rpc = new UpdraftPlus_Remote_Communications('myindicator.example.com');
$ud_rpc->set_option_name('udrpc_localkey'); // Save as a WP site option
$new_pair = $ud_rpc->generate_new_keypair();
if ($new_pair) {
	$local_key = $ud_rpc->get_key_local();
	$remote_key = $ud_rpc->get_key_remote();
	// ...
} else {
	throw new Exception('...');
}

// Send a message
$ud_rpc->activate_replay_protection();
$ud_rpc->set_destination_url('https://example.com/path/to/wp');
$ud_rpc->send_message('ping');
$ud_rpc->send_message('somecommand', array('param1' => 'data', 'param2' => 'moredata'));

// N.B. The data sent needs to be something that will pass json_encode(). So, it may be desirable to base64-encode it first.

// Create a listener for incoming messages

add_filter('udrpc_command_somecommand', 'my_function', 10, 3);
// function my_function($response, $data, $name_indicator) { ... ; return array('response' => 'my_reply', 'data' => 'any mixed data'); }
// Or:
// add_filter('udrpc_action', 'some_function', 10, 4); // Function must return something other than false to indicate that it handled the specific command. Any returned value will be sent as the reply.
// function some_function($response, $command, $data, $name_indicator) { ...; return array('response' => 'my_reply', 'data' => 'any mixed data'); }
$ud_rpc->set_option_name('udrpc_localkey');
$ud_rpc->activate_replay_protection();
if ($ud_rpc->get_key_local()) {
	// Make sure you call this before the wp_loaded action is fired (e.g. at init)
	$ud_rpc->create_listener();
}

*/

if (!class_exists('UpdraftPlus_Remote_Communications')):
class UpdraftPlus_Remote_Communications {

	private $key_name_indicator;

	private $key_option_name = false;
	private $key_remote = false;
	private $key_local = false;
	
	private $can_generate = false;

	private $destination_url = false;

	private $maximum_replay_time_difference = 300;
	private $extra_replay_protection = false;

	public function __construct($key_name_indicator = 'default', $can_generate = false) {
		$this->set_key_name_indicator($key_name_indicator);
	}

	public function set_key_name_indicator($key_name_indicator) {
		$this->key_name_indicator = $key_name_indicator;
	}

	public function set_can_generate($can_generate = true) {
		$this->can_generate = $can_generate;
	}

	public function set_maximum_replay_time_difference($replay_time_difference) {
		$this->maximum_replay_time_difference = (int)$replay_time_difference;
	}

	private function ensure_crypto_loaded() {
		if (!class_exists('Crypt_Rijndael') || !class_exists('Crypt_RSA')) {
			global $updraftplus;
			// phpseclib 1.x uses deprecated PHP4-styler constructors
			$this->no_deprecation_warnings_on_php7();
			if (is_a($updraftplus, 'UpdraftPlus')) {
				$updraftplus->ensure_phpseclib(array('Crypt_Rijndael', 'Crypt_RSA'), array('Crypt/Rijndael', 'Crypt/RSA'));
			} elseif (defined('UPDRAFTPLUS_DIR') && file_exists(UPDRAFTPLUS_DIR.'/includes/phpseclib')) {
				if (false === strpos(get_include_path(), UPDRAFTPLUS_DIR.'/includes/phpseclib')) set_include_path(get_include_path().PATH_SEPARATOR.UPDRAFTPLUS_DIR.'/includes/phpseclib');
				if (!class_exists('Crypt_Rijndael')) require_once('Crypt/Rijndael.php');
				if (!class_exists('Crypt_RSA')) require_once('Crypt/RSA.php');
			} elseif (file_exists(dirname(__DIR__).'/vendor/phpseclib')) {
				$pdir = dirname(__DIR__).'/vendor/phpseclib';
				if (false === strpos(get_include_path(), $pdir)) set_include_path(get_include_path().PATH_SEPARATOR.$pdir);
				if (!class_exists('Crypt_Rijndael')) require_once('Crypt/Rijndael.php');
				if (!class_exists('Crypt_RSA')) require_once('Crypt/RSA.php');
			}
		}
	}

	// Ugly, but necessary to prevent debug output breaking the conversation when the user has debug turned on
	private function no_deprecation_warnings_on_php7() {
		// PHP_MAJOR_VERSION is defined in PHP 5.2.7+
		// We don't test for PHP > 7 because the specific deprecated element will be removed in PHP 8 - and so no warning should come anyway (and we shouldn't suppress other stuff until we know we need to).
		if (defined('PHP_MAJOR_VERSION') && PHP_MAJOR_VERSION == 7) {
			$old_level = error_reporting();
			$new_level = $old_level & ~E_DEPRECATED;
			if ($old_level != $new_level) error_reporting($new_level);
		}
	}

	public function set_destination_url($destination_url) {
		$this->destination_url = $destination_url;
	}

	public function set_option_name($key_option_name) {
		$this->key_option_name = $key_option_name;
	}

	// Method to get the remote key
	public function get_key_remote() {
		if (empty($this->key_remote) && $this->can_generate) {
			$this->generate_new_keypair();
		}
		return empty($this->key_remote) ? false : $this->key_remote;
	}

	// Set the remote key
	public function set_key_remote($key_remote) {
		$this->key_remote = $key_remote;
	}

	// Method to get the local key
	public function get_key_local() {
		if (empty($this->key_local)) {
			if ($this->key_option_name) {
				$key_local = get_site_option($this->key_option_name);
				if ($key_local) {
					$this->key_local = $key_local;
				}
			}
		}
		if (empty($this->key_local) && $this->can_generate) {
			$this->generate_new_keypair();
		}
		return empty($this->key_local) ? false : $this->key_local;
	}

	// Tests whether a supplied string (after trimming) is a valid portable bundle
	// Valid formats: same as get_portable_bundle()
	// Returns: (array)an array (which the consumer is free to use - e.g. convert into internationalised string), with keys 'code' and (perhaps) 'data'
	// Error codes: 'invalid_wrong_length'|'invalid_corrupt'
	// Success codes: 'success' - then has further keys 'key', 'name_indicator' and 'url' (and anything else that was in the bundle)
	public function decode_portable_bundle($bundle, $format = 'raw') {
		$bundle = trim($bundle);
		if ('base64_with_count' == $format) {
			if (strlen($bundle) < 5) return array('code' => 'invalid_wrong_length', 'data' => 'too_short');
			$len = substr($bundle, 0, 4);
			$bundle = substr($bundle, 4);
			$len = hexdec($len);
			if (strlen($bundle) != $len) return array('code' => 'invalid_wrong_length', 'data' => "1,$len,".strlen($bundle));
			if (false === ($bundle = base64_decode($bundle))) return array('code' => 'invalid_corrupt', 'data' => 'not_base64');
			if (null === ($bundle = json_decode($bundle, true))) return array('code' => 'invalid_corrupt', 'data' => 'not_json');
		}
		if (empty($bundle['key'])) return array('code' => 'invalid_corrupt', 'data' => 'no_key');
		if (empty($bundle['url'])) return array('code' => 'invalid_corrupt', 'data' => 'no_url');
		if (empty($bundle['name_indicator'])) return array('code' => 'invalid_corrupt', 'data' => 'no_name_indicator');
		return $bundle;
	}

	// Method to get a portable bundle sufficient to contact this site (i.e. remote site - so you need to have generated a key-pair, or stored the remote key somewhere and restored it)
	// Supported formats: base64_with_count | (default)raw
	public function get_portable_bundle($format = 'raw') {
		$site_url = trailingslashit(network_site_url());
		$bundle = array(
			'key' => $this->get_key_remote(),
			'name_indicator' => $this->key_name_indicator,
			'url' => $site_url,
		);

		if ('base64_with_count' == $format) {
			$bundle = base64_encode(json_encode($bundle));

			$len = strlen($bundle); // Get the length
			$len = dechex($len); // The first bytes of the message are the bundle length
			$len = str_pad($len, 4, '0', STR_PAD_LEFT); // Zero pad

			return $len.$bundle;

		} else {
			return $bundle;
		}

	}

	public function set_key_local($key_local) {
		$this->key_local = $key_local;
		if ($this->key_option_name) update_site_option($this->key_option_name, $this->key_local);
	}

	public function generate_new_keypair() {

		$this->ensure_crypto_loaded();

		$rsa = new Crypt_RSA();
		$keys = $rsa->createKey(2048);

		if (empty($keys['privatekey'])) {
			$this->set_key_local(false);
		} else {
			$this->set_key_local($keys['privatekey']);
		}

		if (empty($keys['publickey'])) {
			$this->set_key_remote(false);
		} else {
			$this->set_key_remote($keys['publickey']);
		}

		return empty($keys['publickey']) ? false : true;
	}

	// Encrypt the message, using the local key (which needs to exist)
	public function encrypt_message($plaintext, $use_key = false, $key_length=150) {

		if (!$use_key && !$this->key_local) throw new Exception('No encryption key has been set');

		if (!$use_key) $use_key = $this->key_local;

		$this->ensure_crypto_loaded();

		$rsa = new Crypt_RSA();
		$rij = new Crypt_Rijndael(); 

		// Generate Random Symmetric Key
		$sym_key = crypt_random_string($key_length); 

		// Encrypt Message with new Symmetric Key                  
		$rij->setKey($sym_key);
		$ciphertext = $rij->encrypt($plaintext);
		$ciphertext = base64_encode($ciphertext); 

		// Encrypted the Symmetric Key with the Asymmetric Key            
		$rsa->loadKey($use_key);
		$sym_key = $rsa->encrypt($sym_key);

		// Base 64 encode the symmetric key for transport
		$sym_key = base64_encode($sym_key);

		$len = str_pad(dechex(strlen($sym_key)), 3, '0', STR_PAD_LEFT); // Zero pad to be sure.

		// 16 characters of hex is enough for the payload to be to 16 exabytes (giga < tera < peta < exa) of data
		$cipherlen = str_pad(dechex(strlen($ciphertext)), 16, '0', STR_PAD_LEFT);

		// Concatenate the length, the encrypted symmetric key, and the message
		return $len.$sym_key.$cipherlen.$ciphertext;

	}

	// Decrypt the message, using the local key (which needs to exist)
	public function decrypt_message($message) {
		
		if (!$this->key_local) throw new Exception('No decryption key has been set');

		$this->ensure_crypto_loaded();

		$rsa = new Crypt_RSA();
		$rij = new Crypt_Rijndael();
		
		// Extract the Symmetric Key
		$len = substr($message, 0, 3);
		$len = hexdec($len);
		$sym_key = substr($message, 3, $len);

		// Extract the encrypted message
		$cipherlen = substr($message, $len+3, 16);
		$cipherlen = hexdec($cipherlen);

		$ciphertext = substr($message, $len+19, $cipherlen);
		$ciphertext = base64_decode($ciphertext);
			
		// Decrypt the encrypted symmetric key 
		$rsa->loadKey($this->key_local);
		$sym_key = base64_decode($sym_key);
		$sym_key = $rsa->decrypt($sym_key);
		
		// Decrypt the message
		$rij->setKey($sym_key);                       
		return $rij->decrypt($ciphertext);

	}

	// Returns an array - which the caller will then format as required (e.g. use as body in post, or JSON-encode, etc.)
	private function create_message($command, $data = null, $is_response = false, $use_key = false) {

		if ($is_response) {
			$send_array = array('response' => $command);
		} else {
			$send_array = array('command' => $command);
		}

		$send_array['time'] = time();
		// This goes in the encrypted portion as well to prevent replays with a different unencrypted name indicator
		$send_array['key_name'] = $this->key_name_indicator;

		// This random element means that if the site needs to send two identical commands or responses in the same second, then it can, and still use replay protection
		$send_array['rand'] = rand(0, PHP_INT_MAX);

		if (null !== $data) $send_array['data'] = $data;
		$send_data = $this->encrypt_message(json_encode($send_array), $use_key);

		$message = array(
			'format' => 1,
			'key_name' => $this->key_name_indicator,
			'udrpc_message' => $send_data
		);

		return $message;

	}

	// N.B. There's already some time-based replay protection. This can be turned on to beef it up.
	// This is only for listeners. Replays can only be detection if transients are working on the WP site (which by default only means that the option table is working).
	public function activate_replay_protection($activate = true) {
		$this->extra_replay_protection = (bool)$activate;
	}

	public function send_message($command, $data = null, $timeout = 20) {

		if (empty($this->destination_url)) return new WP_Error('not_initialised', 'RPC error: URL not initialised');

		$message = $this->create_message($command, $data);

		$post = wp_remote_post(
			$this->destination_url,
			array(
				'timeout' => $timeout,
				'body' => $message
			)
		);

		if (is_wp_error($post)) return $post;

		if (empty($post['response']) || empty($post['response']['code'])) return new WP_Error('empty_http_code', 'Unexpected HTTP response code');

		if ($post['response']['code'] <200 || $post['response']['code']>=300) return new WP_Error('unexpected_http_code', 'Unexpected HTTP response code ('.$post['response']['code'].')', $post['response']['code']);

		if (empty($post['body'])) return new WP_Error('empty_response', 'Empty response from remote site');

		$decoded = json_decode((string)$post['body'], true);

		if (empty($decoded)) {
			error_log("UDRPC: response from remote site could not be understood: ".substr($post['body'], 0, 100).' ... ');
			return new WP_Error('response_not_understood', 'Response from remote site could not be understood', $post['body']);
		}

		if (!is_array($decoded) || empty($decoded['udrpc_message'])) return new WP_Error('response_not_understood', 'Response from remote site was not in the expected format ('.$post['body'].')', $decoded);

		$decoded = $this->decrypt_message($decoded['udrpc_message']);

		if (!is_string($decoded)) return new WP_Error('not_decrypted', 'Response from remote site was not successfully decrypted', $decoded['udrpc_message']);

		$json_decoded = json_decode($decoded, true);

		if (!is_array($json_decoded) || empty($json_decoded['response']) || empty($json_decoded['time']) || !is_numeric($json_decoded['time'])) return new WP_Error('response_corrupt', 'Response from remote site was not in the expected format', $decoded);

		// Don't do the reply detection until now, because $post['body'] may not be a message that originated from the remote component at all (e.g. an HTTP error)
		if ($this->extra_replay_protection) {
			$message_hash = $this->calculate_message_hash((string)$post['body']);
			if ($this->message_hash_seen($message_hash)) {
				return new WP_Error('replay_detected', 'Message refused: replay detected', $message_hash);
			}
		}

		$time_difference = absint(time() - $json_decoded['time']);
		if ($time_difference > $this->maximum_replay_time_difference) return array(
			'response' => 'error',
			'data' => array(
				'code' => 'window_error',
				'difference' => $time_difference,
				'maximum_difference' => $this->maximum_replay_time_difference
			)
		);

		// Should be an array with keys including 'response' and (if relevant) 'data'
		return $json_decoded;

	}

	// Returns a boolean indicating whether a listener was created - which depends on whether one was needed (so, false does not necessarily indicate an error condition)
	public function create_listener() {
		// Create the WP actions to handle incoming commands, handle built-in commands (e.g. ping, create_keys (authenticate with admin creds)), dispatch them to the right place, and die
		if (!empty($_POST) && !empty($_POST['udrpc_message']) && !empty($_POST['format'])) {
			add_action('wp_loaded', array($this, 'wp_loaded'));
			add_action('wp_loaded', array($this, 'wp_loaded_final'), 10000);
			return true;
		}
		return false;
	}

	public function wp_loaded_final() {
		error_log("UDRPC: Message was received, but not understood by local site");
		die;
	}

	public function wp_loaded() {

		// Silently return, rather than dying, in case another instance is able to handle this
		if ("1" != $_POST['format']) {
			return;
		}

		// Is this for us?
		if (empty($_POST['key_name']) || $_POST['key_name'] != $this->key_name_indicator) return;

		// wp_unslash() does not exist until after WP 3.5
// 		$udrpc_message = function_exists('wp_unslash') ? wp_unslash($_POST['udrpc_message']) : stripslashes_deep($_POST['udrpc_message']);
		
		// Data should not have any slashes - it is base64-encoded
		$udrpc_message = (string)$_POST['udrpc_message'];

		// Check this now, rather than allow the decrypt method to thrown an Exception
		if (empty($this->key_local)) {
			error_log("UDRPC: no local key: cannot decrypt");
			die;
		}

		try {
			$udrpc_message = $this->decrypt_message($udrpc_message);
		} catch (Exception $e) {
			error_log("UDRPC: exception (".get_class($e)."): ".$e->getMessage());
			die;
		}

		$udrpc_message = json_decode($udrpc_message, true);

		if (empty($udrpc_message) || !is_array($udrpc_message) || empty($udrpc_message['command']) || !is_string($udrpc_message['command'])) {
			error_log("UDRPC: could not decode JSON on incoming message");
			die;
		}

		if (empty($udrpc_message['time'])) {
			error_log("UDRPC: No time set in incoming message");
			die;
		}

		// Mismatch indicating a replay of the message with a different key name in the unencrypted portion?
		if (empty($udrpc_message['key_name']) || $_POST['key_name'] != $udrpc_message['key_name']) {
			error_log("UDRPC: key_name mismatch between encrypted and unencrypted portions");
			die;
		}

		if ($this->extra_replay_protection) {
			$message_hash = $this->calculate_message_hash((string)$_POST['udrpc_message']);
			if ($this->message_hash_seen($message_hash)) {
				error_log("UDRPC: Message dropped: apparently a replay (hash: $message_hash)");
				die;
			}
		}

		// Do this after the extra replay protection, as that checks hashes within the maximum time window - so don't check the maximum time window until afterwards, to avoid a tiny window (race) in between.
		$time_difference = absint($udrpc_message['time'] - time());
		if ($time_difference > $this->maximum_replay_time_difference) {
			error_log("UDRPC: Time in incoming message is outside of allowed window ($time_difference > ".$this->maximum_replay_time_difference.")");
			die;
		}

		$command = (string)$udrpc_message['command'];
		$data = empty($udrpc_message['data']) ? null : $udrpc_message['data'];

		if ('ping' == $command) {
			echo json_encode($this->create_message('pong', null, true));
		} else {
			if (has_filter('udrpc_command_'.$command)) {
				$command_action_hooked = true;
				$response = apply_filters('udrpc_command_'.$command, null, $data, $this->key_name_indicator);
			} else {
				$response = array('response' => 'no_such_command', 'data' => $command);
			}

			$response = apply_filters('udrpc_action', $response, $command, $data, $this->key_name_indicator);

			if (is_array($response)) {
				$data = isset($response['data']) ? $response['data'] : null;
				echo json_encode($this->create_message($response['response'], $data, true));
			}

		}

		die;

	}

	private function calculate_message_hash($message) {
		return hash('sha256', $message);
	}

	private function message_hash_seen($message_hash) {
		// 39 characters - less than the WP site transient name limit (40). Though, we use a normal transient, as these don't auto-load at all times.
		$transient_name = 'udrpch_'.md5($this->key_name_indicator);
		$seen_hashes = get_transient($transient_name);
		if (!is_array($seen_hashes)) $seen_hashes = array();
		$time_now = time();
// 		$any_changes = false;
		// Prune the old hashes
		foreach ($seen_hashes as $hash => $last_seen) {
			if ($last_seen < $time_now - $this->maximum_replay_time_difference) {
// 				$any_changes = true;
				unset($seen_hashes[$hash]);
			}
		}
		if (isset($seen_hashes[$message_hash])) {
			return true;
		}
		$seen_hashes[$message_hash] = $time_now;
		set_transient($transient_name, $seen_hashes, $this->maximum_replay_time_difference);
		return false;
	}

}
endif;