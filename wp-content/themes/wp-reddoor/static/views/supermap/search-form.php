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

<!--    <div class="row rdc-location-section">-->
<!--      <div class="col-md-12">-->
<!--        <input type="text" auto-complete ui-items="wpp.instance.search_values.random_75" ng-model="query.random_75" name="wpp_search[random_75]" />-->
<!--      </div>-->
<!--    </div>-->

    <div class="row rdc-ranges-section">
      <div class="col-md-4">
        <label><?php _e( 'Bedrooms', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="bool[must][0][range][tax_input.bedrooms][gte]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          <select name="bool[must][0][range][tax_input.bedrooms][lte]">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
      </div>
      <div class="col-md-4">
        <label><?php _e( 'Bathrooms', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="bool[must][1][range][tax_input.bathrooms][gte]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          <select name="bool[must][1][range][tax_input.bathrooms][lte]">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
      </div>
<!--      <div class="col-md-4">-->
<!--        <label>--><?php //_e( 'Price', 'reddoor' ); ?><!--</label>-->
<!--        <div class="rdc-range-fields">-->
<!--          <input type="text" name="wpp_search[price][min]" ng-model="query.price.min" placeholder="--><?php //_e( 'Min', 'reddoor' ); ?><!--" />-->
<!--          <input type="text" name="wpp_search[price][max]" ng-model="query.price.max" placeholder="--><?php //_e( 'Max', 'reddoor' ); ?><!--" />-->
<!--        </div>-->
<!--      </div>-->
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