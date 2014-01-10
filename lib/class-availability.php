<?php
/**
 * Name: Availability
 * Description: Adds availability settings to listings.
 * Version: 0.1-alpha
 * Class: class_wpp_availability
 * Minimum Core Version: 1.9
 * Minimum PHP Version: 5.3
 * Feature ID: 51
 */

define( 'class_wpp_availability_version', '0.1-alpha' );
define( 'class_wpp_availability_interface_version', '0.1' );

// if( WPP_F::site_has_license( 'class_wpp_availability' ) ) { add_action( 'wpp_init', array( 'class_wpp_availability', 'wpp_init' ) ); }

//** Be sure we do not try to define class twice */
if( class_exists( 'class_wpp_availability' ) ) {
  return;
}

/**
 * class_wpp_availability Class
 *
 * @version 0.1
 * @author potanin@UD
 * @package WP-Property
 * @subpackage Availability
 */
class class_wpp_availability extends UsabilityDynamics\WPP\Module {

  /**
   * Interface Version
   */
  static protected $interface_version = class_wpp_availability_interface_version;


  function __construct() {


  }

  function get( $key, $default ) {}
  function set( $key, $value ) {}

  /**
   * Capability to manage the current feature
   *
   * @var string
   * @author potanin@UD
   */
  const capability = "manage_wpp_availability";

  /**
   * Primary feature function.  Ran an init level.
   *
   * @since 0.1
   */
  function wpp_init() {
    global $wp_properties;

    if( !isset( self::$capability ) || current_user_can( self::$capability ) ) {}

    add_action( 'add_meta_boxes', create_function( '', " add_meta_box( 'wpp_availability', __( 'Availability', 'wpp' ), array( 'class_wpp_availability','metabox_availability' ), 'property', 'normal' ); " ) );

  }


  /**
   * Draw availability metabox
   *
   * @since 0.1
   * @author potanin@UD
   */
  function metabox_availability() {
    wp_enqueue_script( 'knockout' );
    wp_enqueue_script( 'jquery-ui-droppable' );

    $interface =  WPP_UI::get_interface( 'metabox_availability' );
    echo is_wp_error( $interface ) ? $interface->get_error_message() : $interface;
  }


  /**
   * Draw availability metabox
   *
   * @since 0.1
   * @author potanin@UD
   */
  function __blank_function() {
    global $wp_properties;



  }



}





