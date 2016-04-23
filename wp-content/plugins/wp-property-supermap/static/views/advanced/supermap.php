<?php
/**
 * Advanced Supermap Template
 *
 * You want to customize the template?!
 * The most necessary elements ( or classes ) can be modified via filters below.
 *
 * Note! The current view is using AngularJS!
 */

?>
<div ng-app="wppSupermap<?php echo rand( 1001, 9999 ); ?>" data-query="<?php echo urlencode( serialize( $query ) ) ?>" data-atts="<?php echo urlencode( serialize( $atts ) ) ?>" class="wpp-advanced-supermap">

  <div ng-controller="main">

    <div class="row">

      <?php
      /**
       * Map column styles can be overwritten via filter.
       * For example, you could want to use another map column's width:
       * col-md-7 ( instead of col-md-6 )
       */
      ?>
      <div class="<?php echo apply_filters( 'wpp::advanced_supermap::map_column_classes', 'col-md-6' ); ?> sm-google-map-wrap">

        <ng-map zoom="4" center="[43.6650000, -79.4103000]" class="sm-google-map" default-style="false">

          <div class="sm-search-layer">
            <div class="sm-search-filter-layer clearfix">
              <button ng-click="toggleSearchForm()" class="sm-search-filter btn"><i class="icon-wpproperty-interface-search-solid"></i><?php echo apply_filters( 'wpp::advanced_supermap::filter::label', __( 'Filter', ud_get_wpp_supermap()->domain ) ); ?></button>
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
            <img class="sm-map-marker-icon" ng-src="{{currentProperty._map_marker_url || '//maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'}}" alt="" /> <a href="{{currentProperty._source._permalink}}">{{currentProperty._source.post_title}}</a>
          </div>
        </div>
      </div>

      <?php
      /**
       * Properties table column styles can be overwritten via filter.
       * For example, you could want to use another map column's width:
       * col-md-5 ( instead of col-md-6 )
       */
      ?>
      <div class="<?php echo apply_filters( 'wpp::advanced_supermap::table_column_classes', 'col-md-6' ); ?> sm-properties-list-wrap">

        <div ng-show="properties.length > 0" class="sm-properties-collection">

          <div class="sm-sidebar-top">{{total}} Properties</div>

          <?php ob_start(); ?>
          <div class="sm-current-property" ng-show="">
            <div class="row">
              <div class="col-md-6">
                <a href="{{currentProperty._source._permalink}}"><div class="sm-current-property-thumb" style="background-image: url({{currentProperty.featured_image_url ? currentProperty.featured_image_url : get_thumbnail_url(currentProperty.ID) }});"><div class="wpp-super-map-ajax-loader" ng-hide="currentProperty.featured_image_url">Loading....</div></div></a>
              </div>
              <div class="col-md-6">
                <div class="sm-current-property-details">
                  <ul>
                    <li class="sm-current-property-title"><a href="{{currentProperty._source._permalink}}">{{currentProperty._source.post_title}}</a></li>
                    <li class="" ng-repeat="column in wpp.instance.settings.configuration.feature_settings.supermap.display_attributes">
                      <label class="sm-attribute-label">{{wpp.instance.settings.property_stats[column]}}</label><span class="sm-attribute-value">{{currentProperty._source[column]}}</span>
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

          <table st-table="propertiesTableCollection" st-safe-src="properties" class="table table-striped sm-properties-list">
            <thead>
              <tr>
                <th class="sm-marker" style="position: relative;">
                  <div class="menu-toggle" ng-click="show_dropdown_columns=!show_dropdown_columns; $event.stopPropagation();">
                    <div class="menu-dot"></div>
                    <div class="menu-dot"></div>
                    <div class="menu-dot"></div>
                  </div>
                  <ul class="dropdown-columns-options" ng-show="show_dropdown_columns" ng-click="$event.stopPropagation()">
                    <li ng-repeat="col in columns">
                      <label>
                        <input type="checkbox" ng-true-value="1" ng-false-value="0" ng-model="col.enable" /> {{col.label}}
                      </label>
                    </li>
                  </ul>
                </th>
                <th class="sm-post-title" ng-show="columns.post_title.enable" st-sort="_source.post_title"><?php echo apply_filters( "wpp::advanced_supermap::column::title::label", __( 'Address', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-price" ng-show="columns.price.enable" st-sort="_source.tax_input.price[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::price::label", __( 'Price', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-bedrooms" ng-show="columns.bedrooms.enable" st-sort="_source.tax_input.bedrooms[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::bedrooms::label", __( 'Beds', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-bathrooms" ng-show="columns.bathrooms.enable" st-sort="_source.tax_input.bathrooms[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::bathrooms::label", __( 'Baths', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-sqft" ng-show="columns.total_living_area_sqft.enable" st-sort="_source.tax_input.total_living_area_sqft[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::sqft::label", __( 'Sq.Ft.', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-price-sqft" ng-show="columns.price_per_sqft.enable" st-sort="_source.tax_input.price_per_sqft[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::price_per_sqft::label", __( '$/Sq.Ft.', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-days" ng-show="columns.days_on_market.enable" st-sort="_source.tax_input.days_on_market[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::days::label", __( 'Days', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-lot" ng-show="columns.approximate_lot_size.enable" st-sort="_source.tax_input.approximate_lot_size[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::approximate_lot_size::label", __( 'Lot', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-sale" ng-show="columns.sale_type.enable" st-sort="_source.tax_input.sale_type[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::sale_type::label", __( 'Sale', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-subdivision" ng-show="columns.subdivision.enable" st-sort="_source.tax_input.subdivision[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::subdivision::label", __( 'Subdivision', ud_get_wpp_supermap()->domain ) ); ?></th>
                <th class="sm-neighborhood" ng-show="columns.neighborhood.enable" st-sort="_source.tax_input.neighborhood[0]"><?php echo apply_filters( "wpp::advanced_supermap::column::neighborhood::label", __( 'Neighborhood', ud_get_wpp_supermap()->domain ) ); ?></th>
              </tr>
            </thead>
            <tbody>
            <tr st-select-row="row" ng-repeat="row in propertiesTableCollection" ng-click="selectRow(row)" data-property-id="{{row._id}}">
              <td class="sm-marker"><img class="sm-map-marker-icon" ng-src="{{row._map_marker_url || '//maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'}}" alt="" /></td>
              <td class="sm-post-title" ng-show="columns.post_title.enable">{{row._source.post_title}}</td>
              <td class="sm-price" ng-show="columns.price.enable">{{row._source.tax_input.price[0] | currency}}</td>
              <td class="sm-bedrooms" ng-show="columns.bedrooms.enable">{{row._source.tax_input.bedrooms[0]}}</td>
              <td class="sm-bathrooms" ng-show="columns.bathrooms.enable">{{row._source.tax_input.bathrooms[0]}}</td>
              <td class="sm-sqft" ng-show="columns.total_living_area_sqft.enable">{{row._source.tax_input.total_living_area_sqft[0]}}</td>
              <td class="sm-price-sqft" ng-show="columns.price_per_sqft.enable">{{row._source.tax_input.price_per_sqft[0] | currency}}</td>
              <td class="sm-days" ng-show="columns.days_on_market.enable">{{row._source.tax_input.days_on_market[0]}}</td>
              <td class="sm-lot" ng-show="columns.approximate_lot_size.enable">{{row._source.tax_input.approximate_lot_size[0]}}</td>
              <td class="sm-sale" ng-show="columns.sale_type.enable">{{row._source.tax_input.sale_type[0]}}</td>
              <td class="sm-subdivision" ng-show="columns.subdivision.enable">{{row._source.tax_input.subdivision[0]}}</td>
              <td class="sm-neighborhood" ng-show="columns.neighborhood.enable">{{row._source.tax_input.neighborhood[0]}}</td>
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
