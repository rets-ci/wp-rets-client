(function( $ ) {

  $.fn.rdc_search_form = function( options ) {
    console.debug( 'rdc_search_form', 'invoked', options );

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
    var buyCurrencyAmount = function( int ) {
      var int = Math.round( parseInt( int.toString().replace(/,/g,"")) / 5000 ) * 5000;
      var cur = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return {value:int, label:cur != 'NaN' ? cur : ''};
    };
    var rentCurrencyAmount = function( int ) {
      var int = Math.round( parseInt( int.toString().replace(/,/g,"")) / 10 ) * 10;
      var cur = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return {value:int, label:cur != 'NaN' ? cur : ''};
    };

    $(document).on( 'click', function(){
      $(".dropdown-container .dropdown-list", that).slideUp();
      console.debug('slideUp');
    });

    $(".dropdown-container .searchTrigger", that).on('click', ( function(e) {
      $(".dropdown-container .dropdown-list", that).slideUp();
      $(this).parent().find(".dropdown-list").slideToggle();
      e.stopPropagation();
      $(document).trigger( 'search-dropdown', [$(e.currentTarget).data('drop'), $(e.currentTarget)] );
      console.debug('slideToggle');
    }));

    $(".dropdown-container .dropdown-list", that).on('click', ( function(e) {
      e.stopPropagation();
    }));

    /* Search-form slide selects */
    $(".dropdown-option", that).on( 'change', function(e) {
      $(this).parents('.dropdown-container').find('.dropdown-value').html($('label', $(this).parent()).html());
      $(".dropdown-container .dropdown-list", that).slideUp();
    });

    $('.citiesSelection', that).select2({
      placeholder: 'Location',
      maximumSelectionLength: 1,
      minimumInputLength: 3,
      ajax: {
        url: "/wp-admin/admin-ajax.php?action=TermsSearchable",
        dataType: 'json',
        data: function (params) {
          return {
            q: params.term
          };
        },
        processResults: function(data, page){
          return {
            results: data.data
          }
        }
      },
      language: {
        noResults: function(){
          return "No results found. Try something else";
        },
        errorLoading: function(){
          return "Searching...";
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

        $('.buyForm .lastRangeList li a', dropdown).off('click').on( 'click', function(e) {
          var buyselected_max = parseInt( $(this).data('val') );
          if ( !isNaN( buyselected_max ) && buyselected_max != 0 ) {
            $('.buyForm .lastRangeValue', dropdown).val( buyselected_max );
            var buyCurrency = buyCurrencyAmount( buyselected_max );
            $('.buyForm .lastRangeLabel', dropdown).val( buyCurrency.label );
            $('.buyForm .lastRangeValue', dropdown).val( buyCurrency.value );
            applyPlaceholder();
          } else {
            $('.buyForm .lastRangeLabel', dropdown).val( 'No Max' );
            $('.buyForm .lastRangeValue', dropdown).val( '' );
            applyPlaceholder();
          }

          if ( $('.buyForm .lastRangeLabel', dropdown).val() && $('.buyForm .firstRangeLabel', dropdown).val() ) {
            $(".buyForm .dropdown-container .dropdown-list", that).slideUp();
          }
        });
        $('.rentForm .lastRangeList li a', dropdown).off('click').on( 'click', function(e) {
          var rentselected_max = parseInt( $(this).data('val') );
          if ( !isNaN( rentselected_max ) && rentselected_max != 0 ) {
            $('.rentForm .lastRangeValue', dropdown).val( rentselected_max );
            var rentCurrency = rentCurrencyAmount( rentselected_max );
            $('.rentForm .lastRangeLabel', dropdown).val( rentCurrency.label );
            $('.rentForm .lastRangeValue', dropdown).val( rentCurrency.value );
            applyPlaceholder();
          } else {
            $('.rentForm .lastRangeLabel', dropdown).val( 'No Max' );
            $('.rentForm .lastRangeValue', dropdown).val( '' );
            applyPlaceholder();
          }

          if ( $('.rentForm .lastRangeLabel', dropdown).val() && $('.rentForm .firstRangeLabel', dropdown).val() ) {
            $(".rentForm .dropdown-container .dropdown-list", that).slideUp();
          }
        });

        function buyGenerateMax(selected_min) {
          var max_values = [];
          for( var i = 1; i < 11; i++ ) {
            max_values.push( selected_min + 25000 * i );
          }

          $('.buyForm .lastRangeList', dropdown).empty();
          for(var key in max_values) {
            $('.buyForm .lastRangeList', dropdown).append('<li><a data-val="'+max_values[key]+'" href="javascript:;">'+simplifyAmount(max_values[key])+'</a></li>');
          }
          $('.buyForm .lastRangeList', dropdown).append('<li><a data-val="" href="javascript:;">No Max</a></li>');

          $('.buyForm .lastRangeList li a', dropdown).off('click').on( 'click', function(e) {
            var selected_max = parseInt( $(this).data('val') );
            if ( !isNaN( selected_max ) && selected_max != 0 ) {
              $('.buyForm .lastRangeValue', dropdown).val( selected_max );
              var buyCurrency = buyCurrencyAmount( selected_max );
              $('.buyForm .lastRangeLabel', dropdown).val( buyCurrency.label );
              $('.buyForm .lastRangeValue', dropdown).val( buyCurrency.value );
              applyPlaceholder();
            } else {
              $('.buyForm .lastRangeLabel', dropdown).val( 'No Max' );
              $('.buyForm .lastRangeValue', dropdown).val( '' );
              applyPlaceholder();
            }

            if ( $('.buyForm .lastRangeLabel', dropdown).val() && $('.buyForm .firstRangeLabel', dropdown).val() ) {
              $(".buyForm .dropdown-container .dropdown-list", that).slideUp();
            }
          });
        };

        function rentGenerateMax(selected_min) {
          var max_values = [];
          for( var i = 1; i < 11; i++ ) {
            max_values.push( selected_min + 250 * i );
          }

          $('.rentForm .lastRangeList', dropdown).empty();
          for(var key in max_values) {
            $('.rentForm .lastRangeList', dropdown).append('<li><a data-val="'+max_values[key]+'" href="javascript:;">$'+max_values[key]+'</a></li>');
          }
          $('.rentForm .lastRangeList', dropdown).append('<li><a data-val="" href="javascript:;">No Max</a></li>');

          $('.rentForm .lastRangeList li a', dropdown).off('click').on( 'click', function(e) {
            var selected_max = parseInt( $(this).data('val') );
            if ( !isNaN( selected_max ) && selected_max != 0 ) {
              $('.rentForm .lastRangeValue', dropdown).val( selected_max );
              var rentCurrency = rentCurrencyAmount( selected_max );
              $('.rentForm .lastRangeLabel', dropdown).val( rentCurrency.label );
              $('.rentForm .lastRangeValue', dropdown).val( rentCurrency.value );
              applyPlaceholder();
            } else {
              $('.rentForm .lastRangeLabel', dropdown).val( 'No Max' );
              $('.rentForm .lastRangeValue', dropdown).val( '' );
              applyPlaceholder();
            }

            if ( $('.rentForm .lastRangeLabel', dropdown).val() && $('.rentForm .firstRangeLabel', dropdown).val() ) {
              $(".rentForm .dropdown-container .dropdown-list", that).slideUp();
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

        $('.buyForm .firstRangeLabel', dropdown).off('focus').on( 'focus', function(e) {
          $('.buyForm .left-side', dropdown).show();
          $('.buyForm .right-side', dropdown).hide();
        });

        $('.rentForm .firstRangeLabel', dropdown).off('focus').on( 'focus', function(e) {
          $('.rentForm .left-side', dropdown).show();
          $('.rentForm .right-side', dropdown).hide();
        });

        $('.buyForm .firstRangeLabel', dropdown).off('change').on( 'change', function(e) {
          var buyCurrency = buyCurrencyAmount( $(this).val() );
          $(this).val( buyCurrency.label );
          $('.rentForm .firstRangeValue', dropdown).val( buyCurrency.value );
          applyPlaceholder();
          buyGenerateMax( buyCurrency.value );
        });

        $('.rentForm .firstRangeLabel', dropdown).off('change').on( 'change', function(e) {
          var rentCurrency = rentCurrencyAmount( $(this).val() );
          $(this).val( rentCurrency.label );
          $('.firstRangeValue', dropdown).val( rentCurrency.value );
          applyPlaceholder();
          rentGenerateMax( rentCurrency.value );
        });

        $('.buyForm .lastRangeLabel', dropdown).off('change').on( 'change', function(e) {
          var buyCurrency = buyCurrencyAmount( $(this).val() );
          $(this).val( buyCurrency.label );
          $('.buyForm .lastRangeValue', dropdown).val( buyCurrency.value );
          applyPlaceholder();
        });

        $('.rentForm .lastRangeLabel', dropdown).off('change').on( 'change', function(e) {
          var rentCurrency = rentCurrencyAmount( $(this).val() );
          $(this).val( rentCurrency.label );
          $('.rentForm .lastRangeValue', dropdown).val( rentCurrency.value );
          applyPlaceholder();
        });

        $('.buyForm .lastRangeLabel', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side', dropdown).hide();
          $('.right-side', dropdown).show();
        });

        $('.rentForm .lastRangeLabel', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side', dropdown).hide();
          $('.right-side', dropdown).show();
        });

        $('.buyForm .firstRangeList li a', dropdown).off('click').on( 'click', function(e) {
          console.log('loh');

          var selected_min = parseInt( $(this).data('val') );

          if ( !isNaN( selected_min ) && selected_min != 0 ) {
            $('.firstRangeValue', dropdown).val( selected_min );
            var buyCurrency = buyCurrencyAmount( selected_min );
            $('.firstRangeLabel', dropdown).val( buyCurrency.label );
            $('.firstRangeValue', dropdown).val( buyCurrency.value );
            applyPlaceholder();

            buyGenerateMax( buyCurrency.value );

            $('.buyForm .left-side, .buyForm .right-side', dropdown).toggle();
          } else {
            $('.buyForm .firstRangeLabel', dropdown).val( 'No Min' );
            $('.buyForm .firstRangeValue', dropdown).val( '' );
            applyPlaceholder();
            $('.buyForm .left-side, .buyForm .right-side', dropdown).toggle();
          }

          if ( $('.buyForm .lastRangeLabel', dropdown).val() && $('.buyForm .firstRangeLabel', dropdown).val() ) {
            $(".buyForm .dropdown-container .dropdown-list", that).slideUp();
          }

        });

        $('.rentForm .firstRangeList li a', dropdown).off('click').on( 'click', function(e) {

          var selected_min = parseInt( $(this).data('val') );

          if ( !isNaN( selected_min ) && selected_min != 0 ) {
            $('.rentForm .firstRangeValue', dropdown).val( selected_min );
            var rentCurrency = rentCurrencyAmount( selected_min );
            $('.rentForm .firstRangeLabel', dropdown).val( rentCurrency.label );
            $('.rentForm .firstRangeValue', dropdown).val( rentCurrency.value );
            applyPlaceholder();

            rentGenerateMax( rentCurrency.value );

            $('.rentForm .left-side, .rentForm .right-side', dropdown).toggle();
          } else {
            $('.rentForm .firstRangeLabel', dropdown).val( 'No Min' );
            $('.rentForm .firstRangeValue', dropdown).val( '' );
            applyPlaceholder();
            $('.rentForm .left-side, .rentForm .right-side', dropdown).toggle();
          }

          if ( $('.rentForm .lastRangeLabel', dropdown).val() && $('.rentForm .firstRangeLabel', dropdown).val() ) {
            $(".rentForm .dropdown-container .dropdown-list", that).slideUp();
          }

        });

        $('.buyForm .firstRangeLabel', dropdown).focus();

        $('.rentForm .firstRangeLabel', dropdown).focus();
      }

    });

  };

}( jQuery ));