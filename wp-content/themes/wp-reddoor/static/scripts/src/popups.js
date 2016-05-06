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
    }
  });

  jQuery('.popup .hidden-phone').on('click', function(){
    jQuery( this ).val(jQuery( this ).data('phone'));
  });

  /**
   * Show Popup Box
   *
   * @param event
   * @returns {boolean}
   */
  function showContactPopup( event ) {

    var that = this;

    // prevent actual click from going through
    event.preventDefault();

    // determine type of action we're making with the click
    var _type = jQuery(that).attr("rel") || jQuery(that).attr("data-action");

    jQuery('div.popup').fadeOut(300);
    jQuery('div.popup.'+ _type ).fadeIn(200);
    jQuery('html').css('overflow-y','hidden');

    return false;

  }

});