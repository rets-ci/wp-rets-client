<?php
/*
UpdraftPlus Addon: morestorage:Multiple storage options
Description: Provides the ability to back up to multiple remote storage facilities, not just one
Version: 1.2
Shop: /shop/morestorage/
Latest Change: 1.11.10
*/

if (!defined('UPDRAFTPLUS_DIR')) die('No direct access allowed');

$updraftplus_addon_morestorage = new UpdraftPlus_Addon_MoreStorage;

class UpdraftPlus_Addon_MoreStorage {

	public function __construct() {
		add_filter('updraftplus_storage_printoptions', array($this, 'storage_printoptions'), 10, 2);
		#add_action('updraftplus_config_print_after_storage', array($this, 'config_print_after_storage'));
		add_action('updraftplus_config_print_before_storage', array($this, 'config_print_before_storage'));
		add_filter('updraftplus_savestorage', array($this, 'savestorage'), 10, 2);
		add_action('updraftplus_after_remote_storage_heading', array($this, 'after_remote_storage_heading'));
	}

	public function after_remote_storage_heading() {
		echo '<br><em>'.__('(as many as you like)', 'updraftplus').'</em>';
	}

	public function admin_print_footer_scripts() {
		?>
		<script>
		jQuery(document).ready(function() {
			var anychecked = 0;
			var set = jQuery('.updraft_servicecheckbox:checked');
			
			jQuery(set).each(function(ind, obj) {
				var ser = jQuery(obj).val();
				anychecked++;
				jQuery('.remote-tab-'+ser).show();
				if(ind == jQuery(set).length-1){
					tab_activation(ser);
				}
			});
			if (anychecked > 0) {
				jQuery('.updraftplusmethod.none').hide();
			}
			
			jQuery('.updraft_servicecheckbox').change(function() {
				var sclass = jQuery(this).attr('id');
				if ('updraft_servicecheckbox_' == sclass.substring(0,24)) {
					var serv = sclass.substring(24);
					if (null != serv && '' != serv) {
						if (jQuery(this).is(':checked')) {
							anychecked++;
							jQuery('.remote-tab-'+serv).fadeIn();
							tab_activation(serv);
						} else {
							anychecked--;
							jQuery('.remote-tab-'+serv).hide();
							//Check if this was the active tab, if yes, switch to another
							if(jQuery('.remote-tab-'+serv).attr('active') == 'true'){
								tab_activation(jQuery('.remote-tab:visible').last().attr('name'));
							}
						}
					}
				}
				
				if (anychecked > 0) {
					jQuery('.updraftplusmethod.none').hide();
				} else {
					jQuery('.updraftplusmethod.none').fadeIn();
				}
			});
			
			jQuery('.remote-tab').click(function(event) {
				//Close other tabs and open the clicked one
				event.preventDefault();
				var the_method = jQuery(this).attr('name');
				tab_activation(the_method);
			});
			
			var servicecheckbox = jQuery(".updraft_servicecheckbox");
			if (typeof servicecheckbox.labelauty === 'function') { servicecheckbox.labelauty(); }
		});
		
		function tab_activation(the_method){
			jQuery('.updraftplusmethod').hide();
			jQuery('.remote-tab').attr('active', false);
			jQuery('.remote-tab').removeClass('nav-tab-active');
			jQuery('.updraftplusmethod.'+the_method).show();
			jQuery('.remote-tab-'+the_method).attr('active', true);
			jQuery('.remote-tab-'+the_method).addClass('nav-tab-active');
		}
		</script>
		<?php
	}

	public function config_print_before_storage($storage) {
		global $updraftplus;
		?>
		<tr class="updraftplusmethod <?php echo $storage;?>"><th><h3><?php echo $updraftplus->backup_methods[$storage]; ?></h3></th><td></td></tr>
		<?php
	}

	public function savestorage($rinput, $input) {
		return $input;
	}

/*
	function config_print_after_storage($storage) {
		?>
		<tr class="updraftplusmethod <?php echo $storage;?>"><td colspan="2"><hr></td></tr>
		<?php
		
	}
*/

	public function storage_printoptions($ret, $active_service) {

		global $updraftplus;
		add_action('admin_print_footer_scripts', array($this, 'admin_print_footer_scripts'));

		?> 
		<div id="remote-storage-container">

		<?php
			foreach ($updraftplus->backup_methods as $method => $description) {
				echo "<input name=\"updraft_service[]\" class=\"updraft_servicecheckbox $method\" id=\"updraft_servicecheckbox_$method\" type=\"checkbox\" value=\"$method\"";
				if ($active_service === $method || (is_array($active_service) && in_array($method, $active_service))) echo ' checked="checked"';
				echo " data-labelauty=\"".esc_attr($description)."\">";
			}

		?>

		</div>

		</td>
		</tr>
		<tr>
			<th colspan="2"><h2><?php _e('Remote Storage Options', 'updraftplus');?></h2>
		</tr>
		<tr id="remote_storage_tabs" style="border-bottom: 1px solid #ccc">
			<td colspan="2" style="padding:0px">
	<?php
		foreach ($updraftplus->backup_methods as $method => $description) {
			echo "<a class=\"nav-tab remote-tab remote-tab-$method\" id=\"remote-tab-$method\" name=\"$method\" href=\"#\" ";
			//if ((!is_array($active_service) && $active_service !== $method) || !(is_array($active_service) && in_array($method, $active_service))) echo 'style="display:none;"';
			echo 'style="display:none;"';
			echo ">".htmlspecialchars($description)."</a>";
		}
	?>
			</td>
		</tr>
		
		<?php
		return true;

	}

}
