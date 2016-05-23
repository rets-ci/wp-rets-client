<?php

namespace RDC {

  class Agents {

    public function __construct() {

      add_action('init',array( $this, 'agent_rewrite_rule' ) );

      add_action( 'template_redirect', array( $this, 'agent_rewrite_catch' ) );

      add_action('pre_get_posts', array( $this, 'pre_get_posts' ) );

      add_filter( 'wp_title', array( $this, 'change_wp_title' ), 10, 3 );

      add_filter( 'breadcrumb_trail_items', array( $this, 'disable_breadcrumbs' ), 10, 2 );

    }

    /**
     *
     */
    public function agent_rewrite_rule() {
      add_rewrite_tag( '%agent%', '([^&]+)' );
      add_rewrite_rule(
          '^agent/([^/]*)/?',
          'index.php?agent=$matches[1]',
          'top'
      );
    }

    /**
     *
     */
    public function agent_rewrite_catch() {
      global $wp_query;

      if ( !$wp_query->is_404 && array_key_exists( 'agent', $wp_query->query_vars ) ) {
        include ( get_stylesheet_directory()  . '/agent.php');
        exit;
      }
    }

    /**
     * @param $query
     */
    public function pre_get_posts($query) {
      if ( !is_admin() && !empty( $query->query['agent'] ) ) {
        $query->is_home = false;

        if ( user_can( $query->query['agent'], 'agent' ) ) {
          $query->agent = get_user_by('ID', $query->query['agent']);
          $query->queried_object = $query->agent->data;
          $query->is_agent = true;
        } else {
          $query->is_404 = true;
        }
      }
    }

    /**
     * @param $title
     * @param $sep
     * @param $seploc
     * @return string
     */
    public function change_wp_title( $title, $sep, $seploc ){

      global $wp_query;

      if ( !empty($wp_query->is_agent) ) {
        return $wp_query->queried_object->display_name .' '.$sep.' '. $title;
      }

      return $title;
    }

    /**
     * @param $items
     * @param $args
     * @return array
     */
    public function disable_breadcrumbs( $items, $args ){

      global $wp_query;

      if ( !empty($wp_query->is_agent) ) {
        return array();
      }

      return $items;
    }
  }

  $_agents = new Agents();
}