<?php
/**
 * Custom Styles Customizer
 * Uses theme customization API
 *
 * @author usabilitydynamics@UD
 * @see https://codex.wordpress.org/Theme_Customization_API
 * @version 0.1
 * @module UsabilityDynamics\AMD
 */
namespace UsabilityDynamics\AMD {

  if( !class_exists( 'UsabilityDynamics\AMD\Style' ) ) {

    class Style extends \UsabilityDynamics\AMD\Scaffold {
      
      public $name = 'amd_css_editor';
      
      /**
       * Constructor
       *
       * @param array $args
       * @param null  $context
       */
      function __construct( $args = array(), $context = null ) {

        parent::__construct( $args );
          
        //** Adds settings to customizer */
        if( !did_action( 'customize_register' ) ) {
          add_action( 'customize_register', array( &$this, 'customize_register' ) );
        }
        
        if( !did_action( 'customize_preview_init' ) ) {
          add_action( 'customize_preview_init', array( &$this, 'customize_live_preview' ) );
        }
        
        add_action( 'customize_update_wp_amd', array( $this, 'customize_update' ) );
        add_filter( 'customize_value_' . $this->name, array( $this, 'customize_value' ) );
        
      }

      /**
       * @param $value
       */
      public function customize_update( $value ) {
        $this->save_asset( $value );
      }

      /**
       * @param $default
       *
       * @return string
       */
      public function customize_value( $default ) {
        $post = $this->get_asset( $this->get( 'type' ) );
        return !empty( $post[ 'post_content' ] ) ? $post[ 'post_content' ] : '';
      }

      /**
       * All our sections, settings, and controls are added here
       *
       * @param object $wp_customize Instance of the WP_Customize_Manager class
       *
       * @return object
       * @see wp-includes/class-wp-customize-manager.php
       */
      public function customize_register( $wp_customize ) {
        
        //** Configure Section. */
        $wp_customize->add_section( 'amd_custom_style', array(
          'title'    => __( 'Custom Styles' ),
          'description' => __( 'Handle custom CSS styles that will be loaded after all other styles.' ),
          'capability' => 'edit_theme_options',
          'priority' => -20
        ));
        
        //** Stores raw CSS. */
        $wp_customize->add_setting( $this->name, array(
          'capability' => 'edit_theme_options',
          'type' => 'wp_amd',
          'transport' => 'postMessage',
        ));
        
        //** Input for CSS Code. */
        $wp_customize->add_control( new Customize_Editor_Control( $wp_customize, $this->name, array(
          'label'   => __( 'Styles' ),
          'section' => 'amd_custom_style',
          'priority' => 10
        )));
        
        return $wp_customize;

      }
      
      /**
       * Used by hook: 'customize_preview_init'
       * 
       * @see add_action( 'customize_preview_init', $func )
       * @author peshkov@UD
       */
      public function customize_live_preview() {
        wp_enqueue_script( 'wp-amd-themecustomizer', plugins_url( '/static/scripts/wp.amd.customizer.style.js', __DIR__ ), array( 'jquery','customize-preview' ), '', true );
        wp_localize_script( 'wp-amd-themecustomizer', 'wp_amd_themecustomizer', array( 'name' => $this->name, 'link_id' => 'wp-amd-' . $this->get( 'type' ) . '-css' ));
      }
    
    }
    
  }

}


      