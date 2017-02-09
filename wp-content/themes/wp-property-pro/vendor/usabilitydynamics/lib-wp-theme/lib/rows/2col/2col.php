<?php

/**
 * 2 Column Row
 *
 * @package Carrington Build
 */
if (!class_exists('cfct_row_ab')) {
	class cfct_row_ab extends cfct_build_row {
		protected $_deprecated_id = 'row-ab'; // deprecated property, not needed for new module development
		
		public function __construct() {
			$config = array(
				'name' => __('2 Columns', 'carrington-build'),
				'description' => __('A 2 column row.', 'carrington-build'),
				'icon' => '2col/icon.png'
			);
			
			/* Filters in rows used to be keyed by the single classname
			that was registered for the class. Maintain backwards
			compatibility for filters by setting modifier for this row to
			the old classname property. */
			$this->set_filter_mod('cfct-row-d-e');
			
			$this->add_classes(array('row-c4-12-34'));
			
			$this->push_block(new cfct_block_c4_12);
			$this->push_block(new cfct_block_c4_34);
			
			parent::__construct($config);
		}
	}
}

?>