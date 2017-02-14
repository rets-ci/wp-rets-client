<?php
/**
 * Post Model
 *
 * @namespace UsabilityDynamics
 * @module UsabilityDynamics
 * @author peshkov@UD
 * @version 0.1.1
 */
namespace UsabilityDynamics\Model {

  if( !class_exists( 'UsabilityDynamics\Model\Post' ) ) {

    class Post {
      
      /**
       * Class version.
       *
       * @public
       * @static
       * @type string
       */
      public static $version = '0.1.1';
      
      /**
       *
       */
      public $errors = array();
      
      /**
       * 
       *
       */
      protected $structure = array();
      
      /**
       * 
       *
       */
      protected $post;
      
      /**
       * 
       *
       */
      protected $meta;
      
      /**
       * Returns post data including meta data specified in structure
       *
       * @author peshkov@UD
       */
      public function __construct( $post, $post_type, $filter ) {

        if( NULL === $post || false === $post ) {
          $this->post = new \WP_Post( new \stdClass );
          $this->post = (array)$this->post;
          $this->post_type = $post_type;
        } else if ( is_object( $post ) ) {
          $this->post = (array)$post;
        } else {
          $this->post = get_post( $post, ARRAY_A, $filter );
          if( !$this->post || is_wp_error( $this->post ) ) {
            array_push( $this->errors, __( 'Post does not exist' ) );
            //** Break here */
            return null;
          }
        }
        
        $_post_type = $this->post_type;
        $post_type = !empty( $_post_type ) ? $_post_type : $post_type;
        
        $structure = \UsabilityDynamics\Model::get( 'structure', array() );
        $this->structure = isset( $structure[ $post_type ] ) ? $structure[ $post_type ] : array();
      
        if( !empty( $this->structure[ 'meta' ] ) ) {
          foreach( (array) $this->structure[ 'meta' ] as $key ) {
            $value = '';
            if( $this->ID > 0 ) {
              $value = get_post_meta( $this->ID, $key, false );
              if( is_array( $value ) ) {
                if( count( $value ) == 1 ) {
                  $value = array_shift( $value );
                } else if( empty( $value ) ) {
                  $value = '';
                }
              }
            }
            $this->meta[ $key ] = $value;
          }
        }

      }
      
      /**
       * Returns Object instead of Constructor
       */
      public static function get( $post = NULL, $post_type = 'post', $filter = 'raw' ) {
        $post = new self( $post, $post_type, $filter );
        return !$post->has_errors() ? $post : new \WP_Error( 'failed', trim( implode( ', ', $post->errors ) ) );
      }
      
      /**
       * Adds or Updates current post
       */
      public function save() {
        
        //** STEP 1. Insert/Update Post Data */
        //** Get rid of date data. It's being updated automatically. */
        $post = wp_parse_args( array(
          'post_date' => false,
          'post_date_gmt' => false,
          'post_modified' => false,
          'post_modified_gmt' => false,
        ) , $this->post );
      
        if( !$this->ID || $this->ID < 1 ) {
          $this->ID = wp_insert_post( $post );
        } else {
          wp_update_post( $post );
        }
        
        //** STEP 2. Update Post Meta */
        foreach( $this->meta as $key => $value ) {
          update_post_meta( $this->ID, $key, $value );
        }
        
      }
      
      /**
       * Adds or Updates current post
       */
      public function has_errors() {
        return !empty( $this->errors ) ? true : false;
      }
      
      /**
       *
       */
      public function __set( $name, $value ) {
        if( isset( $this->post[ $name ] ) ) {
          $this->post[ $name ] = $value;
        } else if( isset( $this->meta[ $name ] ) ) {
          $this->meta[ $name ] = $value;
        } else if( empty( $this->{$name} ) ) {
          $this->{$name} = $value;
        }
      }
      
      /**
       *
       */
      public function __get( $name ) {
        if( isset( $this->post[ $name ] ) ) {
          return $this->post[ $name ];
        } else if( isset( $this->meta[ $name ] ) ) {
          return $this->meta[ $name ];
        } else if( isset( $this->{$name} ) ) {
          return $this->{$name};
        }
        return NULL;
      }
      
    
    }
  
  }
  
}
