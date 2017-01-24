<div class="popupFormRentApplication popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <i class="icon icon-rdc-rent"></i>

      <h3><?php _e('Request an Application', 'reddoor'); ?></h3>
      <p><?php _e('You found your new home - that\'s great! Please request an application using the below form.', 'reddoor'); ?></p>

	    <form id="powf_280C1763D278E5118103C4346BB5981C" class="form-validate" action="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_280C1763D278E5118103C4346BB5981C&tver=2013&c=1" method="post">

        <div class="field">
          <input placeholder="First Name *" type="text" id="powf_c4351aadd278e5118103c4346bb5981c" name="powf_c4351aadd278e5118103c4346bb5981c" value="" maxlength="100" class="required"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Last Name *" type="text" id="powf_a1965bbcd278e5118103c4346bb5981c" name="powf_a1965bbcd278e5118103c4346bb5981c" value="" maxlength="100" class="required"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Phone" type="text" id="powf_af1302ced278e5118103c4346bb5981c" name="powf_af1302ced278e5118103c4346bb5981c" value="" maxlength="100" class="digits"/>
					<div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Email *" type="text" id="powf_a37268efd278e5118103c4346bb5981c" name="powf_a37268efd278e5118103c4346bb5981c" value="" maxlength="100" class="required email"/>
					<div class="clear"></div>
        </div>

        <div class="clear"></div>

        <?php global $property; ?>

        <?php if ( isset( $property['ID'] ) ): ?>
          <!-- MLS ID -->
          <input type="hidden" id="powf_24557afbd278e5118103c4346bb5981c" name="powf_24557afbd278e5118103c4346bb5981c" value="<?php echo \UsabilityDynamics\RDC\Utils::get_single_term( 'mls_id', $property['ID'] ); ?>" />
        <?php endif; ?>

        <!-- Origin -->
        <input type="hidden" id="powf_90922908d378e5118103c4346bb5981c" name="powf_90922908d378e5118103c4346bb5981c" value="App Request"/>

        <?php if( isset( $property ) && isset( $property['location_address'] ) ) : ?>
        	<!-- Property Address Text -->
        	<input type="hidden" id="powf_42f86616d378e5118103c4346bb5981c" name="powf_42f86616d378e5118103c4346bb5981c" value="<?php echo esc_attr($property['location_address']); ?>" />
        <?php endif; ?>

        <?php if( $property && isset( $property['ID'] ) ) :
					$agent = \UsabilityDynamics\RDC\Utils::get_matched_agent( \UsabilityDynamics\RDC\Utils::get_single_term( 'listing_agent_id', $property['ID'] ), false, array(), 'triangle_mls_id' );
        ?>
        
        <?php if( isset( $agent ) && is_object( $agent ) && isset( $agent->user_email ) ) { ?>
          <!-- Brokers Email -->
          <input type="hidden" id="powf_2e230323d378e5118103c4346bb5981c" name="powf_2e230323d378e5118103c4346bb5981c" value="<?php echo esc_attr( $agent->user_email ); ?>" />
        <?php } ?>
        <?php endif; ?>

        <input type="hidden" name="ignore_submitmessage" value="<?php _e('Thank you. We will be in touch with you shortly.', 'reddoor'); ?>"/>
        <input type="hidden" name="ignore_linkbuttontext" value=""/>
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('/rent/application-success'); ?>"/>
        <input type="hidden" name="ignore_redirectmode" value="Auto"/>

        <div class="field g-recaptcha"></div>

        <div>
          <input class="button" type="submit" value="Submit" onclick="javascript:;"/>
        </div>
        
      </form>
      
      <!-- form-rent-application.php -->

    </div>
  </div>
</div>