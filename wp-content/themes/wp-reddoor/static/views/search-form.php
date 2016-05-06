<div class="searchForm container" id="tabs_search">
  <ul class="nav nav-tabs">
    <li class="formTabs active" data-topmenu="buyBtnForm">
      <a data-toggle="tab" href="#tabs-1">Buy</a>
    </li>
    <li class="formTabs" data-topmenu="rentBtnForm">
      <a data-toggle="tab" href="#tabs-2">Rent</a>
    </li>
  </ul>
  <ul class="sellRentBtns">
    <li class="sellBtnForm">
      <a href="<?php echo site_url( 'sell' ) ?>"><?php _e('Sell Your Home') ?></a>
    </li>
    <li class="rentPropBtnForm">
      <a href="<?php echo site_url( 'management' ) ?>"><?php _e('Rent Your Property') ?></a>
    </li>
  </ul>

  <div class="clear"></div>

  <div class="tab-content">

    <!-- Buy -->

    <form class="buyForm active tab-pane" id="tabs-1" method="POST" action="">

      <input name="wpp_search[sale_type]" type="hidden" value="Sale"/>

      <div class="location">
        <span class="icon-wpproperty-location-pin-solid sf-icon"></span>
        <select multiple="multiple" required="required" class="citiesSelection" name="_term"></select>
      </div>

      <!-- Buy Bedrooms -->

      <div class="sfBeds dropdown-container">
        <!-- default search value -->
        <input name="wpp_search[bedrooms][min]" type="hidden" value="<?php echo apply_filters('rdc_search_default_bedrooms', 0); ?>" />

        <span class="searchTrigger">
          <div class="icon-wpproperty-attribute-bedroom-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Beds' ); ?></span>
          <b class="sf-arrow"></b>
        </span>
        <ul class="dropdown-list">
          <?php foreach( apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6)) as $value ) :
          ?>
            <li><input id="buy_beds_<?php echo $value; ?>" class="dropdown-option" name="wpp_search[bedrooms][min]" type="radio" value="<?php echo $value; ?>"/><label for="buy_beds_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <!-- Buy Bathrooms -->

      <div class="sfBaths dropdown-container">
        <!-- default search value -->
        <input name="wpp_search[bathrooms][min]" type="hidden" value="<?php echo apply_filters('rdc_search_default_bathrooms', 0); ?>" />

        <span class="searchTrigger">
          <div class="icon-wpproperty-attribute-bathroom-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Baths' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <ul class="dropdown-list">
          <?php
            foreach( apply_filters('rdc_search_bathrooms_options', array(1,2,3,4,5,6)) as $value ) :
          ?>
            <li><input id="buy_baths_<?php echo $value; ?>" class="dropdown-option" name="wpp_search[bathrooms][min]" type="radio" value="<?php echo $value; ?>"/><label for="buy_baths_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <!-- Buy Price -->

      <div class="sfPrice dropdown-container">
        <span class="searchTrigger" data-drop="price">
          <div class="icon-wpproperty-attribute-price-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Price' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <div class="sfPriceRange dropdown-list">
          <div class="sfprInputsBlock">
            <input type="text" class="firstRangeLabel" value="" placeholder="<?php _e('Min') ?>" />
            <input type="hidden" class="firstRangeValue" value="" name="wpp_search[price][min]" />

            <input type="text" class="lastRangeLabel" value="" placeholder="<?php _e('Max') ?>" />
            <input type="hidden" class="lastRangeValue" value="" name="wpp_search[price][max]" />
          </div>
          <div class="clear"></div>
          <div class="left-side">
            <ul class="firstRangeList">
              <li><a data-val="" href="javascript:;"><?php _e('No Min') ?></a></li>
              <li><a data-val="25000" href="javascript:;">$25k</a></li>
              <li><a data-val="50000" href="javascript:;">$50k</a></li>
              <li><a data-val="75000" href="javascript:;">$75k</a></li>
              <li><a data-val="100000" href="javascript:;">$100k</a></li>
              <li><a data-val="150000" href="javascript:;">$150k</a></li>
              <li><a data-val="200000" href="javascript:;">$200k</a></li>
              <li><a data-val="250000" href="javascript:;">$250k</a></li>
              <li><a data-val="300000" href="javascript:;">$300k</a></li>
              <li><a data-val="400000" href="javascript:;">$400k</a></li>
              <li><a data-val="500000" href="javascript:;">$500k</a></li>
            </ul>
          </div>
          <div class="right-side" style="display: none;">
            <ul class="lastRangeList">
              <li><a data-val="25000" href="javascript:;">$25k</a></li>
              <li><a data-val="50000" href="javascript:;">$50k</a></li>
              <li><a data-val="75000" href="javascript:;">$75k</a></li>
              <li><a data-val="100000" href="javascript:;">$100k</a></li>
              <li><a data-val="150000" href="javascript:;">$150k</a></li>
              <li><a data-val="200000" href="javascript:;">$200k</a></li>
              <li><a data-val="250000" href="javascript:;">$250k</a></li>
              <li><a data-val="300000" href="javascript:;">$300k</a></li>
              <li><a data-val="400000" href="javascript:;">$400k</a></li>
              <li><a data-val="500000" href="javascript:;">$500k</a></li>
              <li><a data-val="" href="javascript:;"><?php _e('No Max') ?></a></li>
            </ul>
          </div>
        </div>

      </div>

      <input type="submit" value="<?php _e('Search') ?>" />

      <div class="sf-property-quantity"><b class="icon-wpproperty-interface-info-outline"></b> <span class="totals_properties_sale"><span class="value">Loading</span> properties for sale</span></div>

    </form>

    <!-- /Buy -->

    <!-- Rent -->

    <form class="rentForm tab-pane" id="tabs-2" method="POST" action="">

      <input name="wpp_search[sale_type]" type="hidden" value="Rent"/>

      <div class="location">
        <span class="icon-wpproperty-location-pin-solid sf-icon"></span>
        <select multiple="multiple" required="required" class="citiesSelection" name="_term"></select>
      </div>

      <div class="sfBeds dropdown-container">
        <!-- default search value -->
        <input name="wpp_search[bedrooms][min]" type="hidden" value="<?php echo apply_filters('rdc_search_default_bedrooms', 0); ?>" />

        <span class="searchTrigger">
          <div class="icon-wpproperty-attribute-bedroom-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Beds' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <ul class="dropdown-list">
          <?php
            foreach( apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6)) as $value ) :
          ?>
            <li><input id="rent_beds_<?php echo $value; ?>" class="dropdown-option" name="wpp_search[bedrooms][min]" type="radio" value="<?php echo $value; ?>" /><label for="rent_beds_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <div class="sfBaths dropdown-container">
        <!-- default search value -->
        <input name="wpp_search[bathrooms][min]" type="hidden" value="<?php echo apply_filters('rdc_search_default_bathrooms', 0); ?>" />

        <span class="searchTrigger">
          <div class="icon-wpproperty-attribute-bathroom-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Baths' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <ul class="dropdown-list">
          <?php
            foreach( apply_filters('rdc_search_bathrooms_options', array(1,2,3,4,5,6)) as $value ) :
          ?>
            <li><input id="rent_baths_<?php echo $value; ?>" class="dropdown-option" name="wpp_search[bathrooms][min]" type="radio" value="<?php echo $value; ?>"/><label for="rent_baths_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <div class="sfPrice dropdown-container">
        <span class="searchTrigger" data-drop="price">
          <div class="icon-wpproperty-attribute-price-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Price' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <div class="sfPriceRange dropdown-list">
          <div class="sfprInputsBlock">
            <input type="text" class="firstRangeLabel" value="" placeholder="<?php _e('Min') ?>" />
            <input type="hidden" class="firstRangeValue" value="" name="wpp_search[price][min]" />

            <input type="text" class="lastRangeLabel" value="" placeholder="<?php _e('Max') ?>" />
            <input type="hidden" class="lastRangeValue" value="" name="wpp_search[price][max]" />
          </div>
          <div class="clear"></div>
          <div class="left-side">
            <ul class="firstRangeList">
              <li><a data-val="" href="javascript:;"><?php _e('No Min') ?></a></li>
              <li><a data-val="25000" href="javascript:;">$25k</a></li>
              <li><a data-val="50000" href="javascript:;">$50k</a></li>
              <li><a data-val="75000" href="javascript:;">$75k</a></li>
              <li><a data-val="100000" href="javascript:;">$100k</a></li>
              <li><a data-val="150000" href="javascript:;">$150k</a></li>
              <li><a data-val="200000" href="javascript:;">$200k</a></li>
              <li><a data-val="250000" href="javascript:;">$250k</a></li>
              <li><a data-val="300000" href="javascript:;">$300k</a></li>
              <li><a data-val="400000" href="javascript:;">$400k</a></li>
              <li><a data-val="500000" href="javascript:;">$500k</a></li>
            </ul>
          </div>
          <div class="right-side" style="display: none;">
            <ul class="lastRangeList">
              <li><a data-val="25000" href="javascript:;">$25k</a></li>
              <li><a data-val="50000" href="javascript:;">$50k</a></li>
              <li><a data-val="75000" href="javascript:;">$75k</a></li>
              <li><a data-val="100000" href="javascript:;">$100k</a></li>
              <li><a data-val="150000" href="javascript:;">$150k</a></li>
              <li><a data-val="200000" href="javascript:;">$200k</a></li>
              <li><a data-val="250000" href="javascript:;">$250k</a></li>
              <li><a data-val="300000" href="javascript:;">$300k</a></li>
              <li><a data-val="400000" href="javascript:;">$400k</a></li>
              <li><a data-val="500000" href="javascript:;">$500k</a></li>
              <li><a data-val="" href="javascript:;"><?php _e('No Max') ?></a></li>
            </ul>
          </div>
        </div>

      </div>

      <input type="submit" value="<?php _e('Search') ?>"/>

      <div class="sf-property-quantity"><b class="icon-wpproperty-interface-info-outline"></b> <span class="totals_properties_rent"><span class="value">Loading</span> properties for rent</span></div>
    </form>

    <!-- /Rent -->

  </div>
</div>

<?php
  if ( function_exists('ud_get_wpp_supermap') ) {
    wp_enqueue_script( 'ng-elasticsearch', ud_get_wpp_supermap()->path( 'bower_components/elasticsearch/elasticsearch.jquery.js' ) );
  }
?>

<script type="text/javascript">
  jQuery(document).ready(function(){
    if ( 'undefined' != typeof jQuery().rdc_search_form ) {
      jQuery('#tabs_search').rdc_search_form();
    }

    if ( typeof jQuery.es.Client != 'undefined') {

      var client = new jQuery.es.Client({
        hosts: 'site:1d5f77cffa8e5bbc062dab552a3c2093@dori-us-east-1.searchly.com'
      });

      var index = 'v5',
          type = 'property';

      client.count({
        index: index,
        type: type,
        body: {
          query: {
            bool: {
              must: [
                {
                  exists: {
                    field: "tax_input"
                  }
                },
                {
                  terms: {
                    "tax_input.sale_type": ["Rent"]
                  }
                }
              ],
              must_not: [
                {
                  term: {
                    "tax_input.location_latitude": "0"
                  }
                }
              ]
            }
          }
        }
      }, function (err, response) {
        if ( !err ) {
          jQuery('.totals_properties_rent .value').html(response.count);
        } else {
          console.error(err);
        }
      });

      client.count({
        index: index,
        type: type,
        body: {
          query: {
            bool: {
              must: [
                {
                  exists: {
                    field: "tax_input"
                  }
                },
                {
                  terms: {
                    "tax_input.sale_type": ["Sale"]
                  }
                }
              ],
              must_not: [
                {
                  term: {
                    "tax_input.location_latitude": "0"
                  }
                }
              ]
            }
          }
        }
      }, function (err, response) {
        if ( !err ) {
          jQuery('.totals_properties_sale .value').html(response.count);
        } else {
          console.error(err);
        }
      });

    }

  });
</script>

