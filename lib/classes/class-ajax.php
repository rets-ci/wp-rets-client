<?php

namespace UsabilityDynamics\WPRETSC {

  if (!class_exists('UsabilityDynamics\WPRETSC\Ajax')) {

    /**
     * Class Ajax
     * @package UsabilityDynamics\WPRETSC
     */
    final class Ajax {

      public function __construct() {

        add_action( 'wp_ajax_wpp_retsci_signin', array( $this, 'ajax_retsci_signin' ) );
        add_action( 'wp_ajax_wpp_retsci_subscriber', array( $this, 'ajax_retsci_subscriber' ) );

      }

      /**
       *
       */
      public function ajax_retsci_signin() {

        check_ajax_referer( 'wpp_retsci_signin', 'security', 1 );

        $payload = $_POST['payload'];

        $response = wp_remote_post( $payload['api_url'] . '/property/site/register/v1', $request_data = array(
          'headers' => array(
            'content-type' => 'application/json'
          ),
          'body' => json_encode(array(
            'ud_site_id' => $payload['ud_site_id'],
            'ud_site_secret_token' => $payload['ud_site_secret_token'],
            'retsci_site_secret_token' => $payload['retsci_site_secret_token'],
            'user_email' => wp_get_current_user()->user_email,
            'rets_credentials' => array(
              'url' => $payload['credentials']['url'],
              'user' => $payload['credentials']['user'],
              'password' => $payload['credentials']['password']
            )
          ))
        ) );

        if ( is_wp_error( $response ) )
          wp_send_json_error( 'Something went wrong' );

        $response_body = json_decode(wp_remote_retrieve_body($response));

        if ( !empty( $response_body->ok ) && $response_body->ok == true ) {

          if ( !empty( $response_body->retsci_site_id ) )
            update_site_option( 'retsci_site_id', $response_body->retsci_site_id );

          if ( !empty( $response_body->retsci_site_public_key ) )
            update_site_option( 'retsci_site_public_key', $response_body->retsci_site_public_key );

          update_site_option( 'retsci_site_secret_token', $payload['retsci_site_secret_token'] );

        }

        wp_send_json($response_body);

      }

      public function ajax_retsci_subscriber() {

        check_ajax_referer( 'wpp_retsci_subscriber', 'security', 1 );

        $payload = $_POST['payload'];

        if (!get_option('rets_credential_login_url')) {
          add_option('rets_credential_login_url', $payload['credentials']['url']);
        } else {
          update_option( 'rets_credential_login_url', $payload['credentials']['url'] );
        }
        if (!get_option('rets_credential_username')) {
          add_option('rets_credential_username', $payload['credentials']['user']);
        } else {
          update_option( 'rets_credential_username', $payload['credentials']['user'] );
        }
        if (!get_option('rets_credential_password')) {
          add_option('rets_credential_password', $payload['credentials']['password']);
        } else {
          update_option( 'rets_credential_password', $payload['credentials']['password'] );
        }
        if (!get_option('rets_credential_version')) {
          add_option('rets_credential_version', $payload['credentials']['rets_version']);
        } else {
          update_option( 'rets_credential_version', $payload['credentials']['rets_version'] );
        }
        if (!get_option('rets_credential_user_agent')) {
          add_option('rets_credential_user_agent', $payload['credentials']['user_agent']);
        } else {
          update_option( 'rets_credential_user_agent', $payload['credentials']['user_agent'] );
        }

        $response = wp_remote_post( $payload['api_url'] . 'retsci/blog/subscriber/v1', $request_data = array(
          'headers' => array(
            'content-type' => 'application/json'
          ),
          'body' => json_encode(array(
            'retsci_site_id' => $payload['retsci_site_id'],
            'retsci_secret_token' => $payload['retsci_site_secret_token'],
            'user_data' => json_encode($payload['user_data']),
            //'wp_site_data' => $payload['wp_site_data'],
            'blog_id' => intval($payload['blog_id']),
            'blog_url' => $payload['blog_url'],
            'rets_credentials' => json_encode(array(
              'login_url' => $payload['credentials']['url'],
              'username' => $payload['credentials']['user'],
              'password' => $payload['credentials']['password'],
              'version' => $payload['credentials']['rets_version'],
              'user_agent' => $payload['credentials']['user_agent'],
            ))
          ))
        ) );

        if ( is_wp_error( $response ) )
          wp_send_json_error( 'Something went wrong' );

        $response_body = json_decode(wp_remote_retrieve_body($response));

        if ( !empty( $response_body->ok ) && $response_body->ok == true ) {

        }

        wp_send_json($response_body);

      }
    }
  }
}