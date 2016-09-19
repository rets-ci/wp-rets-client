<?php
/**
 * Advanced Supermap Template
 *
 * You want to customize the template?!
 * The most necessary elements ( or classes ) can be modified via filters below.
 *
 * Note! The current view is using AngularJS!
 */

use \UsabilityDynamics\RDC\Utils;

?>
<style>

  /** it keeps coming back */
  .gm-style-iw{
    height: 100% !important;
    overflow: hidden !important;
  }

  .select2-container .select2-search__field {
      line-height: 30px
    }


    button.sm-search-filter {
      background-color: #d03528;
    }

    button.sm-search-filter.action-pulsate {
      background-color: #e82413;
      -webkit-transition: background-color 1000ms linear;
      -moz-transition: background-color 1000ms linear;
      -o-transition: background-color 1000ms linear;
      -ms-transition: background-color 1000ms linear;
      transition: background-color 1000ms linear;
    }

  .icon-home {
    font-size: 10px;
  }

  .wpp-listing-label {
    color: white;
    background-color: #d03528;
    padding: 2px 3px;
    border-radius: 4px;
  }

  .wpp-listing-label.wpp-listing-visited {
    background-color: #e8655b;
  }

  .wpp-listing-label.wpp-listing-active {
    background-color: #e8655b;
  }

  .wpp-listing-label.wpp-listing-hover {
    background-color: #bf463b;
  }

  .wpp-listing-label.wpp-listing-favorited {
    background-color: #368839;
  }

  .wpp-cluster-label {
    color: #FFF;
  }

  .wpp-advanced-supermap {
    height: 600px;
    display: block !important;
    background-color: #f3f0e9;
    background-image: url('data:image/gif;base64,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');
    background-position: center center;
    background-repeat: no-repeat;
  }

  .wpp-advanced-supermap.status-ready {
    background-image:none;
  }

  .wpp-advanced-supermap .wpp-advanced-supermap-inner-wrapper {
    opacity: 0;
  }

  .wpp-advanced-supermap.status-ready .wpp-advanced-supermap-inner-wrapper {
    opacity:1;
  }

</style>
<script>
  // set container height quickly
  window.setTimeout(function showHeight() {
    jQuery( '.wpp-advanced-supermap' ).height( jQuery(window).height() - 120 );
    //console.log( 'height window', jQuery(window).height() );
    //console.log( "height Set height to", jQuery( '.wpp-advanced-supermap' ).height() );
  },10);

</script>

<?php //print_r($atts); ?>

<div ng-app="wppSupermap<?php echo rand( 1001, 9999 ); ?>" data-query="<?php echo urlencode( serialize( $query ) ) ?>" data-atts="<?php echo urlencode( serialize( $atts ) ) ?>" class="wpp-advanced-supermap">

  <div ng-controller="main" class="wpp-advanced-supermap-inner-wrapper">

    <div class="row">

      <?php

      /**
       * Map column styles can be overwritten via filter.
       * For example, you could want to use another map column's width:
       * col-md-7 ( instead of col-md-6 )
       */
      if ( Utils::device_is_mobile() && get_theme_mod( 'rdc_hide_supermap_mobile' ) == true ) {

      } else {

        ?>
        <div class="<?php echo apply_filters( 'wpp::advanced_supermap::map_column_classes', 'col-md-6' ); ?> sm-google-map-wrap hidden-xs hidden-sm">

          <ng-map zoom="4" center="[43.6650000, -79.4103000]" class="sm-google-map" default-style="false" map-type-control="false" street-view-control="false" scrollwheel="false">

            <div class="sm-search-layer">
              <div class="sm-search-filter-layer clearfix">
                <button ng-click="toggleSearchForm()" class="sm-search-filter btn"><i class="icon-wpproperty-interface-search-solid"></i><?php echo apply_filters( 'wpp::advanced_supermap::filter::label', __( 'Search', ud_get_wpp_supermap()->domain ) ); ?></button>
              </div>
              <div class="sm-search-form" ng-show="searchForm">
                <?php
                /**
                 * By default [property_search] shortcode is used.
                 * It can be overwritten by any custom search form.
                 * But, be sure to use the same field names as property_search uses.
                 * Examples:
                 *  * <input name="wpp_search[location]" value="" />
                 *  * <input name="wpp_search[price][min]" value="" />
                 */
                echo apply_filters( 'wpp::advanced_supermap::property_search::form', do_shortcode( '[property_search]', $query, $atts ) ); ?>
              </div>
            </div>

          </ng-map>

          <div class="sm-marker-infobubble">
            <div class="sm-infobubble">
              <img class="sm-map-marker-icon" ng-src="{{currentProperty._map_marker_url || '//maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'}}" alt="" /> <a target="_blank" class="listing-url" href="/listing/{{currentProperty._id}}">{{currentProperty._source.post_title}}</a>
            </div>
          </div>
        </div>

      <?php } ?>

      <?php
      /**
       * Properties table column styles can be overwritten via filter.
       * For example, you could want to use another map column's width:
       * col-md-5 ( instead of col-md-6 )
       */
      ?>
      <div class="<?php echo Utils::device_is_mobile() && get_theme_mod( 'rdc_hide_supermap_mobile' ) == true ? 'col-md-12' : 'col-md-5'; ?> sm-properties-list-wrap">

        <ul class="sm-list-controls">
          <li class="hidden-md hidden-lg mobile-toggle-search-icon" ng-click="toggleSearchForm()"><i class="icon-wpproperty-interface-search-solid"></i></li>
          <li ng-click="view.set('table')" class="sm-table <?php echo Utils::device_is_mobile() ? '' : 'active'; ?>"><i class="icon-wpproperty-interface-list-solid"></i></li>
          <li ng-click="view.set('preview')" class="sm-preview <?php echo Utils::device_is_mobile() ? 'active' : ''; ?>"><i class="icon-wpproperty-interface-grid-solid"></i></li>
        </ul>

        <div class="sm-search-form hidden-md hidden-lg" ng-show="searchForm">
          <?php
          if ( Utils::device_is_mobile() && get_theme_mod( 'rdc_hide_supermap_mobile' ) == true ) {
            echo apply_filters( 'wpp::advanced_supermap::property_search::form', do_shortcode( '[property_search]', $query, $atts ) );
          }
          ?>
        </div>

        <div ng-show="properties.length > 0" class="sm-properties-collection">

          <div class="sm-sidebar-top" ng-bind-template="{{total}} Properties"></div>

          <div ng-show="view.mode.preview" st-table="propertiesGridCollection" st-safe-src="properties">

            <ul class="dropdown-columns-options mode-preview" ng-show="show_dropdown_columns" ng-click="$event.stopPropagation()">
              <li ng-repeat="col in columns">
                <label>
                  <input ng-click="col_changed()" type="checkbox" ng-true-value="1" ng-false-value="0" ng-model="col.enable" /> {{col.label}}
                </label>
              </li>
            </ul>

            <ul class="sm-columns-sorter">
              <li class="sm-columns-toggle">
                <div class="menu-toggle" ng-click="show_dropdown_columns=!show_dropdown_columns; $event.stopPropagation();">
                  <div class="menu-dot"></div>
                  <div class="menu-dot"></div>
                  <div class="menu-dot"></div>
                </div>
              </li>
              <li class="sm-post-title" ng-show="columns.post_title.enable" st-sort="_source.post_title" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::title::label", __( 'Address', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-subdivision" ng-show="columns.subdivision.enable" st-sort="_source.tax_input.subdivision[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::subdivision::label", __( 'Subdivision', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-city" ng-show="columns.city.enable" st-sort="_source.tax_input.location_city[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::city::label", __( 'City', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-bedrooms" ng-show="columns.bedrooms.enable" st-sort="_source.tax_input.bedrooms[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::bedrooms::label", __( 'Beds', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-bathrooms" ng-show="columns.bathrooms.enable" st-sort="_source.tax_input.bathrooms[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::bathrooms::label", __( 'Baths', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-sqft" ng-show="columns.total_living_area_sqft.enable" st-sort="_source.tax_input.total_living_area_sqft[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::sqft::label", __( 'Sq.Ft.', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-lot" ng-show="columns.approximate_lot_size.enable" st-sort="_source.tax_input.approximate_lot_size[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::approximate_lot_size::label", __( 'Lot', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-price" ng-show="columns.price.enable" st-sort="_source.tax_input.price[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::price::label", __( 'Price', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-price-sqft" ng-show="columns.price_per_sqft.enable" st-sort="_source.tax_input.price_per_sqft[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::price_per_sqft::label", __( '$/Sq.Ft.', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-sale" ng-show="columns.sale_type.enable" st-sort="_source.tax_input.sale_type[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::sale_type::label", __( 'Sale', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-days" ng-show="columns.days_on_market.enable" st-sort="_source.tax_input.days_on_market[0]" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::days::label", __( 'Days', ud_get_wpp_supermap()->domain ) ); ?></li>
              <li class="sm-days" ng-show="columns.available_date.enable" st-sort="_source._system.available_date" st-skip-natural="true"><?php echo apply_filters( "wpp::advanced_supermap::column::available_date::label", __( 'Available', ud_get_wpp_supermap()->domain ) ); ?></li>
            </ul>

            <div class="sm-properties-grid">

              <div class="clear" style="height: 0"></div>

              <div ng-repeat="row in propertiesGridCollection" st-select-row="row" class="sm-current-property" ng-show="currentProperty && haveImages(row)" data-property-id="{{row._id}}">
                <div class="row">
                  <div class="col-md-6">
                    <a target="_blank" href="/listing/{{row._id}}">
                      <div class="sm-current-property-thumb" data-meta="rets_thumbnail_url"  ng-style="{'background-image':'url('+row.rets_thumbnail_url+')'}">
                        <img style="position: absolute;right: 5px;bottom: 10px;" ng-src="{{row.data_source_logo}}" />
                      </div>
                    </a>
                  </div>
                  <div class="col-md-6">
                    <div class="sm-current-property-details">
                      <div class="icon-buttons">
<!--                        <ul>-->
<!--                          <li><a class="icon-wpproperty-interface-expand-outline" target="_blank" href="/?p={{row._id}}"></a></li>-->
<!--                        </ul>-->
                      </div>
                      <ul>
                        <li class="sm-current-property-price" ng-bind-template="{{row._source.tax_input.price[0] | currency : '$' : 0}}"></li>
                        <li class="sm-current-property-title"><a target="_blank" href="/listing/{{row._id}}" ng-bind-template="{{row._source.tax_input.location_street_number[0]}} {{row._source.tax_input.location_direction[0]}} {{row._source.tax_input.location_street[0]}} {{row._source.tax_input.location_unit[0]}}"></a></li>
                      </ul>
                      <ul class="sm-current-property-stats">
                        <li class="beds" ng-bind-html="row.current_bedrooms"></li>
                        <li class="baths" ng-bind-html="row.current_bathrooms"></li>
                        <li class="sqft" ng-bind-html="row.current_total_living_area_sqft"></li>
                        <li class="acres" ng-bind-html="row.current_approximate_lot_size"></li>
                      </ul>
                      <div class="sm-current-property-buttons">
                        <a class="open-listing" target="_blank" href="/listing/{{row._id}}">
                          <i class="icon-wpproperty-interface-expand-outline"></i>
                          <?php _e( 'Open', ud_get_wpp_supermap()->domain ); ?>
                        </a>
                      </div>
<!--                      <div class="sm-days-on-market">-->
<!--                        <img ng-src="{{row.data_source_logo}}" /><span>{{row._source.tax_input.added[0]}} Days on Market</span>-->
<!--                      </div>-->
                    </div>
                  </div>
                </div>
              </div>

              <div class="collection-pagination" st-pagination="" st-items-by-page="per_page" st-displayed-pages="7"></div>

            </div>

          </div>

          <div ng-show="view.mode.table">

            <?php ob_start(); ?>
            <div class="sm-current-property" ng-show="">
              <div class="row">
                <div class="col-md-6">
                  <a href="{{currentProperty._source._permalink}}">
                    <div class="sm-current-property-thumb" data-kind="image" style="background-image: url({{currentProperty.featured_image_url ? currentProperty.featured_image_url : get_thumbnail_url(currentProperty.ID) }});"><div class="wpp-super-map-ajax-loader" ng-hide="currentProperty.featured_image_url">Loading....</div>
                    </div></a>
                </div>
                <div class="col-md-6">
                  <div class="sm-current-property-details">
                    <ul>
                      <li class="sm-current-property-title"><a href="{{currentProperty._source._permalink}}" ng-bind-template="{{currentProperty._source.post_title}}"></a></li>
                      <li class="" ng-repeat="column in wpp.instance.settings.configuration.feature_settings.supermap.display_attributes">
                        <label class="sm-attribute-label" ng-bind-template="{{wpp.instance.settings.property_stats[column]}}"></label><span class="sm-attribute-value" ng-bind-template="{{currentProperty._source[column]}}"></span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <?php
            /**
             * Current Property Details section can be overwritten
             * BE SURE you are using angular syntax, if you want to redeclare current view!
             */
            echo apply_filters( 'wpp::advanced_supermap::current_property::details', ob_get_clean() ); ?>
            <section class="sm-scrollable-table">
              <div style="overflow-y:scroll;min-height:110px;">
                <table st-table="propertiesTableCollection" st-safe-src="properties" class="table table-striped sm-properties-list">
                  <thead>
                  <tr class="sm-table-header">
                    <th class="sm-marker">
                      <div class="menu-toggle" ng-click="show_dropdown_columns=!show_dropdown_columns; $event.stopPropagation();">
                        <div class="menu-dot"></div>
                        <div class="menu-dot"></div>
                        <div class="menu-dot"></div>
                      </div>
                      <ul class="dropdown-columns-options mode-table" ng-show="show_dropdown_columns" ng-click="$event.stopPropagation()">
                        <li ng-repeat="col in columns">
                          <label>
                            <input ng-click="col_changed()" type="checkbox" ng-true-value="1" ng-false-value="0" ng-model="col.enable" /> {{col.label}}
                          </label>
                        </li>
                      </ul>
                    </th>
                    <th class="sm-post-title" ng-show="columns.post_title.enable" st-sort="_source.post_title" st-skip-natural="true">
                      <?php _e( 'Address', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Address', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-subdivision" ng-show="columns.subdivision.enable" st-sort="_source.tax_input.subdivision[0]" st-skip-natural="true">
                      <?php _e( 'Subdivision', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Subdivision', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-city" ng-show="columns.city.enable" st-sort="_source.tax_input.location_city[0]" st-skip-natural="true">
                      <?php _e( 'City', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'City', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-bedrooms" ng-show="columns.bedrooms.enable" st-sort="_source.tax_input.bedrooms[0]" st-skip-natural="true">
                      <?php _e( 'Beds', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Beds', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-bathrooms" ng-show="columns.bathrooms.enable" st-sort="_source.tax_input.bathrooms[0]" st-skip-natural="true">
                      <?php _e( 'Baths', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Baths', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-sqft" ng-show="columns.total_living_area_sqft.enable" st-sort="_source.tax_input.total_living_area_sqft[0]" st-skip-natural="true">
                      <?php _e( 'Sq.Ft.', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Sq.Ft.', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-lot" ng-show="columns.approximate_lot_size.enable" st-sort="_source.tax_input.approximate_lot_size[0]" st-skip-natural="true">
                      <?php _e( 'Lot', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Lot', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-price" ng-show="columns.price.enable" st-sort="_source.tax_input.price[0]" st-skip-natural="true">
                      <?php _e( 'Price', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Price', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-price-sqft" ng-show="columns.price_per_sqft.enable" st-sort="_source.tax_input.price_per_sqft[0]" st-skip-natural="true">
                      <?php _e( '$/Sq.Ft.', 'reddoor' ); ?>
                      <div>
                        <?php _e( '$/Sq.Ft.', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-sale" ng-show="columns.sale_type.enable" st-sort="_source.tax_input.sale_type[0]" st-skip-natural="true">
                      <?php _e( 'Sale', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Sale', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-days" ng-show="columns.days_on_market.enable" st-sort="_source.tax_input.days_on_market[0]" st-skip-natural="true">
                      <?php _e( 'Days', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Days', 'reddoor' ); ?>
                      </div>
                    </th>
                    <th class="sm-days" ng-show="columns.available_date.enable" st-sort="_source._system.available_date" st-skip-natural="true">
                      <?php _e( 'Available', 'reddoor' ); ?>
                      <div>
                        <?php _e( 'Available', 'reddoor' ); ?>
                      </div>
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr st-select-row="row" ng-repeat="row in propertiesTableCollection" ng-mouseover="hoverRow(row)" ng-click="selectRow(row)" data-property-id="{{row._id}}">
                    <td class="sm-marker"><img class="sm-map-marker-icon" ng-src="{{row._map_marker_url || '//maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'}}" alt="" /></td>
                    <td class="sm-post-title" ng-show="columns.post_title.enable" ng-bind-template="{{row._source.tax_input.location_street_number[0]}} {{row._source.tax_input.location_direction[0]}} {{row._source.tax_input.location_street[0]}} {{row._source.tax_input.location_unit[0]}}"></td>
                    <td class="sm-subdivision" ng-show="columns.subdivision.enable" ng-bind-template="{{row._source.tax_input.subdivision[0]}}"></td>
                    <td class="sm-city" ng-show="columns.city.enable" ng-bind-template="{{row._source.tax_input.location_city[0]}}"></td>
                    <td class="sm-bedrooms" ng-show="columns.bedrooms.enable" ng-bind-template="{{row._source.tax_input.bedrooms[0]}}"></td>
                    <td class="sm-bathrooms" ng-show="columns.bathrooms.enable" ng-bind-template="{{row._source.tax_input.bathrooms[0]}}"></td>
                    <td class="sm-sqft" ng-show="columns.total_living_area_sqft.enable" ng-bind-template="{{row._source.tax_input.total_living_area_sqft[0]}}"></td>
                    <td class="sm-lot" ng-show="columns.approximate_lot_size.enable" ng-bind-template="{{row._source.tax_input.approximate_lot_size[0]}}"></td>
                    <td class="sm-price" ng-show="columns.price.enable" ng-bind-template="{{row._source.tax_input.price[0] | currency : '$' : 0}}"></td>
                    <td class="sm-price-sqft" ng-show="columns.price_per_sqft.enable" ng-bind-template="{{row._source.tax_input.price_per_sqft[0] | currency : '$' : 0}}"></td>
                    <td class="sm-sale" ng-show="columns.sale_type.enable" ng-bind-template="{{row._source.tax_input.sale_type[0]}}"></td>
                    <td class="sm-days" ng-show="columns.days_on_market.enable" ng-bind-template="{{row._source.tax_input.added[0]}}"></td>
                    <td class="sm-days" ng-show="columns.available_date.enable" ng-bind-template="{{row._source._system.available_date}}"></td>
                  </tr>
                  </tbody>
                  <tfoot>
                  <tr>
                    <td ng-attr-colspan="{{pagination_colspan()+1}}" class="text-center">
                      <div class="collection-pagination" st-pagination="" st-items-by-page="per_page" st-displayed-pages="7"></div>
                    </td>
                  </tr>
                  </tfoot>
                </table>
              </div>
            </section>

          </div>

        </div>

        <div ng-show="!loaded && !error" class="sm-no-results">
          Loading...
        </div>

        <div ng-show="error" class="sm-no-results">
          Connection Error
        </div>

        <div ng-show="properties.length == 0 && loaded" class="sm-no-results">
          <?php
          /**
           * Want to show custom 'Empty Result Information'?
           * You are welcome!
           */
          echo apply_filters( "wpp::advanced_supermap::no_results", sprintf( __( "No %s found. Try modify your search.", ud_get_wpp_supermap()->domain ), \WPP_F::property_label('plural') ) ); ?>
        </div>

      </div>

    </div>

  </div>

</div>
