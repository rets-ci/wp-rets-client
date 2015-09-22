<?php
/**
 * Global Custom Javascript
 * Uses theme customization API
 *
 * @author usabilitydynamics@UD
 * @see https://codex.wordpress.org/Theme_Customization_API
 * @version 0.1
 * @module UsabilityDynamics\AMD
 */
namespace UsabilityDynamics\AMD {

  if( !class_exists( '\UsabilityDynamics\AMD\Script' ) ) {

    class Script extends \UsabilityDynamics\AMD\Scaffold {
    
      /**
       * Constructor
       *
       * @param array $args
       * @param null  $context
       */
      public function __construct( $args = array(), $context = null ) {
      
        parent::__construct( $args, $context );
        
      }
      
    }
    
  }

}


      