<?php
/**
 * Plugin Name: WP-Cloud: Tidy
 * Plugin URI: http://wpcloud.io/plugins/wp-cloud
 * Description: Minify output.
 * Version: 0.5.0
 * Author: wpCloud.io
 * Author URI: http://wpcloud.io/
 * License: GPLv2 or later
 * Network: True
 * Domain Path: /static/locale/
 * Text Domain: wp-cloud
 *
 *
 * @todo Remove tidy meta tag added into header.
 *
 */
namespace wpCloud\Tidy {

  use tidy;

  if( file_exists( __DIR__ . '/vendor/libraries/autoload.php' ) ) {
    include_once( __DIR__ . '/vendor/libraries/autoload.php' );
  }

  add_action( 'template_redirect', 'wpCloud\Tidy\Action::template_redirect', 5 );

  class Handler {

    /**
     * Sett Extra.md in wiki for installation instructions.
     *
     * @param $buffer
     * @return tidy
     */
    public static function minify( $buffer ) {

      if( !class_exists( 'tidy' ) ) {
        return $buffer;
      }

      $tidy = new tidy;

      $tidy->parseString( $buffer, array(
        'tab-size' => 0,
        'indent' => 0, // set to 0 to compress
        'output-xhtml' => true,

        'fix-uri' => true,
        'new-empty-tags' => 'command embed keygen source track wbr i',
        'new-blocklevel-tags' => 'menu,mytag,article,header,footer,section,nav',
        'new-inline-tags' => 'video,audio,canvas,ruby,rt,rp',
        'uppercase-tags' => false,
        'vertical-space' => false,
        'drop-font-tags' => false,
        'break-before-br' => false,
        'newline' => true,
        'sort-attributes' => true,
        'repeated-attributes' => true,
        'tidy-mark' => true,
        'wrap-attributes' => false,
        'output-encoding' => 'utf8',
        // 'clean'   => true, // adds some cdata crap
        'preserve-entities' => true, // encoded chars
        //'output-xml'   => true,
        'hide-comments' => true,
        'show-warnings' => false,
        'drop-empty-paras' => true,
        'wrap' => 0
      ) );

      $tidy->cleanRepair();

      $tidy = str_replace( "\n", "", $tidy );

      return $tidy;

    }

  }

  class Action {

    /**
     *
     */
    static public function template_redirect() {
      global $post, $wp_query;

      // die( '<pre>' . print_r( $wp_query, true ) . '</pre>' );
      //die( '<pre>' . print_r( $wp_query->posts, true ) . '</pre>' );
      if( !is_home() && !is_search() && !is_single() ) {
        return;
      }

      if( isset( $wp_query->query ) && isset( $wp_query->query['amd_asset_type'] ) && $wp_query->query['amd_asset_type'] ) {
        return;
      }

      if( !in_array( $post->post_type, array( 'post', 'page', 'property' ) ) ) {
        return;
      }

      if( headers_sent() ) {
        return;
      }

      header( 'X-Output-Modified:tidy', false );

      // Minify output.
      ob_start( 'wpCloud\Tidy\Handler::minify' );

    }

  }

}