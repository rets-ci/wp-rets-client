<?php
/**
 * Supermap template
 */

ob_start();
?>
<script type="text/javascript">
  <?php if (wp_script_is( 'jquery-ui-tabs', $list = 'queue' )) : ?>
  jQuery(window).load(function(){
    superMap_<?php echo $rand; ?>();
  });
  <?php else: ?>
  jQuery(document).ready(function() {
    superMap_<?php echo $rand; ?>();
  });
  <?php endif;?>

  jQuery(document).bind("wpp::ui-tabs::tabsshow", function(e,ui) {
    superMap_<?php echo $rand; ?>();
  });

  jQuery(document).bind("wpp_redraw_supermaps", function(e) {
    superMap_<?php echo $rand; ?>();
  });

  /**
   * Renders Supermap
   */
  function superMap_<?php echo $rand; ?>() {
    /* Map settings */
    var myOptions_<?php echo $rand; ?> = {
      <?php if($zoom): ?>
      zoom: <?php echo $zoom; ?>,
      <?php endif; ?>
      <?php if(!empty($center_on)): ?>
      center:  new google.maps.LatLng(<?php echo $center_on; ?>),
      <?php endif; ?>
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    if(typeof window.map_<?php echo $rand; ?> ==='object' || jQuery("#super_map_<?php echo $rand; ?>:visible").length===0){
      return false;
    }

    /* Set global map, Infowindow and other params */
    window.map_<?php echo $rand; ?> = new google.maps.Map(document.getElementById("super_map_<?php echo $rand; ?>"), myOptions_<?php echo $rand; ?>);
    window.infowindow_<?php echo $rand; ?> = new google.maps.InfoWindow();
    window.bounds_<?php echo $rand; ?> = new google.maps.LatLngBounds();
    window.markers_<?php echo $rand; ?> = [];


    /* Set search params */
    var formFilter = jQuery('#formFilter_<?php echo $rand; ?>');
    window.supermap_<?php echo $rand; ?> = {
      total : '<?php echo $atts['total']; ?>',
      per_page : '<?php echo $atts['per_page']; ?>',
      starting_row : '<?php echo $atts['starting_row']; ?>',
      pagination : '<?php echo $atts['pagination']; ?>',
      sort_order : '<?php echo $atts['sort_order']; ?>',
      sort_by : '<?php echo $atts['sort_by']; ?>',
      action : 'supermap_get_properties',
      random : '<?php echo $rand; ?>',
      property_type: '<?php echo trim(( is_array($atts['property_type']) ? implode(',',$atts['property_type']) : $atts['property_type'] )); ?>',
      search_atts : (formFilter.length > 0 ? formFilter.serialize() : '')
    };

    /* START Markers functionality */
    <?php foreach ((array) $properties as $id => $value) : ?>
    <?php if ($value['latitude'] && $value['longitude']) : ?>
    window.myLatlng_<?php echo $rand; ?>_<?php echo $value['ID']; ?> = new google.maps.LatLng(<?php echo $value['latitude']; ?>,<?php echo $value['longitude']; ?>);
    window.content_<?php echo $rand; ?>_<?php echo $value['ID']; ?> = '<?php echo WPP_F::google_maps_infobox($value); ?>';

    window.marker_<?php echo $rand; ?>_<?php echo $value['ID']; ?> = new google.maps.Marker({
      position: myLatlng_<?php echo $rand; ?>_<?php echo $value['ID']; ?>,
      map: map_<?php echo $rand; ?>,
      title: '<?php echo str_replace("'","\'", !empty($value[$wp_properties['configuration']['address_attribute']]) ? $value[$wp_properties['configuration']['address_attribute']] : '' ); ?>',
      icon: '<?php echo apply_filters('wpp_supermap_marker', '', $value['ID']); ?>'
    });

    window.markers_<?php echo $rand; ?>.push(window.marker_<?php echo $rand; ?>_<?php echo $value['ID']; ?>);

    google.maps.event.addListener(marker_<?php echo $rand; ?>_<?php echo $value['ID']; ?>, 'click', function() {
      infowindow_<?php echo $rand; ?>.close();
      infowindow_<?php echo $rand;  ?>.setContent(content_<?php echo $rand; ?>_<?php echo $value['ID']; ?>);
      infowindow_<?php echo $rand; ?>.open(map_<?php echo $rand; ?>,marker_<?php echo $rand; ?>_<?php echo $value['ID']; ?>);
      loadFuncy();
      /* Highlighting clicked property on the map */
      makeActive(<?php echo $rand; ?>,<?php echo $value['ID']; ?>);
    });

    google.maps.event.addListener(infowindow_<?php echo $rand; ?>, 'domready', function() {
      document.getElementById('infowindow').parentNode.style.overflow='hidden';
      document.getElementById('infowindow').parentNode.parentNode.style.overflow='hidden';
    });


    bounds_<?php echo $rand; ?>.extend(window.myLatlng_<?php echo $rand; ?>_<?php echo $value['ID']; ?>);
    <?php endif; ?>
    <?php endforeach; ?>
    /* END Markers functionality */

    /* Set zoom */
    map_<?php echo $rand; ?>.setZoom(<?php echo ((int)$zoom != 0 ? $zoom : 10); ?>);
    /* Set center */
    <?php if (!empty($center_on)) : ?>
    map_<?php echo $rand; ?>.setCenter(new google.maps.LatLng(<?php echo $center_on; ?>));
    <?php else: ?>
    <?php foreach ((array) $properties as $id => $p) : ?>
    if (typeof myLatlng_<?php echo $rand; ?>_<?php echo $p['ID']; ?> != 'undefined') {
      map_<?php echo $rand; ?>.setCenter(myLatlng_<?php echo $rand; ?>_<?php echo $p['ID']; ?>);
    }
    <?php endforeach; ?>
    <?php endif; ?>

    /* Prevent issue with map having no height if no CSS is included and no height is set via shortcode */
    if(jQuery("#super_map_<?php echo $rand; ?>").height() === 0) {
      jQuery("#super_map_<?php echo $rand; ?>").height(400);
    }

    <?php if(empty($zoom) && empty($center_on)): ?>
    /* Set defaults */
    map_<?php echo $rand; ?>.fitBounds(bounds_<?php echo $rand; ?>);
    <?php endif; ?>

    <?php if (!empty($area_lines)) : ?>
    /* Renders Areas */
    <?php echo $area_lines; ?>
    <?php endif; ?>

    /* Bind events */
    /* Show More Event */
    jQuery('.show_more', '#super_map_list_<?php echo $rand; ?>').click(function(){
      getProperties(<?php echo $rand; ?>, 'more');
    });


  }

  /**
   * Shows Infobox on Supermap
   */
  function showInfobox_<?php echo $rand; ?>(id) {
    map_<?php echo $rand; ?>.setCenter(eval('myLatlng_<?php echo $rand; ?>_' + id));
    map_<?php echo $rand; ?>.setZoom(<?php echo (int)$zoom != 0 ? $zoom : 10; ?>);

    makeActive(<?php echo $rand; ?>,id);

    infowindow_<?php echo $rand; ?>.setContent(eval('content_<?php echo $rand; ?>_' + id));

    setTimeout( function(){
      infowindow_<?php echo $rand; ?>.open(map_<?php echo $rand; ?>, eval('marker_<?php echo $rand; ?>_' + id));
      loadFuncy();
    }, 500);
  }

  /**
   * Set property as active in sidebar when property's popup is opened on supermap
   */
  if(typeof makeActive != 'function') {
    function makeActive(rand,id){
      if(jQuery(".property_in_list").length > 0) {
        jQuery(".property_in_list").removeClass("active");
      }
      if(jQuery("#property_in_list_"+rand+"_"+id).length > 0) {
        jQuery("#property_in_list_"+rand+"_"+id).addClass("active");
      }
    }
  }

  /**
   *
   */
  if(typeof loadFuncy != 'function') {
    function loadFuncy(){
      jQuery("a#single_image").fancybox({
        transitionIn: 'elastic',
        transitionOut: 'elastic',
        speedIn: 600,
        speedOut: 200,
        overlayShow: false
      });
    }
  }

  /**
   * Search properties and renders found ones on supermap
   *
   * @param rand
   * @param type
   */
  if(typeof getProperties != 'function') {
    function getProperties(rand, type){
      /* Set default type as 'search' */
      if (typeof type == 'undefined') {
        type = 'search';
      }

      /* Get search settings */
      var s = eval('supermap_' + rand);
      var markers = eval('markers_' + rand);
      var ajaxloader = jQuery('.super_map_list .map_filters .search_loader');

      switch(type) {

        case 'search':
          jQuery('#super_map_list_property_'+rand).html('');
          s.search_atts = jQuery('#formFilter_'+rand).serialize();
          s.starting_row = 0;
          clearMarkers(markers);
          break;

        case 'more':
          s.starting_row = parseInt(s.starting_row) + parseInt(s.per_page);
          break;

      }

      /* Prepare params for Ajax search */
      params = prepareSupermapSearchParams(s);

      ajaxloader.show();

      jQuery.ajax({
        async: false,
        type: "POST",
        url: "<?php echo admin_url('admin-ajax.php'); ?>",
        data:params,
        success: function(msg){
          eval(msg);
        }
      });

      ajaxloader.hide();

      /* Show or hide 'Show More' button */
      var sm = jQuery('.show_more', jQuery('#super_map_list_property_'+rand).parent());
      if(sm.length > 0) {
        if( (parseInt(s.starting_row) + parseInt(s.per_page) ) >= parseInt(s.total)) {
          sm.hide();
        } else {
          sm.show();
        }
      }
    }
  }

  /**
   * Prepares Search params for get Properties
   *
   * @param rand
   * @return string $params Prepared params
   * @author Maxim Peshkov
   */
  if(typeof prepareSupermapSearchParams != 'function') {
    function prepareSupermapSearchParams(obj) {
      var params = '';
      for(var i in obj) {
        if(params != '') {
          params += '&'
        }
        if(i == 'search_atts') {
          params += obj[i];
        } else {
          params += i + '=' + obj[i];
        }
      }
      return params;
    }
  }

  /**
   * Clear Markers on Supermap
   *
   * @param array $markers Array of google map objects (markers)
   * @author Maxim Peshkov
   */
  if(typeof clearMarkers != 'function') {
    function clearMarkers(markers) {
      for (var i in markers) {
        markers[i].setMap(null);
      }
    }
  }
</script>

<?php
$return_content['script'] = ob_get_contents();
ob_end_clean();

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

ob_start();
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
<?php
$return_content['html'] = ob_get_contents();
ob_end_clean();
$return_content['script'] = WPP_F::minify_js($return_content['script']);
echo implode($return_content);
