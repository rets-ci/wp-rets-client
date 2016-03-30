<form id="powf_95350A21BE5BE411AFEF6C3BE5A87DF0"
      enctype="multipart/form-data"
      action="<?php echo home_url() ?>?rdc_action=submit_form"
      method="post"
      class="contact_form">

  <input type="hidden" name="rdc_fyb" value="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_95350A21BE5BE411AFEF6C3BE5A87DF0&tver=2013&c=1" />

  <div class="label">
    <label for="powf_f8c1dc41be5be411afef6c3be5a87df0">First Name</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_f8c1dc41be5be411afef6c3be5a87df0" name="powf_f8c1dc41be5be411afef6c3be5a87df0"
           value="" maxlength="100" class="required"/>

  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_fb0203a8be5be411afef6c3be5a87df0">Last Name</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_fb0203a8be5be411afef6c3be5a87df0" name="powf_fb0203a8be5be411afef6c3be5a87df0"
           value="" maxlength="100" class="required"/>

  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_8f6505c7be5be411afef6c3be5a87df0">Email</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_8f6505c7be5be411afef6c3be5a87df0" name="powf_8f6505c7be5be411afef6c3be5a87df0"
           value="" maxlength="100" class="required email"/>

  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_4382f4e7be5be411afef6c3be5a87df0">Phone</label>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_4382f4e7be5be411afef6c3be5a87df0" name="powf_4382f4e7be5be411afef6c3be5a87df0"
           value="" maxlength="100" class="digits"/>
  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_b1db5f05bf5be411afef6c3be5a87df0">Message/Comments</label>
    <span class="tip"></span>
  </div>

  <div class="field">
              <textarea id="powf_b1db5f05bf5be411afef6c3be5a87df0" name="powf_b1db5f05bf5be411afef6c3be5a87df0" cols=""
                        rows=""></textarea>
  </div>

  <div class="clear"></div>
  <!-- Origin -->
  <input type="hidden" id="powf_5ffe4125bf5be411afef6c3be5a87df0" name="powf_5ffe4125bf5be411afef6c3be5a87df0"
         value="General"/>
  <!-- Lead Source -->
  <input type="hidden" id="powf_0953b84abf5be411afef6c3be5a87df0" name="powf_0953b84abf5be411afef6c3be5a87df0"
         value="RedDoorCompany.com"/>
  <!-- tver -->
  <input type="hidden" id="tver" name="tver" value="2013"/>
  <input type="hidden" name="ignore_submitmessage" value="Thank you. We will be in touch with you shortly."/>
  <input type="hidden" name="ignore_linkbuttontext" value=""/>
  <input type="hidden" name="ignore_redirecturl" value="http://www.reddoorcompany.com/success/contact/"/>
  <input type="hidden" name="ignore_redirectmode" value="Auto"/>

  <?php $recaptcha = get_theme_mod( 'rdc_recaptcha_key' ); if( !empty( $recaptcha ) ) : ?>
    <div class="recaptcha" id="contact-form-recaptcha"></div>
    <script>
      jQuery(window).load(function(){
        grecaptcha.render('contact-form-recaptcha', {'sitekey' : '<?php echo $recaptcha; ?>'});
      });
    </script>
  <?php endif; ?>

  <div>
    <input class="button" type="submit" value="Submit"/>
  </div>
</form>

<script type="text/javascript">
  jQuery(document).ready(function () {
    jQuery.extend(jQuery.validator.messages, {

      email: "Please enter a valid email address. Make sure there are no leading or trailing spaces."
    });

    jQuery("#powf_95350A21BE5BE411AFEF6C3BE5A87DF0").validate({
      errorPlacement: function (error, element) {
        error.appendTo(element.parents("div.field:first"));
      },

      invalidHandler: function (event, validator) {
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

    jQuery("#powf_95350A21BE5BE411AFEF6C3BE5A87DF0").submit(function(e){
      var rresult = grecaptcha.getResponse();
      if( !rresult.length > 0 ) {
        return false;
      }
      return true;
    });
  });

</script>