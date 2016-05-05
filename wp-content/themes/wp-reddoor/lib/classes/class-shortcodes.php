<?php
/**
 * RDC Shortcodes
 * 
 */
namespace UsabilityDynamics\RDC {

  if ( !class_exists( '\UsabilityDynamics\RDC\Shortcodes' ) ) {

    /**
     * Class Shortcodes
     * @package UsabilityDynamics\RDC
     */
    class Shortcodes {

      public function __construct() {

        foreach( $this->actions as $action => $is_private ) {

          if ( !is_callable( array( $this, $action ) ) ) continue;

          add_action( "wp_ajax_{$action}", array( $this, $action ) );
          if ( !$is_private ) {
            add_action( "wp_ajax_nopriv_{$action}", array( $this, $action ) );
          }

        }

        add_filter( 'rdc_search_taxonomy_label', array( $this, 'search_taxonomy_label' ) );

      }

      /**
       * Shortcode to share an article
       *
       * @author potanin@UD
       * @param $atts
       * @param string $content
       * @return
       */
      static public function share_this_article( $atts, $content = "" ) {

        ob_start();

        ?>
        <ul class="singleSocialBlock">
          <li><a target="_blank" class="icon-wpproperty-social-facebook-symbol" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_the_permalink()); ?>"></a></li>
          <li><a target="_blank" class="icon-wpproperty-social-twitter-symbol" href="https://twitter.com/home?status=<?php echo urlencode(get_the_title()); ?><?php echo urlencode(' ' . get_the_permalink()); ?>"></a></li>
          <li><a target="_blank" class="icon-wpproperty-social-googleplus-symbol" href="https://plus.google.com/share?url=<?php echo urlencode(get_the_permalink()); ?>"></a></li>
        </ul>

        <?php

        $output = ob_get_contents();
        ob_end_clean();



        return $output;

      }

      /**
       * Get Template Part
       *
       * Show search form:
       *
       *    [template_part name=static/views/search-form]
       *
       * @param $atts
       * @param string $content
       * @return
       */
      static public function template_part( $atts, $content = "" ) {

        ob_start();
        get_template_part( $atts['name'] );
        return ob_get_clean();

      }
      
    }
  }
}