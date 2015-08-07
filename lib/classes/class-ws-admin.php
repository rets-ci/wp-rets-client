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

        /**
         * @see wp-content/plugins/wp-property/vendor/usabilitydynamics/lib-ui/static/templates/admin/main.php
         */
        add_action( 'ud:ui:settings:view:main:top', array( $this, 'custom_ui' ) );
        // Adds Tab Item ( Link )
        add_action( 'ud:ui:settings:view:tab_link', array( $this, 'custom_ui' ) );
        // Adds Panel for Tab
        add_action( 'ud:ui:settings:view:tab_container', array( $this, 'custom_ui' ) );
        add_action( 'ud:ui:settings:view:main:bottom', array( $this, 'custom_ui' ) );

        add_action( 'ud:ui:settings:view:main:actions', array( $this, 'custom_ui' ) );

        /**
         * @see wp-content/plugins/wp-property/vendor/usabilitydynamics/lib-ui/static/templates/admin/tab.php
         */
        //
        add_action( 'ud:ui:settings:view:tab:api:top', array( $this, 'custom_ui' ) );
        add_action( 'ud:ui:settings:view:tab:api:bottom', array( $this, 'custom_ui' ) );

        /**
         * @see wp-content/plugins/wp-property/vendor/usabilitydynamics/lib-ui/static/templates/admin/section.php
         */
        add_action( 'ud:ui:settings:view:section:credentials:top', array( $this, 'custom_ui' ) );
        add_action( 'ud:ui:settings:view:section:sync:top', array( $this, 'custom_ui' ) );
        add_action( 'ud:ui:settings:view:section:credentials:bottom', array( $this, 'custom_ui' ) );
        add_action( 'ud:ui:settings:view:section:sync:bottom', array( $this, 'custom_ui' ) );

      }

      /**
       * Custom UI on WalkScore Settings page
       */
      public function custom_ui() {

        $hook = current_filter();

        switch( $hook ) {

          default:
            // Do nothing
            break;

        }

      }

      /**
       * Register admin Scripts and Styles.
       *
       */
      public function admin_enqueue_scripts() {
        $screen = get_current_screen();

        switch( $screen->id ) {

          default:
            // Do nothing
            break;

        }

      }


    }

  }

}
