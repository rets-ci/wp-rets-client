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
      <a href="{{currentProperty._source._permalink}}"><div class="sm-current-property-thumb" style="background-image: url( {{currentProperty.featured_image_url !== false ? currentProperty.featured_image_url : '' }} );"></div></a>
    </div>
    <div class="col-md-6">
      <div class="sm-current-property-details">
        <ul>
          <li class="sm-current-property-title"><a href="{{currentProperty._source._permalink}}">{{currentProperty._source.post_title}}</a></li>
          <li class="" ng-repeat="column in wpp.instance.settings.configuration.feature_settings.supermap.display_attributes">
            <label class="sm-attribute-label">{{wpp.instance.settings.property_stats[column]}}</label><span class="sm-attribute-value">{{currentProperty._source[column]}}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>

