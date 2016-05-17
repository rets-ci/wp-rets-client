<div class="popupRentHome popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <i class="icon icon-rdc-home-renting"></i>

      <h3><?php _e('I want to rent a home', 'reddoor'); ?></h3>
      <p><?php _e('Please submit your information below. We\'re ready to help you find the perfect rental home!', 'reddoor'); ?></p>

      <form id="powf_D138DC53B916E61180E9C4346BACE2D4-global" enctype="multipart/form-data" action="https://pocloudcentral.crm.powerobjects.net/PowerWebForm/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&formId=powf_D138DC53B916E61180E9C4346BACE2D4&tver=2013&c=1" method="post">

        <div class="field">
          <input required placeholder="First Name *" type="text" id="powf_fafb666fb916e61180e9c4346bace2d4" name="powf_fafb666fb916e61180e9c4346bace2d4" value="" maxlength="100" class="required"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input required placeholder="Last Name *" type="text" id="powf_dca1df84b916e61180e9c4346bace2d4" name="powf_dca1df84b916e61180e9c4346bace2d4" value="" maxlength="100" class="required"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input required placeholder="Telephone *" type="text" id="powf_1ac7bf437416e411811d6c3be5a87df0" name="powf_9fdf6ce7ba16e61180e9c4346bace2d4" value="" maxlength="100" class="required digits"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input required placeholder="Email *" type="text" id="powf_ab9ba0647416e411811d6c3be5a87df0" name="powf_1686e84dbb16e61180e9c4346bace2d4" value="" maxlength="100" class="required email"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <label for="powf_0981b910bc16e61180e9c4346bace2d4">Area Of Interest</label>
          <select id="powf_0981b910bc16e61180e9c4346bace2d4" name="powf_0981b910bc16e61180e9c4346bace2d4">
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
          <label for="powf_625ecfcdbb16e61180e9c4346bace2d4">Driven By</label> <br />
          <input id="powf_625ecfcdbb16e61180e9c4346bace2d40" name="powf_625ecfcdbb16e61180e9c4346bace2d4" type="radio" value="Yes"/><label for="powf_625ecfcdbb16e61180e9c4346bace2d40" class="lab_radio">Yes</label> <br />
          <input id="powf_625ecfcdbb16e61180e9c4346bace2d41" name="powf_625ecfcdbb16e61180e9c4346bace2d4" type="radio" value="No"/><label for="powf_625ecfcdbb16e61180e9c4346bace2d41" class="lab_radio">No</label>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Available Times to Show" type="text" id="powf_ed13baf1bb16e61180e9c4346bace2d4" name="powf_ed13baf1bb16e61180e9c4346bace2d4" value="" maxlength="100"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Target Move In Date" type="text" id="powf_131a927d0218e411bcfc6c3be5a8dd60" name="powf_131a927d0218e411bcfc6c3be5a8dd60" value="" maxlength="100" class="date"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Pet Info" type="text" id="powf_7063c18bbc16e61180e9c4346bace2d4" name="powf_7063c18bbc16e61180e9c4346bace2d4" value="" maxlength="100"/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <textarea placeholder="Comments/Questions" id="powf_7e1aec73bc16e61180e9c4346bace2d4" name="powf_7e1aec73bc16e61180e9c4346bace2d4" cols="" rows=""></textarea>
          <div class="clear"></div>
        </div>

        <!-- Origin -->
        <input type="hidden" id="powf_c189f7c7bc16e61180e9c4346bace2d4" name="powf_c189f7c7bc16e61180e9c4346bace2d4" value="Tenant"/>

        <!-- Lead Source -->
        <input type="hidden" id="powf_1298204ebd16e61180e9c4346bace2d4" name="powf_1298204ebd16e61180e9c4346bace2d4" value="RedDoorCompany.com"/>

        <!-- tver -->
        <input type="hidden" id="tver" name="tver" value="2013"/>
        <input type="hidden" name="ignore_submitmessage" value="<?php _e('Thank you. We will be in touch with you shortly.', 'reddoor'); ?>"/>
        <input type="hidden" name="ignore_linkbuttontext" value=""/>
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('/rent/inquiry-success'); ?>"/>
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

          jQuery("#powf_D138DC53B916E61180E9C4346BACE2D4-global").validate({
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

          jQuery("#powf_D138DC53B916E61180E9C4346BACE2D4-global").submit(function(e){
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