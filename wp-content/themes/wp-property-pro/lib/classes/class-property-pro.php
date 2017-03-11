<?php
/**
 * Festival Core
 *
 * @version 0.1.0
 * @author Usability Dynamics
 * @namespace UsabilityDynamics
 */
namespace UsabilityDynamics {

  use UsabilityDynamics\PropertyPro\Customizer;
  Use UsabilityDynamics\Theme\Scaffold;

  /**
   * Festival Theme
   *
   * @author Usability Dynamics
   */
  class PropertyPro extends Scaffold
  {

    /**
     * Class Initializer
     *
     * @author Usability Dynamics
     * @since 0.1.0
     */

    /** @var string */
    private $_stylesDir;

    /** @var string */
    private $_scriptsDir;

    /** @var  Customizer */
    private $customizer;

    public function __construct()
    {

      $this->_stylesDir = get_template_directory_uri() . '/static/styles/';
      $this->_scriptsDir = get_template_directory_uri() . '/static/scripts/';

      /** Enables Customizer for Options. */
      $this->customizer();

      /** Scripts action section */
      add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
      add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);

      /** Buffering output */
      add_action('init', [$this, 'start_buffer_output_content']);
      add_action('shutdown', [$this, 'end_buffer_output_content'], 100);

      /** Disable admin bar */
      add_action('after_setup_theme', [$this, 'remove_admin_bar']);

      /** Add svg to mimes types */
      if (!defined('ALLOW_UNFILTERED_UPLOADS'))
        define('ALLOW_UNFILTERED_UPLOADS', true);

      add_action('upload_mimes', [$this, 'add_svg_to_upload_mimes'], 10, 1);

    }

    /**
     * Adds settings to customizer
     * @param array $options
     */
    public function customizer($options = [])
    {

      if (class_exists('\UsabilityDynamics\PropertyPro\Customizer')) {
        $this->customizer = new Customizer();
      }
    }

    function enqueue_scripts()
    {

      wp_enqueue_script('jquery');
      wp_enqueue_style('bootstrap', $this->_stylesDir . '/src/bootstrap.min.css');
      wp_enqueue_style('style', get_stylesheet_uri());

      wp_enqueue_script('google-analytics', $this->_scriptsDir . '/src/google-analytics.js');
      wp_enqueue_script('elastic-search', $this->_scriptsDir . '/src/elasticsearch.jquery.js', [], null, true);
      wp_enqueue_script('bundle', $this->_scriptsDir . '/src/bundle.js', [], null, true);
      wp_enqueue_script('googlemaps', 'https://maps.googleapis.com/maps/api/js?v=3&key=' . GOOGLE_API_KEY);

      $params = $this->get_page_content();

      /**
       * @TODO Add elasticsearch host to wp property settings and get value from it,
       * now host value in theme composer.json
       */
      $params['elasticsearch_host'] = ELASTICSEARCH_HOST;
      wp_localize_script('jquery', 'bundle', $params);
    }

    function enqueue_admin_scripts()
    {

      wp_enqueue_style('admin_style', $this->_stylesDir . '/admin/admin.css');

      wp_register_script('admin_script', $this->_scriptsDir . '/admin/admin.js');
      wp_enqueue_script('admin_script', $this->_scriptsDir . '/admin/admin.js', [], null, true);
    }

    private function get_page_content()
    {
      global $post;

      /** Init params variable */
      $params = [
        'site_url' => site_url(),
        'admin_ajax_url' => admin_url('admin-ajax.php'),
        'template_url' => get_template_directory_uri(),
        'site_name' => esc_attr(get_bloginfo('name')),
        'static_images_url' => get_template_directory_uri() . '/static/images/src/'
      ];

      /** Build post data array */
      $params['post'] = isset($post) ? [
        'post_date' => $post->post_date,
        'post_modified' => $post->post_modified,
        'post_parent' => $post->post_parent,
        'post_title' => $post->post_title,
        'post_content' => $post->post_content,
        'post_type' => $post->post_type,
        'post_url' => get_permalink($post->ID),
        'custom_content' => false
      ] : [];

      /** Get company logos */
      $params['logos'] = [
        'square_logo' => get_theme_mod('property_pro_company_square_logo'),
        'horizontal_logo' => get_theme_mod('property_pro_company_horizontal_logo'),
        'vertical_logo' => get_theme_mod('property_pro_company_vertical_logo')
      ];

      /** Get footer menus */
      $footer_structure = [
        'top_footer' => [
          get_theme_mod('property_pro_footer_top_menu_one'),
          get_theme_mod('property_pro_footer_top_menu_two'),
          get_theme_mod('property_pro_footer_top_menu_three'),
          get_theme_mod('property_pro_footer_top_menu_four')
        ],
        'bottom_footer' => [
          'menu' => get_theme_mod('property_pro_footer_bottom_menu'),
          'social_menu' => get_theme_mod('property_pro_footer_bottom_menu_social')
        ]
      ];

      foreach ($footer_structure as $level_title => $level) {
        foreach ($level as $key => $menu_id) {
          $params['footer'][$level_title][$key]['title'] = wp_get_nav_menu_object($menu_id)->name;
          $params['footer'][$level_title][$key]['items'] = array_map(function ($item) {
            return [
              'ID' => $item->ID,
              'title' => $item->title,
              'url' => $item->url
            ];
          }, wp_get_nav_menu_items($menu_id));
        }
      }

      /** Get customizer colors settings */
      $params['colors']['primary_color'] = get_theme_mod('property_pro_primary_color');

      /** Builder content case */
      if (isset($post) && $post_data = get_post_meta($post->ID, 'panels_data', true)) {
        $params['post']['custom_content'] = true;
        $params['post']['post_content'] = self::rebuild_builder_content($post_data);
      }

      /** Get toolbar layout meta */
      $params['post']['propertypro_toolbar_layout'] = get_post_meta($post->ID, 'propertypro_toolbar_layout', true) ? get_post_meta($post->ID, 'propertypro_toolbar_layout', true) : null;
      return $params;
    }

    /** Rebuild builder data array */
    private static function rebuild_builder_content($content)
    {
      $rows = [];

      foreach ($content['widgets'] as $key => $widget) {
        $rows[$widget['panels_info']['grid']]['style'] = $content['grids'][$widget['panels_info']['grid']]['style'];

        /** Get image src */
        if (isset($widget['image']))
          $widget['image_src'] = $widget['image'] ? wp_get_attachment_image_src($widget['image'], 'full')[0] : '';

        /** Get menu items */
        if (isset($widget['menu_select']))
          $widget['menu_items'] = $widget['menu_select'] ? wp_get_nav_menu_items($widget['menu_select']) : [];

        /** Remove namespace from class name */
        if (isset($widget['panels_info']['class'])){
          $classes = explode('\\', $widget['panels_info']['class']);
          $widget['panels_info']['class'] = count($classes) ? end($classes) : '';
        }

        $fields = [];
        foreach ($widget as $k => $field) {

          if (is_array($field)) {

            /** Exclude siteorigin system field */
            if (isset($field['so_field_container_state']))
              unset($field['so_field_container_state']);

            foreach ($field as $item_key => $item)
              if (is_array($item) && array_key_exists('image', $item))
                $field[$item_key]['image_src'] = $item['image'] ? wp_get_attachment_image_src($item['image'], 'full')[0] : '';
          }

          /** Siteorigin system fields no need in fields array */
          if (in_array($k, ['_sow_form_id', 'panels_info']))
            continue;

          /** @TODO hack for array keys, because get_post_meta return keys without underscores */
          if ($k === 'search_options' && is_array($field)) {
            $new_field = [];
            foreach ($field as $field_key => $value){
              if(!$value){
                continue;
              }

              $new_field[str_replace(' ', '_', $field_key)] = $value;
            }

            $field = $new_field;
          }

          if ($k === 'posts') {

            /** explode args string */
            $argsArr = explode('&', $field);

            $args = [];

            /** Build args array for posts query */
            foreach ($argsArr as $arg) {
              $argArr = explode('=', $arg);
              $key = $argArr[0];
              $value = $argArr[1];

              if ($key === 'post_type' && $value === '_all') {
                $value = 'any';
              }

              if ($key === 'post__in') {
                $key = 'include';
                $value = explode(',', $value);
              }

              $args[$key] = $value;
            }

            $field = get_posts($args);

            /** Update posts array */
            foreach($field as &$post){
              $post->thumbnail = get_the_post_thumbnail_url($post->ID);
              $post->relative_permalink = str_replace(home_url(), "", get_permalink($post));
              $property_detail = get_property( $post->ID );
              $post->price = isset($property_detail['rets_list_price']) ? $property_detail['rets_list_price'] : '';
              $post->address = isset($property_detail['rets_address']) ? $property_detail['rets_address'] : '';
              $post->full_address = isset($property_detail['formatted_address']) ? $property_detail['formatted_address'] : '';
              $post->beds = isset($property_detail['rets_beds']) ? $property_detail['rets_beds'] : '';
              $post->baths = isset($property_detail['rets_baths_full']) ? $property_detail['rets_baths_full'] : '';

              // Get gallery images
              $post->gallery_images = [];
              if($attached_images = get_attached_media('image', $post->ID)){
                foreach ($attached_images as $im){
                  if($post->thumbnail === $im->guid){
                    continue;
                  }

                  $post->gallery_images[] = $im->guid;
                }
              }
            }
          }

          if($k === 'image_position'){
            $field = str_replace('_', ' ', $field);
          }

          /** Rebuild structure of feature groups and features */
          if($k === 'feature_groups' && is_array($field)){
            foreach ($field as &$fg){
              $fg['image_section']['image_src'] = $fg['image_section']['image'] ? wp_get_attachment_image_src($fg['image_section']['image'], 'full')[0] : '';
              unset($fg['image_section']['so_field_container_state']);

              $fg['image_section']['image_position'] = str_replace('_', ' ', $fg['image_section']['image_position']);

              if(count($fg['features'])){
                foreach ($fg['features'] as &$feature){
                  unset($feature['button_section']['so_field_container_state']);
                  unset($feature['testimonial_section']['so_field_container_state']);
                  $feature['testimonial_section']['image_src'] = $feature['testimonial_section']['image'] ? wp_get_attachment_image_src($feature['testimonial_section']['image'], 'full')[0] : '';
                  $feature['title'] = htmlspecialchars_decode($feature['title']);
                  $feature['description'] = htmlspecialchars_decode($feature['description']);
                }
              }
            }
          }

          $fields[$k] = $field;
        }

        $widget['fields'] = $fields;

        $rows[$widget['panels_info']['grid']]['cells'][] = [
          'weight' => isset($content['grid_cells'][$key]) ? $content['grid_cells'][$key]['weight'] : 0,
          'widget' => $widget
        ];

      }

      return $rows;
    }

    function start_buffer_output_content()
    {
      if (!isset($_GET['pageType']))
        return;


      switch ($_GET['pageType']) {
        case 'json':
          ob_start([$this, 'property_pro_buffer_handler']);
          break;
        default;
      }
    }

    function end_buffer_output_content()
    {
      if (!isset($_GET['pageType']))
        return;

      switch ($_GET['pageType']) {
        case 'json':
          ob_end_flush();
          break;
        default;
      }


    }

    function property_pro_buffer_handler($output)
    {
      $params = $this->get_page_content();
      return wp_json_encode($params);
    }

    function remove_admin_bar()
    {
      if (!current_user_can('administrator') && !is_admin()) {
        show_admin_bar(false);
      }
    }

    function add_svg_to_upload_mimes($upload_mimes)
    {
      $upload_mimes['svg'] = 'image/svg+xml';
      $upload_mimes['svgz'] = 'image/svg+xml';
      return $upload_mimes;
    }

  }


}