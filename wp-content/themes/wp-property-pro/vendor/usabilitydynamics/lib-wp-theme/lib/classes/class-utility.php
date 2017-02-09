<?php
/**
 * Utility Customizer.
 *
 * @author team@UD
 * @version 0.2.4
 * @namespace UsabilityDynamics
 * @module Theme
 * @author potanin@UD
 */
namespace UsabilityDynamics\Theme {

  if( !class_exists( '\UsabilityDynamics\Theme\Utility' ) ) {

    /**
     * Utility Class
     *
     * @class Customizer
     * @author potanin@UD
     */
    class Utility extends \UsabilityDynamics\Utility {

  
      /**
       * Login Shortcode
       * @param array $args
       */
      public function wp_login_form_shortcode( $args = array() ) {
  
        $args = shortcode_atts( $args, array(
          'echo' => true,
          'redirect' => ( is_ssl() ? 'https://' : 'http://' ) . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'], // Default redirect is back to the current page
          'form_id' => 'loginform',
          'label_username' => __( 'Username' ),
          'label_password' => __( 'Password' ),
          'label_remember' => __( 'Remember Me' ),
          'label_log_in' => __( 'Log In' ),
          'id_username' => 'user_login',
          'id_password' => 'user_pass',
          'id_remember' => 'rememberme',
          'id_submit' => 'wp-submit',
          'remember' => true,
          'value_username' => '',
          'value_remember' => false
        ));
  
        wp_login_form( $args );
  
      }

    }

  }

}