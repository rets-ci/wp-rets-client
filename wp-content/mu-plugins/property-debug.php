<?php


add_action( 'add_meta_boxes', function() {
  add_meta_box( 'meta', __( 'Meta Prints' ), 'property_meta_prints', 'property' );
} );

function property_meta_prints( $post ) {


  $taxonomies = get_object_taxonomies($post);

  foreach( $taxonomies as $taxonomy ) {
    $terms = wp_get_object_terms( $post->ID, $taxonomy );

    if( !empty( $terms ) ) {

      echo "<h1><b>$taxonomy</b></h1>";

      /*
      echo "<pre>";
      print_r( get_taxonomy( $taxonomy ) );
      echo "</pre>";
      //*/

      foreach( $terms as $term ) {

        $meta = get_term_meta( $term->term_id );

        if( !empty( $meta ) ) {
          foreach( $meta as $k => $v ) {
            $meta[$k] = count($v) == 1 ? $v[0] : $v;
          }
        }

        $term->meta = $meta;

        $term->link = get_term_link( $term );

        //if( !empty( $meta ) ) {
          echo "<pre>";
          print_r( $term );
          echo "</pre>";
        //}

      }


    }

  }


  //*
  echo "<h1>Property</h1>";

  $property = get_property( $post->ID, array(
    'get_children'          => 'false',
    'return_object'         => 'false',
    'load_gallery'          => 'false',
    'load_thumbnail'        => 'false',
    'load_parent'           => 'false',
    'cache'                 => 'false',
  ) );

  unset( $property[ 'gallery' ] );
  unset( $property[ 'images' ] );
  unset( $property[ 'rets_media' ] );

  echo "<pre>";
  print_r( $property );
  echo "</pre>";
  //*/


  /*
  echo "<h1>Attributes</h1>";

  echo "<pre>";
  print_r( ud_get_wp_property( 'property_stats' ) );
  echo "</pre>";
  //*/

  /*
  echo "<h1>Taxonomies</h1>";

  echo "<pre>";
  print_r( array_keys( ud_get_wp_property( 'taxonomies' ) ) );
  echo "</pre>";
  //*/

}