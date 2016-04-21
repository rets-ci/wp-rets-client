<div class="popupBuyHomeListing popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/buyHome.png" alt="" />
      <h3>I want to buy a home</h3>
      <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming.</p>
      <input id="phone" type="tel" placeholder="919-321-0128 x2" />
      <span class="clickToView">click to view the full number</span>

      listing

      <!-- action="<?php echo home_url() ?>?rdc_action=submit_form" -->

      <form id="powf_C15751CDFBE9E511811AFC15B42886E8"
            enctype="multipart/form-data" class="contact_form"
            action="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_C15751CDFBE9E511811AFC15B42886E8&tver=2013&c=1"
            method="post">

        <!-- <input type="hidden" name="rdc_fyb" value="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_C15751CDFBE9E511811AFC15B42886E8&tver=2013&c=1" /> -->

        <div class="field">
          <input placeholder="First Name *" type="text" id="powf_37ff73d9fbe9e511811afc15b42886e8" name="powf_37ff73d9fbe9e511811afc15b42886e8" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Last Name *" type="text" id="powf_38ff73d9fbe9e511811afc15b42886e8" name="powf_38ff73d9fbe9e511811afc15b42886e8" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Email Address *" type="text" id="powf_39ff73d9fbe9e511811afc15b42886e8" name="powf_39ff73d9fbe9e511811afc15b42886e8" value="" maxlength="100" class="required email" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Mobile Number" type="text" id="powf_3aff73d9fbe9e511811afc15b42886e8" name="powf_3aff73d9fbe9e511811afc15b42886e8" value="" maxlength="20" class="digits" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Business Phone" type="text" id="powf_3dff73d9fbe9e511811afc15b42886e8" name="powf_3dff73d9fbe9e511811afc15b42886e8" value="" maxlength="100" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Street 1" type="text" id="powf_3eff73d9fbe9e511811afc15b42886e8" name="powf_3eff73d9fbe9e511811afc15b42886e8" value="" maxlength="250" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Street 2" type="text" id="powf_3fff73d9fbe9e511811afc15b42886e8" name="powf_3fff73d9fbe9e511811afc15b42886e8" value="" maxlength="250" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="City" type="text" id="powf_41ff73d9fbe9e511811afc15b42886e8" name="powf_41ff73d9fbe9e511811afc15b42886e8" value="" maxlength="80" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="State" type="text" id="powf_42ff73d9fbe9e511811afc15b42886e8" name="powf_42ff73d9fbe9e511811afc15b42886e8" value="" maxlength="50" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Zip/Postal Code" type="text" id="powf_46ff73d9fbe9e511811afc15b42886e8" name="powf_46ff73d9fbe9e511811afc15b42886e8" value="" maxlength="20" class="digits" />
          <div class="clear"></div>
        </div>

        <div class="clear"></div>

        <!-- Origin -->
        <input type="hidden" id="powf_35ff73d9fbe9e511811afc15b42886e8" name="powf_35ff73d9fbe9e511811afc15b42886e8" value="Buyer" />
        <!-- topic -->
        <input type="hidden" id="powf_44ff73d9fbe9e511811afc15b42886e8" name="powf_44ff73d9fbe9e511811afc15b42886e8" value="Buyer Webform Lead" />
        <!-- Property Address -->
        <input type="hidden" id="powf_fc8e60252af8e51180e2fc15b4286ffc" name="powf_fc8e60252af8e51180e2fc15b4286ffc" value="" />
        <!-- Broker Email -->
        <input type="hidden" id="powf_36ff73d9fbe9e511811afc15b42886e8" name="powf_36ff73d9fbe9e511811afc15b42886e8" value="" />
        <!-- MLS ID -->
        <input type="hidden" id="powf_a0fb31f729f8e51180e2fc15b4286ffc" name="powf_a0fb31f729f8e51180e2fc15b4286ffc" value="" />

        <input type="hidden" name="ignore_submitmessage" value="" />
        <input type="hidden" name="ignore_linkbuttontext" value="" />
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('success'); ?>" />
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