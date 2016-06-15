<div class="popupBuyHomeListing popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <i class="icon icon-rdc-buy"></i>

      <h3><?php _e('I want to buy a home', 'reddoor'); ?></h3>
      <p><?php _e('Buy your dream home on your terms! Please submit your information below or call us by phone. We’re ready to assist you with your new home purchase.', 'reddoor'); ?></p>
      <input readonly class="hidden-phone" type="tel" data-phone="919-321-0128 x2" value="919-XXX-XXXX" />
      <span class="clickToView"><?php _e('click to view the full number'); ?></span>

	    <form id="powf_C15751CDFBE9E511811AFC15B42886E8" class="form-validate" enctype="multipart/form-data" action="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_C15751CDFBE9E511811AFC15B42886E8&tver=2013&c=1" method="post">

        <div class="field">
          <input placeholder="First Name *" type="text" id="powf_37ff73d9fbe9e511811afc15b42886e8" name="powf_37ff73d9fbe9e511811afc15b42886e8" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Last Name *" type="text" id="powf_38ff73d9fbe9e511811afc15b42886e8" name="powf_38ff73d9fbe9e511811afc15b42886e8" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Email *" type="text" id="powf_71f56036c216e61180e9c4346bace2d4" name="powf_71f56036c216e61180e9c4346bace2d4" value="" maxlength="100" class="required email" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Phone" type="text" id="powf_3aff73d9fbe9e511811afc15b42886e8" name="powf_3aff73d9fbe9e511811afc15b42886e8" value="" maxlength="20" class="digits" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <textarea placeholder="Message" id="powf_b62d13821a12e61180e4fc15b428cd78" name="powf_b62d13821a12e61180e4fc15b428cd78"></textarea>
          <div class="clear"></div>
        </div>

        <?php global $property;
            $agent = UsabilityDynamics\RDC\Utils::get_matched_agent( \UsabilityDynamics\RDC\Utils::get_single_term( 'listing_agent_id', $property['ID'] ), false, array(), 'triangle_mls_id' );
        ?>

        <?php if( $property && isset( $property['location_address'] ) ) { ?>
        <input type="hidden" id="powf_fc8e60252af8e51180e2fc15b4286ffc" name="powf_fc8e60252af8e51180e2fc15b4286ffc" value="<?php echo $property['location_address']; ?>" />
        <?php } ?>

        <?php if( !empty($agent) ) { ?>
        <input type="hidden" class="rdc-listing-broker-email" id="powf_36ff73d9fbe9e511811afc15b42886e8" name="powf_36ff73d9fbe9e511811afc15b42886e8" value="<?php echo $agent->user_email; ?>" />
        <?php } ?>

        <?php if( isset( $property['ID'] ) ) { ?>
        <input type="hidden" id="powf_a0fb31f729f8e51180e2fc15b4286ffc" name="powf_a0fb31f729f8e51180e2fc15b4286ffc" value="<?php echo \UsabilityDynamics\RDC\Utils::get_single_term( 'mls_id', $property['ID'] ); ?>" />
        <?php } ?>

				<input type="hidden" id="powf_c7a4dd42d416e61180e6fc15b4286ffc" name="powf_c7a4dd42d416e61180e6fc15b4286ffc" value="reddoorcompany.com" />
        <input type="hidden" id="powf_35ff73d9fbe9e511811afc15b42886e8" name="powf_35ff73d9fbe9e511811afc15b42886e8" value="Buyer" />
        <input type="hidden" id="powf_44ff73d9fbe9e511811afc15b42886e8" name="powf_44ff73d9fbe9e511811afc15b42886e8" value="Buyer Webform Lead" />
        <input type="hidden" name="ignore_submitmessage" value="Thank you. We will be in touch with you shortly." />
        <input type="hidden" name="ignore_linkbuttontext" value="" />
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('/rent/inquiry-success'); ?>" />
        <input type="hidden" name="ignore_redirectmode" value="Auto" />

        <div class="submit-wrapper">
          <input class="button" type="submit" value="Request Showing" />
        </div>

      </form>
      
      <!-- home-buying-listing.php -->

    </div>
  </div>
</div>