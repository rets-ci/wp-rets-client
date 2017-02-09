<?php

define("OPTION_PERSON_BRANDING", "person_branding");
define("OPTION_COMPANY_BRANDING", "company_branding");

define("DEFAULT_SELECT_VALUE", "select");

define("BRAND_TYPE_COMPANY", "company");
define("BRAND_TYPE_PERSON", "person");

if( class_exists( 'SiteOrigin_Widget' ) ) {
  require_once get_template_directory() . '/lib/widgets/property-pro-masthead/property_pro_masthead.php';
}


add_action('wp_enqueue_scripts', 'property_pro_scripts');
function property_pro_scripts()
{
  wp_enqueue_script('jquery');
  wp_enqueue_style('style', get_stylesheet_uri());
  wp_enqueue_style('style', get_stylesheet_directory_uri().'/bootstrap.min.js');

  wp_enqueue_script('google-analytics', get_stylesheet_directory_uri() . '/google-analytics.js');
  wp_enqueue_script('elastic-search', get_stylesheet_directory_uri() . '/elasticsearch.jquery.js', [], null, true);
  wp_enqueue_script('bundle', get_stylesheet_directory_uri() . '/bundle.js', [], null, true);

  wp_enqueue_script('googlemaps', 'https://maps.googleapis.com/maps/api/js?v=3&key=' . GOOGLE_API_KEY);

  $params = property_pro_get_page_content();
  wp_localize_script('jquery', 'bundle', $params);
}

function property_pro_admin_scripts()
{
  wp_enqueue_style('admin_style', get_stylesheet_directory_uri() . '/admin.css');

  wp_register_script('admin_script', get_stylesheet_directory_uri() . '/admin.js');
  wp_enqueue_script('admin_script', get_stylesheet_directory_uri() . '/admin.js', [], null, true);
}

add_action('admin_enqueue_scripts', 'property_pro_admin_scripts');

/** Rebuild builder data array */
function property_pro_rebuild_builder_content($content)
{
  $rows = [];

  foreach ($content['widgets'] as $key => $widget) {
    $rows[$widget['panels_info']['grid']]['style'] = $content['grids'][$widget['panels_info']['grid']]['style'];
    $rows[$widget['panels_info']['grid']]['cells'][] = [
      'weight' => $content['grid_cells'][$key]['weight'],
      'widget' => $widget
    ];
  }

  return $rows;
}


function property_pro_start_buffer_output_content()
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

add_action('init', 'property_pro_start_buffer_output_content');
function property_pro_end_buffer_output_content()
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

add_action('shutdown', 'property_pro_end_buffer_output_content', 100);

function property_pro_buffer_handler($output)
{
  $params = property_pro_get_page_content();
  return wp_json_encode($params);
}

function property_pro_get_page_content()
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
    $params['post']['post_content'] = property_pro_rebuild_builder_content($post_data);
  }

  return $params;
}

add_action('after_setup_theme', 'property_pro_remove_admin_bar');
function property_pro_remove_admin_bar()
{
  if (!current_user_can('administrator') && !is_admin()) {
    show_admin_bar(false);
  }
}

/** @var WP_Customize_Manager $wp_customize */
function property_pro_customize_register($wp_customize)
{

  /** COLORS */

  $primary_color = $wp_customize->add_setting('primary_color', [
      'default' => '#000000',
      'capability' => 'edit_theme_options'
    ]
  );

  $secondary_color = $wp_customize->add_setting('secondary_color', [
      'default' => '#000000',
      'capability' => 'edit_theme_options'
    ]
  );

  $color_section = $wp_customize->add_section('property_pro_colors_section', [
      'title' => 'Colors',
      'priority' => 30,
    ]
  );

  $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'primary_color', [
      'label' => __('Primary Color', 'pp'),
      'section' => $color_section->id,
      'settings' => $primary_color->id
    ]
  ));

  $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'secondary_color', [
      'label' => __('Secondary Color', 'pp'),
      'section' => $color_section->id,
      'settings' => $secondary_color->id
    ]
  ));


  /** FONTS */

  $heading_font_setting = $wp_customize->add_setting('heading_font', [
      'default' => DEFAULT_SELECT_VALUE,
      'capability' => 'edit_theme_options',
      'type' => 'option'
    ]
  );

  $body_font_setting = $wp_customize->add_setting('body_font', [
      'default' => DEFAULT_SELECT_VALUE,
      'capability' => 'edit_theme_options',
      'type' => 'option'
    ]
  );

  $fonts_section = $wp_customize->add_section('property_pro_fonts_section', [
      'title' => 'Fonts',
      'priority' => 30,
    ]
  );

  $wp_customize->add_control('heading_font_control', [
      'settings' => $heading_font_setting->id,
      'label' => 'Select heading font:',
      'section' => $fonts_section->id,
      'type' => 'select',
      'choices' => [
        DEFAULT_SELECT_VALUE => 'Make a choice',
        'arial' => 'Arial, Helvetica, sans-serif',
        'arial_black' => '"Arial Black", Gadget, sans-serif',
        'comic_sans' => '"Comic Sans MS", cursive, sans-serif',
        'lucida' => '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
        'tahoma' => 'Tahoma, Geneva, sans-serif',
        'trebuchet' => '"Trebuchet MS", Helvetica, sans-serif',
        'verdana' => 'Verdana, Geneva, sans-serif'
      ],
    ]
  );

  $wp_customize->add_control('body_font_control', [
      'settings' => $body_font_setting->id,
      'label' => 'Select body font:',
      'section' => $fonts_section->id,
      'type' => 'select',
      'choices' => [
        DEFAULT_SELECT_VALUE => 'Make a choice',
        'arial' => 'Arial, Helvetica, sans-serif',
        'arial_black' => '"Arial Black", Gadget, sans-serif',
        'comic_sans' => '"Comic Sans MS", cursive, sans-serif',
        'lucida' => '"Lucida Sans Unicode", "Lucida Grande", sans-serif',
        'tahoma' => 'Tahoma, Geneva, sans-serif',
        'trebuchet' => '"Trebuchet MS", Helvetica, sans-serif',
        'verdana' => 'Verdana, Geneva, sans-serif'
      ],
    ]
  );


  /** BRANDING */
  $brand_type_setting = $wp_customize->add_setting('brand_type', [
      'default' => DEFAULT_SELECT_VALUE,
      'transport' => 'default',
      'capability' => 'edit_theme_options',
      'type' => 'option'
    ]
  );

  $company_option_setting = $wp_customize->add_setting(OPTION_COMPANY_BRANDING, [
      'default' => DEFAULT_SELECT_VALUE,
      'capability' => 'edit_theme_options',
      'type' => 'option'
    ]
  );

  $person_option_setting = $wp_customize->add_setting(OPTION_PERSON_BRANDING, [
      'default' => DEFAULT_SELECT_VALUE,
      'capability' => 'edit_theme_options',
      'type' => 'option'
    ]
  );

  $brand_section = $wp_customize->add_section('property_pro_branding_section', [
      'title' => 'Branding',
      'priority' => 30,
    ]
  );

  $wp_customize->add_control('brand_type_control', [
      'settings' => $brand_type_setting->id,
      'label' => 'Select type:',
      'section' => $brand_section->id,
      'type' => 'select',
      'choices' => [
        DEFAULT_SELECT_VALUE => 'Make a choice',
        BRAND_TYPE_COMPANY => 'Company',
        BRAND_TYPE_PERSON => 'Person'
      ],
    ]
  );

  $brand_type_value = get_option('brand_type');
  $company_branding_control_id = OPTION_COMPANY_BRANDING . '_control';
  if ($brand_type_value != BRAND_TYPE_COMPANY)
    $company_branding_control_id = OPTION_COMPANY_BRANDING . '_control_hidden';

  $wp_customize->add_control($company_branding_control_id, [
      'settings' => $company_option_setting->id,
      'label' => 'Select company branding:',
      'section' => $brand_section->id,
      'type' => 'select',
      'choices' => [
        DEFAULT_SELECT_VALUE => 'Make a choice',
        'square_logo' => 'Square logo',
        'horizontal_logo' => 'Horizontal Logo',
        'vertical_logo' => 'Vertical Logo'
      ],
    ]
  );

  $person_branding_control_id = OPTION_PERSON_BRANDING . '_control';
  if ($brand_type_value != BRAND_TYPE_PERSON)
    $person_branding_control_id = OPTION_PERSON_BRANDING . '_control_hidden';

  $wp_customize->add_control($person_branding_control_id, [
      'settings' => $person_option_setting->id,
      'label' => 'Select person branding:',
      'section' => $brand_section->id,
      'type' => 'select',
      'choices' => [
        DEFAULT_SELECT_VALUE => 'Make a choice',
        'headshot' => 'Headshot',
        'name' => 'Name',
        'credential' => 'Credential'
      ],
    ]
  );

}

add_action('customize_register', 'property_pro_customize_register');