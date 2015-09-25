<?php
/**
 * The current file is just Bootstrap Loader.
 * Do not touch it!
 * Please see UsabilityDynamics\Madison\Bootstrap which initialize theme. ( lib/classes/class-bootstrap.php )
 *
 */

if( !function_exists( 'ud_get_theme_madison' ) ) {

  /**
   * Returns Madison Instance
   *
   * @author Usability Dynamics, Inc.
   * @since 2.0.0
   */
  function ud_get_theme_madison( $key = false, $default = null ) {
    $instance = \UsabilityDynamics\Madison\Bootstrap::get_instance();
    return $key ? $instance->get( $key, $default ) : $instance;
  }

}

if( !function_exists( 'ud_check_theme_madison' ) ) {
  /**
   * Determines if theme can be initialized.
   *
   * @author Usability Dynamics, Inc.
   * @since 2.0.0
   */
  function ud_check_theme_madison() {
    global $_ud_madison_error;
    try {
      //** Be sure composer.json exists */
      $file = dirname( __FILE__ ) . '/composer.json';
      if( !file_exists( $file ) ) {
        throw new Exception( __( 'Distributive is broken. composer.json is missed. Try to remove and upload theme again.', 'madison' ) );
      }
      $data = json_decode( file_get_contents( $file ), true );
      //** Be sure PHP version is correct. */
      if( !empty( $data[ 'require' ][ 'php' ] ) ) {
        preg_match( '/^([><=]*)([0-9\.]*)$/', $data[ 'require' ][ 'php' ], $matches );
        if( !empty( $matches[1] ) && !empty( $matches[2] ) ) {
          if( !version_compare( PHP_VERSION, $matches[2], $matches[1] ) ) {
            throw new Exception( sprintf( __( 'Theme requires PHP %s or higher. Your current PHP version is %s', 'madison' ), $matches[2], PHP_VERSION ) );
          }
        }
      }
      //** Be sure vendor autoloader exists */
      if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
        require_once ( dirname( __FILE__ ) . '/vendor/autoload.php' );
      } else {
        throw new Exception( sprintf( __( 'Distributive is broken. %s file is missed. Try to remove and upload theme again.', 'madison' ), dirname( __FILE__ ) . '/vendor/autoload.php' ) );
      }
      //** Be sure our Bootstrap class exists */
      if( !class_exists( '\UsabilityDynamics\Madison\Bootstrap' ) ) {
        throw new Exception( __( 'Distributive is broken. Theme loader is not available. Try to remove and upload theme again.', 'madison' ) );
      }
    } catch( Exception $e ) {
      $_ud_madison_error = $e->getMessage();
      return false;
    }
    return true;
  }

}

if( !function_exists( 'ud_theme_madison_message' ) ) {
  /**
   * Renders admin notes in case there are errors on theme init
   *
   * @author Usability Dynamics, Inc.
   * @since 1.0.0
   */
  function ud_theme_madison_message() {
    global $_ud_madison_error;
    if( !empty( $_ud_madison_error ) ) {
      $message = sprintf( __( '<p><b>%s</b> can not be initialized. %s</p>', 'madison' ), 'Madison', $_ud_madison_error );
      echo '<div class="error fade" style="padding:11px;">' . $message . '</div>';
    }
  }
  add_action( 'admin_notices', 'ud_theme_madison_message' );
}

if( ud_check_theme_madison() ) {
  //** Initialize. */
  ud_get_theme_madison();
}