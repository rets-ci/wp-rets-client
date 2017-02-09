<?php
/**
 * Model Manager class
 * Manage custom post types, taxonomies, meta data
 * 
 * @author peshkov@UD
 * @version 0.1.0
 * @package UsabilityDynamics
 * @subpackage lib-model
 */
namespace UsabilityDynamics\Model {

  if( !class_exists( 'UsabilityDynamics\Model\Manager' ) ) {

    class Manager {
    
      /**
       * Class version.
       *
       * @public
       * @static
       * @type string
       */
      public static $version = '0.3.1';
    
      /**
       * Combined (Final) schema
       *
       * @type array
       * @author peshkov@UD
       */
      private static $schema = array();
    
      /**
       * The list of existing schemas
       *
       * @type array
       * @author peshkov@UD
       */
      private static $schemas = array();
      
      /**
       * Initialized Structure
       *
       * @type array
       * @author peshkov@UD
       */
      private static $structure = array();
      
      /**
       * Temp schemas data
       *
       * @type array
       * @author peshkov@UD
       */
      private static $data = array();

      /**
       *
       * @var array
       */
      public static $flags = array(
        "rewrites_flushed" => false
      );

      /**
       * Returns schemas or structure.
       *
       * @param string $key
       * @return array
       * @author peshkov@UD
       */
      static public function get( $key = 'structure' ) {

        switch( $key ) {
        
          case 'schemas':
            return self::$schemas;
          break;
        
          case 'schema':
            if( function_exists( 'did_action' ) && did_action( 'init' ) && current_filter() !== 'init' ) {
              return self::$schema;
            }
            break;
          
          // should be called after 'init' action.
          case 'structure':
            if( function_exists( 'did_action' ) && did_action( 'init' ) && current_filter() !== 'init' ) {
              return self::$structure;
            }
            break;
        
        }
        
        return false;
      }

      /**
       * Adds schema to the schemas list
       *
       * @param array $data
       * @param array $data.types       Post type definitions
       * @param array $data.meta        Meta definitions.
       * @param array $data.taxonomies  Taxonomy fields.
       * @param string $data.title      Readable title.
       * @param string $data.revision   Version of structure.
       * @param string $data.schema     URL to schema definition.
       *
       * @return bool
       * @author peshkov@UD
       */
      static public function set( $data ) {
      
        if( function_exists( 'did_action' ) && did_action( 'init' ) && current_filter() !== 'init' ) {
          _doing_it_wrong( __FUNCTION__, __( 'method must be called before or during \'init\' action.' ), '1.0' );
        }
        
        //** Initialize our structure at last moment. */
        if( !has_action( 'init', array( __CLASS__, 'init' ) ) ) {
          add_action( 'init', array( __CLASS__, 'init' ), 999 );
        }
        
        $data = wp_parse_args( $data, array(
          'types' => array(),
          'meta' => array(),
          'taxonomies' => array(),
          // Optional
          'priority' => 10,
          'title' => 'notitle_' . rand( 1001, 9999 ),
          'revision' => null,
          'schema' => null,
        ) );
        
        array_push ( self::$data, $data );
        
        self::$schemas[ $data[ 'title' ] ] = $data;



        return true;
        
      }

      /**
       * Flush Rewrite Rules - but only once.
       *
       * Called by UsabilityDynamics\Model\Loader after each new model definition.
       *
       * @author potanin@UD
       * @return bool
       */
      static public function flush_rewrites_once() {

        if( Manager::$flags[ "rewrites_flushed" ] ) {
          return false;
        }

        if( did_action( 'admin_init' ) ) {
          return false;
        }

        add_action( 'admin_init', function() {
          flush_rewrite_rules();
          Manager::$flags[ "rewrites_flushed" ] = true;
        });

        return true;

      }
      
      /**
       * Initialize our custom post_type structure.
       * Note: must not be called directly.
       *
       * @author peshkov@UD
       */
      static public function init() {
        
        if( current_filter() !== 'init' ) {
          _doing_it_wrong( __FUNCTION__, __( 'method must be called during \'init\' action.' ), '1.0' );
        }
        
        usort( self::$data, create_function( '$a,$b', 'if ($a[\'priority\'] == $b[\'priority\']) { return 0; } return ($a[\'priority\'] < $b[\'priority\']) ? 1 : -1;' ) );
        
        self::$schema = array();

        foreach( self::$data as $d ) {
          // Clear our schema data.
          $d = array(
            'types' => $d[ 'types' ],
            'meta' => $d[ 'meta' ],
            'taxonomies' => $d[ 'taxonomies' ],
          );
          self::$schema = Utility::extend( self::$schema, $d );
        }
        
        self::$structure = Loader::define( self::$schema );
      }
      
    }

  }

}