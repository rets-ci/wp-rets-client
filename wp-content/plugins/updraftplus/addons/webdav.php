<?php
/*
UpdraftPlus Addon: webdav:WebDAV Support
Description: Allows UpdraftPlus to back up to WebDAV servers
Version: 2.0
Shop: /shop/webdav/
Include: includes/PEAR
IncludePHP: methods/stream-base.php
Latest Change: 1.9.1
*/

/*
To look at:
http://sabre.io/dav/http-patch/
http://sabre.io/dav/davclient/
https://blog.sphere.chronosempire.org.uk/2012/11/21/webdav-and-the-http-patch-nightmare
*/

if (!defined('UPDRAFTPLUS_DIR')) die('No direct access allowed');

# In PHP 5.2, the instantiation of the class has to be after it is defined, if the class is extending a class from another file. Hence, that has been moved to the end of this file.

if (!class_exists('UpdraftPlus_AddonStorage_viastream')) require_once(UPDRAFTPLUS_DIR.'/methods/stream-base.php');

class UpdraftPlus_Addons_RemoteStorage_webdav extends UpdraftPlus_AddonStorage_viastream {

	public function __construct() {
		parent::__construct('webdav', 'WebDAV');
	}

	public function bootstrap() {
		if (!class_exists('HTTP_WebDAV_Client_Stream')) {
			set_include_path(UPDRAFTPLUS_DIR.'/includes/PEAR'.PATH_SEPARATOR.get_include_path());
			require('HTTP/WebDAV/Client.php');
		}
		return true;
	}

	public function config_print_middlesection($url) {
		?>
			<tr class="updraftplusmethod webdav">
				<th><?php _e('WebDAV URL','updraftplus');?>:</th>
				<td>
					<input type="text" style="width: 432px" id="updraft_webdav_settings_url" name="updraft_webdav_settings[url]" value="<?php echo($url);?>" />
					<br>
					<?php printf(__('Enter a complete URL, beginning with webdav:// or webdavs:// and including path, username, password and port as required - e.g.%s','updraftplus'),' webdavs://myuser:password@example.com/dav');?>
				</td>
			</tr>

		<?php
	}

	public function credentials_test() {
		if (empty($_POST['url'])) {
			printf(__("Failure: No %s was given.",'updraftplus'), 'URL');
			return;
		}

		$url = preg_replace('/^http/', 'webdav', untrailingslashit($_POST['url']));
		$this->credentials_test_go($url);
	}

}

$updraftplus_addons_webdav = new UpdraftPlus_Addons_RemoteStorage_webdav;
