/**
 *
 */

(function (jQuery, wpp) {

  jQuery.fn.wpp_supermap_search = function wpp_supermap_search(options) {
    console.log('wpp_supermap_search');

    options = 'object' === typeof options ? options : {};

    var $scope = {
      searchElement: this,
      aggregationFields: 'object' === typeof supermapMode ? supermapMode.aggregationFields : {},
      selectOpions: null,
      client: new jQuery.es.Client({hosts: [window.location.host]}),
      _request: false,
      $select: null,
      query: options.query || {"match": {"post_status": "publish"}},
      $apply: function noop() {
      },
      onSelect: options.onSelect || function onSelect() {
      },
    };

    /**
     * Execute search/aggregation queries.
     *
     * @param query
     * @returns {*}
     */
    function select_query(query) {
      debug('select_query', ( query && query.term ? query.term.length : null ));

      var data = [];

      // no query or its too short
      if (!query.term || ( query.term && query.term.length < 2 )) {
        jQuery('.select2-dropdown').addClass("hide");
        return query.callback({results: data});
      }

      jQuery('.select2-dropdown').removeClass("hide");

      if ($scope._request) {
        $scope._request.abort();
      }

      async.auto({
        aggregations: function aggregationRequestWrapper(done) {
          debug('$scope.aggregationFields', $scope.aggregationFields);

          var _source = {
            "query": {"match": {"post_status": "publish"}},
            "aggs": {}
          };

          // @todo Fix issue with current "term" being used when getting new aggregate acounts for doing another search.
          // _source.query = $scope.query;


          // @hack only use first word
          if (query.term.indexOf(' ') > 0) {
            query.term = query.term.split(' ')[0];
          }

          angular.forEach($scope.aggregationFields, function setField(data, key) {

            _source.aggs[key] = {
              filters: {filters: {}},
              aggs: {}
            };

            _source.aggs[key]['filters']['filters'][key] = {term: {}};
            _source.aggs[key]['filters']['filters'][key].term[data.search_field] = query.term.toLowerCase();
            _source.aggs[key]['aggs'][key] = {terms: {field: data.field}}

          });

          $scope._request = $scope.client.search({
            index: 'v5',
            type: 'property',
            method: "POST",
            size: 0,
            headers: {
              "Authorization": make_base_auth("supermap", "oxzydzbx4rn0kcrjyppzrhxouxrgp32n")
            },
            body: _source
          }, select_queryResponse);

          /**
           *
           * @param err
           * @param response
           */
          function select_queryResponse(err, response) {
            debug('select_queryResponse', JSON.stringify(_source), ( response && response.hits ? response.hits.total : null ));

            if (typeof response.hits.hits == 'undefined') {
              //query.callback({ results: data });
              return done(null);
            }

            angular.forEach(response.aggregations, function eachAggregation(someAggregation, aggregationKey) {
              //debug( 'eachAggregation - aggregationKey', aggregationKey )
              // debug( 'eachAggregation - someAggregation', someAggregation )

              var _buckets = [];

              angular.forEach(someAggregation.buckets[aggregationKey][aggregationKey].buckets, function eachBucket(data) {

                var _bucketDetail = $scope.aggregationFields[aggregationKey];

                _buckets.push({
                  id: data.key,
                  text: data.key, // + ' (' + data.doc_count + ')',
                  count: data.doc_count,
                  taxonomy: _bucketDetail['field'],
                  field: _bucketDetail['field'],
                  search_field: _bucketDetail['search_field'],
                  // name is used for fields
                  name: aggregationKey
                })

              });

              if (_buckets.length > 0) {

                data.push({
                  key: aggregationKey,
                  text: $scope.aggregationFields[aggregationKey].title,
                  children: _buckets
                })

              }

            });

            debug('eachAggregation', data);

            done(null, data);

          }


        },
        suggest: function suggestRequestWrapper(done) {

          $scope._request_suggest = $scope.client.suggest({
            index: 'v5',
            type: 'property',
            method: "POST",
            size: 0,
            headers: {
              "Authorization": make_base_auth("supermap", "oxzydzbx4rn0kcrjyppzrhxouxrgp32n")
            },
            body: {
              "regular": {
                "text": query.term.toLowerCase(),
                "completion": {"field": "_search._suggest"}
              },
              "fuzzy": {
                "text": query.term.toLowerCase(),
                "completion": {"field": "_search._suggest", "fuzzy": {"fuzziness": 0}}
              }
            }
          }, suggest_queryResponse);

          /**
           *
           * @param error
           * @param response
           */
          function suggest_queryResponse(error, response) {
            debug('suggest_queryResponse', response);

            if (typeof response.regular == 'undefined') {
              return done(null);
            }

            var data = [];

            angular.forEach(response.regular[0].options, function eachMatch(someMatch, aggregationKey) {
              debug('someMatch', someMatch.payload);

              if (!someMatch.payload) {
                return;
              }

              data.push({
                id: someMatch.payload.id,
                listing_id: someMatch.payload.listing_id,
                score: someMatch.score,
                text: someMatch.text,
                thumbnail_url: someMatch.payload.rets_thumbnail_url,
                location_county: someMatch.payload.location_county,
                location_city: someMatch.payload.location_city,
                //latitude: someMatch.payload.rets_thumbnail_url
              })

            });

            done(null, data.length ? {
              key: 'Listings',
              text: 'Listings',
              children: data
            } : []);

          }


        },
      }, allDone);

      /**
       * Aggration/Suggest requests complete.
       *
       * @param error
       * @param results
       */
      function allDone(error, results) {
        console.log('allDone', error, results);

        query.callback({
          results: [].concat(results.aggregations, results.suggest)
        });

      }

    }

    /**
     * Initialize autocomplete search elements.
     *
     * @param data
     */
    function setup_term_selection(data) {
      debug('setup_term_selection');

      $scope.selectOpions = {
        placeholder: 'Search',
        tags: false,
        maximumSelectionLength: 1,
        minimumInputLength: 3,
        templateResult: function templateResult(result, element) {
          console.log('templateResult', result)
          //jQuery(result.text).addClass('lasdfjdlsakfj');
          return result.text;
        },
        templateSelection: function templateSelection(selection, element) {
          console.log('templateSelection', selection)
          //jQuery(result.text).addClass('lasdfjdlsakfj');
          return selection.text;
        },
        data: data || [],
        query: select_query,
        formatResult: function formatResult(field) {
          console.log('field', field);

          return field;

        }
      };

      var $select = $scope.$select = jQuery($scope.searchElement).select2($scope.selectOpions);

      /**
       *
       * map_filter_taxonomy
       * sm_current_terms
       *
       */
      $select.on('select2:select', function onSelect(event) {
        debug('onSelect', event.params.data);

        var data = $select.select2('data');

        $scope.onSelect.call($scope, event.params.data);

        // specific listing found via suggest. @todo make this popup in new window
        if (event.params.data.listing_id && event.params.data.id) {

          // if we have a city, set it as our search term. @todo make this work smoother.
          if (event.params.data.location_city) {
            // window.setTimeout(function() {jQuery('.select2-selection__choice').html('<span class="select2-selection__choice__remove" role="presentation">×</span>' + event.params.data.location_city);}, 200 );
            //selectOpions.data = [ event.params.data.location_city ];
            //$select = jQuery('.termsSelection').select2( $scope.selectOpions);
          }

          // open listing in new window
          window.open('/listing/' + event.params.data.id);

          return;
        }

        if (window.sm_current_terms && window.sm_current_terms) {
          window.sm_current_terms.values = [data[0].id];
        }

        // $scope.fix_terms();

        //debug( 'onSelect:result. $scope.map_filter_taxonomy', $scope.map_filter_taxonomy );
        //debug( 'onSelect:result. window.sm_current_terms', window.sm_current_terms );

        //$scope.query.bool.must.push({"terms": {}});

        $scope.$apply();

      });

      /**
       * Donta allow more than one selection.
       *
       */
      $select.on('select2:selecting', function onSelecting(event) {
        debug('onSelecting', $select.select2('val'), event.params);

        $select.select2('val', {});

        if ($select.select2('val') != null && $select.select2('val').length > 0) {
          $select.select2('val', {});
        }

      });

      if (window.sm_current_terms && window.sm_current_terms.values && window.sm_current_terms.values.length) {
        var $option = jQuery('<option selected>Loading...</option>').val(window.sm_current_terms.values[0]).text(window.sm_current_terms.values[0]);
        $select.append($option).trigger('change');
        debug('taxonomy=' + window.sm_current_terms.key + ' value=' + window.sm_current_terms.values[0]);
      }

      //$scope.fix_terms();

    }

    setup_term_selection();

  }

  /**
   * Debug Helper
   *
   */
  function debug() {
    var _args = [].slice.call(arguments);
    // _args.unshift( 'jquery-search-form' );
    console.debug.apply(console, _args);
  }

  /**
   * Map resize function
   *
   */
  function map_resize() {
    if (jQuery(window).width() < 992) {
      jQuery('.wpp-advanced-supermap, .sm-properties-list-wrap, ng-map').height('auto');
      jQuery('.sm-scrollable-table > div').height('100%');
      jQuery('.sm-properties-grid').height('100%');
    } else {
      var height = jQuery(window).height() - jQuery("#header").height() + 29;
      if (height < 400) {
        height = 400;
      }
      jQuery('.wpp-advanced-supermap, .sm-properties-list-wrap, ng-map').height(height);
      jQuery('.sm-scrollable-table > div').height(height - 303);
      jQuery('.sm-properties-grid').height(height - 103);
    }
    console.log('map height: ', jQuery('.wpp-advanced-supermap').height());
  }

  /**
   *
   * @param options
   */
  jQuery.fn.wpp_advanced_supermap = function (options) {

    var ngAppDOM = jQuery(this);

    /** Making variables public */
    var vars = jQuery.extend({
      'ng_app': false,
      'query': false,
      'atts': false
    }, options);

    if (!vars.ng_app) {
      debug('wpp_advanced_supermap: ng_app is undefined!');
      return;
    }

    if (!vars.query) {
      debug('wpp_advanced_supermap: query is undefined!');
      return;
    }

    // Prepare DOM before initialize angular.

    vars.atts = vars.atts ? unserialize(decodeURIComponent(vars.atts).replace(/\+/g, " ")) : {};

    if (typeof vars.atts.map_height !== 'undefined') {
      ngAppDOM.css('height', vars.atts.map_height);
      jQuery('ng-map', ngAppDOM).css('height', vars.atts.map_height);
      jQuery('.sm-properties-list-wrap', ngAppDOM).css('height', vars.atts.map_height);
      jQuery('.sm-properties-list-wrap', ngAppDOM).show();
    }

    function setStatus(status) {
      debug('setStatus', status);
      ngAppDOM.data('status', status);
      ngAppDOM.addClass('status-' + status);
    }

    setStatus('loading');

    /**
     * Be sure our module App is shown
     */
    ngAppDOM.show();

    /**
     * Angular Module.
     */
    angular.module(vars.ng_app, ['ngMap', 'smart-table', 'ngSanitize'])

    /**
     * Autocomplete directive.
     * It requires jQuery UI.
     *
     * It's not used for the current advanced View,
     * but can be used for custom solutions as well!
     */
      .directive('autoComplete', function ($timeout) {
        return function (scope, iElement, iAttrs) {
          var uiItems = iAttrs.uiItems;
          var source;
          uiItems = uiItems.split('.');

          for (var i = 0; i < uiItems.length; i++) {
            if (!source) {
              if (typeof scope[uiItems[i]] !== 'undefined') {
                source = scope[uiItems[i]];
              } else {
                break;
              }
            } else if (typeof source[uiItems[i]] !== 'undefined') {
              source = source[uiItems[i]];
            } else {
              break;
            }
          }

          if (!source || !source.length > 0) {
            debug('error on trying to get source for autoComplete directive');
            return null;
          }
          iElement.autocomplete({
            source: source
          });
        };
      })

      .filter('simpleAmount', function () {
        return function (int) {
          if (!int || int == 0) return '';
          int = Math.round(int / 1000) * 1000
          if (!String(int).length) return '';
          return '$' + ( int / 1000 ) + 'k';
        };
      })

      .filter('numberFormat', function () {
        return function (int) {
          if (!int || int == 0) return '';
          if (!String(int).length) return '';
          return '$' + ( int );
        };
      })

      .filter('acreage', function () {
        return function (int) {
          return int > 1 ? int + ' acres' : int + ' acre';
        };
      })

      .directive('clickOut', ['$window', '$parse', function ($window, $parse) {
        return {
          restrict: 'A',
          link: function (scope, element, attrs) {
            var clickOutHandler = $parse(attrs.clickOut);

            angular.element($window).on('click', function (event) {
              if (element[0].contains(event.target)) return;
              clickOutHandler(scope, {$event: event});
              scope.$apply();
            });
          }
        };
      }])

      .directive('onlyDigits', function () {
        return {
          restrict: 'A',
          require: '?ngModel',
          link: function (scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
              if (inputValue == undefined) return '';
              var transformedInput = inputValue.replace(/[^0-9]/g, '');
              if (transformedInput !== inputValue) {
                modelCtrl.$setViewValue(transformedInput);
                modelCtrl.$render();
              }
              return transformedInput;
            });
          }
        };
      })

      .controller('main', ['$document', '$scope', '$http', '$filter', 'NgMap', function ($document, $scope, $http, $filter, NgMap) {

        var resizeTimer, idle_listener;

        jQuery(window).on('resize', function () {
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            NgMap.getMap().then(function (map) {
              google.maps.event.trigger(map, "resize");
            });
          }, 250);
        }).resize();

        $scope.getAvailabilityDate = function getAvailabilityDate() {
          var d = new Date();
          return d.getFullYear() + '-' + (("0" + (d.getMonth() + 1)).slice(-2)) + "-" + (("0" + (d.getDate())).slice(-2));
        }


        $scope.is_agency_listing = function () {
          // debug( 'is_agency_listing', current );

          return $scope.current_filter.agency_listing;

        };

        /**
         * Configure query based on URI parameters.
         *
         */
        function setFiltersFromQuery() {
          debug('setFiltersFromQuery', $scope.query.bool.must)

          if (window.location.pathname.indexOf('our-listings') > 0) {
            debug('setFiltersFromQuery', 'fetching agency listings');
            $scope.current_filter.agency_listing = true;
            $scope.query.bool.must.push({"terms": {"_system.agency_listing": ["true"]}});
          } else {
            $scope.current_filter.agency_listing = false;
          }

          if (getParameterByName('wpp_search[price][min]') || getParameterByName('wpp_search[price][max]')) {
            debug('setFiltersFromQuery Setting [price]')

            $scope.current_filter.price = {
              min: getParameterByName('wpp_search[price][min]') || null,
              max: getParameterByName('wpp_search[price][max]') || null,
            };

            $scope.query.bool.must.push({
              "range": {
                "tax_input.price": {
                  gte: $scope.current_filter.price.min,
                  lte: $scope.current_filter.price.max
                }
              }
            });
          }

          $scope.current_filter.bathrooms = $scope.current_filter.bathrooms || {
              min: getParameterByName('wpp_search[bathrooms][min]') || null,
              max: getParameterByName('wpp_search[bathrooms][max]') || null
            };

          $scope.current_filter.bedrooms = $scope.current_filter.bedrooms || {
              min: getParameterByName('wpp_search[bedrooms][min]') || null,
              max: getParameterByName('wpp_search[bedrooms][max]') || null
            };

          // set sale_type if we have query override, something else seems to be setting its default
          if (getParameterByName('wpp_search[sale_type]')) {
            $scope.current_filter.sale_type = getParameterByName('wpp_search[sale_type]')
          }

          $scope.current_filter.available_date = $scope.current_filter.available_date || $scope.getAvailabilityDate();

          $scope.selected_sale_types = $scope.current_filter.sale_type.split(',');

          debug('setFiltersFromQuery', '$scope.current_filter', $scope.current_filter);

        }

        setStatus('invoked');

        $scope.query = unserialize(decodeURIComponent(vars.query).replace(/\+/g, " "));
        $scope.atts = vars.atts;
        $scope.total = 0;
        $scope.loaded = false;
        $scope.error = false;
        $scope.properties = [];
        $scope.propertiesTableCollection = [];
        $scope.wpp = wpp;
        $scope.dynMarkers = [];
        $scope.latLngs = [];
        $scope.per_page = typeof $scope.atts.per_page !== 'undefined' ? $scope.atts.per_page : 10;
        $scope.searchForm = false;
        $scope.loadNgMapChangedEvent = false;
        $scope.loading_more_properties = true;

        $scope.map_filter_taxonomy = window.sm_current_terms.key || '';
        $scope.current_filter = window.sm_current_filter || {};
        $scope.tax_must_query = window.sm_must_tax_query || {};

        $scope.haveImages = function haveImages() {
          return true;
        }


        $scope.view = {
          mode: {
            table: ( 'object' === typeof supermapMode && supermapMode.isMobile ) ? false : true,
            preview: ( 'object' === typeof supermapMode && supermapMode.isMobile ) ? true : false,
          },
          toggle: function () {
            this.mode.table = !this.mode.table;
            this.mode.preview = !this.mode.preview;
            setTimeout(function () {
              jQuery(document).trigger('rdc_cols_changed');
            }, 100);
          },
          set: function (mode) {
            for (var i in this.mode) {
              if (this.mode[i] == true) {
                this.mode[i] = false;
              }
            }
            this.mode[mode] = true;
            this.toggleActive(mode);
            setTimeout(function () {
              jQuery(document).trigger('rdc_cols_changed');
            }, 100);
          },
          toggleActive: function (mode) {
            var list_wrapper = jQuery('.sm-properties-list-wrap .sm-list-controls');
            if (mode == 'table') {
              list_wrapper.find('li.sm-table').addClass('active');
              list_wrapper.find('li.sm-preview').removeClass('active');
            } else {
              list_wrapper.find('li.sm-table').removeClass('active');
              list_wrapper.find('li.sm-preview').addClass('active');
            }
          }
        };

        $scope._request = null;

        $scope.columns = {
          post_title: {
            label: 'Address',
            enable: 1
          },
          subdivision: {
            label: 'Subdivision',
            enable: 0
          },
          city: {
            label: 'City',
            enable: 1
          },
          bedrooms: {
            label: 'Beds',
            enable: 1
          },
          bathrooms: {
            label: 'Baths',
            enable: 1
          },
          total_living_area_sqft: {
            label: 'Sq.Ft.',
            enable: 1
          },
          approximate_lot_size: {
            label: 'Lot',
            enable: 0
          },
          price: {
            label: 'Price',
            enable: 1
          },
          price_per_sqft: {
            label: '$/Sq.Ft.',
            enable: 0
          },
          sale_type: {
            label: 'Sale',
            enable: 0
          },
          days_on_market: {
            label: 'Days',
            enable: 0
          },
        };

        $scope.show_dropdown_columns = false;

        /**
         *
         * @param current
         * @returns {boolean}
         */

        $scope.sale_type_checked = function (current) {
          var _types = [];
          if (_types = $scope.current_filter.sale_type.split(',')) {
            for (var i in _types) {
              if (_types[i] == current) return true;
            }
          }
          return false;
        };

        /**
         * Checking sale type for price selectors
         */
        $scope.sale_type_price = function () {
          var sale_type = [];
          jQuery('.rdc-sale-types ul li input:checkbox:checked').each(function () {
            sale_type.push(jQuery(this).val());
          });
          $scope.selected_sale_types = sale_type;
          $scope.$apply();
        };

        /**
         * Price mode
         *
         * @param sale_type
         */
        $scope.priceModeFormat = function priceModeFormat(mode) {
          if ($scope.selected_sale_types.length !== 1) {
            switch (mode) {
              case 'Sale':
                return true;
                break;
              case 'Rent':
                return false;
                break;
            }
          } else {
            for (var i in $scope.selected_sale_types) {
              if ($scope.selected_sale_types[i] == mode) {
                return true;
              }
            }
          }
          return false;
        };

        $document.bind('click', function (event) {
          $scope.show_dropdown_columns = false;
          $scope.$apply();
        });

        /**
         * Sale pricing
         *
         * @type {{min: $scope.salePricing.min, max: $scope.salePricing.max}}
         */
        $scope.salePricing = window.salePricing = {

          mode: false,

          current_min: '',
          current_max: '',
          current_min_label: '',
          current_max_label: '',

          min_prices: [25000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000],
          max_prices: [75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 600000, 700000],


          click_out: function (e) {
            if (!angular.element(e.target).hasClass('price-input')) {
              this.mode = '';
            }
          },

          format: function (target, mode) {
            if (!$scope.current_filter.price) {
              $scope.current_filter.price = {
                min: 0,
                max: 0
              }
            }
            $scope.current_filter.price[mode] = Math.round(parseInt(jQuery(target).val()) / 1000) * 1000;
            if (mode == 'min') {
              this.current_min = Math.round(parseInt(jQuery(target).val()) / 1000) * 1000;
            } else {
              this.current_max = Math.round(parseInt(jQuery(target).val()) / 1000) * 1000;
            }
          },

          set_min: function (_price) {
            if (!$scope.current_filter.price) {
              $scope.current_filter.price = {
                min: 0,
                max: 0
              }
            }
            this.current_min = _price;
            $scope.current_filter.price.min = _price;
            this.recalculate();
            this.mode = 'max';
          },

          set_max: function (_price) {
            if (!$scope.current_filter.price) {
              $scope.current_filter.price = {
                min: 0,
                max: 0
              }
            }
            this.current_max = _price;
            $scope.current_filter.price.max = _price;
            this.mode = false;
          },

          recalculate: function () {
            var j;
            j = typeof this.current_min == 'number' ? this.current_min : 0;
            for (var i in this.max_prices) {
              this.max_prices[i] = j += 25000;
            }
          },

          focus: function (mode) {
            this.mode = mode;
          }
        };

        /**
         * Rent pricing
         *
         * @type {{min: $scope.rentPricing.min, max: $scope.rentPricing.max}}
         */
        $scope.rentPricing = window.rentPricing = {

          mode: false,

          current_min: '',
          current_max: '',
          current_min_label: '',
          current_max_label: '',

          min_prices: [750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000],
          max_prices: [1750, 2000, 2250, 2500, 2750, 3000, 3250, 3500, 3750, 4000],


          click_out: function (e) {
            if (!angular.element(e.target).hasClass('price-input')) {
              this.mode = '';
            }
          },

          format: function (target, mode) {
            if (!$scope.current_filter.price) {
              $scope.current_filter.price = {
                min: 0,
                max: 0
              }
            }
            $scope.current_filter.price[mode] = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
            if (mode == 'min') {
              this.current_min = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
            } else {
              this.current_max = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
            }
          },

          set_min: function (_price) {
            if (!$scope.current_filter.price) {
              $scope.current_filter.price = {
                min: 0,
                max: 0
              }
            }
            this.current_min = _price;
            $scope.current_filter.price.min = _price;
            this.recalculate();
            this.mode = 'max';
          },

          set_max: function (_price) {
            if (!$scope.current_filter.price) {
              $scope.current_filter.price = {
                min: 0,
                max: 0
              }
            }
            this.current_max = _price;
            $scope.current_filter.price.max = _price;
            this.mode = false;
          },

          recalculate: function () {
            var j;
            j = typeof this.current_min == 'number' ? this.current_min : 0;
            for (var i in this.max_prices) {
              this.max_prices[i] = j += 250;
            }
          },

          focus: function (mode) {
            this.mode = mode;
          }
        };


        /**
         *
         * @type {{min_feet: number[], max_feet: number[]}}
         */
        $scope.footage = window.footage = {
          mode: false,

          current_min: '',
          current_max: '',
          current_min_label: '',
          current_max_label: '',

          min_foot: [500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000],
          max_foot: [2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000, 8000, 10000],

          click_out: function (e) {
            if (!angular.element(e.target).hasClass('feet-input')) {
              this.mode = '';
            }
          },

          format: function (target, mode) {
            if (!$scope.current_filter.feet) {
              $scope.current_filter.feet = {
                min: '',
                max: ''
              }
            }
            $scope.current_filter.feet[mode] = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
            if (mode == 'min') {
              this.current_min = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
            } else {
              this.current_max = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
            }
          },

          set_min: function (_price) {
            if (!$scope.current_filter.feet) {
              $scope.current_filter.feet = {
                min: '',
                max: ''
              }
            }
            this.current_min = _price;
            $scope.current_filter.feet.min = _price;
            this.recalculate(_price);
            this.mode = 'max';
          },

          set_max: function (_price) {
            if (!$scope.current_filter.feet) {
              $scope.current_filter.feet = {
                min: '',
                max: ''
              }
            }
            this.current_max = _price;
            $scope.current_filter.feet.max = _price;
            this.mode = false;
          },

          recalculate: function (current) {
            var j;
            j = typeof (current * 1) == 'number' ? current * 1 : 0;
            for (var i in this.max_foot) {
              this.max_foot[i] = j += 500;
            }
          },

          focus: function (mode) {
            this.mode = mode;
          }
        };

        /**
         *
         * @type {{min_bedroom: number[], max_bedroom: number[]}}
         */
        $scope.bedrange = window.bedrange = {
          mode: false,

          current_min: '',
          current_max: '',
          current_min_label: '',
          current_max_label: '',

          min_bedroom: [1, 2, 3, 4, 5, 6],
          max_bedroom: [3, 4, 5, 6, 7, 8],

          click_out: function (e) {
            if (!angular.element(e.target).hasClass('bed-input')) {
              this.mode = '';
            }
          },

          format: function (target, mode) {
            if (!$scope.current_filter.bedrooms) {
              $scope.current_filter.bedrooms = {
                min: '',
                max: ''
              }
            }
            $scope.current_filter.bedrooms[mode] = Math.round(parseInt(jQuery(target).val()));
            if (mode == 'min') {
              this.current_min = Math.round(parseInt(jQuery(target).val()));
            } else {
              this.current_max = Math.round(parseInt(jQuery(target).val()));
            }
            this.set_min(this.current_min);
            this.set_max(this.current_max);
          },

          set_min: function (_price) {
            if (!$scope.current_filter.bedrooms) {
              $scope.current_filter.bedrooms = {
                min: '',
                max: ''
              }
            }
            this.current_min = _price;
            $scope.current_filter.bedrooms.min = _price;
            this.recalculate(_price);
            this.mode = 'max';
          },

          set_max: function (_price) {
            if (!$scope.current_filter.bedrooms) {
              $scope.current_filter.bedrooms = {
                min: '',
                max: ''
              }
            }
            this.current_max = _price;
            $scope.current_filter.bedrooms.max = _price;
            this.mode = false;
          },

          recalculate: function (current) {
            var j;
            j = typeof (current * 1) == 'number' ? current * 1 : 0;
            for (var i in this.max_bedroom) {
              this.max_bedroom[i] = j += 1;
            }
          },

          focus: function (mode) {
            this.mode = mode;
          }
        };

        /**
         *
         * @type {{min_bathroom: number[], max_bathroom: number[]}}
         */
        $scope.bathrange = window.bathrange = {
          mode: false,

          current_min: '',
          current_max: '',
          current_min_label: '',
          current_max_label: '',

          min_bathroom: [1, 2, 3, 4, 5, 6],
          max_bathroom: [3, 4, 5, 6, 7, 8],

          click_out: function (e) {
            if (!angular.element(e.target).hasClass('bath-input')) {
              this.mode = '';
            }
          },

          format: function (target, mode) {
            if (!$scope.current_filter.bathrooms) {
              $scope.current_filter.bathrooms = {
                min: '',
                max: ''
              }
            }
            $scope.current_filter.bathrooms[mode] = Math.round(parseInt(jQuery(target).val()));
            if (mode == 'min') {
              this.current_min = Math.round(parseInt(jQuery(target).val()));
            } else {
              this.current_max = Math.round(parseInt(jQuery(target).val()));
            }
            this.set_min(this.current_min);
            this.set_max(this.current_max);
          },

          set_min: function (_price) {
            if (!$scope.current_filter.bathrooms) {
              $scope.current_filter.bathrooms = {
                min: '',
                max: ''
              }
            }
            this.current_min = _price;
            $scope.current_filter.bathrooms.min = _price;
            this.recalculate(_price);
            this.mode = 'max';
          },

          set_max: function (_price) {
            if (!$scope.current_filter.bathrooms) {
              $scope.current_filter.bathrooms = {
                min: '',
                max: ''
              }
            }
            this.current_max = _price;
            $scope.current_filter.bathrooms.max = _price;
            this.mode = false;
          },

          recalculate: function (current) {
            var j;
            j = typeof (current * 1) == 'number' ? current * 1 : 0;
            for (var i in this.max_bathroom) {
              this.max_bathroom[i] = j += 1;
            }
          },

          focus: function (mode) {
            this.mode = mode;
          }
        };

        /**
         *
         * @type {{min_feet: number[], max_feet: number[]}}
         */
        $scope.acrage = window.acrage = {
          mode: false,

          current_min: '',
          current_max: '',
          current_min_label: '',
          current_max_label: '',

          min_acres: [0.25, 0.50, 0.75, 1, 5, 10, 20, 30, 50, 60],
          max_acres: [0.75, 1, 5, 10, 20, 30, 40, 50, 60, 70],

          click_out: function (e) {
            if (!angular.element(e.target).hasClass('acres-input')) {
              this.mode = '';
            }
          },

          format: function (target, mode) {
            if (!$scope.current_filter.acrage) {
              $scope.current_filter.acrage = {
                min: '',
                max: ''
              }
            }
            $scope.current_filter.acrage[mode] = Math.round(parseInt(jQuery(target).val()));
            if (mode == 'min') {
              this.current_min = Math.round(parseInt(jQuery(target).val()));
            } else {
              this.current_max = Math.round(parseInt(jQuery(target).val()));
            }
            this.set_min(this.current_min);
            this.set_max(this.current_max);
          },

          set_min: function (_price) {
            if (!$scope.current_filter.acrage) {
              $scope.current_filter.acrage = {
                min: '',
                max: ''
              }
            }
            this.current_min = _price;
            $scope.current_filter.acrage.min = _price;
            this.recalculate(_price);
            this.mode = 'max';
          },

          set_max: function (_price) {
            if (!$scope.current_filter.acrage) {
              $scope.current_filter.acrage = {
                min: '',
                max: ''
              }
            }
            this.current_max = _price;
            $scope.current_filter.acrage.max = _price;
            this.mode = false;
          },

          recalculate: function (current) {
            current = current * 1;
            for (var i in this.max_acres) {
              if (this.min_acres[parseInt(this.min_acres.indexOf(current)) + parseInt(i) + 1]) {
                this.max_acres[i] = this.min_acres[parseInt(this.min_acres.indexOf(current)) + parseInt(i) + 1];
              } else {
                if (this.max_acres[i - 1]) {
                  this.max_acres[i] = this.max_acres[i - 1] + 10;
                } else {
                  this.max_acres[i] = current + 10;
                }
              }
            }
          },

          focus: function (mode) {
            this.mode = mode;
          }
        };

        /**
         * Defines which fields to use for search vs display when aggregating
         */
        $scope.aggregationFields = 'object' === typeof supermapMode ? supermapMode.aggregationFields : {}

        /**
         *
         * @returns {number}
         */
        $scope.pagination_colspan = function () {
          var i = 0;
          for (var f in $scope.columns) {
            i += $scope.columns[f].enable;
          }
          return i;
        };

        setFiltersFromQuery();


        var index = 'v5',
          type = 'property';

        /**
         * @type {$.es.Client|*}
         */
        var client = new jQuery.es.Client({
          hosts: [
            window.location.host,
            //'dori-us-east-1.searchly.com'
          ]
        });

        /**
         *
         * @param r
         */
        function cast_fields(r) {
          r._source.tax_input.price[0] = parseInt(r._source.tax_input.price[0]);
          r._source.tax_input.total_living_area_sqft[0] = parseInt(r._source.tax_input.total_living_area_sqft[0]);
          r._source.tax_input.days_on_market[0] = parseInt(r._source.tax_input.days_on_market[0]);
          r._source.tax_input.added[0] = parseInt(calculate_days(r._source.tax_input.added[0]));

          if (typeof r._source.tax_input.price_per_sqft != 'undefined') {
            r._source.tax_input.price_per_sqft[0] = parseFloat(r._source.tax_input.price_per_sqft[0]);
          } else {
            r._source.tax_input.price_per_sqft = [0];
          }

          r._source.tax_input.approximate_lot_size[0] = parseFloat(r._source.tax_input.approximate_lot_size[0]);

          if (r._source.meta_input && r._source.meta_input.rets_thumbnail_url) {
            r.rets_thumbnail_url = r._source.meta_input.rets_thumbnail_url.replace('.JPG', '-270x280.jpg');
          }

          //icon html and template
          r.current_total_living_area_sqft = '<i class="icon-wpproperty-attribute-size-solid"></i>' + parseInt(r._source.tax_input.total_living_area_sqft[0]) + ' SqFt';
          r.current_approximate_lot_size = '<i class="icon-wpproperty-attribute-lotsize-solid"></i>' + parseFloat(r._source.tax_input.approximate_lot_size[0]) + ' Acres';
          r.current_bedrooms = '<i class="icon-wpproperty-attribute-bedroom-solid"></i>' + parseFloat(r._source.tax_input.bedrooms[0]) + ' Beds';
          r.current_bathrooms = '<i class="icon-wpproperty-attribute-bathroom-solid"></i>' + parseFloat(r._source.tax_input.bathrooms[0]) + ' Baths';
        }

        function calculate_days(date) {
          if (date != 'undefined' && date != null) {
            var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
            var firstDate = new Date(date);
            var currentDate = new Date();

            return Math.round(Math.abs((firstDate.getTime() - currentDate.getTime()) / (oneDay)));
          } else {
            return 0;
          }
        }

        /**
         *
         * @param int
         * @returns {string}
         */
        var currencyAmount = function (int) {
          var int = Math.round(parseInt(int.toString().replace(/,/g, "")) / 5000) * 5000;
          var cur = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          return {value: int, label: cur != 'NaN' ? cur : ''};
        };


        /**
         *
         * Return meta values for map
         */
        $scope.get_map_metadata_url = jQuery('meta[name="searchly"]').attr('data-url');
        $scope.get_map_metadata_user = jQuery('meta[name="searchly"]').attr('data-user');
        $scope.get_map_metadata_password = jQuery('meta[name="searchly"]').attr('data-password');

        /**
         *
         * @returns {*|{}}
         */
        function build_query() {
          // maybe alter something
          if (!angular.isArray($scope.query.bool.must_not)) {
            $scope.query.bool.must_not = [];
          }
          $scope.query.bool.must_not = $scope.query.bool.must_not.concat([
            {
              "term": {
                "tax_input.location_latitude": "0"
              }
            },
            {
              "term": {
                "tax_input.location_longitude": "0"
              }
            },
            {
              "missing": {
                "field": "tax_input.location_latitude"
              }
            },
            {
              "missing": {
                "field": "tax_input.location_longitude"
              }
            }
          ]);
          return JSON.stringify($scope.query);
        }

        /**
         *
         */
        function getMoreProperties() {
          if ($scope._request) {
            $scope._request.abort();
          }

          var search_form = jQuery('.sm-search-form form');

          search_form.addClass('processing');
          $scope.toggleSearchButton();
          $scope._request = client.search({
            index: index,
            type: type,
            method: "GET",
            headers: {
              "Authorization": make_base_auth($scope.get_map_metadata_user, $scope.get_map_metadata_password)
            },
            source: '{"query":' + build_query() + ',"_source": ' + JSON.stringify($scope.atts.fields.split(',')) + ', "size":800,"sort":[{"_system.agency_listing":{"order":"asc"}},{"post_title":{"order":"asc"}}],"from":' + $scope.properties.length + '}',
          }, function (error, response) {

            setStatus('ready');

            if (!error) {

              if (typeof response.hits.hits == 'undefined') {
                debug('Error occurred during getting properties data.');
              } else {
                $scope.total = response.hits.total;
                response.hits.hits.filter(cast_fields);
                Array.prototype.push.apply($scope.properties, response.hits.hits);
                $scope.refreshMarkers(false);

                if (!$scope.loadNgMapChangedEvent) {
                  $scope.loadNgMapChangedEvent = true;
                  $scope.addMapChanged($scope.properties);
                }

                if ($scope.total > $scope.properties.length) {
                  if ($scope.loading_more_properties) {
                    getMoreProperties();
                  }
                } else {
                  search_form.removeClass('mapChanged');
                }
              }
              $scope.col_changed();
            } else {
              console.error(error);
              search_form.removeClass('mapChanged');
            }
            search_form.removeClass('processing');
            $scope.toggleSearchButton();
          });
        }

        /**
         * toggle search filter button loading icon and search icon
         */
        $scope.toggleSearchButton = function () {
          var button_icon_desktop = jQuery('.sm-search-filter').find('i');
          var button_icon_mobile = jQuery('.mobile-toggle-search-icon').find('i');
          if (jQuery('.sm-search-form form').hasClass('processing')) {
            button_icon_desktop.addClass("icon-wpproperty-interface-time-outline");
            button_icon_desktop.removeClass("icon-wpproperty-interface-search-solid");
            button_icon_mobile.addClass("icon-wpproperty-interface-time-outline");
            button_icon_mobile.removeClass("icon-wpproperty-interface-search-solid");
          } else {
            button_icon_desktop.removeClass("icon-wpproperty-interface-time-outline");
            button_icon_desktop.addClass("icon-wpproperty-interface-search-solid");
            button_icon_mobile.removeClass("icon-wpproperty-interface-time-outline");
            button_icon_mobile.addClass("icon-wpproperty-interface-search-solid");
          }
        };

        /**
         * Get Properties by provided Query ( filter )
         */
        $scope.getProperties = function getProperties() {

          if ($scope._request) {
            $scope._request.abort();
          }

          var search_form = jQuery('.sm-search-form form');

          search_form.addClass('processing');
          $scope.toggleSearchButton();

          $scope.fix_terms();

          $scope._request = client.search({
            index: index,
            type: type,
            method: "GET",
            headers: {
              "Authorization": make_base_auth($scope.get_map_metadata_user, $scope.get_map_metadata_password)
            },
            source: '{"query":' + build_query() + ',"_source": ' + JSON.stringify($scope.atts.fields.split(',')) + ', "size":500,"sort":[{"_system.agency_listing":{"order":"asc"}},{"post_title":{"order":"asc"}}]}',
          }, function (error, response) {
            // debug('searchResponse query: [%s], hits [%s]', build_query(), response.hits.total);

            setStatus('ready');

            if (!error) {
              jQuery('.sm-search-layer', ngAppDOM).show();

              $scope.loaded = true;

              if (typeof response.hits.hits == 'undefined') {
                debug('Error occurred during getting properties data.');
              } else {
                response.hits.hits.filter(cast_fields);
                $scope.total = response.hits.total;
                $scope.properties = response.hits.hits;
                // Select First Element of Properties Collection
                if ($scope.properties.length > 0) {
                  $scope.currentProperty = $scope.properties[0];
                  $scope.properties[0].isSelected = true;
                  $scope.loadImages($scope.properties[0]);
                  // $scope.refreshMarkers(true);
                  $scope.refreshMarkers(search_form.hasClass('mapChanged') ? false : true);
                } else {
                  $scope.refreshMarkers(false);
                }

                if ($scope.total > $scope.properties.length) {
                  if (!$scope.loading_more_properties) {
                    $scope.loading_more_properties = true;
                  }
                  getMoreProperties();
                  if (!$scope.loadNgMapChangedEvent) {
                    $scope.loadNgMapChangedEvent = true;
                    $scope.addMapChanged($scope.properties);
                  }
                  search_form.removeClass('mapChanged');
                }
              }
              $scope.col_changed();
            } else {
              console.error(error);
              search_form.removeClass('mapChanged');
            }

            search_form.removeClass('processing');

            $scope.toggleSearchButton();

          });

        };

        $scope.clean_up = function clean_up() {
          debug('clean_up');

          // debug phantom infowindow in corner... I think ngmap adds it.
          if (jQuery('.gm-style-iw').length) {
            console.log("Found random infowindow!", jQuery('.gm-style-iw'));
            jQuery('.gm-style-iw').parent().hide();
          }

          // make sure not collapsed.
          if (jQuery('.sm-table-header').length) {
          }
        }

        /**
         *
         */
        $scope.col_changed = function () {
          jQuery(document).trigger('rdc_cols_changed');
        };

        /**
         * map zoom or drag event listener for search results refresh
         */
        $scope.addMapChanged = function addMapChanged(properties_data) {
          debug('addMapChanged');

          NgMap.getMap().then(function (map) {

            if ('object' === typeof supermapMode && supermapMode.isMobile == true) {
              return false;
            }

            idle_listener = map.addListener('idle', function () {
              var bounds = map.getBounds();
              var zoom = map.getZoom();
              if (zoom > 4) {
                var SouthWestLatitude = bounds.getSouthWest().lat();
                var NorthEastLatitude = bounds.getNorthEast().lat();
                var NorthEastLongitude = bounds.getNorthEast().lng();
                var SouthWestLongitude = bounds.getSouthWest().lng();
                if (( SouthWestLatitude != 0 && NorthEastLatitude != 0 ) && ( SouthWestLongitude != 180 && NorthEastLongitude != -180 )) {
                  jQuery('.rdc-latitude-gte').val(SouthWestLatitude);
                  jQuery('.rdc-latitude-lte').val(NorthEastLatitude);
                  jQuery('.rdc-longitude-gte').val(NorthEastLongitude);
                  jQuery('.rdc-longitude-lte').val(SouthWestLongitude);
                }
              } else {
                $scope.resetMapBounds();
              }
              jQuery('.sm-search-form form').addClass('mapChanged');
              jQuery('.sm-search-form form').submit();

            });
          });
        };

        $scope.resetMapBounds = function resetMapBounds() {
          jQuery('.rdc-latitude-gte').val('');
          jQuery('.rdc-latitude-lte').val('');
          jQuery('.rdc-longitude-gte').val('');
          jQuery('.rdc-longitude-lte').val('');
        };

        $document.bind("st_sort_done", function () {
          if ($scope.propertiesTableCollection.length > 0) {
            $scope.selectRow($scope.propertiesTableCollection[0]);
          }
        });


        /**
         * Refresh Markers ( Marker Cluster ) on Google Map
         */
        $scope.refreshMarkers = function refreshMarkers(update_map_pos) {

          NgMap.getMap().then(function (map) {
            $scope.dynMarkers = [];
            $scope.latLngs = [];

            // Clears all clusters and markers from the clusterer.
            if (typeof $scope.markerClusterer == 'object') {
              $scope.markerClusterer.clearMarkers();
            }

            if (typeof $scope.infoBubble !== 'object') {

              $scope.infoBubble = new google.maps.InfoWindow({
                map: map,
                maxWidth: 300,
                shadowStyle: 1,
                padding: 0,
                backgroundColor: '#f3f0e9',
                borderRadius: 4,
                arrowSize: 2,
                borderWidth: 0,
                borderColor: 'transparent',
                disableAutoPan: true,
                hideCloseButton: true,
                arrowPosition: 7,
                backgroundClassName: 'sm-infobubble-wrap',
                arrowStyle: 3
              });

              // it seems to open sometimes on boot, keep it closed until needed.
              $scope.infoBubble.close();

            }

            if (!$scope.properties.length) {
              $scope.infoBubble.close();
            }

            for (var i = 0; i < $scope.properties.length; i++) {
              var latLng = new google.maps.LatLng($scope.properties[i]._source.tax_input.location_latitude[0], $scope.properties[i]._source.tax_input.location_longitude[0]);

              // debug( '$scope.properties[i]._source', $scope.properties[i]._source );

              // ignore listings with broken latitude
              if (!$scope.properties[i]._source._system || !$scope.properties[i]._source._system.addressDetail || !$scope.properties[i]._source._system.addressDetail.longitude) {
                continue;
              }

              var latLng = new google.maps.LatLng($scope.properties[i]._source._system.addressDetail.latitude, $scope.properties[i]._source._system.addressDetail.longitude);
              //var latLng = new google.maps.LatLng( $scope.properties[i]._source.tax_input.location_latitude[0], $scope.properties[i]._source.tax_input.location_longitude[0]);

              latLng.listingId = $scope.properties[i]._id;
              var marker = new google.maps.Marker({
                position: latLng
                //icon: $scope.properties[i]._map_marker_url
              });
              marker.listingId = $scope.properties[i]._id;

              $scope.dynMarkers.push(marker);
              $scope.latLngs.push(latLng);

              /**
               * Marker Click Event!
               * - Selects Table Page
               * - Selects Collection Row
               */
              google.maps.event.addListener(marker, 'click', (function (marker, i, $scope) {

                return function () {
                  // Preselect a row
                  var index;
                  for (var i = 0, len = $scope.properties.length; i < len; i += 1) {
                    var property = $scope.properties[i];
                    if (property._id == marker.listingId) {
                      property.isSelected = true;
                      $scope.currentProperty = property;
                      $scope.loadImages(property);
                      index = i;
                    } else {
                      property.isSelected = false;
                    }
                  }
                  // Maybe Select Page!
                  if (index !== null) {
                    var pageNumber = Math.ceil(( index + 1 ) / $scope.per_page);
                    angular
                      .element(jQuery('.collection-pagination', ngAppDOM))
                      .isolateScope()
                      .selectPage(pageNumber);
                  }
                  $scope.$apply();
                }
              })(marker, i, $scope));

            }

            if (update_map_pos) {

              // automatically map resize
              map_resize();

              function mapCenter() {
                // Set Map 'Zoom' and 'Center On' automatically using existing markers.
                $scope.latlngbounds = new google.maps.LatLngBounds();
                for (var i = 0; i < $scope.latLngs.length; i++) {
                  $scope.latlngbounds.extend($scope.latLngs[i]);
                }
                map.fitBounds($scope.latlngbounds);

                console.log('Center on changed!', $scope.latLngs.length);

                // Set Map 'Zoom' and 'Center On' automatically using shortcode paremeters.
                if (vars.atts.zoom) {
                  var zoom = vars.atts.zoom;
                  map.setZoom(parseInt(zoom));
                }
                if (vars.atts.center_on) {
                  var latLngArr = vars.atts.center_on.split(',');
                  map.setCenter(new google.maps.LatLng(latLngArr[0], latLngArr[1]));
                }
                google.maps.event.trigger(map, 'resize');
              }

              mapCenter();

              setTimeout(mapCenter, 2000);
            }

            // Finally Initialize Marker Cluster
            $scope.markerClusterer = new MarkerClusterer(map, $scope.dynMarkers, {
              styles: [
                {
                  textColor: 'white',
                  url: '/wp-content/themes/wp-reddoor/static/images/src/map_cluster1.png',
                  height: 60,
                  width: 60
                },
                {
                  textColor: 'white',
                  url: '/wp-content/themes/wp-reddoor/static/images/src/map_cluster1.png',
                  height: 60,
                  width: 60
                },
                {
                  textColor: 'white',
                  url: '/wp-content/themes/wp-reddoor/static/images/src/map_cluster1.png',
                  height: 60,
                  width: 60
                }
              ]
            });

            // Clusters actions
            google.maps.event.addListener($scope.markerClusterer, 'clusterclick', function (cluster) {
              var center = cluster.getCenter();
              var size = cluster.getSize();
              var markers = cluster.getMarkers();
            });


          });

          $scope.col_changed();
        }

        /**
         * Toogle Search Form
         */
        $scope.toggleSearchForm = function toggleSearchForm() {
          $scope.searchForm = !$scope.searchForm;
        }

        /**
         *
         * @param row
         */
        $scope.loadImages = function loadImages(row) {
          if (( typeof row.images == 'undefined' || !row.images.length ) && !row._is_loading_images) {
            row._is_loading_images = true;
            client.get({
              index: index,
              type: type,
              headers: {
                "Authorization": make_base_auth($scope.get_map_metadata_user, $scope.get_map_metadata_password)
              },
              id: row._id,
              _source: ['meta_input.rets_media.*', 'meta_input.data_source_logo']
            }, function (error, response) {

              if (!error) {

                row._is_loading_images = false;

                if (typeof response._source.meta_input.rets_media == 'undefined') {
                  debug('Error occurred during getting properties data.');
                } else {
                  row.images = response._source.meta_input.rets_media;
                  $scope.$apply();
                }

                if (typeof response._source.meta_input.data_source_logo == 'undefined') {
                  console.log('Error occurred during getting properties data.');
                } else {
                  row.data_source_logo = response._source.meta_input.data_source_logo;
                  $scope.$apply();
                }

              } else {
                console.error(error);
              }

            });
          }
          return true;
        }

        /**
         * Fixes selected Row.
         *
         * @param row
         */
        $scope.selectRow = function selectRow(row) {
          for (var i = 0, len = $scope.properties.length; i < len; i += 1) {
            $scope.properties[i].isSelected = false;
          }
          $scope.currentProperty = row;
          $scope.loadImages(row);
          row.isSelected = true;
        }

        /**
         *
         * @param query
         */
        $scope.select_query = function select_query(query) {
          debug('select_query', ( query && query.term ? query.term.length : null ));

          var data = [];

          // no query or its too short
          if (!query.term || ( query.term && query.term.length < 2 )) {
            jQuery('.select2-dropdown').addClass("hide");
            return query.callback({results: data});
          }

          jQuery('.select2-dropdown').removeClass("hide");

          if ($scope._request) {
            $scope._request.abort();
          }

          async.auto({
            aggregations: function aggregationRequestWrapper(done) {

              var _source = {
                "query": {"match": {"post_status": "publish"}},
                "aggs": {}
              };

              // @todo Fix issue with current "term" being used when getting new aggregate acounts for doing another search.
              // _source.query = $scope.query;

              // @hack only use first word
              if (query.term.indexOf(' ') > 0) {
                query.term = query.term.split(' ')[0];
              }

              angular.forEach($scope.aggregationFields, function setField(data, key) {

                _source.aggs[key] = {
                  filters: {filters: {}},
                  aggs: {}
                };

                _source.aggs[key]['filters']['filters'][key] = {term: {}};
                _source.aggs[key]['filters']['filters'][key].term[data.search_field] = query.term.toLowerCase();
                _source.aggs[key]['aggs'][key] = {terms: {field: data.field}}


                // remove

              });

              $scope._request = client.search({
                index: 'v5',
                type: 'property',
                method: "POST",
                size: 0,
                headers: {
                  "Authorization": make_base_auth($scope.get_map_metadata_user, $scope.get_map_metadata_password)
                },
                body: _source
              }, select_queryResponse);

              /**
               *
               * @param err
               * @param response
               */
              function select_queryResponse(err, response) {
                debug('select_queryResponse', JSON.stringify(_source), ( response && response.hits ? response.hits.total : null ));

                if (typeof response.hits.hits == 'undefined') {
                  //query.callback({ results: data });
                  return done(null);
                }

                angular.forEach(response.aggregations, function eachAggregation(someAggregation, aggregationKey) {
                  //debug( 'eachAggregation - aggregationKey', aggregationKey )
                  // debug( 'eachAggregation - someAggregation', someAggregation )

                  var _buckets = [];

                  angular.forEach(someAggregation.buckets[aggregationKey][aggregationKey].buckets, function eachBucket(data) {

                    var _bucketDetail = $scope.aggregationFields[aggregationKey];

                    _buckets.push({
                      id: data.key,
                      text: data.key, // + ' (' + data.doc_count + ')',
                      count: data.doc_count,
                      taxonomy: _bucketDetail['field'],
                      field: _bucketDetail['field'],
                      search_field: _bucketDetail['search_field']
                    })

                  });

                  if (_buckets.length > 0) {

                    data.push({
                      key: aggregationKey,
                      text: $scope.aggregationFields[aggregationKey].title,
                      children: _buckets
                    })

                  }

                });

                debug('eachAggregation', data);

                done(null, data);

              }


            },
            suggest: function suggestRequestWrapper(done) {

              $scope._request_suggest = client.suggest({
                index: 'v5',
                type: 'property',
                method: "POST",
                size: 0,
                headers: {
                  "Authorization": make_base_auth($scope.get_map_metadata_user, $scope.get_map_metadata_password)
                },
                body: {
                  "regular": {
                    "text": query.term.toLowerCase(),
                    "completion": {"field": "_search._suggest"}
                  },
                  "fuzzy": {
                    "text": query.term.toLowerCase(),
                    "completion": {"field": "_search._suggest", "fuzzy": {"fuzziness": 0}}
                  }
                }
              }, suggest_queryResponse);

              /**
               *
               * @param error
               * @param response
               */
              function suggest_queryResponse(error, response) {
                debug('suggest_queryResponse', response);

                if (typeof response.regular == 'undefined') {
                  return done(null);
                }

                var data = [];

                angular.forEach(response.regular[0].options, function eachMatch(someMatch, aggregationKey) {
                  debug('someMatch', someMatch.payload);

                  if (!someMatch.payload) {
                    return;
                  }

                  data.push({
                    id: someMatch.payload.id,
                    listing_id: someMatch.payload.listing_id,
                    score: someMatch.score,
                    text: someMatch.text,
                    thumbnail_url: someMatch.payload.rets_thumbnail_url,
                    location_county: someMatch.payload.location_county,
                    location_city: someMatch.payload.location_city,
                    //latitude: someMatch.payload.rets_thumbnail_url
                  })

                });

                done(null, data.length ? {
                  key: 'Listings',
                  text: 'Listings',
                  children: data
                } : []);

              }


            },
          }, allDone);

          /**
           * Aggration/Suggest requests complete.
           *
           * @param error
           * @param results
           */
          function allDone(error, results) {
            console.log('allDone', error, results);

            query.callback({
              results: [].concat(results.aggregations, results.suggest)
            });

          }

        };

        /**
         *
         * @param data
         */
        $scope.setup_term_selection = function setup_term_selection(data) {
          debug('setup_term_selection');

          $scope.selectOpions = {
            placeholder: 'Search',
            tags: false,
            maximumSelectionLength: 1,
            minimumInputLength: 3,
            data: data || [],
            query: $scope.select_query,
            formatResult: function formatResult(field) {
              console.log('field', field);

              return field;

            }
          };

          var $select = jQuery('.termsSelection').select2($scope.selectOpions);

          /**
           *
           * map_filter_taxonomy
           * sm_current_terms
           *
           */
          $select.on('select2:select', function onSelect(event) {
            debug('onSelect', $select.select2('data'), event.params.data);

            var data = $select.select2('data');

            // specific listing found via suggest. @todo make this popup in new window
            if (event.params.data.listing_id && event.params.data.id) {

              // if we have a city, set it as our search term. @todo make this work smoother.
              if (event.params.data.location_city) {
                // window.setTimeout(function() {jQuery('.select2-selection__choice').html('<span class="select2-selection__choice__remove" role="presentation">×</span>' + event.params.data.location_city);}, 200 );
                //selectOpions.data = [ event.params.data.location_city ];
                //$select = jQuery('.termsSelection').select2( $scope.selectOpions);
              }

              // open listing in new window
              window.open('/listing/' + event.params.data.id);

              return;
            }

            if (typeof data[0].taxonomy != 'undefined' && data[0].taxonomy == 'post_title' || data[0].taxonomy == 'mls_id') {
              window.location.href = data[0].permalink;
            } else if (typeof data[0].taxonomy == 'undefined' && window.sm_current_terms.values && window.sm_current_terms.values.length) {
              var value = window.sm_current_terms.values[0];
              var key = window.sm_current_terms.key;
              if (value == data[0].text) {
                $scope.map_filter_taxonomy = key;
              }
            } else {
              $scope.map_filter_taxonomy = data[0].taxonomy;
            }

            window.sm_current_terms.values = [data[0].id];

            $scope.fix_terms();

            $scope.$apply();


          });

          /**
           * Donta allow more than one selection.
           *
           */
          $select.on('select2:selecting', function onSelecting(event) {
            debug('onSelecting', $select.select2('val'), event.params);

            $select.select2('val', {});

            if ($select.select2('val') != null && $select.select2('val').length > 0) {
              $select.select2('val', {});
            }

          });

          if (window.sm_current_terms.values && window.sm_current_terms.values.length) {
            var $option = jQuery('<option selected>Loading...</option>').val(window.sm_current_terms.values[0]).text(window.sm_current_terms.values[0]);
            $select.append($option).trigger('change');
            debug('taxonomy=' + window.sm_current_terms.key + ' value=' + window.sm_current_terms.values[0]);

            $scope.fix_terms();
          }

        }

        /**
         * Ghetto fabular fix.
         *
         */
        $scope.fix_terms = function fix_terms() {

          if (window.sm_current_terms && window.sm_current_terms.key) {

            if ($scope.aggregationFields[window.sm_current_terms.key] && $scope.aggregationFields[window.sm_current_terms.key].search_field) {
              debug('fix_terms', 'fixing', window.sm_current_terms.key, 'to', $scope.aggregationFields[window.sm_current_terms.key].search_field)
              window.sm_current_terms.key = $scope.aggregationFields[window.sm_current_terms.key].search_field;
            }

          }

          angular.forEach($scope.query.bool.must, function eachTerm(termData, termIndex) {

            if (!termData.terms) {
              return;
            }

            if (termData.terms['location_city']) {
              debug('fix_terms', 'fixing', 'location_city', 'field');
              termData.terms[$scope.aggregationFields['location_city'].field] = termData.terms['location_city'];
              delete $scope.query.bool.must[termIndex].terms['location_city'];
            }

            if (termData.terms['location_county']) {
              debug('fix_terms', 'fixing', 'location_county', 'field');
              termData.terms[$scope.aggregationFields['location_county'].field] = termData.terms['location_county'];
              delete $scope.query.bool.must[termIndex].terms['location_county'];
            }

            if (termData.terms['location_zip']) {
              debug('fix_terms', 'fixing', 'location_zip', 'field');
              termData.terms[$scope.aggregationFields['location_zip'].field] = termData.terms['location_zip'];
              delete $scope.query.bool.must[termIndex].terms['location_zip'];
            }

            if (termData.terms['location_neighborhood']) {
              debug('fix_terms', 'fixing', 'location_neighborhood', 'field');
              termData.terms[$scope.aggregationFields['location_neighborhood'].field] = termData.terms['location_neighborhood'];
              delete $scope.query.bool.must[termIndex].terms['location_neighborhood'];
            }

            if (termData.terms['location_county']) {
              debug('fix_terms', 'fixing', 'location_county', 'field');
              termData.terms[$scope.aggregationFields['location_county'].field] = termData.terms['location_county'];
              delete $scope.query.bool.must[termIndex].terms['location_county'];
            }

            if (termData.terms['elementary_school']) {
              debug('fix_terms', 'fixing', 'elementary_school', 'field');
              termData.terms[$scope.aggregationFields['elementary_school'].field] = termData.terms['elementary_school'];
              delete $scope.query.bool.must[termIndex].terms['elementary_school'];
            }

            if (termData.terms['middle_school']) {
              debug('fix_terms', 'fixing', 'middle_school', 'field');
              termData.terms[$scope.aggregationFields['middle_school'].field] = termData.terms['middle_school'];
              delete $scope.query.bool.must[termIndex].terms['middle_school'];
            }

            if (termData.terms['high_school']) {
              debug('fix_terms', 'fixing', 'high_school', 'field');
              termData.terms[$scope.aggregationFields['high_school'].field] = termData.terms['high_school'];
              delete $scope.query.bool.must[termIndex].terms['high_school'];
            }

          });

          //$scope.query

        }

        /**
         * Fired when currentProperty is changed!
         * Opens InfoBubble Window!
         */
        $scope.$watch('currentProperty', function (currentProperty, prevCurrentProperty) {
          var prevPropertyID = typeof prevCurrentProperty != 'undefined' ? prevCurrentProperty._id : false;
          for (var i = 0; i < $scope.dynMarkers.length; i++) {
            if (currentProperty._id != prevPropertyID && $scope.dynMarkers[i].listingId == currentProperty._id) {
              NgMap.getMap().then(function (map) {
                $scope.infoBubble.setContent(jQuery('.sm-marker-infobubble', ngAppDOM).html());
                $scope.infoBubble.setPosition($scope.latLngs[i]);
                $scope.infoBubble.open(map);

              });
              break;
            }
          }
        }, true);

        window.$scope = $scope;

        $scope.setup_term_selection();


        $scope.sm_form_data = function sm_form_data(form_data) {
          if (!jQuery(".rdc-home-types input:checkbox:checked").length) {
            jQuery.each(jQuery(".rdc-home-types input:checkbox"), function (k, v) {
              form_data.push({name: v.name, value: v.value});
            });
          }
          if (!jQuery(".rdc-sale-types input:checkbox:checked").length) {
            jQuery.each(jQuery(".rdc-sale-types input:checkbox"), function (k, v) {
              form_data.push({name: v.name, value: v.value});
            });
          }
          return form_data;
        };

        $document.on('change', '.rdc-home-types input:checkbox', function () {
          if (!jQuery(".rdc-home-types input:checkbox:checked").length) {
            jQuery(".rdc-home-types input:checkbox").attr('name', 'bool[must_not][6][terms][meta_input.property_type][]');
          } else {
            jQuery(".rdc-home-types input:checkbox").attr('name', 'bool[must][6][terms][meta_input.property_type][]');
          }
        });

        $document.on('change', '.rdc-sale-types input:checkbox', function () {
          $scope.sale_type_price();
          if (!jQuery(".rdc-sale-types input:checkbox:checked").length) {
            jQuery(".rdc-sale-types input:checkbox").attr('name', 'bool[must_not][5][terms][tax_input.sale_type][]');
          } else {
            jQuery(".rdc-sale-types input:checkbox").attr('name', 'bool[must][5][terms][tax_input.sale_type][]');
          }
        });


        /**
         * SEARCH FILTER EVENT
         *
         * We're using jQuery instead of AngularJS here because
         * property search form is being generated via [property_search] shortcode
         * or even can be custom, since we are using apply_filters on rendering.
         */
        jQuery('.sm-search-form form', ngAppDOM).on('submit', function (e) {
          e.preventDefault();

          if (!jQuery(this).hasClass('mapChanged')) {
            $scope.resetMapBounds();
          }

          $scope.loading_more_properties = false;

          var formQuery = {},
            push_counters = {},
            patterns = {
              "validate": /^[a-zA-Z][a-zA-Z0-9_\.]*(?:\[(?:\d*|[a-zA-Z0-9_\.]+)\])*$/,
              "key": /[a-zA-Z0-9_\.]+|(?=\[\])/g,
              "push": /^$/,
              "fixed": /^\d+$/,
              "named": /^[a-zA-Z0-9_\.]+$/
            };

          var build = function (base, key, value) {
            base[key] = value;
            return base;
          };

          var push_counter = function (key) {
            if (push_counters[key] === undefined) {
              push_counters[key] = 0;
            }
            return push_counters[key]++;
          };

          var form_data = $scope.sm_form_data(jQuery(this).serializeArray());

          jQuery.each(form_data, function () {

            if (!patterns.validate.test(this.name)) {
              return;
            }

            var k,
              keys = this.name.match(patterns.key),
              merge = this.value,
              reverse_key = this.name;

            while ((k = keys.pop()) !== undefined) {

              reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

              if (k.match(patterns.push)) {
                merge = build([], push_counter(reverse_key), merge);
              }

              else if (k.match(patterns.fixed)) {
                merge = build([], k, merge);
              }

              else if (k.match(patterns.named)) {
                merge = build({}, k, merge);
              }
            }

            formQuery = removeAllBlankOrNull(jQuery.extend(true, formQuery, merge));

          });

          if (jQuery.isEmptyObject(formQuery.bool.must_not)) {
            formQuery.bool.must_not = [];
          }


          $scope.query = formQuery;

          $scope.query.bool.must = $scope.query.bool.must.filter(Boolean);
          $scope.query.bool.must_not = $scope.query.bool.must_not.filter(Boolean);

          if ($scope.searchForm) {
            $scope.toggleSearchForm();
          }
          $scope.$apply();
          $scope.getProperties();

        });

        /**
         * BACK HISTORY EVENT
         */
        window.addEventListener('popstate', function () {

          // Get current location params
          var location = window.location.href.split('?');
          var locationQuery = {};
          if (typeof location[1] !== 'undefined') {
            parse_str(location[1], locationQuery);
          }

          $scope.$apply();
          $scope.getProperties();

        }, false);


        NgMap.getMap().then(function (map) {

          google.maps.event.addListener(map, 'bounds_changed', function () {
            debug('mapEvent', 'bounds_changed', 'current center', map.getCenter().lat(), map.getCenter().lng());
          });

          google.maps.event.addListener(map, 'zoom_changed', function () {
            debug('mapEvent', 'zoom_changed');
          });

          google.maps.event.addListener(map, 'resize', function () {
            debug('mapEvent', 'resize');
          });

        });

        // Get properties by request
        $scope.getProperties();

      }]);

  };

  /**
   * Get parameters by name from query string
   * @param name
   * @param url
   * @returns {*}
   */
  function getParameterByName(name, url) {

    if (!url) url = decodeURI(window.location.href);
    name = name.replace(/[\[\]]/g, "\\$&");

    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
    var results = regex.exec(url);
    if (!results) {
      // debug( 'getParameterByName', name, 'no result' );
      return null;
    }

    if (!results[2]) {

      // Try another method.. - potanin@UD
      var _parts = parse_query_string(window.location.search);

      if (_parts[name]) {
        // debug( 'getParameterByName', name, _parts[ name ] );
        return _parts[name];
      }

      // debug( 'getParameterByName', name, 'empty result' );

      return '';
    }

    // debug( 'getParameterByName', name, decodeURIComponent(results[2].replace(/\+/g, " ")) );
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  function removeAllBlankOrNull(JsonObj) {
    jQuery.each(JsonObj, function (key, value) {
      if (value === "" || value === null) {
        delete JsonObj[key];
      } else if (typeof(value) === "object") {
        JsonObj[key] = removeAllBlankOrNull(value);
      }
    });
    return JsonObj;
  }

  /**
   *
   * @param data
   * @returns {*}
   */
  function unserialize(data) {
    var that = this,
      utf8Overhead = function (chr) {
        var code = chr.charCodeAt(0);
        if (code < 0x0080
          || 0x00A0 <= code && code <= 0x00FF
          || [338, 339, 352, 353, 376, 402, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8226, 8230, 8240, 8364, 8482].indexOf(code) != -1) {
          return 0;
        }
        if (code < 0x0800) {
          return 1;
        }
        return 2;
      };
    error = function (type, msg, filename, line) {
      throw new that.window[type](msg, filename, line);
    };
    read_until = function (data, offset, stopchr) {
      var i = 2,
        buf = [],
        chr = data.slice(offset, offset + 1);

      while (chr != stopchr) {
        if ((i + offset) > data.length) {
          error('Error', 'Invalid');
        }
        buf.push(chr);
        chr = data.slice(offset + (i - 1), offset + i);
        i += 1;
      }
      return [buf.length, buf.join('')];
    };
    read_chrs = function (data, offset, length) {
      var i, chr, buf;

      buf = [];
      for (i = 0; i < length; i++) {
        chr = data.slice(offset + (i - 1), offset + i);
        buf.push(chr);
        length -= utf8Overhead(chr);
      }
      return [buf.length, buf.join('')];
    };
    _unserialize = function (data, offset) {
      var dtype, dataoffset, keyandchrs, keys, contig,
        length, array, readdata, readData, ccount,
        stringlength, i, key, kprops, kchrs, vprops,
        vchrs, value, chrs = 0,
        typeconvert = function (x) {
          return x;
        };

      if (!offset) {
        offset = 0;
      }
      dtype = (data.slice(offset, offset + 1))
        .toLowerCase();

      dataoffset = offset + 2;

      switch (dtype) {
        case 'i':
          typeconvert = function (x) {
            return parseInt(x, 10);
          };
          readData = read_until(data, dataoffset, ';');
          chrs = readData[0];
          readdata = readData[1];
          dataoffset += chrs + 1;
          break;
        case 'b':
          typeconvert = function (x) {
            return parseInt(x, 10) !== 0;
          };
          readData = read_until(data, dataoffset, ';');
          chrs = readData[0];
          readdata = readData[1];
          dataoffset += chrs + 1;
          break;
        case 'd':
          typeconvert = function (x) {
            return parseFloat(x);
          };
          readData = read_until(data, dataoffset, ';');
          chrs = readData[0];
          readdata = readData[1];
          dataoffset += chrs + 1;
          break;
        case 'n':
          readdata = null;
          break;
        case 's':
          ccount = read_until(data, dataoffset, ':');
          chrs = ccount[0];
          stringlength = ccount[1];
          dataoffset += chrs + 2;

          readData = read_chrs(data, dataoffset + 1, parseInt(stringlength, 10));
          chrs = readData[0];
          readdata = readData[1];
          dataoffset += chrs + 2;
          if (chrs != parseInt(stringlength, 10) && chrs != readdata.length) {
            error('SyntaxError', 'String length mismatch');
          }
          break;
        case 'a':
          readdata = {};

          keyandchrs = read_until(data, dataoffset, ':');
          chrs = keyandchrs[0];
          keys = keyandchrs[1];
          dataoffset += chrs + 2;

          length = parseInt(keys, 10);
          contig = true;

          for (i = 0; i < length; i++) {
            kprops = _unserialize(data, dataoffset);
            kchrs = kprops[1];
            key = kprops[2];
            dataoffset += kchrs;

            vprops = _unserialize(data, dataoffset);
            vchrs = vprops[1];
            value = vprops[2];
            dataoffset += vchrs;

            if (key !== i)
              contig = false;

            readdata[key] = value;
          }

          if (contig) {
            array = new Array(length);
            for (i = 0; i < length; i++)
              array[i] = readdata[i];
            readdata = array;
          }

          dataoffset += 1;
          break;
        default:
          error('SyntaxError', 'Unknown / Unhandled data type(s): ' + dtype);
          break;
      }
      return [dtype, dataoffset - offset, typeconvert(readdata)];
    };

    return _unserialize((data + ''), 0)[2];
  }

  /**
   * Convert URL Query to Object
   *
   * @param qstr
   * @returns {{}}
   */
  function parse_query_string(qstr) {
    var query = {};
    var a = qstr.substr(1).split('&');
    for (var i = 0; i < a.length; i++) {
      var b = a[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }

    return query;
  }


  /**
   *
   * @param str
   * @param array
   */
  function parse_str(str, array) {
    var strArr = String(str)
        .replace(/^&/, '')
        .replace(/&$/, '')
        .split('&'),
      sal = strArr.length,
      i, j, ct, p, lastObj, obj, lastIter, undef, chr, tmp, key, value,
      postLeftBracketPos, keys, keysLen,
      fixStr = function (str) {
        return decodeURIComponent(str.replace(/\+/g, '%20'));
      };

    if (!array) {
      array = this.window;
    }

    for (i = 0; i < sal; i++) {
      tmp = strArr[i].split('=');
      key = fixStr(tmp[0]);
      value = (tmp.length < 2) ? '' : fixStr(tmp[1]);

      while (key.charAt(0) === ' ') {
        key = key.slice(1);
      }
      if (key.indexOf('\x00') > -1) {
        key = key.slice(0, key.indexOf('\x00'));
      }
      if (key && key.charAt(0) !== '[') {
        keys = [];
        postLeftBracketPos = 0;
        for (j = 0; j < key.length; j++) {
          if (key.charAt(j) === '[' && !postLeftBracketPos) {
            postLeftBracketPos = j + 1;
          } else if (key.charAt(j) === ']') {
            if (postLeftBracketPos) {
              if (!keys.length) {
                keys.push(key.slice(0, postLeftBracketPos - 1));
              }
              keys.push(key.substr(postLeftBracketPos, j - postLeftBracketPos));
              postLeftBracketPos = 0;
              if (key.charAt(j + 1) !== '[') {
                break;
              }
            }
          }
        }
        if (!keys.length) {
          keys = [key];
        }
        for (j = 0; j < keys[0].length; j++) {
          chr = keys[0].charAt(j);
          if (chr === ' ' || chr === '.' || chr === '[') {
            keys[0] = keys[0].substr(0, j) + '_' + keys[0].substr(j + 1);
          }
          if (chr === '[') {
            break;
          }
        }

        obj = array;
        for (j = 0, keysLen = keys.length; j < keysLen; j++) {
          key = keys[j].replace(/^['"]/, '')
            .replace(/['"]$/, '');
          lastIter = j !== keys.length - 1;
          lastObj = obj;
          if ((key !== '' && key !== ' ') || j === 0) {
            if (obj[key] === undef) {
              obj[key] = {};
            }
            obj = obj[key];
          } else {
            // To insert new dimension
            ct = -1;
            for (p in obj) {
              if (obj.hasOwnProperty(p)) {
                if (+p > ct && p.match(/^\d+$/g)) {
                  ct = +p;
                }
              }
            }
            key = ct + 1;
          }
        }
        lastObj[key] = value;
      }
    }
  }

  /**
   * Initialize our Supermap modules ( Angular Modules! )
   */
  function initialize() {

    jQuery('.wpp-supermap-search').each(function (i, e) {
      // jQuery( e ).wpp_supermap_search();
    });

    jQuery('.wpp-advanced-supermap').each(function (i, e) {
      jQuery(e).wpp_advanced_supermap({
        'query': jQuery(e).data('query') || false,
        'atts': jQuery(e).data('atts') || false,
        'ng_app': jQuery(e).attr('ng-app') || false
      });
    });
  }

  /**
   * Initialization
   */
  initialize();

})(jQuery, wpp);
