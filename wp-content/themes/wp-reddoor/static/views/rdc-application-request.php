<?php
  global $property;
?>

<form id="powf_280C1763D278E5118103C4346BB5981C" class=""
      enctype="multipart/form-data"
      action="<?php echo home_url() ?>?rdc_action=submit_form"
      method="post">

  <input type="hidden" name="rdc_fyb" value="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_280C1763D278E5118103C4346BB5981C&tver=2013&c=1" />

  <div class="label">
    <label for="powf_c4351aadd278e5118103c4346bb5981c">First Name</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_c4351aadd278e5118103c4346bb5981c" name="powf_c4351aadd278e5118103c4346bb5981c" value=""
           maxlength="100" class="required"/>
    <div class="clear"></div>
  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_a1965bbcd278e5118103c4346bb5981c">Last Name</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_a1965bbcd278e5118103c4346bb5981c" name="powf_a1965bbcd278e5118103c4346bb5981c" value=""
           maxlength="100" class="required"/>
    <div class="clear"></div>
  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_af1302ced278e5118103c4346bb5981c">Phone</label>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_af1302ced278e5118103c4346bb5981c" name="powf_af1302ced278e5118103c4346bb5981c" value=""
           maxlength="100" class="digits"/>

    <div class="clear"></div>
  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_a37268efd278e5118103c4346bb5981c">Email</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_a37268efd278e5118103c4346bb5981c" name="powf_a37268efd278e5118103c4346bb5981c" value=""
           maxlength="100" class="required email"/>

    <div class="clear"></div>
  </div>

  <div class="clear"></div>

  <?php if ( get_post_meta( get_the_ID(), 'mls_number', true ) ): ?>
  <!-- MLS ID -->
  <input type="hidden" id="powf_24557afbd278e5118103c4346bb5981c" name="powf_24557afbd278e5118103c4346bb5981c"
         value="<?php echo get_post_meta( get_the_ID(), 'mls_number', true ); ?>"/>
  <?php endif; ?>

  <!-- Origin -->
  <input type="hidden" id="powf_90922908d378e5118103c4346bb5981c" name="powf_90922908d378e5118103c4346bb5981c"
         value="App Request"/>

  <?php if ( !empty( $property['location'] ) ): ?>
  <!-- Property Address Text -->
  <input type="hidden" id="powf_42f86616d378e5118103c4346bb5981c" name="powf_42f86616d378e5118103c4346bb5981c"
         value="<?php echo esc_attr($property['location']); ?>"/>
  <?php endif; ?>

  <?php
    if( !empty( $property['wpp_agents'] ) && class_exists( 'class_agents' ) ):
      $agent_data = get_userdata($property['wpp_agents'][0]);
  ?>
  <!-- Brokers Email -->
  <input type="hidden" id="powf_2e230323d378e5118103c4346bb5981c" name="powf_2e230323d378e5118103c4346bb5981c"
         value="<?php echo esc_attr( $agent_data->user_email ); ?>"/>
  <?php endif; ?>

  <input type="hidden" name="ignore_submitmessage" value="Thank you. We will be in touch with you shortly."/>
  <input type="hidden" name="ignore_linkbuttontext" value=""/>
  <input type="hidden" name="ignore_redirecturl" value="http://www.reddoorcompany.com/success/application"/>
  <input type="hidden" name="ignore_redirectmode" value="Auto"/>

  <?php $recaptcha = get_theme_mod( 'rdc_recaptcha_key' ); if( !empty( $recaptcha ) ) : ?>
    <div id="application-request-recaptcha" class="recaptcha"></div>
    <script>
      jQuery(window).load(function(){
        grecaptcha.render('application-request-recaptcha', {'sitekey' : '<?php echo $recaptcha; ?>'});
      });
    </script>
  <?php endif; ?>

  <div align="center">
    <input class="button" type="submit" value="Submit"
           onclick="javascript:;"/>
  </div>
</form>

<script type="text/javascript">
  jQuery(document).ready(function () {
    jQuery.extend(jQuery.validator.messages, {

      email: "Please enter a valid email address. Make sure there are no leading or trailing spaces."
    });

    jQuery("#powf_280C1763D278E5118103C4346BB5981C").validate({
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

    jQuery("#powf_280C1763D278E5118103C4346BB5981C").submit(function(e){
      if ( typeof grecaptcha == 'undefined' ) return true;
      var rresult = grecaptcha.getResponse();
      if( !rresult.length > 0 ) {
        return false;
      }
      return true;
    });
  });

</script>