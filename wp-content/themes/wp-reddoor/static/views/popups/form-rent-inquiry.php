<div class="popupFormRentInquiry popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">
      
      <i class="icon icon-rdc-rent"></i>

      <h3><?php _e('I want to rent a home', 'reddoor'); ?></h3>
      <p><?php _e('Please submit your information below. We\'re ready to help you find the perfect rental home!', 'reddoor'); ?></p>

	    <form id="powf_D138DC53B916E61180E9C4346BACE2D4" class="form-validate" enctype="multipart/form-data" action="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_D138DC53B916E61180E9C4346BACE2D4&tver=2013&c=1" method="post">

        <div class="field">
          <input required placeholder="First Name *" type="text" id="powf_fafb666fb916e61180e9c4346bace2d4" name="powf_fafb666fb916e61180e9c4346bace2d4" value="" maxlength="50" class="required"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input required placeholder="Last Name *" type="text" id="powf_dca1df84b916e61180e9c4346bace2d4" name="powf_dca1df84b916e61180e9c4346bace2d4" value="" maxlength="50" class="required"/>
          <div class="clear"></div>
        </div>
        
        <div class="field">
          <input required placeholder="Email *" type="text" id="powf_1686e84dbb16e61180e9c4346bace2d4" name="powf_1686e84dbb16e61180e9c4346bace2d4" value="" maxlength="100" class="required email"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input required placeholder="Phone" type="text" id="powf_9fdf6ce7ba16e61180e9c4346bace2d4" name="powf_9fdf6ce7ba16e61180e9c4346bace2d4" value="" maxlength="50" class="digits"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <select id="powf_0981b910bc16e61180e9c4346bace2d4" name="powf_0981b910bc16e61180e9c4346bace2d4">
            <option value="" selected="selected" disabled="disabled">Area of Interest</option>
            <option value="Triangle Area">Triangle Area</option>
            <option value="Durham Area">Durham Area</option>
            <option value="Chapel Hill Area">Chapel Hill Area</option>
            <option value="Raleigh Area">Raleigh Area</option>
            <option value="Other">Other</option>
          </select>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Available Times to Show" type="text" id="powf_ed13baf1bb16e61180e9c4346bace2d4" name="powf_ed13baf1bb16e61180e9c4346bace2d4" value="" maxlength="100"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Target Move In Date" type="text" name="powf_ac668f2abc16e61180e9c4346bace2d4" value="" maxlength="100" class="date rdc-datepicker"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Pet Info" type="text" id="powf_7063c18bbc16e61180e9c4346bace2d4" name="powf_7063c18bbc16e61180e9c4346bace2d4" value="" maxlength="100"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <textarea placeholder="Message" id="powf_7e1aec73bc16e61180e9c4346bace2d4" name="powf_7e1aec73bc16e61180e9c4346bace2d4"></textarea>
          <div class="clear"></div>
        </div>


        <?php if ( is_singular('property') ){
        global $property;

        if( $property && isset( $property['ID'] ) ) {
          $agent = \UsabilityDynamics\RDC\Utils::get_matched_agent( \UsabilityDynamics\RDC\Utils::get_single_term( 'listing_agent_id', $property['ID'] ), false, array(), 'triangle_mls_id' );
        }
        ?>
        
         <?php if( isset( $property['ID'] ) ) { ?>
          <input type="hidden" id="powf_2315c462bd16e61180e9c4346bace2d4" name="powf_2315c462bd16e61180e9c4346bace2d4" value="<?php echo \UsabilityDynamics\RDC\Utils::get_single_term( 'mls_id', $property['ID'] ); ?>"/>
        <?php } } ?>

        <?php if( isset( $agent ) && is_object( $agent ) && isset( $agent->user_email ) ) { ?>
          <input type="hidden" id="powf_c1ffaf0dbd16e61180e9c4346bace2d4" name="powf_c1ffaf0dbd16e61180e9c4346bace2d4" value="<?php echo $agent->user_email; ?>"/>
        <?php } ?>

        <?php if( isset( $property ) && isset( $property['location_address'] ) ) { ?>
          <input type="hidden" id="powf_eb6e8f27bd16e61180e9c4346bace2d4" name="powf_eb6e8f27bd16e61180e9c4346bace2d4" value="<?php echo $property['location_address']; ?>"/>
        <?php } ?>
        
        <input type="hidden" id="powf_1298204ebd16e61180e9c4346bace2d4" name="powf_1298204ebd16e61180e9c4346bace2d4" value="reddoorcompany.com" />
        <input type="hidden" id="powf_341893afc01ee61180e4fc15b428cd78" name="powf_341893afc01ee61180e4fc15b428cd78" value="<? echo get_permalink(); ?>" />
        <input type="hidden" id="powf_c189f7c7bc16e61180e9c4346bace2d4" name="powf_c189f7c7bc16e61180e9c4346bace2d4" value="Tenant" />
        <input type="hidden" name="ignore_submitmessage" value="<?php _e('Thank you. We will be in touch with you shortly.', 'reddoor'); ?>"/>
        <input type="hidden" name="ignore_linkbuttontext" value=""/>
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('/rent/inquiry-success'); ?>"/>
        <input type="hidden" name="ignore_redirectmode" value="Auto"/>

        <div class="submit-wrapper">
          <input class="button" type="submit" value="Request Showing" />
        </div>

      </form>
      
      <!-- form-rent-inquiry.php -->

    </div>
  </div>
</div>