<?php
/**
 * RDC Agent card for single property
 */

global $property;

use \UsabilityDynamics\RDC\Utils;

?>

<div class="oneAgent">

  <?php if(Utils::get_single_term( 'sale_type', $property['ID'], 'slug' ) == 'sale') : ?>

  <ul class="socialButtons">
    <li><a href="javascript:void(0);"><span class="icon-wpproperty-interface-share-solid shareButton"></span></a></li>
    <li><a target="_blank" href="<?php echo do_shortcode('[property_flyer urlonly=yes]'); ?>"><span class="icon-wpproperty-interface-print-solid"></span></a></li>
  </ul>

  <?php endif; ?>

  <div class="singleShareContainer">
    <h4><?php _e('Share This Property','reddoor'); ?></h4>
    <p>
      <a class="icon-wpproperty-social-facebook-symbol" target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=<?php echo urlencode(get_the_permalink()); ?>"></a>
      <a class="icon-wpproperty-social-twitter-symbol" target="_blank" href="https://twitter.com/home?status=<?php echo urlencode('Check out this ' . ($bedrooms = Utils::get_single_term('bedrooms', $property['ID'])) . ' bed ' . ($bathrooms = Utils::get_single_term('bathrooms', $property['ID'])) . ' bath ' . ($total_living_area = Utils::get_single_term('total_living_area_sqft', $property['ID'])) . ' sqft in #' . ($location_city = Utils::get_single_term('location_city', $property['ID'])) . ' on @RedDoorCompany at ' . get_the_permalink()) ?>"></a>
      <a class="icon-wpproperty-social-linkedin-symbol" target="_blank" href="https://www.linkedin.com/shareArticle?mini=true&url=<?php echo urlencode(get_the_permalink()); ?>&title=<?php echo urlencode($bedrooms . ' bed ' . $bathrooms . ' bath ' . $total_living_area . ' sqft in #' . $location_city); ?>&summary=<?php (!empty($property['automated_property_detail_description'])) ? urlencode($property['automated_property_detail_description']) : '' ?>&source=Red%20Door%20Company"></a>
    </p>
    <p class="visEmail"><span><?php _e('or send via email'); ?></span></p>
    <script>
      jQuery(document).ready(function(){
        jQuery('#sharingEmail').keyup(function(){
          var value = jQuery(this).val();
          jQuery('.goShare').attr('href', 'mailto:' + value + '?subject=<?php echo $bedrooms . ' bed ' . $bathrooms . ' bath ' . $total_living_area . ' sqft in ' . $location_city . '&body=' . ( !empty($property['automated_property_detail_description']) ? $property['automated_property_detail_description'] : '' )  . "%0A%0ACheck%20it%20out%20at%20" . get_the_permalink() ?>');
        });
      });
    </script>
    <input type="email" placeholder="enter email address" id="sharingEmail" />
    <a class="goShare" target="_blank" href="mailto:YOUR_MAIL?subject=<?php echo $bedrooms . ' bed ' . $bathrooms . ' bath ' . $total_living_area . ' sqft in ' . $location_city . '&body=' . $property['automated_property_detail_description'] . '%0ACheck%20it%20out%20at%20' . get_the_permalink(); ?>"><?php _e('Send Email', 'reddoor') ?></a>
  </div>

  <div class="rdc-agents-carousel-container">

    <div class="rdc-agents-carousel-wrapper">

      <?php

        switch( Utils::get_single_term( 'sale_type', $property['ID'], 'slug' ) ) {

          case 'rent':

            if ( $agent = Utils::get_matched_agent( Utils::get_single_term( 'listing_agent_id', $property['ID'] ), false, array(), 'mls_rent_id' ) ) {

              ?>

              <ul class="rdc-agents-carousel-items">

              <?php

                echo '<li class="rdc-agents-carousel-item">';

                $image_ids = get_user_meta($agent->ID, 'agent_images', true);

                $user_data = get_userdata($agent->ID);

                if (!empty($image_ids[0])) {
                  $imageId = $image_ids[0];
                }

                echo wp_get_attachment_image($imageId, 'agent_card') . '</br>';

                echo '<h3>' . $user_data->display_name . '</h3>';

                echo '<span>'.__('Red Door Company', 'reddoor').'</span>';

                echo '<div class="oneAgentLinksBlock showContactPopup"><a href="javascript:;" rel="popupContactUsMore">'.__('Request Information', 'reddoor').'</a></div></li>';

              ?>

              </ul>

              <?php

            } else {

              ?>


              <style>
                a[rel="popupContactUsMore"] {
                  display: none !important;
                }
                button[rel="popupContactUsMore"] {
                  display: none !important;
                }
              </style>

              <ul class="rdc-agents-carousel-items" style="padding-top: 20px;">

                <?php

                $_phone = Utils::get_single_term( 'listing_agent_phone_number', $property['ID'] );

                $_phone = !empty( $_phone ) ?
                    $_phone :
                    Utils::get_single_term( 'listing_office_phone_number', $property['ID'] );

                echo '<li class="rdc-agents-carousel-item">';

                echo '<h3>' . Utils::get_single_term( 'listing_agent_first_name', $property['ID'] ) . ' ' . Utils::get_single_term( 'listing_agent_last_name', $property['ID'] ) . '</h3>';

                echo '<span>'. Utils::get_multiple_terms( 'listing_office', $property['ID'], 'name', 'a'  ) .'</span>';

                echo '<span>'. $_phone .'</span>';

                //echo '<div class="oneAgentLinksBlock showContactPopup"><a href="javascript:;" rel="popupContactUsMore">'.__('Request Information', 'reddoor').'</a></div></li>';

                ?>

              </ul>

              <?php

            }

            break;

          case 'sale':

            if ( $agent = Utils::get_matched_agent( Utils::get_single_term( 'listing_agent_id', $property['ID'] ), false, array(), 'mls_sale_id' ) ) {

              ?>

              <ul class="rdc-agents-carousel-items">

                <?php

                  echo '<li class="rdc-agents-carousel-item">';

                  $image_ids = get_user_meta($agent->ID, 'agent_images', true);

                  $user_data = get_userdata($agent->ID);

                  if (!empty($image_ids[0])) {
                    $imageId = $image_ids[0];
                  }

                  echo wp_get_attachment_image($imageId, 'agent_card') . '</br>';

                  echo '<h3>' . $user_data->display_name . '</h3>';

                  echo '<span>'.__('Red Door Company', 'reddoor').'</span>';

                  echo '<div class="oneAgentLinksBlock showContactPopup"><a href="javascript:;" rel="popupContactUsMore">'.__('Request Information', 'reddoor').'</a></div></li>';

                ?>

              </ul>

              <?php

            } else {

              ?>

              <div class="rdc-agents-carousel-title">

                <a href="#" class="rdc-agents-carousel-previous" title="Previous"></a>

                <a href="#" class="rdc-agents-carousel-next" title="Next"></a>

              </div>

              <ul class="rdc-agents-carousel-items">

                <?php

                  $usersAgentsObjects = get_users(array('role' => 'agent'));

                  shuffle($usersAgentsObjects);

                  foreach ($usersAgentsObjects as $userAgentId) {

                    echo '<li class="rdc-agents-carousel-item">';

                    $image_ids = get_user_meta($userAgentId->ID, 'agent_images', true);

                    $user_data = get_userdata($userAgentId->ID);

                    if (!empty($image_ids[0])) {
                      $imageId = $image_ids[0];
                    }

                    echo wp_get_attachment_image($imageId, 'agent_card') . '</br>';

                    echo '<h3>' . $user_data->display_name . '</h3>';

                    echo '<span>'.__('Red Door Company', 'reddoor').'</span>';

                    echo '<div class="oneAgentLinksBlock showContactPopup"><a href="javascript:;" rel="popupContactUsMore">'.__('Request Information', 'reddoor').'</a></div></li>';

                  }
                ?>

              </ul>

              <?php

            }

            break;

          default: break;
        }

      ?>

    </div>

  </div>

</div>