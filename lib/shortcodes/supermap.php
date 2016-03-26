<?php

/**
 * Shortcode: [supermap]
 *
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Supermap_Shortcode' ) ) {

    class Supermap_Shortcode extends Shortcode {

      /**
       * Init
       */
      public function __construct() {

        add_action( 'wp_ajax_/supermap/get_properties', array( __CLASS__,'get_properties_map' ) );
        add_action( 'wp_ajax_nopriv_/supermap/get_properties', array( __CLASS__,'get_properties_map' ) );
        add_filter('supermap::prepare_property_for_map', array(__CLASS__, 'prepare_property_for_map'));
        $custom_attributes = ud_get_wp_property( 'property_stats', array() );

        $sort_by = array(
          'post_date' => sprintf( __( 'Post Date (%s)', ud_get_wpp_supermap()->domain ), 'post_date' ),
          'post_modified' => sprintf( __( 'Modified Date (%s)', ud_get_wpp_supermap()->domain ), 'post_modified' ),
          'random' => sprintf( __( 'Random (%s)', ud_get_wpp_supermap()->domain ), 'random' ),
          'menu_order' => sprintf( __( 'Menu Order (%s)', ud_get_wpp_supermap()->domain ), 'menu_order' ),
        );

        $sortable_atts = ud_get_wp_property( 'sortable_attributes', array() );
        if( !empty( $sortable_atts ) && is_array( $sortable_atts ) ) {
          foreach( $sortable_atts as $attr ) {
            if( array_key_exists( $attr, $custom_attributes ) ) {
              $sort_by[ $attr ] = $custom_attributes[ $attr ] . ' (' . $attr . ')' ;
            }
          }
        }

        $options = array(
            'id' => 'supermap',
            'params' => array(
              'mode' => array(
                'name' => __( 'Mode View', ud_get_wpp_supermap()->domain ),
                'description' => sprintf( __( 'View of you Supermap.', ud_get_wpp_supermap()->domain ), \WPP_F::property_label() ),
                'type' => 'select',
                'options' => array(
                  'default' => __( 'default', ud_get_wpp_supermap()->domain ),
                  'advanced' => __( 'advanced', ud_get_wpp_supermap()->domain )
                ),
                'default' => 'default'
              ),
              'hide_sidebar' => array(
                'name' => __( 'Hide Sidebar', ud_get_wpp_supermap()->domain ),
                'description' => sprintf( __( 'Toggles the sidebar that displays a list of returned properties and a search filter. Only for default mode.', ud_get_wpp_supermap()->domain ), \WPP_F::property_label() ),
                'type' => 'select',
                'options' => array(
                  'true' => __( 'Yes', ud_get_wpp_supermap()->domain ),
                  'false' => __( 'No', ud_get_wpp_supermap()->domain )
                ),
                'default' => 'false'
              ),
              'map_width' => array(
                'name' => __( 'Map Width', ud_get_wpp_supermap()->domain ),
                'description' => __( 'Map Width, in pixels (only for default mode).', ud_get_wpp_supermap()->domain ),
                'type' => 'number',
                'default' => 450
              ),
              'map_height' => array(
                'name' => __( 'Map Height', ud_get_wpp_supermap()->domain ),
                'description' => __( 'Map Height, in pixels.', ud_get_wpp_supermap()->domain ),
                'type' => 'number',
                'default' => 550
              ),
              'zoom' => array(
                'name' => __( 'Zoom', ud_get_wpp_supermap()->domain ),
                'description' => __( 'Sets map zoom. By default, calculated automatically based on results. Only for default mode.', ud_get_wpp_supermap()->domain ),
                'type' => 'number'
              ),
              'center_on' => array(
                'name' => __( 'Center On', ud_get_wpp_supermap()->domain ),
                'description' => __( 'Sets center coordinates. By default, calculated automatically based on results. Only for default mode.', ud_get_wpp_supermap()->domain ),
                'type' => 'text',
                'default' => ''
              ),
              'show_areas' => array(
                'name' => __( 'Show Areas', ud_get_wpp_supermap()->domain ),
                'description' => sprintf( __( 'Slug of area which you can add on Supermap tab (Settings). Only for default mode. By default, all areas are shown. Also You can use area\'s slugs to show them on the map, like as %s', ud_get_wpp_supermap()->domain ), '<code>new_york,washington</code>' ),
                'type' => 'text',
                'default' => 'all'
              ),
              'per_page' => array(
                'name' => __( 'Per Page', ud_get_wpp_supermap()->domain ),
                'description' => sprintf( __( '%s quantity per page.', ud_get_wpp_supermap()->domain ), \WPP_F::property_label() ),
                'type' => 'number',
                'default' => 10
              ),
              'starting_row' => array(
                'name' => __( 'Starting Row', ud_get_wpp_supermap()->domain ),
                'description' => __( 'Sets starting row.', ud_get_wpp_supermap()->domain ),
                'type' => 'number',
                'default' => 0
              ),
              'pagination' => array(
                'name' => __( 'Pagination', ud_get_wpp_supermap()->domain ),
                'description' => __( 'Switches pagination. Only for default mode', ud_get_wpp_supermap()->domain ),
                'type' => 'select',
                'options' => array(
                  'on' => __( 'On', ud_get_wpp_supermap()->domain ),
                  'off'  => __( 'Off', ud_get_wpp_supermap()->domain )
                ),
                'default' => 'on'
              ),
              'sort_by' => array(
                'name' => __( 'Sort By', ud_get_wpp_supermap()->domain ),
                'description' => sprintf( __( 'Sets sorting by sortable attribute or %s.', ud_get_wpp_supermap()->domain ), 'post_date, menu_order, random' ),
                'type' => 'select',
                'options' => $sort_by,
                'default' => 'menu_order'
              ),
              'sort_order' => array(
                'name' => __( 'Sort Order', ud_get_wpp_supermap()->domain ),
                'description' => __( 'Sets sort order.', ud_get_wpp_supermap()->domain ),
                'type' => 'select',
                'options' => array(
                  'DESC' => 'DESC',
                  'ASC'  => 'ASC'
                ),
                'default' => 'ASC'
              ),
              'featured' => array(
                'name' => sprintf( __( 'Show only Featured %s', ud_get_wpp_supermap()->domain ), \WPP_F::property_label( 'plural' ) ),
                'type' => 'checkbox',
              ),
              'custom_query' => array(
                'name' => __( 'Custom Query by Attributes Values', ud_get_wpp_supermap()->domain ),
                'description' => sprintf( __( 'Setup your custom query by providing values for specific attributes. Empty values will be ignored. Example:<br/>- to list only %1$s which have minimum 2 and maximum 4 bedrooms, you should set <b>2-4</b> value for your Bedrooms attribute.<br/>- to list only %1$s which have 1 or 3 bathrooms, you should set <b>1,3</b> value for your Bathrooms attribute.', ud_get_wp_property( 'domain' ) ), \WPP_F::property_label() ),
                'type' => 'custom_attributes',
                'options' => $custom_attributes,
              ),

            ),
            'description' => __( 'Renders Super Map', ud_get_wpp_supermap()->domain ),
            'group' => 'WP-Property'
        );

        parent::__construct( $options );
      }

      /**
       * @param string $atts
       * @return string|void
       */
      public function call( $atts = "" ) {
        return $this::render( $atts );
      }

      /**
       * Returns supermap for shortcode
       * Copyright 2010 Andy Potanin <andy.potanin@twincitiestech.com>
       *
       * Example of Atts:
       * zoom=5
       * center_on=74.3434,-130.22
       *
       * @param array $atts Attributes of shortcode
       * @return mixed|string
       */
      static public function render($atts = array()) {
        global $wp_properties;

        wp_enqueue_script( 'google-maps' );

        //** Quit function if Google Maps is not loaded */
        if(!\WPP_F::is_asset_loaded('google-maps')) {
          return ($atts['silent_failure'] == 'true' ? false : sprintf(__('Element cannot be rendered, missing %1s script.', ud_get_wpp_supermap()->domain), 'google-maps'));
        }

        $defaults = array(
          'per_page' => 10,
          'css_class' => '',
          'starting_row' => 0,
          'pagination' => 'on',
          'sidebar_width' => '',
          'hide_sidebar' => 'false',
          'map_height' => '550',
          'map_width' => '',
          'options_label' => __('Options',ud_get_wpp_supermap()->domain),
          'silent_failure' => 'true',
          'sort_order' => 'DESC',
          'sort_by' => 'post_date',
          'mode' => 'default'
        );

        $atts = array_merge($defaults, (array)$atts);

        //* Set property types */
        if(!isset($atts['property_type'])) {
          //* Need this for better UI and to avoid mistakes */
          //* @TODO: need to determine if custom attribute 'type' does not exist at first to use this condition. peshkov@UD */
          if(!empty($atts['type'])) {
            $atts['property_type'] = $atts['type'];
          } else {
            $atts['property_type'] = $wp_properties['searchable_property_types'];
          }
        }
        /* END Set property types */

        //** Load all queriable keys **/
        $query_keys = array();
        foreach( \WPP_F::get_queryable_keys() as $key ) {
          //** This needs to be done because a key has to exist in the $deafult array for shortcode_atts() to load passed value */
          $query_keys[ $key ] = false;
        }

        //* START Set query */
        $query = shortcode_atts($query_keys, $atts);

        if (isset($_REQUEST['wpp_search'])){
          $query = shortcode_atts($query, $_REQUEST['wpp_search']);
        }

        /* HACK: Remove attribute with value 'all' from query to avoid search result issues:
         * Because 'all' means any attribute's value,
         * But if property has no the attribute, which has value 'all' - query doesn't return this property
         */
        foreach ($query as $k => $v) {
          if($v == 'all' || empty($v)) {
            unset($query[$k]);
          }
        }

        //* Exclude properties which has no latitude,longitude keys */
        $query['latitude'] = 'all';
        $query['longitude'] = 'all';
        //$query['address_is_formatted'] = 'true';
        $query['exclude_from_supermap'] = 'false,0';

        $query = apply_filters( 'wpp:supermap:query_defaults', $query, $atts );

        //* Prepare search attributes to use them in get_properties() */
        $query = \WPP_F::prepare_search_attributes($query);

        if($atts['pagination'] == 'on') {
          $query['pagi'] = $atts['starting_row'] . '--' . $atts['per_page'];
        }

        $query['sort_by'] = $atts['sort_by'];
        $query['sort_order'] = $atts['sort_order'];

        //* END Set query */

        $supermap = "";

        /**
         * Call function which prepares data and renders template.
         */
        $template_function = array( __CLASS__, 'render_' . $atts[ 'mode' ] . '_mode_view' );
        $_template_function = apply_filters( 'wpp::supermap::template_function', $template_function, $query, null, $atts );

        if( is_callable( $template_function ) ) {

          // Legacy Supermap version support.
          // If template function was re-declared we are using old logic to call template function
          if( $_template_function !== $template_function ) {
            $properties = self::get_properties( $query );
            if ( !empty( $properties[ 'total' ] ) ) {
              $atts['total'] = $properties['total'];
              $supermap = call_user_func_array( $template_function, array( $properties[ 'data' ], $atts ) );
            } else if ( isset( $_REQUEST[ 'wpp_search' ] ) ) {
              return '<span class="wpp-no-listings">'. sprintf( __( 'Sorry, no %s found, try expanding your search.', ud_get_wpp_supermap()->domain ), \WPP_F::property_label( 'plural' ) ) . '</span>';
            }
          }
          // New Template logic:
          else {
            $supermap = call_user_func_array( $template_function, array( $query, $atts ) );
          }

        }

        return $supermap;

      }

      /**
       *
       * @param $properties
       * @param array $atts
       */
      static public function render_advanced_mode_view( $query, $atts = array() ) {

        wp_enqueue_script( 'angularjs', ud_get_wpp_supermap()->path( 'bower_components/angular/angular.min.js' ) );
        wp_enqueue_script( 'ng-map', ud_get_wpp_supermap()->path( 'bower_components/ngmap/build/scripts/ng-map.min.js' ), array( 'google-maps', 'angularjs' ) );
        wp_enqueue_script( 'ng-smart-table', ud_get_wpp_supermap()->path( 'bower_components/angular-smart-table/dist/smart-table.min.js' ), array( 'angularjs' ) );
        wp_enqueue_script( 'gm-markerclusterer', ud_get_wpp_supermap()->path( 'bower_components/js-marker-clusterer/src/markerclusterer.js' ), array( 'ng-map' ) );
        wp_enqueue_script( 'gm-infobubble', ud_get_wpp_supermap()->path( 'bower_components/js-info-bubble/src/infobubble-compiled.js' ), array( 'ng-map' ) );
        wp_enqueue_script( 'supermap-advanced', ud_get_wpp_supermap()->path( 'static/scripts/advanced/supermap.js' ), array( 'angularjs', 'gm-markerclusterer', 'gm-infobubble', 'ng-map', 'ng-smart-table' ) );

        wp_enqueue_style( 'bootstrap-css', '//maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css' );
        wp_enqueue_style( 'wpp-supermap-advanced', ud_get_wpp_supermap()->path( 'static/styles/supermap-advanced.min.css' ) );

        // HACK
        // REDECLARE OUR QUERY.

        //** Load all queriable keys **/
        $query_keys = array();
        foreach( \WPP_F::get_queryable_keys() as $key ) {
          //** This needs to be done because a key has to exist in the $deafult array for shortcode_atts() to load passed value */
          $query_keys[ $key ] = false;
        }

        //* START Set query */
        $query = shortcode_atts($query_keys, $atts);

        if ( isset($_REQUEST['wpp_search'] ) ){
          $query = shortcode_atts( $query, $_REQUEST['wpp_search'] );
        }

        /* HACK: Remove attribute with value 'all' from query to avoid search result issues:
         * Because 'all' means any attribute's value,
         * But if property has no the attribute, which has value 'all' - query doesn't return this property
         */
        foreach ($query as $k => $v) {
          if($v == 'all' || empty($v)) {
            unset($query[$k]);
          }
        }

        $query = apply_filters( 'wpp:supermap:query_defaults', $query, $atts );
        $query['sort_by'] = $atts['sort_by'];
        $query['sort_order'] = $atts['sort_order'];
        $query[ 'pagination' ] = 'off';

        //* Prepare out $atts. Leave only necessary data. */
        $atts = array_filter( (array)$atts );
        $defaults = array(
          'map_height' => '550',
          'per_page' => '10',
        );
        $atts = shortcode_atts( $defaults, $atts );

        $atts[ 'fields' ] = array_merge( array(
          'ID',
          'post_title',
          'latitude',
          'longitude',
          'permalink',
          'property_type',
          'featured_image_url',
          'gallery',
          '_map_marker_url',
        ), ud_get_wp_property( 'configuration.feature_settings.supermap.display_attributes', array() ) );
        $atts[ 'fields' ] = apply_filters( 'wpp::advanced_supermap::property_fields', $atts[ 'fields' ] );
        $atts[ 'fields' ] = is_array( $atts[ 'fields' ] ) ? implode( ',', $atts[ 'fields' ] ) : $atts[ 'fields' ];

        /** Try find Supermap Template */
        $template = \WPP_F::get_template_part(
          apply_filters( "wpp::supermap::template_name", array( "supermap" ) ),
          apply_filters( "wpp::supermap::template_path", array( ud_get_wpp_supermap()->path( 'static/views/advanced', 'dir' ) ) )
        );

        $content = '';
        if( $template ) {
          ob_start();
          include $template;
          $content .= ob_get_clean();
        }

        return $content;

      }

      /**
       * Prepares data, enquires javascript,
       * includes template and returns it
       *
       * Note, you can redeclare function by calling your own one using filter:
       * wpp::supermap::template_function
       */
      static public function render_default_mode_view( $query, $atts = array() ) {
        global $wp_properties;

        $result = self::get_properties( $query );
        $properties = array();
        if ( !empty( $result[ 'total' ] ) ) {
          $atts['total'] = $result[ 'total' ];
          $properties = $result[ 'data' ];
        } else if ( isset( $_REQUEST[ 'wpp_search' ] ) ) {
          return '<span class="wpp-no-listings">'. sprintf( __( 'Sorry, no %s found, try expanding your search.', ud_get_wpp_supermap()->domain ), \WPP_F::property_label( 'plural' ) ) . '</span>';
        }

        //* Determine if properties exist */
        if(empty($properties)) {
          return '';
        }

        //* Default settings */
        $defaults = array(
          'hide_sidebar' => 'false',
          'show_areas' => false,
          'sidebar_width' => '',
          'map_height' => '',
          'map_width' => '',
          'zoom' => '',
          'options_label' => __('Options',ud_get_wpp_supermap()->domain), // @todo add to shortcode params
          'center_on' => '',
          'scrollwheel' => '', // @todo add to shortcode params
          'property_type' => (array) $wp_properties['searchable_property_types'],
          'rand' => rand(1000,5000)
        );

        if(!empty($sidebar_width)) {
          $sidebar_width = trim(str_replace(array('%', 'px'), '', $sidebar_width));
        }

        //* Supermap configuration */
        if ( !empty( $wp_properties['configuration']['feature_settings']['supermap'] ) ) {
          $supermap_configuration = $wp_properties['configuration']['feature_settings']['supermap'];
        } else {
          $supermap_configuration = array();
        }
        if(empty($supermap_configuration['supermap_thumb'])) {
          $supermap_configuration['supermap_thumb'] = 'thumbnail';
        }

        //* Set available search attributes for 'Options' form */
        $searchable_attributes = (array)$wp_properties['searchable_attributes'];
        $flip =  array_flip($searchable_attributes);
        if(is_array($flip) & is_array($atts)){
          $searchable_attributes = (array_intersect_key($atts, $flip));
        } else {
          unset($searchable_attributes);
        }

        //* Get template Attributes */
        extract(shortcode_atts($defaults, $atts));

        //** Get and set any inline styles */
        if($hide_sidebar != "true" && !empty($sidebar_width)) {
          $inline_styles['sidebar']['width'] = 'width: '. $sidebar_width . '%';
          $inline_styles['map']['width'] = 'width: '. (100 - $sidebar_width). '%;';
          $inline_styles['map']['margin'] = 'margin: 0;'; /* If using fluid widths, must elimiate all margins */
          $inline_styles['map']['padding'] = 'padding: 0;'; /* If using fluid widths, must elimiate all padding */
        }

        if(!isset($inline_styles['map']['width']) && !empty($map_width)) {
          $inline_styles['map']['width'] = 'width: '. str_replace( 'px', '', $map_width ) . 'px;';
        }

        if( !empty($map_height) ) {
          $inline_styles['map']['height'] = 'height: '. str_replace( 'px', '', $map_height ) . 'px;';
          $inline_styles['sidebar']['height'] = 'height: '. str_replace( 'px', '', $map_height ) . 'px;';
        }

        $inline_styles['map'] = 'style="' . implode( ' ', ( !empty( $inline_styles['map'] ) ? (array) $inline_styles['map'] : array() ) ). '"';
        $inline_styles['sidebar'] = 'style="' . implode( ' ', ( !empty( $inline_styles['sidebar'] ) ? (array) $inline_styles['sidebar'] : array() ) ) . '"';

        //* START Render Javascript functionality for Areas */
        $areas = !empty( $supermap_configuration['areas'] ) ? $supermap_configuration['areas'] : array();
        $area_lines = array();
        // Plot areas
        if(is_array($areas) && $show_areas) {
          // Check attribute 'show_areas'
          if($show_areas != 'all') {
            $show_areas = explode(',',$show_areas);
            $show_areas = array_fill_keys($show_areas, 1);
          }
          foreach($areas as $count => $area) {
            // If the current area (slug) is not added to shortcode, we didn't draw it.
            if((is_array($show_areas) && !array_key_exists($count, $show_areas)) || $count == 'example_area' ) {
              continue;
            }

            // Set defaults
            if(empty($area['strokeColor'])) $area['strokeColor'] =  '#a49b8a';
            if(empty($area['fillColor'])) $area['fillColor'] =  '#dad1c2';
            if(empty($area['hoverColor'])) $area['hoverColor'] =  '#bfb89a';
            if(empty($area['fillOpacity'])) $area['fillOpacity'] =  '0.6';
            if(empty($area['strokeOpacity'])) $area['strokeOpacity'] =  '1';
            if(empty($area['strokeWeight'])) $area['strokeWeight'] =  '1';

            $area['paths'] = str_replace(")(", ")|(", $area['paths']);
            $area['paths'] = explode("|", $area['paths']);

            if(count($area['paths']) < 1) {
              continue;
            }
            unset($this_area_coords);

            foreach($area['paths'] as $coords) {
              if(empty($coords))
                continue;
              $this_area_coords[] = "new google.maps.LatLng({$coords})";
            }

            if(empty($this_area_coords)) {
              continue;
            }

            /* @todo: must be moved to static/scripts/supermap.js ! */
            $area_lines[] = "var areaCoords_{$count} = [" . implode(",\n", $this_area_coords) . "]";
            $area_lines[] = "
          areaCoords_{$count} = new google.maps.Polygon({
          paths: areaCoords_{$count},
          strokeColor: '{$area['strokeColor']}',
          strokeOpacity: {$area['strokeOpacity']},
          strokeWeight: {$area['strokeWeight']},
          fillColor: '{$area['fillColor']}',
          fillOpacity: {$area['fillOpacity']}
        });
        areaCoords_{$count}.setMap(map_{$rand});
        google.maps.event.addListener(areaCoords_{$count},'click',function(event){
          // Set content and Replace our Info Window's position
          infowindow_{$rand}.setContent('<div id=\"infowindow\" style=\"height:50px;line-height:50px;text-align:center;font-weight:bold;\">{$area['name']}</div>');
          infowindow_{$rand}.setPosition(event.latLng);
          infowindow_{$rand}.open(map_{$rand});
        });
        google.maps.event.addListener(areaCoords_{$count},'mouseover',function(event){
          this.setOptions({
            fillColor: '{$area['hoverColor']}'
          });
        });
        google.maps.event.addListener(areaCoords_{$count},'mouseout',function(event){
          this.setOptions({
            fillColor: '{$area['fillColor']}'
          });
        });
      ";
          }
        }
        $area_lines = implode('', $area_lines);
        //* END Render Areas */

        /** Enqueue script  */
        //wp_enqueue_script( 'wpp-supermap', ud_get_wpp_supermap()->path( 'static/scripts/supermap.js', 'url' ), array(), ud_get_wpp_supermap()->version );

        $supermap = "";

        /**** TEMP SOLUTION *****/
        /**
         * @todo move current php template to javascript file (static/scripts/supermap.js)
         */
        /** Try find Supermap Template */
        $jstemplate = ud_get_wpp_supermap()->path( 'static/views/default/supermap-js.php', 'dir' );
        if( file_exists( $jstemplate ) ) {
          ob_start();
          include $jstemplate;
          $supermap .= ob_get_clean();
        }

        /**** END TEMP SOLUTION *****/

        /** Try find Supermap Template */
        $template = \WPP_F::get_template_part(
          apply_filters( "wpp::supermap::template_name", array( "supermap" ) ),
          apply_filters( "wpp::supermap::template_path", array( ud_get_wpp_supermap()->path( 'static/views/default', 'dir' ) ) )
        );

        if( $template ) {
          ob_start();
          include $template;
          $supermap .= ob_get_clean();
        }

        return $supermap;
      }

      /**
       * Returns the list of all found properties prepared for display.
       *
       * @param $query
       */
      static public function get_properties( $query, $args = array() ) {
        $result = array(
          'total' => 0,
          'data' => array(),
        );

        //* Get properties */
        $property_ids = \WPP_F::get_properties( $query , true );
        if( !empty( $property_ids ) ) {
          $properties = array();
          foreach ($property_ids['results'] as $key => $id) {
            $property = prepare_property_for_map( $id, wp_parse_args( $args, array(
              'load_gallery' => 'false',
              'get_children' => 'false',
              'load_parent' => 'false',
              'scope' => 'supermap_sidebar'
            ) ) );
            $properties[$id] = $property;
          }
          $result = array(
            'total' => $property_ids['total'],
            'data' => $properties,
          );
        }
        return $result;
      }

      static public function get_properties_map(){
        global $wpdb, $wp_properties;
        $sql = "";
        $where_clause = "";
        $select_clause  = "";
        $left_join      = "";
        $inner_join     = "";

        $defaults = array(
          'per_page' => 10,
          'starting_row' => 0,
          'pagination' => 'on',
          'sort_order' => 'ASC',
          'sort_by' => 'menu_order',
          'property_type' => ( $wp_properties['searchable_property_types'] ),
          'json' => 'false',
          'fields' => '',
        );

        $_system_keys = array(
          'pagi',
          'pagination',
          'limit_query',
          'starting_row',
          'sort_by',
          'sort_order'
        );

        // Non post_meta fields
        $non_post_meta = array(
          'ID'          => 'or',
          'post_title'  => 'like',
          'post_date'   => 'date',
          'post_status' => 'equal',
          'post_author' => 'equal',
          //'post_parent' => false,
          //'post_name'   => false,
          //'post_parent' => false,
          //'_thumbnail_id' => false,
        );
        /**
         * Specific meta data can contain value with commas. E.g. location field ( address_attribute )
         * The current list contains meta slugs which will be ignored for comma parsing. peshkov@UD
         */
        $commas_ignore = apply_filters( 'wpp::get_properties::commas_ignore', array_filter( array( $wp_properties[ 'configuration' ][ 'address_attribute' ] ) ) );
        
        // Normalizing to match the default array.
        $_REQUEST['sort_by'] = isset($_REQUEST['wpp_search']['sort_by'])?$_REQUEST['wpp_search']['sort_by']:"menu_order";
        $_REQUEST['sort_order'] = isset($_REQUEST['wpp_search']['sort_order'])?$_REQUEST['wpp_search']['sort_order']:"ASC";

        $atts = shortcode_atts($defaults, $_REQUEST);

        //* Supermap configuration */
        $supermap_configuration = $wp_properties['configuration']['feature_settings']['supermap'];
        if(empty($supermap_configuration['supermap_thumb'])) {
          $supermap_configuration['supermap_thumb'] = 'thumbnail';
        }

        //* START Prepare search params for get_properties() */
        $query = array();
        if(!empty($_REQUEST['wpp_search'])) {
          //** Load all queriable keys **/
          $query_keys = array();
          foreach( \WPP_F::get_queryable_keys() as $key ) {
            //** This needs to be done because a key has to exist in the $deafult array for shortcode_atts() to load passed value */
            $query_keys[ $key ] = false;
          }
          $query = $_REQUEST['wpp_search'];
          $query = array_filter( shortcode_atts($query_keys, $query) );
        }

        //$query['address_is_formatted'] = '1';
        //* Add only properties which are not excluded from supermap (option on Property editing form) */
        //$query['exclude_from_supermap'] = 'false,0';
        //* Set Property type */
        $query['property_type'] = $atts['property_type'];

        //* Prepare Query params */
        $query = \WPP_F::prepare_search_attributes($query);

        $_select_clause = array();

        $fields = explode(',', $atts['fields']);
        $fields = array_map('trim', $fields);

        // Aditional columns
        $fields[] = 'post_name';
        $fields[] = 'post_parent';
        $fields[] = '_thumbnail_id';


        $mtI = 1;
        $mtID = array();
        foreach ($fields as $key => $field) {
          if(array_key_exists($field, $non_post_meta)){
            $_select_clause[] = "p.$field";
          }
          else{
            $_select_clause[] = "mt$mtI.meta_value AS $field";
            $left_join .= "LEFT JOIN {$wpdb->postmeta} AS mt$mtI ON (p.ID = mt$mtI.post_id AND mt$mtI.meta_key='$field') \n";
            $mtID[$field] = "mt$mtI";
            $mtI++;
          }
        }


        $select_clause = implode(",\n ", $_select_clause);

        $where_clause = "WHERE post_type = 'property' ";
        $where_clause .= " AND {$mtID['latitude']}.meta_value != '' ";
        $where_clause .= " AND {$mtID['longitude']}.meta_value != '' ";
        // For post keys
        foreach( (array) $non_post_meta as $field => $condition ) {
          if( array_key_exists( $field, $query ) ) {
            if( $condition == 'like' ) {
              $where_clause .= " AND p.$field LIKE '%{$query[$field]}%' ";
            }
            else if( $condition == 'equal' ) {
              $where_clause .= " AND p.$field = '{$query[$field]}' ";
            }
            else if( $condition == 'or' ) {
              $f = '';
              $d = !is_array( $query[ $field ] ) ? explode( ',', $query[ $field ] ) : $query[ $field ];
              foreach( $d as $k => $v ) {
                $f .= ( !empty( $f ) ? ",'" . trim($v) . "'" : "'" . trim($v) . "'" );
              }
              $where_clause .= " AND p.$field IN ({$f}) ";
            }
            else if( $condition == 'date' ) {
              $where_clause .= " AND YEAR( p.$field ) = " . substr( $query[ $field ], 0, 4 ) . " AND MONTH( p.$field ) = " . substr( $query[ $field ], 4, 2 ) . " ";
            }
            unset( $query[ $field ] );
          }
        }

        // sort params
        $sort_clause = " ORDER BY {$atts['sort_by']} {$atts['sort_order']} ";
        //** Unset arguments that will conflict with attribute query */
        foreach( (array) $_system_keys as $system_key ) {
          unset( $query[ $system_key ] );
        }


        // Start Terms
        $term_ids = array();
        foreach ($query as $taxonomy => $term_id) {
          if(array_key_exists($taxonomy, $wp_properties[ 'taxonomies' ])){
            $term_ids[] = $term_id;
            unset($query[$taxonomy]);
          }
        }
        if(count($term_ids)){
          $term_ids      = implode(', ', $term_ids);
          $inner_join   .= "INNER JOIN {$wpdb->term_relationships} AS term_rel ON (p.ID = term_rel.object_id) ";
          $where_clause .= " AND term_rel.term_taxonomy_id IN ($term_ids) ";
        }
        // End Terms query


        // Go down the array list narrowing down matching properties
        foreach( (array) $query as $meta_key => $criteria ) {

          $specific = '';
          $comma_and = '';
          $numeric = ( isset( $wp_properties[ 'numeric_attributes' ] ) && in_array( $meta_key, (array) $wp_properties[ 'numeric_attributes' ] ) ) ? true : false;

          if( !in_array( $meta_key, (array) $commas_ignore ) && substr_count( $criteria, ',' ) || ( substr_count( $criteria, '-' ) && $numeric ) || substr_count( $criteria, '--' ) ) {

            if( substr_count( $criteria, '-' ) && !substr_count( $criteria, ',' ) ) {
              $cr = explode( '-', $criteria );
              // Check pieces of criteria. Array should contains 2 int's elements
              // In other way, it's just value of meta_key
              if( count( $cr ) > 2 || ( ( float ) $cr[ 0 ] == 0 && ( float ) $cr[ 1 ] == 0 ) ) {
                $specific = $criteria;
              } else {
                $hyphen_between = $cr;
                // If min value doesn't exist, set 1
                if( empty( $hyphen_between[ 0 ] ) && $hyphen_between[ 0 ] != "0" ) {
                  $hyphen_between[ 0 ] = 1;
                }
              }
            }

            if ( substr_count( $criteria, ',' ) ) {
              $comma_and = explode( ',', $criteria );
            }

          } else {
            $specific = $criteria;
          }

          if( !isset( $limit_query ) ) {
            $limit_query = '';
          }


          // Left join meta key post_type.
          $mtID[$meta_key] = "mt$mtI";
          $left_join .= "LEFT JOIN {$wpdb->postmeta} AS mt$mtI ON (p.ID = mt$mtI.post_id AND mt$mtI.meta_key='$meta_key') \n";
          $mtI++;

          switch( $meta_key ) {

            case 'property_type':

              //** If comma_and is set, $criteria is ignored, otherwise $criteria is used */
              $specific = $comma_and;
              if(!is_array($comma_and))
                $specific = explode(',', $criteria);
              $specific   = array_map('trim', $specific);
              $specific   = implode( "', '", $specific );
              // Get all property types
              $where_clause .= " AND ({$mtID['property_type']}.meta_key = 'property_type' AND {$mtID['property_type']}.meta_value in ('$specific')) ";
              break;
            default:
              $_mtID = $mtID[$meta_key];
              // Get all properties for that meta_key
              if( $specific == 'all' && $specific == '-1' ) {

                break;
              } else {

                if( !empty( $comma_and ) ) {
                  $where_and = "( $_mtID.meta_value ='" . implode( "' OR $_mtID.meta_value ='", $comma_and ) . "')";
                  $specific  = $where_and;
                }

                if( !empty( $hyphen_between ) ) {
                  // We are going to see if we are looking at some sort of date, in which case we have a special MySQL modifier
                  $adate = false;
                  if( preg_match( '%\\d{1,2}/\\d{1,2}/\\d{4}%i', $hyphen_between[ 0 ] ) ) $adate = true;

                  if( !empty( $hyphen_between[ 1 ] ) ) {

                    if( preg_match( '%\\d{1,2}/\\d{1,2}/\\d{4}%i', $hyphen_between[ 1 ] ) ) {
                      foreach( $hyphen_between as $key => $value ) {
                        $hyphen_between[ $key ] = "STR_TO_DATE( '{$value}', '%c/%e/%Y' )";
                      }
                      $where_between = "STR_TO_DATE( $_mtID.meta_value, '%c/%e/%Y' ) BETWEEN " . implode( " AND ", $hyphen_between ) . "";
                    } else {
                      $where_between = "$_mtID.meta_value BETWEEN " . implode( " AND ", $hyphen_between ) . "";
                    }

                  } else {

                    if( $adate ) {
                      $where_between = "STR_TO_DATE( $_mtID.meta_value, '%c/%e/%Y' ) >= STR_TO_DATE( '{$hyphen_between[0]}', '%c/%e/%Y' )";
                    } else {
                      $where_between = "$_mtID.meta_value >= $hyphen_between[0]";
                    }

                  }
                  $specific = $where_between;
                }

                if( $specific == 'true' ) {
                  // If properties data were imported, meta value can be '1' instead of 'true'
                  // So we're trying to find also '1'
                  $specific = "$_mtID.meta_value IN ( 'true', '1' )";
                } elseif( !substr_count( $specific, '$_mtID.meta_value' ) ) {
                  //** Determine if we don't need to use LIKE in SQL query */
                  preg_match( "/^#(.+)#$/", $specific, $matches );
                  if( $matches ) {
                    $specific = " $_mtID.meta_value = '{$matches[1]}'";
                  } else {
                    //** Adds conditions for Searching by partial value */
                    $s        = explode( ' ', trim( $specific ) );
                    $specific = '';
                    $count    = 0;
                    foreach( $s as $p ) {
                      if( $count > 0 ) {
                        $specific .= " AND ";
                      }
                      $specific .= "$_mtID.meta_value LIKE '%{$p}%'";
                      $count++;
                    }
                  }
                }

                $where_clause .= " AND ($_mtID.meta_key = '$meta_key' AND $specific) \n";

              }
              break;

          } // END switch

          unset( $comma_and );
          unset( $hyphen_between );

        } // END foreach

        $sql = "SELECT $select_clause \nFROM {$wpdb->posts} as p \n$left_join \n $inner_join \n";
        $sql .= $where_clause . $sort_clause;
        $results = $wpdb->get_results( $sql, ARRAY_A );
        $return = array();
        $return['sql'] = $sql;
        $return['data'] = apply_filters('supermap::prepare_property_for_map', $results);
        $return['total'] = count($return['data']);
        wp_send_json($return);
        die();
      }



      /**
      * Retrieve the permalink for a post with a custom post type.
      *
      * @since 3.0.0
      *
      * @global WP_Rewrite $wp_rewrite
      *
      * @param int $id         Optional. Post ID.
      * @param bool $leavename Optional, defaults to false. Whether to keep post name.
      * @param bool $sample    Optional, defaults to false. Is it a sample permalink.
      * @return string|WP_Error The post permalink.
      */
      static function prepare_property_for_map( $results ) {
        global $wp_rewrite;
        $post_type = "property";
        $permastruct = $wp_rewrite->get_extra_permastruct($post_type);
        
        $post_type = get_post_type_object($post_type);

        foreach ($results as $key => $property) {
          $results[$property['ID']] = $property;
          unset($results[$key]);
        }

        // Adding Thumbnail to results
        $results = self::wpp_add_attachment_urls( $results );
        // End Thumbnail

        foreach ($results as $key => &$property) {

          // permalink 
          $slug = $property['post_name'];
        
          if ( $parent_id = $property['post_parent'] ) {
            $slug = get_parent_slug( $parent_id, $properties ) . '/' . $slug;
          }
        
          if ( !empty($permastruct)) {
                  $post_link = str_replace("%{$post_type->name}%", $slug, $permastruct);
                  $post_link = home_url( user_trailingslashit($post_link) );
          } else {
                  if ( $post_type->query_var)
                          $post_link = add_query_arg($post_type->query_var, $slug, '');
                  else
                          $post_link = add_query_arg(array('post_type' => $post_type->name, 'p' => $property['ID']), '');
                  $post_link = home_url($post_link);
          }
          $property['permalink'] = $post_link;
          // End permalink

          // Thumbnail



          // End Thumbnail


        }

        return array_values($results);
      }


      static public function get_parent_slug($parent_id, $properties = array()){
        if(isset($properties[$parent_id])){
          $parent = $properties[$parent_id];
        }
        else{
          // Need to improve
          $parent = get_properties_map(array('ID' => $parent_id));
        }

        return $parent->post_name;
      }

      static public function wpp_add_attachment_urls( $properties ) {

        global $wpdb, $wp_properties;

        foreach ($properties as $key => &$property) {
          $sql = "
            SELECT file.meta_value AS thumb_url, p.guid AS guid
            FROM {$wpdb->posts} AS p
            LEFT JOIN {$wpdb->postmeta} AS file ON (p.ID = file.post_id AND file.meta_key = '_wp_attached_file')
            WHERE p.ID IN (
                SELECT thumb.meta_value as thumbID
                FROM {$wpdb->posts} AS p
                LEFT JOIN {$wpdb->postmeta} AS thumb
                ON (p.ID = thumb.post_id AND thumb.meta_key = '_thumbnail_id')
                WHERE p.ID  = 106913
            )";
          $result = $wpdb->get_results($sql, ARRAY_A);
          $property['featured_image_url'] = self::wp_get_attachment_url($result[0]);
        }
        return $properties;
      }


      // copied from https://developer.wordpress.org/reference/functions/wp_get_attachment_url/
      static public function wp_get_attachment_url($file_data){
        global $wpp_super_map_uploads;
        // Get upload directory.
        if(!is_array($wpp_super_map_uploads))
          $wpp_super_map_uploads = wp_upload_dir();

        // Doing this for some sort of caching.
        $isSSL = is_ssl() && ! is_admin() && 'wp-login.php' !== $GLOBALS['pagenow'];

        $url = '';
        if ( ($file = $file_data['thumb_url']) && ($uploads = $wpp_super_map_uploads) && false === $wpp_super_map_uploads['error'] ) {
            // Check that the upload base exists in the file location.
            if ( 0 === strpos( $file, $uploads['basedir'] ) ) {
                // Replace file location with url location.
                $url = str_replace($uploads['basedir'], $uploads['baseurl'], $file);
            } elseif ( false !== strpos($file, 'wp-content/uploads') ) {
                // Get the directory name relative to the basedir (back compat for pre-2.7 uploads)
                $url = trailingslashit( $uploads['baseurl'] . '/' . _wp_get_attachment_relative_path( $file ) ) . basename( $file );
            } else {
                // It's a newly-uploaded file, therefore $file is relative to the basedir.
                $url = $uploads['baseurl'] . "/$file";
            }
        }

        /*
         * If any of the above options failed, Fallback on the GUID as used pre-2.7,
         * not recommended to rely upon this.
         */
        if ( empty($url) ) {
            $url = $file_data['guid'];
        }

        // On SSL front-end, URLs should be HTTPS.
        if ( $isSSL ) {
            $url = set_url_scheme( $url );
        }
        return $url;
      }




      /**
       * Ajax. Returns javascript:
       * list of properties and markers
       *
       */
      static public function ajax_get_properties() {
        global $wpdb, $wp_properties;
        $defaults = array(
          'per_page' => 10,
          'starting_row' => 0,
          'pagination' => 'on',
          'sort_order' => 'ASC',
          'sort_by' => 'menu_order',
          'property_type' => ( $wp_properties['searchable_property_types'] ),
          'json' => 'false',
          'fields' => '',
        );

        $atts = shortcode_atts($defaults, $_REQUEST);

        //* Supermap configuration */
        $supermap_configuration = $wp_properties['configuration']['feature_settings']['supermap'];
        if(empty($supermap_configuration['supermap_thumb'])) {
          $supermap_configuration['supermap_thumb'] = 'thumbnail';
        }

        //* START Prepare search params for get_properties() */
        $query = array();
        if(!empty($_REQUEST['wpp_search'])) {
          //** Load all queriable keys **/
          $query_keys = array();
          foreach( \WPP_F::get_queryable_keys() as $key ) {
            //** This needs to be done because a key has to exist in the $deafult array for shortcode_atts() to load passed value */
            $query_keys[ $key ] = false;
          }
          $query = $_REQUEST['wpp_search'];
          $query = array_filter( shortcode_atts($query_keys, $query) );
        }

        //* Exclude properties which has no latitude,longitude keys */
        $query['latitude'] = 'all';
        $query['longitude'] = 'all';

        //$query['address_is_formatted'] = '1';
        //* Add only properties which are not excluded from supermap (option on Property editing form) */
        //$query['exclude_from_supermap'] = 'false,0';
        //* Set Property type */
        $query['property_type'] = $atts['property_type'];

        //* Prepare Query params */
        $query = \WPP_F::prepare_search_attributes($query);

        if($atts['pagination'] == 'on' && ( $atts[ 'json' ] == 'false' || $atts[ 'json' ] === false )  ) {
          $query['pagi'] = $atts['starting_row'] . '--' . $atts['per_page'];
        }
        $query['sort_by'] = $atts['sort_by'];
        $query['sort_order'] = $atts['sort_order'];
        //* END Prepare search params for get_properties() */

        $result = self::get_properties( $query, array(
          'fields' => $atts[ 'fields' ],
        ) );

        if( $atts[ 'json' ] == 'true' || $atts[ 'json' ] === true ) {
          $result[ 'data' ] = array_values( $result[ 'data' ] );
          wp_send_json( $result );
          exit();
        }

        $properties = $result[ 'data' ];

        $supermap_configuration['display_attributes'] = isset( $supermap_configuration['display_attributes'] ) && is_array( $supermap_configuration['display_attributes'] ) ?
          $supermap_configuration['display_attributes'] : array();

        $display_attributes = array();
        foreach($supermap_configuration['display_attributes'] as $attribute) {
          if( isset( $wp_properties['property_stats'][$attribute] ) ) {
            $display_attributes[$attribute] = $wp_properties['property_stats'][$attribute];
          }
        }

        ob_start();

        if(!empty($properties)) : ?>
          var HTML = '';
          window.supermap_<?php echo $_GET['random']; ?>.total = '<?php echo $result['total']; ?>';
          <?php

          $labels_to_keys = array_flip($wp_properties['property_stats']);

          foreach ($properties as $property_id => $value) {

            if ( !(isset( $value['latitude']) && $value['latitude']) && !(isset( $value['longitude']) && $value['longitude']) ){
              continue;
            }
            ?>
            window.myLatlng_<?php echo $_GET['random']; ?>_<?php echo $value['ID']; ?> = new google.maps.LatLng(<?php echo $value['latitude']; ?>,<?php echo $value['longitude']; ?>);
            window.content_<?php echo $_GET['random']; ?>_<?php echo $value['ID']; ?> = '<?php echo \WPP_F::google_maps_infobox($value); ?>';

            window.marker_<?php echo $_GET['random']; ?>_<?php echo $value['ID']; ?> = new google.maps.Marker({
            position: myLatlng_<?php echo $_GET['random']; ?>_<?php echo $value['ID']; ?>,
            map: map_<?php echo $_GET['random']; ?>,
            title: '<?php echo str_replace("'","\'", $value['location']); ?>',
            icon: '<?php echo apply_filters('wpp_supermap_marker', $value['ID']); ?>'
            });

            window.markers_<?php echo $_GET['random']; ?>.push(window.marker_<?php echo $_GET['random']; ?>_<?php echo $value['ID']; ?>);

            google.maps.event.addListener(marker_<?php echo $_GET['random']; ?>_<?php echo $value['ID']; ?>, 'click', function() {
            infowindow_<?php echo $_GET['random']; ?>.close();
            infowindow_<?php echo $_GET['random']; ?>.setContent(content_<?php echo $_GET['random']; ?>_<?php echo $value['ID']; ?>);
            infowindow_<?php echo $_GET['random']; ?>.open(map_<?php echo $_GET['random']; ?>,marker_<?php echo $_GET['random']; ?>_<?php echo $value['ID']; ?>);
            loadFuncy();
            makeActive(<?php echo $_GET['random']; ?>,<?php echo $value['ID']; ?>);
            });

            google.maps.event.addListener(infowindow_<?php echo $_GET['random']; ?>, 'domready', function() {
            document.getElementById('infowindow').parentNode.style.overflow='';
            document.getElementById('infowindow').parentNode.parentNode.style.overflow='';
            });

            bounds_<?php echo $_GET['random']; ?>.extend(window.myLatlng_<?php echo $_GET['random']; ?>_<?php echo $value['ID']; ?>);
            map_<?php echo $_GET['random']; ?>.fitBounds(bounds_<?php echo $_GET['random']; ?>);

            HTML += '<?php echo str_replace("'","\'", trim( preg_replace('/\s\s+/', ' ', ud_get_wpp_supermap()->render_property_item( $value, array( 'rand' => $_GET['random'], 'supermap_configuration' => $supermap_configuration, ), true ) ) ) ); ?>';

          <?php } ?>

          var wpp_supermap_<?php echo $_GET['random']; ?> = document.getElementById('super_map_list_property_<?php echo $_GET['random']; ?>');

          if( wpp_supermap_<?php echo $_GET['random']; ?> !== null ) {
          wpp_supermap_<?php echo $_GET['random']; ?>.innerHTML += HTML;
          }

        <?php else : ?>

          window.supermap_<?php echo $_GET['random']; ?>.total = '0';

          var wpp_supermap_<?php echo $_GET['random']; ?> = document.getElementById("super_map_list_property_<?php echo $_GET['random']; ?>");
          var y = '<div style="text-align:center;" class="no_properties"><?php _e('No results found.', ud_get_wpp_supermap()->domain); ?></div>';

          if( wpp_supermap_<?php echo $_GET['random']; ?> !== null ) {
          wpp_supermap_<?php echo $_GET['random']; ?>.innerHTML += y;
          }

        <?php endif; ?>
        <?php

        $result = ob_get_contents();
        ob_end_clean();

        echo \WPP_F::minify_js($result);

        exit();
      }

    }

    /**
     * Register
     */
    new Supermap_Shortcode();

  }

}