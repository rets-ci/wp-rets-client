<?php
/*
UpdraftPlus Addon: cloudfiles-enhanced:Rackspace Cloud Files, enhanced
Description: Adds enhanced capabilities for Rackspace Cloud Files users
Version: 1.3
RequiresPHP: 5.3.3
Shop: /shop/cloudfiles-enhanced/
Latest Change: 1.11.10
*/

# Future possibility: sub-folders

if (!defined('UPDRAFTPLUS_DIR')) die('No direct access allowed');

# The new Rackspace SDK is PHP 5.3.3 or later
if (version_compare(phpversion(), '5.3.3', '<')) return;
if (defined('UPDRAFTPLUS_CLOUDFILES_USEOLDSDK') && UPDRAFTPLUS_CLOUDFILES_USEOLDSDK == true) return;

use OpenCloud\Rackspace;

$updraftplus_addon_cloudfilesenhanced = new UpdraftPlus_Addon_CloudFilesEnhanced;

class UpdraftPlus_Addon_CloudFilesEnhanced {

	public function __construct() {
		$this->title = __('Rackspace Cloud Files, enhanced', 'updraftplus');
		$this->description = __('Adds enhanced capabilities for Rackspace Cloud Files users', 'updraftplus');
		add_action('updraftplus_settings_page_init', array($this, 'updraftplus_settings_page_init'));
		add_action('updraft_cloudfiles_newuser', array($this, 'newuser'));
	}

	public function updraftplus_settings_page_init() {
		add_action('admin_footer', array($this, 'admin_footer'));
		add_filter('updraft_cloudfiles_apikeysetting', array($this, 'apikeysettings'));
	}

	public function apikeysettings($msg) {
		$msg = '<a href="#" id="updraft_cloudfiles_newapiuser">'.__('Create a new API user with access to only this container (rather than your whole account)', 'updraftplus').'</a>';
		return $msg;
	}

	public function newuser() {
		if (empty($_POST['adminuser'])) {
			echo json_encode(array('e' => 1, 'm' => __('You need to enter an admin username', 'updraftplus')));
			return;
		}
		if (empty($_POST['adminapikey'])) {
			echo json_encode(array('e' => 1, 'm' => __('You need to enter an admin API key', 'updraftplus')));
			return;
		}
		if (empty($_POST['newuser'])) {
			echo json_encode(array('e' => 1, 'm' => __('You need to enter a new username', 'updraftplus')));
			return;
		}
		if (empty($_POST['container'])) {
			echo json_encode(array('e' => 1, 'm' => __('You need to enter a container', 'updraftplus')));
			return;
		}
		# Here, 0 == catches both 0 and false
		if (empty($_POST['newemail']) || 0 == strpos($_POST['newemail'], '@')) {
			echo json_encode(array('e' => 1, 'm' => __('You need to enter a valid new email address', 'updraftplus')));
			return;
		}
		if (empty($_POST['location'])) $_POST['location'] = 'us';
		if (empty($_POST['region'])) $_POST['region'] = 'DFW';


		require_once(UPDRAFTPLUS_DIR.'/methods/cloudfiles.php');
		require_once(UPDRAFTPLUS_DIR.'/oc/autoload.php');
		$method = new UpdraftPlus_BackupModule_cloudfiles;
		$useservercerts = !empty($_POST['useservercerts']);
		$disableverify = !empty($_POST['disableverify']);
		$auth_url = ('uk' == $_POST['location']) ? Rackspace::UK_IDENTITY_ENDPOINT : Rackspace::US_IDENTITY_ENDPOINT;

		try {
			$service = $method->get_service(array(
				'user' => $_POST['adminuser'],
				'apikey' => $_POST['adminapikey'],
				'authurl' => $auth_url,
				'region' => $_POST['region']
			),
			$useservercerts, $disableverify);
		} catch(AuthenticationError $e) {
			$updraftplus->log('Cloud Files authentication failed ('.$e->getMessage().')');
			$updraftplus->log(__('Cloud Files authentication failed', 'updraftplus').' ('.$e->getMessage().')', 'error');
			return false;
		} catch (Exception $e) {
			echo json_encode(array('e' => 1, 'm' => __('Error:', 'updraftplus').' '.$e->getMessage()));
			return false;
		}

		# Get the roles
// 		try {
// 			$roles = $method->client->get($auth_url.'OS-KSADM/roles')->send()->json();
// 			if (empty($roles) || !is_array($roles) || empty($roles['roles']) || !is_array($roles['roles'])) throw new Exception(sprintf(__('The response was not understood (%s)', 'updraftplus'),1));
// 			foreach ($roles['roles'] as $role) {
// 				if (!empty($role['name']) && 'observer' == $role['name'] && !empty($role['id'])) $role_id = $role['id'];
// 			}
// 			if (empty($role_id)) throw new Exception(sprintf(__('The response was not understood (%s)', 'updraftplus'), 2));
// 		} catch (Guzzle\Http\Exception\ClientErrorResponseException $e) {
// 			$response = $e->getResponse();
// 			$code = $response->getStatusCode();
// 			$reason = $response->getReasonPhrase();
// 			if (403 == $code) {
// 				echo json_encode(array('e' => 1, 'm' => __('Authorisation failed (check your credentials)', 'updraftplus')));
// 			} else {
// 				echo json_encode(array('e' => 1, 'm' => sprintf(__('Cloud Files operation failed (%s)', 'updraftplus'), 6)." (".$code.'/'.$reason.')'));
// 			}
// 			die;
// 		} catch (Exception $e) {
// 			echo json_encode(array('e' => 1, 'm' => __('Cloud Files authentication failed', 'updraftplus').' ('.get_class($e).', '.$e->getMessage().')'));
// 			die;
// 		}

		# Create the container (if necessary)
		# Get the container
		try {
			$container_object = $service->getContainer($_POST['container']);
		} catch(Guzzle\Http\Exception\ClientErrorResponseException $e) {
			$container_object = $service->createContainer($_POST['container']);
		} catch (Exception $e) {
			echo json_encode(array('e' => 1, 'm' => __('Cloud Files authentication failed', 'updraftplus').' ('.get_class($e).', '.$e->getMessage().')'));
			die;
		}

		if (!is_a($container_object, 'OpenCloud\ObjectStore\Resource\Container') && !is_a($container_object, 'Container')) {
			echo json_encode(array('e' => 1, 'm' => __('Cloud Files authentication failed', 'updraftplus').' ('.get_class($container_object).')'));
			die;
		}

		# Create the new user
		$json = json_encode(array( 'user' => array(
			'username' => $_POST['newuser'],
			'email' => $_POST['newemail'],
			'enabled' => true
		)));

		$client = $method->get_client();

		try {
			$response = $client->post($auth_url.'users', array('Content-Type' => 'application/json', 'Accept' => 'application/json'), $json)->send()->json();
		} catch (Guzzle\Http\Exception\ClientErrorResponseException $e) {
			$response = $e->getResponse();
			$code = $response->getStatusCode();
			$reason = $response->getReasonPhrase();
			if (403 == $code) {
				echo json_encode(array('e' => 1, 'm' => __('Authorisation failed (check your credentials)', 'updraftplus')));
			} elseif (409 == $code && 'Conflict' == $reason) {
				#echo json_encode(array('e' => 1, 'm' => __('', 'updraftplus')));
				echo json_encode(array('e' => 1, 'm' => __('Conflict: that user or email address already exists', 'updraftplus')));
			} else {
				echo json_encode(array('e' => 1, 'm' => sprintf(__('Cloud Files operation failed (%s)', 'updraftplus'), 5)." (".$e->getMessage().') ('.get_class($e).')'));
			}
			die;
		} catch (Exception $e) {
			echo json_encode(array('e' => 1, 'm' => sprintf(__('Cloud Files operation failed (%s)', 'updraftplus'), 4).' ('.$e->getMessage().') ('.get_class($e).')'));
			die;
		}

		if (empty($response['user']['id']) || empty($response['user']['OS-KSADM:password']) || empty($response['user']['username'])) {
			echo json_encode(array('e' => 1, 'm' => sprintf(__('Cloud Files operation failed (%s)', 'updraftplus'), 3)));
			die;
		}

		$user = $response['user']['username'];
		$pass = $response['user']['OS-KSADM:password'];
		$id = $response['user']['id'];

		# Add the role to the user
// 		try {
// 			$put = $method->client->put($auth_url."users/$id/roles/OS-KSADM/$role_id")->send();
// 		} catch (Exception $e) {
// 			echo json_encode(array('e' => 1, 'm' => sprintf(__('Cloud Files operation failed (%s)', 'updraftplus'), 2).' ('.$e->getMessage().') ('.get_class($e).')'));
// 			die;
// 		}

		# Add the user to the container
		try {
			$headers = array('X-Container-Write' => $user, 'X-Container-Read' => $user);
			$container_object->getClient()->post($container_object->getUrl(), $headers)->send();
		} catch (Exception $e) {
			echo json_encode(array('e' => 1, 'm' => sprintf(__('Cloud Files operation failed (%s)', 'updraftplus'), 1).' ('.$e->getMessage().') ('.get_class($e).')'));
			die;
		}

		# Get an API key for the user
		try {
			$response = $container_object->getClient()->post($auth_url."users/$id/OS-KSADM/credentials/RAX-KSKEY:apiKeyCredentials/RAX-AUTH/reset", array())->send()->json();
			if (empty($response['RAX-KSKEY:apiKeyCredentials']['apiKey'])) {
				echo json_encode(array('e' => 1, 'm' => sprintf(__('Cloud Files operation failed (%s)', 'updraftplus'), 8)));
				die;
			}
			$apikey = $response['RAX-KSKEY:apiKeyCredentials']['apiKey'];
		} catch (Exception $e) {
			echo json_encode(array('e' => 1, 'm' => sprintf(__('Cloud Files operation failed (%s)', 'updraftplus'), 7).' ('.$e->getMessage().') ('.get_class($e).')'));
			die;
		}

		echo json_encode(array(
			'e' => 0,
			'u' => htmlspecialchars($user),
			'p' => htmlspecialchars($pass),
			'k' => htmlspecialchars($apikey),
			'a' => $auth_url = ('uk' == $_POST['location']) ? 'https://lon.auth.api.rackspacecloud.com' : 'https://auth.api.rackspacecloud.com',
			'r' => $_POST['region'],
			'c' => $_POST['container'],
			'm' => htmlspecialchars(sprintf(__("Username: %s", 'updraftplus'), $user))."<br>".htmlspecialchars(sprintf(__("Password: %s", 'updraftplus'), $pass))."<br>".htmlspecialchars(sprintf(__("API Key: %s", 'updraftplus'), $apikey))));

		die;

		
	}

	public function admin_footer() {
		?>
		<style type="text/css">
			#updraft_cfnewapiuser_form label { float: left; clear:left; width: 200px;}
			#updraft_cfnewapiuser_form input[type="text"], #updraft_cfnewapiuser_form select { float: left; width: 230px; }
		</style>
		<div id="updraft-cfnewapiuser-modal" title="<?php _e('Create new API user and container', 'updraftplus');?>" style="display:none;">
		<div id="updraft_cfnewapiuser_form">
			<p style="margin:1px; padding-top:0; clear: left; float: left;">
			<em><?php _e('Enter your Rackspace admin username/API key (so that Rackspace can authenticate your permission to create new users), and enter a new (unique) username and email address for the new user and a container name.', 'updraftplus');?></em>
			</p>
			<div id="updraft-cfnewapiuser-results" style="clear: left; float: left;"><p></p></div>

			<p style="margin-top:3px; padding-top:0; clear: left; float: left;">

			<label for="updraft_cfnewapiuser_accountlocation"><?php _e('US or UK Rackspace Account', 'updraftplus');?></label>
			<select title="<?php _e('Accounts created at rackspacecloud.com are US accounts; accounts created at rackspace.co.uk are UK accounts.', 'updraftplus');?>" id="updraft_cfnewapiuser_accountlocation">
				<?php
				$accounts = array(
					'us' => __('US (default)','updraftplus'),
					'uk' => __('UK', 'updraftplus')
				);
				$selaccount = 'us';
				foreach ($accounts as $acc => $desc) {
					?><option <?php if ($selaccount == $acc) echo 'selected="selected"'; ?> value="<?php echo $acc;?>"><?php echo htmlspecialchars($desc); ?></option><?php
				}
				?>
			</select>

			<label for="updraft_cfnewapiuser_adminusername"><?php _e('Admin Username', 'updraftplus');?></label> <input type="text" id="updraft_cfnewapiuser_adminusername" value="">
			<label for="updraft_cfnewapiuser_adminapikey"><?php _e('Admin API Key', 'updraftplus');?></label> <input type="text" id="updraft_cfnewapiuser_adminapikey" value="">
			<label for="updraft_cfnewapiuser_newuser"><?php _e("New User's Username", 'updraftplus');?></label> <input type="text" id="updraft_cfnewapiuser_newuser" value="">
			<label for="updraft_cfnewapiuser_newemail"><?php _e("New User's Email Address", 'updraftplus');?></label> <input type="text" id="updraft_cfnewapiuser_newemail" value="">

			<label for="updraft_cfnewapiuser_region"><?php _e('Cloud Files Storage Region','updraftplus');?>:</label>
			<select id="updraft_cfnewapiuser_region">
				<?php
					$regions = array(
						'DFW' => __('Dallas (DFW) (default)', 'updraftplus'),
						'SYD' => __('Sydney (SYD)', 'updraftplus'),
						'ORD' => __('Chicago (ORD)', 'updraftplus'),
						'IAD' => __('Northern Virginia (IAD)', 'updraftplus'),
						'HKG' => __('Hong Kong (HKG)', 'updraftplus'),
					);
					// 'LON' => __('London (LON)', 'updraftplus')
					$selregion = 'DFW';
					foreach ($regions as $reg => $desc) {
						?>
						<option <?php if ($selregion == $reg) echo 'selected="selected"'; ?> value="<?php echo $reg;?>"><?php echo htmlspecialchars($desc); ?></option>
						<?php
					}
				?>
			</select>
			<label for="updraft_cfnewapiuser_container"><?php _e("Cloud Files Container", 'updraftplus');?></label> <input type="text" id="updraft_cfnewapiuser_container" value="">

			</p>
			<fieldset>
				<input type="hidden" name="nonce" value="<?php echo wp_create_nonce('updraftplus-credentialtest-nonce');?>">
				<input type="hidden" name="action" value="updraft_ajax">
				<input type="hidden" name="subaction" value="cloudfiles_newuser">
			</fieldset>
		</div>
		</div>

		<script>
		jQuery(document).ready(function() {
			jQuery('#updraft_cloudfiles_newapiuser').click(function(e) {
				e.preventDefault();
				jQuery('#updraft-cfnewapiuser-modal').dialog('open');
			});

			var updraft_cfnewapiuser_modal_buttons = {};
			
			updraft_cfnewapiuser_modal_buttons[updraftlion.cancel] = function() { jQuery(this).dialog("close"); };
			updraft_cfnewapiuser_modal_buttons[updraftlion.createbutton] = function() {
				jQuery('#updraft-cfnewapiuser-results').html('<p style="color:green">'+updraftlion.trying+'</p>');
				var data = {
					action: 'updraft_ajax',
					subaction: 'doaction',
					subsubaction: 'updraft_cloudfiles_newuser',
					nonce: '<?php echo wp_create_nonce('updraftplus-credentialtest-nonce'); ?>',
					adminuser: jQuery('#updraft_cfnewapiuser_adminusername').val(),
					adminapikey: jQuery('#updraft_cfnewapiuser_adminapikey').val(),
					newuser: jQuery('#updraft_cfnewapiuser_newuser').val(),
					newemail: jQuery('#updraft_cfnewapiuser_newemail').val(),
					container: jQuery('#updraft_cfnewapiuser_container').val(),
					location: jQuery('#updraft_cfnewapiuser_accountlocation').val(),
					region: jQuery('#updraft_cfnewapiuser_region').val(),
					useservercerts: jQuery('#updraft_ssl_useservercerts').val(),
					disableverify: jQuery('#updraft_ssl_disableverify').val()
				};
				jQuery.post(ajaxurl, data, function(response) {
					try {
						resp = jQuery.parseJSON(response);
					} catch(err) {
						console.log(err);
						jQuery('#updraft-cfnewapiuser-results').html('<p style="color:red;">'+updraftlion.servererrorcode+'</p>');
						alert(updraftlion.unexpectedresponse+' '+response);
						return;
					}
					if (resp.e == 1) {
						jQuery('#updraft-cfnewapiuser-results').html('<p style="color:red;">'+resp.m+'</p>');
					} else if (resp.e == 0) {
						jQuery('#updraft-cfnewapiuser-results').html('<p style="color:green;">'+resp.m+'</p>');
						jQuery('#updraft_cloudfiles_user').val(resp.u);
						jQuery('#updraft_cloudfiles_apikey').val(resp.k);
						jQuery('#updraft_cloudfiles_authurl').val(resp.a);
						jQuery('#updraft_cloudfiles_region').val(resp.r);
						jQuery('#updraft_cloudfiles_path').val(resp.c);
						jQuery('#updraft_cloudfiles_newapiuser').after('<br><strong>'+updraftlion.newuserpass+'</strong> '+resp.p);
						jQuery('#updraft-cfnewapiuser-modal').dialog('close');
					}
				});
			};
			jQuery( "#updraft-cfnewapiuser-modal" ).dialog({
				autoOpen: false, height: 465, width: 555, modal: true,
				buttons: updraft_cfnewapiuser_modal_buttons
			});

		});
		</script>
		<?php
	}

}