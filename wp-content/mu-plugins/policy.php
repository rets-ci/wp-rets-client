<?php
/**
 * Plugin Name: Policy
 * Plugin URI: http://usabilitydynamics.com/plugins/
 * Description: General settings.
 * Author: Usability Dynamics, Inc.
 * Version: 0.1.0
 * Author URI: http://usabilitydynamics.com
 *
 */

/**
 * Caching Policy (Varnish).
 *
 */
namespace RedDoorCompany\Policy {


  // CloudFront Hack fix. This issue should go away, but happens if we ever forget to forward specific headers, in particular the host. - potanin@UD
  if( isset( $_SERVER['HTTP_HOST'] ) && isset( $_SERVER['HTTP_X_SET_APPLICATION'] ) && $_SERVER['HTTP_HOST'] === 'c.rabbit.ci' && $_SERVER['HTTP_X_SET_APPLICATION'] === 'www.reddoorcompany.com' ) {
    $_SERVER['HTTP_HOST'] = 'www.reddoorcompany.com';
  }


  add_filter( 'automatic_updater_disabled', '__return_true' );
  add_filter( 'automatic_updates_is_vcs_checkout', '__return_false', 1 );

  add_action( 'template_redirect', array( 'RedDoorCompany\Policy\Caching', 'template_redirect' ), 20 );
  add_filter( 'redirect_canonical', array( 'RedDoorCompany\Policy\Caching', 'redirect_canonical' ), 100 );

  // Its the only file taht is add the the real "footer" js, since we add both files in footer, i think it can be dropped.
  add_action( 'wp_enqueue_scripts', function () {
    wp_deregister_script( 'wp-embed' );
  } );

  // Force minit to be enabled if its avialable.
  add_filter( 'option_active_plugins', function ( $_plugins ) {

    $_plugins[] = 'wp-rabbit/wp-rabbit.php';
    $_plugins[] = 'wp-rets-client/wp-rets-client.php';
    $_plugins[] = 'wp-upstream/wp-upstream.php';
    $_plugins[] = 'simple-history/index.php';
    $_plugins[] = 'siteorigin-panels/siteorigin-panels.php';
    $_plugins[] = 'so-widgets-bundle/so-widgets-bundle.php';
    $_plugins[] = 'wp-stateless/wp-stateless-media.php';

    return array_unique( $_plugins );

  } );

  class Caching {

    /**
     * Handles Redirection Caching.
     *
     * e.g. web.curl -I https://www.reddoorcompany.com/listing/20910407
     *
     * @param $redirect
     * @return mixed
     */
    function redirect_canonical( $redirect ) {
      global $wp;

      // Cache any /listing/* redirection rules.
      if( isset( $wp->matched_rule ) && $wp->matched_rule === '^listing/([0-9]+)/?$' && !headers_sent()) {

        // Force Varnish to cache forever
        header('X-Cache-TTL:365d');

        // For future support.
        header('X-CloudFront-TTL:31536000');

        // Will be removed when missing access toekn.
        header('X-Cache-Control-Reason:Single listing redirection');

        // CloudFront will cache this forever due to 86400 cache control TTL, hardcoded.
        header('cache-control:public,max-age=31536000,s-maxage=31536000,force-cache=true');
      }

      return $redirect;

    }

    /**
     *
     *
     * @return array
     *
     */
    function template_redirect() {

      $_policy = array(
        "set" => false,
        "value" => 'public,max-age=31536000,s-maxage=31536000,force-cache=true',
        "reason" => ""
      );

      // On non-production, cache for 60 seconds.
      if( isset( $_SERVER[ 'GIT_BRANCH' ] ) && strpos( $_SERVER[ 'GIT_BRANCH' ], 'production' ) === 0 ) {
        $_policy[ 'value' ] = 'public,max-age=60,s-maxage=60,force-cache=true';
      }

      // This will only affect Varnish. We don't want Varnish to cache things when on CloudFront.
      if( isset( $_SERVER[ 'HTTP_CLOUDFRONT_FORWARDED_PROTO' ] ) && $_SERVER[ 'HTTP_CLOUDFRONT_FORWARDED_PROTO' ] === 'https' ) {
        //$_policy[ 'value' ] = 'private,no-cache,no-store';
      }

      // We cache normal content "forever" and then purge when need to.
      if( !$_policy[ 'set' ] && ( is_archive() ) ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "Archive/term page.";
        $_policy[ "cloudfront_ttl" ] = "31536000";
        $_policy[ "varnish_ttl" ] = "31536000";
      }

      // We cache normal content "forever" and then purge when need to.
      if( !$_policy[ 'set' ] && ( is_page() || is_single() || is_attachment() || is_home() || is_front_page() ) ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "Single post, single page, attachment, home or front page are cached forever.";
        $_policy[ "cloudfront_ttl" ] = "31536000";
        $_policy[ "varnish_ttl" ] = "31536000";
      }

      // Questionable...
      if( !$_policy[ 'set' ] && is_search() ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "Search cached forever.";
        $_policy[ "cloudfront_ttl" ] = "31536000";
        $_policy[ "varnish_ttl" ] = "31536000";
      }

      // Lets home previews use very unique hashes, they'll be cached forever.
      if( !$_policy[ 'set' ] && is_preview() ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "Previews are cached forever.";
        $_policy[ "cloudfront_ttl" ] = "31536000";
        $_policy[ "varnish_ttl" ] = "31536000";
      }

      // Traditionally this would not be cached, but now - we no longer give a shit. Everything is cached the same for everybody.
      if( !$_policy[ 'set' ] && is_user_logged_in() ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "You are logged in, but we do not care.";
        $_policy[ "cloudfront_ttl" ] = "31536000";
        $_policy[ "varnish_ttl" ] = "31536000";
      }

      // This is no exception.
      if( !$_policy[ 'set' ] && is_404() ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "404 requests are cached forever.";
        $_policy[ "cloudfront_ttl" ] = "31536000";
        $_policy[ "varnish_ttl" ] = "31536000";
      }

      // Set cache-control header.
      if( $_policy[ "set" ] && !headers_sent() ) {

        if( isset( $_policy[ "value" ] ) ) {
          header( 'cache-control:' . $_policy[ "value" ] );
        }

        if( isset( $_policy[ "reason" ] ) ) {
          header( 'x-cache-control-reason:' . $_policy[ "reason" ] );
        }

        if( isset( $_policy[ "varnish_ttl" ] ) ) {
          header( 'x-cache-ttl:' . $_policy[ "varnish_ttl" ] .'s' );
        }

        if( isset( $_policy[ "cloudfront_ttl" ] ) ) {
          header( 'x-cloudfront-ttl:' . $_policy[ "cloudfront_ttl" ] );
        }

      }

      return $_policy;

    }

  }

}