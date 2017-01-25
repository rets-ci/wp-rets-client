<?php

define("GOOGLE_API_KEY", "AIzaSyAry82nr4I2Z57zobDmCkSqAM-vhPmCWss");

add_action('wp_enqueue_scripts', 'property_pro_scripts');
function property_pro_scripts()
{
  wp_enqueue_script('jquery');
  wp_enqueue_style('style', get_stylesheet_uri());

  wp_enqueue_script('googlemaps', 'https://maps.googleapis.com/maps/api/js?v=3&key='.GOOGLE_API_KEY);

  wp_enqueue_script('bundle', get_stylesheet_directory_uri() . '/bundle.js', [], null, true);
  $params = property_pro_get_page_content();
  wp_localize_script('jquery', 'bundle', $params);
}

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

  $params = array(
    'site_url' => site_url(),
    'admin_ajax_url' => admin_url('admin-ajax.php'),
    'menuItems' => $menu_items
  );

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
function property_pro_remove_admin_bar() {
  if (!current_user_can('administrator') && !is_admin()) {
    show_admin_bar(false);
  }
}