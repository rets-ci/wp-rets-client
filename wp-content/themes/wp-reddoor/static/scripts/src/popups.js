jQuery( document ).ready(function onDocumentReady() {
  rdc.debug( 'onDocumentReady' );

  // Open popup from URL hash.
  if( window.location.hash && 'string' === typeof window.location.hash && window.location.hash.indexOf( '#popupform=' ) === 0 ) {
    rdc.debug( "Opening form", window.location.hash.replace( '#popupform=', '' ) );
    rdc.openContactForm( window.location.hash.replace( '#popupform=', '' ) );
  }

  jQuery('.showContactPopup > a, button.showContactPopup, a.showContactPopup').on('click', rdc.showContactPopup);

  jQuery('span.exitPopup').on('click', rdc.closeContactForm );
  jQuery('.popup-overlay').on('click', rdc.closeContactForm );

  jQuery('body').keydown(function keydownEvents(eventObject) {

    // close open contact form. @todo Should not do this if actively working on form?
    if (eventObject.which === 27) {
      rdc.closeContactForm();
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

});

