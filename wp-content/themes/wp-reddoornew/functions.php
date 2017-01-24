<?php

add_action('wp_enqueue_scripts', 'reddoor_scripts');
function reddoor_scripts()
{
  wp_enqueue_script('jquery');
  wp_enqueue_style('style', get_stylesheet_uri());

  wp_enqueue_script('bundle', get_stylesheet_directory_uri() . '/bundle.js', [], null, true);
  $params = reddoor_get_page_content();
  wp_localize_script('jquery', 'bundle', $params);
}

/** Rebuild builder data array */
function reddoor_rebuild_builder_content($content)
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


function reddoor_start_buffer_output_content()
{
  if (!isset($_GET['pageType']))
    return;


  switch ($_GET['pageType']) {
    case 'json':
      ob_start('reddoor_buffer_handler');
      break;
    default;
  }
}

add_action('init', 'reddoor_start_buffer_output_content');
function reddoor_end_buffer_output_content()
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

add_action('shutdown', 'reddoor_end_buffer_output_content', 100);

function reddoor_buffer_handler($output)
{
  $params = reddoor_get_page_content();
  return wp_json_encode($params);
}

function reddoor_get_page_content()
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

  $params['post'] = $post;

  $params['post']->custom_content = false;

  // Builder content case
  if ($post_data = get_post_meta($post->ID, 'panels_data', true)) {
    $params['post']->custom_content = true;
    $params['post']->post_content = reddoor_rebuild_builder_content($post_data);
  }

  return $params;
}