<?php

add_action('wp_enqueue_scripts', 'reddoor_scripts');
function reddoor_scripts()
{
  wp_enqueue_script('jquery');
  wp_enqueue_style( 'style', get_stylesheet_uri() );

  wp_enqueue_script( 'bundle', get_stylesheet_directory_uri() . '/bundle.js', [], null, true );

  localize_bundle_script();
}

/** Localize bundle script with needed data */
function localize_bundle_script(){
  global $post;

  $menu_items = array_map(function($item){
    return [
      'ID' => $item->ID,
      'title' => $item->title,
      'url'   => $item->url
    ];
  },wp_get_nav_menu_items('main_menu'));

  $params = array(
    'site_url' => site_url(),
    'admin_ajax_url' => admin_url('admin-ajax.php'),
    'menuItems' => json_encode($menu_items)
  );

  $params['post'] = $post;

  $params['post']->custom_content = false;

  // Builder content case
  if($post_data = get_post_meta($post->ID, 'panels_data', true)){
    $params['post']->custom_content = true;

    $rows = rebuild_builder_content($post_data);
    $params['post']->post_content = json_encode($rows);
  }


  wp_localize_script( 'jquery', 'bundle', $params );
}

/** Rebuild builder data array */
function rebuild_builder_content($content)
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

add_action('wp_ajax_get_api', 'get_api');
add_action('wp_ajax_nopriv_get_api', 'get_api');

/** Get static api for testing */
function get_api()
{
  $file = get_stylesheet_directory() . '/test/fixtures/page_api.json';

  $content = '';

  if (file_exists($file))
    $content = file_get_contents($file);

  echo $content;
  wp_die();
}