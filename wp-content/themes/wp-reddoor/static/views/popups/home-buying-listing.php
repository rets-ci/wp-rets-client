<div class="popupBuyHomeListing popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <i class="icon icon-rdc-home-buying"></i>

      <h3><?php _e('I want to buy a home', 'reddoor'); ?></h3>
      <p><?php _e('Buy your dream home on your terms! Please submit your information below or call us by phone. We’re ready to assist you with your new home purchase.', 'reddoor'); ?></p>
      <input readonly class="hidden-phone" type="tel" data-phone="919-321-0128 x2" value="919-XXX-XXXX" />
      <span class="clickToView"><?php _e('click to view the full number'); ?></span>

      <!-- action="<?php echo home_url() ?>?rdc_action=submit_form" -->

      <form id="powf_C15751CDFBE9E511811AFC15B42886E8"
            enctype="multipart/form-data" class="contact_form"
            action="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_C15751CDFBE9E511811AFC15B42886E8&tver=2013&c=1"
            method="post">

        <!-- <input type="hidden" name="rdc_fyb" value="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_C15751CDFBE9E511811AFC15B42886E8&tver=2013&c=1" /> -->

        <div class="field">
          <input placeholder="First Name *" type="text" id="powf_b54a0bf0e3d0e511811bc4346bad461c" name="powf_b54a0bf0e3d0e511811bc4346bad461c" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Last Name *" type="text" id="powf_4ff9760ee4d0e511811bc4346bad461c" name="powf_4ff9760ee4d0e511811bc4346bad461c" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Email Address *" type="text" id="powf_8f564241e4d0e511811bc4346bad461c" name="powf_8f564241e4d0e511811bc4346bad461c" value="" maxlength="100" class="required email" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Phone" type="text" id="powf_3aff73d9fbe9e511811afc15b42886e8" name="powf_3aff73d9fbe9e511811afc15b42886e8" value="" maxlength="20" class="digits" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <textarea placeholder="Comments" id="powf_b62d13821a12e61180e4fc15b428cd78" name="powf_b62d13821a12e61180e4fc15b428cd78" cols="" rows=""></textarea>
          <div class="clear"></div>
        </div>

        <div class="clear"></div>

        <?php global $property;

        if( $property && isset( $property['ID'] ) ) {

          $usersAgentsObjects = get_users(array('role' => 'agent'));

          foreach ($usersAgentsObjects as $userAgent) {

            if ( $agent_types = get_user_meta( $userAgent->ID, 'sale_type', 1 ) ) {
              $_types = explode(', ', $agent_types);
              if ( !in_array( 'Sale', $_types ) ) continue;
            }

            if (!get_user_meta($userAgent->ID, 'triangle_mls_id', 1)) continue;
            $agent = $userAgent;
          }

        } else {
          $agent = null;
        }
        ?>

        <!-- Origin -->
        <input type="hidden" id="powf_35ff73d9fbe9e511811afc15b42886e8" name="powf_35ff73d9fbe9e511811afc15b42886e8" value="Buyer" />
        <!-- topic -->
        <input type="hidden" id="powf_44ff73d9fbe9e511811afc15b42886e8" name="powf_44ff73d9fbe9e511811afc15b42886e8" value="Buyer Webform Lead" />

        <?php if( $property && isset( $property['location_address'] ) ) { ?>
        <!-- Property Address -->
        <input type="hidden" id="powf_fc8e60252af8e51180e2fc15b4286ffc" name="powf_fc8e60252af8e51180e2fc15b4286ffc" value="<?php echo $property['location_address']; ?>" />
        <?php } ?>

        <?php if( $agent ) { ?>
          <!-- Broker Email -->
        <input type="hidden" class="rdc-listing-broker-email" id="powf_36ff73d9fbe9e511811afc15b42886e8" name="powf_36ff73d9fbe9e511811afc15b42886e8" value="<?php echo $agent->user_email; ?>" />
        <?php } ?>

        <?php if( isset( $property['ID'] ) ) { ?>
        <!-- MLS ID -->
        <input type="hidden" id="powf_a0fb31f729f8e51180e2fc15b4286ffc" name="powf_a0fb31f729f8e51180e2fc15b4286ffc" value="<?php echo \UsabilityDynamics\RDC\Utils::get_single_term( 'mls_id', $property['ID'] ); ?>" />
        <?php } ?>

        <input type="hidden" name="ignore_submitmessage" value="" />
        <input type="hidden" name="ignore_linkbuttontext" value="" />
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('/rent/inquiry-success'); ?>" />
        <input type="hidden" name="ignore_redirectmode" value="Auto" />

        <?php $recaptcha = get_theme_mod( 'rdc_recaptcha_key' ); if( !empty( $recaptcha ) ) : ?>
          <div class="recaptcha" id="home-buying-recaptcha"></div>
          <script type="text/javascript">
            jQuery(window).load(function(){
              grecaptcha.render('home-buying-recaptcha', {'sitekey' : '<?php echo $recaptcha; ?>'});
            });
          </script>
        <?php endif; ?>

        <div class="submit-wrapper">
          <input class="button" type="submit" value="Send" />
        </div>

      </form>

      <script type="text/javascript">
        jQuery(document).ready(function () {
          jQuery.extend(jQuery.validator.messages, {

            email:"Please enter a valid email address. Make sure there are no leading or trailing spaces."
          });

          jQuery("#powf_C15751CDFBE9E511811AFC15B42886E8").validate({
            errorPlacement: function(error, element) {
              error.appendTo( element.parents("div.field:first").find("div.clear:first") );
            },

            invalidHandler: function(event, validator) {
              var errors = validator.numberOfInvalids();
              if (errors) {
                jQuery("input[type=submit]").removeAttr("disabled");
              }
            },
            onfocusout: false,
            onkeyup: false,
            onclick: false,
            debug: false
          });

          jQuery("#powf_C15751CDFBE9E511811AFC15B42886E8").submit(function(e){
            if ( typeof grecaptcha == 'undefined' ) return true;
            var rresult = grecaptcha.getResponse();
            if( !rresult.length > 0 ) {
              return false;
            }
            return true;
          });

        });

      </script>

    </div>
  </div>
</div>