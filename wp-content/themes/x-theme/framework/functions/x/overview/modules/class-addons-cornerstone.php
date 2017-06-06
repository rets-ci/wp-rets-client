<?php

class X_Addons_Cornerstone {

  public static $instance;

  public function __construct() {

    X_Addons_Home::add_script_data( 'x-auto-configure-cornerstone', array( $this, 'script_data_auto_configure_cornerstone' ) );
    add_action( 'wp_ajax_x_extensions_installer', array( $this, 'ajax_install_plugin' ) );

    add_action( 'wp_ajax_x_auto_install_cornerstone', array( $this, 'ajax_auto_install_cornerstone' ) );
    add_action( 'wp_ajax_x_auto_activate_cornerstone', array( $this, 'ajax_auto_activate_cornerstone' ) );
    add_action( 'x_addons_before_home', array( $this, 'auto_install_cornerstone' ) );

    $this->cs_install_error  = sprintf( __( 'We attempted to installed Cornerstone (required by X) automatically, but were unable to. You may need to <a target="_blank" href="%s">install Cornerstone manually</a>. <a data-tco-error-details href="#">Error Details.</a>', '__x__' ), 'https://theme.co/apex/kb/manual-plugin-installation/' );
    $this->cs_activate_error = sprintf( __( 'Cornerstone has been installed, but could not be automatically activated. Please activate from the <a href="%s">plugins page</a>. <a data-tco-error-details href="#">Error Details.</a>', '__x__' ), admin_url( 'plugins.php' ) );
  }

  public function script_data_auto_configure_cornerstone() {
    return array(
      'errors' => array(
        'install'  => $this->cs_install_error,
        'activate' => $this->cs_activate_error
      )
    );
  }

  public function auto_install_cornerstone() {

    if ( self::cornerstone_installed() ) {
      $state = ( self::cornerstone_activated() ) ? 'ready' : 'activate';
    } else {
      $state = 'install';
    }

    echo '<div data-tco-module="x-auto-configure-cornerstone" data-tco-module-state="'. $state . '"></div>';

  }

  public function ajax_auto_install_cornerstone() {

    x_tco()->check_ajax_referer();

    if ( self::cornerstone_installed() || ! current_user_can( 'install_plugins' ) ) {
      wp_send_json_error();
    }

    $extensions = X_Addons_Extensions::instance();
    $install = $extensions->install_plugin( array(
      'plugin'   => 'cornerstone/cornerstone.php',
      'package'  => X_TEMPLATE_PATH . '/framework/plugins/cornerstone.zip',
    ) );

    if ( is_wp_error( $install ) ) {
      wp_send_json_error( array(
        'message' => $this->cs_install_error,
        'errorDetails' => $install->get_error_message(),
      ) );
    } else {
      wp_send_json_success( array(
        'message' => __( 'Cornerstone (required by X) has been automatically installed.', '__x__' )
      ));
    }

  }

  public function ajax_auto_activate_cornerstone() {

    x_tco()->check_ajax_referer();

    $activate = activate_plugin( 'cornerstone/cornerstone.php', '', false, true );

    if ( is_wp_error( $activate ) ) {
      wp_send_json_error( array(
        'message' => $this->cs_activate_error,
        'errorDetails' => $activate->get_error_message(),
      ) );
    } else {
      wp_send_json_success( array(
        'message' => __( 'We noticed Cornerstone was installed but not activated. By visiting the X Addons page, Cornerstone has been activated automatically.', '__x__' )
      ) );
    }

  }

  public static function cornerstone_installed() {
    return X_Addons_Extensions::plugin_installed( 'cornerstone/cornerstone.php' );
  }

  public static function cornerstone_activated() {
    return is_plugin_active( 'cornerstone/cornerstone.php' );
  }

  public static function instance() {
    if ( ! isset( self::$instance ) ) {
      self::$instance = new self;
    }
    return self::$instance;
  }

}
