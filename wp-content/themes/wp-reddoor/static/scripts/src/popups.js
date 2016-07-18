jQuery(function () {

  var popUpWindow = jQuery('span.exitPopup').parent().parent();

  jQuery('.showContactPopup > a, button.showContactPopup, a.showContactPopup').on('click', showContactPopup );

  jQuery('span.exitPopup').on('click', function () {
    jQuery(this).parent().parent().fadeOut(100);
    jQuery('html').css('overflow-y','scroll');
    return false;
  });

  jQuery('.popup-overlay').on('click', function () {
    jQuery(this).parent().fadeOut(100);
    jQuery('html').css('overflow-y','scroll');
    return false;
  });

  jQuery('body').keydown(function(eventObject){
    if (eventObject.which == 27) {
      popUpWindow.fadeOut(100);
      jQuery('html').css('overflow-y','scroll');
    }
  });

  jQuery('.popup .hidden-phone').on('click', function(){
    jQuery( this ).val(jQuery( this ).data('phone'));
    __gaTracker('send', 'event', 'calls', 'click', jQuery( this ).data('phone') + " - " + jQuery( this ).data('label') );
  });

  /**
   *
   Substitution contact popups on careers page.
   *
   */

  setTimeout(function(){
    jQuery('.careers .headContact a').attr('href', '#popupCareersInquiry');
    jQuery('.careers .footerContact').data('action', 'popupCareersInquiry');
  }, 20);


  /**
   * Show Popup Box
   *
   * @param event
   * @returns {boolean}
   */
  function showContactPopup( event ) {

    var that = this;

    var firsthref = jQuery(that).attr("href");
    if (typeof firsthref != 'undefined'){
      var lasthref = firsthref.substr(1);
    }
    var dataaction = jQuery(that).data("action");

    // prevent actual click from going through
    event.preventDefault();

    // determine type of action we're making with the click
    var _type = dataaction || lasthref ;

    jQuery('div.popup').fadeOut(300);
    jQuery('div.popup.'+ _type ).fadeIn(200);
    jQuery('html').css('overflow-y','hidden');

    return false;

  }

});