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
          <select name="bool[must][2][range][tax_input.bedrooms][gte]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          <select name="bool[must][2][range][tax_input.bedrooms][lte]">
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
          <select name="bool[must][3][range][tax_input.bathrooms][gte]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
          <select name="bool[must][3][range][tax_input.bathrooms][lte]">
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
        <label><?php _e( 'Price', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="bool[must][4][range][tax_input.price][gte]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option ng-repeat="_price in min_prices" value="{{_price}}">{{_price}}</option>
          </select>
          <select name="bool[must][4][range][tax_input.price][lte]">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option ng-repeat="_price in max_prices" value="{{_price}}">{{_price}}</option>
          </select>
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
              <label>
                <input type="checkbox" value="Sale" name="bool[must][5][terms][tax_input.sale_type][]" />
                <?php _e('Sale', 'reddor'); ?>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="Rent" name="bool[must][5][terms][tax_input.sale_type][]" />
                <?php _e('Rent', 'reddor'); ?>
              </label>
            </li>
          </ul>
        </div>

        <label><?php _e( 'Home Type', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <ul>
            <li>
              <label>
                <input type="checkbox" value="Sale" name="bool[must][6][terms][tax_input.listing_type][]" />
                <?php _e('Sale', 'reddor'); ?>
              </label>
            </li>
            <li>
              <label>
                <input type="checkbox" value="Rent" name="bool[must][6][terms][tax_input.listing_type][]" />
                <?php _e('Rent', 'reddor'); ?>
              </label>
            </li>
          </ul>
        </div>

      </div>

      <div class="col-md-4">

        <label><?php _e( 'Square Feet', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="bool[must][7][range][meta_input.total_living_area_sqft_2][gte]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="2000">2000</option>
            <option value="3000">3000</option>
            <option value="4000">4000</option>
            <option value="5000">5000</option>
            <option value="6000">6000</option>
            <option value="7000">7000</option>
            <option value="8000">8000</option>
            <option value="9000">9000</option>
            <option value="10000">10000</option>
            <option value="15000">15000</option>
            <option value="20000">20000</option>
          </select>
          <select name="bool[must][7][range][meta_input.total_living_area_sqft_2][lte]">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="2000">2000</option>
            <option value="3000">3000</option>
            <option value="4000">4000</option>
            <option value="5000">5000</option>
            <option value="6000">6000</option>
            <option value="7000">7000</option>
            <option value="8000">8000</option>
            <option value="9000">9000</option>
            <option value="10000">10000</option>
            <option value="15000">15000</option>
            <option value="20000">20000</option>
          </select>
        </div>

        <label><?php _e( 'Lot Size', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="bool[must][8][range][tax_input.approximate_lot_size][gte]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="2000">2000</option>
            <option value="3000">3000</option>
            <option value="4000">4000</option>
            <option value="5000">5000</option>
          </select>
          <select name="bool[must][8][range][tax_input.approximate_lot_size][lte]">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
            <option value="100">100</option>
            <option value="500">500</option>
            <option value="1000">1000</option>
            <option value="2000">2000</option>
            <option value="3000">3000</option>
            <option value="4000">4000</option>
            <option value="5000">5000</option>
          </select>
        </div>

      </div>

      <div class="col-md-4">

        <label><?php _e( 'Year Built', 'reddoor' ); ?></label>
        <div class="rdc-range-fields">
          <select name="bool[must][9][range][tax_input.year_built][gte]">
            <option value=""><?php _e( 'Min', 'reddoor' ); ?></option>
            <?php for( $i=date('Y', time());$i>=1900;$i-- ): ?>
              <option value="<?php echo $i ?>"><?php echo $i; ?></option>
            <?php endfor; ?>
          </select>
          <select name="bool[must][9][range][tax_input.year_built][lte]">
            <option value=""><?php _e( 'Max', 'reddoor' ); ?></option>
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