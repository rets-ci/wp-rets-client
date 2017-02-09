<?php
/**
 * 2 Column Row, Column 2 is 3 times wider than 1
 *
 * @package Carrington Build
 * @author korotkov@ud
 */
if (!class_exists('cfct_row_a_bcd')) {

  /**
   * New row class
   */
	class cfct_row_a_bcd extends cfct_build_row {
		protected $_deprecated_id = 'row-a-bcd'; // deprecated property, not needed for new module development

    /**
     * Construct
     */
		public function __construct() {
			$config = array(
				'name' => __('Left Sidebar 25%', 'carrington-build'),
				'description' => __('2 Columns. The second column is 3 times wider than the first.', 'carrington-build'),
				'icon' => plugins_url( '/icon.png', __DIR__ )
			);

			$this->set_filter_mod('cfct-row-a-bcd');

			$this->add_classes( array( 'row-c8-12-345678' ) );

			$this->push_block( new __block_c4_1 );
			$this->push_block( new __block_c4_234 );

			parent::__construct( $config );
		}
	}

}

/**
  * 25% column
  */
if ( !class_exists( '__block_c4_1' ) ) {
  class __block_c4_1 extends cfct_block {
    public function __construct( $classes = array() ) {
      $this->add_classes( array( 'c6-12', 'col-md-3', 'column' ) );
      parent::__construct( $classes );
    }
  }
}

/**
  * 75% column
  */
if ( !class_exists( '__block_c4_234' ) ) {
  class __block_c4_234 extends cfct_block {
    public function __construct( $classes = array() ) {
      $this->add_classes( array( 'c6-3456', 'col-md-9', 'column' ) );
      parent::__construct( $classes );
    }
  }
}

