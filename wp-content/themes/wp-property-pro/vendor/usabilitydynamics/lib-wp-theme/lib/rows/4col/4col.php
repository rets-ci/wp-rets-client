<?php
/**
 * 4 Column Row
 *
 * @package Carrington Build
 */
if( !class_exists( 'RowFourColumns' ) ) {

  class RowFourColumns extends cfct_build_row {

    public function __construct() {
      $config = array(
        'name'        => __( '4 Column', 'carrington-build' ),
        'description' => __( 'A 4 column row.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );

      $this->set_filter_mod( 'cfct-row-a-b-c-d' );

      $this->add_classes( array( 'row-c8-12-34-56-78' ) );

      $this->push_block( new __block_c8_12 );
      $this->push_block( new __block_c8_34 );
      $this->push_block( new __block_c8_56 );
      $this->push_block( new __block_c8_78 );

      parent::__construct( $config );
    }
  }
}

if ( !class_exists( '__block_c8_12' ) ) {
  class __block_c8_12 extends cfct_block {
    public function __construct( $classes = array() ) {
      $this->add_classes( array( 'col-md-3', 'column' ) );
      parent::__construct( $classes );
    }
  }
}

if ( !class_exists( '__block_c8_34' ) ) {
  class __block_c8_34 extends cfct_block {
    public function __construct( $classes = array() ) {
      $this->add_classes( array( 'col-md-3', 'column' ) );
      parent::__construct( $classes );
    }
  }
}

if ( !class_exists( '__block_c8_56' ) ) {
  class __block_c8_56 extends cfct_block {
    public function __construct( $classes = array() ) {
      $this->add_classes( array( 'col-md-3', 'column' ) );
      parent::__construct( $classes );
    }
  }
}

if ( !class_exists( '__block_c8_78' ) ) {
  class __block_c8_78 extends cfct_block {
    public function __construct( $classes = array() ) {
      $this->add_classes( array( 'col-md-3', 'column' ) );
      parent::__construct( $classes );
    }
  }
}