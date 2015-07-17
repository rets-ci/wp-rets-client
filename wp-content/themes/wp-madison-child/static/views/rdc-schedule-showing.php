<script src="https://cloud.crm.powerobjects.net/powerWebFormV3/scripts/jquery-1.9.0.validate.min.js" type="text/javascript"></script>
<script src="https://cloud.crm.powerobjects.net/powerWebFormV3/scripts/jquery-ui-1.8.17.custom.min.js" type="text/javascript"></script>

<form id="powf_32455D6F7216E411811D6C3BE5A87DF0" class=""
      enctype="multipart/form-data"
      action="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_32455D6F7216E411811D6C3BE5A87DF0&tver=2013&c=1"
      method="post">

  <div class="label">
    <label for="powf_a6af030d7316e411811d6c3be5a87df0">First Name</label>
    <span class="required">*</span>
    <span class="tip"></span>
  </div>

  <div class="field">
    <input type="text" id="powf_a6af030d7316e411811d6c3be5a87df0" name="powf_a6af030d7316e411811d6c3be5a87df0" value=""
           maxlength="100" class="required"/>

  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_401e17337316e411811d6c3be5a87df0">Last Name</label>
    <span class="required">*</span>
    <span class="tip"></span>

  </div>

  <div class="field">
    <input type="text" id="powf_401e17337316e411811d6c3be5a87df0" name="powf_401e17337316e411811d6c3be5a87df0" value=""
           maxlength="100" class="required"/>
  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_1ac7bf437416e411811d6c3be5a87df0">Telephone</label>
    <span class="required">*</span>
    <span class="tip"></span>

  </div>

  <div class="field">
    <input type="text" id="powf_1ac7bf437416e411811d6c3be5a87df0" name="powf_1ac7bf437416e411811d6c3be5a87df0" value=""
           maxlength="100" class="required digits"/>

  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_ab9ba0647416e411811d6c3be5a87df0">Email</label>
    <span class="required">*</span>
    <span class="tip"></span>

  </div>

  <div class="field">
    <input type="text" id="powf_ab9ba0647416e411811d6c3be5a87df0" name="powf_ab9ba0647416e411811d6c3be5a87df0" value=""
           maxlength="100" class="required email"/>

  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_472852a40118e411bcfc6c3be5a8dd60">Available Times to Show</label>
    <span class="tip"></span>

  </div>

  <div class="field">
    <input type="text" id="powf_472852a40118e411bcfc6c3be5a8dd60" name="powf_472852a40118e411bcfc6c3be5a8dd60" value=""
           maxlength="100"/>

  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_131a927d0218e411bcfc6c3be5a8dd60">Target Move In Date</label>
    <span class="tip"></span>

  </div>

  <div class="field">
    <input type="text" id="powf_131a927d0218e411bcfc6c3be5a8dd60" name="powf_131a927d0218e411bcfc6c3be5a8dd60" value=""
           maxlength="100" class="date"/>

  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_c12b19e00118e411bcfc6c3be5a8dd60">Comments/Questions</label>
    <span class="tip"></span>

  </div>

  <div class="field">
    <textarea id="powf_c12b19e00118e411bcfc6c3be5a8dd60" name="powf_c12b19e00118e411bcfc6c3be5a8dd60" cols=""
              rows=""></textarea>

  </div>

  <div class="clear"></div>
  <div class="label">
    <label for="powf_c37884fd0118e411bcfc6c3be5a8dd60">Pet Info</label>
    <span class="tip"></span>

  </div>

  <div class="field">
    <input type="text" id="powf_c37884fd0118e411bcfc6c3be5a8dd60" name="powf_c37884fd0118e411bcfc6c3be5a8dd60" value=""
           maxlength="100"/>

  </div>

  <?php
    global $property;
    if ( !empty( $property ) ) :
  ?>
      <?php
        if( !empty( $property['wpp_agents'] ) && class_exists( 'class_agents' ) ):
          $agent_data = get_userdata($property['wpp_agents'][0]);
      ?>
        <!-- Broker -->
        <input type="hidden" id="powf_fc06a4670318e411bcfc6c3be5a8dd60" name="powf_fc06a4670318e411bcfc6c3be5a8dd60"
               value="<?php echo esc_attr( $agent_data->user_email ); ?>"/>
      <?php endif; ?>

      <?php if ( !empty( $property['address'] ) ): ?>
      <!-- Property Address -->
      <input type="hidden" id="powf_9b14049e0318e411bcfc6c3be5a8dd60" name="powf_9b14049e0318e411bcfc6c3be5a8dd60"
             value="<?php echo esc_attr( $property['address'] ); ?>"/>
      <?php endif; ?>

      <?php if ( !empty( $property['mls_number'] ) ): ?>
      <!-- MLS ID -->
      <input type="hidden" id="powf_c7e7e0c3a424e5118103fc15b4289e3c" name="powf_c7e7e0c3a424e5118103fc15b4289e3c"
             value="<?php echo esc_attr( $property['mls_number'] ); ?>"/>
      <?php endif; ?>
  <?php
    endif;
  ?>

  <div class="clear"></div>
  <!-- Origin -->
  <input type="hidden" id="powf_d7ce13400318e411bcfc6c3be5a8dd60" name="powf_d7ce13400318e411bcfc6c3be5a8dd60"
         value="Tenant"/>
  <!-- Lead Source -->
  <input type="hidden" id="powf_72de01e26d6fe411807f6c3be5a87df0" name="powf_72de01e26d6fe411807f6c3be5a87df0"
         value="RedDoorCompany.com"/>
  <!-- tver -->
  <input type="hidden" id="tver" name="tver" value="2013"/>
  <input type="hidden" name="ignore_submitmessage" value=""/>
  <input type="hidden" name="ignore_linkbuttontext" value=""/>
  <input type="hidden" name="ignore_redirecturl" value="http://www.reddoorcompany.com/form-submitted/"/>
  <input type="hidden" name="ignore_redirectmode" value="Auto"/>

  <div align="center">
    <input class="button" type="submit" value="Request Showing"
           onclick="javascript:;"/>
  </div>
</form>

<script type="text/javascript">
  jQuery(document).ready(function () {
    jQuery.extend(jQuery.validator.messages, {

      email:"Please enter a valid email address. Make sure there are no leading or trailing spaces."
    });

    jQuery("#powf_32455D6F7216E411811D6C3BE5A87DF0").validate({
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
  });

</script>