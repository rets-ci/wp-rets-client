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

use \UsabilityDynamics\RDC\Utils;
?>
<form class="rdc-supermap-search-form" method="post" action="">

  <input type="hidden" name="bool[must][0][exists][field]" value="tax_input" />
  <input type="hidden" name="bool[must][9][exists][field]" value="_system.location" />

  <?php if( ! Utils::device_is_mobile() ) : ?>
    <input type="hidden" name="bool[must][10][range][meta_input.latitude][gte]" class="rdc-latitude-gte" value="" />
    <input type="hidden" name="bool[must][10][range][meta_input.latitude][lte]" class="rdc-latitude-lte" value="" />
    <input type="hidden" name="bool[must][11][range][meta_input.longitude][gte]" class="rdc-longitude-gte" value="" />
    <input type="hidden" name="bool[must][11][range][meta_input.longitude][lte]" class="rdc-longitude-lte" value="" />
  <?php endif; ?>

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

    <!-- Optional Search Filters -->
    <div class="row rdc-search-optional">

      <div class="col-md-4">

        <label><?php _e( 'Price', 'reddoor' ); ?></label>
        <div class="rdc-range-fields" click-out="pricing.click_out($event)">

          <input onchange="pricing.format(this, 'min')" value="{{current_filter.price.min | simpleAmount}}" class="price-input" ng-focus="pricing.focus('min')" placeholder="<?php _e('No Min'); ?>" type="text" />
          <input onchange="pricing.format(this, 'max')" value="{{current_filter.price.max | simpleAmount}}" class="price-input" ng-focus="pricing.focus('max')" placeholder="<?php _e('No Max'); ?>" type="text" />

          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.price.min}}" ng-model="pricing.current_min" type="text" name="bool[must][2][range][tax_input.price][gte]" />
          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.price.max}}" ng-model="pricing.current_max" type="text" name="bool[must][2][range][tax_input.price][lte]" />

          <div class="price-dropdown" ng-show="pricing.mode">
            <ul class="min-values" ng-show="pricing.mode == 'min'">
              <li><a href="javascript:;" ng-click="pricing.set_min('')"><?php _e('No Min', 'reddor'); ?></a></li>
              <li ng-repeat="_price in pricing.min_prices track by $index"><a ng-click="pricing.set_min(_price)" href="javascript:;" ng-bind-template="{{_price | simpleAmount}}"></a></li>
            </ul>
            <ul class="max-values" ng-show="pricing.mode == 'max'">
              <li ng-repeat="_price in pricing.max_prices track by $index"><a ng-click="pricing.set_max(_price)" href="javascript:;" ng-bind-template="{{_price | simpleAmount}}"></a></li>
              <li><a href="javascript:;" ng-click="pricing.set_max('')"><?php _e('No Max', 'reddor'); ?></a></li>
            </ul>
          </div>

          <div class="clear"></div>
        </div>

      </div>

      <div class="col-md-4">

        <label><?php _e( 'Square Feet', 'reddoor' ); ?></label>
        <div class="rdc-range-fields" click-out="footage.click_out($event)">

          <input onchange="footage.format(this, 'min')" value="{{current_filter.feet.min}}" class="feet-input" ng-focus="footage.focus('min')" placeholder="<?php _e('No Min'); ?>" type="text" />
          <input onchange="footage.format(this, 'max')" value="{{current_filter.feet.max}}" class="feet-input" ng-focus="footage.focus('max')" placeholder="<?php _e('No Max'); ?>" type="text" />

          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.feet.min}}" ng-model="footage.current_min" type="text" name="bool[must][3][range][meta_input.total_living_area_sqft_2][gte]" />
          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.feet.max}}" ng-model="footage.current_max" type="text" name="bool[must][3][range][meta_input.total_living_area_sqft_2][lte]" />

          <div class="price-dropdown" ng-show="footage.mode">
            <ul class="min-values" ng-show="footage.mode == 'min'">
              <li><a href="javascript:;" ng-click="footage.set_min('')"><?php _e('No Min', 'reddor'); ?></a></li>
              <li ng-repeat="_foot in footage.min_foot track by $index"><a ng-click="footage.set_min(_foot)" href="javascript:;" ng-bind-template="{{_foot}}"></a></li>
            </ul>
            <ul class="max-values" ng-show="footage.mode == 'max'">
              <li ng-repeat="_foot in footage.max_foot track by $index"><a ng-click="footage.set_max(_foot)" href="javascript:;" ng-bind-template="{{_foot}}"></a></li>
              <li><a href="javascript:;" ng-click="footage.set_max('')"><?php _e('No Max', 'reddor'); ?></a></li>
            </ul>
          </div>

          <div class="clear"></div>
        </div>

      </div>

      <div class="col-md-4">

        <label><?php _e( 'Lot Size', 'reddoor' ); ?></label>
        <div class="rdc-range-fields" click-out="acrage.click_out($event)">

          <input onchange="acrage.format(this, 'min')" value="{{current_filter.acrage.min}}" class="acres-input" ng-focus="acrage.focus('min')" placeholder="<?php _e('No Min'); ?>" type="text" />
          <input onchange="acrage.format(this, 'max')" value="{{current_filter.acrage.max}}" class="acres-input" ng-focus="acrage.focus('max')" placeholder="<?php _e('No Max'); ?>" type="text" />

          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.acrage.min}}" ng-model="acrage.current_min" type="text" name="bool[must][4][range][tax_input.approximate_lot_size][gte]" />
          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.acrage.max}}" ng-model="acrage.current_max" type="text" name="bool[must][4][range][tax_input.approximate_lot_size][lte]" />

          <div class="price-dropdown" ng-show="acrage.mode">
            <ul class="min-values" ng-show="acrage.mode == 'min'">
              <li><a href="javascript:;" ng-click="acrage.set_min('')"><?php _e('No Min', 'reddor'); ?></a></li>
              <li ng-repeat="_acre in acrage.min_acres track by $index"><a ng-click="acrage.set_min(_acre)" href="javascript:;" ng-bind-template="{{_acre | acreage}}"></a></li>
            </ul>
            <ul class="max-values" ng-show="acrage.mode == 'max'">
              <li ng-repeat="_acre in acrage.max_acres track by $index"><a ng-click="acrage.set_max(_acre)" href="javascript:;" ng-bind-template="{{_acre | acreage}}"></a></li>
              <li><a href="javascript:;" ng-click="acrage.set_max('')"><?php _e('No Max', 'reddor'); ?></a></li>
            </ul>
          </div>

          <div class="clear"></div>
        </div>

      </div>

    </div>

    <div class="row rdc-ranges-section">
      <div class="col-md-4 col-sm-4">

        <label><?php _e( 'Listing Type', 'reddoor' ); ?></label>
        <div class="rdc-range-fields rdc-sale-types">
          <ul>
            <li>
              <input id="sale_type_sale" ng-checked="sale_type_checked('Sale')" class="styled-checkbox-radio" type="checkbox" value="Sale" name="bool[must][5][terms][tax_input.sale_type][]" />
              <label for="sale_type_sale"><?php _e('Sale', 'reddor'); ?></label>
            </li>
            <li>
              <input id="sale_type_rent" ng-checked="sale_type_checked('Rent')" class="styled-checkbox-radio" type="checkbox" value="Rent" name="bool[must][5][terms][tax_input.sale_type][]" />
              <label for="sale_type_rent"><?php _e('Rent', 'reddor'); ?></label>
            </li>
          </ul>
        </div>

        <label><?php _e( 'Home Type', 'reddoor' ); ?></label>
        <div class="rdc-range-fields rdc-home-types">
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
              <input id="property_type_manufactured" class="styled-checkbox-radio" type="checkbox" value="manufactured" name="bool[must][6][terms][meta_input.property_type][]" />
              <label for="property_type_manufactured"><?php _e('Manufactured', 'reddor'); ?></label>
            </li>
          </ul>
        </div>

      </div>
      <div class="col-md-4 col-sm-4">

        <label><?php _e( 'Bedrooms', 'reddoor' ); ?></label>
        <div class="rdc-range-fields" click-out="bedrange.click_out($event)">

          <input onchange="bedrange.format(this, 'min')" value="{{current_filter.bedrooms.min}}" class="bed-input" ng-focus="bedrange.focus('min')" placeholder="<?php _e('No Min'); ?>" type="text" />
          <input onchange="bedrange.format(this, 'max')" value="{{current_filter.bedrooms.max}}" class="bed-input" ng-focus="bedrange.focus('max')" placeholder="<?php _e('No Max'); ?>" type="text" />

          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.bedrooms.min}}" ng-model="bedrange.current_min" type="text" name="bool[must][7][range][tax_input.bedrooms][gte]" />
          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.bedrooms.max}}" ng-model="bedrange.current_max" type="text" name="bool[must][7][range][tax_input.bedrooms][lte]" />

          <div class="price-dropdown" ng-show="bedrange.mode">
            <ul class="min-values" ng-show="bedrange.mode == 'min'">
              <li><a href="javascript:;" ng-click="bedrange.set_min('')"><?php _e('No Min', 'reddor'); ?></a></li>
              <li ng-repeat="_bed in bedrange.min_bedroom track by $index"><a ng-click="bedrange.set_min(_bed)" href="javascript:;" ng-bind-template="{{_bed}}"></a></li>
            </ul>
            <ul class="max-values" ng-show="bedrange.mode == 'max'">
              <li ng-repeat="_bed in bedrange.max_bedroom track by $index"><a ng-click="bedrange.set_max(_bed)" href="javascript:;" ng-bind-template="{{_bed}}"></a></li>
              <li><a href="javascript:;" ng-click="bedrange.set_max('')"><?php _e('No Max', 'reddor'); ?></a></li>
            </ul>
          </div>

          <div class="clear"></div>
        </div>

      </div>
      <div class="col-md-4 col-sm-4">

        <label><?php _e( 'Bathrooms', 'reddoor' ); ?></label>
        <div class="rdc-range-fields" click-out="bathrange.click_out($event)">

          <input onchange="bathrange.format(this, 'min')" value="{{current_filter.bathrooms.min}}" class="bath-input" ng-focus="bathrange.focus('min')" placeholder="<?php _e('No Min'); ?>" type="text" />
          <input onchange="bathrange.format(this, 'max')" value="{{current_filter.bathrooms.max}}" class="bath-input" ng-focus="bathrange.focus('max')" placeholder="<?php _e('No Max'); ?>" type="text" />

          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.bathrooms.min}}" ng-model="bathrange.current_min" type="text" name="bool[must][8][range][tax_input.bathrooms][gte]" />
          <input style="opacity:0;position:absolute;z-index:-1;left:0;" only-digits ng-value="{{current_filter.bathrooms.max}}" ng-model="bathrange.current_max" type="text" name="bool[must][8][range][tax_input.bathrooms][lte]" />

          <div class="price-dropdown" ng-show="bathrange.mode">
            <ul class="min-values" ng-show="bathrange.mode == 'min'">
              <li><a href="javascript:;" ng-click="bathrange.set_min('')"><?php _e('No Min', 'reddor'); ?></a></li>
              <li ng-repeat="_bath in bathrange.min_bathroom track by $index"><a ng-click="bathrange.set_min(_bath)" href="javascript:;" ng-bind-template="{{_bath}}"></a></li>
            </ul>
            <ul class="max-values" ng-show="bathrange.mode == 'max'">
              <li ng-repeat="_bath in bathrange.max_bathroom track by $index"><a ng-click="bathrange.set_max(_bath)" href="javascript:;" ng-bind-template="{{_bath}}"></a></li>
              <li><a href="javascript:;" ng-click="bathrange.set_max('')"><?php _e('No Max', 'reddor'); ?></a></li>
            </ul>
          </div>

          <div class="clear"></div>
        </div>

      </div>
      <div class="col-md-8 col-sm-8">

        <div class="rdc-options">
          <ul>
            <li>
              <input id="red_door_listings_only" ng-checked="is_agency_listing()" class="styled-checkbox-radio" type="checkbox" value="true" checked name="bool[must][12][terms][_system.agency_listing][]" />
              <label for="red_door_listings_only"><?php _e('Only display Red Door Company listings.', 'reddor'); ?></label>
            </li>
          </ul>
        </div>

      </div>
    </div>

  </div>

  <!-- Filter Action Events -->
  <div class="rdc-action">
    <input type="submit" value="<?php _e( 'Apply', 'reddoor' ); ?>" class="btn">
  </div>

</form>