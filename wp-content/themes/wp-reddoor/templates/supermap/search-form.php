<?php
/**
 * Current Property View for Advanced Supermap
 *
 * Be sure to use the same fields names as [property_search] shortcode uses.
 *
 * Examples:
 *  * <input name="wpp_search[location]" value="" />
 *  * <input name="wpp_search[price][min]" value="" />
 *
 * Note!
 * search values are being got from window.wpp variable:
 *
 * wpp.instance.search_data
 * wpp.instance.search_values
 *
 * See: 'wpp::get_instance' filter for mor details
 * {theme_root}/wp-property/functions.php
 */
?>
<form class="rdc-supermap-search-form" method="post" action="">

  <!-- Main Search Filters -->
  <div class="rdc-search-main">

    <div class="row rdc-location-section">
      <div class="col-md-12">
        <input type="text" auto-complete ui-items="wpp.instance.search_values.random_75" ng-model="query.random_75" name="wpp_search[random_75]" />
      </div>
    </div>

    <div class="row rdc-ranges-section">
      <div class="col-md-4">
        <label><?php _e( 'Bedroom', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="wpp_search[bedrooms][min]" ng-model="query.bedrooms.min">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_data.bedrooms" value="{{option.value}}">{{option.label}}</option>
          </select>
          <select name="wpp_search[bedrooms][max]" ng-model="query.bedrooms.max">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_data.bedrooms" value="{{option.value}}">{{option.label}}</option>
          </select>
        </div>
      </div>
      <div class="col-md-4">
        <label><?php _e( 'Bathroom', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="wpp_search[bathrooms][min]" ng-model="query.bathrooms.min">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_data.bathrooms" value="{{option.value}}">{{option.label}}</option>
          </select>
          <select name="wpp_search[bathrooms][max]" ng-model="query.bathrooms.max">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_data.bathrooms" value="{{option.value}}">{{option.label}}</option>
          </select>
        </div>
      </div>
      <div class="col-md-4">
        <label><?php _e( 'Price', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <input type="text" name="wpp_search[price][min]" ng-model="query.price.min" placeholder="<?php _e( 'Min', 'reddoor' ); ?>" />
          <input type="text" name="wpp_search[price][max]" ng-model="query.price.max" placeholder="<?php _e( 'Max', 'reddoor' ); ?>" />
        </div>
      </div>
    </div>

  </div>

  <!-- Optional Search Filters -->
  <div class="rdc-search-optional">



  </div>

  <!-- Filter Action Events -->
  <div class="rdc-action">
    <input type="submit" value="<?php _e( 'Apply', 'reddoor' ); ?>" class="btn">
  </div>

</form>