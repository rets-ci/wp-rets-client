<div class="popupGeneralContact popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <i class="icon icon-rdc-who-we-are"></i>

      <h3><?php _e( 'I have a different question', 'reddoor' ); ?></h3>
      <p><?php _e( 'Please submit your information below or call us by phone. We\'re ready to assist you with your real estate matters!', 'reddoor' ); ?></p>
      <input readonly class="hidden-phone" type="tel" data-phone="(919)321-0128 X0" value="(919)-XXX-XXXX" />
      <span class="clickToView"><?php _e('click to view the full number','reddoor'); ?></span>

      <form id="powf_95350A21BE5BE411AFEF6C3BE5A87DF0" class="left" enctype="multipart/form-data" action="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_95350A21BE5BE411AFEF6C3BE5A87DF0&tver=2013&c=1" method="post">
        <div class="field">
          <input placeholder="First Name" type="text" id="powf_f8c1dc41be5be411afef6c3be5a87df0" name="powf_f8c1dc41be5be411afef6c3be5a87df0" value="" maxlength="100" class="required"/>
          <div class="clear"></div>
        </div>
        <div class="field">
          <input type="text" placeholder="Last Name" id="powf_fb0203a8be5be411afef6c3be5a87df0" name="powf_fb0203a8be5be411afef6c3be5a87df0" value="" maxlength="100" class="required"/>
          <div class="clear"></div>
        </div>
        <div class="field">
          <input placeholder="Email" type="text" id="powf_8f6505c7be5be411afef6c3be5a87df0" name="powf_8f6505c7be5be411afef6c3be5a87df0" value="" maxlength="100" class="required email"/>
          <div class="clear"></div>
        </div>
        <div class="field">
          <input type="text" placeholder="Phone" id="powf_4382f4e7be5be411afef6c3be5a87df0" name="powf_4382f4e7be5be411afef6c3be5a87df0" value="" maxlength="100" class="digits"/>
          <div class="clear"></div>
        </div>
        <div class="clear"></div>
        <div class="label hidden">
          <label for="powf_b1db5f05bf5be411afef6c3be5a87df0" style="color: #777;margin-top: 0.5em;padding: 0;font-size: 1.5em;font-weight: 100;">Message</label>
        </div>
        <div class="field">
          <textarea placeholder="Message" id="powf_b1db5f05bf5be411afef6c3be5a87df0" name="powf_b1db5f05bf5be411afef6c3be5a87df0" cols="" rows="" style="padding:1em;"></textarea>
          <div class="clear"></div>
        </div>

        <input type="hidden" id="powf_5ffe4125bf5be411afef6c3be5a87df0" name="powf_5ffe4125bf5be411afef6c3be5a87df0" value="General"/>
        <input type="hidden" id="powf_0953b84abf5be411afef6c3be5a87df0" name="powf_0953b84abf5be411afef6c3be5a87df0" value="RedDoorCompany.com"/>
        <input type="hidden" id="tver" name="tver" value="2013"/>
        <input type="hidden" name="ignore_submitmessage" value="Thank you.  We will be in touch with you shortly."/>
        <input type="hidden" name="ignore_linkbuttontext" value=""/>
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('/about/inquiry-success'); ?>" />
        <input type="hidden" name="ignore_redirectmode" value="Auto"/>
        <div align="center">
          <input class="button" type="submit" value="Submit" />
        </div>
      </form>

      <script type="text/javascript">
  jQuery( document ).ready( function () {
    jQuery.extend( jQuery.validator.messages, {
      email: "Please enter a valid email address. Make sure there are no leading or trailing spaces."
    } );

    jQuery( "#powf_95350A21BE5BE411AFEF6C3BE5A87DF0" ).validate( {
      errorPlacement: function ( error, element ) {
        error.appendTo( element.parents( "div.field:first" ).find( "div.clear:first" ) );
      },

      invalidHandler: function ( event, validator ) {
        var errors = validator.numberOfInvalids();
        if( errors ) {
          jQuery( "input[type=submit]" ).removeAttr( "disabled" );
        }
      },
      onfocusout: false,
      onkeyup: false,
      onclick: false,
      debug: false
    } );
  } );

</script>

    </div>
  </div>
</div>