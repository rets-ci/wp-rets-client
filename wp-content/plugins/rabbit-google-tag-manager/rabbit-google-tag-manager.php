<?php
/**
 * Plugin Name: Rabbit Google Tags Manager
 * Plugin URI: https://www.usabilitydynamics.com
 * Description: Allows to manage Google Tags for different branches
 * Author: UsabilityDynamics, inc.
 * Version: 1.0.0
 * Tested up to: 4.9.1
 * Text Domain: rgtm
 * Domain Path: /static/languages/
 * Author URI: https://www.usabilitydynamics.com
 */

if ( ! defined( 'ABSPATH' ) ) {
  die();
}

if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' )
    && file_exists( dirname( __FILE__ ) . '/vendor/felixarntz/options-definitely/options-definitely.php' ) ) {
  require_once dirname( __FILE__ ) . '/vendor/autoload.php';
  require_once dirname( __FILE__ ) . '/vendor/felixarntz/options-definitely/options-definitely.php';
}

if ( !is_admin() ){
  add_action( 'wp_head', 'rtgm_render_head_snippet' );
  add_action( 'wp_footer', 'rtgm_render_body_snippet' );
}

add_action( 'wpod', 'rtgm_settings_init' );
add_filter( 'wpod_form_atts', 'rtgm_form_attrs' );

/**
 *
 */
function rtgm_form_attrs( $attrs ) {
  $attrs['novalidate'] = false;
  return $attrs;
}

/**
 * @return null|string
 */
function rtgm_get_git_branch() {

  if( isset( $_SERVER['GIT_BRANCH'] ) ) {
    return $_SERVER['GIT_BRANCH'];
  }

  if( !file_exists( ABSPATH . '.git/HEAD' ) ) {
    return null;
  }

  $_head = str_replace( array( 'ref: refs/heads/' ), '', file_get_contents( ABSPATH . '.git/HEAD' ) );

  if( $_head !== '' ) {
    return trim($_head);
  }

  return null;

}

/**
 * Render header tag
 */
function rtgm_render_head_snippet() {
  if ( !empty( $snippets = wpod_get_option('tags_manager', 'branch_tags') ) ) {

    foreach( $snippets as $snippet ) {
      if ( trim( $snippet['branch_name'] ) == rtgm_get_git_branch() ) {
        echo "\n<!-- Rabbit Google Tags Start / ".$snippet['branch_name']." -->\n" . htmlspecialchars_decode( $snippet['header_tag'], ENT_QUOTES ) . "\n<!-- Rabbit Google Tags End -->\n\n";
      }
    }

  }
}

/**
 * Render body tag
 */
function rtgm_render_body_snippet() {
  if ( !empty( $snippets = wpod_get_option('tags_manager', 'branch_tags') ) ) {

    foreach( $snippets as $snippet ) {
      if ( trim( $snippet['branch_name'] ) == rtgm_get_git_branch() ) {
        echo "\n<!-- Rabbit Google Tags Start / ".$snippet['branch_name']." -->\n" . htmlspecialchars_decode( $snippet['body_tag'], ENT_QUOTES ) . "\n<!-- Rabbit Google Tags End -->\n\n";
      }
    }

  }
}

/**
 * Init Settings
 * @param $wpod
 */
function rtgm_settings_init( $wpod ) {

  $wpod->add_components( array(
      'settings'                  => array(
          'screens'                   => array(
              'rtgm_settings' => array(
                  'title'                     => 'Rabbit Google Tag Manager',
                  'label'                     => 'Rabbit GTM',
                  'capability'                => 'manage_options',
                  'tabs'                      => array(
                      'tags_manager'        => array(
                          'title'                     => 'Tags Manager',
                          'description'               => 'Here you can manage Google Tags for different Branches',
                          'sections'                  => array(
                              'tags_and_branches' => array(
                                  'title' => '',
                                  'fields' => array(
                                      'branch_tags' => array(
                                          'title' => 'Tags & Branches',
                                          'type' => 'repeatable',
                                          'repeatable' => array(
                                              'fields' => array(
                                                  'branch_name' => array(
                                                      'type' => 'text',
                                                      'title' => 'Branch Name',
                                                      'required' => true
                                                  ),
                                                  'header_tag' => array(
                                                      'type' => 'textarea',
                                                      'title' => 'Header Tag'
                                                  ),
                                                  'body_tag' => array(
                                                      'type' => 'textarea',
                                                      'title' => 'Body Tag'
                                                  )
                                              )
                                          )
                                      )
                                  )
                              )
                          )
                      )
                  )
              )
          )
      )
  ) );

}