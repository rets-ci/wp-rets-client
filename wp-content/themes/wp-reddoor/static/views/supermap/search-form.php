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

  <input type="hidden" name="bool[must][0][exists][field]" value="tax_input" />
  <input type="hidden" name="bool[must_not][0][term][tax_input.location_latitude]" value="0" />

  <!-- Main Search Filters -->
  <div class="rdc-search-main">

    <div class="row rdc-location-section">
      <div class="col-md-12">
        <div class="location">
          <span class="icon-wpproperty-location-pin-solid sf-icon"></span>
          <select multiple="multiple" class="termsSelection" name="bool[must][1][terms][tax_input.{{map_filter_taxonomy}}][]"></select>
        </div>
      </div>
    </div>

    <div class="row rdc-ranges-section">
      <div class="col-md-4">
        <label><?php _e( 'Bedrooms', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <ul>
            <li><input id="buy_beds_0" class="dropdown-option styled-checkbox-radio" name="bool[must][2][range][tax_input.bedrooms][gte]" type="radio" value="0"/><label for="buy_beds_0"><?php _e('No min'); ?></label></li>
          <?php foreach( apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6)) as $value ) :
            ?>
            <li><input id="buy_beds_<?php echo $value; ?>" class="dropdown-option styled-checkbox-radio" name="bool[must][2][range][tax_input.bedrooms][gte]" type="radio" value="<?php echo $value; ?>"/><label for="buy_beds_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
          <?php endforeach; ?>
          </ul>
        </div>
      </div>
      <div class="col-md-4">
        <label><?php _e( 'Bathrooms', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <ul>
            <li><input id="buy_baths_0" class="dropdown-option styled-checkbox-radio" name="bool[must][3][range][tax_input.bathrooms][gte]" type="radio" value="0"/><label for="buy_baths_0"><?php _e('No min'); ?></label></li>
            <?php foreach( apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6)) as $value ) :
              ?>
              <li><input id="buy_baths_<?php echo $value; ?>" class="dropdown-option styled-checkbox-radio" name="bool[must][3][range][tax_input.bathrooms][gte]" type="radio" value="<?php echo $value; ?>"/><label for="buy_baths_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
            <?php endforeach; ?>
          </ul>
        </div>
      </div>
      <div class="col-md-4">

        <label><?php _e( 'Price', 'reddoor' ); ?></label>
        <div class="rdc-range-fields" click-out="pricing.mode = ''">

          <input only-digits ng-model="pricing.current_min" ng-focus="pricing.focus('min')" class="price-input" placeholder="<?php _e('No Min'); ?>" type="text" name="bool[must][4][range][tax_input.price][gte]" />
          <input only-digits ng-model="pricing.current_max" ng-focus="pricing.focus('max')" class="price-input" placeholder="<?php _e('No Max'); ?>" type="text" name="bool[must][4][range][tax_input.price][lte]" />

          <div class="price-dropdown" ng-show="pricing.mode">
            <ul class="min-values" ng-show="pricing.mode == 'min'">
              <li><a href="javascript:;" ng-click="pricing.set_min('')"><?php _e('No Min', 'reddor'); ?></a></li>
              <li ng-repeat="_price in pricing.min_prices track by $index"><a ng-click="pricing.set_min(_price)" href="javascript:;">{{_price | simpleAmount}}</a></li>
            </ul>
            <ul class="max-values" ng-show="pricing.mode == 'max'">
              <li ng-repeat="_price in pricing.max_prices track by $index"><a ng-click="pricing.set_max(_price)" href="javascript:;">{{_price | simpleAmount}}</a></li>
              <li><a href="javascript:;" ng-click="pricing.set_max('')"><?php _e('No Max', 'reddor'); ?></a></li>
            </ul>
          </div>

          <div class="clear"></div>
        </div>

        <label><?php _e( 'Home Type', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <ul>
            <li>
                <input id="property_type_condo" class="styled-checkbox-radio" type="checkbox" value="condo" checked name="bool[must][6][terms][meta_input.property_type][]" />
                <label for="property_type_condo"><?php _e('Condo', 'reddor'); ?></label>
            </li>
            <li>
                <input id="property_type_townhouse" class="styled-checkbox-radio" type="checkbox" value="townhouse" checked name="bool[must][6][terms][meta_input.property_type][]" />
                <label for="property_type_townhouse"><?php _e('Townhouse', 'reddor'); ?></label>
            </li>
            <li>
                <input id="property_type_house" class="styled-checkbox-radio" type="checkbox" value="house" checked name="bool[must][6][terms][meta_input.property_type][]" />
                <label for="property_type_house"><?php _e('House', 'reddor'); ?></label>
            </li>
            <li>
                <input id="property_type_manufactured" class="styled-checkbox-radio" type="checkbox" value="manufactured" checked name="bool[must][6][terms][meta_input.property_type][]" />
                <label for="property_type_manufactured"><?php _e('Manufactured', 'reddor'); ?></label>
            </li>
          </ul>
        </div>

      </div>
    </div>

    <!-- Optional Search Filters -->
    <div class="row rdc-search-optional">

      <div class="col-md-4">
        <label><?php _e( 'Listing Type', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <ul>
            <li>
                <input id="sale_type_sale" class="styled-checkbox-radio" type="checkbox" value="Sale" name="bool[must][5][terms][tax_input.sale_type][]" />
                <label for="sale_type_sale"><?php _e('Sale', 'reddor'); ?></label>
            </li>
            <li>
                <input id="sale_type_rent" class="styled-checkbox-radio" type="checkbox" value="Rent" name="bool[must][5][terms][tax_input.sale_type][]" />
                <label for="sale_type_rent"><?php _e('Rent', 'reddor'); ?></label>
            </li>
          </ul>
        </div>

      </div>

      <div class="col-md-4">

        <label><?php _e( 'Square Feet', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="bool[must][7][range][meta_input.total_living_area_sqft_2][gte]">
            <option value="" ng-click="footage.recalculate('')"><?php _e( 'No Min', 'reddoor' ); ?></option>
            <option ng-repeat="_feet in footage.min_feet" ng-click="footage.recalculate(_feet)" value="{{_feet}}">{{_feet}}</option>
          </select>
          <select name="bool[must][7][range][meta_input.total_living_area_sqft_2][lte]">
            <option value=""><?php _e( 'No Max', 'reddoor' ); ?></option>
            <option ng-repeat="_feet in footage.max_feet track by $index" value="{{_feet}}">{{_feet}}</option>
          </select>
        </div>

        <label><?php _e( 'Lot Size', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="bool[must][8][range][tax_input.approximate_lot_size][gte]">
            <option ng-click="acrage.recalculate('')" value=""><?php _e( 'No Min', 'reddoor' ); ?></option>
            <option ng-repeat="_acres in acrage.min_acres" ng-click="acrage.recalculate(_acres)" value="{{_acres}}">{{_acres}}</option>
          </select>
          <select name="bool[must][8][range][tax_input.approximate_lot_size][lte]">
            <option value=""><?php _e( 'No Max', 'reddoor' ); ?></option>
            <option ng-repeat="_acres in acrage.max_acres track by $index" value="{{_acres}}">{{_acres}}</option>
          </select>
        </div>

      </div>

      <div class="col-md-4">

        <label><?php _e( 'Year Built', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="bool[must][9][range][tax_input.year_built][gte]">
            <option value=""><?php _e( 'No Min', 'reddoor' ); ?></option>
            <?php for( $i=date('Y', time());$i>=1900;$i-- ): ?>
              <option value="<?php echo $i ?>"><?php echo $i; ?></option>
            <?php endfor; ?>
          </select>
          <select name="bool[must][9][range][tax_input.year_built][lte]">
            <option value=""><?php _e( 'No Max', 'reddoor' ); ?></option>
            <?php for( $i=date('Y', time());$i>=1900;$i-- ): ?>
              <option value="<?php echo $i ?>"><?php echo $i; ?></option>
            <?php endfor; ?>
          </select>
        </div>

      </div>

    </div>

  </div>

  <!-- Filter Action Events -->
  <div class="rdc-action">
    <input type="submit" value="<?php _e( 'Apply', 'reddoor' ); ?>" class="btn">
  </div>

</form>