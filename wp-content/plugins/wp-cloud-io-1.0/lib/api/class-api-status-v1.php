<?php
/**
 *
 * https://api.wpcloud.io/manager/v1/manifest.json
 * https://api.wpcloud.io/manager/v1/manifest.json?raw-vcl=true
 *
 * https://api.wpcloud.io/manager/v1/containers.json
 *
 * @author potanin@UD
 */
namespace wpCloud\API\Status\V1 {

  class Register {

    public function __construct() {

      // Filters.
      // add_filter( 'wpCloud:manager:manifest',                 array( 'wpCloud\Manager\API\Manifest\V1\Filters', 'manifestList' ), 20 );
      // add_filter( 'wpCloud:manager:controllers',              array( 'wpCloud\Manager\API\Manifest\V1\Filters', 'controllerList' ), 20 );

      // API Endpoints.
      // add_action( 'wp_ajax_/manager/v1/manifest',             array( 'wpCloud\Manager\API\Manifest\V1\Actions', 'manifestList' ) );
      // add_action( 'wp_ajax_/manager/v1/containers',           array( 'wpCloud\Manager\API\Manifest\V1\Actions', 'containerList' ) );

      // add_action( 'wp_ajax_no_priv_/manager/v1/manifest',     array( 'wpCloud\Manager\API\Manifest\V1\Actions', 'manifestList' ) );
      // add_action( 'wp_ajax_no_priv_/manager/v1/containers',   array( 'wpCloud\Manager\API\Manifest\V1\Actions', 'containerList' ) );

    }

  }

  class Actions {

    /**
     * List Applications
     *
     * https://wpcloud.io/wp-admin/admin-ajax.php?action=/application/v1/list
     */
    public static function manifestList() {

      $_templates     = apply_filters( 'wpCloud:manager:templates', array() );
      $_manifest      = apply_filters( 'wpCloud:manager:manifest', array() );
      $_controllers   = apply_filters( 'wpCloud:manager:controllers', array() );

      if( !class_exists( 'Handlebars\Handlebars' ) ) {

        wp_send_json(array(
          "ok" => false,
          "message" => __( "Missing Handlerbars class." )
        ));

      }

      $engine = new Handlebars;

      $_output =  $engine->render( $_templates[ 'wpcloud-dynamic.vcl.mustache' ], $_data = array(
        'platform'=> 'wpcloud',
        'timestamp'=> time(),
        'version'=> time(),
        'etag'=> md5(json_encode($_manifest)),
        'manifest' => $_manifest,
        'controllers' => $_controllers,
      ));

      // Cache for half a minute in case rapid requests are made from multiple controllers.
      header( 'Cache-Control:public,max-age=30' );
      header( 'ETag:' . $_data['etag'] );

      if( isset( $_GET[ 'raw-vcl' ] ) && $_GET[ 'raw-vcl' ] === 'true' ) {
        header( 'Cache-Control:public,max-age=30' );
        header( 'Content-Type:text/plain' );
        die($_output);
      }

      // base64_decode
      wp_send_json(array(
        "ok" => true,
        "data" => array(
          "manifest" => $_manifest,
          "controllers" => $_controllers,
          "vcl" => base64_encode( $_output )
        )
      ));

    }

    /**
     *
     */
    public static function containerList() {

      wp_send_json(array(
        "ok" => true,
        "_version" => time(),
        "data" => apply_filters( 'wpCloud:manager:containers', array() )
      ));
    }

  }

  class Filters {

    /**
     * @param $_controllers
     * @return array|mixed
     */
    public static function controllerList( $_controllers ) {

      $_controllers = Utility::getControllers();

      return isset( $_controllers ) ? $_controllers : array();

    }

    /**
     *
     * @return array
     */
    public static function manifestList() {

      $_manifest = Docker\Utility::getManifest();

      return $_manifest;

    }

  }


}
