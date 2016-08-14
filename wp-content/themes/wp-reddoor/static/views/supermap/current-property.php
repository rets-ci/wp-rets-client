<?php
/**
 * Current Property View for Advanced Supermap
 *
 * AngularJS syntax is required!
 */
?>
<div class="sm-current-property" ng-show="currentProperty">
  <div class="row">
    <div class="col-md-6">
      <a target="_blank" href="/listing/{{currentProperty._id}}">
        <div class="sm-current-property-thumb" ng-style="{'background-image':'url('+currentProperty.images[0].url+')'}">
          <img style="position: absolute;right: 5px;bottom: 10px;" ng-src="{{currentProperty.data_source_logo}}" />
        </div>
      </a>
    </div>
    <div class="col-md-6">
      <div class="sm-current-property-details">
        <div class="icon-buttons">
<!--          <ul>-->
<!--            <li><a class="icon-wpproperty-interface-expand-outline" target="_blank" href="/?p={{currentProperty._id}}"></a></li>-->
<!--          </ul>-->
        </div>
        <ul>
          <li class="sm-current-property-price" ng-bind-template="{{currentProperty._source.tax_input.price[0] | currency : '$' : 0}}"></li>
          <li class="sm-current-property-title"><a target="_blank" href="/listing/{{currentProperty._id}}" ng-bind-template="{{currentProperty._source.post_title}}"></a></li>
        </ul>
        <ul class="sm-current-property-stats">
          <li class="beds" ng-bind-html="currentProperty.current_bedrooms"></li>
          <li class="baths" ng-bind-html="currentProperty.current_bathrooms"></li>
          <li class="sqft" ng-bind-html="currentProperty.current_total_living_area_sqft"></li>
          <li class="acres" ng-bind-html="currentProperty.current_approximate_lot_size"></li>
        </ul>
        <div class="sm-current-property-buttons">
          <a class="open-listing" target="_blank" href="/listing/{{currentProperty._id}}">
            <i class="icon-wpproperty-interface-expand-outline"></i>
            <?php _e( 'Open Listing', ud_get_wpp_supermap()->domain ); ?>
          </a>
        </div>
<!--        <div class="sm-days-on-market">-->
<!--          <span>{{currentProperty._source.tax_input.days_on_market[0]}} Days on Market</span>-->
<!--        </div>-->
      </div>
    </div>
  </div>
</div>

