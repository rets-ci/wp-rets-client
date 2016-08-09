<?php
/**
 * Bootstrap
 *
 * @since 4.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Supermap_Utility' ) ) {

    final class Supermap_Utility {

      /**
       * Renders property item for supermap
       *
       * @param $key
       * @param $value
       * @return string
       */
      static public function render_property_item( $property, $args = array(), $return = false ) {
        $html = "";

        $args = array_merge( array(
          'template' => 'default'
        ), $args );

        /** Try find Supermap Item Template */
        $_template = \WPP_F::get_template_part(
          apply_filters( "wpp::supermap::item::template_name", array( "supermap-item" ) ),
          apply_filters( "wpp::supermap::item::template_path", array( ud_get_wpp_supermap()->path( 'static/views/' . $args['template'], 'dir' ) ) )
        );

        if( $_template ) {
          if( !empty( $args ) && is_array( $args ) ) {
            extract( $args );
          }
          ob_start();
          include $_template;
          $html .= ob_get_clean();
        }

        if( !$return ) {
          echo $html;
        } else {
          return $html;
        }

      }

    }

  }

}
