<div class="popupManage popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <i class="icon icon-rdc-property-management"></i>

      <h3><?php _e('I want to rent my property', 'reddoor'); ?></h3>
      <p><?php _e('Grow your investment with Red Door Company! Please submit your information below or call us by phone. We\'re ready to assist you with renting your property.', 'reddoor'); ?></p>
      <input readonly class="hidden-phone" type="tel" data-phone="919-321-0128 x210" value="919-XXX-XXXX" />
      <span class="clickToView"><?php _e('click to view the full number','reddoor'); ?></span>

      <form id="powf_E3E9D503C22EE41195286C3BE5BD3B20"
            class="form-validate"
            action="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&amp;formId=powf_E3E9D503C22EE41195286C3BE5BD3B20&amp;tver=2013&amp;c=1"
            enctype="multipart/form-data" method="post" novalidate="novalidate">

        <!-- <input type="hidden" name="rdc_fyb" value="https://cloud.crm.powerobjects.net/powerWebFormV3/PowerWebFormData.aspx?t=CCGr6i%2b2CU2A1Z%2bLiVlRh28AcgBnADAANQAyADkANwBlAGYAZAA%3d&amp;formId=powf_E3E9D503C22EE41195286C3BE5BD3B20&amp;tver=2013&amp;c=1" /> -->

        <div class="field">
          <input placeholder="First Name *" id="powf_8f29ad3ac22ee41195286c3be5bd3b20" class="required" maxlength="100"
                                  name="powf_8f29ad3ac22ee41195286c3be5bd3b20" type="text" value=""/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Last Name *" id="powf_85a66052c22ee41195286c3be5bd3b20" class="required" maxlength="100"
                                  name="powf_85a66052c22ee41195286c3be5bd3b20" type="text" value=""/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Email *" id="powf_217c2869c22ee41195286c3be5bd3b20" class="required email" maxlength="100"
                                  name="powf_217c2869c22ee41195286c3be5bd3b20" type="text" value=""/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Telephone *" id="powf_83a17082c22ee41195286c3be5bd3b20" class="required digits" maxlength="100"
                                  name="powf_83a17082c22ee41195286c3be5bd3b20" type="text" value=""/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Property Address 1 *" id="powf_518481d4c22ee41195286c3be5bd3b20" class="required" maxlength="100"
                                  name="powf_518481d4c22ee41195286c3be5bd3b20" type="text" value=""/>
          <div class="clear"></div>
        </div>

        <div class="field">
          <input placeholder="Property Address 2" id="powf_c9cea6f0c22ee41195286c3be5bd3b20" maxlength="100" name="powf_c9cea6f0c22ee41195286c3be5bd3b20"
                 type="text" value=""/>
        </div>

        <div class="field">
          <input placeholder="City" id="powf_f5e36104c32ee41195286c3be5bd3b20" maxlength="100" name="powf_f5e36104c32ee41195286c3be5bd3b20"
                 type="text" value=""/>
        </div>

        <div class="field">
          <input placeholder="State" id="powf_3bb30615c32ee41195286c3be5bd3b20" maxlength="100" name="powf_3bb30615c32ee41195286c3be5bd3b20"
                 type="text" value=""/>
        </div>

        <div class="field">
          <input placeholder="Zip" id="powf_5f60502bc32ee41195286c3be5bd3b20" maxlength="100" name="powf_5f60502bc32ee41195286c3be5bd3b20"
                 type="text" value=""/>
        </div>

        <div class="field">
          <textarea placeholder="Questions/Comments" id="powf_672f7c42c32ee41195286c3be5bd3b20" name="powf_672f7c42c32ee41195286c3be5bd3b20"></textarea>
        </div>

        <div class="field">
            <input placeholder="Referred By" type="text" id="powf_0f6b0f271b41e51180fbc4346bace18c" name="powf_0f6b0f271b41e51180fbc4346bace18c" value="" maxlength="100" />
        </div>

        <input id="powf_097a475ac32ee41195286c3be5bd3b20" name="powf_097a475ac32ee41195286c3be5bd3b20" type="hidden"
               value="Owner"/>
        <input id="powf_5e9a8095f35ae411afef6c3be5a87df0" name="powf_5e9a8095f35ae411afef6c3be5a87df0" type="hidden"
               value="RedDoorCompany.com"/>
        <input name="ignore_submitmessage" type="hidden" value="Thank you. We will be in touch with you shortly."/>
        <input name="ignore_linkbuttontext" type="hidden" value=""/>
        <input name="ignore_redirecturl" type="hidden" value="<?php echo home_url('/management/inquiry-success'); ?>"/>
        <input name="ignore_redirectmode" type="hidden" value="Auto"/>

        <?php $recaptcha = get_theme_mod( 'rdc_recaptcha_key' ); if( !empty( $recaptcha ) ) : ?>
          <div class="recaptcha" id="prospect-landlord-recaptcha"></div>
          <script>
            jQuery(window).load(function(){
              grecaptcha.render('prospect-landlord-recaptcha', {'sitekey' : '<?php echo $recaptcha; ?>'});
            });
          </script>
        <?php endif; ?>

        <div><input class="button" type="submit" value="Submit"/></div>
      </form>

    </div>
  </div>
</div>