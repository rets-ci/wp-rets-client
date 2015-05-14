<?php
/**
 * Supermap Property Item
 *
 */

$attributes = array();

$property_stats = WPP_F::get_stat_values_and_labels($property, array(
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

    if( (  $attribute_data['data_input_type']=='checkbox' && ($attribute_value == 'true' || $attribute_value == 1) ) ) {
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
  $attributes[] =  '<li class="supermap_list_view_property"><a href="' . get_permalink($property['ID']) . '" class="btn btn-info btn-small"><span>'  . __('View Property', ud_get_wpp_supermap()->domain) . '</span></a></li>';
}

?>

<?php if ($property['latitude'] && $property['longitude'] && $property['ID']) { ?>

  <div id="property_in_list_<?php echo $rand; ?>_<?php echo $property['ID']; ?>" class="property_in_list clearfix">
    <ul class='property_in_list_items clearfix'>
      <?php if( !empty( $property['featured_image'] ) && ( !isset( $supermap_configuration['hide_sidebar_thumb'] ) || $supermap_configuration['hide_sidebar_thumb'] != 'true' ) ) { ?>
        <?php $image = wpp_get_image_link( $property['featured_image'], $supermap_configuration['supermap_thumb'], array('return'=>'array')); ?>
        <li class='supermap_list_thumb'><span  onclick="showInfobox_<?php echo $rand; ?>(<?php echo $property['ID']; ?>);"><img class="<?php echo ($image['link'] ? 'wpp_supermap_thumb' : 'wpp_supermap_thumb wpp_default_iamge'); ?>" src="<?php echo (empty($image['link']) ? WPP_URL . 'templates/images/no_image.png' : $image['link']); ?>" style="<?php echo ($image['width'] ? 'width: '.$image['width'].'px; ' : 'width: '.$default_image_width.'px;'); ?>" alt="<?php echo $property['post_title']; ?>" /></span></li>
      <?php } ?>
      <li class='supermap_list_title'><span onclick="showInfobox_<?php echo $rand; ?>(<?php echo $property['ID']; ?>);"><?php echo  stripslashes($property['post_title']); ?></span></li>
      <?php if(count($attributes) > 0) { echo implode('', $attributes); } ?>
    </ul>
  </div>
<?php }