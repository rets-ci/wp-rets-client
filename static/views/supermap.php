<?php
/**
 * Supermap template
 */

//** For now if only one attribute exists, and it's the property_type, we do not render the form at all */
if(count($searchable_attributes) == 1 && in_array('property_type', array_keys((array)$searchable_attributes))) {
  $searchable_attributes = false;
}

$supermap_configuration['display_attributes'] = isset( $supermap_configuration['display_attributes'] ) && is_array($supermap_configuration['display_attributes']) ? $supermap_configuration['display_attributes'] : array();

$display_attributes = array();
foreach( $supermap_configuration['display_attributes'] as $attribute ) {
  if( isset( $wp_properties['property_stats'][$attribute] ) ) {
    $display_attributes[$attribute] = $wp_properties['property_stats'][$attribute];
  }
}

?>
<div id="map_cont_<?php echo $rand; ?>" class="wpp_supermap_wrapper <?php echo $css_class; ?>" supermap_id="<?php echo $rand; ?>">
  <div id="super_map_<?php echo $rand; ?>" class="super_map <?php if($hide_sidebar == 'true'): ?>no_sidebar<?php endif; ?>" <?php echo $inline_styles['map']; ?>></div>
  <?php if($hide_sidebar == 'false'): ?>
    <div id="super_map_list_<?php echo $rand; ?>" class="super_map_list" <?php echo $inline_styles['sidebar']; ?>>
      <?php if (!empty( $searchable_attributes) && empty( $_REQUEST[ 'wpp_search' ] ) ) : ?>
        <?php //* hide the option link if  supermap shortcode doesn't include any attribute connected with sortable attribute */ ?>
        <div class="supermap_filter_wrapper">
          <div class="hide_filter">
            <a onclick="jQuery('#map_filters_<?php echo $rand; ?>').slideToggle('fast');return false;" href="javascript:;"><?php echo $options_label; ?></a>
          </div>
          <div id="map_filters_<?php echo $rand; ?>" class="map_filters">
            <?php //* Dynamic search options (attributes sets in shortcode) */ ?>
            <?php class_wpp_supermap::draw_supermap_options_form($searchable_attributes, $atts['property_type'], $rand); ?>
          </div>
        </div><!-- END  .supermap_filter_wrapper -->
      <?php elseif ( !empty( $_REQUEST[ 'wpp_search' ] ) ) : ?>
        <?php //* Set hidden form with attributes to handle search results on supermap ( supermap page can be used as default search result page ) */ ?>
        <?php class_wpp_supermap::draw_supermap_options_form( false, $atts['property_type'], $rand); ?>
      <?php endif; ?>
      <div id="super_map_list_property_<?php echo $rand; ?>" class="super_map_list_property">
        <?php if (!empty($properties)) {

          foreach ($properties as $key => $value) {
            $attributes = array();

            $property_stats = WPP_F::get_stat_values_and_labels($value, array(
              'property_stats' => $display_attributes
            ));

            if(is_array($property_stats)) {
              $labels_to_keys = array_flip($wp_properties['property_stats']);

              foreach($property_stats as $attribute_label => $attribute_value) {
                $boolean_field = false;
                $attribute_slug = $labels_to_keys[$attribute_label];
                $attribute_data = UsabilityDynamics\WPP\Attributes::get_attribute_data($attribute_slug);

                if(empty($attribute_value)) {
                  continue;
                }

                if( (  $attribute_data['data_input_type']=='checkbox' && ($attribute_value == 'true' || $attribute_value == 1) ) )
                {
                  if($wp_properties['configuration']['google_maps']['show_true_as_image'] == 'true') {
                    $attribute_value = '<div class="true-checkbox-image"></div>';
                  } else {
                    $attribute_value = __('Yes', ud_get_wpp_supermap()->domain);
                  }
                  $boolean_field = true;
                } elseif ($attribute_value == 'false') {
                  continue;
                }

                $attributes[] =  '<li class="supermap_list_' . $attribute_slug . ' wpp_supermap_attribute_row">';
                $attributes[] =  '<span class="attribute">' . $attribute_label . (!$boolean_field ? ':' : '') . ' </span>';
                $attributes[] =  '<span class="value">' . $attribute_value . '</span>';
                $attributes[] =  '</li>';
              }
            }

            if(in_array('view_property', $supermap_configuration['display_attributes'])) {
              $attributes[] =  '<li class="supermap_list_view_property"><a href="' . get_permalink($value['ID']) . '" class="btn btn-info btn-small"><span>'  . __('View Property', ud_get_wpp_supermap()->domain) . '</span></a></li>';
            }

            ?>
            <?php if ($value['latitude'] && $value['longitude'] && $value['ID']) { ?>
              <div id="property_in_list_<?php echo $rand; ?>_<?php echo $value['ID']; ?>" class="property_in_list clearfix">
                <ul class='property_in_list_items clearfix'>
                  <?php if( !empty( $value['featured_image'] ) && ( !isset( $supermap_configuration['hide_sidebar_thumb'] ) || $supermap_configuration['hide_sidebar_thumb'] != 'true' ) ) { ?>
                    <?php $image = wpp_get_image_link( $value['featured_image'], $supermap_configuration['supermap_thumb'], array('return'=>'array')); ?>
                    <li class='supermap_list_thumb'><span  onclick="showInfobox_<?php echo $rand; ?>(<?php echo $value['ID']; ?>);"><img class="<?php echo ($image['link'] ? 'wpp_supermap_thumb' : 'wpp_supermap_thumb wpp_default_iamge'); ?>" src="<?php echo (empty($image['link']) ? WPP_URL . 'templates/images/no_image.png' : $image['link']); ?>" style="<?php echo ($image['width'] ? 'width: '.$image['width'].'px; ' : 'width: '.$default_image_width.'px;'); ?>" alt="<?php echo $value['post_title']; ?>" /></span></li>
                  <?php } ?>
                  <li class='supermap_list_title'><span onclick="showInfobox_<?php echo $rand; ?>(<?php echo $value['ID']; ?>);"><?php echo  stripslashes($value['post_title']); ?></span></li>
                  <?php if(count($attributes) > 0) { echo implode('', $attributes); } ?>
                </ul>
              </div>
            <?php } ?>
          <?php } ?>
        <?php } ?>
      </div>
      <?php if($atts['pagination'] == 'on') { ?>
        <div class="show_more btn" style="<?php echo count($properties) < $atts['total'] ? '' : 'display:none;'; ?>">
          <?php _e('Show More', ud_get_wpp_supermap()->domain); ?>
          <div class="search_loader" style="display:none"><?php _e('Loading...', ud_get_wpp_supermap()->domain); ?></div>
        </div>
      <?php }?>
    </div>

  <?php endif; /*hide_sidebar */?>
  <br class="cb clear" />
</div>
