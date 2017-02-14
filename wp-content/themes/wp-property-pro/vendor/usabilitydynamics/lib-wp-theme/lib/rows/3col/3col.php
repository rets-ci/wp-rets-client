<?php

/**
 * 3 Column Row
 *
 * @package Carrington Build
 */
if (!class_exists('cfct_row_abc')) {
	class cfct_row_abc extends cfct_build_row {
		protected $_deprecated_id = 'row-abc'; // deprecated property, not needed for new module development
		
		public function __construct() {
			$config = array(
				'name' => __('3 Column', 'carrington-build'),
				'description' => __('A 3 column row.', 'carrington-build'),
				'icon' => '3col/icon.png'
			);
			
			/* Filters in rows used to be keyed by the single classname
			that was registered for the class. Maintain backwards
			compatibility for filters by setting modifier for this row to
			the old classname property. */
			$this->set_filter_mod('cfct-row-a-b-c');
			
			$this->add_classes(array('row-c6-12-34-56'));
			
			$this->push_block(new cfct_block_c6_12);
			$this->push_block(new cfct_block_c6_34);
			$this->push_block(new cfct_block_c6_56);
			
			parent::__construct($config);
		}
	}

}

?>