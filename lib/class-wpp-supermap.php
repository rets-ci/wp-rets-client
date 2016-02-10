<?php
/**
 * Core
 */

if(!class_exists('class_wpp_supermap')) :

class class_wpp_supermap {

  /**
   * (custom) Capability to manage the current feature
   */
  static protected $capability = "manage_wpp_supermap";

  /**
   * Special functions that must be called prior to init
   *
   */
  static public function pre_init() {
    //* Add capability */
    add_filter('wpp_capabilities', array('class_wpp_supermap', "add_capability"));
    //* Check and set specific supermap meta_keys */
    //* Check supermap markers files */
    add_filter('wpp_settings_save', array('class_wpp_supermap','settings_save'));
  }

  /**
   * Something like constructor
   *
   */
  static public function init() {

    add_filter ( 'wp_prepare_attachment_for_js',  array(__CLASS__, 'add_image_sizes_to_js') , 10, 3  );

    wp_register_script('wpp-supermap-settings', ud_get_wpp_supermap()->path( 'static/scripts/supermap.settings.js', 'url' ), array('jquery'), '1.0.0');

    add_image_size( 'supermap_marker', 32, 32, 0 );

    add_action('template_redirect', array('class_wpp_supermap','supermap_template_redirect'));

    //* Load admin header scripts */
    add_action('admin_enqueue_scripts', array('class_wpp_supermap', 'admin_enqueue_scripts'));

    add_filter('wpp_supermap_marker', array('class_wpp_supermap', 'get_marker_by_post_id'), 10, 2);

    //* Add to settings page nav */
    if(current_user_can(self::$capability)) {
      add_filter('wpp_settings_nav', array('class_wpp_supermap', 'settings_nav'));
      add_filter('wpp_property_type_settings', array('class_wpp_supermap', 'property_type_settings'), 10, 2);

      //* Add Settings Page */
      add_action('wpp_settings_content_supermap', array('class_wpp_supermap', 'settings_page'));

      //* For Admin panel */
      add_action('save_post', array('class_wpp_supermap','save_post'));

      add_action('wpp_publish_box_options', array('class_wpp_supermap','property_supermap_options'));
    }
    //** Filter meta keys during import process @author korotkov@ud */
    add_filter('wpp_xml_import_value_on_import', array('class_wpp_supermap', 'importer_meta_filter'), 10, 4);
  }

  /**
   * @param $response
   * @param $attachment
   * @param $meta
   * @return mixed
   */
  public static function add_image_sizes_to_js( $response, $attachment, $meta ) {

    $size_array = array( 'supermap_marker' ) ;

    foreach ( $size_array as $size ):

      if ( isset( $meta['sizes'][ $size ] ) ) {
        $attachment_url = wp_get_attachment_url( $attachment->ID );
        $base_url = str_replace( wp_basename( $attachment_url ), '', $attachment_url );
        $size_meta = $meta['sizes'][ $size ];

        $response['sizes'][ $size ] = array(
            'height'        => $size_meta['height'],
            'width'         => $size_meta['width'],
            'url'           => $base_url . $size_meta['file'],
            'orientation'   => $size_meta['height'] > $size_meta['width'] ? 'portrait' : 'landscape',
        );
      }

    endforeach;

    return $response;
  }

  /**
   * Adds Custom capability to the current premium feature
   *
   * @param array $capabilities
   * @return array $capabilities
   */
  static public function add_capability($capabilities) {

    $capabilities[self::$capability] = __('Manage Supermap',ud_get_wpp_supermap()->domain);

    return $capabilities;
  }

  /**
   * Adds slideshow menu to settings page navigation
   * Copyright 2010 Andy Potanin <andy.potanin@twincitiestech.com>
   *
   * @param array $tabs
   */
  static public function settings_nav($tabs) {
    $tabs['supermap'] = array(
      'slug' => 'supermap',
      'title' => __('Supermap',ud_get_wpp_supermap()->domain)
    );
    return $tabs;
  }

  /**
   * Add Supermap tab's content on Settings Page
   *
   */
  static public function settings_page() {
    global $wp_properties, $wpdb, $class_wpp_slideshow;

    wp_enqueue_media();

    $supermap_configuration = isset( $wp_properties['configuration']['feature_settings']['supermap'] ) ? 
      $wp_properties['configuration']['feature_settings']['supermap'] : array();

    $supermap_configuration = wp_parse_args( $supermap_configuration, array(
      'markers' => array(),
      'areas' => array(),
      'display_attributes' => array(),
      'hide_sidebar_thumb' => false,
      'supermap_thumb' => false,
    ) );

    //* Set default Marker */
    if(empty( $supermap_configuration['markers']) ) {
      $supermap_configuration['markers']['custom']['name'] = 'Custom';
      $supermap_configuration['markers']['custom']['file'] = '';
    }

    //* Set example of Area */
    if(empty($supermap_configuration['areas'])) {
      $supermap_configuration['areas']['example_area']['name'] = __( 'Example Area', ud_get_wpp_supermap()->domain );
      $supermap_configuration['areas']['example_area']['hoverColor'] = '';
      $supermap_configuration['areas']['example_area']['strokeColor'] = '#a49b8a';
      $supermap_configuration['areas']['example_area']['strokeOpacity'] = '#a49b8a';
      $supermap_configuration['areas']['example_area']['fillColor'] = '#a49b8a';
      $supermap_configuration['areas']['example_area']['fillOpacity'] = '0.5';
      $supermap_configuration['areas']['example_area']['paths'] = '';
    }
    ?>
    <style>
      #wpp_supermap_markers .wpp_supermap_ajax_uploader {
        position:relative;
        width: 42px;
        height: 42px;
        background: #ffffff;
        overflow:hidden;
        border: 1px solid #DFDFDF;
        text-align:center;
        cursor:pointer;
      }
      #wpp_supermap_markers .wpp_supermap_ajax_uploader div.qq-uploader {
        color:#fff;
      }
      #wpp_supermap_markers .wpp_supermap_ajax_uploader div.qq-upload-drop-area {
        display:none;
      }
      #wpp_supermap_markers .wpp_supermap_ajax_uploader .spinner {
        position:absolute;
        top:0;
        bottom:0;
        left:0;
        right:0;
        background: url(<?php echo WPP_URL; ?>images/ajax_loader.gif) center center no-repeat;
        display: none;
      }
      #wpp_supermap_markers .wpp_supermap_ajax_uploader img {
        padding:5px 0;
      }
    </style>
    <table class="form-table">
      <tbody>
        <tr valign="top">
          <th scope="row"><?php _e('Sidebar Attributes', ud_get_wpp_supermap()->domain); ?></th>
          <td>
            <p><?php _e('Select the attributes you want to display in the left sidebar on the supermap.', ud_get_wpp_supermap()->domain); ?></p>
            <div class="wp-tab-panel">
            <ul>
              <?php foreach($wp_properties['property_stats'] as $slug => $title): ?>
                <li>
                  <input <?php if(@in_array($slug, (array)$supermap_configuration['display_attributes'])) echo " CHECKED ";  ?> value='<?php echo $slug; ?>' type="checkbox" id="display_attribute_<?php echo $slug; ?>" name="wpp_settings[configuration][feature_settings][supermap][display_attributes][]" />
                  <label for="display_attribute_<?php echo $slug; ?>"><?php echo $title; ?></label>
                </li>
              <?php endforeach; ?>
            </ul>
            </div>
            <ul style="margin-top:10px;">
              <li>
                <input <?php if(@in_array('view_property', (array)$supermap_configuration['display_attributes'])) echo " CHECKED ";  ?> value='view_property' type="checkbox" id="display_attribute_view_property" name="wpp_settings[configuration][feature_settings][supermap][display_attributes][]" />
                <label for="display_attribute_view_property"><?php printf(__('Display "View %s" link in the left sidebar. It directs user to %s Page.',ud_get_wpp_supermap()->domain), WPP_F::property_label(), WPP_F::property_label()); ?></label>
              </li>
            </ul>
          </td>
        </tr>
        <tr>
          <th><?php _e('Supermap Sidebar Thumbnail:',ud_get_wpp_supermap()->domain) ?></th>
          <td>
            <ul>
              <li>
                <input <?php if( isset( $supermap_configuration['hide_sidebar_thumb'] ) ) checked( 'true', $supermap_configuration[ 'hide_sidebar_thumb' ] ); ?> value='true' type="checkbox" id="supermap_hide_sidebar_thumb" name="wpp_settings[configuration][feature_settings][supermap][hide_sidebar_thumb]" />
                <label for="supermap_hide_sidebar_thumb"><?php _e('Do not show a property thumbnail in sidebar.',ud_get_wpp_supermap()->domain) ?></label>
              </li>
              <li><?php WPP_F::image_sizes_dropdown("name=wpp_settings[configuration][feature_settings][supermap][supermap_thumb]&selected=" . $supermap_configuration['supermap_thumb']); ?></li>
              <li><?php _e('If you create a new image size, please be sure to regenerate all thumbnails. ',ud_get_wpp_supermap()->domain) ?></li>
            </ul>
          </td>
        </tr>
        <tr>
          <th><?php _e('Map Markers:',ud_get_wpp_supermap()->domain) ?></th>
          <td>
            <table id="wpp_supermap_markers" class="wpp_sortable ud_ui_dynamic_table widefat" allow_random_slug="true">
              <thead>
                <tr>
                  <th style="width:10px;" class="wpp_draggable_handle">&nbsp;</th>
                  <th style="width:50px;"><?php _e('Image',ud_get_wpp_supermap()->domain) ?></th>
                  <th style="width:150px;"><?php _e('Name',ud_get_wpp_supermap()->domain) ?></th>
                  <th style="width:250px;"><?php _e('Slug',ud_get_wpp_supermap()->domain) ?></th>
                  <th style="width:50px;">&nbsp;</th>
                </tr>
              </thead>
              <tbody>
              <?php
              $upload_dir = wp_upload_dir();
              $markers_url = $upload_dir['baseurl'] . '/supermap_files/markers';
              foreach($supermap_configuration['markers'] as $slug => $marker): ?>

                <?php
                  $marker_image_url = preg_match( '/(http|https):\/\//', $marker['file'] )
                                      ? $marker['file'] : $markers_url . '/' . $marker['file'];
                ?>

                <tr class="wpp_dynamic_table_row" slug="<?php echo $slug; ?>" new_row='false'>
                  <td class="wpp_draggable_handle">&nbsp;</td>
                  <td class="wpp_ajax_image_upload">
                    <div class="wpp_supermap_ajax_uploader">
                    <?php if(!empty($marker_image_url)) : ?>
                      <img class="wpp_marker_image" src="<?php echo $marker_image_url; ?>" alt="" />
                    <?php endif; ?>
                    </div>
                    <input type="hidden" class="wpp_supermap_marker_file" name="wpp_settings[configuration][feature_settings][supermap][markers][<?php echo $slug; ?>][file]" value="<?php echo $marker['file']; ?>" />
                  </td>
                  <td>
                    <input class="slug_setter" type="text" name="wpp_settings[configuration][feature_settings][supermap][markers][<?php echo $slug; ?>][name]" value="<?php echo $marker['name']; ?>" />
                  </td>
                  <td>
                    <input type="text" value="<?php echo $slug; ?>" readonly="readonly" class="slug wpp_marker_slug">
                  </td>
                  <td>
                    <span class="wpp_delete_row wpp_link"><?php _e('Delete',ud_get_wpp_supermap()->domain) ?></span>
                  </td>
                </tr>
              <?php endforeach; ?>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan='5'>
                  <input type="button" class="wpp_add_row button-secondary btn" value="<?php _e('Add Marker',ud_get_wpp_supermap()->domain) ?>" />
                  </td>
                </tr>
              </tfoot>
            </table>
            <script type="text/javascript">
              jQuery(document).ready(function(){

                jQuery('.wpp_ajax_image_upload').map_marker_select({
                  image: "img"
                });

                /* Remove ajaxuploader and image on Slug changing */
                jQuery('#wpp_supermap_markers input.slug').live('change', function(){
                  var e = this;
                  var row = jQuery(e).parents('.wpp_dynamic_table_row');
                  if(row.length > 0) {
                    var slug = row.attr('slug');
                    eval('window.wpp_uploader_'+slug+' = null');
                    jQuery('.wpp_supermap_ajax_uploader', row).html('');
                    jQuery('input.wpp_supermap_marker_file', row).val('');
                  }
                });

                /* Remove image from new Row */
                jQuery('#wpp_supermap_markers tr').live('added', function(){
                  jQuery('input.slug', this).trigger('change');
                });

                /* Fire event after row removing to check table's DOM */
                jQuery('#wpp_supermap_markers').live('row_removed', function(){
                  var row_count = jQuery(this).find(".wpp_delete_row:visible").length;
                  if(row_count == 1) {
                    var slug = jQuery(this).find('input.wpp_marker_slug').val();
                    if(slug == '') {
                      jQuery('.wpp_supermap_ajax_uploader', this).html('');
                      jQuery('input.wpp_supermap_marker_file', this).val('');
                      jQuery('tr', this).attr('new_row', 'true');
                    }
                  };
                });

              });
            </script>
          </td>
        </tr>
        <tr>
          <th><?php _e('Map Areas:',ud_get_wpp_supermap()->domain) ?></th>
          <td>
            <?php _e('<p>Map areas let you draw our areas on the map, such as neighborhoods.</p><p>Just add to shortcode attribute <b>show_areas=all</b> to draw all areas on the map. Also You can use area\'s slugs to show them on the map, like as <b>show_areas=new_york,washington</b>. Please, use coordinates in this format: <b>(82.72, -37.79)(69.54, -57.48)(68.93, -18.63).</b></p><p><i>This is an experimental feature, you may not want to use it on a live site.  We\'re eager to hear your feedback regarding this feature and the capabilities that would be useful to you.</i></p>',ud_get_wpp_supermap()->domain) ?>
            <table id="wpp_supermap_areas" class="ud_ui_dynamic_table widefat">
              <thead>
                <tr>
                  <th><?php _e('Name',ud_get_wpp_supermap()->domain) ?></th>
                  <th style="width:50px;"><?php _e('Coordinates',ud_get_wpp_supermap()->domain) ?></th>
                  <th><?php _e('Fill Color',ud_get_wpp_supermap()->domain) ?></th>
                  <th><?php _e('Opacity',ud_get_wpp_supermap()->domain) ?></th>
                  <th><?php _e('Stoke Color',ud_get_wpp_supermap()->domain) ?></th>
                  <th><?php _e('Hover Color',ud_get_wpp_supermap()->domain) ?></th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
              <?php
                foreach($supermap_configuration['areas'] as $slug => $area_data):  ?>
                  <tr class="wpp_dynamic_table_row" slug="<?php echo $slug; ?>" new_row='true'>
                    <td >
                      <input class="slug_setter" type="text" name="wpp_settings[configuration][feature_settings][supermap][areas][<?php echo $slug; ?>][name]" value="<?php echo $area_data['name']; ?>" />
                      <input type="text" value="<?php echo $slug; ?>" readonly="readonly" class="slug">
                    </td>
                    <td>
                      <textarea name="wpp_settings[configuration][feature_settings][supermap][areas][<?php echo $slug; ?>][paths]"><?php echo $area_data['paths']; ?></textarea>
                    </td>
                    <td>
                      <input type="text" class="wpp_input_colorpicker" id="" name="wpp_settings[configuration][feature_settings][supermap][areas][<?php echo $slug; ?>][fillColor]" value="<?php echo $area_data['fillColor']; ?>" />
                    </td>
                    <td>
                      <input style="width:40px;" type="text" name="wpp_settings[configuration][feature_settings][supermap][areas][<?php echo $slug; ?>][fillOpacity]" value="<?php echo $area_data['fillOpacity']; ?>" />
                    </td>
                    <td>
                      <input type="text" class="wpp_input_colorpicker" name="wpp_settings[configuration][feature_settings][supermap][areas][<?php echo $slug; ?>][strokeColor]" value="<?php echo $area_data['strokeColor']; ?>" />
                    </td>
                    <td>
                      <input type="text" class="wpp_input_colorpicker" name="wpp_settings[configuration][feature_settings][supermap][areas][<?php echo $slug; ?>][hoverColor]" value="<?php echo $area_data['hoverColor']; ?>" />
                    </td>
                    <td>
                      <span class="wpp_delete_row wpp_link"><?php _e('Delete',ud_get_wpp_supermap()->domain) ?></span>
                    </td>
                  </tr>
                <?php endforeach; ?>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan='7'>
                  <input type="button" class="wpp_add_row button-secondary btn" value="<?php _e('Add Row',ud_get_wpp_supermap()->domain) ?>" />
                  </td>
                </tr>
              </tfoot>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <?php
  }

  /**
   * Add supermap settings for property type
   *
   * @param $settings
   * @param $slug
   * @return $settings
   * @author Maxim Peshkov
   */
  static public function property_type_settings($settings, $slug) {
    global $wp_properties;

    $supermap_configuration = isset( $wp_properties['configuration']['feature_settings']['supermap'] ) ? 
      $wp_properties['configuration']['feature_settings']['supermap'] : array();
    $upload_dir = wp_upload_dir();
    $markers_url = $upload_dir['baseurl'] . '/supermap_files/markers';
    $markers_dir = $upload_dir['basedir'] . '/supermap_files/markers';

    $default_marker = apply_filters( 'wpp:default_pin_icon', WPP_URL . 'images/google_maps_marker.png' );

    ob_start();
    ?>
    <div class="wp-tab-panel supermap_marker_settings">
    <div class="wpp_property_type_supermap_settings">
      <div class="wpp_supermap_marker_image">
      <?php if (!empty( $supermap_configuration['property_type_markers'][$slug] ) ) : ?>
        <?php
        $marker_image_url = preg_match( '/(http|https):\/\//', $supermap_configuration['property_type_markers'][$slug] )
            ? $supermap_configuration['property_type_markers'][$slug] : $markers_url . "/" . $supermap_configuration['property_type_markers'][$slug];
        ?>
        <img src="<?php echo $marker_image_url; ?>" alt="" />
      <?php else : ?>
      <img src="<?php echo $default_marker; ?>" alt="" />
      <?php endif; ?>
      </div>
      <div class="wpp_supermap_marker_selector">
      <label for="wpp_setting_property_type_<?php echo $slug ?>_marker"><?php _e('Map Marker', ud_get_wpp_supermap()->domain); ?>:</label>
      <select class="wpp_setting_property_type_marker" id="wpp_setting_property_type_<?php echo $slug ?>_marker" name="wpp_settings[configuration][feature_settings][supermap][property_type_markers][<?php echo $slug; ?>]" >
        <option value=""><?php _e('Default by Google', ud_get_wpp_supermap()->domain); ?></option>
        <?php if( !empty( $supermap_configuration['markers'] ) && is_array( $supermap_configuration['markers'] ) ) : ?>
          <?php foreach ($supermap_configuration['markers'] as $mslug => $mvalue ) : ?>
            <option value="<?php echo $mvalue['file']; ?>" <?php selected($supermap_configuration['property_type_markers'][$slug], $mvalue['file']); ?>><?php echo $mvalue['name']; ?></option>
          <?php endforeach; ?>
        <?php endif; ?>
      </select>
      </div>
      <div class="clear"></div>
    </div>
    <script type="text/javascript">
      jQuery(document).ready(function(){
        if(typeof property_type_marker_events == 'undefined') {
          /* Change marker's image preview on marker changing */
          jQuery('select.wpp_setting_property_type_marker').live('change', function(){
            var e = jQuery(this).parents('.wpp_property_type_supermap_settings');
            var filename = jQuery(this).val();
            var rand = Math.random();
            var HTML = '';
            if(filename != '') {
              HTML = '<img src="' + filename + '?' + rand + '" alt="" />';
            } else {
              HTML = '<img src="<?php echo $default_marker; ?>" alt="" />';
            }
            e.find('.wpp_supermap_marker_image').html(HTML);
          });

          /* Fire marker's image changing Event after Row is added */
          if(jQuery('#wpp_inquiry_property_types').length > 0) {
            jQuery('#wpp_inquiry_property_types tr').live('added', function(){
              jQuery('select.wpp_setting_property_type_marker', this).trigger('change');
            });
          }

          property_type_marker_events = true;
        }
      });
    </script>
    </div>
    <?php
    $content = ob_get_contents();
    ob_end_clean();

    $settings[] = $content;

    return $settings;
  }

  /**
   * Enqueue scripts on specific pages, and print content into head
   *
   * @uses $current_screen global variable
   * @author Maxim Peshkov
   */
  static public function admin_enqueue_scripts() {
    global $current_screen, $wp_properties;

    //* WPP Settings Page */
    if($current_screen->id == 'property_page_property_settings') {
      wp_enqueue_script('wpp-supermap-settings');
    }

    //* Add custom supermap styles */
    ?>
    <style>
      .supermap_marker_settings .wpp_supermap_marker_image {
        float:left;
        position:relative;
        width: 42px;
        height: 38px;
        padding-top:5px;
        background: #ffffff;
        overflow:hidden;
        border: 1px solid #DFDFDF;
        text-align:center;
      }
      .wp-tab-panel.supermap_marker_settings {
        height:auto;
      }
      .supermap_marker_settings .wpp_supermap_marker_selector {
        margin-left:5px;
        float:left;
        width:70%;
      }
      .supermap_marker_settings .wpp_supermap_marker_selector select {
        width:100%;
      }
      .supermap_marker_settings label {
        line-height:20px;
      }
    </style>
    <?php
  }

  /**
   * Determine if post has 'supermap' shortcode and
   * Enqueue scripts and style
   *
   */
  static public function supermap_template_redirect(){
    global $post;

    if( $post && strpos($post->post_content, "supermap")) {
      wp_enqueue_script('google-maps');
      wp_enqueue_script('google-infobubble');
      wp_enqueue_script('wpp-jquery-fancybox');
      wp_enqueue_style('wpp-jquery-fancybox-css');
    }
  }

  /**
   * Adds metabox to property editor
   *
   */
  static public function add_metabox(){
    //add_meta_box( 'wp_property_supermap', __( 'Supermap Options', ud_get_wpp_supermap()->domain ), array('class_wpp_supermap','property_supermap_options'), 'property', 'side' );
  }

  /**
   * Renders content for metabox
   *
   */
  static public function property_supermap_options(){
    global $post_id, $wp_properties;

    //* Exclude From Supermap checkbox */
    $disable_exclude = get_post_meta($post_id, 'exclude_from_supermap', true);
    $text = __('Exclude property from Supermap',ud_get_wpp_supermap()->domain);
    echo WPP_F::checkbox("name=exclude_from_supermap&id=exclude_from_supermap&label=$text", $disable_exclude);

    //* START Renders Supermap Marker's settings */
    //* Get supermap marker for the current property */
    $supermap_marker = get_post_meta($post_id, 'supermap_marker', true);

    $default_marker = apply_filters( 'wpp:default_pin_icon', WPP_URL . 'images/google_maps_marker.png' );

    $supermap_configuration = !empty( $wp_properties['configuration']['feature_settings']['supermap'] ) ? $wp_properties['configuration']['feature_settings']['supermap'] : array();
    if(empty($supermap_configuration['property_type_markers'])) {
      $supermap_configuration['property_type_markers'] = array();
    }

    $property_type = get_post_meta($post_id, 'property_type', true);
    if(empty($supermap_marker) && !empty($property_type)) {
      $supermap_marker = $supermap_configuration['property_type_markers'][$property_type];
    }

    $upload_dir = wp_upload_dir();
    $markers_url = $upload_dir['baseurl'] . '/supermap_files/markers';
    $markers_dir = $upload_dir['basedir'] . '/supermap_files/markers';

    //* Set default marker image */
    if(empty($supermap_marker)) {
      $marker_url = $default_marker;
    } else {
      if ( preg_match( '/(http|https):\/\//', $supermap_marker ) ) {
        $marker_url = $supermap_marker;
      } else {
        $marker_url = $markers_url . "/" . $supermap_marker;
        $marker_dir = $markers_dir . "/" . $supermap_marker;
        if (!file_exists($marker_dir)) {
          $marker_url = $default_marker;
        }
      }
    }
    ?>
    <div class="wp-tab-panel supermap_marker_settings" id="wpp_supermap_marker_settings" style="margin-top:10px;">
      <div class="wpp_supermap_marker_image">
        <img src="<?php echo $marker_url; ?>" alt="" />
      </div>
      <div class="wpp_supermap_marker_selector">
      <label for="wpp_setting_supermap_marker"><?php _e('Map Marker', ud_get_wpp_supermap()->domain); ?>:</label>
      <select id="wpp_setting_supermap_marker" name="supermap_marker">
        <option value="default_google_map_marker"><?php _e('Default by Google', ud_get_wpp_supermap()->domain); ?></option>
        <?php if(!empty($supermap_configuration['markers'])) : ?>
          <?php foreach ($supermap_configuration['markers'] as $mslug => $mvalue) : ?>
            <?php
            $marker_image_url = preg_match( '/(http|https):\/\//', $mvalue['file'] )
                ? $mvalue['file'] : $marker_url . '/' . $mvalue['file'];
            ?>
            <option value="<?php echo $marker_image_url; ?>" <?php selected($supermap_marker, $marker_image_url); ?>><?php echo $mvalue['name']; ?></option>
          <?php endforeach; ?>
        <?php endif; ?>
      </select>
      </div>
      <div class="clear"></div>
      <script type="text/javascript">
        /* The list of markers images for property types */
        var property_type_markers = <?php echo json_encode((array)$supermap_configuration['property_type_markers']); ?>

        jQuery(document).ready(function(){
          /* Change marker image */
          jQuery('#wpp_setting_supermap_marker').live('change', function(){
            var e = jQuery('#wpp_supermap_marker_settings');
            var filename = jQuery(this).val();
            var rand = Math.random();
            var HTML = '';
            if(filename != '' && filename != 'default_google_map_marker') {
              HTML = '<img src="' + filename + '?' + rand + '" alt="" />';
            } else {
              HTML = '<img src="<?php echo $default_marker; ?>" alt="" />';
            }
            e.find('.wpp_supermap_marker_image').html(HTML);
          });

          /* Change supermap marker on Property Type 'change' Event */
          jQuery('#wpp_meta_property_type').live('change', function(){
            var property_type = jQuery(this).val();
            for(var i in property_type_markers) {
              if(property_type == i) {
                jQuery('#wpp_setting_supermap_marker').val(property_type_markers[i]);
                jQuery('#wpp_setting_supermap_marker').trigger('change');
              }
            }
          });
        });
      </script>
    </div>
    <?php
    //* END Renders Supermap Marker's settings */
  }

  /**
   * Updates/Adds custom 'supermap' postmeta on post saving
   *
   * @param int $post_id
   */
  static public function save_post($post_id){
    global $wp_properties;

    if(isset($_POST['exclude_from_supermap'])) {
      update_post_meta($post_id, 'exclude_from_supermap', $_POST['exclude_from_supermap']);
    }

    //* Save custom supermap marker for property */
    if(isset($_POST['supermap_marker'])) {
      $supermap_marker = $_POST['supermap_marker'];

      /* Determine if property marker is the same as property's 'property type' marker
       * We reset (clear) property marker to avoid the issues on 'property type' marker changes.
       * peshkov@UD
       */
      if(!empty($_POST['wpp_data']['meta']['property_type'])) {
        $property_type = $_POST['wpp_data']['meta']['property_type'];
        $supermap_configuration = isset( $wp_properties['configuration']['feature_settings']['supermap'] ) ? 
          $wp_properties['configuration']['feature_settings']['supermap'] : array();

        if(!empty($supermap_configuration['property_type_markers'])) {
          if($supermap_configuration['property_type_markers'][$property_type] == $supermap_marker) {
            $supermap_marker = '';
          }
        }
      }
      update_post_meta($post_id, 'supermap_marker', $supermap_marker);
    }
  }

  /**
   * Returns Supermap marker url for property if exists
   * If not, returns empty string
   *
   * @param string $marker_url
   * @param integer $post_id
   * @return string $marker_url
   *
   * @author Maxim Peshkov
   */
  static public function get_marker_by_post_id($marker_url = '', $post_id) {
    global $wp_properties;

    if(!isset($wp_properties['configuration']['feature_settings']['supermap'])) {
      return $marker_url;
    }

    //* Get supermap marker for the current property */
    $supermap_marker = get_post_meta($post_id, 'supermap_marker', true);

    //* Return empty string if property uses default marker */
    if($supermap_marker == 'default_google_map_marker') {
      return $marker_url;
    }

    $supermap_configuration = $wp_properties['configuration']['feature_settings']['supermap'];
    if(empty($supermap_configuration['property_type_markers'])) {
      $supermap_configuration['property_type_markers'] = array();
    }

    $property_type = get_post_meta($post_id, 'property_type', true);
    if(
      empty($supermap_marker) &&
      !empty($property_type) &&
      !empty( $supermap_configuration['property_type_markers'][$property_type] )
    ) {
      $supermap_marker = $supermap_configuration['property_type_markers'][$property_type];
    }

    $upload_dir = wp_upload_dir();
    $markers_url = $upload_dir['baseurl'] . '/supermap_files/markers';
    $markers_dir = $upload_dir['basedir'] . '/supermap_files/markers';

    //* Set default marker image */
    if(empty($supermap_marker)) {
      $marker_url = '';
    } else {
      if ( preg_match( '/(http|https):\/\//', $supermap_marker ) ) {
        $marker_url = $supermap_marker;
      } else {
        $marker_url = $markers_url . "/" . $supermap_marker;
        $marker_dir = $markers_dir . "/" . $supermap_marker;
        if(!file_exists($marker_dir)) {
          $marker_url = '';
        }
      }
    }

    return $marker_url;
  }

  /**
   * Draws Option Form on sidebar of Supermap
   *
   * @param $search_attributes
   * @param $searchable_property_types
   * @param $rand
   */
  static public function draw_supermap_options_form($search_attributes = false, $searchable_property_types = false, $rand = 0) {
    global $wp_properties;
    
    if( !empty( $_REQUEST[ 'wpp_search' ] ) ) {
    
      /** 
       * Render hidden form in case we have wpp_search request. 
       * because supermap page can be used as default search results page
       */
      $fields = array();
      foreach( $wp_properties[ 'property_stats' ] as $k => $v ) {
        if( key_exists( $k, $_REQUEST[ 'wpp_search' ] ) ) {
          $data = $_REQUEST[ 'wpp_search' ][ $k ];
          if( is_array( $data ) ) {
            foreach( $data as $name => $value ) {
              $fields[] = array(
                'name' => "wpp_search[{$k}][{$name}]",
                'value' => $value,
              );
            }
          } else {
            $fields[] = array(
              'name' => "wpp_search[{$k}]",
              'value' => $data,
            );
          }
        }
      }
      
      if( !empty( $fields ) ) {
        echo "<form id=\"formFilter_{$rand}\" name=\"formFilter\" action=\"\">";
        do_action( "draw_property_search_form", array() );
        foreach( $fields as $field ) {
          echo "<input type=\"hidden\" name=\"{$field['name']}\" value=\"{$field['value']}\" />";
        }
        echo "</form>";
      }
      
    } else {
    
      if( !$search_attributes) {
        return;
      }

      $search_values = WPP_F::get_search_values(array_keys((array)$search_attributes), $searchable_property_types );
      ?>
      <form id="formFilter_<?php echo $rand; ?>" name="formFilter" action="">
        <div class="class_wpp_supermap_elements">
          <ul>
            <?php if(is_array($search_attributes)) foreach($search_attributes as $attrib => $search_value) {
              // Don't display search attributes that have no values
              if(!isset($search_values[$attrib]))
                continue;

              $delimiter = ',';
              /* Set $search_value to use it in form fields */
              if (strtolower($search_value) == 'all') {
                $search_value = '';
              } else if (strpos($search_value, '-') !== false) {
                $v = explode('-', $search_value);
                if(is_array($v) && count($v) == 2 && ((int)$v[0] > 0 || (int)$v[1] > 0)) {
                  $delimiter = '-';
                  $search_value = array(
                    'min' => (int)$v[0],
                    'max' => (int)$v[1],
                  );
                }
              } else if (strpos($search_value, ',') !== false) {
                $v = explode(',', $search_value);
                if(is_array($v)) {
                  $search_value = $v;
                }
              }
            ?>
            <li class="seach_attribute_<?php echo $attrib; ?> field_<?php echo $wp_properties['searchable_attr_fields'][$attrib]; ?>">
              <label class="class_wpp_supermap_label class_wpp_supermap_label_<?php echo $attrib; ?>" for="class_wpp_supermap_input_field_<?php echo $attrib; ?>_<?php echo $rand; ?>">
                <?php echo (empty($wp_properties['property_stats'][$attrib]) ? ucwords($attrib) : $wp_properties['property_stats'][$attrib]) ?>:
              </label>
              <?php
              wpp_render_search_input(array(
                'attrib' => $attrib,
                'random_element_id' => "class_wpp_supermap_input_field_{$attrib}_{$rand}",
                'search_values' => $search_values,
                'value' => $search_value
              ));
              ?>
              <div class="clear"></div>
            </li>
          <?php } ?>
          </ul>
          <input class="search_b btn" type="button" value="Search" onclick="getProperties(<?php echo $rand; ?>)" />
          <div class="search_loader" style="display:none"><?php _e('Loading',ud_get_wpp_supermap()->domain) ?></div>
        </div> <?php //end of class_wpp_supermap_elements ?>
      </form>
      <?php
    }
  }

  /**
   * Check specific supermap keys to properties
   * and add/remove/modify them to avoid issues on supermap
   * &
   * Check supermap files (markers): remove unused.
   *
   * @author Maxim Peshkov
   */
  static public function settings_save($wpp_settings) {
    global $wpdb;

    //* START Markers (files) checking */
    $upload_dir = wp_upload_dir();
    $markers_dir = $upload_dir['basedir'] . '/supermap_files/markers';
    $markers = isset( $wpp_settings['configuration']['feature_settings']['supermap']['markers'] ) ? 
      (array)$wpp_settings['configuration']['feature_settings']['supermap']['markers'] : array();
      
    //* Get all markers files */
    $files = array();
    foreach ( $markers as $marker ) {
      if(!empty($marker['file'])) {
        $files[] = $marker['file'];
      }
    }
    //* Remove image if it's not related to marker */
    if(file_exists($markers_dir)) {
      if ($dh = opendir($markers_dir)) {
        while (($file = readdir($dh)) !== false) {
          if (!is_dir($file) && preg_match("/(.*)\.(bmp|jpe?g|gif|png)$/", $file, $matches)) {
            if (!in_array($file, $files)) {
              unlink($markers_dir . '/' . $file);
            }
          }
        }
        closedir($dh);
      }
    }
    //* END Markers (files) checking */
    return $wpp_settings;
  }

  /**
   * Filters every import attribute
   *
   * @global array $wp_properties
   * @param mixed $value
   * @param string $attribute
   * @param string $type
   * @param int $post_id
   * @return mixed
   * @author korotkov@ud
   */
  static public function importer_meta_filter( $value, $attribute, $type, $post_id ) {
    global $wp_properties;

    /**
     * Add missed meta required for Supermap
     */
    if ( $type && $type == 'meta_field' ) {
      $address_attribute = !empty( $wp_properties['configuration']['address_attribute'] ) ? $wp_properties['configuration']['address_attribute'] : '';
      if ( $address_attribute == $attribute ) {
        update_post_meta($post_id, 'exclude_from_supermap', 'false');
      }
    }

    return $value;
  }

  /**
   * Renders supermap.
   * Deprecated. Use do_shortcode( '[supermap]' ) instead.
   *
   * @deprecated 4.0.4
   */
  static function shortcode_supermap( $atts = '' ) {
    //_deprecated_function( __FUNCTION__, '2.1.0', 'do_shortcode([supermap])' );
    return UsabilityDynamics\WPP\Supermap_Shortcode::render( $atts );
  }

}

endif; // Class Exists
