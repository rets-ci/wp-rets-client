(function( $ ) {

  $.fn.rdc_search_form = function( options ) {
    console.debug( 'rdc_search_form', 'invoked', options );

    var settings = $.extend({}, options );

    var that = this;

    /**
     * A bit hacky fix for safari form validation
     */
    $('form', that).on('submit', function(e){
      if ( !e.target.checkValidity() ) {
        $('.select2-search__field', e.target).focus().click();
        return false;
      }
      return true;
    });

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

        $('.lastRangeList .buyFormItem', dropdown).off('click').on( 'click', function(e) {
          var buyselected_max = parseInt( $(this).data('val') );
          if ( !isNaN( buyselected_max ) && buyselected_max != 0 ) {
            $('.lastRangeValue.buyBlock', dropdown).val( buyselected_max );
            var buyCurrency = buyCurrencyAmount( buyselected_max );
            $('.lastRangeLabel.buyBlock', dropdown).val( buyCurrency.label );
            $('.lastRangeValue.buyBlock', dropdown).val( buyCurrency.value );
            applyPlaceholderBuy();
          } else {
            $('.lastRangeLabel.buyBlock', dropdown).val( 'No Max' );
            $('.lastRangeValue.buyBlock', dropdown).val( '' );
            applyPlaceholderBuy();
          }

          if ( $('.lastRangeLabel.buyBlock', dropdown).val() && $('.firstRangeLabel.buyBlock', dropdown).val() ) {
            $(".dropdown-container .dropdown-list.buyBlock", that).slideUp();
          }
        });
        $('.lastRangeList .rentFormItem', dropdown).off('click').on( 'click', function(e) {
          var rentselected_max = parseInt( $(this).data('val') );
          if ( !isNaN( rentselected_max ) && rentselected_max != 0 ) {
            $('.lastRangeValue.rentBlock', dropdown).val( rentselected_max );
            var rentCurrency = rentCurrencyAmount( rentselected_max );
            $('.lastRangeLabel.rentBlock', dropdown).val( rentCurrency.label );
            $('.lastRangeValue.rentBlock', dropdown).val( rentCurrency.value );
            applyPlaceholderRent();
          } else {
            $('.lastRangeLabel.rentBlock', dropdown).val( 'No Max' );
            $('.lastRangeValue.rentBlock', dropdown).val( '' );
            applyPlaceholderRent();
          }

          if ( $('.lastRangeLabel.rentBlock', dropdown).val() && $('.firstRangeLabel.rentBlock', dropdown).val() ) {
            $(".dropdown-container .dropdown-list.rentBlock", that).slideUp();
          }
        });

        function buyGenerateMax(selected_min) {
          var max_values = [];
          for( var i = 1; i < 11; i++ ) {
            max_values.push( selected_min + 25000 * i );
          }

          $('.lastRangeList.buyBlock', dropdown).empty();
          for(var key in max_values) {
            $('.lastRangeList.buyBlock', dropdown).append('<li><a class="buyFormItem" data-val="'+max_values[key]+'" href="javascript:;">'+simplifyAmount(max_values[key])+'</a></li>');
          }
          $('.lastRangeList.buyBlock', dropdown).append('<li><a class="buyFormItem" data-val="" href="javascript:;">No Max</a></li>');

          $('.buyFormItem', dropdown).off('click').on( 'click', function(e) {
            var selected_max = parseInt( $(this).data('val') );
            if ( !isNaN( selected_max ) && selected_max != 0 ) {
              $('.lastRangeValue.buyBlock', dropdown).val( selected_max );
              var buyCurrency = buyCurrencyAmount( selected_max );
              $('.lastRangeLabel.buyBlock', dropdown).val( buyCurrency.label );
              $('.lastRangeValue.buyBlock', dropdown).val( buyCurrency.value );
              applyPlaceholderBuy();
            } else {
              $('.lastRangeLabel.buyBlock', dropdown).val( 'No Max' );
              $('.lastRangeValue.buyBlock', dropdown).val( '' );
              applyPlaceholderBuy();
            }

            if ( $('.lastRangeLabel.buyBlock', dropdown).val() && $('.firstRangeLabel.buyBlock', dropdown).val() ) {
              $(".dropdown-container .dropdown-list.buyBlock", that).slideUp();
            }
          });
        };

        function rentGenerateMax(selected_min) {
          var max_values = [];
          for( var i = 1; i < 11; i++ ) {
            max_values.push( selected_min + 250 * i );
          }

          $('.lastRangeList.rentBlock', dropdown).empty();
          for(var key in max_values) {
            $('.lastRangeList.rentBlock', dropdown).append('<li><a class="rentFormItem" data-val="'+max_values[key]+'" href="javascript:;">$'+max_values[key]+'</a></li>');
          }
          $('.lastRangeList.rentBlock', dropdown).append('<li><a class="rentFormItem" data-val="" href="javascript:;">No Max</a></li>');

          $('.rentFormItem', dropdown).off('click').on( 'click', function(e) {
            var selected_max = parseInt( $(this).data('val') );
            if ( !isNaN( selected_max ) && selected_max != 0 ) {
              $('.lastRangeValue.rentBlock', dropdown).val( selected_max );
              var rentCurrency = rentCurrencyAmount( selected_max );
              $('.lastRangeLabel.rentBlock', dropdown).val( rentCurrency.label );
              $('.lastRangeValue.rentBlock', dropdown).val( rentCurrency.value );
              applyPlaceholderRent();
            } else {
              $('.lastRangeLabel.rentBlock', dropdown).val( 'No Max' );
              $('.lastRangeValue.rentBlock', dropdown).val( '' );
              applyPlaceholderRent();
            }

            if ( $('.lastRangeLabel.rentBlock', dropdown).val() && $('.firstRangeLabel.rentBlock', dropdown).val() ) {
              $(".dropdown-container .dropdown-list.rentBlock", that).slideUp();
            }
          });
        };

        /**
         *
         */
        function applyPlaceholderBuy() {
          var _separator = '';
          var _first_val = parseInt( $('.firstRangeValue.buyBlock', dropdown).val() );
          var _last_val = parseInt( $('.lastRangeValue.buyBlock', dropdown).val() );

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

          $('.dropdown-value.buyBlock', dropdown).html( simplifyAmount( _first_val ) + _separator + simplifyAmount( _last_val ) );
        };

        function applyPlaceholderRent() {
          var _separator = '';
          var _first_val = parseInt( $('.firstRangeValue.rentBlock', dropdown).val() );
          var _last_val = parseInt( $('.lastRangeValue.rentBlock', dropdown).val() );

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
          function rentPriceDisplay(value) {
            if(value) {
              return '$' + value;
            }
            else{
              return '';
            }
          }

          $('.dropdown-value.rentBlock', dropdown).html( rentPriceDisplay( _first_val ) + _separator + rentPriceDisplay( _last_val ) );
        };

        $('.firstRangeLabel.buyBlock', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side.buyBlock', dropdown).show();
          $('.right-side.buyBlock', dropdown).hide();
        });

        $('.firstRangeLabel.rentBlock', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side.rentBlock', dropdown).show();
          $('.right-side.rentBlock', dropdown).hide();
        });

        $('.firstRangeLabel.buyBlock', dropdown).off('change').on( 'change', function(e) {
          var buyCurrency = buyCurrencyAmount( $(this).val() );
          $(this).val( buyCurrency.label );
          $('.firstRangeValue.buyBlock', dropdown).val( buyCurrency.value );
          applyPlaceholderBuy();
          buyGenerateMax( buyCurrency.value );
        });

        $('.firstRangeLabel.rentBlock', dropdown).off('change').on( 'change', function(e) {
          var rentCurrency = rentCurrencyAmount( $(this).val() );
          $(this).val( rentCurrency.label );
          $('.firstRangeValue.rentBlock', dropdown).val( rentCurrency.value );
          applyPlaceholderRent();
          rentGenerateMax( rentCurrency.value );
        });

        $('.lastRangeLabel.buyBlock', dropdown).off('change').on( 'change', function(e) {
          var buyCurrency = buyCurrencyAmount( $(this).val() );
          $(this).val( buyCurrency.label );
          $('.lastRangeValue.buyBlock', dropdown).val( buyCurrency.value );
          applyPlaceholderBuy();
        });

        $('.lastRangeLabel.rentBlock', dropdown).off('change').on( 'change', function(e) {
          var rentCurrency = rentCurrencyAmount( $(this).val() );
          $(this).val( rentCurrency.label );
          $('.lastRangeValue.rentBlock', dropdown).val( rentCurrency.value );
          applyPlaceholderRent();
        });

        $('.lastRangeLabel.buyBlock', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side.buyBlock', dropdown).hide();
          $('.right-side.buyBlock', dropdown).show();
        });

        $('.lastRangeLabel.rentBlock', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side.rentBlock', dropdown).hide();
          $('.right-side.rentBlock', dropdown).show();
        });

        $('.firstRangeList .buyFormItem', dropdown).off('click').on( 'click', function(e) {
          var selected_min = parseInt( $(this).data('val') );

          if ( !isNaN( selected_min ) && selected_min != 0 ) {
            $('.firstRangeValue.buyBlock', dropdown).val( selected_min );
            var buyCurrency = buyCurrencyAmount( selected_min );
            $('.firstRangeLabel.buyBlock', dropdown).val( buyCurrency.label );
            $('.firstRangeValue.buyBlock', dropdown).val( buyCurrency.value );
            applyPlaceholderBuy();

            buyGenerateMax( buyCurrency.value );

            $('.left-side.buyBlock, .right-side.buyBlock', dropdown).toggle();
          } else {
            $('.firstRangeLabel.buyBlock', dropdown).val( 'No Min' );
            $('.firstRangeValue.buyBlock', dropdown).val( '' );
            applyPlaceholderBuy();
            $('.left-side.buyBlock, .right-side.buyBlock', dropdown).toggle();
          }

          if ( $('.lastRangeLabel.buyBlock', dropdown).val() && $('.firstRangeLabel.buyBlock', dropdown).val() ) {
            $(".dropdown-container .dropdown-list.buyBlock", that).slideUp();
          }

        });

        $('.firstRangeList .rentFormItem', dropdown).off('click').on( 'click', function(e) {

          var selected_min = parseInt( $(this).data('val') );

          if ( !isNaN( selected_min ) && selected_min != 0 ) {
            $('.firstRangeValue.rentBlock', dropdown).val( selected_min );
            var rentCurrency = rentCurrencyAmount( selected_min );
            $('.firstRangeLabel.rentBlock', dropdown).val( rentCurrency.label );
            $('.firstRangeValue.rentBlock', dropdown).val( rentCurrency.value );
            applyPlaceholderRent();

            rentGenerateMax( rentCurrency.value );

            $('.left-side.rentBlock, .right-side.rentBlock', dropdown).toggle();
          } else {
            $('.firstRangeLabel.rentBlock', dropdown).val( 'No Min' );
            $('.firstRangeValue.rentBlock', dropdown).val( '' );
            applyPlaceholderRent();
            $('.left-side.rentBlock, .right-side.rentBlock', dropdown).toggle();
          }

          if ( $('.lastRangeLabel.rentBlock', dropdown).val() && $('.firstRangeLabel.rentBlock', dropdown).val() ) {
            $(".dropdown-container .dropdown-list.rentBlock", that).slideUp();
          }


        });

        $('.firstRangeLabel.buyBlock', dropdown).focus();

        $('.firstRangeLabel.rentBlock', dropdown).focus();

      }

    });

  };

}( jQuery ));