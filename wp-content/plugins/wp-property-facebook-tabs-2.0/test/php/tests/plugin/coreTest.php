<?php
/**
 * Be sure plugin's core is loaded.
 *
 * @class CoreTest
 */
class CoreTest extends UD_Plugin_WP_UnitTestCase {

  /**
   * 
   * @group core
   */
  function testGetInstance() {
    $this->assertTrue( function_exists( 'ud_get_wpp_fbtabs' ) );
    $data = ud_get_wpp_fbtabs();
    $this->assertTrue( is_object( $data ) && get_class( $data ) == 'UsabilityDynamics\WPP\Facebook_Tabs_Bootstrap' );
  }
  
  /**
   *
   * @group core
   */
  function testInstance() {
    $this->assertTrue( is_object( $this->instance ) );
  }
  
}
