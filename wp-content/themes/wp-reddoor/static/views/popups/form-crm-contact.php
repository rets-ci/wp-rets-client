<div class="popupTestContact popup contact-popup" style="display: none;">
  <div class="popup-overlay"></div>
  <div class="popup-inner-wrapper">
    <span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
    <div class="popup-form-wrapper">

      <i class="icon icon-rdc-buy"></i>

      <h3><?php _e('Test contact', 'reddoor'); ?></h3>
      <p><?php _e('Buy your dream home on your terms!', 'reddoor'); ?></p>

      <input readonly class="hidden-phone" type="tel" data-label="Buy Inquiry Call" data-phone="919-321-0128 x2" value="919-XXX-XXXX" />

      <span class="clickToView"><?php _e('click to view the full number'); ?></span>

      <?php echo do_shortcode( '[wp_crm_form form=buy_a_home]' ); ?>

    </div>
  </div>
</div>