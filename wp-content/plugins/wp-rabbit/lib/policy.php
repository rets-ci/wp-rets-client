<?php
/**
 * Enforce policies.
 *
 *
 */
namespace RabbitCI\Policy {

  if( defined( 'CI_RABBIT_STATE_PROTECTED' ) && CI_RABBIT_STATE_PROTECTED ) {
    Utility::disable_updates();
    add_filter( 'admin_footer_text', array( 'RabbitCI\Policy\Filters', 'admin_footer_text' ), 35 );
  }

  class Utility {
    
    /**
     * Get Git Branch from env-var or disk.
     * 
     * @author potanin@UD
     */
    public static function disable_updates() {

      // Disable Core Updates EVERYWHERE
      add_filter( 'pre_site_transient_update_core',  array( 'RabbitCI\Policy\Filters', 'disable_wp_updates' ) );

      // Hide notices
      add_action('admin_menu',function() {
        remove_action( 'admin_notices', 'update_nag', 3 );
      });

      // Disable Plugin Updates
      remove_action( 'load-update-core.php', 'wp_update_plugins' );
      add_filter( 'pre_site_transient_update_plugins', array( 'RabbitCI\Policy\Filters', 'disable_wp_updates' ) );

      // Disable Theme Updates
      remove_action( 'load-update-core.php', 'wp_update_themes' );
      add_filter( 'pre_site_transient_update_themes', array( 'RabbitCI\Policy\Filters', 'disable_wp_updates' ) );

    }
    
  }

  class Filters {

    /**
     * Show protected notice.
     *
     * @return string
     */
    public static function admin_footer_text() {
      return '<span id="footer-thankyou" class="wp-rabbit-footer-notice">' . __( 'The current deployment is [protected]. Updates disabled.' ) . '<span>';
    }

  public static function disable_wp_updates() {
      global $wp_version;

      return (object) array(
        'updates' => array(),
        'version_checked' => $wp_version,
        'last_checked' => time(),
      );

    }

  }

  class Actions {
    
  }



}
