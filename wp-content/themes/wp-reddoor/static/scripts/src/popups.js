jQuery(function () {

  var popUpWindow = jQuery('span.exitPopup').parent().parent();

  jQuery('.showContactPopup > a, button.showContactPopup, a.showContactPopup').on('click', function showContactPopup() {
    var that = this;
    jQuery('div.popup').fadeOut(300);
    jQuery('div.popup.'+jQuery(that).attr("rel")).fadeIn(200);
    jQuery('html').css('overflow-y','hidden');
    return false;
  });

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
});