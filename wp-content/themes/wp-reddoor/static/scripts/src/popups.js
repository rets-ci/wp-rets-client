jQuery(function () {

  var popUpWindow = jQuery('span.exitPopup').parent().parent();

  jQuery('.showContactPopup a').on('click', function () {
    var that = this;
    jQuery('div.popup').fadeOut(300);
    jQuery('div.popup.'+jQuery(that).attr("rel")).fadeIn(200);
    return false;
  });

  jQuery('span.exitPopup').on('click', function () {
    jQuery(this).parent().parent().fadeOut(100);
    return false;
  });

  jQuery('.popup-overlay').on('click', function () {
    jQuery(this).parent().fadeOut(100);
    return false;
  });

  jQuery('body').keydown(function(eventObject){
    if (eventObject.which == 27) {
      popUpWindow.fadeOut(100);
    }
  });

  jQuery('.popup .clickToView').on('click', function(){
    jQuery( this ).parent().find('.hidden-phone').attr('placeholder', jQuery( this ).parent().find('.hidden-phone').data('phone'));
  });
});