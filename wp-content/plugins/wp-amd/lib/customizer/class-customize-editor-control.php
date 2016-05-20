<?php
/**
 * Class Customize_Editor_Control
 * Adds Editor functionality
 *
 * @author usabilitydynamics@UD
 * @see https://codex.wordpress.org/Theme_Customization_API
 * @version 0.1
 * @module UsabilityDynamics\AMD
 */
namespace UsabilityDynamics\AMD {
  
  if( !class_exists( '\UsabilityDynamics\AMD\Customize_Editor_Control' ) ) {
  
    /**
     * Class Customize_Editor_Control
     * Adds Editor functionality
     *
     * @package UsabilityDynamics\UI
     */
    class Customize_Editor_Control extends \WP_Customize_Control {

      /**
       * @var string
       *
       */
      public $type = 'textarea';
      
      /**
       * Enqueue control related static/scripts/styles.
       *
       * @todo Should use plugins_url() to get URL of assets, not a constant.
       *
       * @since 3.4.0
       */
      public function enqueue() {
        wp_enqueue_style( 'wp-amd-jquery-ui', 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.1/themes/base/jquery-ui.css', array() );
        wp_enqueue_style( 'wp-amd-customize-editor-control', WP_AMD_URL . 'static/styles/wp.amd.editor.style.css', array( 'wp-amd-jquery-ui' ) );
        
        wp_enqueue_script( 'wp-amd-ace', WP_AMD_URL . 'static/scripts/src/ace/ace.js', array(), '', true );
        wp_enqueue_script( 'wp-amd-customize-editor-control', WP_AMD_URL . 'static/scripts/wp.amd.editor.style.js', array( 'jquery', 'wp-amd-ace', 'jquery-ui-resizable' ), '', true );
        
        wp_localize_script( 'wp-amd-customize-editor-control', 'wp_amd_customize_editor_control', array(
          'done' => __( 'Done' ),
          'cancel' => __( 'Cancel' ),
        ) );
      }

      /**
       * Render Textarea Input
       *
       */
      public function render_content() {
        ?>
        <a href="#" id="wp_amd_style_editor_button_open" class="wp-amd-style-editor-toggle button" ><?php _e( 'Open Editor' ); ?></a>
        <textarea style="display:none;" id="wp_amd_default_style_editor" <?php $this->link(); ?>><?php echo esc_textarea( $this->value() ); ?></textarea> 
        <?php
      }

    }
    
  }

}


      