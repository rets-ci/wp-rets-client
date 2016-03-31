<!--  <script src="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/scripts/jquery-1.7.1.min.js" type="text/javascript"></script>-->
<!--  <script src="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/scripts/jquery-1.9.0.validate.min.js" type="text/javascript"></script>-->
<!--  <script src="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/scripts/jquery-ui-1.8.17.custom.min.js" type="text/javascript"></script>-->
<!--  <link href="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/styles/style.css" rel="stylesheet" type="text/css" />-->
<!--  <link href="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/styles/redmond/jquery-ui-1.8.17.custom.css" rel="stylesheet" type="text/css" />-->

<div class="rdc-home-buying-form">

  <form id="powf_450E34B3E2D0E511810FC4346BACE18C"
      enctype="multipart/form-data" class="contact_form"
      action="<?php echo home_url() ?>?rdc_action=submit_form"
        method="post">

    <input type="hidden" name="rdc_fyb" value="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_450E34B3E2D0E511810FC4346BACE18C&tver=2013&c=1" />

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
      <input placeholder="Mobile Number" type="text" id="powf_2b1d2365e5d0e511811bc4346bad461c" name="powf_2b1d2365e5d0e511811bc4346bad461c" value="" maxlength="20" class="digits" />
      <div class="clear"></div>
    </div>

    <div class="field">
      <input placeholder="Business Phone" type="text" id="powf_5efbf5a7e5d0e511811bc4346bad461c" name="powf_5efbf5a7e5d0e511811bc4346bad461c" value="" maxlength="100" />
      <div class="clear"></div>
    </div>

    <div class="field">
      <input placeholder="Street 1" type="text" id="powf_70988014e6d0e511811bc4346bad461c" name="powf_70988014e6d0e511811bc4346bad461c" value="" maxlength="250" />
      <div class="clear"></div>
    </div>

    <div class="field">
      <input placeholder="Street 2" type="text" id="powf_d99ca226e6d0e511811bc4346bad461c" name="powf_d99ca226e6d0e511811bc4346bad461c" value="" maxlength="250" />
      <div class="clear"></div>
    </div>

    <div class="field">
      <input placeholder="City" type="text" id="powf_050d155de6d0e511811bc4346bad461c" name="powf_050d155de6d0e511811bc4346bad461c" value="" maxlength="80" />
      <div class="clear"></div>
    </div>

    <div class="field">
      <input placeholder="State" type="text" id="powf_07fa8b81e6d0e511811bc4346bad461c" name="powf_07fa8b81e6d0e511811bc4346bad461c" value="" maxlength="50" />
      <div class="clear"></div>
    </div>

    <div class="field">
      <input placeholder="Zip/Postal Code" type="text" id="powf_564749ace6d0e511811bc4346bad461c" name="powf_564749ace6d0e511811bc4346bad461c" value="" maxlength="20" class="digits" />
      <div class="clear"></div>
    </div>

    <div class="clear"></div>
    <!-- Broker Email -->
    <input type="hidden" id="powf_d28844b2e3d0e511811bc4346bad461c" name="powf_d28844b2e3d0e511811bc4346bad461c" value="" />
    <!-- topic -->
    <input type="hidden" id="powf_66904e2d02dbe5118114c4346bb5981c" name="powf_66904e2d02dbe5118114c4346bb5981c" value="Buyer (General) Webform Lead" />
    <!-- Origin -->
    <input type="hidden" id="powf_1440818ee3d0e511811bc4346bad461c" name="powf_1440818ee3d0e511811bc4346bad461c" value="Buyer General" />

    <input type="hidden" name="ignore_submitmessage" value="" />
    <input type="hidden" name="ignore_linkbuttontext" value="" />
    <input type="hidden" name="ignore_redirecturl" value="" />
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