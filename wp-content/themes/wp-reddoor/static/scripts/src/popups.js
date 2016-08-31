jQuery(function () {

  var popUpWindow = jQuery('span.exitPopup').parent().parent();

  jQuery('.showContactPopup > a, button.showContactPopup, a.showContactPopup').on('click', showContactPopup);

  jQuery('span.exitPopup').on('click', function () {
    jQuery(this).parent().parent().fadeOut(100);
    jQuery('html').css('overflow-y', 'scroll');
    return false;
  });

  jQuery('.popup-overlay').on('click', function () {
    jQuery(this).parent().fadeOut(100);
    jQuery('html').css('overflow-y', 'scroll');
    return false;
  });

  jQuery('body').keydown(function (eventObject) {
    if (eventObject.which == 27) {
      popUpWindow.fadeOut(100);
      jQuery('html').css('overflow-y', 'scroll');
    }
  });

  jQuery('.popup .hidden-phone').on('click', function () {
    //__gaTracker('send', 'event', 'calls', 'click', jQuery( this ).data('label'), jQuery( this ).data('phone') );
    __gaTracker('send', {
      hitType: 'event',
      eventCategory: 'calls',
      eventAction: 'click',
      eventLabel: jQuery(this).data('label'),
      //eventValue: jQuery( this ).data('phone'),
    });
    jQuery(this).val(jQuery(this).data('phone'));
  });

  /**
   *
   Substitution contact popups on careers page.
   *
   */

  setTimeout(function () {
    jQuery('.careers .headContact a').attr('href', '#popupCareersInquiry');
    jQuery('.careers .footerContact').data('action', 'popupCareersInquiry');
  }, 20);


  /**
   * Show Popup Box
   *
   * @param event
   * @returns {boolean}
   */
  function showContactPopup(event) {

    var that = this;

    var firsthref = jQuery(that).attr("href");
    if (typeof firsthref != 'undefined') {
      var lasthref = firsthref.substr(1);
    }
    var dataaction = jQuery(that).data("action");

    // prevent actual click from going through
    event.preventDefault();

    // determine type of action we're making with the click
    var _type = dataaction || lasthref;

    // renderRecaptcha(_type);

    jQuery('div.popup').fadeOut(300);
    jQuery('div.popup.' + _type).fadeIn(200);
    jQuery('html').css('overflow-y', 'hidden');

    return false;

  }

  //recaptcha forms handle
  window.recaptchaforms = [];

  function renderRecaptcha(type) {
    if ('popupFormBuyInquiry' == type) {
      grender("rdcgrecaptchahomebuy", type);
    } else if ('popupFormContactInquiry' == type) {
      grender("rdcgrecaptchacontactus", type);
    } else if ('popupFormCareerInquiry' == type) {
      grender("rdcgrecaptchacareer", type);
    } else if ('popupFormBuyInquiryListing' == type) {
      grender("rdcgrecaptchahomebuylisting", type);
    } else if ('popupFormManagementInquiry' == type) {
      grender("rdcgrecaptchahomemanagement", type);
    } else if ('popupFormRentInquiry' == type) {
      grender("rdcgrecaptchahomerenting", type);
    } else if ('popupFormSellInquiry' == type) {
      grender("rdcgrecaptchahomeselling", type);
    } else if ('popupFormRentApplication' == type) {
      grender("rdcgrecaptchareqapplication", type);
    } else if ('popupFormManagementReferral' == type) {
      grender("rdcgrecaptchamanagementreferral", type);
    }
  }

  /**
   * grecaptcha render
   * @param element
   * @param type
   * @returns {boolean}
   */
  function grender(element, type) {
    if (typeof grecaptcha == 'undefined') return true;
    var sitekey = 'object' === typeof popupMode && popupMode.recaptcha_key ? popupMode.recaptcha_key : '';
    grecaptcha.render(element, {
      'sitekey': sitekey,
    });
    window.recaptchaforms.push(type);
    debug("reCaptcha loaded" + type);
  }

  /**
   * Debug Helper
   *
   */
  function debug() {
    var _args = [].slice.call(arguments);
    // _args.unshift( 'jquery-search-form' );
    console.debug.apply(console, _args);
  }


});

/**
 * Reset captcha
 *
 * */
function resetCaptcha(container) {
  if (typeof grecaptcha == 'undefined') return true;
  var sitekey = 'object' === typeof popupMode && popupMode.recaptcha_key ? popupMode.recaptcha_key : '';
  var widget = grecaptcha.render(container, {
    'sitekey': sitekey
  });
  grecaptcha.reset(widget);
}

var rdcRecaptchaOnloadCallback = function () {
  resetCaptcha('rdcgrecaptchahomebuy');
  resetCaptcha('rdcgrecaptchacontactus');
  resetCaptcha('rdcgrecaptchacareer');
  resetCaptcha('rdcgrecaptchahomebuylisting');
  resetCaptcha('rdcgrecaptchahomemanagement');
  resetCaptcha('rdcgrecaptchahomerenting');
  resetCaptcha('rdcgrecaptchahomeselling');
  resetCaptcha('rdcgrecaptchareqapplication');
  resetCaptcha('rdcgrecaptchamanagementreferral');
};