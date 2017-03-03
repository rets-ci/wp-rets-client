jQuery(document).ready(function () {
  jQuery(document).on('click', '#publish', function (e) {

    if( !jQuery('#layout_typediv .categorychecklist').length ) {
      return true;
    }

    var $checked = jQuery('#layout_typediv .categorychecklist li input:checked');

    //Checks if cat is selected
    if ($checked.length <= 0) {
      alert("You need to choose category of your layout before publish it");
      return false;
    } else {
      return true;
    }
  });
});
