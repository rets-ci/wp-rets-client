<?php

if (!class_exists('cfct_row_ab_c')) {
	class cfct_row_ab_c extends cfct_build_row {
		protected $_deprecated_id = 'row-ab-c'; // deprecated property, not needed for new module development
		
		public function __construct() {
			$config = array(
				'name' => __('Right Sidebar', 'carrington-build'),
				'description' => __('2 columns. The first column is wider than the second.', 'carrington-build'),
				'icon' => '2col-1wide/icon.png'
			);
			
			/* Filters in rows used to be keyed by the single classname
			that was registered for the class. Maintain backwards
			compatibility for filters by setting modifier for this row to
			the old classname property. */
			$this->set_filter_mod('cfct-row-ab-c');
			
			$this->add_classes(array('row-c6-1234-56'));
			
			$this->push_block(new cfct_block_c6_1234);
			$this->push_block(new cfct_block_c6_56);
			
			parent::__construct($config);
		}
	}

}

?>