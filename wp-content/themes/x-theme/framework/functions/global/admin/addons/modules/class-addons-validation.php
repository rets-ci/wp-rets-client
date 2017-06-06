<?php

class X_Addons_Validation {

  public static $instance;

  public function __construct() {

    X_Addons_Home::add_script_data( 'x-validation', array( $this, 'script_data' ) );
    X_Addons_Home::add_script_data( 'x-validation-revoke', array( $this, 'script_data_revoke' ) );
    add_action( 'wp_ajax_x_validation', array( $this, 'ajax_validation' ) );
    add_action( 'wp_ajax_x_validation_revoke', array( $this, 'ajax_revoke' ) );

  }

  public function script_data() {
    return array(
      'verifying'   => __( 'Verifying license&hellip;', '__x__' ),
      'error'       => __( '<strong>Uh oh</strong>, we couldn&apos;t check if this license was valid. <a data-tco-error-details href="#">Details.</a>', '__x__' ),
      'notices'     => array(
        'validation-complete' => __( '<strong>Congratulations!</strong> Your site is validated. Addons are now unlocked.', '__x__' )
      ),
      'errorButton' => __( 'Go Back', '__x__' ),
    );
  }

  public function script_data_revoke() {
    return array(
      'confirm'  => x_i18n( 'overview', 'revoke-validation'),
      'accept'   => __( 'Yes, revoke validation', '__x__' ),
      'decline'  => __( 'Stay validated', '__x__' ),
      'revoking' => __( 'Revoking&hellip;', '__x__' ),
      'notices'  => array(
        'validation-revoked' => sprintf( __( '<strong>Validation revoked.</strong> You can re-assign licenses from <a href="%s" target="_blank">Manage Licenses</a>.', '__x__' ), 'https://theme.co/apex/licenses/' )
      )
    );
  }

  public function ajax_validation() {

    x_tco()->check_ajax_referer();

    if ( ! current_user_can( 'manage_options' ) || ! isset( $_POST['code'] ) || ! $_POST['code'] ) {
      wp_send_json_error( array( 'message' => 'No purchase code specified.' ) );
    }

    $this->code = sanitize_text_field( $_POST['code'] );
    $validator = new TCO_Validator( $this->code, X_SLUG );

    $validator->run();

    if ( $validator->has_connection_error() ) {
      wp_send_json_error( array( 'message' => $validator->connection_error_details() ) );
    }

    $response = $this->get_validation_response( $validator );
    $response['response_body'] = $validator->get_response();

    if ( isset( $response['complete'] ) && $response['complete'] ) {
      $this->update_validation( $this->code );
    } else {
      $this->update_validation( false );
    }

    wp_send_json_success( $response );

  }

  public function get_validation_response( $validator ) {

    // Purchase code is not valid
    if ( ! $validator->is_valid() ) {
      return array(
        'message' => __( 'We&apos;ve checked your code, but it <strong>doesn&apos;t appear to be a valid license.</strong> Please double check the code and try again.', '__x__' ),
        'button'  => __( 'Go Back', '__x__' ),
        'dismiss' => true,
      );
    }

    // Valid, but the purchase code isn't associated with an account.
    if ( ! $validator->is_verified() ) {
      return array(
        'message' => __( 'This looks like a <strong>brand new license that hasn&apos;t been added to a Themeco account yet.</strong> Login to your existing account or register a new one to continue.', '__x__' ),
        'button'  => __( 'Login or Register', '__x__' ),
        'url'     => add_query_arg( $this->out_params(), 'https://theme.co/apex/product-validation/' )
      );
    }

    // Purchase code linked to an account, but doesn't have a site
    if ( ! $validator->has_site() ) {
      return array(
        'message' => __( 'Your code is valid, but <strong>we couldn&apos;t automatically link it to your site.</strong> You can add this site from within your Themeco account.', '__x__' ),
        'button'  => __( 'Manage Licenses', '__x__' ),
        'url'     => 'https://theme.co/apex/licenses/',
        'dismiss' => true,
        'newTab'  => true
      );
    }

    // Purchase code linked, and site exists, but doesn't match this site.
    if ( ! $validator->site_match() ) {
      return array(
        'message' => __( 'Your code is valid but looks like it has <strong>already been used on another site.</strong> You can revoke and re-assign within your Themeco account.', '__x__' ),
        'button'  => __( 'Manage Licenses', '__x__' ),
        'url'     => 'https://theme.co/apex/licenses/',
        'dismiss' => true,
        'newTab'  => true
      );
    }

    return array(
      'complete' => true,
      'message' => __( '<strong>Congratulations,</strong> your site is now validated!', '__x__' )
    );

  }

  public function out_params() {
    return array(
      'code'        => $this->code,
      'product'     => 'x',
      'siteurl'     => x_tco()->get_site_url(),
      'return-url'  => esc_url( x_addons_get_link_home() )
    );
  }

  public function ajax_revoke() {
    x_tco()->check_ajax_referer();
    $this->update_validation( false );
    wp_send_json_success();
  }

  public function update_validation( $code ) {

    if ( $code ) {
      update_option( 'x_product_validation_key', $code );
    } else {
      delete_option( 'x_product_validation_key' );
    }

    x_tco()->updates()->refresh();

  }

  public static function preload_key() {
    $key = '';
    if ( isset( $_REQUEST['tco-key'] ) ) {
      $key = esc_html( $_REQUEST['tco-key'] );
    }
    return $key;
  }

  public static function instance() {
    if ( ! isset( self::$instance ) ) {
      self::$instance = new self;
    }
    return self::$instance;
  }

}
