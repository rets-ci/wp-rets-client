<div class="popupSellHome popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/sellHome.png" alt="" />
      <h3>I want to sell a home</h3>
      <p>Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming.</p>
      <input id="phone" type="tel" placeholder="919-321-0128 x2" />
      <span class="clickToView">click to view the full number</span>

      <!-- action="<?php echo home_url() ?>?rdc_action=submit_form" -->

      <form id="powf_33C92B8F04DBE5118114C4346BB5981C"
            enctype="multipart/form-data" class="contact_form"
            action="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_33C92B8F04DBE5118114C4346BB5981C&tver=2013&c=1"
            method="post">

        <!-- <input type="hidden" name="rdc_fyb" value="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_33C92B8F04DBE5118114C4346BB5981C&tver=2013&c=1" /> -->

        <div class="field">
          <input placeholder="First Name *" type="text" id="powf_ae80c09604dbe5118114c4346bb5981c" name="powf_ae80c09604dbe5118114c4346bb5981c" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Last Name *" type="text" id="powf_b080c09604dbe5118114c4346bb5981c" name="powf_b080c09604dbe5118114c4346bb5981c" value="" maxlength="50" class="required" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input type="text" placeholder="Email Address *" id="powf_bb80c09604dbe5118114c4346bb5981c" name="powf_bb80c09604dbe5118114c4346bb5981c" value="" maxlength="100" class="required email" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Mobile Number" type="text" id="powf_bc80c09604dbe5118114c4346bb5981c" name="powf_bc80c09604dbe5118114c4346bb5981c" value="" maxlength="20" class="digits" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Business Phone" type="text" id="powf_c480c09604dbe5118114c4346bb5981c" name="powf_c480c09604dbe5118114c4346bb5981c" value="" maxlength="100" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Street 1" type="text" id="powf_c780c09604dbe5118114c4346bb5981c" name="powf_c780c09604dbe5118114c4346bb5981c" value="" maxlength="250" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Street 2" type="text" id="powf_c980c09604dbe5118114c4346bb5981c" name="powf_c980c09604dbe5118114c4346bb5981c" value="" maxlength="250" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="City" type="text" id="powf_d480c09604dbe5118114c4346bb5981c" name="powf_d480c09604dbe5118114c4346bb5981c" value="" maxlength="80" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="State" type="text" id="powf_d580c09604dbe5118114c4346bb5981c" name="powf_d580c09604dbe5118114c4346bb5981c" value="" maxlength="50" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Zip/Postal Code" type="text" id="powf_d880c09604dbe5118114c4346bb5981c" name="powf_d880c09604dbe5118114c4346bb5981c" value="" maxlength="20" class="digits" />
          <div class="clear"></div>
        </div>

        <div class="clear"></div>

        <!-- Origin -->
        <input type="hidden" id="powf_ac80c09604dbe5118114c4346bb5981c" name="powf_ac80c09604dbe5118114c4346bb5981c" value="Seller" />
        <!-- topic -->
        <input type="hidden" id="powf_d780c09604dbe5118114c4346bb5981c" name="powf_d780c09604dbe5118114c4346bb5981c" value="Seller Webform Lead" />

        <input type="hidden" name="ignore_submitmessage" value="" />
        <input type="hidden" name="ignore_linkbuttontext" value="" />
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('success'); ?>" />
        <input type="hidden" name="ignore_redirectmode" value="Auto" />

        <?php $recaptcha = get_theme_mod( 'rdc_recaptcha_key' ); if( !empty( $recaptcha ) ) : ?>
          <div class="recaptcha" id="home-selling-recaptcha"></div>
          <script type="text/javascript">
            jQuery(window).load(function(){
              grecaptcha.render('home-selling-recaptcha', {'sitekey' : '<?php echo $recaptcha; ?>'});
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

          jQuery("#powf_33C92B8F04DBE5118114C4346BB5981C").validate({
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

          jQuery("#powf_33C92B8F04DBE5118114C4346BB5981C").submit(function(e){
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