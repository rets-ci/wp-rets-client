<?php
/**
 * The current file is just Bootstrap Loader.
 * Do not touch it!
 * Please see RDC\Theme\Bootstrap which initialize theme. ( lib/classes/class-Bootstrap.php )
 *
 */

if( !function_exists( 'ud_get_theme_rdc_theme' ) ) {

  /**
   * Returns RedDoorCompany Theme Instance
   *
   * @author Usability Dynamics, Inc.
   * @since 1.0.0
   */
  function ud_get_theme_rdc_theme( $key = false, $default = null ) {
    $instance = \RDC\Theme\Bootstrap::get_instance();
    return $key ? $instance->get( $key, $default ) : $instance;
  }

}

if( !function_exists( 'ud_check_theme_rdc_theme' ) ) {
  /**
   * Determines if theme can be initialized.
   *
   * @author Usability Dynamics, Inc.
   * @since 1.0.0
   */
  function ud_check_theme_rdc_theme() {
    global $_ud_rdc_theme_error;
    try {
      //** Be sure composer.json exists */
      $file = dirname( __FILE__ ) . '/composer.json';
      if( !file_exists( $file ) ) {
        throw new Exception( __( 'Distributive is broken. composer.json is missed. Try to remove and upload theme again.', 'rdc' ) );
      }
      $data = json_decode( file_get_contents( $file ), true );
      //** Be sure PHP version is correct. */
      if( !empty( $data[ 'require' ][ 'php' ] ) ) {
        preg_match( '/^([><=]*)([0-9\.]*)$/', $data[ 'require' ][ 'php' ], $matches );
        if( !empty( $matches[1] ) && !empty( $matches[2] ) ) {
          if( !version_compare( PHP_VERSION, $matches[2], $matches[1] ) ) {
            throw new Exception( sprintf( __( 'Theme requires PHP %s or higher. Your current PHP version is %s', 'rdc' ), $matches[2], PHP_VERSION ) );
          }
        }
      }
      //** Be sure vendor autoloader exists */
      if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
        require_once ( dirname( __FILE__ ) . '/vendor/autoload.php' );
      } else {
        throw new Exception( sprintf( __( 'Distributive is broken. %s file is missed. Try to remove and upload theme again.', 'rdc' ), dirname( __FILE__ ) . '/vendor/autoload.php' ) );
      }
      //** Be sure our Bootstrap class exists */
      if( !class_exists( '\RDC\Theme\Bootstrap' ) ) {
        throw new Exception( __( 'Distributive is broken. Theme loader is not available. Try to remove and upload theme again.', 'rdc' ) );
      }
    } catch( Exception $e ) {
      $_ud_rdc_theme_error = $e->getMessage();
      return false;
    }
    return true;
  }

}

if( !function_exists( 'ud_theme_rdc_theme_message' ) ) {
  /**
   * Renders admin notes in case there are errors on theme init
   *
   * @author Usability Dynamics, Inc.
   * @since 1.0.0
   */
  function ud_theme_rdc_theme_message() {
    global $_ud_rdc_theme_error;
    if( !empty( $_ud_rdc_theme_error ) ) {
      $message = sprintf( __( '<p><b>%s</b> can not be initialized. %s</p>', 'rdc' ), 'RedDoorCompany Theme', $_ud_rdc_theme_error );
      echo '<div class="error fade" style="padding:11px;">' . $message . '</div>';
    }
  }
  add_action( 'admin_notices', 'ud_theme_rdc_theme_message' );
}

if( ud_check_theme_rdc_theme() ) {
  //** Initialize. */
  ud_get_theme_rdc_theme();
}