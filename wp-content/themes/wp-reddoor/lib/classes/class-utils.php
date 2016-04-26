<?php

/**
 *
 */
namespace UsabilityDynamics\RDC {

  if ( !class_exists( '\UsabilityDynamics\RDC\Utils' ) ) {

    /**
     * Class Utils
     * @package UsabilityDynamics\RDC
     */
    class Utils {

      /**
       * @return bool
       */
      public static function device_is_mobile() {
        return isset( $_SERVER['HTTP_X_USER_DEVICE'] ) && $_SERVER['HTTP_X_USER_DEVICE'] == 'mobile';
      }

      /**
       * @param bool $taxonomy
       * @param bool $property_id
       * @param string $field
       * @return string
       */
      public static function get_single_term( $taxonomy = false, $property_id = false, $field = 'name' ) {
        if ( !$taxonomy || !$property_id ) return '';
        $_terms = get_the_terms( $property_id, $taxonomy );
        return $_terms[0] ? $_terms[0]->$field : '';
      }

      /**
       * @param bool $taxonomy
       * @param bool $property_id
       * @param string $field
       * @param string $format
       * @param string $separator
       * @return array|string
       */
      public static function get_multiple_terms( $taxonomy = false, $property_id = false, $field = 'name', $format = 'array', $separator = ', ' ) {
        if ( !$taxonomy || !$property_id ) return array();
        $_terms = get_the_terms( $property_id, $taxonomy );
        $_return = array();
        foreach( $_terms as $_term ) {
          $_return[] = $_term->$field;
        }
        return $format == 'array' ? $_return : implode( $separator, $_return );
      }

      /**
       * Return user object of an agent that matches rets agent byt some field
       *
       * @param $rets_agent_id
       * @param array $users
       * @param string $field_to_compare
       * @return bool
       */
      public static function get_matched_agent( $rets_agent_id, $random_agent = false, $users = array(), $field_to_compare = 'agent_mls_id' ) {

        if ( empty( $users ) ) {
          $users = get_users( array( 'role' => 'agent' ) );
        }

        if ( empty( $users ) ) return false;

        foreach( $users as $agent ) {

          if ( $rets_agent_id == get_user_meta( $agent->ID, $field_to_compare, 1 ) ) {
            return $agent;
          }

        }

        return $random_agent ? $users[0] : false;

      }
    }
  }

}