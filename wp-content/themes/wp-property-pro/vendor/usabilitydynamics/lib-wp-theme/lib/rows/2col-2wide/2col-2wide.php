<?php

/**
 * 2 Column Row, Column 2 is wide
 *
 * @package Carrington Build
 */
if (!class_exists('cfct_row_a_bc')) {
	class cfct_row_a_bc extends cfct_build_row {
		protected $_deprecated_id = 'row-a-bc'; // deprecated property, not needed for new module development
		
		public function __construct() {
			$config = array(
				'name' => __('Left Sidebar', 'carrington-build'),
				'description' => __('2 Columns. The second column is wider than the first.', 'carrington-build'),
				'icon' => '2col-2wide/icon.png'
			);
			
			/* Filters in rows used to be keyed by the single classname
			that was registered for the class. Maintain backwards
			compatibility for filters by setting modifier for this row to
			the old classname property. */
			$this->set_filter_mod('cfct-row-a-bc');
			
			$this->add_classes(array('row-c6-12-3456'));
			
			$this->push_block(new cfct_block_c6_12);
			$this->push_block(new cfct_block_c6_3456);
			
			parent::__construct($config);
		}
	}

}

?>