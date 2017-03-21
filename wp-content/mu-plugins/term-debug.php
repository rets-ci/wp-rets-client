<?php

class Terms_Statistic {

  var $post_type = 'property';

  var $fix = false;

  var $normal_terms;

  var $broken_terms;

  function __construct( $args = array() ) {

    ini_set( 'memory_limit', -1 );

    $args = wp_parse_args( $args, array(
      'post_type' => 'property'
    ) );
    foreach( $args as $k => $v ) {
      if( isset( $this->{$k} ) ) {
        $this->{$k} = $v;
      }
    }
    $this->broken_terms = array();
    add_action( 'init', array( $this, 'scroll_terms' ) );
  }

  /**
   * Scrolls terms and checks parent terms
   */
  function scroll_terms() {
    $taxonomies = get_object_taxonomies( $this->post_type );

    foreach( $taxonomies as $taxonomy ) {
      $terms = get_terms( $taxonomy );

      foreach( $terms as $term ) {
        if( $term->parent > 0 ) {
          $this->check_parent( $term->parent, $taxonomy );
        }
      }

    }

    $broken_total = 0;
    foreach( $this->broken_terms as $list ) {
      $broken_total += count( $list );
    }

    echo "<h1>Total broken parent terms: " . $broken_total . "</h1>";

    echo "<pre>";
    print_r( $this->broken_terms );
    echo "</pre>";
    //die();

    echo "<h1>Correct parent terms</h1>";

    echo "<pre>";
    print_r( $this->normal_terms );
    echo "</pre>";
    die();

  }

  /**
   * @param $term_id
   * @param $taxonomy
   * @return array
   */
  function check_parent( $term_id, $taxonomy ) {
    global $wpdb;

    $term = get_term( $term_id, $taxonomy );
    if( !$term || is_wp_error( $term ) ) {

      if( !isset( $this->broken_terms[ $taxonomy ] ) ) {
        $this->broken_terms[ $taxonomy ] = array();
      } else if( array_key_exists( $term_id, $this->broken_terms[ $taxonomy ] ) ) {
        return;
      }

      //echo "Term ID [$term_id]. Taxonomy [$taxonomy]<br/>";

      $term_name = $wpdb->get_var( $wpdb->prepare( "SELECT name FROM $wpdb->terms WHERE term_id = %d", $term_id ) );

      $this->broken_terms[ $taxonomy ][$term_id] = $term_name;

    } else {
      if( !isset( $this->normal_terms[ $taxonomy ] ) ) {
        $this->normal_terms[ $taxonomy ] = array();
      }
      $this->normal_terms[ $taxonomy ][ $term_id ] = $term->name;
    }
    if( $term->parent > 0 ) {
      $this->check_parent( $term->parent, $taxonomy );
    }
    return;
  }


}

if( isset( $_REQUEST[ 'terms_statistic' ] ) ) {
  new Terms_Statistic();
}

