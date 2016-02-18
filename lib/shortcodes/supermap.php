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

        add_action( 'wp_ajax_/supermap/get_properties', array( __CLASS__,'ajax_get_properties' ) );
        add_action( 'wp_ajax_nopriv_/supermap/get_properties', array( __CLASS__,'ajax_get_properties' ) );

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
          'per_page' => '10'
        );
        $atts = shortcode_atts( $defaults, $atts );

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
            $property = prepare_property_for_display( $id, wp_parse_args( $args, array(
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

        $result = self::get_properties( $query );

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