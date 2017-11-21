<?php
/**
 *
 * @TODO: plugin was cut from WP-Property. We still need to move ElasticPress plugin from WP-Property vendor. peshkov@UD
 */

namespace UsabilityDynamics\WPP {

  global $es_terms;

  include_once( __DIR__ . '/lib/class-elasticsearch.php' );
  include_once( __DIR__ . '/lib/class-elasticsearch-terms.php' );

  $es = new Elasticsearch();

  // Handles indexing of Terms
  $es_terms = new Elasticsearch_Terms();

  /**
   * Support for Extended Term.
   *
   * After Extended Term post type is updated and Associated Term is found, - we call the action
   * which triggers re-indexing the term in Elasticsearch
   */
  add_action( 'et_term_meta_updated', function( $term_id, $taxonomy ) {
    global $es_terms;

    $term = get_term( $term_id, $taxonomy, ARRAY_A );

    $es_terms->queue_term( $taxonomy, $term );
    $es_terms->bulk_index();

  }, 10, 2 );

}