<div class="searchForm" id="tabs_search">
  <ul class="nav nav-tabs">
    <li class="formTabs active" data-topmenu="buyBtnForm">
      <a data-toggle="tab" href="#tabs-1">Buy</a>
    </li>
    <li class="formTabs" data-topmenu="rentBtnForm">
      <a data-toggle="tab" href="#tabs-2">Rent</a>
    </li>
  </ul>
  <ul>
    <li class="sellBtnForm">
      <a href="http://google.com/"><?php _e('Sell your home') ?></a>
    </li>
    <li class="rentPropBtnForm">
      <a href="http://google.com/"><?php _e('Rent your property') ?></a>
    </li>
  </ul>

  <div class="clear"></div>

  <div class="tab-content">

    <!-- Buy -->

    <form class="buyForm active tab-pane" id="tabs-1" method="POST" action="">

      <input name="wpp_search[sale_type]" type="hidden" value="sale"/>

      <div class="location">
        <span class="icon-wpproperty-location-pin-solid sf-icon"></span>
        <select required="required" class="citiesSelection" name="_term" placeholder="<?php _e('Location') ?>">
          <option value="" selected></option>
        </select>
      </div>

      <!-- Buy Bedrooms -->

      <div class="sfBeds dropdown-container">
        <!-- default search value -->
        <input name="wpp_search[bedrooms]" type="hidden" value="<?php echo implode(',', apply_filters('rdc_search_default_bedrooms', array(1,2,3,4,5,6))); ?>" />

        <span>
          <div class="icon-wpproperty-attribute-bedroom-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Beds' ); ?></span>
          <b class="sf-arrow"></b>
        </span>
        <ul>
          <?php foreach( apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6)) as $value ) :
            $array_values = array();
            for( $i = $value; $i <= max(apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6))); $i++ ) {
              $array_values[] = $i;
            }
          ?>
            <li><input id="buy_beds_<?php echo $value; ?>" class="dropdown-option" name="wpp_search[bedrooms]" type="radio" value="<?php echo implode(',', $array_values) ?>"/><label for="buy_beds_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <!-- Buy Bathrooms -->

      <div class="sfBaths dropdown-container">
        <!-- default search value -->
        <input name="wpp_search[bathrooms]" type="hidden" value="<?php echo implode(',', apply_filters('rdc_search_default_bathrooms', array(1,2,3,4,5,6))); ?>" />

        <span>
          <div class="icon-wpproperty-attribute-bathroom-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Baths' ); ?></span>
          <b class="sf-arrow"></b></span>

        <ul>
          <?php foreach( apply_filters('rdc_search_bathrooms_options', array(1,2,3,4,5,6)) as $value ) :
            $array_values = array();
            for( $i = $value; $i <= max(apply_filters('rdc_search_bathrooms_options', array(1,2,3,4,5,6))); $i++ ) {
              $array_values[] = $i;
            }
            ?>
            <li><input id="buy_baths_<?php echo $value; ?>" class="dropdown-option" name="wpp_search[bathrooms]" type="radio" value="<?php echo implode(',', $array_values) ?>"/><label for="buy_baths_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <!-- Buy Price -->

      <div class="sfPrice">
        <span><div class="icon-wpproperty-attribute-price-solid sf-icon"></div>Price<b class="sf-arrow"></b></span>

        <div class="sfPriceRange">
          <div class="sfprInputsBlock">
            <input type="text" class="firstRange" value="" name="wpp_search[price][min]" placeholder="Min">
            <input type="text" class="lastRange" value="" name="wpp_search[price][max]" placeholder="Max">
          </div>
          <div class="clear"></div>
          <div class="left-side">
            <ul class="firstRangeList">
              <li><a val="50000" href="javascript:void(0);">$50k</a></li>
              <li><a val="75000" href="javascript:void(0);">$75k</a></li>
              <li><a val="100000" href="javascript:void(0);">$100k</a></li>
              <li><a val="125000" href="javascript:void(0);">$125k</a></li>
              <li><a val="150000" href="javascript:void(0);">$150k</a></li>
              <li><a val="175000" href="javascript:void(0);">$175k</a></li>
              <li><a val="200000" href="javascript:void(0);">$200k</a></li>
              <li><a val="" href="javascript:void(0);">Any Amount</a></li>
            </ul>
          </div>
          <div class="right-side">
            <ul class="lastRangeList">
              <li><a val="300000" href="javascript:void(0);">$300k</a></li>
              <li><a val="350000" href="javascript:void(0);">$350k</a></li>
              <li><a val="400000" href="javascript:void(0);">$400k</a></li>
              <li><a val="450000" href="javascript:void(0);">$450k</a></li>
              <li><a val="500000" href="javascript:void(0);">$500k</a></li>
              <li><a val="550000" href="javascript:void(0);">$550k</a></li>
              <li><a val="600000" href="javascript:void(0);">$600k</a></li>
              <li><a val="" href="javascript:void(0);">Any Amount</a></li>
            </ul>
          </div>
        </div>

      </div>

      <input type="submit" value="<?php _e('Search') ?>" />

      <div class="sf-property-quantity"><b>!</b> <?php echo \UsabilityDynamics\RDC\Utils::get_sale_properties_count(); ?> properties for sale</div>

    </form>

    <!-- /Buy -->

    <!-- Rent -->

    <form class="rentForm tab-pane" id="tabs-2" method="POST" action="">

      <input name="wpp_search[sale_type]" type="hidden" value="rent"/>

      <div class="location">
        <span class="icon-wpproperty-location-pin-solid sf-icon"></span>
        <select required="required" class="citiesSelection" name="_term" placeholder="<?php _e('Location') ?>">
          <option></option>
        </select>
      </div>

      <div class="sfBeds dropdown-container">
        <!-- default search value -->
        <input name="wpp_search[bedrooms]" type="hidden" value="<?php echo implode(',', apply_filters('rdc_search_default_bedrooms', array(1,2,3,4,5,6))); ?>" />

        <span>
          <div class="icon-wpproperty-attribute-bedroom-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Beds' ); ?></span>
          <b class="sf-arrow"></b>
        </span>

        <ul>
          <?php foreach( apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6)) as $value ) :
            $array_values = array();
            for( $i = $value; $i <= max(apply_filters('rdc_search_bedrooms_options', array(1,2,3,4,5,6))); $i++ ) {
              $array_values[] = $i;
            }
            ?>
            <li><input id="rent_beds_<?php echo $value; ?>" class="dropdown-option" name="wpp_search[bedrooms]" type="radio" value="<?php echo implode(',', $array_values) ?>"/><label for="rent_beds_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <div class="sfBaths dropdown-container">
        <!-- default search value -->
        <input name="wpp_search[bathrooms]" type="hidden" value="<?php echo implode(',', apply_filters('rdc_search_default_bathrooms', array(1,2,3,4,5,6))); ?>" />

        <span>
          <div class="icon-wpproperty-attribute-bathroom-solid sf-icon"></div>
          <span class="dropdown-value"><?php _e( 'Baths' ); ?></span>
          <b class="sf-arrow"></b></span>
        <ul>
          <?php foreach( apply_filters('rdc_search_bathrooms_options', array(1,2,3,4,5,6)) as $value ) :
            $array_values = array();
            for( $i = $value; $i <= max(apply_filters('rdc_search_bathrooms_options', array(1,2,3,4,5,6))); $i++ ) {
              $array_values[] = $i;
            }
            ?>
            <li><input id="rent_baths_<?php echo $value; ?>" class="dropdown-option" name="wpp_search[bathrooms]" type="radio" value="<?php echo implode(',', $array_values) ?>"/><label for="rent_baths_<?php echo $value; ?>"><?php echo $value; ?>+</label></li>
          <?php endforeach; ?>
        </ul>
      </div>

      <div class="sfPrice">
        <span><div class="icon-wpproperty-attribute-price-solid sf-icon"></div>Price<b class="sf-arrow"></b></span>
      </div>
      <input type="submit" value="<?php _e('Search') ?>"/>
      <div class="sf-property-quantity"><b>!</b> <?php echo \UsabilityDynamics\RDC\Utils::get_rent_properties_count(); ?> properties for rent</div>
    </form>

    <!-- /Rent -->

  </div>
</div>

<script type="text/javascript">
  jQuery(document).ready(function(){
    if ( 'undefined' != typeof jQuery().rdc_search_form ) {
      jQuery('#tabs_search').rdc_search_form();
    }
  });
</script>

