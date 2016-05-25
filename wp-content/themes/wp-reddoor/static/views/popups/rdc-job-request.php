<form id="powf_905AF33FD6D1E511810FC4346BACE18C"
      class="form-validate"
      enctype="multipart/form-data"
      action="<?php echo home_url() ?>?rdc_action=submit_form"
      method="post"
      class="contact_form">

  <input type="hidden" name="rdc_fyb" value="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_905AF33FD6D1E511810FC4346BACE18C&tver=2013&c=1" />

  <div class="label">
    <label for="powf_351e0689d6d1e511810fc4346bace18c">First Name</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_351e0689d6d1e511810fc4346bace18c" name="powf_351e0689d6d1e511810fc4346bace18c" value="" maxlength="100" class="required" />
  </div>

  <div class="label">
    <label for="powf_58bb03a2d6d1e511810fc4346bace18c">Last Name</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_58bb03a2d6d1e511810fc4346bace18c" name="powf_58bb03a2d6d1e511810fc4346bace18c" value="" maxlength="100" class="required" />
  </div>

  <div class="label">
    <label for="powf_e70b12cad6d1e511810fc4346bace18c">Email</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_e70b12cad6d1e511810fc4346bace18c" name="powf_e70b12cad6d1e511810fc4346bace18c" value="" maxlength="100" class="required email" />
  </div>

  <div class="label">
    <label for="powf_7352d601d7d1e511810fc4346bace18c">Telephone</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_7352d601d7d1e511810fc4346bace18c" name="powf_7352d601d7d1e511810fc4346bace18c" value="" maxlength="100" class="required digits" />
  </div>

  <div class="label">
    <label for="powf_abf61434d7d1e511810fc4346bace18c">City</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_abf61434d7d1e511810fc4346bace18c" name="powf_abf61434d7d1e511810fc4346bace18c" value="" maxlength="100" class="required" />
  </div>

  <div class="label">
    <label for="powf_63a6a346d7d1e511810fc4346bace18c">State</label>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_63a6a346d7d1e511810fc4346bace18c" name="powf_63a6a346d7d1e511810fc4346bace18c" value="NC" maxlength="100" />
  </div>

  <div class="label">
    <label for="powf_f9726b7ed7d1e511810fc4346bace18c">License #</label>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_f9726b7ed7d1e511810fc4346bace18c" name="powf_f9726b7ed7d1e511810fc4346bace18c" value="" maxlength="100" />
  </div>

  <div class="label">
    <label for="powf_666689c1d7d1e511810fc4346bace18c">Job Interest <font class="required">*</font></label>
    <span class="tip"></span>
  </div>

  <div class="field">
    <select id="powf_666689c1d7d1e511810fc4346bace18c" name="powf_666689c1d7d1e511810fc4346bace18c" class="required">
      <option value=""></option>
      <option value="Sales Broker">Sales Broker</option>
      <option value="Property Manager">Property Manager</option>
    </select>
  </div>

  <!-- URL -->
  <input type="hidden" id="powf_8e5f38f8d7d1e511810fc4346bace18c" name="powf_8e5f38f8d7d1e511810fc4346bace18c" value="" />
  <div class="label">
    <label for="powf_183a105923d4e5118112c4346bb5981c">Resume</label>
    <span class="tip">PDF Only</span>
    <div class="clear"></div>
  </div>

  <div class="field">
    <input id="powf_183a105923d4e5118112c4346bb5981c" name="powf_183a105923d4e5118112c4346bb5981c"  type="file"   class="file" maxsize="1024" fileextension="pdf"  />
    <div class="clear"></div>
  </div>

  <div class="clear"></div>
  <input type="hidden" name="ignore_submitmessage" value="Thank you for your submission." />
  <input type="hidden" name="ignore_linkbuttontext" value="" />
  <input type="hidden" name="ignore_redirecturl" value="" />
  <input type="hidden" name="ignore_redirectmode" value="Auto" />

  <?php $recaptcha = get_theme_mod( 'rdc_recaptcha_key' ); if( !empty( $recaptcha ) ) : ?>
    <div class="recaptcha" id="job-form-recaptcha"></div>
    <script>
      jQuery(window).load(function(){
        grecaptcha.render('job-form-recaptcha', {'sitekey' : '<?php echo $recaptcha; ?>'});
      });
    </script>
  <?php endif; ?>

  <div>
    <input class="button" type="submit" value="Submit"/>
  </div>
</form>
