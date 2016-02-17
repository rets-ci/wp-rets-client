<?php
/*
Plugin Name: Wordpress Menufication
Plugin URI: http://www.iveo.se
Description: Generates a responsive menu from Wordpress menu system or from a custom element. Dependencies: jQuery.
Version: 1.2
Author: IVEO
Author URI: http://www.iveo.se
License:  © IVEO AB 2013 - All Rights Reserved

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
if( !class_exists( 'Menufication' ) ) {

  if( !class_exists( 'scssc' ) ) {
    require_once "scss.inc.php";
  }

  class Menufication {

    private $plugin_dir;
    private $plugin_url;
    public static $instance = NULL;
    private $plugin_prefix;
    private $plugin_name;

    /**
     *   Constructor
     */
    public function __construct() {
      $this->plugin_prefix = "wp_menufication";
      $this->plugin_name   = "Menufication";
      $this->plugin_dir    = plugin_dir_path( dirname( __FILE__ ) );

      // @todo make the directory dynamic
      $this->plugin_url    = plugin_dir_url( dirname( __DIR__ ) ) . 'wp-menufication/';

      $this->add_actions();
      $this->add_filters();
    }

    /**
     * Singleton
     */
    public static function getInstance() {

      if( !isset( self::$instance ) ) {
        self::$instance = new Menufication();
      }

      return self::$instance;
    }

    function is_off_canvas_active() {
      if( class_exists( 'OffCanvas' ) ) {
        return OffCanvas::getInstance()->is_off_canvas_active();
      } else {
        return false;
      }
    }

    function add_actions() {
      // Adds the admin menu
      add_action( 'admin_menu', array( &$this, 'admin_menu' ) );

      // Initialize options
      add_action( 'admin_init', array( &$this, 'options_settings_init' ) );
      add_action( 'after_setup_theme', array( &$this, 'options_init' ) );

      //Add CSS, JS and meta
      add_action( 'wp_print_styles', array( &$this, 'add_stylesheets' ) );
      add_action( 'wp_enqueue_scripts', array( &$this, 'add_js' ) );

      //Adds content
      add_action( 'wp_footer', array( &$this, 'add_multiple_content' ) );

      // Registers the deactivation hook
      //register_deactivation_hook( __FILE__, array( &$this, 'remove_options_on_deactivation' ) );
    }

    function add_filters() {

      add_filter( 'plugin_action_links', array( &$this, 'add_settings_link' ), 10, 2 );

      //make sure we have enabled
      if( @!$this->is_enabled() )
        return false;

      add_filter( 'wp_nav_menu_items', array( &$this, 'menufication_nav_class' ), 10, 2 );
      add_filter( 'wp_page_menu', array( &$this, 'menufication_page_menu_class' ), 10, 2 );
    }

    // Check if the plugin is enabled
    function is_enabled() {
      $options = get_option( $this->plugin_prefix . '_options' );

      if( !$this->is_off_canvas_active() && ( !isset( $options[ 'enableMultiple' ] ) || !$options[ 'enableMultiple' ] ) && ( !$options[ 'responsive_menu' ] || strlen( $options[ 'responsive_menu' ] ) === 0 ) && !$options[ 'page_menu_support' ] && !$options[ 'customMenuElement' ] ) {
        return false;
      }

      if( !$options[ 'enable_menufication' ] || $options[ 'enable_menufication' ] != 'on' ) {
        return false;
      }

      return true;
    }

    function is_page_menu() {
      $options = get_option( $this->plugin_prefix . '_options' );
      if( ( !$options[ 'responsive_menu' ] || strlen( $options[ 'responsive_menu' ] ) === 0 ) && ( !$options[ 'customMenuElement' ] || strlen( $options[ 'customMenuElement' ] ) === 0 ) ) {

        if( $options[ 'page_menu_support' ] || $options[ 'page_menu_support' ] === 'on' ) {
          return true;
        }

        return false;
      }

      return false;
    }

    /**
     * Add menufication JS and localize init-variables
     */
    function add_js() {

      //make sure we have enabled
      if( @!$this->is_enabled() )
        return false;

      $options = get_option( $this->plugin_prefix . '_options' );
      $myFile  = $this->plugin_url . "scripts/jquery.menufication.min.js";

      // Add base script
      wp_register_script( 'menufication-js', $myFile, array( 'jquery' ), null, false );
      wp_enqueue_script( 'menufication-js' );

      // Localize the options for the JS
      $menu_options = array(
        'element' => '#' . $this->plugin_prefix
      );

      foreach( (array) $this->get_extra_settings() as $key => $value ) {
        $menu_options[ $key ] = isset( $options[ $key ] ) ? $options[ $key ] : null;
      }

      foreach( (array) $this->get_extra_advanced_settings() as $key => $value ) {
        $menu_options[ $key ] = isset( $options[ $key ] ) ? $options[ $key ] : null;
      }

      // Check if we are using the default wp page menu
      $menu_options[ 'is_page_menu' ] = $this->is_page_menu();

      // Check if off canvas is activated
      $menu_options[ 'enableMultiple' ] = $this->is_off_canvas_active();

      // Check if user is logged in
      $menu_options[ 'is_user_logged_in' ] = is_user_logged_in();

      wp_localize_script( 'menufication-js', $this->plugin_prefix, $menu_options );

      // Add settings script
      wp_register_script( 'menufication-js-setup', $this->plugin_url . "scripts/menufication-setup.js", array( 'menufication-js', 'jquery' ), null, false );
      wp_enqueue_script( 'menufication-js-setup' );
    }

    /**
     * Add menufication JS and localize init-variables
     */
    function add_admin_js() {
      // Add settings script
      if( function_exists( 'wp_enqueue_media' ) ) {
        wp_enqueue_media();
        wp_register_script( 'menufication-js-admin', $this->plugin_url . "scripts/menufication-admin.js", array( 'jquery' ) );
      } else {
        wp_enqueue_script( 'media-upload' );
        wp_enqueue_script( 'thickbox' );
        wp_register_script( 'menufication-js-admin', $this->plugin_url . "scripts/menufication-admin.js", array( 'jquery', 'media-upload', 'thickbox' ) );
      }

      wp_enqueue_script( 'menufication-js-admin' );
    }

    /**
     * Add multiple area
     */
    function add_multiple_content() {

      if( !$this->is_off_canvas_active() )
        return;

      echo OffCanvas::getInstance()->get_multiple_content();
    }

    /**
     *   Add menufication stylesheet
     */
    function add_stylesheets() {

      //make sure we have enabled
      if( @!$this->is_enabled() )
        return false;

      $options = get_option( $this->plugin_prefix . '_options' );

      if( isset( $options[ 'disableCSS' ] ) && $options[ 'disableCSS' ] ) {
        return;
      }

      $myFile = $this->plugin_url . "styles/menufication.css";

      wp_register_style( 'menufication-css', $myFile );
      wp_enqueue_style( 'menufication-css' );

      $scss = new scssc();

      // Print custom CSS

      try {
        $style = $scss->compile( $options[ 'customCSS' ] );
      } catch( Exception $e ) {
        $style = $options[ 'customCSS' ];
      }

      echo '<style type="text/css">';
      echo $style;
      echo '</style>';
    }

    /**
     *   Add menufication admin stylesheet
     */
    function add_admin_stylesheets() {
      $myFile = $this->plugin_url . '/styles/admin.css';

      wp_register_style( 'menufication-admin-css', $myFile );
      wp_enqueue_style( 'menufication-admin-css' );
      wp_enqueue_style( 'thickbox' );
    }

    function admin_menu() {
      $page = add_options_page(
        $this->plugin_name,
        $this->plugin_name,
        'manage_options',
        $this->plugin_prefix,
        array( $this, 'settings_page' )
      );

      add_action( 'admin_print_styles-' . $page, array( &$this, 'add_admin_stylesheets' ) );
      add_action( 'admin_print_scripts-' . $page, array( &$this, 'add_admin_js' ) );
    }

    // Wraps the correct menu in a div with our id //
    function menufication_nav_class( $items, $args ) {
      $options = get_option( $this->plugin_prefix . '_options' );

      $items = $this->add_search_field( $items );

      if( $args->theme_location == $options[ 'responsive_menu' ] ) {
        $items = "<div id='" . $this->plugin_prefix . "' class='wp-menufication'>" . $items . "</div>";
      }

      return $items;
    }

    // Wraps the correct menu in a div with our id //
    function menufication_page_menu_class( $items, $args ) {
      $options = get_option( $this->plugin_prefix . '_options' );
      if( $options[ 'page_menu_support' ] === 'on' && !$options[ 'responsive_menu' ] ) {
        $items = $this->add_search_field( $items );

        return "<div id='" . $this->plugin_prefix . "' class='wp-menufication'>" . $items . "</div>";
      }
    }

    function add_search_field( $items ) {
      $options = get_option( $this->plugin_prefix . '_options' );
      if( isset( $options[ 'addSearchField' ] ) && $options[ 'addSearchField' ] === 'on' && $form = get_search_form( false ) ) {
        $items = '<li class="menufication-search-holder">' . $form . '</li>' . $items;
      }

      return $items;
    }

    //** OPTIONS_HANDLING **//
    function options_settings_init() {
      register_setting( $this->plugin_prefix . '_options', $this->plugin_prefix . '_options', array( &$this, 'options_validate' ) );

      // Settings section with settings field
      add_settings_section( $this->plugin_prefix . '_menu', 'Menu', array( &$this, 'settings_header_text' ), $this->plugin_prefix . '_section' );
      add_settings_field( $this->plugin_prefix . '_chosen_menu', 'Menu', array( &$this, 'menu_chooser_field' ), $this->plugin_prefix . '_section', $this->plugin_prefix . '_menu' );

      // Settings section with settings field
      add_settings_section( $this->plugin_prefix . '_extra', 'Basic settings', array( &$this, 'menu_extra_fields' ), $this->plugin_prefix . '_section' );

      // Settings section with advanced-settings field
      add_settings_section( $this->plugin_prefix . '_extra_advanced', 'Advanced settings', array( &$this, 'menu_extra_advanced_fields' ), $this->plugin_prefix . '_section' );
    }

    // Initalize default options on plugin activation
    function options_init() {
      $options = get_option( $this->plugin_prefix . '_options' );

      // Are our options saved in the DB?
      if( $options === false ) {
        // If not, we'll save our default options
        $default_options = $this->get_default_options();
        add_option( $this->plugin_prefix . '_options', $default_options );
      }
    }

    function settings_page() {
      ?>
      <div class="wrap">

            <div id="icon-themes" class="icon32"><br/></div>

            <h2>Settings for Menufication</h2>
            <p>Menufication is a plugin which automatically generates a responsive fly-out menu with native-like features. Just select your preferred menu, customize your settings and you are ready to go! </p>
        <?php if( class_exists( 'OffCanvas' ) ) { ?>
          <p><b> It looks like you already have Menufication Extra Content installed, <a href="options-general.php?page=wp_off_canvas">head over here to find more settings.</a></b></p>
        <?php } ?>
        <!-- If we have any error by submiting the form, they will appear here -->
        <?php // settings_errors( 'settings-errors' ); ?>

        <form id="form-menufication-options" action="options.php" method="post" enctype="multipart/form-data">

                <?php
                settings_fields( $this->plugin_prefix . '_options' );
                do_settings_sections( $this->plugin_prefix . '_section' );
                ?>
          <p class="submit">
                    <input name="<?php echo $this->plugin_prefix . '_options'; ?>[submit]" id="submit_options_form" type="submit" class="button-primary" value="Save"/>
                </p>

            </form>

        </div>
    <?
    }

    function settings_info_text() {
      ?>

      <br/>
    <?php
    }

    function settings_header_text() {
      ?>
      <p>Choose what menu to use as responsive menu. This is the Theme Location which is set when registering the menu.
        <br/>You can see what menus you have available <a href="<?php echo admin_url( 'nav-menus.php' ); ?>">here</a>.</p>
    <?php
    }

    function menu_chooser_field() {
      $options = get_option( $this->plugin_prefix . '_options' );

      // Show all available to the menus
      echo "<select name='" . $this->plugin_prefix . "_options[responsive_menu]'>";
      echo "<option value=''> None </option>";

      foreach( get_registered_nav_menus() as $location => $menu ) {
        $selected = $options[ 'responsive_menu' ] == $location ? 'selected' : '';

        echo "<option " . $selected . " value='" . $location . "'> " . $menu . "</option>";
      }

      echo "</select>";
    }

    function menu_extra_fields() {
      $options = get_option( $this->plugin_prefix . '_options' );

      echo "<table class='form-table menufication-table'>";

      // Show all available to the menus
      foreach( $this->get_extra_settings() as $key => $value ) {
        // Check whether or not to check the field and add a value
        $checked     = ( $options[ $key ] && $value[ 'type' ] == 'checkbox' ) ? 'checked' : '';
        $field_value = $value[ 'type' ] == 'text' || $value[ 'type' ] == 'hidden' ? 'value="' . $options[ $key ] . '"' : '';

        ?>
        <tr class="menufication-table-tr">
                    <th class="menufication-table-th"><label for="<?php echo $key; ?>"><?php echo $value[ 'explanation' ]; ?></label></th>
                <td class="menufication-table-td">
            <?php
            switch( $value[ 'type' ] ) {
              case 'select':
                ?>
                <select name="<?php echo $this->plugin_prefix . '_options[' . $key . ']'; ?>">
                            <?php foreach( $value[ 'value' ] as $val ) {
                              $selected = ( $options[ $key ] == $val ) ? 'selected' : '';
                              ?>
                              <option value="<?php echo $val ?>" <?php echo $selected ?> > <?php echo $val ?> </option>
                            <?php } ?>
                        </select>
                <?php
                break;

              case 'hidden':
                ?>
                <input class="image_input" name="<?php echo $this->plugin_prefix . '_options[' . $key . ']'; ?>" type="<?php echo $value[ 'type' ]; ?>" <?php echo $checked; ?> id="<?php echo $key; ?>" <?php echo $field_value; ?> />
                <img src="<?php echo $options[ $key ] ?>" id="<?php echo $key; ?>_thumb" class="image_holder"/>
                <input type="button" class="button-primary upload_image" value="Upload image" id="upload_<?php echo $key; ?>">
                <input type="button" class="button-secondary remove_image" value="Delete" id="delete_<?php echo $key; ?>">
                <?php break;

              case 'wp_editor':
                wp_editor( $options[ $key ], $this->plugin_prefix . '_options[' . $key . ']' );
                break;

              default:
                ?>
                  <input name="<?php echo $this->plugin_prefix . '_options[' . $key . ']'; ?>"
                    type="<?php echo $value[ 'type' ]; ?>" <?php echo $checked; ?> id="<?php echo $key; ?>" <?php echo $field_value; ?> />
                <?php break;
            }
            ?>
                </td>
            </tr>
      <?php
      }
      echo "</table>";
    }

    function menu_extra_advanced_fields() {
      $options = get_option( $this->plugin_prefix . '_options' );

      ?>
      <input type="button" class="button-secondary" value="Show advanced settings" id="toggle-advanced">
      <?php

      echo "<div id='advanced_settings'>";
      echo "<table class='form-table menufication-table'>";

      // Show all available to the menus
      foreach( $this->get_extra_advanced_settings() as $key => $value ) {
        // Check whether or not to check the field and add a value
        $checked     = ( $options[ $key ] && $value[ 'type' ] == 'checkbox' ) ? 'checked' : '';
        $field_value = $value[ 'type' ] == 'text' ? 'value="' . $options[ $key ] . '"' : '';

        switch( $value[ 'type' ] ) {
          case 'select':
            ?>
            <tr class="menufication-table-tr">
                                <th class="menufication-table-th"><label for="<?php echo $key; ?>"><?php echo $value[ 'explanation' ]; ?></label></th>
                                <td class="menufication-table-td">
                                    <select name="<?php echo $this->plugin_prefix . '_options[' . $key . ']'; ?>">
                                        <?php foreach( $value[ 'value' ] as $val ) {
                                          $selected = ( $options[ $key ] == $val ) ? 'selected' : '';
                                          ?>
                                          <option value="<?php echo $val ?>" <?php echo $selected ?> > <?php echo $val ?> </option>
                                        <?php } ?>
                                    </select>
                                </td>
                            </tr>
            <?php
            break;

          case 'textarea':
            ?>
            <tr class="menufication-table-tr">
                                <th class="menufication-table-th"><label for="<?php echo $key; ?>"><?php echo $value[ 'explanation' ]; ?></label></th>
                                <td class="menufication-table-td">
                                    <textarea rows="10" cols="50" name="<?php echo $this->plugin_prefix . '_options[' . $key . ']'; ?>"><?php echo $options[ $key ]; ?></textarea>
                                </td>
                            </tr>
            <?php
            break;

          default:
            ?>
              <tr class="menufication-table-tr">
                                <th class="menufication-table-th"><label for="<?php echo $key; ?>"><?php echo $value[ 'explanation' ]; ?></label></th>
                                <td class="menufication-table-td">
                                    <input name="<?php echo $this->plugin_prefix . '_options[' . $key . ']'; ?>"
                                      type="<?php echo $value[ 'type' ]; ?>" <?php echo $checked; ?> id="<?php echo $key; ?>" <?php echo $field_value; ?> />
                                </td>
                            </tr>
            <?php
            break;
        }
      }
      echo "</table>";
      ?>

      <strong>Tip:</strong> You can bind to the custom jquery events <i>menufication-done</i>,
      <i>menufication-reset</i> and <i>menufication-reapply</i>.<br/>
      <p>Don't forget to add the following meta-tag inside your head-tag: <xmp><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></xmp>
            <strong>Known issues:</strong>
            At the moment, transforms and other fancy stuff is only supported by iOS (Safari and Chrome), and Android versions above 3.5.<br/>
                Older versions and other browsers will fall back to simple jQuery-animations with poorer perfomance.
            <br/>
            </p>
      </div>

    <?php
    }

    function get_extra_settings() {

      $settings = array(
        'enable_menufication' =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Enable Menufication?',
            'value'       => 'null'
          ),
        'headerLogo'          =>
          array(
            'type'        => 'hidden',
            'explanation' => 'Custom logo for the header',
            'value'       => ''
          ),

        'headerLogoLink'      =>
          array(
            'type'        => 'text',
            'explanation' => 'Use the header logo as a link (link here). Leave blank for no link:',
            'value'       => ''
          ),

        'menuLogo'            =>
          array(
            'type'        => 'hidden',
            'explanation' => 'Custom logo inside the menu',
            'value'       => ''
          ),
        'menuText'            =>
          array(
            'type'        => 'text',
            'explanation' => 'Text next to the button which toggles the menu, (e.g "Menu"):',
            'value'       => 'null'
          ),

        'triggerWidth'        =>
          array(
            'type'        => 'text',
            'explanation' => 'Only create the menu when the browser width is less than a certain value (default 770px).
                    Leave blank to always generate the menu.',
            'value'       => 'null'
          ),

        'addHomeLink'         =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Add a link to the websites front page as first item in the menu?',
            'value'       => 'null'
          ),

        'addHomeText'         =>
          array(
            'type'        => 'text',
            'explanation' => 'Text for front page link:',
            'value'       => 'null'
          ),

        'addSearchField'      =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Add a searchfield within the menu?',
            'value'       => 'null'
          ),

        'hideDefaultMenu'     =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Hide the original menu when creating menufication?',
            'value'       => 'null'
          ),

        'onlyMobile'          =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Only create the fly-out menu for mobile devices?',
            'value'       => 'null'
          ),

        'direction'           =>
          array(
            'type'        => 'select',
            'explanation' => 'Slide in menu from: ',
            'value'       => array( 'left', 'right' )
          ),

        'theme'               =>
          array(
            'type'        => 'select',
            'explanation' => 'Theme color: ',
            'value'       => array( 'dark', 'light' )
          )

      );

      return $settings;
    }

    function get_extra_advanced_settings() {

      $settings = array(
        'disableCSS'          =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Disable CSS loading.',
            'value'       => 'null'
          ),

        'childMenuSupport'    =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Add support for hierarchical menus (requires correct child-menu classes)',
            'value'       => 'null'
          ),

        'childMenuSelector'   =>
          array(
            'type'        => 'text',
            'explanation' => 'Child-menu classes (comma-separated list)',
            'value'       => 'null'
          ),

        'activeClassSelector' =>
          array(
            'type'        => 'text',
            'explanation' => 'Active items classes (comma-separated list, e.g sub-menu, child-menu)',
            'value'       => 'null'
          ),

        'enableSwipe'         =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Enable swipe for mobile devices? (iOS only)',
            'value'       => 'null'
          ),
        'doCapitalization'    =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Capitalize items in menu',
            'value'       => 'null'
          ),

        'supportAndroidAbove' =>
          array(
            'type'        => 'select',
            'explanation' => 'Disable CSS-transforms for Android devices below this version: (increases scrolling perfomance in some cases)',
            'value'       => array( 2, 2.5, 3, 3.5, 4, 4.5, 5 ) ),

        'disableSlideScaling' =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Disables special scaling effects when toggling the menu?',
            'value'       => null
          ),

        'toggleElement'       =>
          array(
            'type'        => 'text',
            'explanation' => 'Custom element to toggle the menu? (#my-button or .my-button)',
            'value'       => 'null'
          ),

        'customMenuElement'   =>
          array(
            'type'        => 'text',
            'explanation' => 'Custom menu element to use as responsive menu instead of a wp-menu e.g ("#my-custom-menu")',
            'value'       => 'null'
          ),

        'customFixedHeader'   =>
          array(
            'type'        => 'text',
            'explanation' => 'Custom top-element to add as position fixed header instead of default header (fix for webkit bug) )',
            'value'       => 'null'
          ),
        'addToFixedHolder'    =>
          array(
            'type'        => 'text',
            'explanation' => 'Add element to a fixed holder (-webkit-transform-bug)',
            'value'       => 'null'
          ),

        'page_menu_support'   =>
          array(
            'type'        => 'checkbox',
            'explanation' => 'Add fallback-support for default wp_page_menu?',
            'value'       => 'null'
          ),

        'wrapTagsInList'      =>
          array(
            'type'        => 'text',
            'explanation' => 'Wrap the following tags in and li-elemt',
            'value'       => 'null'
          ),

        'allowedTags'         =>
          array(
            'type'        => 'textarea',
            'explanation' => 'Tags that are allowed within the generated menu',
            'value'       => 'null'
          ),

        'customCSS'           =>
          array( 'type'        => 'textarea',
                 'explanation' => 'Custom CSS: <br/><b> TIP:</b> You may use CSS or SCSS here. It will compile on the fly.',
                 'value'       => ''
          )

      );

      return $settings;
    }

    // Set the default options here
    function get_default_options() {
      $options = array(
        'enable_menufication' => true,
        'responsive_menu'     => '',
        'page_menu_support'   => false,
        'toggleElement'       => '',
        'childMenuSelector'   => 'sub-menu, children',
        'activeClassSelector' => 'current-menu-item, current-page-item, active',
        'menuText'            => '',
        'triggerWidth'        => 770,
        'addHomeLink'         => false,
        'addHomeText'         => '',
        'enableSwipe'         => true,
        'hideDefaultMenu'     => false,
        'showHeader'          => true,
        'onlyMobile'          => false,
        'childMenuSupport'    => true,
        'supportAndroidAbove' => 3.5,
        'transitionDuration'  => 600,
        'scrollSpeed'         => 0.6,
        'customFixedHeader'   => false,
        'customMenuElement'   => '',
        'allowedTags'         => 'DIV, NAV, UL, OL, LI, A, P, H1, H2, H3, H4, SPAN, FORM, INPUT, SEARCH',
        'disableCSS'          => false,
        'customCSS'           => '',
        'direction'           => 'left',
        'header_logo'         => '',
        'theme'               => 'dark',
        'direction'           => 'left',
        'disableSlideScaling' => false,
        'doCapitalization'    => false,
        'wrapTagsInList'      => '',
        'enableMultiple'      => false
      );

      return $options;
    }

    function options_validate( $input ) {
      // No validation required
      return $input;
    }

    // Add settings link on plugin page
    function add_settings_link( $links, $file ) {

      $this_plugin = plugin_basename( dirname( dirname( __FILE__ ) ) . '/menufication.php' );

      if( $file == $this_plugin ) {
        $settings_link = '<a href="options-general.php?page=' . $this->plugin_prefix . '">Settings</a>';
        array_unshift( $links, $settings_link );
      }

      return $links;
    }

    // Remove options on deactivation
    function remove_options_on_deactivation() {
      delete_option( $this->plugin_prefix . '_options' );
    }

    function is_menufication_active() {
      $options = get_option( $this->plugin_prefix . '_options' );

      return ( $options[ 'enable_menufication' ] === 'on' );
    }

    function get_menufication_option( $option ) {
      $options = get_option( $this->plugin_prefix . '_options' );

      return $options[ $option ];
    }

  }

}
