<script src="https://cloud.crm.powerobjects.net/powerWebFormV3/scripts/jquery-1.9.0.validate.min.js"
        type="text/javascript"></script>
<script src="https://cloud.crm.powerobjects.net/powerWebFormV3/scripts/jquery-ui-1.8.17.custom.min.js"
        type="text/javascript"></script>

<form id="powf_E3E9D503C22EE41195286C3BE5BD3B20" class=""
      action="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&amp;formId=powf_E3E9D503C22EE41195286C3BE5BD3B20&amp;tver=2013&amp;c=1"
      enctype="multipart/form-data" method="post" novalidate="novalidate">

  <!----------------->
  <div class="label">
    <label for="powf_8f29ad3ac22ee41195286c3be5bd3b20">First Name</label>
    <span class="required">*</span>
  </div>
  <div class="field"><input id="powf_8f29ad3ac22ee41195286c3be5bd3b20" class="required" maxlength="100"
                            name="powf_8f29ad3ac22ee41195286c3be5bd3b20" type="text" value=""/>
  </div>
  <!----------------->

  <div class="label">
    <label for="powf_85a66052c22ee41195286c3be5bd3b20">Last Name</label>
    <span class="required">*</span>
  </div>
  <div class="field"><input id="powf_85a66052c22ee41195286c3be5bd3b20" class="required" maxlength="100"
                            name="powf_85a66052c22ee41195286c3be5bd3b20" type="text" value=""/><br/>
  </div>

  <!----------------->


  <div class="label">
    <label for="powf_217c2869c22ee41195286c3be5bd3b20">Email</label>
    <span class="required">*</span>
  </div>
  <div class="field"><input id="powf_217c2869c22ee41195286c3be5bd3b20" class="required email" maxlength="100"
                            name="powf_217c2869c22ee41195286c3be5bd3b20" type="text" value=""/>
  </div>

  <!----------------->

  <div class="label">
    <label for="powf_83a17082c22ee41195286c3be5bd3b20">Telephone</label>
    <span class="required">*</span>
  </div>
  <div class="field"><input id="powf_83a17082c22ee41195286c3be5bd3b20" class="required digits" maxlength="100"
                            name="powf_83a17082c22ee41195286c3be5bd3b20" type="text" value=""/>
  </div>

  <!----------------->

  <div class="label">
    <label for="powf_518481d4c22ee41195286c3be5bd3b20">Property Address 1</label>
    <span class="required">*</span>
  </div>
  <div class="field"><input id="powf_518481d4c22ee41195286c3be5bd3b20" class="required" maxlength="100"
                            name="powf_518481d4c22ee41195286c3be5bd3b20" type="text" value=""/>

  </div>

  <!----------------->

  <div class="label">
    <label for="powf_c9cea6f0c22ee41195286c3be5bd3b20">Property Address 2</label>
  </div>
  <div class="field">
    <input id="powf_c9cea6f0c22ee41195286c3be5bd3b20" maxlength="100" name="powf_c9cea6f0c22ee41195286c3be5bd3b20"
              type="text" value=""/>
  </div>

  <!----------------->

  <div class="label">
    <label for="powf_f5e36104c32ee41195286c3be5bd3b20">City</label>
  </div>
  <div class="field">
    <input id="powf_f5e36104c32ee41195286c3be5bd3b20" maxlength="100" name="powf_f5e36104c32ee41195286c3be5bd3b20"
              type="text" value=""/>
  </div>

  <!----------------->

  <div class="label">
    <label for="powf_3bb30615c32ee41195286c3be5bd3b20">State</label>
  </div>
  <div class="field">
    <input id="powf_3bb30615c32ee41195286c3be5bd3b20" maxlength="100" name="powf_3bb30615c32ee41195286c3be5bd3b20"
              type="text" value=""/>
  </div>

  <!----------------->

  <div class="label">
    <label for="powf_5f60502bc32ee41195286c3be5bd3b20">Zip</label>
  </div>
  <div class="field">
    <input id="powf_5f60502bc32ee41195286c3be5bd3b20" maxlength="100" name="powf_5f60502bc32ee41195286c3be5bd3b20"
              type="text" value=""/>
  </div>

  <!----------------->

  <div class="label">
    <label for="powf_672f7c42c32ee41195286c3be5bd3b20">Questions/Comments</label>
  </div>
  <div class="field">
    <textarea id="powf_672f7c42c32ee41195286c3be5bd3b20" cols="" name="powf_672f7c42c32ee41195286c3be5bd3b20"
                 rows=""></textarea>
  </div>

  <!----------------->

  <input id="powf_097a475ac32ee41195286c3be5bd3b20" name="powf_097a475ac32ee41195286c3be5bd3b20" type="hidden"
         value="Owner"/>
  <input id="powf_5e9a8095f35ae411afef6c3be5a87df0" name="powf_5e9a8095f35ae411afef6c3be5a87df0" type="hidden"
         value="RedDoorCompany.com"/>
  <input id="tver" name="tver" type="hidden" value="2013"/>

  <input name="ignore_submitmessage" type="hidden" value="Thank you. We will be in touch with you shortly."/>
  <input name="ignore_linkbuttontext" type="hidden" value=""/>
  <input name="ignore_redirecturl" type="hidden" value="http://www.reddoorcompany.com/success/landlord/"/>
  <input name="ignore_redirectmode" type="hidden" value="Auto"/>

  <?php $recaptcha = get_theme_mod( 'rdc_recaptcha_key' ); if( !empty( $recaptcha ) ) : ?>
    <div class="g-recaptcha" data-sitekey="<?php echo $recaptcha; ?>"></div>
  <?php endif; ?>

  <div align="center"><input class="button" type="submit" value="Submit"/></div>
</form>

<script type="text/javascript">
  jQuery(document).ready(function () {
    jQuery.extend(jQuery.validator.messages, {

      email: "Please enter a valid email address. Make sure there are no leading or trailing spaces."
    });

    jQuery("#powf_E3E9D503C22EE41195286C3BE5BD3B20").validate({
      errorPlacement: function (error, element) {
        error.appendTo(element.parents("div.field:first").find("div.clear:first"));
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

    jQuery("#powf_E3E9D503C22EE41195286C3BE5BD3B20").submit(function(e){
      var rresult = grecaptcha.getResponse();
      if( !rresult.length > 0 ) {
        return false;
      }
      return true;
    });
  });

</script>