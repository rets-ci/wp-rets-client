<?php
/**
 *
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Layouts_Builder' ) ) {

    /**
     * Class Layouts_Builder
     *
     * @package UsabilityDynamics\WPP
     */
    class Layouts_Builder extends Scaffold {

      /**
       * @var string
       */
      private $post_type = 'wpp_layout';

      /**
       * @var
       */
      public $api_client;

      /**
       * Layouts_Builder constructor.
       */
      public function __construct() {
        parent::__construct();

        $this->api_client = new Layouts_API_Client( array(
          'url' => defined( 'UD_API_LAYOUTS_URL' ) ? UD_API_LAYOUTS_URL : 'https://api.usabilitydynamics.com/product/property/layouts/v1'
        ) );

        /**
         * Register post type
         */
        add_action( 'init', array( $this, 'register_layout_post_type' ) );
        add_action( 'wp_admin', array( $this, 'wp_admin' ) );
        add_action( 'add_meta_boxes', array( $this, 'add_meta_boxes' ), 100  );

        /**
         * Hook when layout is published
         */
        add_action( 'transition_post_status', array( $this, 'post_status_change' ), 1000, 3 );

        /**
         *
         */
        add_action( 'wpp::layouts::publish_' . $this->post_type, array( $this, 'publish_layout' ) );

        /**
         *
         */
        add_action( 'admin_enqueue_scripts', array( $this, 'admin_enqueue_scripts' ) );
        add_action( 'wp_enqueue_scripts', array( $this, 'wp_enqueue_scripts' ) );

        /**
         *
         */
        add_action( 'save_post', array( $this, 'load_to_api' ), 50 );
        add_action( 'save_post', array( $this, 'update_local_layouts' ), 100 );

        /**
         *
         */
        add_filter( 'wpp::layouts::current', array( $this, 'layout_preview_post' ) );

        /**
         *
         */
        add_action( 'wp_ajax_so_panels_layouts_query', array( $this, 'wpp_panels_ajax_get_prebuilt_layouts' ), 9 );

        /**
         *
         */
        add_action( 'wp_ajax_so_panels_get_layout', array( $this, 'wpp_panels_ajax_get_prebuilt_layout' ), 9 );
      }

      /**
       * Enqueue admin styles
       */
      public function admin_enqueue_scripts() {
        global $current_screen;
        switch( $current_screen->id ) {
          case 'wpp_layout':
            wp_register_script( 'wpp-layouts-admin-scripts', WPP_LAYOUTS_URL . 'static/scripts/wpp.layouts.admin.js', array(), WPP_LAYOUTS_VERSION );
            wp_enqueue_script( 'wpp-layouts-admin-scripts' );
            wp_localize_script( 'wpp-layouts-ajax', 'wpp_layouts_ajax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );

            wp_register_style( 'wpp-layouts-admin-styles', WPP_LAYOUTS_URL . 'static/styles/wpp.layouts.admin.css', array(), WPP_LAYOUTS_VERSION );
            wp_enqueue_style( 'wpp-layouts-admin-styles' );
            break;
        }
      }

      public function wp_enqueue_scripts() {
        wp_enqueue_style( 'wpp-layouts-styles', WPP_LAYOUTS_URL . 'static/styles/wpp.layouts.css', array(), WPP_LAYOUTS_VERSION );


      }

      /**
       * @param $ID
       */
      public function publish_layout( $ID ) {

        $_post = get_post( $ID );
        $_meta = get_post_meta( $ID, 'panels_data', 1 );
        $_tags_objects = wp_get_post_terms( $ID, 'wpp_layout_type' );
        $_remote_layout_id = get_post_meta( $ID, '_remote_layout_id', 1 );
        $_tags = array();

        if( !empty( $_tags_objects ) && is_array( $_tags_objects ) ) {
          foreach( $_tags_objects as $_tags_object ) {
            $_tags[] = array(
              'label' => $_tags_object->name,
              'tag' => $_tags_object->slug
            );
          }
        }

        if( !empty( $_remote_layout_id ) && strlen( $_remote_layout_id ) ) {
          $res = $this->api_client->update_layout( $_remote_layout_id, array(
            'title' => $_post->post_title,
            'screenshot' => get_post_meta( $ID, 'screenshot', 1 ),
            'layout' => $_meta,
            'tags' => $_tags
          ) );
        } else {
          $res = $this->api_client->add_layout( array(
            'title' => $_post->post_title,
            'screenshot' => get_post_meta( $ID, 'screenshot', 1 ),
            'layout' => $_meta,
            'tags' => $_tags
          ) );
        }

        if( !is_wp_error( $res ) ) {
          $res = json_decode( $res );
          if( $res->ok && $res->data->_id ) {
            update_post_meta( $ID, '_remote_layout_id', $res->data->_id );
          }

        }
      }

      /**
       * @param $new_status
       * @param $old_status
       * @param $post
       */
      public function post_status_change( $new_status, $old_status, $post ) {

        if( $post->post_type != $this->post_type ) return;

        if( $new_status == 'publish' ) {
          do_action( 'wpp::layouts::publish_' . $this->post_type, $post->ID );
        }

      }

      /**
       * Fetch Capabilities from API, cache.
       *
       * @author potanin@UD
       *
       * @return array|bool|mixed|\WP_Error
       */
      public function get_capabilities() {

        $_cache = wp_cache_get( 'capabilities', 'wp-property-layouts' );

        if( $_cache && is_object( $_cache ) ) {
          $_cache->_cached = true;
          return $_cache;
        }

        $res = wp_remote_get( trailingslashit( $this->api_client->get_url() ), array(
          'headers' => wp_parse_args( array(
            'content-type' => 'application/json'
          ), $this->api_client->get_headers() )
        ) );

        if( is_wp_error( $res ) ) {
          return $res;
        }

        $_capabilities = json_decode( $res['body'] );

        wp_cache_set( 'capabilities', $_capabilities->capabilities, 'wp-property-layouts', 360 );

        return $_capabilities->capabilities;

      }

      /**
       * Add "Layout Options" metabox.
       *
       * @author potanin@UD
       */
      public function add_meta_boxes() {

        add_meta_box( 'wpp_layout_options', 'Layout Options', array( $this, 'wpp_layout_options'), 'wpp_layout', 'side', 'high' );

        // @hack. Should remove all meta-boxes that are not ours to avoid clustter.
        remove_meta_box( 'shareaholic', 'wpp_layout', 'side' );

      }

      /**
       *
       * @author potanin@UD
       */
      public function wpp_layout_options() {
        global $post;

        $capabilities = $this->get_capabilities();

        include_once( trailingslashit( WPP_LAYOUTS_PATH ). 'static/views/wpp_layout_options.php' );

      }

      /**
       *
       *
       * @todo Only insert terms if they do not exist on some sort of install process.
       *
       */
      public function wp_admin() {

        wp_insert_term( __( 'Single Property', ud_get_wp_property_layouts()->domain ), 'wpp_layout_type', array(
          'description' => __( 'Single Property Layouts', ud_get_wp_property_layouts()->domain ),
          'slug' => 'single-property'
        ) );

        wp_insert_term( __( 'Property Overview', ud_get_wp_property_layouts()->domain ), 'wpp_layout_type', array(
          'description' => __( 'Property Overview Layouts', ud_get_wp_property_layouts()->domain ),
          'slug' => 'property-overview'
        ) );

        wp_insert_term( __( 'Term Overview', ud_get_wp_property_layouts()->domain ), 'wpp_layout_type', array(
          'description' => __( 'Term Overview Layouts', ud_get_wp_property_layouts()->domain ),
          'slug' => 'term-overview'
        ) );

        wp_insert_term( __( 'Load layout to API', ud_get_wp_property_layouts()->domain ), 'wpp_layout_api', array(
          'description' => __( 'Load layout to API', ud_get_wp_property_layouts()->domain ),
          'slug' => 'layout-api'
        ));

      }

      /**
       * Register taxonomies and post type.
       *
       * If the [WP_PROPERTY_LAYOUTS] feature flag is not set we sill register but hide the menu.
       *
       */
      public function register_layout_post_type() {

        register_taxonomy( 'wpp_layout_type', 'wpp_layout', array(
          'label' => __( 'Type', ud_get_wp_property_layouts()->domain ),
          'rewrite' => false,
          'hierarchical' => true,
          'show_ui'           => true,
          'show_in_menu'      => false,
          'show_admin_column' => false,
          'meta_box_cb'       => false,
          'query_var'         => false,
      ) );

        register_taxonomy( 'wpp_layout_api', 'wpp_layout', array(
          'label' => __( 'Load to API', ud_get_wp_property_layouts()->domain ),
          'rewrite' => false,
          'hierarchical' => true,
          'show_ui'           => true,
          'show_in_menu'      => false,
          'show_admin_column' => false,
          'meta_box_cb'       => false,
          'query_var'         => false
        ));

        register_post_type( 'wpp_layout', array(
          'public' => false,
          'show_ui' => ( defined('WP_PROPERTY_LAYOUTS') && WP_PROPERTY_LAYOUTS === true ) ? true : false,
          'description' => __( 'Layouts for property pages.', ud_get_wp_property_layouts()->domain ),
          'can_export' > true,
          'rewrite' => false,
          'labels' => array(
            'name' => _x( 'Layouts', 'post type general name', ud_get_wp_property_layouts()->domain ),
            'singular_name' => _x( 'Layout', 'post type singular name', ud_get_wp_property_layouts()->domain ),
            'menu_name' => _x( 'Layouts', 'admin menu', ud_get_wp_property_layouts()->domain ),
            'name_admin_bar' => _x( 'Layout', 'add new on admin bar', ud_get_wp_property_layouts()->domain ),
            'add_new' => _x( 'Add New', 'Layout', ud_get_wp_property_layouts()->domain ),
            'add_new_item' => __( 'Add New Layout', ud_get_wp_property_layouts()->domain ),
            'new_item' => __( 'New Layout', ud_get_wp_property_layouts()->domain ),
            'edit_item' => __( 'Edit Layout', ud_get_wp_property_layouts()->domain ),
            'view_item' => __( 'View Layout', ud_get_wp_property_layouts()->domain ),
            'all_items' => __( 'Layouts', ud_get_wp_property_layouts()->domain ),
            'search_items' => __( 'Search Layouts', ud_get_wp_property_layouts()->domain ),
            'parent_item_colon' => __( 'Parent Layouts:', ud_get_wp_property_layouts()->domain ),
            'not_found' => __( 'No Layouts found.', ud_get_wp_property_layouts()->domain ),
            'not_found_in_trash' => __( 'No Layouts found in Trash.', ud_get_wp_property_layouts()->domain )
          ),
          'show_in_menu' => 'edit.php?post_type=property',
          'supports' => array( 'title', 'editor', 'revisions', 'thumbnail' ),
          'taxonomies' => array( 'wpp_layout_type', 'wpp_layout_api' )
        ) );


        add_filter( 'pre_insert_term', 'wpp_layouts_disable_adding_terms', 0, 2 );

      }

      /**
       *
       */
      public function update_local_layouts() {
        // self::debug( 'customizer::get_local_layout');

        $available_local_layouts = get_posts(array('post_type' => 'wpp_layout', 'post_status' => array( 'pending', 'publish' ) ));
        $local_layouts = array();

        foreach ($available_local_layouts as $local_layout) {
          $ID = $local_layout->ID;
          $_post = get_post($ID);
          $_meta = get_post_meta($ID, 'panels_data', 1);
          $_tags_objects = wp_get_post_terms($ID, 'wpp_layout_type');
          $_tags = array();

          if (!empty($_tags_objects) && is_array($_tags_objects)) {
            foreach ($_tags_objects as $_tags_object) {
              $_tags[] = array(
                'label' => $_tags_object->name,
                'tag' => $_tags_object->slug
              );
            }
          }

          $res = $this->create_layout_metas(array(
            '_id' => $ID,
            'title' => $_post->post_title,
            'screenshot' => get_post_meta($ID, 'screenshot', 1),
            'layout' => $_meta,
            'tags' => $_tags,
            'options' => array(
              'preferredTemplate' => null,
              'layoutMetaOptions' => array()
            )
          ));


          if (!is_wp_error($res)) {
            $res = json_decode($res);
            $local_layouts[] = $res;
          }

        }

        update_option('wpp_available_local_layouts', $local_layouts);
      }

      public function create_layout_metas($data)
      {
        try {
          $data['layout'] = base64_encode(json_encode($data['layout']));
          $data = json_encode($data);
        } catch (Exception $e) {
          return new WP_Error('100', 'Could not parse query data', $data);
        }
        return $data;
      }

      public function load_to_api( $post_id ) {

        if( has_term( 'layout-api', 'wpp_layout_api', $post_id ) ) {
          $this->publish_layout( $post_id );
        }



      }

      public function prebuilt_wpp_layouts( $result ) {

        $_layouts = $this->api_client->get_layouts();

        if( is_wp_error( $_layouts ) ) {
          return array();
        }

        if( is_array( $_layouts ) ) {
          // return array of layouts, they will show up as "Theme Layouts"
          foreach( $_layouts as $layout ) {
            $result[ 'items' ][] = array(
              'description' => '',
              'preview' => '',
              'id' => $layout->layout,
              'slug' => $layout->_id,
              'title' => $layout->title,
              'type' => 'wpp_layouts',
              'screenshot' => $layout->screenshot,
              'layout_content' => $layout->layout,
            );
          }
          return $result[ 'items' ];
        } else {
          return array();
        }
      }

      /**
       * Overrides current template when in preview mode, loading our preview layout.
       *
       * @param $data
       * @return mixed
       */
      public function layout_preview_post( $data ) {

        if( isset( $_GET[ 'wpp_preview_layout_id' ] ) && !empty( $_GET[ 'wpp_preview_layout_id' ] ) ) {

          $_panels_data = get_post_meta( $_GET[ 'wpp_preview_layout_id' ], 'panels_data', true );

          if( $_panels_data ) {
            $data['layout_id' ] = $_GET[ 'wpp_preview_layout_id' ];
            $data['layout_meta' ] = $_panels_data;
            $data['layout_type' ] = 'local-preview';
          }

        }

        return $data;

      }

      public function wpp_panels_ajax_get_prebuilt_layouts() {
        if( empty( $_REQUEST[ '_panelsnonce' ] ) || !wp_verify_nonce( $_REQUEST[ '_panelsnonce' ], 'panels_action' ) ) wp_die();

        // Get any layouts that the current user could edit.
        header( 'content-type: application/json' );

        $type = !empty( $_REQUEST[ 'type' ] ) ? $_REQUEST[ 'type' ] : 'directory';
        $search = !empty( $_REQUEST[ 'search' ] ) ? trim( strtolower( $_REQUEST[ 'search' ] ) ) : '';
        $page = !empty( $_REQUEST[ 'page' ] ) ? intval( $_REQUEST[ 'page' ] ) : 1;

        $return = array(
          'title' => '',
          'items' => array()
        );
        if( $type == 'prebuilt' ) {
          $return[ 'title' ] = __( 'Theme Defined Layouts', 'siteorigin-panels' );

          // This is for theme bundled prebuilt directories
          $layouts = apply_filters( 'siteorigin_panels_prebuilt_layouts', array() );

          foreach( $layouts as $id => $vals ) {
            if( !empty( $search ) && strpos( strtolower( $vals[ 'name' ] ), $search ) === false ) {
              continue;
            }

            $return[ 'items' ][] = array(
              'title' => $vals[ 'name' ],
              'id' => $id,
              'type' => 'prebuilt',
              'description' => isset( $vals[ 'description' ] ) ? $vals[ 'description' ] : '',
              'screenshot' => !empty( $vals[ 'screenshot' ] ) ? $vals[ 'screenshot' ] : ''
            );
          }

          $return[ 'max_num_pages' ] = 1;
        } elseif( $type == 'directory' ) {
          $return[ 'title' ] = __( 'Layouts Directory', 'siteorigin-panels' );

          // This is a query of the prebuilt layout directory
          $query = array();
          if( !empty( $search ) ) $query[ 'search' ] = $search;
          $query[ 'page' ] = $page;

          $url = add_query_arg( $query, SITEORIGIN_PANELS_LAYOUT_URL . 'wp-admin/admin-ajax.php?action=query_layouts' );
          $response = wp_remote_get( $url );

          if( is_array( $response ) && $response[ 'response' ][ 'code' ] == 200 ) {
            $results = json_decode( $response[ 'body' ], true );
            if( $page === 1 ) {
              $results[ 'items' ] = array_merge( $results[ 'items' ], $this->prebuilt_wpp_layouts() );
            }
            if( !empty( $results ) && !empty( $results[ 'items' ] ) ) {
              foreach( $results[ 'items' ] as $item ) {
                $item[ 'id' ] = $item[ 'layout_content' ] ? $item[ 'layout_content' ] : $item[ 'slug' ];
                $item[ 'screenshot' ] = $item[ 'preview' ] ? 'http://s.wordpress.com/mshots/v1/' . urlencode( $item[ 'preview' ] ) . '?w=400' : $item[ 'screenshot' ];
                $item[ 'type' ] = $item[ 'type' ] ? $item[ 'type' ] : 'directory';
                $return[ 'items' ][] = $item;
              }
            }

            $return[ 'max_num_pages' ] = $results[ 'max_num_pages' ];

          }
        } elseif( strpos( $type, 'clone_' ) !== false ) {
          // Check that the user can view the given page types
          $post_type = str_replace( 'clone_', '', $type );

          $return[ 'title' ] = sprintf( __( 'Clone %s', 'siteorigin-panels' ), esc_html( ucfirst( $post_type ) ) );

          global $wpdb;
          $user_can_read_private = ( $post_type == 'post' && current_user_can( 'read_private_posts' ) || ( $post_type == 'page' && current_user_can( 'read_private_pages' ) ) );
          $include_private = $user_can_read_private ? "OR posts.post_status = 'private' " : "";

          // Select only the posts with the given post type that also have panels_data
          $results = $wpdb->get_results( "
			SELECT SQL_CALC_FOUND_ROWS DISTINCT ID, post_title, meta.meta_value
			FROM {$wpdb->posts} AS posts
			JOIN {$wpdb->postmeta} AS meta ON posts.ID = meta.post_id
			WHERE
				posts.post_type = '" . esc_sql( $post_type ) . "'
				AND meta.meta_key = 'panels_data'
				" . ( !empty( $search ) ? 'AND posts.post_title LIKE "%' . esc_sql( $search ) . '%"' : '' ) . "
				AND ( posts.post_status = 'publish' OR posts.post_status = 'draft' " . $include_private . ")
			ORDER BY post_date DESC
			LIMIT 16 OFFSET " . intval( ( $page - 1 ) * 16 ) );
          $total_posts = $wpdb->get_var( "SELECT FOUND_ROWS();" );

          foreach( $results as $result ) {
            $thumbnail = get_the_post_thumbnail_url( $result->ID, array( 400, 300 ) );
            $return[ 'items' ][] = array(
              'id' => $result->ID,
              'title' => $result->post_title,
              'type' => $type,
              'screenshot' => !empty( $thumbnail ) ? $thumbnail : ''
            );
          }

          $return[ 'max_num_pages' ] = ceil( $total_posts / 16 );

        } else {
          // An invalid type. Display an error message.
        }

        // Add the search part to the title
        if( !empty( $search ) ) {
          $return[ 'title' ] .= __( ' - Results For:', 'siteorigin-panels' ) . ' <em>' . esc_html( $search ) . '</em>';
        }

        echo json_encode( $return );

        wp_die();

      }

      function wpp_panels_ajax_get_prebuilt_layout() {
        if( empty( $_REQUEST[ 'type' ] ) ) wp_die();
        if( empty( $_REQUEST[ 'lid' ] ) ) wp_die();
        if( empty( $_REQUEST[ '_panelsnonce' ] ) || !wp_verify_nonce( $_REQUEST[ '_panelsnonce' ], 'panels_action' ) ) wp_die();

        header( 'content-type: application/json' );

        if( $_REQUEST[ 'type' ] == 'prebuilt' ) {
          $layouts = apply_filters( 'siteorigin_panels_prebuilt_layouts', array() );
          if( empty( $layouts[ $_REQUEST[ 'lid' ] ] ) ) {
            // Display an error message
            wp_die();
          }

          $layout = $layouts[ $_REQUEST[ 'lid' ] ];
          if( isset( $layout[ 'name' ] ) ) unset( $layout[ 'name' ] );

          $layout = apply_filters( 'siteorigin_panels_prebuilt_layout', $layout );
          $layout = apply_filters( 'siteorigin_panels_data', $layout );

          echo json_encode( $layout );
          wp_die();
        }

        if( $_REQUEST[ 'type' ] == 'wpp_layouts' ) {
          $layout = json_decode( base64_decode( $_REQUEST[ 'lid' ] ), true );
          $layout = apply_filters( 'siteorigin_panels_prebuilt_layout', $layout );
          $layout = apply_filters( 'siteorigin_panels_data', $layout );

          echo json_encode( $layout );
          wp_die();
        }

        if( $_REQUEST[ 'type' ] == 'directory' && defined( 'SITEORIGIN_PANELS_LAYOUT_URL' ) ) {

          $response = wp_remote_get(
            SITEORIGIN_PANELS_LAYOUT_URL . 'layout/' . urlencode( $_REQUEST[ 'lid' ] ) . '/?action=download'
          );

          // var_dump($response['body']);
          if( $response[ 'response' ][ 'code' ] == 200 ) {
            // For now, we'll just pretend to load this
            echo $response[ 'body' ];
            wp_die();
          } else {
            // Display some sort of error message
          }
        } elseif( current_user_can( 'edit_post', $_REQUEST[ 'lid' ] ) ) {
          $panels_data = get_post_meta( $_REQUEST[ 'lid' ], 'panels_data', true );
          $panels_data = apply_filters( 'siteorigin_panels_data', $panels_data );
          echo json_encode( $panels_data );
          wp_die();
        }
      }

    }

  }

}