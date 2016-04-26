<div class="popupRentHome popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <i class="icon icon-rdc-home-renting"></i>

      <h3><?php _e('I want to rent a home', 'reddoor'); ?></h3>
      <p><?php _e('Please submit your information below. We\'re ready to help you find the perfect rental home!', 'reddoor'); ?></p>

      <!-- action="<?php echo home_url() ?>?rdc_action=submit_form" -->

      <form id="powf_32455D6F7216E411811D6C3BE5A87DF0_" class=""
            enctype="multipart/form-data"
            action="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_32455D6F7216E411811D6C3BE5A87DF0&tver=2013&c=1"
            method="post">

        <!-- <input type="hidden" name="rdc_fyb" value="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_32455D6F7216E411811D6C3BE5A87DF0&tver=2013&c=1" /> -->

        <div class="field">
          <input required placeholder="First Name *" type="text" id="powf_a6af030d7316e411811d6c3be5a87df0" name="powf_a6af030d7316e411811d6c3be5a87df0" value=""
                 maxlength="100" class="required"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input required placeholder="Last Name *" type="text" id="powf_401e17337316e411811d6c3be5a87df0" name="powf_401e17337316e411811d6c3be5a87df0" value=""
                 maxlength="100" class="required"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input required placeholder="Telephone *" type="text" id="powf_1ac7bf437416e411811d6c3be5a87df0" name="powf_1ac7bf437416e411811d6c3be5a87df0" value=""
                 maxlength="100" class="required digits"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input required placeholder="Email *" type="text" id="powf_ab9ba0647416e411811d6c3be5a87df0" name="powf_ab9ba0647416e411811d6c3be5a87df0" value=""
                 maxlength="100" class="required email"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Available Times to Show" type="text" id="powf_472852a40118e411bcfc6c3be5a8dd60" name="powf_472852a40118e411bcfc6c3be5a8dd60" value=""
                 maxlength="100"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Target Move In Date" type="text" id="powf_131a927d0218e411bcfc6c3be5a8dd60" name="powf_131a927d0218e411bcfc6c3be5a8dd60" value=""
                 maxlength="100" class="date"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <textarea placeholder="Comments/Questions" id="powf_c12b19e00118e411bcfc6c3be5a8dd60" name="powf_c12b19e00118e411bcfc6c3be5a8dd60" cols=""
              rows=""></textarea>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Pet Info" type="text" id="powf_c37884fd0118e411bcfc6c3be5a8dd60" name="powf_c37884fd0118e411bcfc6c3be5a8dd60" value=""
                 maxlength="100"/>
          <div class="clear"></div>
        </div>

        <!-- Origin -->
        <input type="hidden" id="powf_d7ce13400318e411bcfc6c3be5a8dd60" name="powf_d7ce13400318e411bcfc6c3be5a8dd60"
               value="Tenant"/>

        <!-- Lead Source -->
        <input type="hidden" id="powf_72de01e26d6fe411807f6c3be5a87df0" name="powf_72de01e26d6fe411807f6c3be5a87df0"
               value="RedDoorCompany.com"/>

        <!-- tver -->
        <input type="hidden" id="tver" name="tver" value="2013"/>
        <input type="hidden" name="ignore_submitmessage" value="<?php _e('Thank you. We will be in touch with you shortly.', 'reddoor'); ?>"/>
        <input type="hidden" name="ignore_linkbuttontext" value=""/>
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('success'); ?>"/>
        <input type="hidden" name="ignore_redirectmode" value="Auto"/>

        <?php $recaptcha = get_theme_mod( 'rdc_recaptcha_key' ); if( !empty( $recaptcha ) ) : ?>
          <div id="schedule-showing-recaptcha" class="recaptcha"></div>
          <script>
            jQuery(window).load(function(){
              grecaptcha.render('schedule-showing-recaptcha', {'sitekey' : '<?php echo $recaptcha; ?>'});
            });
          </script>
        <?php endif; ?>

        <div align="center">
          <input class="button" type="submit" value="Send"
                 onclick="javascript:;"/>
        </div>
      </form>

      <script type="text/javascript">
        jQuery(document).ready(function () {
          jQuery.extend(jQuery.validator.messages, {

            email:"Please enter a valid email address. Make sure there are no leading or trailing spaces."
          });

          jQuery("#powf_32455D6F7216E411811D6C3BE5A87DF0_").validate({
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

          jQuery("#powf_131a927d0218e411bcfc6c3be5a8dd60").datepicker();

          jQuery("#powf_32455D6F7216E411811D6C3BE5A87DF0_").submit(function(e){
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