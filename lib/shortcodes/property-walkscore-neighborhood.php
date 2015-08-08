<?php
/**
 * Shortcode: [property_walkscore_neighborhood]
 * Template: static/views/shortcodes/property_walkscore.php
 *
 * @since 1.0.0
 */
namespace UsabilityDynamics\WPP {

  if( !class_exists( 'UsabilityDynamics\WPP\Property_Walkscore_Neighborhood_Shortcode' ) ) {

    class Property_Walkscore_Neighborhood_Shortcode extends WS_Shortcode {

      /**
       * Constructor
       */
      public function __construct() {

        $options = array(
          'id' => 'property_walkscore_neighborhood',
          'params' => array(

            /* Coordinates or Property ID to determine coordinates */
            'property_id' => array(
              'name' => __( 'Property ID', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. If not set, the current post ID is used.', ud_get_wpp_walkscore()->domain ),
            ),
            'latitude' => array(
              'name' => __( 'Latitude', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. Custom Latitude can be provided.', ud_get_wpp_walkscore()->domain ),
            ),
            'longitude' => array(
              'name' => __( 'Longitude', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. Custom Longitude can be provided.', ud_get_wpp_walkscore()->domain ),
            ),

            /* Layout */
            'width' => array(
              'name' => __( 'Width', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. The pixel width of the Neighborhood Map.', ud_get_wpp_walkscore()->domain ),
            ),
            'height' => array(
              'name' => __( 'Height', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional.  The pixel height of the Neighborhood Map.', ud_get_wpp_walkscore()->domain ),
            ),
            'layout' => array(
              'name' => __( 'Height', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. The Neighborhood Map has two layout modes: "horizontal" or "vertical".', ud_get_wpp_walkscore()->domain ),
            ),

            /* Distance units */
            'distance_units' => array(
              'name' => __( 'Distance Units', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. Override the default units (km or mi). Note: When location is specified via ws_lat and ws_lon the Neighborhood Map defaults to miles. When ws_address is used, the Neighborhood Map defaults to the units of the country the address is in.', ud_get_wpp_walkscore()->domain ),
            ),

            /* Commute Report */
            'commute' => array(
              'name' => __( 'Commute Report', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. Show commute report on Neighborhood Map that displays drive, transit, walk, and bike times. Available values "true" and "false"', ud_get_wpp_walkscore()->domain ),
            ),
            'commute_address' => array(
              'name' => __( 'Commute Address', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. Specify a pre-determined destination address for the commute.', ud_get_wpp_walkscore()->domain ),
            ),

            /* Default View */
            'default_view' => array(
              'name' => __( 'Default View', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. Set the initial tile view. Available values: "commute"', ud_get_wpp_walkscore()->domain ),
            ),

            /* Industry-Specific Amenity Categories */
            'industry_type' => array(
              'name' => __( 'Industry Type', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. Choose which set of amenities to show. Current choices: "residential", "travel", and "commercial".', ud_get_wpp_walkscore()->domain ),
            ),

            /* Map Modules */
            'map_modules' => array(
              'name' => __( 'Map Modules', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. Choose which map types to enable from among the following using a comma separated list, or set to \'all\', \'default\' or \'none\'. List: \'google_map\', \'street_view\', \'satellite\', \'walkability\', \'walkshed\', \'panoramio\'.', ud_get_wpp_walkscore()->domain ),
            ),
            'base_map' => array(
              'name' => __( 'Base Map', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. Choose which map type is shown on load. Default is \'google_map\'. If the selected module is not available for a location, the first module menu option is enabled.', ud_get_wpp_walkscore()->domain ),
            ),

            /** Premium Neighborhood Map Parameters  */
            /** The following parameters are for Walk Score Premium customers. */

            /* Transit Score and Public Transit */
            'public_transit' => array(
              'name' => __( 'Public Transit', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Display Transit Score if available, as well as a summary of nearby stops and routes.', ud_get_wpp_walkscore()->domain ),
            ),
            'public_transit' => array(
              'name' => __( 'Public Transit', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Show nearby transit stops and routes and a description of the number of nearby routes.', ud_get_wpp_walkscore()->domain ),
            ),

            /* Amenity Reviews */
            'show_reviews' => array(
              'name' => __( 'Show Reviews', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Show thumbnail images and a link to reviews in the info bubble when available.', ud_get_wpp_walkscore()->domain ),
            ),

            /* Map Icon */
            'map_icon_type' => array(
              'name' => __( 'Map Icon Type', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Choose which icon to use at the center of the map. Current choices: "house" and "building".', ud_get_wpp_walkscore()->domain ),
            ),
            'custom_pin' => array(
              'name' => __( 'Custom Pin', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Provide a URL for a custom icon. Must be a .png file. Set to "none" to hide the map icon completely.', ud_get_wpp_walkscore()->domain ),
            ),

            /* Map View */
            'map_zoom' => array(
              'name' => __( 'Map Zoom', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Set an initial zoom-level for the map.', ud_get_wpp_walkscore()->domain ),
            ),

            /* Colors and Styling */
            'background_color' => array(
              'name' => __( 'Background Color', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. A background color for the whole Neighborhood Map. Light colors recommended. (default: #fff).', ud_get_wpp_walkscore()->domain ),
            ),
            'map_frame_color' => array(
              'name' => __( 'Map Frame Color', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Color for the double frame (default: #999).', ud_get_wpp_walkscore()->domain ),
            ),
            'address_box_frame_color ' => array(
              'name' => __( 'Address Box Frame Color', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Color for the address field\'s border (default #aaa).', ud_get_wpp_walkscore()->domain ),
            ),
            'address_box_bg_color' => array(
              'name' => __( 'Address Box BG Color', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Color for the address field\'s background (default #aaa).', ud_get_wpp_walkscore()->domain ),
            ),
            'address_box_text_color' => array(
              'name' => __( 'Address Box Text Color', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Color for the address field\'s text (default #aaa).', ud_get_wpp_walkscore()->domain ),
            ),
            'category_color' => array(
              'name' => __( 'Category Color', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Color for the category names (default: #777).', ud_get_wpp_walkscore()->domain ),
            ),
            'result_color' => array(
              'name' => __( 'Result Color', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Color for the names and distances of each destination (default #333).', ud_get_wpp_walkscore()->domain ),
            ),

            /* Disable Features */
            'hide_bigger_map' => array(
              'name' => __( 'Hide Bigger Map', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Hide the "Bigger map" link.', ud_get_wpp_walkscore()->domain ),
            ),
            'disable_street_view' => array(
              'name' => __( 'Disable Street View', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Turn off Street View.', ud_get_wpp_walkscore()->domain ),
            ),
            'no_link_info_bubbles' => array(
              'name' => __( 'No Link Info Bubbles', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. Remove links from the info bubbles and removes the More link from the amenity list.', ud_get_wpp_walkscore()->domain ),
            ),
            'hide_scores_below' => array(
              'name' => __( 'Hide Scores Below', ud_get_wpp_walkscore()->domain ),
              'description' => __( 'Optional. For Premium Users. By default, the Neighborhood Map displays scores from 0 to 100. If you prefer not to show low scores, you can use this to define the cutoff.', ud_get_wpp_walkscore()->domain ),
            ),

          ),
          'description' => __( 'Renders WalkScore', ud_get_wpp_walkscore()->domain ),
          'group' => 'WP-Property',
        );

        parent::__construct( $options );

      }

      /**
       *  Renders Shortcode
       */
      public function call( $atts = "" ) {

        $data = shortcode_atts( array(
          'property_id' => false,
          'latitude' => false,
          'longitude' => false,
          'width' => ud_get_wpp_walkscore( 'config.neighborhood.width', false ),
          'height' => ud_get_wpp_walkscore( 'config.neighborhood.height', false ),
          'layout' => ud_get_wpp_walkscore( 'config.neighborhood.layout', false ),
          'distance_units' => ud_get_wpp_walkscore( 'config.neighborhood.distance_units', false ),
          'commute' => ud_get_wpp_walkscore( 'config.neighborhood.commute', false ),
          'commute_address' => ud_get_wpp_walkscore( 'config.neighborhood.commute_address', false ),
          'default_view' => ud_get_wpp_walkscore( 'config.neighborhood.default_view', false ),
          'industry_type' => ud_get_wpp_walkscore( 'config.neighborhood.industry_type', false ),
          'map_modules' => ud_get_wpp_walkscore( 'config.neighborhood.map_modules', false ),
          'base_map' => ud_get_wpp_walkscore( 'config.neighborhood.base_map', false ),
          'public_transit' => ud_get_wpp_walkscore( 'config.neighborhood.public_transit', false ),
          'show_reviews' => ud_get_wpp_walkscore( 'config.neighborhood.show_reviews', false ),
          'map_icon_type' => ud_get_wpp_walkscore( 'config.neighborhood.map_icon_type', false ),
          'custom_pin' => ud_get_wpp_walkscore( 'config.neighborhood.custom_pin', false ),
          'map_zoom' => ud_get_wpp_walkscore( 'config.neighborhood.map_zoom', false ),
          'background_color' => ud_get_wpp_walkscore( 'config.neighborhood.background_color', false ),
          'map_frame_color' => ud_get_wpp_walkscore( 'config.neighborhood.map_frame_color', false ),
          'address_box_frame_color' => ud_get_wpp_walkscore( 'config.neighborhood.address_box_frame_color', false ),
          'address_box_bg_color' => ud_get_wpp_walkscore( 'config.neighborhood.address_box_bg_color', false ),
          'address_box_text_color' => ud_get_wpp_walkscore( 'config.neighborhood.address_box_text_color', false ),
          'category_color' => ud_get_wpp_walkscore( 'config.neighborhood.category_color', false ),
          'result_color' => ud_get_wpp_walkscore( 'config.neighborhood.result_color', false ),
          'hide_bigger_map' => ud_get_wpp_walkscore( 'config.neighborhood.hide_bigger_map', false ),
          'disable_street_view' => ud_get_wpp_walkscore( 'config.neighborhood.disable_street_view', false ),
          'no_link_info_bubbles' => ud_get_wpp_walkscore( 'config.neighborhood.no_link_info_bubbles', false ),
          'hide_scores_below' => ud_get_wpp_walkscore( 'config.neighborhood.hide_scores_below', false ),
        ), $atts );

        $data[ 'wsid' ] = ud_get_wpp_walkscore( 'config.api.key' );
        if( empty( $data[ 'wsid' ] ) ) {
          return;
        }

        /* Determine if latitude and longitude are be provided */
        if( empty( $data['latitude'] ) || empty( $data['longitude'] ) ) {
          if( !empty( $data[ 'property_id' ] ) && is_numeric( $data[ 'property_id' ] ) ) {
            $data['latitude'] = get_post_meta( $data[ 'property_id' ], 'latitude', true );
            $data['longitude'] = get_post_meta( $data[ 'property_id' ], 'longitude', true );
          } else {
            global $post;
            if( empty( $post ) || !is_object( $post ) || !isset( $post->ID ) ) {
              return;
            }
            $data['latitude'] = get_post_meta( $post->ID, 'latitude', true );
            $data['longitude'] = get_post_meta( $post->ID, 'longitude', true );
          }
        }

        /* Could not get latitude and longitude? Just break. */
        if( empty( $data['latitude'] ) || empty( $data['longitude'] ) ) {
          return;
        }

        if( $data['default_view'] == 'commute' ) {
          $data[ 'commute' ] = 'true';
        }

        /*
        echo "<pre>";
        print_r( $data );
        echo "</pre>";
        //*/

        $this->get_template( 'property_walkscore_neighborhood', $data );

      }

    }

    new Property_Walkscore_Neighborhood_Shortcode();

  }

}

