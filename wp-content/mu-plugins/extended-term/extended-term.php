<?php
/**
 * Plugin Name: Extended Term
 * Plugin URI: https://udx.io/plugins/
 * Description: Extends Term with custom associated extended_term post_type.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: https://udx.io
 *
 */

if ( ! defined( 'ABSPATH' ) ) {
  exit; // Exit if accessed directly.
}

if( !class_exists( 'UD_Extended_Term_Post_type' ) ) {

  /**
   *
   *
   */
  class UD_Extended_Term_Post_type {

    static $post_type = 'extended_term';

    static $associated_taxonomy_slug = 'et_associated_taxonomy';

    var $taxonomies = array();

    /**
     *
     */
    public function __construct() {

      // Register Extended Term and its Taxonomies
      add_action( 'init', array( $this, 'register_post_type' ) );
      add_action( 'init', array( $this, 'register_taxonomies' ), 100 );

      // Add Image Meta Box, if Meta Box plugin is activated
      add_filter( 'rwmb_meta_boxes', array( $this, 'rwmb_meta_boxes' ) );

      // Associate Extended Post with Term
      add_filter( 'save_post_' . self::$post_type, array( $this, 'associate_post' ), 999, 2 );
      add_action( 'edited_term', array( $this, 'associate_term' ), 999, 3 );
      add_action( 'created_term', array( $this, 'associate_term' ), 999, 3 );

    }

    /**
     * @param $term_id
     * @param $tt_id
     * @param $taxonomy
     */
    public function associate_term( $term_id, $tt_id, $taxonomy ) {

      $term = get_term( $term_id );

      $posts = get_posts( array(
        'numberposts' => 1,
        'post_type' => self::$post_type,
        'title' => $term->name,
        'tax_query' => array(
          array(
            'taxonomy' => self::$associated_taxonomy_slug,
            'field'    => 'slug',
            'terms'    => $taxonomy,
          ),
        ),
      ) );

      if( empty( $posts ) ) {
        return;
      }

      $post = array_shift($posts);

      $termmeta = $this->get_term_meta( $post->ID );

      $this->update_term_meta( $term_id, $termmeta );

    }

    /**
     * Fires when Extended Term post created/updated.
     *
     * @param $post_id
     * @param $post
     */
    public function associate_post( $post_id, $post ) {

      $termmeta = $this->get_term_meta( $post_id );

      $terms = wp_get_object_terms( $post_id, array( self::$associated_taxonomy_slug ) );

      foreach( $terms as $term ) {

        // Be sure that Associated Taxonomy is not tied to Extend Term Taxonomies.
        if( array_key_exists( $term->slug, $this->taxonomies ) ) {
          continue;
        }

        // Try to detect Term by Name
        $associated_tem = get_term_by( 'name', $post->post_title, $term->slug );
        // On false, try to detect term by Slug
        if( !$associated_tem ) {
          $associated_tem = get_term_by( 'slug', $post->post_name, $term->slug );
        }

        if( $associated_tem ) {

          $this->update_term_meta( $associated_tem->term_id, $termmeta );

          do_action( 'et_term_meta_updated', $associated_tem->term_id, $term->slug, $termmeta );

        }

      }

    }

    /**
     *
     * @param $term_id
     * @param $meta
     */
    public function update_term_meta( $term_id, $meta ) {

      // Be sure to flush all meta tied to Extended Term at first
      $existing_meta = get_term_meta( $term_id );
      foreach( array_keys( $existing_meta ) as $meta_key ) {
        if( strpos( $meta_key, 'et_' ) === 0 ) {
          delete_term_meta( $term_id, $meta_key );
        }
      }

      foreach( $meta as $meta_key => $values ) {
        delete_term_meta( $term_id, $meta_key );
        if( is_string($values) ) {
          $values = array($values);
        }
        foreach( $values as $value ) {
          if( empty( $value ) ) {
            continue;
          }
          add_term_meta( $term_id, $meta_key, $value, false );
        }
      }

    }

    public function get_term_meta_key( $key ) {
      $key = 'et_' . preg_replace( '/^et_/', '', trim( $key, '_' ) );
      return $key;
    }

    /**
     *
     *
     * @param $post_id
     * @return array
     */
    public function get_term_meta( $post_id ) {
      $termmeta = array();

      $termmeta[ $this->get_term_meta_key( 'post_excerpt' ) ] = get_the_excerpt( $post_id );

      $taxonomies = array();
      foreach( array_keys( $this->taxonomies ) as $taxonomy ) {
        if( $taxonomy == self::$associated_taxonomy_slug ) {
          continue;
        }
        array_push( $taxonomies, $taxonomy );
      }

      $terms = wp_get_object_terms( $post_id, $taxonomies );

      foreach( $terms as $term ) {
        if( !isset( $termmeta[ $this->get_term_meta_key( $term->taxonomy ) ] ) ) {
          $termmeta[ $this->get_term_meta_key( $term->taxonomy ) ] = array();
        }
        array_push( $termmeta[ $this->get_term_meta_key( $term->taxonomy ) ], $term->name );
      }

      $meta = get_post_meta( $post_id );

      foreach( $meta as $k => $v ) {

        $value = null;

        switch( $k ) {
          case '_edit_lock':
          case '_edit_last':
            continue;
          case '_thumbnail_id':
          case 'et_images':
            $value = array();
            foreach( $v as $attachment_id ) {
              $uri = wp_get_attachment_url( $attachment_id );
              if( $uri ) {
                array_push( $value, $uri );
              }
            }
            break;
          default:
            $value = $v;
            break;

        }

        if ( !empty( $value ) ) {
          $termmeta[ $this->get_term_meta_key($k) ] = $value;
        }

      }

      return $termmeta;

    }

    /**
     *
     */
    public function rwmb_meta_boxes( $meta_boxes ) {

      $meta_boxes[] = array(
        'id' => 'et_media',
        'title' => __( 'Media' ),
        'post_types' => array( self::$post_type ),
        'context' => 'advanced',
        'priority' => 'default',
        'autosave' => false,
        'fields' => array(
          array(
            'id' => 'et_images',
            'type' => 'image_advanced'
          ),
        ),
      );

      return $meta_boxes;

    }

    /**
     * Register Post Type
     */
    public function register_post_type() {

      register_post_type( self::$post_type, array(
        'label' => __( 'Extended Term' ),
        'description' => __( 'Extends Term with custom associated extended_term post_type' ),
        'public' => false,
        'exclude_from_search' => true,
        'publicly_queryable' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'supports' => array(
          'title',
          'excerpt',
          'thumbnail',
          'custom-fields'
        )
      ) );

    }

    /**
     *
     */
    public function register_taxonomies() {

      $this->taxonomies = apply_filters( "et_taxonomies", array(
        self::$associated_taxonomy_slug  => __( "Associated Taxonomy" ),
        "et_label" => __( "Label" )
      ) );

      if( !is_array( $this->taxonomies ) ) {
        return;
      }

      foreach( $this->taxonomies as $slug => $label ) {

        register_taxonomy( $slug, self::$post_type, array(
          'label'             => $label,
          'public'            => false,
          'show_ui'           => true,
          'show_admin_column' => true,
          'rewrite'           => false,
          'hierarchical'      => false
        ) );

      }

    }

  }

  new UD_Extended_Term_Post_type();

}