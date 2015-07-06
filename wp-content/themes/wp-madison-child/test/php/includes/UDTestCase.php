<?php
/**
 * 
 * @class UD_Theme_WP_UnitTestCase
 */
class UD_Theme_WP_UnitTestCase extends WP_UnitTestCase {

  protected $root_dir;
  
  protected $instance;

  /**
   * WP Test Framework Constructor
   */
  function setUp() {
	  parent::setUp();
    $this->root_dir = dirname( dirname( dirname( __DIR__ ) ) );
    if( file_exists( $this->root_dir . '/functions.php' ) ) {
      include_once( $this->root_dir . '/functions.php' );
    }
    if( !class_exists( '\RDC\Theme\Bootstrap' ) ) {
      $this->fail( 'Theme is not available.' );
    }
    $this->instance = \RDC\Theme\Bootstrap::get_instance();
  }
  
  /**
   * WP Test Framework Destructor
   */
  function tearDown() {
	  parent::tearDown();
    $this->root_dir = NULL;
    $this->instance = NULL;
  }
  
}
