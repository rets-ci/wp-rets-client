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
      <a href="{{currentProperty._source._permalink}}"><div class="sm-current-property-thumb" style="background-image: url( {{currentProperty.images[0].url !== false ? currentProperty.images[0].url : '' }} );"></div></a>
    </div>
    <div class="col-md-6">
      <div class="sm-current-property-details">
        <ul>
          <li class="sm-current-property-price">{{currentProperty._source.tax_input.price[0] | currency}}</li>
          <li class="sm-current-property-title"><a href="{{currentProperty._source._permalink}}">{{currentProperty._source.post_title}}</a></li>
        </ul>
        <ul class="sm-current-property-stats">
          <li class="beds"><i class="icon-wpproperty-attribute-bedroom-solid"></i>{{currentProperty._source.tax_input.bedrooms[0]}} Beds</li>
          <li class="baths"><i class="icon-wpproperty-attribute-bathroom-solid"></i>{{currentProperty._source.tax_input.bathrooms[0]}} Baths</li>
          <li class="sqft"><i class="icon-wpproperty-attribute-size-solid"></i>{{currentProperty._source.tax_input.total_living_area_sqft[0]}} SqFt</li>
          <li class="acres"><i class="icon-wpproperty-attribute-lotsize-solid"></i>{{currentProperty._source.tax_input.acres[0]}}</li>
        </ul>
      </div>
    </div>
  </div>
</div>

