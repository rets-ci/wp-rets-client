<?php
/**
 * Admin
 *
 * @author peshkov@UD
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\WS_Admin' ) ) {

    /**
     *
     *
     * @author peshkov@UD
     */
    class WS_Admin {

      /**
       *
       * @var object UsabilityDynamics\UI\Settings
       */
      public $ui;

      /**
       * Constructor
       *
       * @author peshkov@UD
       */
      public function __construct() {

        /* Handle Scripts and Styles */
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );

        /**
         * Setup Admin Settings Interface
         */
        $this->ui = new \UsabilityDynamics\UI\Settings( ud_get_wpp_walkscore()->settings, ud_get_wpp_walkscore()->get_schema( 'extra.schemas.ui', true ) );


        add_action( 'ud:ui:settings:view:section:score_api:bottom', array( $this, 'custom_ui' ) );
      }

      /**
       * Register admin Scripts and Styles.
       *
       */
      public function admin_enqueue_scripts() {
        $screen = get_current_screen();

        switch( $screen->id ) {

          case 'property_page_walkscore':
            wp_enqueue_style( 'property-walkscore-settings', ud_get_wpp_walkscore()->path( 'static/styles/property-walkscore-settings.css', 'url' ), array(), ud_get_wpp_walkscore( 'version' ) );
            break;

        }

      }

      /**
       *
       */
      public function custom_ui() {
        $screen = get_current_screen();

        if ($screen->id !== 'property_page_walkscore') {
          return false;
        }

        $hook = current_filter();

        switch ($hook) {

          case 'ud:ui:settings:view:section:score_api:bottom':
            include( ud_get_wpp_walkscore()->path( 'static/views/admin/bulk_score_request.php', 'dir' ) );
            break;

        }

      }


    }

  }

}
