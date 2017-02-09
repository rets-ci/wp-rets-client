<?php
  /**
   * Model Handler
   *
   * @namespace UsabilityDynamics
   * @module UsabilityDynamics
   * @author potanin@UD
   * @version 0.3.1
   */
  namespace UsabilityDynamics {

    /**
     * Class Model
     *
     * @author team@UD
     * @class Model
     * @subpackage Models
     */
    final class Model {

      /**
       * Class version.
       *
       * @public
       * @static
       * @type string
       */
      public static $version = '0.3.1';

      /**
       * Define Structure
       *
       * @author potanin@UD
       * @method define
       * @param $args
       * @return mixed
       */
      public static function define( $args ) {
        return Model\Manager::set( $args );
      }
      
      /**
       * Return list of defined schemas
       *
       * @author potanin@UD
       * @method getSchema
       *
       * @param null $name
       *
       * @return array
       */
      public static function getSchema( $name = null ) {
        if( !empty( $name ) ) {
          $r = self::get( 'schemas' );
          if( key_exists( $name, $r ) ) {
            $r = $r[ $name ];
          } else {
            $r = false;
          }
        } else {
          $r = self::get( 'schema' );
        }
        return $r;
      }

      /**
       * Just a wrapper
       * @param string $key
       * @return array
       */
      public static function get( $key = 'structure' ) {
        return Model\Manager::get( $key );
      }

    }

  }