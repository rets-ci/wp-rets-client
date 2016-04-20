jQuery(function () {

  var popUpWindow = jQuery('span.exitPopup').parent().parent();

  jQuery('.showContactPopup a, .showContactPopup').on('click', function () {
    jQuery('div.'+jQuery(this).attr("rel")).fadeIn(500);
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
      console.log(popUpWindow);
      popUpWindow.fadeOut(100);
    }
  });
});