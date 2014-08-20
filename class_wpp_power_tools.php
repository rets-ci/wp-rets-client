<?php
/**
 * Name: Power Tools
 * Class: class_wpp_power_tools
 * Version: 0.5.5
 * Feature ID: 13
 * Minimum Core Version: 1.37.3.2
 * Description: Power tools for WPP to include capabilities management.
 */

add_action( 'wpp_init', array( 'class_wpp_power_tools', 'init' ) );
add_action( 'wpp_pre_init', array( 'class_wpp_power_tools', 'pre_init' ) );
add_action( 'admin_menu', array( 'class_wpp_power_tools', 'admin_menu' ) );

add_filter( 'wpp_taxonomies', array( 'class_wpp_power_tools', 'wpp_taxonomies' ) );


/**
 * Contains administrative functions
 * to manage WPP capabilities
 *
 * @author Maxim Peshkov
 */
class class_wpp_power_tools {

  /*
   * (custom) Capability to manage the current feature
   */
  static protected $capability_capability = "manage_wpp_capabilities";
  static protected $capability_white_label = "manage_white_label";

  /**
   * Special functions that must be called prior to init
   *
   */
  static public function pre_init() {

    //* Add capabilities */
    add_filter('wpp_capabilities', array('class_wpp_power_tools', "add_capability"));

    //* Saves WPP capabilities */
    add_filter('wpp_settings_save', array('class_wpp_power_tools','save_capabilities'));

    add_action('wpp_settings_display_tab_bottom',  array('class_wpp_power_tools', "wpp_settings_display_tab_bottom"));

    add_action('wpp_settings_main_tab_bottom',  array('class_wpp_power_tools', "wpp_settings_main_tab_bottom"));

    add_filter('wpp_object_labels', array('class_wpp_power_tools', "wpp_object_labels"));

  }

  /**
   * Apply feature's Hooks and other functionality
   */
  static public function init() {

    if(current_user_can(self::$capability_capability)) {
      //* Add Inquiry page to Property Settings page array */
      add_filter('wpp_settings_nav', array('class_wpp_power_tools', 'settings_nav'));
      //* Add Settings Page */
      add_action('wpp_settings_content_capabilities', array('class_wpp_power_tools', 'capabilities_settings_page'));
      //** Add 'Capabilities' tab to Contextual Help */
      add_action( 'property_page_property_settings_help', array( __CLASS__, 'wpp_contextual_help' ) );
    }

  }

  /**
   * Disable taxonomies.
   *
   * @since 0.1
   */
  static public function wpp_taxonomies($wpp_taxonomies = false) {
    global $wp_properties;

    if( isset( $wp_properties['configuration']['disabled_taxonomies'] ) && is_array( $wp_properties['configuration']['disabled_taxonomies'] ) ) {
      $disabled_taxonomies = array_keys($wp_properties['configuration']['disabled_taxonomies']);
    }
    
    if( empty( $wpp_taxonomies ) || empty( $disabled_taxonomies ) ) {
      return $wpp_taxonomies;
    }

    foreach( $wpp_taxonomies as $taxonomy_slug => $taxonomy_label ) {
      if( in_array( $taxonomy_slug, $disabled_taxonomies ) ) {
        unset( $wpp_taxonomies[ $taxonomy_slug ] );
      }
    }
    
    return $wpp_taxonomies;
  }

  /**
   * Adds contextual help.
   *
   * @since 0.1
   */
  static public function admin_menu() {
    add_filter('wpp_contextual_help_overview', array('class_wpp_power_tools', "wpp_contextual_help_overview"));
  }

  /**
   * Adds Custom capability to the current premium feature
   */
  static public function add_capability($capabilities) {
    $capabilities[self::$capability_capability] = __('Manage Capabilities','wpp');
    $capabilities[self::$capability_white_label] = __('Manage White Label','wpp');
    return $capabilities;
  }

  /**
   * Save capabilities
   */
  static public function save_capabilities($wpp_settings) {
    global $wp_roles, $wpp_capabilities;

    foreach($wp_roles->roles as $r_slug => $role) {
      if($r_slug == 'administrator') {
        continue;
      }

      $role = get_role( $r_slug );
      foreach( $wpp_capabilities as $cap => $value ){
        if ( isset( $wpp_settings['capabilities'][$r_slug] ) && in_array( $cap, $wpp_settings['capabilities'][$r_slug] ) ) {
          $role->add_cap( $cap );
        } else {
          $role->remove_cap( $cap );
        }
      }
    }

    if(!empty($wpp_settings['capabilities'])) {
      unset($wpp_settings['capabilities']);
    }

    return $wpp_settings;
  }

  /**
   * Adds contextual help fpr Capabilities tab on Settings page
   *
   * @param array $data
   * @return array
   * @author peshkov@UD
   */
  static public function wpp_contextual_help( $data ) {

    $capabilities_help = array(
      '<h3>' . __( 'Capabilities', 'wpp' ) .'</h3>',
      '<h4>' . __( 'View Properties', 'wpp' ) . '</h4>',
      '<p>' . __( 'Adds Properties menu and user can see the list of all available properties.', 'wpp' ) .'</p>',
      '<p>' . __( 'It is required capability to manage WP-Property. All cababilities depend on this one.', 'wpp' ) .'</p>',
      '<p>' . __( 'For example, user can not edit property if he has capability \'Add/Edit Property\', but doesn\'t have \'View Properties\' capability.', 'wpp' ) .'</p>',
      '<h4>' . __( 'Add/Edit Properties', 'wpp' ) . '</h4>',
      '<p>' . __( 'Allows to add new property and edit properties where user is author. To edit properties where user is not author ( which he didn\'t create ), user must have \'Edit Other Properties\' ( see below ).', 'wpp' ) .'</p>',
      '<h4>' . __( 'Edit Other Properties', 'wpp' ) . '</h4>',
      '<p>' . __( 'Allows to edit properties where user is not author ( which he didn\'t create )', 'wpp' ) .'</p>',
      '<h4>' . __( 'Delete Properties', 'wpp' ) . '</h4>',
      '<p>' . __( 'Allows user to delete properties. This capability depends on \'Add/Edit Properties\' and \'Edit Other Properties\'.', 'wpp' ) .'</p>',
      '<p>' . __( 'User can delete properties where he is author if he has \'Add/Edit Properties\' capability', 'wpp' ) .'</p>',
      '<p>' . __( 'User can delete properties where he is not author if he has \'Edit Other Properties\' capability', 'wpp' ) .'</p>',
      '<h4>' . __( 'Publish Properties', 'wpp' ) . '</h4>',
      '<p>' . __( 'Allows user to publish properties.', 'wpp' ) .'</p>',
      '<h4>' . __( 'Manage Settings', 'wpp' ) . '</h4>',
      '<p>' . __( 'Allows user to manage WP-Property settings. Adds \'Settings\' page to menu.', 'wpp' ) .'</p>',
      '<h4>' . __( 'Manage Taxonomies', 'wpp' ) . '</h4>',
      '<p>' . __( 'Allows user to manage taxonomies such as <b>Feature</b> and <b>Community Feature</b>', 'wpp' ) .'</p>',
      '<h3>' . __( 'Other manage capabilities', 'wpp' ) . '</h3>',
      '<p>' . __( 'Other capabilities belong to premium features settings and functionality. User who has no capability to manage specific premium feature will not be able to manage it.', 'wpp' ) . '</p>',
    );

    $data['Capabilities'] = apply_filters( 'wpp::contextual_help::capabilities', $capabilities_help );

    return $data;

  }

  /**
   * Adds menu to settings page navigation
   *
   */
  static public function settings_nav($tabs) {
    $tabs['capabilities'] = array(
      'slug' => 'capabilities',
      'title' => __('Capabilities','wpp')
    );
    return $tabs;
  }

  /**
   * Displays advanced management page
   *
   */
  static public function capabilities_settings_page() {
    global $wp_roles, $wpp_capabilities;
    ?>
    <table class="form-table">
      <tr>
        <td>
          <h3><?php _e('WP Property Capabilities','wpp') ?></h3>
          <p><?php printf( __( 'User Roles capabilities management. See more details what every capability does %shere%s.' ), '<span class="wpp_link wpp_toggle_contextual_help">', '</span>' ); ?></p>
          <table class="ud_ui_dynamic_table widefat">
          <thead>
            <tr>
              <th style="width:20%;"><?php _e('Role','wpp') ?></th>
              <th><?php _e('Capabilities','wpp') ?></th>
            </tr>
          </thead>
          <tbody>
            <?php foreach ($wp_roles->roles as $r_slug => $role) : ?>
            <tr>
              <td>
                <h4 style="margin:0;"><?php _e($role['name'],'wpp') ?></h4>
                <?php
                  $description = "";
                  switch ($r_slug) {
                    case "administrator":
                      $description = __('Administrator has all capabilities which can not be managed.', 'wpp');
                      break;
                  }
                ?>
                <div style="description"><?php echo apply_filters('wpp_role_description_'. $r_slug, $description); ?></div>
              </td>
              <td>
                <ul class="wp-tab-panel wpp_hidden_property_attributes">
                  <?php foreach($wpp_capabilities as $cap => $value): ?>
                  <?php $checked = (array_key_exists($cap , $role['capabilities']) ? "checked=\"checked\"" : ""); ?>
                  <?php $disabled = ( ($r_slug == "administrator") ? "disabled=\"disabled\"" : ""); ?>
                  <li>
                    <input id="wpp_<?php echo $r_slug;?>_<?php echo $cap;?>_capability" <?php echo $checked; ?> <?php echo $disabled; ?> type="checkbox" name="wpp_settings[capabilities][<?php echo $r_slug; ?>][]" value="<?php echo $cap; ?>" />
                    <label for="wpp_<?php echo $r_slug;?>_<?php echo $cap;?>_capability">
                    <?php _e($value, 'wpp');?>
                    </label>
                  </li>
                  <?php endforeach; ?>
                </ul>
              </td>
            </tr>
            <?php endforeach; ?>
          </tbody>
          </table>
        </td>
      </tr>
    </table>
    <?php
  }
  
  /**
   *
   */
  static public function wpp_settings_main_tab_bottom( $wp_properties = false ) {

    if( !$wp_properties ) {
      global $wp_properties;
    }
    
    $disabled_taxonomies = isset( $wp_properties['configuration']['disabled_taxonomies'] ) ? (array)$wp_properties['configuration']['disabled_taxonomies'] : array();

    if( is_array( $wp_properties['taxonomies'] ) ) {
      foreach($wp_properties['taxonomies'] as $taxonomy => $taxonomy_data) {
        $configurable_taxonomies[$taxonomy] = $taxonomy_data['label'];
      }
    }
    
    foreach( $disabled_taxonomies as $taxonomy => $taxonomy_label) {
      $configurable_taxonomies[$taxonomy] = $taxonomy_label;
    }

    if( !is_array( $configurable_taxonomies ) ) {
      return;
    }
    
    if( is_array( $configurable_taxonomies ) ) {
      ?>
      <tr>
        <th><?php _e('Taxonomies','wpp'); ?></th>
        <td>
          <ul>
            <?php foreach( $configurable_taxonomies as $taxonomy => $taxonomy_label ) { ?>
              <li><?php echo WPP_F::checkbox( "id=wpp_settings_configuration_disabled_taxonomies_{$taxonomy}&name=wpp_settings[configuration][disabled_taxonomies][{$taxonomy}]&value={$taxonomy_label}&label=" . sprintf(__('Disable %1$s taxonomy.', 'wpp'), $taxonomy_label ), $disabled_taxonomies ); ?></li>
            <?php } ?>
          </ul>
        </td>
      </tr>
      <?php 
    }
  }

  /**
   *
   */
  static public function wpp_settings_display_tab_bottom() {
    global $wp_properties;

    if(!current_user_can(self::$capability_capability)) {
      return;
    }

    if(empty($wp_properties['configuration']['feature_settings']['white_label'])) {
      class_wpp_power_tools::load_white_label_defaults();
    }

    $labels = $wp_properties['configuration']['feature_settings']['white_label']['labels'];
    $contextual_help = $wp_properties['configuration']['feature_settings']['white_label']['contextual_help'];

    ?>
    <tr>
      <th><?php _e('White Label', 'wpp'); ?></th>
      <td>

      <div class="wpp_subtle_tabs wpp_nl_tabs" >
        <ul class="wpp_section_tabs">
          <li><a href="#wpp_wl_labels"><?php _e('Labels', 'wpp'); ?></a></li>
          <li><a href="#wpp_wl_contextual_help"><?php _e('Contextual Menus', 'wpp'); ?></a></li>
        </ul>


        <div id="wpp_wl_labels" class="wp-tab-panel">
          <div class="wpp_subtle_tab_description">
            <?php _e('Use this menu to rename WP-Property components, for example if you are listing "Real Estate", or "Vehicles".', 'wpp'); ?>
          </div>
          <ul>
            <li>
              <label><?php _e('Singular Property:', 'wpp'); ?></label>
              <input name="wpp_settings[configuration][feature_settings][white_label][labels][singular_name]" value="<?php echo esc_attr($labels['singular_name']); ?>" />
              <span class="description"><?php _e('Default is "Property", will change the label in the navigation menus.', 'wpp'); ?></span>
            </li>

            <li>
              <label><?php _e('Plural Property:', 'wpp'); ?></label>
              <input name="wpp_settings[configuration][feature_settings][white_label][labels][plural_name]" value="<?php echo esc_attr($labels['plural_name']); ?>" />
              <span class="description"><?php _e('Default is "Properties", will change the label in the navigation menus.', 'wpp'); ?></span>
            </li>

          </ul>
          </div>
        <div id="wpp_wl_contextual_help" class="wp-tab-panel">
          <div class="wpp_subtle_tab_description">
            <?php _e('Contextual menus are displayed when a user clicks the "Help" tab in the top right corner of a page.', 'wpp'); ?>
          </div>

          <ul>
            <li>
              <label><?php _e('Overview Page Contextual Help:', 'wpp'); ?></label>
              <textarea class="code" name="wpp_settings[configuration][feature_settings][white_label][contextual_help][overview_page]"><?php echo esc_attr($contextual_help['overview_page']); ?></textarea>
            </li>
            </ul>
        </div>
      </div>

      </td>
    </tr>
    <?php
  }

  /**
   * Load default settings
   *
   * @since 0.1
   */
  static public function load_white_label_defaults() {
    global $wp_properties;
    $wp_properties['configuration']['feature_settings']['white_label']['labels']['name'] = __('Properties');
  }

  /**
   *
   */
  static public function wpp_contextual_help_overview($text) {
    global $wp_properties;

    $contextual_help = $wp_properties['configuration']['feature_settings']['white_label']['contextual_help'];

    if(!empty($contextual_help['overview_page'])) {
      return nl2br($contextual_help['overview_page']);
    }

    return $text;
  }

  /**
   *
   */
  static public function wpp_object_labels($labels) {
    global $wp_properties;

    $custom_labels = $wp_properties['configuration']['feature_settings']['white_label']['labels'];

    if(!empty($custom_labels['singular_name'])) {
      $labels['singular_name'] = $custom_labels['singular_name'];
      $labels['add_new'] =  __('Add ', 'wpp') .  $custom_labels['singular_name'];
      $labels['add_new_item'] =  __('Add New ', 'wpp') .  $custom_labels['singular_name'];
      $labels['edit_item'] =  __('Edit ', 'wpp') .  $custom_labels['singular_name'];
      $labels['new_item'] =  __('New ', 'wpp') .  $custom_labels['singular_name'];
      $labels['view_item'] =  __('View ', 'wpp') .  $custom_labels['singular_name'];
    }

    /*
    if(!empty($custom_labels['agents'])) {
      $label['agents']['singular'] = $custom_labels['agents'];
      $label['agents']['plural'] = $custom_labels['agents'];
    }
    */

    if(!empty($custom_labels['plural_name'])) {
      $labels['name'] = $custom_labels['plural_name'];
      $labels['all_items'] = __('All ', 'wpp') . $custom_labels['plural_name'];
      $labels['search_items'] = __('Search ', 'wpp') . $custom_labels['plural_name'];
      $labels['not_found'] = __('No ', 'wpp') . $custom_labels['plural_name'] . __(' found.', 'wpp') ;
    }

    return $labels;
  }

}
