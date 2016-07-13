<div class="searchForm container" id="tabs_search" data-template="static/views/search-form">
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
      <input name="_taxonomy" type="hidden" value=""/>

      <div class="location">
        <span class="icon-wpproperty-location-pin-solid sf-icon"></span>
        <select multiple="multiple" required="required" class="citiesSelection" name="_term"></select>
      </div>

      <!-- Buy Bedrooms -->

      <div class="sfBeds dropdown-container">
        <!-- default search value -->
<!--        <input name="wpp_search[bedrooms][min]" type="hidden" value="--><?php //echo apply_filters('rdc_search_default_bedrooms', 0); ?><!--" />-->

        <span class="searchTrigger" data-drop="bed">
          <div class="icon-wpproperty-attribute-bedroom-solid sf-icon"></div>
          <span class="dropdown-value buyBlock"><?php _e( 'Beds' ); ?></span>
          <b class="sf-arrow"></b>
        </span>
        <div class="sfBedRange dropdown-list buyBlock">
          <div class="sfprInputsBlock">
            <input type="text" class="firstBedRangeLabel buyBlock" value="" placeholder="<?php _e('Min') ?>" />
            <input type="hidden" class="firstBedRangeValue buyBlock" value="" name="wpp_search[bedrooms][min]" />

            <input type="text" class="lastBedRangeLabel buyBlock" value="" placeholder="<?php _e('Max') ?>" />
            <input type="hidden" class="lastBedRangeValue buyBlock" value="" name="wpp_search[bedrooms][max]" />
          </div>
          <div class="clear"></div>
          <div class="left-side buyBlock">
            <ul class="firstBedRangeList buyBlock">
              <li><a class="buyFormItem" data-val="" href="javascript:;"><?php _e('No Min') ?></a></li>
              <li><a class="buyFormItem" data-val="1" href="javascript:;">1</a></li>
              <li><a class="buyFormItem" data-val="2" href="javascript:;">2</a></li>
              <li><a class="buyFormItem" data-val="3" href="javascript:;">3</a></li>
              <li><a class="buyFormItem" data-val="4" href="javascript:;">4</a></li>
              <li><a class="buyFormItem" data-val="5" href="javascript:;">5</a></li>
              <li><a class="buyFormItem" data-val="6" href="javascript:;">6</a></li>
            </ul>
          </div>
          <div class="right-side buyBlock" style="display: none;">
            <ul class="lastBedRangeList buyBlock">
              <li><a class="buyFormItem" data-val="1" href="javascript:;">1</a></li>
              <li><a class="buyFormItem" data-val="2" href="javascript:;">2</a></li>
              <li><a class="buyFormItem" data-val="3" href="javascript:;">3</a></li>
              <li><a class="buyFormItem" data-val="4" href="javascript:;">4</a></li>
              <li><a class="buyFormItem" data-val="5" href="javascript:;">5</a></li>
              <li><a class="buyFormItem" data-val="6" href="javascript:;">6</a></li>
              <li><a class="buyFormItem" data-val="" href="javascript:;"><?php _e('No Max') ?></a></li>
            </ul>
          </div>
        </div>
<!--        <ul class="dropdown-list">-->
<!--          --><?php //foreach( apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6)) as $value ) :
//          ?>
<!--            <li><input id="buy_beds_--><?php //echo $value; ?><!--" class="dropdown-option" name="wpp_search[bedrooms][min]" type="radio" value="--><?php //echo $value; ?><!--"/><label for="buy_beds_--><?php //echo $value; ?><!--">--><?php //echo $value; ?><!--+</label></li>-->
<!--          --><?php //endforeach; ?>
<!--        </ul>-->
      </div>

      <!-- Buy Bathrooms -->

      <div class="sfBaths dropdown-container">
        <!-- default search value -->
<!--        <input name="wpp_search[bathrooms][min]" type="hidden" value="--><?php //echo apply_filters('rdc_search_default_bathrooms', 0); ?><!--" />-->

        <span class="searchTrigger" data-drop="bath">
          <div class="icon-wpproperty-attribute-bathroom-solid sf-icon"></div>
          <span class="dropdown-value buyBlock"><?php _e( 'Baths' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <div class="sfBathRange dropdown-list buyBlock">
          <div class="sfprInputsBlock">
            <input type="text" class="firstBathRangeLabel buyBlock" value="" placeholder="<?php _e('Min') ?>" />
            <input type="hidden" class="firstBathRangeValue buyBlock" value="" name="wpp_search[bathrooms][min]" />

            <input type="text" class="lastBathRangeLabel buyBlock" value="" placeholder="<?php _e('Max') ?>" />
            <input type="hidden" class="lastBathRangeValue buyBlock" value="" name="wpp_search[bathrooms][max]" />
          </div>
          <div class="clear"></div>
          <div class="left-side buyBlock">
            <ul class="firstBathRangeList buyBlock">
              <li><a class="buyFormItem" data-val="" href="javascript:;"><?php _e('No Min') ?></a></li>
              <li><a class="buyFormItem" data-val="1" href="javascript:;">1</a></li>
              <li><a class="buyFormItem" data-val="2" href="javascript:;">2</a></li>
              <li><a class="buyFormItem" data-val="3" href="javascript:;">3</a></li>
              <li><a class="buyFormItem" data-val="4" href="javascript:;">4</a></li>
              <li><a class="buyFormItem" data-val="5" href="javascript:;">5</a></li>
              <li><a class="buyFormItem" data-val="6" href="javascript:;">6</a></li>
            </ul>
          </div>
          <div class="right-side buyBlock" style="display: none;">
            <ul class="lastBathRangeList buyBlock">
              <li><a class="buyFormItem" data-val="1" href="javascript:;">1</a></li>
              <li><a class="buyFormItem" data-val="2" href="javascript:;">2</a></li>
              <li><a class="buyFormItem" data-val="3" href="javascript:;">3</a></li>
              <li><a class="buyFormItem" data-val="4" href="javascript:;">4</a></li>
              <li><a class="buyFormItem" data-val="5" href="javascript:;">5</a></li>
              <li><a class="buyFormItem" data-val="6" href="javascript:;">6</a></li>
              <li><a class="buyFormItem" data-val="" href="javascript:;"><?php _e('No Max') ?></a></li>
            </ul>
          </div>
        </div>

<!--        <ul class="dropdown-list">-->
<!--          --><?php
//            foreach( apply_filters('rdc_search_bathrooms_options', array(1,2,3,4,5,6)) as $value ) :
//          ?>
<!--            <li><input id="buy_baths_--><?php //echo $value; ?><!--" class="dropdown-option" name="wpp_search[bathrooms][min]" type="radio" value="--><?php //echo $value; ?><!--"/><label for="buy_baths_--><?php //echo $value; ?><!--">--><?php //echo $value; ?><!--+</label></li>-->
<!--          --><?php //endforeach; ?>
<!--        </ul>-->
      </div>

      <!-- Buy Price -->

      <div class="sfPrice dropdown-container">
        <span class="searchTrigger" data-drop="price">
          <div class="icon-wpproperty-attribute-price-solid sf-icon"></div>
          <span class="dropdown-value buyBlock"><?php _e( 'Price' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <div class="sfPriceRange dropdown-list buyBlock">
          <div class="sfprInputsBlock">
            <input type="text" class="firstRangeLabel buyBlock" value="" placeholder="<?php _e('Min') ?>" />
            <input type="hidden" class="firstRangeValue buyBlock" value="" name="wpp_search[price][min]" />

            <input type="text" class="lastRangeLabel buyBlock" value="" placeholder="<?php _e('Max') ?>" />
            <input type="hidden" class="lastRangeValue buyBlock" value="" name="wpp_search[price][max]" />
          </div>
          <div class="clear"></div>
          <div class="left-side buyBlock">
            <ul class="firstRangeList buyBlock">
              <li><a class="buyFormItem" data-val="" href="javascript:;"><?php _e('No Min') ?></a></li>
              <li><a class="buyFormItem" data-val="25000" href="javascript:;">$25k</a></li>
              <li><a class="buyFormItem" data-val="50000" href="javascript:;">$50k</a></li>
              <li><a class="buyFormItem" data-val="75000" href="javascript:;">$75k</a></li>
              <li><a class="buyFormItem" data-val="100000" href="javascript:;">$100k</a></li>
              <li><a class="buyFormItem" data-val="150000" href="javascript:;">$150k</a></li>
              <li><a class="buyFormItem" data-val="200000" href="javascript:;">$200k</a></li>
              <li><a class="buyFormItem" data-val="250000" href="javascript:;">$250k</a></li>
              <li><a class="buyFormItem" data-val="300000" href="javascript:;">$300k</a></li>
              <li><a class="buyFormItem" data-val="400000" href="javascript:;">$400k</a></li>
              <li><a class="buyFormItem" data-val="500000" href="javascript:;">$500k</a></li>
            </ul>
          </div>
          <div class="right-side buyBlock" style="display: none;">
            <ul class="lastRangeList buyBlock">
              <li><a class="buyFormItem" data-val="25000" href="javascript:;">$25k</a></li>
              <li><a class="buyFormItem" data-val="50000" href="javascript:;">$50k</a></li>
              <li><a class="buyFormItem" data-val="75000" href="javascript:;">$75k</a></li>
              <li><a class="buyFormItem" data-val="100000" href="javascript:;">$100k</a></li>
              <li><a class="buyFormItem" data-val="150000" href="javascript:;">$150k</a></li>
              <li><a class="buyFormItem" data-val="200000" href="javascript:;">$200k</a></li>
              <li><a class="buyFormItem" data-val="250000" href="javascript:;">$250k</a></li>
              <li><a class="buyFormItem" data-val="300000" href="javascript:;">$300k</a></li>
              <li><a class="buyFormItem" data-val="400000" href="javascript:;">$400k</a></li>
              <li><a class="buyFormItem" data-val="500000" href="javascript:;">$500k</a></li>
              <li><a class="buyFormItem" data-val="" href="javascript:;"><?php _e('No Max') ?></a></li>
            </ul>
          </div>
        </div>

      </div>

      <input type="submit" value="<?php _e('Search') ?>" />

      <div class="sf-property-quantity"><b class="icon-wpproperty-interface-info-outline"></b> <span class="totals_properties_sale"><span class="value">Loading</span> properties for sale</span></div>

    </form>

    <!-- /Buy -->

    <!-- Rent -->

    <form class="rentForm tab-pane" id="tabs-2" method="POST" action="%20">

      <input name="wpp_search[sale_type]" type="hidden" value="Rent"/>

      <div class="location">
        <span class="icon-wpproperty-location-pin-solid sf-icon"></span>
        <select multiple="multiple" required="required" class="citiesSelection" name="_term"></select>
      </div>

      <div class="sfBeds dropdown-container">
        <!-- default search value -->
<!--        <input name="wpp_search[bedrooms][min]" type="hidden" value="--><?php //echo apply_filters('rdc_search_default_bedrooms', 0); ?><!--" />-->

        <span class="searchTrigger" data-drop="bed">
          <div class="icon-wpproperty-attribute-bedroom-solid sf-icon"></div>
          <span class="dropdown-value rentBlock"><?php _e( 'Beds' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <div class="sfBedRange dropdown-list rentBlock">
          <div class="sfprInputsBlock">
            <input type="text" class="firstBedRangeLabel rentBlock" value="" placeholder="<?php _e('Min') ?>" />
            <input type="hidden" class="firstBedRangeValue rentBlock" value="" name="wpp_search[bathrooms][min]" />

            <input type="text" class="lastBathRangeLabel rentBlock" value="" placeholder="<?php _e('Max') ?>" />
            <input type="hidden" class="lastBedRangeValue rentBlock" value="" name="wpp_search[bathrooms][max]" />
          </div>
          <div class="clear"></div>
          <div class="left-side rentBlock">
            <ul class="firstBedRangeList rentBlock">
              <li><a class="rentFormItem" data-val="" href="javascript:;"><?php _e('No Min') ?></a></li>
              <li><a class="rentFormItem" data-val="1" href="javascript:;">1</a></li>
              <li><a class="rentFormItem" data-val="2" href="javascript:;">2</a></li>
              <li><a class="rentFormItem" data-val="3" href="javascript:;">3</a></li>
              <li><a class="rentFormItem" data-val="4" href="javascript:;">4</a></li>
              <li><a class="rentFormItem" data-val="5" href="javascript:;">5</a></li>
              <li><a class="rentFormItem" data-val="6" href="javascript:;">6</a></li>
            </ul>
          </div>
          <div class="right-side rentBlock" style="display: none;">
            <ul class="lastBedRangeList rentBlock">
              <li><a class="rentFormItem" data-val="1" href="javascript:;">1</a></li>
              <li><a class="rentFormItem" data-val="2" href="javascript:;">2</a></li>
              <li><a class="rentFormItem" data-val="3" href="javascript:;">3</a></li>
              <li><a class="rentFormItem" data-val="4" href="javascript:;">4</a></li>
              <li><a class="rentFormItem" data-val="5" href="javascript:;">5</a></li>
              <li><a class="rentFormItem" data-val="6" href="javascript:;">6</a></li>
              <li><a class="rentFormItem" data-val="" href="javascript:;"><?php _e('No Max') ?></a></li>
            </ul>
          </div>
        </div>

<!--        <ul class="dropdown-list">-->
<!--          --><?php
//            foreach( apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6)) as $value ) :
//          ?>
<!--            <li><input id="rent_beds_--><?php //echo $value; ?><!--" class="dropdown-option" name="wpp_search[bedrooms][min]" type="radio" value="--><?php //echo $value; ?><!--" /><label for="rent_beds_--><?php //echo $value; ?><!--">--><?php //echo $value; ?><!--+</label></li>-->
<!--          --><?php //endforeach; ?>
<!--        </ul>-->
      </div>

      <div class="sfBaths dropdown-container">
        <!-- default search value -->
<!--        <input name="wpp_search[bathrooms][min]" type="hidden" value="--><?php //echo apply_filters('rdc_search_default_bathrooms', 0); ?><!--" />-->

        <span class="searchTrigger" data-drop="bath">
          <div class="icon-wpproperty-attribute-bathroom-solid sf-icon"></div>
          <span class="dropdown-value rentBlock"><?php _e( 'Baths' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <div class="sfBathRange dropdown-list rentBlock">
          <div class="sfprInputsBlock">
            <input type="text" class="firstBathRangeLabel rentBlock" value="" placeholder="<?php _e('Min') ?>" />
            <input type="hidden" class="firstBathRangeValue rentBlock" value="" name="wpp_search[bathrooms][min]" />

            <input type="text" class="lastBathRangeLabel rentBlock" value="" placeholder="<?php _e('Max') ?>" />
            <input type="hidden" class="lastBathRangeValue rentBlock" value="" name="wpp_search[bathrooms][max]" />
          </div>
          <div class="clear"></div>
          <div class="left-side rentBlock">
            <ul class="firstBathRangeList rentBlock">
              <li><a class="rentFormItem" data-val="" href="javascript:;"><?php _e('No Min') ?></a></li>
              <li><a class="rentFormItem" data-val="1" href="javascript:;">1</a></li>
              <li><a class="rentFormItem" data-val="2" href="javascript:;">2</a></li>
              <li><a class="rentFormItem" data-val="3" href="javascript:;">3</a></li>
              <li><a class="rentFormItem" data-val="4" href="javascript:;">4</a></li>
              <li><a class="rentFormItem" data-val="5" href="javascript:;">5</a></li>
              <li><a class="rentFormItem" data-val="6" href="javascript:;">6</a></li>
            </ul>
          </div>
          <div class="right-side rentBlock" style="display: none;">
            <ul class="lastBathRangeList rentBlock">
              <li><a class="rentFormItem" data-val="1" href="javascript:;">1</a></li>
              <li><a class="rentFormItem" data-val="2" href="javascript:;">2</a></li>
              <li><a class="rentFormItem" data-val="3" href="javascript:;">3</a></li>
              <li><a class="rentFormItem" data-val="4" href="javascript:;">4</a></li>
              <li><a class="rentFormItem" data-val="5" href="javascript:;">5</a></li>
              <li><a class="rentFormItem" data-val="6" href="javascript:;">6</a></li>
              <li><a class="rentFormItem" data-val="" href="javascript:;"><?php _e('No Max') ?></a></li>
            </ul>
          </div>
        </div>

<!--        <ul class="dropdown-list">-->
<!--          --><?php
//            foreach( apply_filters('rdc_search_bathrooms_options', array(1,2,3,4,5,6)) as $value ) :
//          ?>
<!--            <li><input id="rent_baths_--><?php //echo $value; ?><!--" class="dropdown-option" name="wpp_search[bathrooms][min]" type="radio" value="--><?php //echo $value; ?><!--"/><label for="rent_baths_--><?php //echo $value; ?><!--">--><?php //echo $value; ?><!--+</label></li>-->
<!--          --><?php //endforeach; ?>
<!--        </ul>-->
      </div>

      <div class="sfPrice dropdown-container">
        <span class="searchTrigger" data-drop="price">
          <div class="icon-wpproperty-attribute-price-solid sf-icon"></div>
          <span class="dropdown-value rentBlock"><?php _e( 'Price' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <div class="sfPriceRange dropdown-list rentBlock">
          <div class="sfprInputsBlock">
            <input type="text" class="firstRangeLabel rentBlock" value="" placeholder="<?php _e('Min') ?>" />
            <input type="hidden" class="firstRangeValue rentBlock" value="" name="wpp_search[price][min]" />
            <input type="text" class="lastRangeLabel rentBlock" value="" placeholder="<?php _e('Max') ?>" />
            <input type="hidden" class="lastRangeValue rentBlock" value="" name="wpp_search[price][max]" />
          </div>
          <div class="clear"></div>
          <div class="left-side rentBlock">
            <ul class="firstRangeList rentBlock">
              <li><a class="rentFormItem" data-val="" href="javascript:;"><?php _e('No Min') ?></a></li>
              <li><a class="rentFormItem" data-val="750" href="javascript:;">$750</a></li>
              <li><a class="rentFormItem" data-val="1000" href="javascript:;">$1,000</a></li>
              <li><a class="rentFormItem" data-val="1250" href="javascript:;">$1,250</a></li>
              <li><a class="rentFormItem" data-val="1500" href="javascript:;">$1,500</a></li>
              <li><a class="rentFormItem" data-val="1750" href="javascript:;">$1,750</a></li>
              <li><a class="rentFormItem" data-val="2000" href="javascript:;">$2,000</a></li>
              <li><a class="rentFormItem" data-val="2250" href="javascript:;">$2,250</a></li>
              <li><a class="rentFormItem" data-val="2500" href="javascript:;">$2,500</a></li>
              <li><a class="rentFormItem" data-val="2750" href="javascript:;">$2,750</a></li>
              <li><a class="rentFormItem" data-val="3000" href="javascript:;">$3,000</a></li>
            </ul>
          </div>
          <div class="right-side rentBlock" style="display: none;">
            <ul class="lastRangeList rentBlock">
              <li><a class="rentFormItem" data-val="1750" href="javascript:;">$1,750</a></li>
              <li><a class="rentFormItem" data-val="2000" href="javascript:;">$2,000</a></li>
              <li><a class="rentFormItem" data-val="2250" href="javascript:;">$2,250</a></li>
              <li><a class="rentFormItem" data-val="2500" href="javascript:;">$2,500</a></li>
              <li><a class="rentFormItem" data-val="2750" href="javascript:;">$2,750</a></li>
              <li><a class="rentFormItem" data-val="3000" href="javascript:;">$3,000</a></li>
              <li><a class="rentFormItem" data-val="3250" href="javascript:;">$3,250</a></li>
              <li><a class="rentFormItem" data-val="3500" href="javascript:;">$3,500</a></li>
              <li><a class="rentFormItem" data-val="3750" href="javascript:;">$3,750</a></li>
              <li><a class="rentFormItem" data-val="4000" href="javascript:;">$4,000</a></li>
              <li><a class="rentFormItem" data-val="" href="javascript:;"><?php _e('No Max') ?></a></li>
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

<?php if ( function_exists('ud_get_wpp_supermap') ) {
  wp_enqueue_script( 'ng-elasticsearch', ud_get_wpp_supermap()->path( 'bower_components/elasticsearch/elasticsearch.jquery.js' ) );
}
?>