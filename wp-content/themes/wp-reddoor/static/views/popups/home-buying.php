<div class="popupBuyHome popup contact-popup" style="display: none;">
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

      <form id="powf_450E34B3E2D0E511810FC4346BACE18C"
            enctype="multipart/form-data" class="contact_form"
            action="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_450E34B3E2D0E511810FC4346BACE18C&tver=2013&c=1"
            method="post">

        <!-- <input type="hidden" name="rdc_fyb" value="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_450E34B3E2D0E511810FC4346BACE18C&tver=2013&c=1" /> -->

        <div class="field">
          <input placeholder="First Name *" type="text" id="powf_b8ba60f3be16e61180e9c4346bace2d4" name="powf_b8ba60f3be16e61180e9c4346bace2d4" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Last Name *" type="text" id="powf_a1a3591ebf16e61180e9c4346bace2d4" name="powf_a1a3591ebf16e61180e9c4346bace2d4" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Email Address *" type="text" id="powf_91ac4542bf16e61180e9c4346bace2d4" name="powf_8f564241e4d0e511811bc4346bad461c" value="" maxlength="100" class="required email" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Phone number" type="text" id="powf_59dd697ebf16e61180e9c4346bace2d4" name="powf_59dd697ebf16e61180e9c4346bace2d4" value="" maxlength="20" class="digits" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <label for="powf_7bdf7695bf16e61180e9c4346bace2d4">Area of Interest</label>
          <select id="powf_7bdf7695bf16e61180e9c4346bace2d4" name="powf_7bdf7695bf16e61180e9c4346bace2d4">
            <option value=""></option>
            <option selected="selected" value="Triangle Area">Triangle Area</option>
            <option value="Durham Area">Durham Area</option>
            <option value="Chapel Hill Area">Chapel Hill Area</option>
            <option value="Raleigh Area">Raleigh Area</option>
            <option value="Other">Other</option>
          </select>
          <div class="clear"></div>
        </div>

        <div class="field">
          <textarea placeholder="Comments" id="powf_c79126adbf16e61180e9c4346bace2d4" name="powf_c79126adbf16e61180e9c4346bace2d4" cols="" rows=""></textarea>
          <div class="clear"></div>
        </div>

        <div class="clear"></div>

        <!-- topic -->
        <input type="hidden" id="powf_66904e2d02dbe5118114c4346bb5981c" name="powf_66904e2d02dbe5118114c4346bb5981c" value="Buyer (General) Webform Lead" />
        <!-- Origin -->
        <input type="hidden" id="powf_1440818ee3d0e511811bc4346bad461c" name="powf_1440818ee3d0e511811bc4346bad461c" value="Buyer General" />

        <input type="hidden" name="ignore_submitmessage" value="" />
        <input type="hidden" name="ignore_linkbuttontext" value="" />
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('/buy/inquiry-success'); ?>" />
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

          jQuery("#powf_450E34B3E2D0E511810FC4346BACE18C").validate({
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

          jQuery("#powf_450E34B3E2D0E511810FC4346BACE18C").submit(function(e){
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