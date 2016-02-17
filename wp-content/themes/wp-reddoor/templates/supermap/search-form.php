<?php
/**
 * Current Property View for Advanced Supermap
 *
 * Be sure to use the same fields names as [property_search] shortcode uses.
 *
 * Examples:
 *  * <input name="wpp_search[location]" value="" />
 *  * <input name="wpp_search[price][min]" value="" />
 */
?>
<form class="rdc-supermap-search-form" method="post" action="">

  <div class="rdc-search-main">

    <div class="row rdc-location-section">
      <div class="col-md-12">
        <input type="text" name="wpp_search[random_75]" placeholder="Location" value="{{query.location}}" />
      </div>
    </div>

    <div class="row rdc-ranges-section">
      <div class="col-md-4">
        <label><?php _e( 'Bedroom', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="wpp_search[bedrooms][min]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_values.bedrooms" value="{{option}}">{{option}}</option>
          </select>
          <select name="wpp_search[bedrooms][max]">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_values.bedrooms" value="{{option}}">{{option}}</option>
          </select>
        </div>
      </div>
      <div class="col-md-4">
        <label><?php _e( 'Bathroom', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="wpp_search[bathrooms][min]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_values.bathrooms" value="{{option}}">{{option}}</option>
          </select>
          <select name="wpp_search[bathrooms][max]" placeholder="<?php _e( 'Max', 'reddoor' ); ?>">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_values.bathrooms" value="{{option}}">{{option}}</option>
          </select>
        </div>
      </div>
      <div class="col-md-4">
        <label><?php _e( 'Price', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="wpp_search[price][min]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_values.price" value="{{option}}">{{option}}</option>
          </select>
          <select name="wpp_search[price][max]">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option ng-repeat="option in wpp.instance.search_values.price" value="{{option}}">{{option}}</option>
          </select>
        </div>
      </div>
    </div>

  </div>

  <div class="rdc-search-optional">



  </div>

  <input type="submit" value="<?php _e( 'Apply', 'reddoor' ); ?>" class="btn">

</form>