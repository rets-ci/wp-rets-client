<?php
/**
 * Be sure theme's core is loaded.
 *
 * @class CoreTest
 */
class CoreTest extends UD_Theme_WP_UnitTestCase {

  /**
   * 
   * @group core
   */
  function testGetInstance() {
    $this->assertTrue( function_exists( 'ud_get_theme_madison' ) );
    $data = ud_get_theme_madison();
    $this->assertTrue( is_object( $data ) && get_class( $data ) == 'UsabilityDynamics\Madison\Bootstrap' );
  }
  
  /**
   *
   * @group core
   */
  function testInstance() {
    $this->assertTrue( is_object( $this->instance ) );
  }
  
}
