<?php

add_action('wp_enqueue_scripts', 'reddoor_scripts');
function reddoor_scripts()
{
  wp_enqueue_script('jquery');
  wp_enqueue_style( 'style', get_stylesheet_uri() );

  wp_enqueue_script( 'react', get_stylesheet_directory_uri() . '/react.min.js');
  wp_enqueue_script( 'react-dom', get_stylesheet_directory_uri() . '/react-dom.min.js', [], null, true);
  wp_enqueue_script( 'browser', get_stylesheet_directory_uri() . '/browser.min.js', array('jquery'), null, true);

  /** @hack Included in footer.php */
//  wp_enqueue_script( 'appjs', get_stylesheet_directory_uri() . '/app.jsx', array( 'jquery', 'react', 'react-dom', 'browser' ), null, true );
}

/** Function for override script type */
//function _react_add_babel_type( $tag, $handle, $src ) {
//
//  if ( $handle !== 'appjs' ) {
//    return $tag;
//  }
//
//
//  return '<script src="' . $src . '" type="text/babel"></script>' . "\n";
//}
//add_filter( 'script_loader_tag', '_react_add_babel_type', 10, 3 );



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
