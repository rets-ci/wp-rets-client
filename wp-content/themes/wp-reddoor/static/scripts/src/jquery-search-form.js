(function( $ ) {

  $.fn.rdc_search_form = function( options ) {

    var settings = $.extend({}, options );

    var that = this;

    $(document).click( function(){
      $(".dropdown-container .dropdown-list", that).slideUp();
    });

    $(".dropdown-container > span", that).click( function(e) {
      $(this).parent().find(".dropdown-list").slideDown();
      e.stopPropagation();
    });

    $(".dropdown-container .dropdown-list", that).click( function(e) {
      e.stopPropagation();
    });

    /* Search-form slide selects */
    $(".dropdown-option", that).on( 'change', function(e) {
      $(this).parents('.dropdown-container').find('.dropdown-value').html($('label', $(this).parent()).html());
    });

    $('.citiesSelection', that).select2({
      placeholder: 'Location',
      ajax: {
        url: "/wp-admin/admin-ajax.php?action=TermsSearchable",
        dataType: 'json',
        processResults: function(data, page){
          return {
            results: data.data
          }
        }
      },
      templateResult: function formatRepo (city) {
        if (city.loading) return city.text;

        var html = "<span style='float: left; max-width: 200px; overflow: hidden; height: 23px;'>" + city.name  + "</span><span style='float: right; color: #cf3428;'>" + city.taxonomy + "</span>";
        return html;
      },
      escapeMarkup: function (markup) { return markup; },
      templateSelection: function formatRepoSelection (city) {
        return city.name;
      }
    });
    $('.location .select2-selection__placeholder', that).html('Location');

  };

}( jQuery ));