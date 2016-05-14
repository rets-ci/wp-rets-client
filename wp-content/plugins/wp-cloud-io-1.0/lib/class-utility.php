<?php
/**
 * Helper Functions List
 *
 * Can be called via Singleton. Since Singleton uses magic method __call().
 * Example:
 *
 * Add Media to GS storage:
 * ud_get_stateless_media()->add_media( false, $post_id );
 *
 * @class Utility
 */
namespace wpCloud {

  if( !class_exists( 'wpCloud\Utility' ) ) {

    class Utility {

      /**
       * wp_normalize_path was added in 3.9.0
       *
       * @param $path
       * @return mixed|string
       *
       */
      public static function normalize_path( $path ) {

        if( function_exists( 'wp_normalize_path' ) ) {
          return wp_normalize_path( $path );
        }

        $path = str_replace( '\\', '/', $path );
        $path = preg_replace( '|/+|','/', $path );
        return $path;

      }

    }

  }

}
