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

  add_filter( 'automatic_updater_disabled', '__return_true' );
  add_filter( 'automatic_updates_is_vcs_checkout', '__return_false', 1 );

  add_action( 'template_redirect', array( 'RedDoorCompany\Policy\Caching', 'template_redirect' ), 20 );
  add_filter( 'redirect_canonical', array( 'RedDoorCompany\Policy\Caching', 'redirect_canonical' ), 5 );

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
    static public function redirect_canonical( $redirect ) {
      global $wp;

      if( headers_sent() ) {
        return $redirect;
      }

      // Cache any /listing/* redirection rules.
      if( isset( $wp->matched_rule ) && $wp->matched_rule === '^listing/([0-9]+)/?$' ) {

        // Will be removed when missing access toekn.
        header('X-Cache-Control-Reason:Single listing redirection.');

        // CloudFront will cache this forever due to 86400 cache control TTL, hardcoded.
        header('cache-control:public,cloudfront-maxage=31536000,varnish-maxage=31536000');

        // e.g. X-Surrogate-Keys: post-10579106
        if( isset( $wp->query_vars ) && is_array( $wp->query_vars ) && isset( $wp->query_vars[ 'p' ] )  ) {
          header('X-Surrogate-Keys:post-' . $wp->query_vars[ 'p' ], false );
        }

        return $redirect;

      }

      // Will be removed when missing access toekn.
      header('X-Cache-Control-Reason:All other redirection.');

      // CloudFront will cache this forever due to 86400 cache control TTL, hardcoded.
      header('cache-control:public,cloudfront-maxage=86400,varnish-maxage=31536000,max-age=86400');

      return $redirect;

    }

    /**
     * Standard Response Page
     *
     * @return array
     */
    static public function template_redirect() {

      // Should not happen, perhaps record error...
      if( headers_sent() ) {
        return false;
      }

      $_policy = array(
        "set" => false,
        "value" => array( 'public' ),
        "reason" => "",
        "surrogates" => array()
      );

      // On non-production, cache for 60 seconds.
      if( isset( $_SERVER[ 'GIT_BRANCH' ] ) && strpos( $_SERVER[ 'GIT_BRANCH' ], 'production' ) === 0 ) {
        $_policy[ 'value' ][] = 'max-age=60';
      }

      // We cache normal content "forever" and then purge when need to.
      if( !$_policy[ 'set' ] && ( is_archive() ) ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "Archive/term page cached forever, requires purge.";
        $_policy[ "cloudfront-maxage" ] = "31536000";
        $_policy[ "varnish-maxage" ] = "31536000";
      }

      // We cache normal content "forever" and then purge when need to.
      if( !$_policy[ 'set' ] && ( is_page() || is_single() || is_attachment() ) ) {
        global $wp_query;

        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "Single post, single page, attachment are cached 1 day in CF and forever in Varnish.";
        $_policy[ "cloudfront-maxage" ] = "86400";
        $_policy[ "varnish-maxage" ] = "31536000";

        foreach( (array) $wp_query->posts as $_post ) {
          $_policy[ "surrogates" ][] = $_post->post_type . '-' . $_post->ID;
        }

      }

      if( !$_policy[ 'set' ] && ( is_home() || is_front_page() ) ) {
        global $wp_query;

        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "Home or front page are cached for half-day in CF and forever in Varnish.";
        $_policy[ "cloudfront-maxage" ] = "43200";
        $_policy[ "varnish-maxage" ] = "31536000";

        foreach( (array) $wp_query->posts as $_post ) {
          $_policy[ "surrogates" ][] = $_post->post_type . '-' . $_post->ID;
        }

        $_policy[ "surrogates" ][] = 'home-page';

      }

      // Questionable...
      if( !$_policy[ 'set' ] && is_search() ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "Search cached forever.";
        $_policy[ "cloudfront-maxage" ] = "31536000";
        $_policy[ "varnish-maxage" ] = "31536000";
      }

      // Lets home previews use very unique hashes, they'll be cached forever.
      if( !$_policy[ 'set' ] && is_preview() ) {
        global $post;

        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "Previews are cached forever.";
        $_policy[ "cloudfront-maxage" ] = "10";
        $_policy[ "varnish-maxage" ] = "60";
        $_policy[ "surrogates" ][] ='post-' . $post->ID;
      }

      // Traditionally this would not be cached, but now - we no longer give a shit. Everything is cached the same for everybody.
      if( !$_policy[ 'set' ] && is_user_logged_in() ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "You are logged in, but we do not care.";
        $_policy[ "cloudfront-maxage" ] = "0";
        $_policy[ "varnish-maxage" ] = "0";
      }

      // This is no exception.
      if( !$_policy[ 'set' ] && is_404() ) {
        $_policy[ "set" ] = true;
        $_policy[ "reason" ] = "404 requests are cached for an hour on Varnish and not cached at all on CF.";
        $_policy[ "cloudfront-maxage" ] = "0";
        $_policy[ "varnish-maxage" ] = "3600";
      }

      // Set cache-control header.
      if( $_policy[ "set" ]  ) {

        if( isset( $_policy[ "varnish-maxage" ] ) ) {
          $_policy[ "value" ][] = 'varnish-maxage=' . $_policy[ "varnish-maxage" ];
        }

        if( isset( $_policy[ "cloudfront-maxage" ] ) ) {
          $_policy[ 'value' ][] =  'cloudfront-maxage=' . $_policy[ "cloudfront-maxage" ];
        }

        if( isset( $_policy[ "value" ] ) ) {
          header( 'cache-control:' . join( ',', $_policy[ "value" ] ) );
        }

        if( isset( $_policy[ "reason" ] ) ) {
          header( 'x-cache-control-reason:' . $_policy[ "reason" ], false );
        }

        // Keys will be combined into CSV in logs. @see https://api.wpcloud.io:19100/waf-v2/log-v2/_search?sort=timestamp:desc&size=199&q=response.headers.X-Surrogate-Keys:*
        foreach( (array) $_policy[ "surrogates" ]  as $_surrogate_key ) {
          header( 'X-Surrogate-Keys:' . $_surrogate_key, false );
        }

      }

      return $_policy;

    }

  }

}