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
      placeholder: 'Search',
      maximumSelectionLength: 1,
      minimumInputLength: 3,
      data: [],
      query: function (query) {

        var data = [];

        if( rdc.client() && query.term && query.term.length  >= 3 ) {

          jQuery('.select2-dropdown').removeClass("hide");

          if( rdc.__request ) {
            rdc.__request.abort();
          }

          var sale_type = "Sale";
          if( jQuery("#tabs_search").find(".formTabs.active").data("topmenu") == "rentBtnForm" ) {
            sale_type = "Rent";
          }

          rdc.__request = rdc.client().search({
            index: 'v5',
            type: 'property',
            headers : {
              "Authorization" : make_base_auth( "site", "1d5f77cffa8e5bbc062dab552a3c2093" )
            },
            body: {
              query: rdc.build_query( query.term, sale_type ),
              _source: [
                "post_title",
                "_permalink",
                "tax_input.location_city",
                "tax_input.mls_id",
                "tax_input.location_street",
                "tax_input.location_zip",
                "tax_input.location_county",
                "tax_input.subdivision",
                "tax_input.elementary_school",
                "tax_input.middle_school",
                "tax_input.high_school",
                "tax_input.listing_office",
                "tax_input.listing_agent_name"
              ]
            },
          }, function (err, response) {

            if( typeof response.hits.hits == 'undefined' ) {
              query.callback({ results: data });
            }

            var post_title = { text: "Address", children: [] };
            var city = { text : "City", children: [] };
            var mls_id = { text : "MLS ID", children: [] };
            var location_street = { text : "Street", children: [] };
            var location_zip = { text : "Zip", children: [] };
            var location_county = { text : "County", children: [] };
            var subdivision = { text : "Subdivision", children: [] };
            var elementary_school = { text : "Elementary School", children: [] };
            var middle_school = { text : "Middle School", children: [] };
            var high_school = { text : "High School", children: [] };
            var listing_office = { text : "Office", children: [] };
            var listing_agent = { text : "Agent", children: [] };
            var unique = { "None" : "None","Not in a Subdivision" : "Not in a Subdivision" };

            $.each(response.hits.hits,function(k,v){
              if( typeof v._source.post_title != 'undefined' ) {
                if (!unique[v._source.post_title]) {
                  post_title.children.push({
                    id: v._source.post_title,
                    text: v._source.post_title,
                    taxonomy:'post_title',
                    permalink: v._source._permalink,
                  });
                  unique[v._source.post_title] = v._source.post_title;
                }
              }
              if( typeof v._source.tax_input.location_city != 'undefined' ) {
                if (!unique[v._source.tax_input.location_city[0]]) {
                  city.children.push({
                    id: v._source.tax_input.location_city[0],
                    text: v._source.tax_input.location_city[0],
                    taxonomy:'location_city',
                  });
                  unique[v._source.tax_input.location_city[0]] = v._source.tax_input.location_city[0];
                }
              }
              if( typeof v._source.tax_input.mls_id != 'undefined' ) {
                if (!unique[v._source.tax_input.mls_id[0]]) {
                  mls_id.children.push({
                    id: v._source.tax_input.mls_id[0],
                    text: v._source.tax_input.mls_id[0],
                    taxonomy:'mls_id',
                    permalink: v._source._permalink,
                  });
                  unique[v._source.tax_input.mls_id[0]] = v._source.tax_input.mls_id[0];
                }
              }
              if( typeof v._source.tax_input.location_street != 'undefined' ) {
                if (!unique[v._source.tax_input.location_street[0]]) {
                  location_street.children.push({
                    id:v._source.tax_input.location_street[0],
                    text:v._source.tax_input.location_street[0],
                    taxonomy: 'location_street'
                  })
                  unique[v._source.tax_input.location_street[0]] = v._source.tax_input.location_street[0];
                }
              }
              if( typeof v._source.tax_input.location_zip != 'undefined' ) {
                if (!unique[v._source.tax_input.location_zip[0]]) {
                  location_zip.children.push({
                    id:v._source.tax_input.location_zip[0],
                    text:v._source.tax_input.location_zip[0],
                    taxonomy: 'location_zip'
                  })
                  unique[v._source.tax_input.location_zip[0]] = v._source.tax_input.location_zip[0];
                }
              }
              if( typeof v._source.tax_input.location_county != 'undefined' ) {
                if (!unique[v._source.tax_input.location_county[0]]) {
                  location_county.children.push({
                    id:v._source.tax_input.location_county[0],
                    text:v._source.tax_input.location_county[0],
                    taxonomy: 'location_county'
                  })
                  unique[v._source.tax_input.location_county[0]] = v._source.tax_input.location_county[0];
                }
              }
              if( typeof v._source.tax_input.subdivision != 'undefined' ) {
                if (!unique[v._source.tax_input.subdivision[0]]) {
                  subdivision.children.push({
                    id:v._source.tax_input.subdivision[0],
                    text:v._source.tax_input.subdivision[0],
                    taxonomy: 'subdivision'
                  })
                  unique[v._source.tax_input.subdivision[0]] = v._source.tax_input.subdivision[0];
                }

              }
              if( typeof v._source.tax_input.elementary_school != 'undefined' ) {
                if (!unique[v._source.tax_input.elementary_school[0]]) {
                  elementary_school.children.push({
                    id:v._source.tax_input.elementary_school[0],
                    text:v._source.tax_input.elementary_school[0],
                    taxonomy: 'elementary_school'
                  })
                  unique[v._source.tax_input.elementary_school[0]] = v._source.tax_input.elementary_school[0];
                }
              }
              if( typeof v._source.tax_input.middle_school != 'undefined' ) {
                if (!unique[v._source.tax_input.middle_school[0]]) {
                  middle_school.children.push({
                    id:v._source.tax_input.middle_school[0],
                    text:v._source.tax_input.middle_school[0],
                    taxonomy:'middle_school'
                  })
                  unique[v._source.tax_input.middle_school[0]] = v._source.tax_input.middle_school[0];
                }
              }
              if( typeof v._source.tax_input.high_school != 'undefined' ) {
                if (!unique[v._source.tax_input.high_school[0]]) {
                  high_school.children.push({
                    id:v._source.tax_input.high_school[0],
                    text:v._source.tax_input.high_school[0],
                    taxonomy: 'high_school'
                  })
                  unique[v._source.tax_input.high_school[0]] = v._source.tax_input.high_school[0];
                }
              }
              if( typeof v._source.tax_input.listing_office != 'undefined' ) {
                if (!unique[v._source.tax_input.listing_office[0]]) {
                  listing_office.children.push({
                    id:v._source.tax_input.listing_office[0],
                    text:v._source.tax_input.listing_office[0],
                    taxonomy: 'listing_office'
                  })
                  unique[v._source.tax_input.listing_office[0]] = v._source.tax_input.listing_office[0];
                }
              }
              if( typeof v._source.tax_input.listing_agent != 'undefined' ) {
                if (!unique[v._source.tax_input.listing_agent[0]]) {
                  listing_agent.children.push({
                    id:v._source.tax_input.listing_agent[0],
                    text:v._source.tax_input.listing_agent[0],
                    taxonomy: 'listing_agent_name'
                  })
                  unique[v._source.tax_input.listing_agent[0]] = v._source.tax_input.listing_agent[0];
                }
              }
            });

            post_title.children.length ? data.push( post_title ) : '';
            city.children.length ? data.push( city ) : '';
            elementary_school.children.length ? data.push( elementary_school ) : '';
            middle_school.children.length ? data.push( middle_school ) : '';
            high_school.children.length ? data.push( high_school ) : '';
            listing_office.children.length ? data.push( listing_office ) : '';
            listing_agent.children.length ? data.push( listing_agent ) : '';
            location_street.children.length ? data.push( location_street ) : '';
            location_zip.children.length ? data.push( location_zip ) : '';
            location_county.children.length ? data.push( location_county ) : '';
            subdivision.children.length ? data.push( subdivision ) : '';
            mls_id.children.length ? data.push( mls_id ) : '';

            data.sort(function(a, b){
              // ASC  -> a.length - b.length
              // DESC -> b.length - a.length
              return a.children.length - b.children.length;
            });
            query.callback({ results: data });
          });
        } else {
          jQuery('.select2-dropdown').addClass("hide");
          query.callback({ results: data });
        }
      },
      // language: {
      //   noResults: function(){
      //     return "No results found. Try something else";
      //   },
      //   // errorLoading: function(){
      //   //   return "Searching...";
      //   // }
      // },
      // templateResult: function formatRepo (city) {
      //
      //   if (city.loading) return city.text;
      //
      //   if( typeof city.children != 'undefined' ) {
      //     return city.text;
      //   } else if( city.taxonomy == 'post_title' || city.taxonomy == 'mls_id' ) {
      //     var html = "<a href='" + city.permalink + "'><span style='float: left; max-width: 200px; overflow: hidden; height: 23px;'>" + city.text  + "</span></a>";
      //     return html;
      //   }
      //   var html = "<span style='float: left; max-width: 200px; overflow: hidden; height: 23px;'>" + city.text  + "</span>";
      //   return html;
      // },
      // escapeMarkup: function (markup) { return markup; },
      // templateSelection: function formatRepoSelection (city) {
      //   return city._source.tax_input.location_street[0];
      // }
    }).on('select2:select', function(e) {
      var $select = $(this);
      var data = $select.select2('data');
      if( typeof data[0].taxonomy != 'undefined' && data[0].taxonomy == 'post_title' || data[0].taxonomy == 'mls_id' ) {
        $select.closest('form').find("submit").attr("disabled","disabled");
        window.location.href= data[0].permalink;
      }
      $select.closest('form').find('input[name="_taxonomy"]').val(data[0].taxonomy);
    }).on('select2:selecting', function(e) {
      var $select = $(this);
      if( $select.select2('val') != null && $select.select2('val').length > 0 ) {
        $select.select2( 'val', {} );
      }
    });

    $('.location .select2-selection__placeholder', that).html('Search');

    var dropdown;

    $(document).on( 'search-dropdown', function(e, kind, element) {

      if ( typeof kind != 'undefined' && ( kind == 'price' || kind == 'bath' || kind == 'bed' ) ) {

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
        $('.lastBathRangeList .buyFormItem', dropdown).off('click').on( 'click', function(e) {
          var buyselected_max = parseInt( $(this).data('val') );
          if ( !isNaN( buyselected_max ) && buyselected_max != 0 ) {
            $(this).closest('.sfBathRange').find('.lastBathRangeValue.buyBlock', dropdown).val( buyselected_max );
            $(this).closest('.sfBathRange').find('.lastBathRangeLabel.buyBlock', dropdown).val( buyselected_max );
            $(this).closest('.sfBathRange').find('.lastBathRangeValue.buyBlock', dropdown).val( buyselected_max );
            applyPlaceholderBuyBath( $(this) );
          } else {
            $(this).closest('.sfBathRange').find('.lastBathRangeLabel.buyBlock', dropdown).val( 'No Max' );
            $(this).closest('.sfBathRange').find('.lastBathRangeValue.buyBlock', dropdown).val( '' );
            applyPlaceholderBuyBath( $(this) );
          }

          if ( $('.lastBathRangeLabel.buyBlock', dropdown).val() && $('.firstBathRangeLabel.buyBlock', dropdown).val() ) {
            $(".dropdown-container .dropdown-list.buyBlock", that).slideUp();
          }
        });
        $('.lastBedRangeList .buyFormItem', dropdown).off('click').on( 'click', function(e) {
          var buyselected_max = parseInt( $(this).data('val') );
          if ( !isNaN( buyselected_max ) && buyselected_max != 0 ) {
            $(this).closest('.sfBedRange').find('.lastBedRangeValue.buyBlock', dropdown).val( buyselected_max );
            $(this).closest('.sfBedRange').find('.lastBedRangeLabel.buyBlock', dropdown).val( buyselected_max );
            $(this).closest('.sfBedRange').find('.lastBedRangeValue.buyBlock', dropdown).val( buyselected_max );
            applyPlaceholderBuyBed( $(this) );
          } else {
            $(this).closest('.sfBedRange').find('.lastBedRangeLabel.buyBlock', dropdown).val( 'No Max' );
            $(this).closest('.sfBedRange').find('.lastBedRangeValue.buyBlock', dropdown).val( '' );
            applyPlaceholderBuyBed( $(this) );
          }

          if ( $('.lastBedRangeLabel.buyBlock', dropdown).val() && $('.firstBedRangeLabel.buyBlock', dropdown).val() ) {
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
        $('.lastBathRangeList .rentFormItem', dropdown).off('click').on( 'click', function(e) {
          var rentselected_max = parseInt( $(this).data('val') );
          if ( !isNaN( rentselected_max ) && rentselected_max != 0 ) {
            $(this).closest('.sfBathRange').find('.lastBathRangeValue.rentBlock', dropdown).val( rentselected_max );
            $(this).closest('.sfBathRange').find('.lastBathRangeLabel.rentBlock', dropdown).val( rentselected_max );
            $(this).closest('.sfBathRange').find('.lastBathRangeValue.rentBlock', dropdown).val( rentselected_max );
            applyPlaceholderRentBath( $(this) );
          } else {
            $(this).closest('.sfBathRange').find('.lastBathRangeLabel.rentBlock', dropdown).val( 'No Max' );
            $(this).closest('.sfBathRange').find('.lastBathRangeValue.rentBlock', dropdown).val( '' );
            applyPlaceholderRentBath( $(this) );
          }

          if ( $('.lastBathRangeLabel.rentBlock', dropdown).val() && $('.firstBathRangeLabel.rentBlock', dropdown).val() ) {
            $(".dropdown-container .dropdown-list.rentBlock", that).slideUp();
          }
        });
        $('.lastBedRangeList .rentFormItem', dropdown).off('click').on( 'click', function(e) {
          var rentselected_max = parseInt( $(this).data('val') );
          if ( !isNaN( rentselected_max ) && rentselected_max != 0 ) {
            $(this).closest('.sfBedRange').find('.lastBedRangeValue.rentBlock', dropdown).val( rentselected_max );
            $(this).closest('.sfBedRange').find('.lastBedRangeLabel.rentBlock', dropdown).val( rentselected_max );
            $(this).closest('.sfBedRange').find('.lastBedRangeValue.rentBlock', dropdown).val( rentselected_max );
            applyPlaceholderRentBed( $(this) );
          } else {
            $(this).closest('.sfBedRange').find('.lastBedRangeLabel.rentBlock', dropdown).val( 'No Max' );
            $(this).closest('.sfBedRange').find('.lastBedRangeValue.rentBlock', dropdown).val( '' );
            applyPlaceholderRentBed( $(this) );
          }

          if ( $('.lastBedRangeLabel.rentBlock', dropdown).val() && $('.firstBedRangeLabel.rentBlock', dropdown).val() ) {
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

        function buyGenerateMaxBath(element,selected_min) {
          var max_values = [];
          for( var i = selected_min; i < selected_min+6; i++ ) {
            max_values.push( i+1 );
          }

          element.closest('.sfBathRange').find('.lastBathRangeList.buyBlock', dropdown).empty();
          for(var key in max_values) {
            element.closest('.sfBathRange').find('.lastBathRangeList.buyBlock', dropdown).append('<li><a class="buyFormItem" data-val="'+max_values[key]+'" href="javascript:;">'+max_values[key]+'</a></li>');
          }
          element.closest('.sfBathRange').find('.lastBathRangeList.buyBlock', dropdown).append('<li><a class="buyFormItem" data-val="" href="javascript:;">No Max</a></li>');

          element.closest('.sfBathRange').find('.buyFormItem', dropdown).off('click').on( 'click', function(e) {
            var selected_max = parseInt( $(this).data('val') );
            if ( !isNaN( selected_max ) && selected_max != 0 ) {
              $(this).closest('.sfBathRange').find('.lastBathRangeValue.buyBlock', dropdown).val( selected_max );
              $(this).closest('.sfBathRange').find('.lastBathRangeLabel.buyBlock', dropdown).val( selected_max );
              $(this).closest('.sfBathRange').find('.lastBathRangeValue.buyBlock', dropdown).val( selected_max );
              applyPlaceholderBuyBath( $(this) );
            } else {
              $(this).closest('.sfBathRange').find('.lastBathRangeLabel.buyBlock', dropdown).val( 'No Max' );
              $(this).closest('.sfBathRange').find('.lastBathRangeValue.buyBlock', dropdown).val( '' );
              applyPlaceholderBuyBath( $(this) );
            }

            if ( $('.lastBathRangeLabel.buyBlock', dropdown).val() && $('.firstBathRangeLabel.buyBlock', dropdown).val() ) {
              $(".dropdown-container .dropdown-list.buyBlock", that).slideUp();
            }
          });
        };
        function buyGenerateMaxBed(element,selected_min) {
          var max_values = [];
          for( var i = selected_min; i < selected_min+6; i++ ) {
            max_values.push( i+1 );
          }

          element.closest('.sfBedRange').find('.lastBedRangeList.buyBlock', dropdown).empty();
          for(var key in max_values) {
            element.closest('.sfBedRange').find('.lastBedRangeList.buyBlock', dropdown).append('<li><a class="buyFormItem" data-val="'+max_values[key]+'" href="javascript:;">'+max_values[key]+'</a></li>');
          }
          element.closest('.sfBedRange').find('.lastBedRangeList.buyBlock', dropdown).append('<li><a class="buyFormItem" data-val="" href="javascript:;">No Max</a></li>');

          element.closest('.sfBedRange').find('.buyFormItem', dropdown).off('click').on( 'click', function(e) {
            var selected_max = parseInt( $(this).data('val') );
            if ( !isNaN( selected_max ) && selected_max != 0 ) {
              $(this).closest('.sfBedRange').find('.lastBedRangeValue.buyBlock', dropdown).val( selected_max );
              $(this).closest('.sfBedRange').find('.lastBedRangeLabel.buyBlock', dropdown).val( selected_max );
              $(this).closest('.sfBedRange').find('.lastBedRangeValue.buyBlock', dropdown).val( selected_max );
              applyPlaceholderBuyBed( $(this) );
            } else {
              $(this).closest('.sfBedRange').find('.lastBedRangeLabel.buyBlock', dropdown).val( 'No Max' );
              $(this).closest('.sfBedRange').find('.lastBedRangeValue.buyBlock', dropdown).val( '' );
              applyPlaceholderBuyBed( $(this) );
            }

            if ( $('.lastBedRangeLabel.buyBlock', dropdown).val() && $('.firstBedRangeLabel.buyBlock', dropdown).val() ) {
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

        function rentGenerateMaxBath(element,selected_min) {
          var max_values = [];
          for( var i = selected_min; i < selected_min+6; i++ ) {
            max_values.push( i+1 );
          }

          element.closest('.sfBathRange').find('.lastBathRangeList.rentBlock', dropdown).empty();
          for(var key in max_values) {
            element.closest('.sfBathRange').find('.lastBathRangeList.rentBlock', dropdown).append('<li><a class="rentFormItem" data-val="'+max_values[key]+'" href="javascript:;">'+max_values[key]+'</a></li>');
          }
          element.closest('.sfBathRange').find('.lastBathRangeList.rentBlock', dropdown).append('<li><a class="rentFormItem" data-val="" href="javascript:;">No Max</a></li>');

          element.closest('.sfBathRange').find('.rentFormItem', dropdown).off('click').on( 'click', function(e) {
            var selected_max = parseInt( $(this).data('val') );
            if ( !isNaN( selected_max ) && selected_max != 0 ) {
              $(this).closest('.sfBathRange').find('.lastBathRangeValue.rentBlock', dropdown).val( selected_max );
              $(this).closest('.sfBathRange').find('.lastBathRangeLabel.rentBlock', dropdown).val( selected_max );
              $(this).closest('.sfBathRange').find('.lastBathRangeValue.rentBlock', dropdown).val( selected_max );
              applyPlaceholderRentBath( $(this) );
            } else {
              $(this).closest('.sfBathRange').find('.lastBathRangeLabel.rentBlock', dropdown).val( 'No Max' );
              $(this).closest('.sfBathRange').find('.lastBathRangeValue.rentBlock', dropdown).val( '' );
              applyPlaceholderRentBath( $(this) );
            }

            if ( $('.lastBathRangeLabel.rentBlock', dropdown).val() && $('.firstBathRangeLabel.rentBlock', dropdown).val() ) {
              $(".dropdown-container .dropdown-list.rentBlock", that).slideUp();
            }
          });
        };
        function rentGenerateMaxBed(element,selected_min) {
          var max_values = [];
          for( var i = selected_min; i < selected_min+6; i++ ) {
            max_values.push( i+1 );
          }

          element.closest('.sfBedRange').find('.lastBedRangeList.rentBlock', dropdown).empty();
          for(var key in max_values) {
            element.closest('.sfBedRange').find('.lastBedRangeList.rentBlock', dropdown).append('<li><a class="rentFormItem" data-val="'+max_values[key]+'" href="javascript:;">'+max_values[key]+'</a></li>');
          }
          element.closest('.sfBedRange').find('.lastBedRangeList.rentBlock', dropdown).append('<li><a class="rentFormItem" data-val="" href="javascript:;">No Max</a></li>');

          element.closest('.sfBedRange').find('.rentFormItem', dropdown).off('click').on( 'click', function(e) {
            var selected_max = parseInt( $(this).data('val') );
            if ( !isNaN( selected_max ) && selected_max != 0 ) {
              $(this).closest('.sfBedRange').find('.lastBedRangeValue.rentBlock', dropdown).val( selected_max );
              $(this).closest('.sfBedRange').find('.lastBedRangeLabel.rentBlock', dropdown).val( selected_max );
              $(this).closest('.sfBedRange').find('.lastBedRangeValue.rentBlock', dropdown).val( selected_max );
              applyPlaceholderRentBed( $(this) );
            } else {
              $(this).closest('.sfBedRange').find('.lastBedRangeLabel.rentBlock', dropdown).val( 'No Max' );
              $(this).closest('.sfBedRange').find('.lastBedRangeValue.rentBlock', dropdown).val( '' );
              applyPlaceholderRentBed( $(this) );
            }

            if ( $('.lastBedRangeLabel.rentBlock', dropdown).val() && $('.firstBedRangeLabel.rentBlock', dropdown).val() ) {
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

        /**
         *
         */
        function applyPlaceholderBuyBath( element ) {
          var _separator = '';
          var _first_val = parseInt( element.closest('.sfBathRange').find('.firstBathRangeValue.buyBlock', dropdown).val() );
          var _last_val = parseInt( element.closest('.sfBathRange').find('.lastBathRangeValue.buyBlock', dropdown).val() );

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
            _separator = 'Any Baths';
          }

          element.closest('.sfBaths').find('.dropdown-value.buyBlock', dropdown).html( _first_val + _separator + _last_val );
        };
        function applyPlaceholderBuyBed( element ) {
          var _separator = '';
          var _first_val = parseInt( element.closest('.sfBedRange').find('.firstBedRangeValue.buyBlock', dropdown).val() );
          var _last_val = parseInt( element.closest('.sfBedRange').find('.lastBedRangeValue.buyBlock', dropdown).val() );

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
            _separator = 'Any Beds';
          }

          element.closest('.sfBeds').find('.dropdown-value.buyBlock', dropdown).html( _first_val + _separator + _last_val );
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

        function applyPlaceholderRentBath( element ) {
          var _separator = '';
          var _first_val = parseInt( element.closest('.sfBathRange').find('.firstBathRangeValue.rentBlock', dropdown).val() );
          var _last_val = parseInt( element.closest('.sfBathRange').find('.lastBathRangeValue.rentBlock', dropdown).val() );

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
            _separator = 'Any Baths';
          }

          element.closest('.sfBaths').find('.dropdown-value.rentBlock', dropdown).html( _first_val + _separator + _last_val );
        };
        function applyPlaceholderRentBed( element ) {
          var _separator = '';
          var _first_val = parseInt( element.closest('.sfBedRange').find('.firstBedRangeValue.rentBlock', dropdown).val() );
          var _last_val = parseInt( element.closest('.sfBedRange').find('.lastBedRangeValue.rentBlock', dropdown).val() );

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
            _separator = 'Any Beds';
          }

          element.closest('.sfBeds').find('.dropdown-value.rentBlock', dropdown).html( _first_val + _separator + _last_val );
        };

        $('.firstRangeLabel.buyBlock', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side.buyBlock', dropdown).show();
          $('.right-side.buyBlock', dropdown).hide();
        });

        $('.firstBathRangeLabel.buyBlock', dropdown).off('focus').on( 'focus', function(e) {
          $(this).closest('.sfBathRange').find('.left-side.buyBlock', dropdown).show();
          $(this).closest('.sfBathRange').find('.right-side.buyBlock', dropdown).hide();
        });

        $('.firstBedRangeLabel.buyBlock', dropdown).off('focus').on( 'focus', function(e) {
          $(this).closest('.sfBedRange').find('.left-side.buyBlock', dropdown).show();
          $(this).closest('.sfBedRange').find('.right-side.buyBlock', dropdown).hide();
        });

        $('.firstRangeLabel.rentBlock', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side.rentBlock', dropdown).show();
          $('.right-side.rentBlock', dropdown).hide();
        });

        $('.firstBathRangeLabel.rentBlock', dropdown).off('focus').on( 'focus', function(e) {
          $(this).closest('.sfBathRange').find('.left-side.rentBlock', dropdown).show();
          $(this).closest('.sfBathRange').find('.right-side.rentBlock', dropdown).hide();
        });

        $('.firstBedRangeLabel.rentBlock', dropdown).off('focus').on( 'focus', function(e) {
          $(this).closest('.sfBedRange').find('.left-side.rentBlock', dropdown).show();
          $(this).closest('.sfBedRange').find('.right-side.rentBlock', dropdown).hide();
        });

        $('.firstRangeLabel.buyBlock', dropdown).off('change').on( 'change', function(e) {
          var buyCurrency = buyCurrencyAmount( $(this).val() );
          $(this).val( buyCurrency.label );
          $('.firstRangeValue.buyBlock', dropdown).val( buyCurrency.value );
          applyPlaceholderBuy();
          buyGenerateMax( buyCurrency.value );
        });

        $('.firstBathRangeLabel.buyBlock', dropdown).off('change').on( 'change', function(e) {
          $('.firstBathRangeValue.buyBlock', dropdown).val( $(this).val() );
          applyPlaceholderBuyBath( $(this) );
          buyGenerateMaxBath( $(this), parseInt( $(this).val() ) );
        });

        $('.firstBedRangeLabel.buyBlock', dropdown).off('change').on( 'change', function(e) {
          $('.firstBedRangeValue.buyBlock', dropdown).val( $(this).val() );
          applyPlaceholderBuyBed( $(this) );
          buyGenerateMaxBed( $(this), parseInt( $(this).val() ) );
        });

        $('.firstRangeLabel.rentBlock', dropdown).off('change').on( 'change', function(e) {
          var rentCurrency = rentCurrencyAmount( $(this).val() );
          $(this).val( rentCurrency.label );
          $('.firstRangeValue.rentBlock', dropdown).val( rentCurrency.value );
          applyPlaceholderRent();
          rentGenerateMax( rentCurrency.value );
        });

        $('.firstBathRangeLabel.rentBlock', dropdown).off('change').on( 'change', function(e) {
          $('.firstBathRangeValue.rentBlock', dropdown).val( $(this).val() );
          applyPlaceholderRentBath( $(this) );
          rentGenerateMaxBath( $(this), parseInt( $(this).val() ) );
        });

        $('.firstBedRangeLabel.rentBlock', dropdown).off('change').on( 'change', function(e) {
          $('.firstBedRangeValue.rentBlock', dropdown).val( $(this).val() );
          applyPlaceholderRentBed( $(this) );
          rentGenerateMaxBed( $(this), parseInt( $(this).val() ) );
        });

        $('.lastRangeLabel.buyBlock', dropdown).off('change').on( 'change', function(e) {
          var buyCurrency = buyCurrencyAmount( $(this).val() );
          $(this).val( buyCurrency.label );
          $('.lastRangeValue.buyBlock', dropdown).val( buyCurrency.value );
          applyPlaceholderBuy();
        });

        $('.lastBathRangeLabel.buyBlock', dropdown).off('change').on( 'change', function(e) {
          $('.lastBathRangeValue.buyBlock', dropdown).val( $(this).val() );
          applyPlaceholderBuyBath( $(this) );
        });

        $('.lastBedRangeLabel.buyBlock', dropdown).off('change').on( 'change', function(e) {
          $('.lastBedRangeValue.buyBlock', dropdown).val( $(this).val() );
          applyPlaceholderBuyBed( $(this) );
        });

        $('.lastBathRangeLabel.rentBlock', dropdown).off('change').on( 'change', function(e) {
          $('.lastBathRangeValue.rentBlock', dropdown).val( $(this).val() );
          applyPlaceholderRentBath( $(this) );
        });

        $('.lastBedRangeLabel.rentBlock', dropdown).off('change').on( 'change', function(e) {
          $('.lastBedRangeValue.rentBlock', dropdown).val( $(this).val() );
          applyPlaceholderRentBed( $(this) );
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

        $('.lastBathRangeLabel.buyBlock', dropdown).off('focus').on( 'focus', function(e) {
          $(this).closest('.sfBathRange').find('.left-side.buyBlock', dropdown).hide();
          $(this).closest('.sfBathRange').find('.right-side.buyBlock', dropdown).show();
        });

        $('.lastBedRangeLabel.buyBlock', dropdown).off('focus').on( 'focus', function(e) {
          $(this).closest('.sfBedRange').find('.left-side.buyBlock', dropdown).hide();
          $(this).closest('.sfBedRange').find('.right-side.buyBlock', dropdown).show();
        });

        $('.lastRangeLabel.rentBlock', dropdown).off('focus').on( 'focus', function(e) {
          $('.left-side.rentBlock', dropdown).hide();
          $('.right-side.rentBlock', dropdown).show();
        });

        $('.lastBathRangeLabel.rentBlock', dropdown).off('focus').on( 'focus', function(e) {
          $(this).closest('.sfBathRange').find('.left-side.rentBlock', dropdown).hide();
          $(this).closest('.sfBathRange').find('.right-side.rentBlock', dropdown).show();
        });

        $('.lastBedRangeLabel.rentBlock', dropdown).off('focus').on( 'focus', function(e) {
          $(this).closest('.sfBedRange').find('.left-side.rentBlock', dropdown).hide();
          $(this).closest('.sfBedRange').find('.right-side.rentBlock', dropdown).show();
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

        $('.firstBathRangeList .buyFormItem', dropdown).off('click').on( 'click', function(e) {
          var selected_min = parseInt( $(this).data('val') );

          if ( !isNaN( selected_min ) && selected_min != 0 ) {
            $(this).closest('.sfBathRange').find('.firstBathRangeValue.buyBlock', dropdown).val( selected_min );
            $(this).closest('.sfBathRange').find('.firstBathRangeLabel.buyBlock', dropdown).val( selected_min );
            $(this).closest('.sfBathRange').find('.firstBathRangeValue.buyBlock', dropdown).val( selected_min );
            applyPlaceholderBuyBath( $(this) );

            buyGenerateMaxBath( $(this), selected_min );

            $(this).closest('.sfBathRange').find('.left-side.buyBlock, .right-side.buyBlock', dropdown).toggle();
          } else {
            $(this).closest('.sfBathRange').find('.firstBathRangeLabel.buyBlock', dropdown).val( 'No Min' );
            $(this).closest('.sfBathRange').find('.firstBathRangeValue.buyBlock', dropdown).val( '' );
            applyPlaceholderBuyBath( $(this) );
            $(this).closest('.sfBathRange').find('.left-side.buyBlock, .right-side.buyBlock', dropdown).toggle();
          }

          if ( $('.lastBathRangeLabel.buyBlock', dropdown).val() && $('.firstBathRangeLabel.buyBlock', dropdown).val() ) {
            $(".dropdown-container .dropdown-list.buyBlock", that).slideUp();
          }

        });

        $('.firstBedRangeList .buyFormItem', dropdown).off('click').on( 'click', function(e) {
          var selected_min = parseInt( $(this).data('val') );

          if ( !isNaN( selected_min ) && selected_min != 0 ) {
            $(this).closest('.sfBedRange').find('.firstBedRangeValue.buyBlock', dropdown).val( selected_min );
            $(this).closest('.sfBedRange').find('.firstBedRangeLabel.buyBlock', dropdown).val( selected_min );
            $(this).closest('.sfBedRange').find('.firstBedRangeValue.buyBlock', dropdown).val( selected_min );
            applyPlaceholderBuyBed( $(this) );

            buyGenerateMaxBed( $(this), selected_min );

            $(this).closest('.sfBedRange').find('.left-side.buyBlock, .right-side.buyBlock', dropdown).toggle();
          } else {
            $(this).closest('.sfBedRange').find('.firstBedRangeLabel.buyBlock', dropdown).val( 'No Min' );
            $(this).closest('.sfBedRange').find('.firstBedRangeValue.buyBlock', dropdown).val( '' );
            applyPlaceholderBuyBed( $(this) );
            $(this).closest('.sfBedRange').find('.left-side.buyBlock, .right-side.buyBlock', dropdown).toggle();
          }

          if ( $('.lastBedRangeLabel.buyBlock', dropdown).val() && $('.firstBedRangeLabel.buyBlock', dropdown).val() ) {
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

        $('.firstBathRangeList .rentFormItem', dropdown).off('click').on( 'click', function(e) {
          var selected_min = parseInt( $(this).data('val') );

          if ( !isNaN( selected_min ) && selected_min != 0 ) {
            $(this).closest('.sfBathRange').find('.firstBathRangeValue.rentBlock', dropdown).val( selected_min );
            $(this).closest('.sfBathRange').find('.firstBathRangeLabel.rentBlock', dropdown).val( selected_min );
            $(this).closest('.sfBathRange').find('.firstBathRangeValue.rentBlock', dropdown).val( selected_min );
            applyPlaceholderRentBath( $(this) );

            rentGenerateMaxBath( $(this), selected_min );

            $(this).closest('.sfBathRange').find('.left-side.rentBlock, .right-side.rentBlock', dropdown).toggle();
          } else {
            $(this).closest('.sfBathRange').find('.firstBathRangeLabel.rentBlock', dropdown).val( 'No Min' );
            $(this).closest('.sfBathRange').find('.firstBathRangeValue.rentBlock', dropdown).val( '' );
            applyPlaceholderRentBath( $(this) );
            $(this).closest('.sfBathRange').find('.left-side.rentBlock, .right-side.rentBlock', dropdown).toggle();
          }

          if ( $('.lastBathRangeLabel.rentBlock', dropdown).val() && $('.firstBathRangeLabel.rentBlock', dropdown).val() ) {
            $(".dropdown-container .dropdown-list.rentBlock", that).slideUp();
          }

        });

        $('.firstBedRangeList .rentFormItem', dropdown).off('click').on( 'click', function(e) {
          var selected_min = parseInt( $(this).data('val') );

          if ( !isNaN( selected_min ) && selected_min != 0 ) {
            $(this).closest('.sfBedRange').find('.firstBedRangeValue.rentBlock', dropdown).val( selected_min );
            $(this).closest('.sfBedRange').find('.firstBedRangeLabel.rentBlock', dropdown).val( selected_min );
            $(this).closest('.sfBedRange').find('.firstBedRangeValue.rentBlock', dropdown).val( selected_min );
            applyPlaceholderRentBed( $(this) );

            rentGenerateMaxBed( $(this), selected_min );

            $(this).closest('.sfBedRange').find('.left-side.rentBlock, .right-side.rentBlock', dropdown).toggle();
          } else {
            $(this).closest('.sfBedRange').find('.firstBedRangeLabel.rentBlock', dropdown).val( 'No Min' );
            $(this).closest('.sfBedRange').find('.firstBedRangeValue.rentBlock', dropdown).val( '' );
            applyPlaceholderRentBed( $(this) );
            $(this).closest('.sfBedRange').find('.left-side.rentBlock, .right-side.rentBlock', dropdown).toggle();
          }

          if ( $('.lastBedRangeLabel.rentBlock', dropdown).val() && $('.firstBedRangeLabel.rentBlock', dropdown).val() ) {
            $(".dropdown-container .dropdown-list.rentBlock", that).slideUp();
          }

        });

        $('.firstRangeLabel.buyBlock', dropdown).focus();
        $('.firstBedRangeLabel.buyBlock', dropdown).focus();
        $('.firstBathRangeLabel.buyBlock', dropdown).focus();

        $('.firstRangeLabel.rentBlock', dropdown).focus();
        $('.firstBedRangeLabel.rentBlock', dropdown).focus();
        $('.firstBathRangeLabel.rentBlock', dropdown).focus();

      }

    });

  };

}( jQuery ));