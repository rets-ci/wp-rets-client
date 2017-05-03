<?php
/**
 * Bootstrap
 *
 * @since 4.0.0
 */
namespace UsabilityDynamics\WPRETSC {

  use WP_Query;

  if( !class_exists( 'UsabilityDynamics\WPRETSC\Utility' ) ) {

    final class Utility {


      /**
       * Registers a system taxonomy if needed with most essential arguments.
       *
       * @since 2.2.1
       * @author potanin@UD
       * @param string $taxonomy
       * @param array $args
       * @return string
       */
      static public function verify_have_system_taxonomy($taxonomy = '', $args = array())
      {

        $args = wp_parse_args($args, array(
          'hierarchical' => true
        ));

        if (taxonomy_exists($taxonomy)) {
          return $taxonomy;
        }

        register_taxonomy( substr( $taxonomy, 0, 32 ), array( 'property' ), array(
          'hierarchical' => $args['hierarchical'],
          'update_count_callback' => null,
          'labels' => array(),
          'show_ui' => false,
          'show_in_menu' => false,
          'show_admin_column' => false,
          'meta_box_cb' => false,
          'query_var' => false,
          'rewrite' => false
        ));

        if (taxonomy_exists($taxonomy)) {
          return $taxonomy;
        } else {
          return false;
        }

      }

      /**
       * Get published, private and future property counts for each schedule.
       *
       * @param array $options
       * @return array|bool|mixed
       */
      static public function get_schedule_stats( $options = array() ) {
        global $wpdb;

        $terms = get_terms( array(
          'taxonomy' => 'rets_schedule',
          'orderby' => 'name',
          'order'=> 'DESC',
          'hide_empty' => false
        ) );

        ud_get_wp_rets_client()->write_log( 'Starting [get_schedule_stats].', 'debug' );

        foreach( $terms as $_term ) {
          wp_update_term_count_now( $_term->term_taxonomy_id, 'rets_schedule' );
        }

        ud_get_wp_rets_client()->write_log( 'Completed term count in [get_schedule_stats].', 'debug' );

        $options = wp_parse_args( $options, array(
          'cache' => 'schedule-stats'
        ));

        if( $options[ 'cache' ] ) {

          $_cache = wp_cache_get( $options[ 'cache' ], 'wp-rets-client' );

          if( $_cache ) {
            $_cache[ '_cached' ] = true;
            return $_cache;
          }

        }

        //foreach( $wpdb->get_results( "SELECT meta_value as schedule_id, count(meta_value) as count from {$wpdb->postmeta} where meta_key = 'wpp_import_schedule_id' group by meta_value order by count DESC;" ) as $_data ) {
        //  $_stats[ $_data->schedule_id ] = $_data->count;
        //}

        $_data = array();

        $_total = 0;

        foreach( $terms as $_term ) {

          $query = new WP_Query( array(
            'post_status' => array( 'publish', 'private', 'future', 'draft' ),
            'post_type'   => 'property',
            'posts_per_page' => 1,
            'tax_query' => array(
              array(
                'taxonomy' => 'rets_schedule',
                'field'    => 'slug',
                'terms'    => array( $_term->slug ),
              ),
            ),
            //'meta_key'    => ( defined( 'RETS_ID_KEY' ) ? RETS_ID_KEY : 'wpp::rets_pk' ),
            //'meta_value'  => $rets_id,
          ) );

          $_data[] = array(
            '_id' => strval( $_term->slug ),
            'schedule' => strval( $_term->slug ),
            'total' => intval( $query->found_posts ),
            //'term_count' => $_term->count,
            //'meta_count' => isset( $_stats[ $_term->slug ] ) ? intval( $_stats[ $_term->slug ] ) : null,
            //'total' => $_term->count,
            //'posts' => $posts->found_posts
          );

          $_total = $_total + $query->found_posts;
        }
        //die( '<pre>' . print_r( $terms , true ) . '</pre>' );

        $_result = array(
          'ok' => true,
          'data' => $_data,
          'terms' => $terms,
          'total' => $_total
          //'stats' => $_stats
        );

        if( $options[ 'cache' ] ) {
          wp_cache_set( $options[ 'cache' ], $_result, 'wp-rets-client', 3600 );
        }

        return $_result;

      }

      /**
       *
       * @param $rets_id
       * @return null
       */
      static public function find_property_by_rets_id( $rets_id ) {
        global $wpdb;

        $_cache_key = 'mls-id-' . $rets_id;

        $_cache = wp_cache_get( $_cache_key, 'wp-rets-client' );

        if( $_cache ) {
          ud_get_wp_rets_client()->write_log( 'Found [' . $_cache . '] using $rets_id  [' . $rets_id . '] in cache.', 'debug' );
          return $_cache;
        }

        $_actual_post_id = $wpdb->get_var( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='rets_id' AND meta_value={$rets_id};" );

        if( $_actual_post_id ) {
          wp_cache_set( $_cache_key, $_actual_post_id, 'wp-rets-client', 36000 );
          return $_actual_post_id;
        }

        // temp support for old format
        if( empty( $_actual_post_id ) ) {
          $_actual_post_id = $wpdb->get_var( "SELECT post_id FROM {$wpdb->postmeta} WHERE meta_key='rets.id' AND meta_value={$rets_id};" );
          wp_cache_set( $_cache_key, $_actual_post_id, 'wp-rets-client', 36000 );
          return $_actual_post_id;
        }

        // this excludes any orphan meta as well as "inherit" posts, it will also use the post with ther LOWER ID meaning its more likely to be original
        $query = new WP_Query( array(
          'post_status' => array( 'publish', 'draft', 'pending', 'trash', 'private', 'future' ),
          'post_type'   => 'property',
          'meta_key'    => ( defined( 'RETS_ID_KEY' ) ? RETS_ID_KEY : 'wpp::rets_pk' ),
          'meta_value'  => $rets_id,
        ) );

        // @TODO: check if query returned result! And there is no Error! peshkov@UD

        // what if there is two - we fucked up somewhere before...
        if( count( $query->posts ) > 1 ) {
          ud_get_wp_rets_client()->write_log( "Error! Multiple (".count( $query->posts ).") matches found for rets_id [" . $rets_id . "]." );
        }

        if( count( $query->posts ) > 0 ) {
          ud_get_wp_rets_client()->write_log( 'Found ' . $query->posts[0]->ID . ' using $rets_id: ' . $rets_id);

          wp_cache_set( $_cache_key, $query->posts[0]->ID, 'wp-rets-client', 3600 );

          return $query->posts[0]->ID;


        } else {
          ud_get_wp_rets_client()->write_log( 'Did not find any post ID using $rets_id [' . $rets_id . '].' );
        }

        return null;

      }

      /**
       * Write to Log. Writes to either rets-log.log or rets-debug.log, depending on type.
       *
       * The rets-debug.log file is not written to if it does not exist.
       *
       * By the time the post_data gets here it already has an ID because get_default_post_to_edit() is used to create it
       *  it is created with "auto-draft" status but all meta is already added to it.
       *
       * - all post meta/terms added by this thing are attached to the original post, it seems
       *
       * tail -f wp-content/rets-log.log
       * tail -f wp-content/rets-debug.log
       *
       * @param $data
       * @param $type
       * @return bool
       */
      static public function write_log( $data, $type = 'debug' ) {

        // same format as debug.log
        $_time_stamp = date('d-M-Y h:i:s T', time());

        if( is_array( $data ) || is_object( $data ) ) {
          $_content = '[' . $_time_stamp  . '] ' . print_r( $data, true ) . ' [' . timer_stop() . 's].' . "\n";
        } else {
          $_content = '[' . $_time_stamp  . '] ' . $data . ' [' . timer_stop() . 's].' . "\n";
        }

        if( $type === 'error' || $type === 'info' || $type === 'warning' ) {
          file_put_contents( ABSPATH . rtrim( ud_get_wp_rets_client()->logfile, '/\\' ), $_content, FILE_APPEND  );
          return true;
        }

        if( file_exists( ud_get_wp_rets_client()->debug_file ) ) {
          file_put_contents( ABSPATH . rtrim( ud_get_wp_rets_client()->debug_file, '/\\' ), $_content, FILE_APPEND  );
          return true;
        }

        return false;

      }

      /**
       * Build Date Array Range for Histogram Buckets.
       *
       * @author potanin@UD
       * @see http://stackoverflow.com/questions/4312439/php-return-all-dates-between-two-dates-in-an-array
       * @param $strDateFrom
       * @param $strDateTo
       * @return array
       */
      public static function build_date_range( $strDateFrom,$strDateTo ) {
          // takes two dates formatted as YYYY-MM-DD and creates an
          // inclusive array of the dates between the from and to dates.

          // could test validity of dates here but I'm already doing
          // that in the main script

          $aryRange=array();

          $iDateFrom=mktime(1,0,0,substr($strDateFrom,5,2),     substr($strDateFrom,8,2),substr($strDateFrom,0,4));
          $iDateTo=mktime(1,0,0,substr($strDateTo,5,2),     substr($strDateTo,8,2),substr($strDateTo,0,4));

          if ($iDateTo>=$iDateFrom)
          {
            array_push($aryRange,date('Y-m-d',$iDateFrom)); // first entry
            while ($iDateFrom<$iDateTo)
            {
              $iDateFrom+=86400; // add 24 hours
              array_push($aryRange,date('Y-m-d',$iDateFrom));
            }
          }
          return $aryRange;

      }

      /**
       * Get Detailed Modified Listing Histogram Data
       *
       * @author potanin@UD
       * @param $options
       * @return array|null|object
       */
      public static function query_modified_listings( $options ) {
        global $wpdb;

        $options = (object) wp_parse_args( $options, array(
          "limit" => 10
        ));

        // automatically set end
        if( !$options->endOfStartDate ) {
          $options->endOfStartDate = date('Y-m-d', strtotime($options->startDate. ' + 1 day'));
        }

        if( !$options->dateMetaField ) {
          $options->dateMetaField = 'rets_modified_datetime';
        }
        // $limit = 'LIMIT 0, 20;';

        $_query = "SELECT posts.ID, pm_modified.meta_value as {$options->dateMetaField}, pm_schedule.meta_value as schedule_id
          FROM {$wpdb->posts} posts
          LEFT JOIN {$wpdb->postmeta} pm_modified ON posts.ID = pm_modified.post_id
          LEFT JOIN {$wpdb->postmeta} pm_schedule ON posts.ID = pm_schedule.post_id
          WHERE 
            pm_schedule.meta_key='wpp_import_schedule_id' AND
            pm_schedule.meta_value='{$options->schedule}' AND
            pm_modified.meta_key='{$options->dateMetaField}' AND
            pm_modified.meta_value between DATE('{$options->startDate} 00:00:00') AND DATE('{$options->endOfStartDate} 00:00:00') AND 
            posts.post_type='property'  
            {$options->limit}";

        //echo($_query);

        // AND posts.post_status in ('publish', 'draft')
        // , p.post_title, p.post_status, p.post_modified
        // meta_value between DATE('2016-07-15 00:00:00') AND DATE('2016-07-16 00:00:00') AND
        $_result = $wpdb->get_results( $_query );

        return $_result;

      }

    }

  }

}
