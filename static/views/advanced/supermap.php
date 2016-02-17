<?php
/**
 * Advanced Supermap Template
 *
 */
?>
<div ng-app="wppSupermap<?php echo rand( 1001, 9999 ); ?>" data-query="<?php echo urlencode( serialize( $query ) ) ?>" data-atts="<?php echo urlencode( serialize( $atts ) ) ?>" class="wpp-advanced-supermap">

  <div ng-controller="main">

    <div class="row">

      <div class="col-md-6 sm-google-map-wrap">

        <ng-map zoom="4" center="[43.6650000, -79.4103000]" class="sm-google-map" default-style="false">

          <div class="sm-search-layer">
            <div class="clearfix">
              <button ng-click="toggleSearchForm()" class="sm-search-filter btn "><?php echo apply_filters( 'wpp::supermap::filter::label', __( 'Filter', ud_get_wpp_supermap()->domain ) ); ?></button>
            </div>
            <div class="sm-search-form" ng-show="searchForm">
              <?php echo apply_filters( 'wpp::supermap::property_search::form', do_shortcode( '[property_search]', $query, $atts ) ); ?>
            </div>
          </div>

        </ng-map>

        <div class="sm-marker-infobubble">
          <div class="sm-infobubble">
            <img class="sm-map-marker-icon" src="{{currentProperty._map_marker_url || '//maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'}}" alt="" /> <a href="{{currentProperty.permalink}}">{{currentProperty.post_title}}</a>
          </div>
        </div>
      </div>

      <div class="col-md-6 sm-properties-list-wrap">

        <div ng-show="properties.length > 0" class="sm-properties-collection">

          <div class="sm-sidebar-top">
            {{total}} <?php printf( __( '%s found', ud_get_wpp_supermap()->domain ), \WPP_F::property_label('plural') ); ?>
          </div>

          <div class="sm-current-property" ng-show="currentProperty">
            <div class="row">
              <div class="col-md-6">
                <a href="{{currentProperty.permalink}}"><div class="sm-current-property-thumb" style="background-image: url( '{{currentProperty.featured_image_url}}' );"></div></a>
              </div>
              <div class="col-md-6">
                <div class="sm-current-property-details">
                  <ul>
                    <li class="sm-current-property-title"><a href="{{currentProperty.permalink}}">{{currentProperty.post_title}}</a></li>
                    <li class="" ng-repeat="column in wpp.instance.settings.configuration.feature_settings.supermap.display_attributes">
                      <label class="sm-attribute-label">{{wpp.instance.settings.property_stats[column]}}</label><span class="sm-attribute-value">{{currentProperty[column]}}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <table st-table="propertiesTableCollection" st-safe-src="properties" class="table table-striped sm-properties-list">
            <thead>
            <tr>
              <th></th>
              <th st-sort="post_title"><?php echo apply_filters( "wpp::supermap::column::title::label", __( 'Title', ud_get_wpp_supermap()->domain ) ); ?></th>
              <th ng-repeat="column in wpp.instance.settings.configuration.feature_settings.supermap.display_attributes" st-sort="{{column}}">{{wpp.instance.settings.property_stats[column]}}</th>
            </tr>
            </thead>
            <tbody>
            <tr st-select-row="row" ng-repeat="row in propertiesTableCollection" ng-click="selectRow(row)">
              <td><img class="sm-map-marker-icon" src="{{row._map_marker_url || '//maps.gstatic.com/mapfiles/api-3/images/spotlight-poi.png'}}" alt="" /></td>
              <td>{{row.post_title}}</td>
              <td ng-repeat="column in wpp.instance.settings.configuration.feature_settings.supermap.display_attributes">{{row[column]}}</td>
            </tr>
            </tbody>
            <tfoot>
            <tr>
              <td colspan="{{wpp.instance.settings.configuration.feature_settings.supermap.display_attributes.length + 2}}" class="text-center">
                <div class="collection-pagination" st-pagination="" st-items-by-page="per_page" st-displayed-pages="7"></div>
              </td>
            </tr>
            </tfoot>
          </table>

        </div>

        <div ng-show="properties.length == 0 && loaded" class="sm-no-results">
            <?php echo apply_filters( "wpp::supermap::no_results", sprintf( __( "No %s found. Try modify your search.", ud_get_wpp_supermap()->domain ), \WPP_F::property_label('plural') ) ); ?>
        </div>

      </div>

    </div>

  </div>

</div>
