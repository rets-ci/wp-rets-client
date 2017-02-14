<?php

if (!class_exists('cfct_row_a')) {
	class cfct_row_a extends cfct_build_row {
		protected $_deprecated_id = 'row-a'; // deprecated property, not needed for new module development
		
		public function __construct() {
			$config = array(
				'name' => __('1 Column', 'carrington-build'),
				'description' => __('A single full-width column', 'carrington-build'),
				'icon' => '1col/icon.png'
			);
			/* Filters in rows used to be keyed by the single classname
			that was registered for the class. Maintain backwards
			compatibility for filters by setting modifier for this row to
			the old classname property. */
			$this->set_filter_mod('cfct-row-abc');
			
			$this->add_classes(array('row-c4-1234'));
			
			$this->push_block(new cfct_block_c4_1234);

			parent::__construct($config);
		}
	}
}
