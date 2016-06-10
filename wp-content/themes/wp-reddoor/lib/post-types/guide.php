<?php

// Register Custom Post Type
function guide_post_type() {

  register_post_type( 'rdc_guide', array(
    'label' => __( 'Guide', 'rdc' ),
    'description' => __( 'Guides.', 'rdc' ),
    'labels' => array(
      'name' => _x( 'Guides', 'Post Type General Name', 'rdc' ),
      'singular_name' => _x( 'Guide', 'Post Type Singular Name', 'rdc' ),
      'menu_name' => __( 'Guides', 'rdc' ),
      'name_admin_bar' => __( 'Guide', 'rdc' ),
      'archives' => __( 'Guide Archives', 'rdc' ),
      'parent_item_colon' => __( 'Parent Guide:', 'rdc' ),
      'all_items' => __( 'All Guides', 'rdc' ),
      'add_new_item' => __( 'Add New Guide', 'rdc' ),
      'add_new' => __( 'Add New', 'rdc' ),
      'new_item' => __( 'New Guide', 'rdc' ),
      'edit_item' => __( 'Edit Guide', 'rdc' ),
      'update_item' => __( 'Update Guide', 'rdc' ),
      'view_item' => __( 'View Guide', 'rdc' ),
      'search_items' => __( 'Search Guide', 'rdc' ),
      'not_found' => __( 'Not found', 'rdc' ),
      'not_found_in_trash' => __( 'Not found in Trash', 'rdc' ),
      'featured_image' => __( 'Featured Image', 'rdc' ),
      'set_featured_image' => __( 'Set featured image', 'rdc' ),
      'remove_featured_image' => __( 'Remove featured image', 'rdc' ),
      'use_featured_image' => __( 'Use as featured image', 'rdc' ),
      'insert_into_item' => __( 'Insert into item', 'rdc' ),
      'uploaded_to_this_item' => __( 'Uploaded to this item', 'rdc' ),
      'items_list' => __( 'Guides list', 'rdc' ),
      'items_list_navigation' => __( 'Guides list navigation', 'rdc' ),
      'filter_items_list' => __( 'Filter items list', 'rdc' ),
    ),
    'supports' => array( 'title', 'editor', 'thumbnail', 'revisions', 'excerpt', 'page-attributes' ),
    'taxonomies' => array( 'rdc_guide_category' ),
    'hierarchical' => true,
    'public' => true,
    //'query_var' => 'rdc_guide',
    'show_ui' => true,
    'show_in_menu' => true,
    'menu_position' => 5,
    'menu_icon' => 'dashicons-book',
    'show_in_admin_bar' => true,
    'show_in_nav_menus' => true,
    'can_export' => true,
    'has_archive' => 'guides',
    'exclude_from_search' => true,
    'publicly_queryable' => true,
    'rewrite' => array(
      'slug' => 'guide/%rdc_guide_category%',
      'with_front' => false,
      'pages' => true,
      'feeds' => true,
    ),
    'capability_type' => 'page',
  ) );

}

// Register Custom Taxonomy
function register_rdc_guide_category_taxonomy() {

  register_taxonomy( 'rdc_guide_category', array( 'guide' ), array(
    'labels' => array(
      'name' => _x( 'Guide Categories', 'Taxonomy General Name', 'rdc' ),
      'singular_name' => _x( 'Guide Category', 'Taxonomy Singular Name', 'rdc' ),
      'menu_name' => __( 'Categories', 'rdc' ),
      'all_items' => __( 'All Guide Categories', 'rdc' ),
      'parent_item' => __( 'Parent Guide Category', 'rdc' ),
      'parent_item_colon' => __( 'Parent Guide Category:', 'rdc' ),
      'new_item_name' => __( 'New Guide Category Name', 'rdc' ),
      'add_new_item' => __( 'Add New Guide Category', 'rdc' ),
      'edit_item' => __( 'Edit Guide Category', 'rdc' ),
      'update_item' => __( 'Update Guide Category', 'rdc' ),
      'view_item' => __( 'View Guide Category', 'rdc' ),
      'separate_items_with_commas' => __( 'Separate items with commas', 'rdc' ),
      'add_or_remove_items' => __( 'Add or remove items', 'rdc' ),
      'choose_from_most_used' => __( 'Choose from the most used', 'rdc' ),
      'popular_items' => __( 'Popular Guide Categories', 'rdc' ),
      'search_items' => __( 'Search Guide Categories', 'rdc' ),
      'not_found' => __( 'Not Found', 'rdc' ),
      'no_terms' => __( 'No items', 'rdc' ),
      'items_list' => __( 'Guide Categories list', 'rdc' ),
      'items_list_navigation' => __( 'Guide Categories list navigation', 'rdc' ),
    ),
    'hierarchical' => true,
    'public' => true,
    'query_var' => 'rdc_guide_category',
    'rewrite' => array(
      'slug' => 'guides',
      'with_front' => false,
      'hierarchical' => true
    ),
    'show_ui' => true,
    'show_admin_column' => true,
    'show_in_nav_menus' => true,
    'show_tagcloud' => false,
  ) );

}

add_filter( 'post_link', 'rdc_guide_category_permalink', 1, 3 );
add_filter( 'post_type_link', 'rdc_guide_category_permalink', 1, 3 );
add_action( 'manage_rdc_guide_posts_custom_column', 'guide_custom_columns', 10, 2 );
add_filter( 'manage_rdc_guide_posts_columns', 'set_custom_edit_guide_columns' );

function set_custom_edit_guide_columns( $columns ) {

  // hide date to add it later after thumbnail
  //unset( $columns[ 'date' ] );
  $columns[ 'guide_thumbnail' ] = __( 'Thumbnail', 'rdc' );
  //$columns[ 'date' ] = __( 'Date', 'rdc' );

  return $columns;
}

function guide_custom_columns( $column, $post_id ) {
  switch( $column ) {
    case 'guide_thumbnail':

      if( get_the_post_thumbnail_url( $post_id, 'thumbnail' ) ) {
        echo "<img src='" . get_the_post_thumbnail_url( $post_id, 'thumbnail' ) . "' width=100 />";
      }

    break;

  }
}

function rdc_guide_category_permalink( $permalink, $post_id, $leavename ) {
  //con %brand% catturo il rewrite del Custom Post Type
  if( strpos( $permalink, '%rdc_guide_category%' ) === FALSE ) return $permalink;
  // Get post
  $post = get_post( $post_id );
  if( !$post ) return $permalink;

  // Get taxonomy terms
  $terms = wp_get_object_terms( $post->ID, 'rdc_guide_category' );
  if( !is_wp_error( $terms ) && !empty( $terms ) && is_object( $terms[ 0 ] ) )
    $taxonomy_slug = $terms[ 0 ]->slug;
  else $taxonomy_slug = 'other';

  return str_replace( '%rdc_guide_category%', $taxonomy_slug, $permalink );
}

add_action( 'init', 'register_rdc_guide_category_taxonomy', 0 );

add_action( 'init', 'guide_post_type', 0 );

/**
 * Get posts and find their categories and then group
 * Or, get categories, then find posts within them
 *
 * @author potanin@UD
 * @param $options
 * @param $options.parent - Parent Guide Category.
 * @return array
 */
function rdc_generate_guide_overview( $options = false ) {

  $options = is_array($options) ? $options : array();
  $result = array();

  // get all top-level Guide categories
  $top_categories = get_terms( array(
    'taxonomy' => 'rdc_guide_category',
    'hide_empty' => isset( $options['hide_empty'] ) && $options['hide_empty'] ? $options['hide_empty'] : true,
    'parent' => isset( $options['parent'] ) && $options['parent'] ? $options['parent'] : 0
  ) );

  // iterate over each top-level Gudie category
  foreach( (array) $top_categories as $category ) {

    $result[ $category->term_id ] = array(
      "term_id" => $category->term_id,
      "name" => $category->name,
      "slug" => $category->slug,
      "group" => $category->term_group,
      "description" => $category->description,
      "image" => null,
      "posts" => array()
    );

    $_posts = get_posts(array(
      'post_type' => 'rdc_guide',
      'rdc_guide_category' => $category->slug,
      'posts_per_page' => 10,
      'order' => 'ASC',
      'orderby' => 'menu_order'
    ));

    foreach( (array) $_posts as $_post ) {
      $_thumbnail_id = get_post_thumbnail_id( $_post->ID );
      $_attachment_image_url = wp_get_attachment_image_url( $_thumbnail_id, 'full' );
      $_attachment_thumbnail_url = wp_get_attachment_image_url( $_thumbnail_id, 'thumbnail' );

      array_push($result[ $category->term_id ]['posts'], array(
        "ID" => $_post->ID,
        "title" => $_post->post_title,
        "image" => $_attachment_image_url,
        "thumbnail" => $_attachment_thumbnail_url,
      ));

      // add an existing image URL to the category image
      if( $_attachment_image_url ) {
        $result[ $category->term_id ]['image'] = $_attachment_image_url;
      }
      if( $_attachment_thumbnail_url ) {
        $result[ $category->term_id ]['thumbnail'] = $_attachment_thumbnail_url;
      }

    }

  }

  // die( '<pre>' . print_r( $result, true ) . '</pre>' );
  return $result;
  
}

function rdc_get_guide_category() {
  global $wp_query;

  $_rdc_guide_category = $wp_query->query_vars['rdc_guide_category'];

  $_term = get_term_by( 'slug', $_rdc_guide_category, 'rdc_guide_category' );

  if( is_object( $_term ) ) {
    $_term->permalink = get_term_link( $_term, 'rdc_guide_category' );
  }

  return $_term;

}


/* Rewrite urls */
//
//add_filter('rewrite_rules_array', 'rdc_guide_rewrite_rules');
//function rdc_guide_rewrite_rules($rules) {
//  $newRules  = array();
//  $newRules[''. get_home_url() .'/(.+)/(.+)/?$'] = 'index.php?rdc_guide=$matches[2]'; // my custom structure will always have the post name as the 5th uri segment
//  $newRules[''. get_home_url() .'/(.+)/?$']      = 'index.php?rdc_guide_category=$matches[1]';
//
//  return array_merge($newRules, $rules);
//}
//
//function rdc_guide_filter_post_type_link($link, $post)
//{
//  if ($post->post_type != 'rdc_guide')
//    return $link;
//
//  if ($cats = get_the_terms($post->ID, 'rdc_guide_category'))
//  {
//    $link = str_replace('%rdc_guide_category%', get_taxonomy_parents(array_pop($cats)->term_id, 'rdc_guide_category', false, '/', true), $link); // see custom function defined below
//  }
//  return $link;
//}
//add_filter('post_type_link', 'rdc_guide_filter_post_type_link', 10, 2);
//
//
//// my own function to do what get_category_parents does for other taxonomies
//function get_taxonomy_parents($id, $taxonomy, $link = false, $separator = '/', $nicename = false, $visited = array()) {
//  $chain = '';
//  $parent = &get_term($id, $taxonomy);
//
//  if (is_wp_error($parent)) {
//    return $parent;
//  }
//
//  if ($nicename)
//    $name = $parent -> slug;
//  else
//    $name = $parent -> name;
//
//  if ($parent -> parent && ($parent -> parent != $parent -> term_id) && !in_array($parent -> parent, $visited)) {
//    $visited[] = $parent -> parent;
//    $chain .= get_taxonomy_parents($parent -> parent, $taxonomy, $link, $separator, $nicename, $visited);
//
//  }
//
//  if ($link) {
//    // nothing, can't get this working :(
//  } else
//    $chain .= $name . $separator;
//  return $chain;
//}











//add_action( 'generate_rewrite_rules', 'register_rdc_guide_rewrite_rules' );
//function register_rdc_guide_rewrite_rules( $wp_rewrite ) {
//  $new_rules = array(
//      'guides/([^/]+)/?$' => 'index.php?rdc_guide_category=' . $wp_rewrite->preg_index( 1 ),
//      'guides/([^/]+)/([^/]+)/?$' => 'index.php?post_type=rdc_guide&rdc_guide_category=' . $wp_rewrite->preg_index( 1 ) . '&rdc_guide=' . $wp_rewrite->preg_index( 2 ),
//      'guides/([^/]+)/([^/]+)/page/(\d{1,})/?$' => 'index.php?post_type=rdc_guide&rdc_guide_category=' . $wp_rewrite->preg_index( 1 ) . '&paged=' . $wp_rewrite->preg_index( 3 ),
//      'guides/([^/]+)/([^/]+)/([^/]+)/?$' => 'index.php?post_type=rdc_guide&rdc_guide_category=' . $wp_rewrite->preg_index( 2 ) . '&rdc_guide=' . $wp_rewrite->preg_index( 3 ),
//  );
//  $wp_rewrite->rules = $new_rules + $wp_rewrite->rules;
//}
//// A hacky way of adding support for flexible custom permalinks
//// There is one case in which the rewrite rules from register_kb_rewrite_rules() fail:
//// When you visit the archive page for a child section(for example: http://example.com/faq/category/child-category)
//// The deal is that in this situation, the URL is parsed as a Knowledgebase post with slug "child-category" from the "category" section
//function fix_rdc_guide_subcategory_query($query) {
//  if ( isset( $query['post_type'] ) && 'rdc_guide' == $query['post_type'] ) {
//    if ( isset( $query['rdc_guide'] ) && $query['rdc_guide'] && isset( $query['rdc_guide_category'] ) && $query['rdc_guide_category'] ) {
//      $query_old = $query;
//      // Check if this is a paginated result(like search results)
//      if ( 'page' == $query['rdc_guide_category'] ) {
//        $query['paged'] = $query['name'];
//        unset( $query['rdc_guide_category'], $query['name'], $query['rdc_guide'] );
//      }
//      // Make it easier on the DB
//      $query['fields'] = 'ids';
//      $query['posts_per_page'] = 1;
//      // See if we have results or not
//      $_query = new WP_Query( $query );
//      if ( ! $_query->posts ) {
//        $query = array( 'rdc_guide_category' => $query['rdc_guide'] );
//        if ( isset( $query_old['rdc_guide_category'] ) && 'page' == $query_old['rdc_guide_category'] ) {
//          $query['paged'] = $query_old['name'];
//        }
//      }
//    }
//  }
//  return $query;
//}
//add_filter( 'request', 'fix_rdc_guide_subcategory_query', 10 );
//
//
//
//function rdc_guide_article_permalink( $article_id, $section_id = false, $leavename = false, $only_permalink = false ) {
//  $taxonomy = 'rdc_guide_category';
//  $article = get_post( $article_id );
//  $return = '<a href="';
//  $permalink = ( $section_id ) ? trailingslashit( get_term_link( intval( $section_id ), 'rdc_guide_category' ) ) : home_url( '/guides/' );
//  $permalink .= trailingslashit( ( $leavename ? "%$article->post_type%" : $article->post_name ) );
//  $return .= $permalink . '/" >' . get_the_title( $article->ID ) . '</a>';
//  return ( $only_permalink ) ? $permalink : $return;
//}
//function filter_rdc_guide_post_link( $permalink, $post, $leavename ) {
//  if ( get_post_type( $post->ID ) == 'rdc_guide' ) {
//    $terms = wp_get_post_terms( $post->ID, 'rdc_guide_category' );
//    $term = ( $terms ) ? $terms[0]->term_id : false;
//    $permalink = rdc_guide_article_permalink( $post->ID, $term, $leavename, true );
//  }
//  return $permalink;
//}
//add_filter( 'post_type_link', 'filter_rdc_guide_post_link', 100, 3 );
//function filter_rdc_guide_section_terms_link( $termlink, $term, $taxonomy = false ) {
//  if ( $taxonomy == 'rdc_guide_category' ) {
//    $section_ancestors = get_ancestors( $term->term_id, $taxonomy );
//    krsort( $section_ancestors );
//    $termlink =  home_url( '/guides/' );
//    foreach ( $section_ancestors as $ancestor ) {
//      $section_ancestor = get_term( $ancestor, $taxonomy );
//      $termlink .= $section_ancestor->slug . '/';
//    }
//    $termlink .= trailingslashit( $term->slug );
//  }
//  return $termlink;
//}
//add_filter( 'term_link', 'filter_rdc_guide_section_terms_link', 100, 3 );