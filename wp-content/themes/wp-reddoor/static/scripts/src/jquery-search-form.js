(function( $ ) {

  $.fn.rdc_search_form = function( options ) {

    var settings = $.extend({}, options );

    var that = this;

    /**
     *
     * @param int
     * @returns {*}
     */
    var simplifyAmount = function( int ) {
      if ( !String(int).length ) return '';
      return '$' + ( int / 1000 ) + 'k';
    };

    /**
     *
     * @param int
     * @returns {string}
     */
    var currencyAmount = function( int ) {
      var int = Math.round( parseInt( int.toString().replace(/,/g,"")) / 5000 ) * 5000;
      var cur = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return {value:int, label:cur != 'NaN' ? cur : ''};
    };

    $(document).on( 'click', function(){
      $(".dropdown-container .dropdown-list", that).slideUp();
    });

    $(".dropdown-container > span", that).click( function(e) {
      $(".dropdown-container .dropdown-list", that).slideUp();
      $(this).parent().find(".dropdown-list").slideToggle();
      e.stopPropagation();
      $(document).trigger( 'search-dropdown', [$(e.currentTarget).data('drop'), $(e.currentTarget)] );
    });

    $(".dropdown-container .dropdown-list", that).click( function(e) {
      e.stopPropagation();
    });

    /* Search-form slide selects */
    $(".dropdown-option", that).on( 'change', function(e) {
      $(this).parents('.dropdown-container').find('.dropdown-value').html($('label', $(this).parent()).html());
      $(".dropdown-container .dropdown-list", that).slideUp();
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

    var dropdown;

    $(document).on( 'search-dropdown', function(e, kind, element) {

      if ( typeof kind != 'undefined' && kind == 'price' ) {

        var dropdown = $(element).parent();

        function generateMax(selected_min) {
          var max_values = [];
          for( var i = 1; i < 11; i++ ) {
            max_values.push( selected_min + 25000 * i );
          }

          $('.lastRangeList', dropdown).empty();
          for(var key in max_values) {
            $('.lastRangeList', dropdown).append('<li><a data-val="'+max_values[key]+'" href="javascript:;">'+simplifyAmount(max_values[key])+'</a></li>');
          }
          $('.lastRangeList', dropdown).append('<li><a data-val="" href="javascript:;">No Max</a></li>');

          $('.lastRangeList li a', dropdown).off('click').on( 'click', function(e) {
            var selected_max = parseInt( $(this).data('val') );
            if ( !isNaN( selected_max ) && selected_max != 0 ) {
              $('.lastRangeValue', dropdown).val( selected_max );
              var currency = currencyAmount( selected_max );
              $('.lastRangeLabel', dropdown).val( currency.label );
              $('.lastRangeValue', dropdown).val( currency.value );
              applyPlaceholder();
            } else {
              $('.lastRangeLabel', dropdown).val( '' );
              $('.lastRangeValue', dropdown).val( '' );
              applyPlaceholder();
            }

            if ( $('.lastRangeLabel', dropdown).val() && $('.firstRangeLabel', dropdown).val() ) {
              $(".dropdown-container .dropdown-list", that).slideUp();
            }
          });
        };

        /**
         *
         */
        function applyPlaceholder() {
          var _separator = '';
          var _first_val = parseInt( $('.firstRangeValue', dropdown).val() );
          var _last_val = parseInt( $('.lastRangeValue', dropdown).val() );

          if ( isNaN( _first_val ) || _first_val == 0 ) {
            _first_val = '';
          }

          if ( isNaN( _last_val ) || _last_val == 0 ) {
            _last_val = '';
          }

          if ( _last_val && _first_val ) {
            _separator = ' - ';
          }

          if ( !_last_val && _first_val ) {
            _separator = ' + ';
          }

          if ( _last_val && !_first_val ) {
            _separator = ' Up to ';
          }

          if ( ( isNaN( _first_val ) || _first_val == 0 ) && ( isNaN( _last_val ) || _last_val == 0 ) ) {
            _separator = 'Any Price';
          }

          $('.dropdown-value', dropdown).html( simplifyAmount( _first_val ) + _separator + simplifyAmount( _last_val ) );
        };

        $('.firstRangeLabel', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side', dropdown).show();
          $('.right-side', dropdown).hide();
        });

        $('.firstRangeLabel', dropdown).off('change').on( 'change', function(e) {
          var currency = currencyAmount( $(this).val() );
          $(this).val( currency.label );
          $('.firstRangeValue', dropdown).val( currency.value );
          applyPlaceholder();
          generateMax( currency.value );
        });

        $('.lastRangeLabel', dropdown).off('change').on( 'change', function(e) {
          var currency = currencyAmount( $(this).val() );
          $(this).val( currency.label );
          $('.lastRangeValue', dropdown).val( currency.value );
          applyPlaceholder();
        });

        $('.lastRangeLabel', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side', dropdown).hide();
          $('.right-side', dropdown).show();
        });

        $('.firstRangeList li a', dropdown).off('click').on( 'click', function(e) {

          var selected_min = parseInt( $(this).data('val') );

          if ( !isNaN( selected_min ) && selected_min != 0 ) {
            $('.firstRangeValue', dropdown).val( selected_min );
            var currency = currencyAmount( selected_min );
            $('.firstRangeLabel', dropdown).val( currency.label );
            $('.firstRangeValue', dropdown).val( currency.value );
            applyPlaceholder();

            generateMax( currency.value );

            $('.left-side, .right-side', dropdown).toggle();
          } else {
            $('.firstRangeLabel', dropdown).val( '' );
            $('.firstRangeValue', dropdown).val( '' );
            applyPlaceholder();
          }

          if ( $('.lastRangeLabel', dropdown).val() && $('.firstRangeLabel', dropdown).val() ) {
            $(".dropdown-container .dropdown-list", that).slideUp();
          }

        });

        $('.firstRangeLabel', dropdown).focus();
      }

    });

  };

}( jQuery ));