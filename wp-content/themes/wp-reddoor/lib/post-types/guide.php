<?php

// Register Custom Post Type
function guide_post_type() {

  register_post_type( 'rdc_guide', array(
    'label' => __( 'Guide', 'text_domain' ),
    'description' => __( 'Guides.', 'text_domain' ),
    'labels' => array(
      'name' => _x( 'Guides', 'Post Type General Name', 'text_domain' ),
      'singular_name' => _x( 'Guide', 'Post Type Singular Name', 'text_domain' ),
      'menu_name' => __( 'Guides', 'text_domain' ),
      'name_admin_bar' => __( 'Guide', 'text_domain' ),
      'archives' => __( 'Guide Archives', 'text_domain' ),
      'parent_item_colon' => __( 'Parent Guide:', 'text_domain' ),
      'all_items' => __( 'All Guides', 'text_domain' ),
      'add_new_item' => __( 'Add New Guide', 'text_domain' ),
      'add_new' => __( 'Add New', 'text_domain' ),
      'new_item' => __( 'New Guide', 'text_domain' ),
      'edit_item' => __( 'Edit Guide', 'text_domain' ),
      'update_item' => __( 'Update Guide', 'text_domain' ),
      'view_item' => __( 'View Guide', 'text_domain' ),
      'search_items' => __( 'Search Guide', 'text_domain' ),
      'not_found' => __( 'Not found', 'text_domain' ),
      'not_found_in_trash' => __( 'Not found in Trash', 'text_domain' ),
      'featured_image' => __( 'Featured Image', 'text_domain' ),
      'set_featured_image' => __( 'Set featured image', 'text_domain' ),
      'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
      'use_featured_image' => __( 'Use as featured image', 'text_domain' ),
      'insert_into_item' => __( 'Insert into item', 'text_domain' ),
      'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
      'items_list' => __( 'Guides list', 'text_domain' ),
      'items_list_navigation' => __( 'Guides list navigation', 'text_domain' ),
      'filter_items_list' => __( 'Filter items list', 'text_domain' ),
    ),
    'supports' => array( 'title', 'editor', 'thumbnail', 'revisions', ),
    'taxonomies' => array( 'rdc_guide_category' ),
    'hierarchical' => true,
    'public' => true,
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
      'name' => _x( 'Guide Categories', 'Taxonomy General Name', 'text_domain' ),
      'singular_name' => _x( 'Guide Category', 'Taxonomy Singular Name', 'text_domain' ),
      'menu_name' => __( 'Categories', 'text_domain' ),
      'all_items' => __( 'All Guide Categories', 'text_domain' ),
      'parent_item' => __( 'Parent Guide Category', 'text_domain' ),
      'parent_item_colon' => __( 'Parent Guide Category:', 'text_domain' ),
      'new_item_name' => __( 'New Guide Category Name', 'text_domain' ),
      'add_new_item' => __( 'Add New Guide Category', 'text_domain' ),
      'edit_item' => __( 'Edit Guide Category', 'text_domain' ),
      'update_item' => __( 'Update Guide Category', 'text_domain' ),
      'view_item' => __( 'View Guide Category', 'text_domain' ),
      'separate_items_with_commas' => __( 'Separate items with commas', 'text_domain' ),
      'add_or_remove_items' => __( 'Add or remove items', 'text_domain' ),
      'choose_from_most_used' => __( 'Choose from the most used', 'text_domain' ),
      'popular_items' => __( 'Popular Guide Categories', 'text_domain' ),
      'search_items' => __( 'Search Guide Categories', 'text_domain' ),
      'not_found' => __( 'Not Found', 'text_domain' ),
      'no_terms' => __( 'No items', 'text_domain' ),
      'items_list' => __( 'Guide Categories list', 'text_domain' ),
      'items_list_navigation' => __( 'Guide Categories list navigation', 'text_domain' ),
    ),
    'hierarchical' => true,
    'public' => true,
    'query_var' => 'rdc_guide_category',
    'rewrite' => array(
      'slug' => 'rdc_guide_category'
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
add_filter( 'manage_rdc_guide_posts_columns', 'set_custom_edit_book_columns' );

function set_custom_edit_book_columns( $columns ) {
  $columns[ 'thumbnail' ] = __( 'Thumbnail', 'your_text_domain' );

  return $columns;
}

function guide_custom_columns( $column, $post_id ) {
  switch( $column ) {
    case 'thumbnail':
      echo "<img src='" . get_the_post_thumbnail_url( $post_id, 'thumbnail' ) . "' width=100 />";
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