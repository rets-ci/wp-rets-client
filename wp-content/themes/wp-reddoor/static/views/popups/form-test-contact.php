<div class="popupTestContact popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <i class="icon icon-rdc-buy"></i>

      <h3><?php _e('Test contact', 'reddoor'); ?></h3>
      <p><?php _e('Buy your dream home on your terms! Please submit your information below or call us by phone. We’re ready to assist you with your new home purchase.', 'reddoor'); ?></p>

      <input readonly class="hidden-phone" type="tel" data-label="Buy Inquiry Call" data-phone="919-321-0128 x2" value="919-XXX-XXXX" />
      <span class="clickToView"><?php _e('click to view the full number'); ?></span>

			<form id="test-contact-form" class="form-validate" action="<?php echo get_rest_url( null, '/crm/v1/form/submit/'); ?>" method="post">

        <div class="field">
          <input placeholder="Email *" type="text" name="rdc_test_91ac4542bf16e61180e9c4346bace2d4" value="" maxlength="100" class="required email" />
          <div class="clear"></div>
        </div>

        <div class="field">
          <select name="rdc_test_7bdf7695bf16e61180e9c4346bace2d4">
            <option value="" selected="selected" disabled="disabled">Area of Interest</option>
            <option value="Triangle Area">Triangle Area</option>
            <option value="Durham Area">Durham Area</option>
            <option value="Chapel Hill Area">Chapel Hill Area</option>
            <option value="Raleigh Area">Raleigh Area</option>
            <option value="Other">Other</option>
          </select>
          <div class="clear"></div>
        </div>

        <div class="field">
          <textarea placeholder="Message" name="rdc_test_c79126adbf16e61180e9c4346bace2d4"></textarea>
          <div class="clear"></div>
        </div>
        
        <input type="hidden" name="rdc_test_98ef9eccbf16e61180e9c4346bace2d4" value="Buyer General" />
        <input type="hidden" name="rdc_test_bce1ec13c016e61180e9c4346bace2d4" value="" />
        
        <input type="hidden" name="ignore_submitmessage" value="Thank you. We will be in touch with you shortly." />
        <input type="hidden" name="ignore_linkbuttontext" value="" />
        <input type="hidden" name="ignore_redirecturl" value="<?php echo home_url('/buy/inquiry-success'); ?>" />
        <input type="hidden" name="ignore_redirectmode" value="Auto" />
        
        <div class="field g-recaptcha">
        </div>

        <div class="submit-wrapper">
          <input class="button" type="submit" value="Send" />
        </div>

      </form>
      
    </div>
  </div>
</div>