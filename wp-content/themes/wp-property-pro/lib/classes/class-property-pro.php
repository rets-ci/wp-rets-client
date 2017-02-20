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

      //** Enables Customizer for Options. */
      $this->customizer();

      /** Scripts action section */
      add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts']);
      add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_scripts']);

      /** Buffering output */
      add_action('init', [$this, 'start_buffer_output_content']);
      add_action('shutdown', [$this, 'end_buffer_output_content'], 100);

      /** Disable admin bar */
      add_action('after_setup_theme', [$this, 'remove_admin_bar']);

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

      $menu_items = array_map(function ($item) {
        return [
          'ID' => $item->ID,
          'title' => $item->title,
          'url' => $item->url
        ];
      }, wp_get_nav_menu_items('main_menu'));

      $params = [
        'site_url' => site_url(),
        'admin_ajax_url' => admin_url('admin-ajax.php'),
        'template_url' => get_template_directory_uri(),
        'site_name' => esc_attr(get_bloginfo('name')),
        'menuItems' => $menu_items
      ];

      $params['post'] = [
        'post_date' => $post->post_date,
        'post_modified' => $post->post_modified,
        'post_parent' => $post->post_parent,
        'post_title' => $post->post_title,
        'post_content' => $post->post_content,
        'post_type' => $post->post_type,
        'custom_content' => false
      ];

      // Builder content case
      if ($post_data = get_post_meta($post->ID, 'panels_data', true)) {
        $params['post']['custom_content'] = true;
        $params['post']['post_content'] = self::rebuild_builder_content($post_data);
      }

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
          ob_start('property_pro_buffer_handler');
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

  }


}
