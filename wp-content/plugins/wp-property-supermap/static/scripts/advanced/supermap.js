/**
 *
 */

( function( jQuery, wpp ){
  console.log( 'starting supermap' );

  /**
   * Debug Helper
   *
   */
  function debug() {
    var _args = [].slice.call(arguments);
    // _args.unshift( 'jquery-search-form' );
    console.debug.apply(console, _args);
  }

  function firstObjectKey(obj) {
    for (var a in obj) return a;
  }

  /**
   *
   * @param options
   */
  jQuery.fn.wpp_advanced_supermap = function( options ) {
    debug('wpp_advanced_supermap invoked', options.ng_app );

    var ngAppDOM = jQuery( this );

    /** Making variables public */
    var vars = jQuery.extend({
      'ng_app': false,
      'query': false,
      'atts': false
    }, options);

    if( !vars.ng_app ) {
      debug( 'wpp_advanced_supermap: ng_app is undefined!' );
      return;
    }

    if( !vars.query ) {
      debug( 'wpp_advanced_supermap: query is undefined!' );
      return;
    }

    // General supermap settings, not related to query.
    vars.atts = vars.atts ? unserialize( decodeURIComponent( vars.atts).replace(/\+/g, " ") ) : {};

    if( typeof vars.atts.map_height !== 'undefined' ) {
      ngAppDOM.css( 'height', vars.atts.map_height );
      jQuery( 'ng-map', ngAppDOM).css( 'height', vars.atts.map_height );
      jQuery( '.sm-properties-list-wrap', ngAppDOM).css( 'height', vars.atts.map_height );
      jQuery( '.sm-properties-list-wrap', ngAppDOM ).show();
    }

    function setStatus( status ) {
      debug( 'setStatus', status );
      ngAppDOM.data( 'status', status );
      ngAppDOM.addClass( 'status-' + status );
    }

    setStatus( 'loading' );

    function supermapController( $document, $scope, $http, $filter, NgMap ){

      NgMap.getMap().then(function(map) {
        window.map = map;

        // update options
        map.setOptions({
          center: new google.maps.LatLng( 35.7796, -78.6382 ),
          minZoom: 8,
          maxZoom: 12,
          zoom: 5
        });


        google.maps.event.addListener(map, 'bounds_changed', function () {
          debug( 'mapEvent', 'bounds_changed', 'current center', map.getCenter().lat(), map.getCenter().lng() );

        });

        google.maps.event.addListener(map, 'zoom_changed', function () {

          if( $scope.state.lastZoom === map.getZoom() ) {
            return;
          } else {
            debug( 'mapEvent', 'zoom_changed from', $scope.state.lastZoom, 'to', map.getZoom() );
          }

          $scope.state.lastZoom = map.getZoom();

          // do nothing if showing listings
          if( $scope.total < 500 ) {
            $scope.renderListings( { recenter: false } )
            return;
          }

          $scope.renderClusters( $scope.clusterTerm, { recenter: false } )

          if( map.getZoom() === 10 ) {
            // $scope.renderClusters( 'location_county', { recenter: false } )
          }

          if( map.getZoom() === 11 ) {
            // $scope.renderClusters( 'location_city', { recenter: false } )
          }

        });

        google.maps.event.addListenerOnce(map, 'idle', function () {
          debug( 'mapEvent', 'idle, lastZoom is', $scope.state.lastZoom, 'current zoom is', map.getZoom() );
          $scope.state.lastZoom = map.getZoom();
          $scope.state.mapReady = true;
        });

        google.maps.event.addListener(map, 'resize', function () {
          debug( 'mapEvent', 'resize' );
        });

      });

      $scope.getAvailabilityDate = function getAvailabilityDate() {
        var d = new Date();
        return  d.getFullYear() + '-' + (("0" + (d.getMonth() + 1)).slice(-2)) + "-" + d.getDate();
      }

      function handleResize() {
        debug( 'handleResize' );

        clearTimeout( resizeTimer );
        resizeTimer = setTimeout( function () {


          NgMap.getMap().then(function(map){
            map.fitBounds($scope.clusterMarkerBounds);
            google.maps.event.trigger(map, "resize");
          });
        }, 250 );
      }

      /**
       * Configure query based on URI parameters.
       *
       */
      function setFiltersFromQuery() {
        debug('setFiltersFromQuery', $scope.query.bool.must )

        if( window.location.pathname.indexOf( 'our-listings' ) >  0 ) {
          debug( 'setFiltersFromQuery', 'fetching agency listings' );
          $scope.current_filter.agency_listing = true;
          $scope.query.bool.must.push({ "terms": { "_system.agency_listing": [ "true" ] } });
        } else {
          $scope.current_filter.agency_listing = false;
        }

        if( getParameterByName( 'wpp_search[price][min]' ) || getParameterByName( 'wpp_search[price][max]' ) ) {
          debug('setFiltersFromQuery Setting [price]' )

          $scope.current_filter.price = {
            min: getParameterByName( 'wpp_search[price][min]' ),
            max: getParameterByName( 'wpp_search[price][max]' ),
          };

          $scope.query.bool.must.push({ "range": { "tax_input.price": {gte: $scope.current_filter.price.min, lte: $scope.current_filter.price.max } } });
        }

        $scope.current_filter.bathrooms = $scope.current_filter.bathrooms || {
            min: getParameterByName( 'wpp_search[bathrooms][min]' ),
            max: getParameterByName( 'wpp_search[bathrooms][max]' ),
          };

        $scope.current_filter.bedrooms = $scope.current_filter.bedrooms || {
            min: getParameterByName( 'wpp_search[bedrooms][min]' ),
            max: getParameterByName( 'wpp_search[bedrooms][max]' )
          };

        // set sale_type if we have query override, something else seems to be setting its default
        if( getParameterByName( 'wpp_search[sale_type]' ) ) {
          $scope.current_filter.sale_type = getParameterByName( 'wpp_search[sale_type]' )
        }

        debug( 'setFiltersFromQuery', '$scope.current_filter', $scope.current_filter );

      }

      window.$scope = $scope;

      var resizeTimer, idle_listener;
      jQuery( window ).on( 'resize', handleResize );

      setStatus('invoked' );

      $scope.query = unserialize( decodeURIComponent( vars.query ).replace(/\+/g, " ") );
      $scope.atts = vars.atts;

      //debug( '$scope.atts', $scope.atts );
      //debug( '$scope.query', $scope.query );

      $scope.dynMarkers = [];


      $scope.clusterTerm = 'location_city';

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

      $scope.clusterMarkerBounds = new google.maps.LatLngBounds();;
      $scope.listingMarkerBounds = new google.maps.LatLngBounds();;

      $scope.loadNgMapChangedEvent = false;

      $scope.map_filter_taxonomy = window.sm_current_terms.key || '';
      $scope.current_filter = window.sm_current_filter || {};
      $scope.tax_must_query = window.sm_must_tax_query || {};

      // set default date. will move this somewher better.
      $scope.current_filter.available_date = $scope.current_filter.available_date || $scope.getAvailabilityDate();

      $scope.view = {
        mode: {
          table: ( 'object' === typeof supermapMode && supermapMode.isMobile ) ? false : true,
          preview: ( 'object' === typeof supermapMode && supermapMode.isMobile ) ? true : false,
        },
        toggle: function() {
          this.mode.table = !this.mode.table;
          this.mode.preview = !this.mode.preview;
          setTimeout(function(){jQuery(document).trigger('rdc_cols_changed');}, 100);
        },
        set: function(mode) {
          for(var i in this.mode) {
            if ( this.mode[i] == true ) {
              this.mode[i] = false;
            }
          }
          this.mode[mode] = true;
          this.toggleActive(mode);
          setTimeout(function(){jQuery(document).trigger('rdc_cols_changed');}, 100);
        },
        toggleActive: function(mode) {
          var list_wrapper = jQuery('.sm-properties-list-wrap .sm-list-controls');
          if( mode == 'table' ) {
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
        available_date: {
          label: 'Aavailable',
          enable: 0
        },
      };

      $scope.show_dropdown_columns = false;

      /**
       *
       * @param current
       * @returns {boolean}
       */
      $scope.sale_type_checked = function(current) {
        var _types = [];

        if ( _types = $scope.current_filter.sale_type.split(',') ) {
          for (var i in _types) {
            if ( _types[i] == current ) return true;
          }
        }

        return false;
      };

      $scope.is_agency_listing = function() {
        // debug( 'is_agency_listing', current );

        return $scope.current_filter.agency_listing;

      };

      $document.bind('click', function(event){
        $scope.show_dropdown_columns = false;
        $scope.$apply();
      });

      /**
       *
       * @type {{min: $scope.pricing.min, max: $scope.pricing.max}}
       */
      $scope.pricing = window.pricing = {
        mode: false,

        current_min:'',
        current_max:'',
        current_min_label:'',
        current_max_label:'',

        min_prices: [ 25000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000 ],
        max_prices: [ 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 600000, 700000 ],

        click_out: function(e) {
          if ( !angular.element(e.target).hasClass('price-input') ) {
            this.mode = '';
          }
        },

        format: function(target, mode) {
          if ( !$scope.current_filter.price ) {
            $scope.current_filter.price = {
              min:0,
              max:0
            }
          }
          $scope.current_filter.price[mode] = Math.round(parseInt(jQuery(target).val())/1000)*1000;
          if ( mode == 'min' ) {
            this.current_min = Math.round(parseInt(jQuery(target).val()) / 1000) * 1000;
          } else {
            this.current_max = Math.round(parseInt(jQuery(target).val()) / 1000) * 1000;
          }
        },

        set_min: function(_price) {
          if ( !$scope.current_filter.price ) {
            $scope.current_filter.price = {
              min:0,
              max:0
            }
          }
          this.current_min = _price;
          $scope.current_filter.price.min = _price;
          this.recalculate();
          this.mode = 'max';
        },

        set_max: function(_price) {
          if ( !$scope.current_filter.price ) {
            $scope.current_filter.price = {
              min:0,
              max:0
            }
          }
          this.current_max = _price;
          $scope.current_filter.price.max = _price;
          this.mode = false;
        },

        recalculate: function() {
          var j;
          j = typeof this.current_min == 'number' ? this.current_min : 0;
          for( var i in this.max_prices ) {
            this.max_prices[i] = j += 25000;
          }
        },

        focus: function( mode ) {
          this.mode = mode;
        }
      };

      /**
       *
       * @type {{min_feet: number[], max_feet: number[]}}
       */
      $scope.footage = window.footage = {
        mode: false,

        current_min:'',
        current_max:'',
        current_min_label:'',
        current_max_label:'',

        min_foot: [500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000],
        max_foot: [2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000, 8000, 10000],

        click_out: function(e) {
          if ( !angular.element(e.target).hasClass('feet-input') ) {
            this.mode = '';
          }
        },

        format: function(target, mode) {
          if ( !$scope.current_filter.feet ) {
            $scope.current_filter.feet = {
              min:'',
              max:''
            }
          }
          $scope.current_filter.feet[mode] = Math.round(parseInt(jQuery(target).val())/10)*10;
          if ( mode == 'min' ) {
            this.current_min = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
          } else {
            this.current_max = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
          }
        },

        set_min: function(_price) {
          if ( !$scope.current_filter.feet ) {
            $scope.current_filter.feet = {
              min:'',
              max:''
            }
          }
          this.current_min = _price;
          $scope.current_filter.feet.min = _price;
          this.recalculate(_price);
          this.mode = 'max';
        },

        set_max: function(_price) {
          if ( !$scope.current_filter.feet ) {
            $scope.current_filter.feet = {
              min:'',
              max:''
            }
          }
          this.current_max = _price;
          $scope.current_filter.feet.max = _price;
          this.mode = false;
        },

        recalculate: function ( current ) {
          var j;
          j = typeof (current*1) == 'number' ? current*1 : 0;
          for( var i in this.max_foot ) {
            this.max_foot[i] = j += 500;
          }
        },

        focus: function( mode ) {
          this.mode = mode;
        }
      };

      /**
       *
       * @type {{min_bedroom: number[], max_bedroom: number[]}}
       */
      $scope.bedrange = window.bedrange = {
        mode: false,

        current_min:'',
        current_max:'',
        current_min_label:'',
        current_max_label:'',

        min_bedroom: [1, 2, 3, 4, 5, 6],
        max_bedroom: [3, 4, 5, 6, 7, 8],

        click_out: function(e) {
          if ( !angular.element(e.target).hasClass('bed-input') ) {
            this.mode = '';
          }
        },

        format: function(target, mode) {
          if ( !$scope.current_filter.bedrooms ) {
            $scope.current_filter.bedrooms = {
              min:'',
              max:''
            }
          }
          $scope.current_filter.bedrooms[mode] = Math.round(parseInt(jQuery(target).val()));
          if ( mode == 'min' ) {
            this.current_min = Math.round(parseInt(jQuery(target).val()));
          } else {
            this.current_max = Math.round(parseInt(jQuery(target).val()));
          }
          this.set_min(this.current_min);
          this.set_max(this.current_max);
        },

        set_min: function(_price) {
          if ( !$scope.current_filter.bedrooms ) {
            $scope.current_filter.bedrooms = {
              min:'',
              max:''
            }
          }
          this.current_min = _price;
          $scope.current_filter.bedrooms.min = _price;
          this.recalculate(_price);
          this.mode = 'max';
        },

        set_max: function(_price) {
          if ( !$scope.current_filter.bedrooms ) {
            $scope.current_filter.bedrooms = {
              min:'',
              max:''
            }
          }
          this.current_max = _price;
          $scope.current_filter.bedrooms.max = _price;
          this.mode = false;
        },

        recalculate: function ( current ) {
          var j;
          var max_bedroom = [];
          j = typeof (current*1) == 'number' ? current*1 : 0;
          for( var i = j; i < j+6; i++ ) {
            max_bedroom.push( i );
          }
          this.max_bedroom = max_bedroom;
        },

        focus: function( mode ) {
          this.mode = mode;
        }
      };

      /**
       *
       * @type {{min_bathroom: number[], max_bathroom: number[]}}
       */
      $scope.bathrange = window.bathrange = {
        mode: false,

        current_min:'',
        current_max:'',
        current_min_label:'',
        current_max_label:'',

        min_bathroom: [1, 2, 3, 4, 5, 6],
        max_bathroom: [3, 4, 5, 6, 7, 8],

        click_out: function(e) {
          if ( !angular.element(e.target).hasClass('bath-input') ) {
            this.mode = '';
          }
        },

        format: function(target, mode) {
          if ( !$scope.current_filter.bathrooms ) {
            $scope.current_filter.bathrooms = {
              min:'',
              max:''
            }
          }
          $scope.current_filter.bathrooms[mode] = Math.round(parseInt(jQuery(target).val()));
          if ( mode == 'min' ) {
            this.current_min = Math.round(parseInt(jQuery(target).val()));
          } else {
            this.current_max = Math.round(parseInt(jQuery(target).val()));
          }
          this.set_min(this.current_min);
          this.set_max(this.current_max);
        },

        set_min: function(_price) {
          if ( !$scope.current_filter.bathrooms ) {
            $scope.current_filter.bathrooms = {
              min:'',
              max:''
            }
          }
          this.current_min = _price;
          $scope.current_filter.bathrooms.min = _price;
          this.recalculate(_price);
          this.mode = 'max';
        },

        set_max: function(_price) {
          if ( !$scope.current_filter.bathrooms ) {
            $scope.current_filter.bathrooms = {
              min:'',
              max:''
            }
          }
          this.current_max = _price;
          $scope.current_filter.bathrooms.max = _price;
          this.mode = false;
        },

        recalculate: function ( current ) {
          var j;
          var max_bathroom = [];
          j = typeof (current*1) == 'number' ? current*1 : 0;
          for( var i = j; i < j+6; i++ ) {
            max_bathroom.push( i );
          }
          this.max_bathroom = max_bathroom;
        },

        focus: function( mode ) {
          this.mode = mode;
        }
      };

      /**
       *
       * @type {{min_feet: number[], max_feet: number[]}}
       */
      $scope.acrage = window.acrage = {
        mode: false,

        current_min:'',
        current_max:'',
        current_min_label:'',
        current_max_label:'',

        min_acres: [0.25, 0.50, 0.75, 1, 5, 10, 20, 30, 50, 60],
        max_acres: [0.75, 1, 5, 10, 20, 30, 40, 50, 60, 70],

        click_out: function(e) {
          if ( !angular.element(e.target).hasClass('acres-input') ) {
            this.mode = '';
          }
        },

        format: function(target, mode) {
          if ( !$scope.current_filter.acrage ) {
            $scope.current_filter.acrage = {
              min:'',
              max:''
            }
          }
          $scope.current_filter.acrage[mode] = Math.round(parseInt(jQuery(target).val()));
          if ( mode == 'min' ) {
            this.current_min = Math.round(parseInt(jQuery(target).val()));
          } else {
            this.current_max = Math.round(parseInt(jQuery(target).val()));
          }
          this.set_min(this.current_min);
          this.set_max(this.current_max);
        },

        set_min: function(_price) {
          if ( !$scope.current_filter.acrage ) {
            $scope.current_filter.acrage = {
              min:'',
              max:''
            }
          }
          this.current_min = _price;
          $scope.current_filter.acrage.min = _price;
          this.recalculate(_price);
          this.mode = 'max';
        },

        set_max: function(_price) {
          if ( !$scope.current_filter.acrage ) {
            $scope.current_filter.acrage = {
              min:'',
              max:''
            }
          }
          this.current_max = _price;
          $scope.current_filter.acrage.max = _price;
          this.mode = false;
        },

        recalculate: function ( current ) {
          current = current*1;
          for( var i in this.max_acres ) {
            if ( this.min_acres[ parseInt(this.min_acres.indexOf( current )) + parseInt(i) + 1 ] ) {
              this.max_acres[i] = this.min_acres[ parseInt(this.min_acres.indexOf( current )) + parseInt(i) + 1 ];
            } else {
              if (this.max_acres[i - 1]) {
                this.max_acres[i] = this.max_acres[i - 1] + 10;
              } else {
                this.max_acres[i] = current + 10;
              }
            }
          }
        },

        focus: function( mode ) {
          this.mode = mode;
        }
      };

      $scope.responseAggregations = [];
      $scope.currentClusterMarkers = [];
      $scope.currentListingMarkers = [];

      $scope.state = {
        lastZoom: null,
        mapReady: false
      };

      /**
       *
       * @returns {number}
       */
      $scope.pagination_colspan = function(){
        var i = 0;
        for(var f in $scope.columns) {
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
        hosts: window.location.hostname //'dori-us-east-1.searchly.com'
      });

      /**
       * Fix Data Types on Fields.
       *
       * @param r
       */
      function cast_fields(r) {

        r.has = r.has || {};

        r._source.tax_input.price[0] = parseInt(r._source.tax_input.price[0]);
        r._source.tax_input.total_living_area_sqft[0] = parseInt(r._source.tax_input.total_living_area_sqft[0]);
        r._source.tax_input.added[0] = parseInt(calculate_days(r._source.tax_input.added[0]));

        // @todo Use "_system.listed_date" to calculate.
        r._source.tax_input.days_on_market[0] = parseInt(r._source.tax_input.days_on_market[0]);

        if (typeof r._source.tax_input.price_per_sqft!='undefined') {
          r._source.tax_input.price_per_sqft[0] = parseFloat(r._source.tax_input.price_per_sqft[0]);
        } else {
          r._source.tax_input.price_per_sqft = [0];
        }

        r._source.tax_input.approximate_lot_size[0] = parseFloat( r._source.tax_input.approximate_lot_size[0] );

        //icon html and template
        if( r._source.tax_input.total_living_area_sqft[0] ) {
          r.has.total_living_area = true;
          r.current_total_living_area_sqft = '<i class="icon-wpproperty-attribute-size-solid"></i>' + parseInt(r._source.tax_input.total_living_area_sqft[0]) + ' SqFt';
        } else {
          r.has.total_living_area = false;
          r.current_total_living_area_sqft = '';
        }

        if(  r._source.meta_input && r._source.meta_input.rets_thumbnail_url ) {
          r.rets_thumbnail_url = ( r._source.meta_input.rets_thumbnail_url ).toLowerCase().replace('.jpg', '-300x250.jpg');
        } else {
          r.rets_thumbnail_url = '';
        }

        if( r._source.tax_input.approximate_lot_size[0] ) {
          r.has.current_approximate_lot_size = true;
          r.current_approximate_lot_size = '<i class="icon-wpproperty-attribute-lotsize-solid"></i>' + parseFloat( r._source.tax_input.approximate_lot_size[0] ) + ' Acres';
        } else {
          r.has.current_approximate_lot_size = false;
          r.current_approximate_lot_size = '';
        }

        r.current_bedrooms = '<i class="icon-wpproperty-attribute-bedroom-solid"></i>' + parseFloat( r._source.tax_input.bedrooms[0] ) + ' Beds';
        r.current_bathrooms = '<i class="icon-wpproperty-attribute-bathroom-solid"></i>' + parseFloat( r._source.tax_input.bathrooms[0] ) + ' Baths';
      }

      function calculate_days(date) {
        if ( date != 'undefined' && date != null ) {
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
      var currencyAmount = function( int ) {
        var int = Math.round( parseInt( int.toString().replace(/,/g,"")) / 5000 ) * 5000;
        var cur = int.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        return {value:int, label:cur != 'NaN' ? cur : ''};
      };

      /**
       *
       * @returns {*|{}}
       */
      function build_query() {
        debug( 'build_query', $scope.query );

        return JSON.stringify($scope.query);

      }

      /**
       * Remove empties and other bad things.
       *
       * @returns {{}|*}
       */
      function prepare_query() {
        debug( 'prepare_query - query.bool length before', $scope.query.bool.must.length );

        // From before, dont know what this is for. - potanin@UD
        $scope.query.bool.must = $scope.query.bool.must.filter(Boolean);
        $scope.query.bool.must_not = $scope.query.bool.must_not.filter(Boolean);

        var mustQuery = [];

        angular.forEach($scope.query.bool.must, function( data, key ) {

          var _info = {
            type: firstObjectKey(data),
            field: firstObjectKey( data[ firstObjectKey(data) ] ),
            valueLength: Object.keys( data[ firstObjectKey(data) ][ firstObjectKey( data[ firstObjectKey(data) ] ) ] ).length,
            values: data[ firstObjectKey(data) ][ firstObjectKey( data[ firstObjectKey(data) ] ) ],
            valueType: typeof data[ firstObjectKey(data) ][ firstObjectKey( data[ firstObjectKey(data) ] ) ],
          };

          // object w/ no values.
          if( _info.valueType === 'object' && !_info.valueLength ) {
            //debug( 'prepare_query - removing',  _info.field, _info.type );
            return;
            //delete $scope.query.bool.must[key];
          }

          debug( 'prepare_query - using ',  _info.field, _info.type, _info.values );
          mustQuery.push(data);

        });

        debug( 'prepare_query - query.bool length after', mustQuery.length );

        $scope.query.bool.must = mustQuery;

        return $scope.query;

      }

      $scope.renderListings = function renderListings( options ) {

        options = options || { recenter: true };

        NgMap.getMap().then(function (map) {

          if( !$scope.state.mapReady ) {
            debug( 'renderListings', 'map not ready, rescheduling [renderListings] method to next idle' );
            google.maps.event.addListenerOnce(map, 'idle', $scope.renderListings.bind( this, options ) );
            return;
          }

          debug( 'renderListings', 'have total of', $scope.properties.length, 'listings.' )

          //$scope.hideClusters();
          //$scope.hideListings();

          angular.forEach( $scope.properties, function eachProperty( someProperty ) {

            var _source = someProperty._source;

            var marker = new MarkerWithLabel( {
              position: new google.maps.LatLng( _source.tax_input.location_latitude[0], _source.tax_input.location_longitude[0] ),
              map: map,
              clickable: true,
              draggable: false,
              raiseOnDrag: true,
              title: _source.post_title,
              //labelContent: someCluster.doc_count,
              labelClass: "wpp-listing-label",
              labelInBackground: false,
              //icon: {url: 'https://storage.googleapis.com/media.reddoorcompany.com/2015/11/153d7999-9627ffcd-rdc-pin-24x32.png', size: new google.maps.Size( 60, 60 )},
              icon: {url: 'https://ssl.cdn-redfin.com/v118.3.1/corvstatic/customer-pages/en/a614cab4ee42b3a7711f765e9825d00b.gif', size: new google.maps.Size( 60, 60 )},
              someProperty: someProperty
            } );

            google.maps.event.addListener(marker, 'click', listingMarkerClick )

            // add marker to bounds.
            $scope.currentListingMarkers.push( marker );

            $scope.listingMarkerBounds.extend(marker.getPosition());

          })

          if( options.recenter ) {
            debug("renderListings", 'setting center');

            window.setTimeout(function() {
              map.fitBounds($scope.listingMarkerBounds);
            }, 200 );

            // sometimes throws way off. , e.g. on https://usabilitydynamics-www-reddoorcompany-com-latest.c.rabbit.ci/rent/our-listings
            //map.setCenter($scope.listingMarkerBounds.getCenter());
            //map.setZoom( ( map.getZoom() - 1 ) );

          }



        });

      }

      /**
       *
       * $scope.hideClusters();
       *
       * @param options
       */
      $scope.hideClusters = function hideClusters( options ) {
        debug( 'hideClusters' );

        angular.forEach($scope.currentClusterMarkers, function( marker ) {
          marker.setMap(null);
        });

        // reset markers
        $scope.currentClusterMarkers = [];

      }

      $scope.hideListings = function hideListings( options ) {
        debug( 'hideListings' );

        angular.forEach($scope.currentListingMarkers, function( marker ) {
          marker.setMap(null);
        });

        // reset markers
        $scope.currentListingMarkers = [];

      }

      /**
       *
       * @param event
       */
      function listingMarkerClick(event) {
        debug( 'listingMarkerClick', this.someProperty );

        $scope.currentProperty = this.someProperty;

        //$scope.propertiesTableCollection
        // $scope.selectRow($scope.propertiesTableCollection[2]);


      }

      /**
       * Called from two different contexts - an aggregation cluster or a master cluster
       * @param event
       */
      function clusterMarkerClick(event) {

        if( this.someCluster ) {
          debug( 'clusterMarkerClick', this.someCluster.type, this.someCluster.key, this.someCluster.doc_count );
        } else if( this.cluster_ && this.cluster_.clusterIcon_ ) {
          debug( 'clusterMarkerClick', 'clicked from group of clusters for keys:', this.cluster_.clusterIcon_.sums_.keys, this.cluster_.clusterIcon_.sums_.doc_count );
        } else {
          debug( "ERROR!", 'what the hell did you click?', this )
        }


        // @todo Fetch and render listings for key/keys

      }

      /**
       * Draw clusters by an aggregation and zoom/center on them. If already have markers, clear them.
       *
       * $scope.renderClusters( 'location_county', { recenter: false} )
       * $scope.renderClusters( 'location_city', { recenter: false} )
       * $scope.renderClusters( 'location_zip', { recenter: false} )
       *
       * To NOT recenter, to avoid infinite loop:
       * $scope.renderClusters( 'location_city', { recenter: false} )
       *
       * $scope.renderClusters( 'high_school', { recenter: false} )
       *
       * ### Notes
       * - ZIP seems to be the tightest group
       *
       *
       * @param what
       */
      $scope.renderClusters = function renderClusters( what, options ) {

        options = options || { recenter: true };

        NgMap.getMap().then(function (map) {

          if( !$scope.state.mapReady ) {
            debug( 'renderClusters', 'map not ready, rescheduling [renderClusters] method to next idle' );
            google.maps.event.addListenerOnce(map, 'idle', $scope.renderClusters.bind( this, what, options ) );
            return;
          }

          $scope.hideClusters();
          // $scope.hideListings();

          // change term if new one passed.
          $scope.clusterTerm = ( $scope.clusterTerm !== what ) ? what : $scope.clusterTerm;

          if( !$scope.responseAggregations[ what ] || !$scope.responseAggregations[what].buckets ) {
            debug( 'renderClusters', what, 'not found' );
            return;
          }

          debug( 'renderClusters', what, 'have total of', $scope.responseAggregations[what].buckets.length, 'other docs', $scope.responseAggregations[what].sum_other_doc_count )

          // reset marker bounds
          $scope.clusterMarkerBounds = new google.maps.LatLngBounds();

          angular.forEach( $scope.responseAggregations[what].buckets, function ( someCluster ) {

            // detect geohash
            if( someCluster.centroid ) {
              someCluster._position = { lat: someCluster.centroid.location.lat, lng: someCluster.centroid.location.lon };
            } else {
              someCluster._position = decodeGeoHash( someCluster.key )
            }

            // debug( 'someCluster', someCluster, someCluster.key, someCluster.doc_count );

            var _chars = someCluster.doc_count.toString().length
            var _offset = 0;

            if( _chars === 1 ) {
              _offset = 2;
            }

            if( _chars === 2 ) {
              _offset = 6;
            }

            if( _chars === 3 ) {
              _offset = 9;
            }

            if( _chars === 4 ) {
              _offset = 12;
            }

            someCluster.type = what;

            var marker = new MarkerWithLabel( {
              position: someCluster._position,
              map: map,
              draggable: false,
              clickable: true,
              raiseOnDrag: true,
              title: someCluster.doc_count + " listings in " + someCluster.key + ' ' + (what).replace('location_', ''),
              labelContent: someCluster.doc_count,
              someCluster: someCluster,

              // @todo Adjust offset based on length onf labelContent
              // the higher the first number the further to left it goes. the higher the second number the higher it goes
              labelAnchor: new google.maps.Point( _offset, 38),
              labelClass: "wpp-cluster-label",
              labelInBackground: false,
              icon: {url: '/wp-content/themes/wp-reddoor/static/images/src/map_cluster1.png', size: new google.maps.Size( 60, 60 )},
            } );

            google.maps.event.addListener(marker, 'click', clusterMarkerClick )

            // add marker to bounds.
            $scope.currentClusterMarkers.push( marker );

            $scope.clusterMarkerBounds.extend(marker.getPosition());

          } )

          $scope.renderSuperClusrers();

          // Center on markers and then zoom out one level, so nothing is on the border.
          if( options.recenter ) {
            debug("renderClusters", 'setting center');

            window.setTimeout(function() {
              map.fitBounds( $scope.clusterMarkerBounds );
            }, 200 );

            // sometimes throws way off. , e.g. on https://usabilitydynamics-www-reddoorcompany-com-latest.c.rabbit.ci/rent/our-listings
            //map.setCenter($scope.clusterMarkerBounds.getCenter());
            //map.setZoom( ( map.getZoom() - 1 ) );

            //map.setCenter( new google.maps.LatLng( '35.15625', '-81.5625' ) );
          }

        });

      }

      /**
       * Creates "Super Clusters" from regular aggregation clusters. However, they look the same, so user doesn't know any better.
       * These are only used for grouping our regular Aggregation Clusters. Once one of these is clicked and regular AC are shown, they must be clicked to show actual listings.
       * 
       * The non-clustered regular aggregation clusters remain on map.
       * 
       * $scope.markerClusterer.clearMarkers();
       *
       * map.fitBounds( $scope.clusterMarkerBounds );
       *
       * Will redner aggregations, super-cluster them and then hide originals. The aggregated counts ar eoff.
       * $scope.renderClusters( 'location_city', { recenter: false} )
       * $scope.renderSuperClusrers();
       * $scope.hideClusters();
       *
       */
      $scope.renderSuperClusrers = function() {

        if( $scope.markerClusterer ) {
          $scope.markerClusterer.clearMarkers();
        }

        MarkerClusterer.prototype.calculator_ = MarkerClustererCalculator;

        ClusterIcon.prototype.triggerClusterClick = function() {
          console.log( 'triggerClusterClick' , this.cluster_.clusterIcon_.text_, this.cluster_.clusterIcon_.sums_.keys, this.cluster_.clusterIcon_.sums_.type );

          var markerClusterer = this.cluster_.getMarkerClusterer();

          if( this.cluster_.clusterIcon_.text_ < 500 ) {
            console.log( 'triggerClusterClick' , 'rendering properties' );
            clusterMarkerClick.call(this);
            return;
          } else {
            console.log( 'triggerClusterClick' , 'too many properties, zooming into additional clusters.' );
          }

          // Trigger the clusterclick event.
          google.maps.event.trigger(markerClusterer, 'clusterclick', this.cluster_);

          if (markerClusterer.isZoomOnClick()) {
            console.log( 'triggerClusterClick', 'zoom click' );
            // Zoom into the cluster.
            this.map_.fitBounds(this.cluster_.getBounds());
          }

        };


        NgMap.getMap().then(function (map) {
          $scope.markerClusterer = new MarkerClusterer( map, $scope.currentClusterMarkers, {
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
          } );

        });


      }

      /**
       * toggle search filter button loading icon and search icon
       */
      $scope.toggleSearchButton = function () {
        debug( 'toggleSearchButton' );

        var button_icon_desktop = jQuery('.sm-search-filter').find('i');
        var button_icon_mobile = jQuery('.mobile-toggle-search-icon').find('i');

        if ( jQuery( '.sm-search-form form').hasClass('processing') ) {
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
        debug( 'getProperties' );

        if ( $scope._request ) {
          $scope._request.abort();
        }

        var search_form = jQuery('.sm-search-form form');

        search_form.addClass('processing');

        $scope.toggleSearchButton();

        // Geohashes of precision 5 are approximately 5km x 5km.

        $scope.aggregations = {
          "titles": {
            "terms": {
              "field": "title"
            },
            "meta": {
              "color": "blue"
            },
          },
          "subdivision" : {
            "terms" : {
              "field" : "tax_input.subdivision", "size": 100 },
            "aggs" : {
              "centroid" : {
                "geo_centroid" : { "field" : "_system.location" }
              }
            }
          },
          "elementary_school" : {
            "terms" : { "field" : "tax_input.elementary_school", "size": 50  },
            "aggs" : {
              "centroid" : {
                "geo_centroid" : { "field" : "_system.location" }
              }
            }
          },
          "middle_school" : {
            "terms" : { "field" : "tax_input.middle_school", "size": 50  },
            "aggs" : {
              "centroid" : {
                "geo_centroid" : { "field" : "_system.location" }
              }
            }
          },
          "high_school" : {
            "terms" : { "field" : "tax_input.high_school", "size": 100  },
            "aggs" : {
              "centroid" : {
                "geo_centroid" : { "field" : "_system.location" }
              }
            }
          },
          "location_city" : {
            "terms" : { "field" : "tax_input.location_city", "size": 100  },
            "aggs" : {
              "centroid" : {
                "geo_centroid" : { "field" : "_system.location" }
              }
            }
          },
          "location_zip" : {
            "terms" : { "field" : "tax_input.location_zip", "size": 100  },
            "aggs" : {
              "centroid" : {
                "geo_centroid" : { "field" : "_system.location" }
              }
            }
          },
          "location_county" : {
            "terms" : { "field" : "tax_input.location_county", "size": 50  },
            "aggs" : {
              "centroid" : {
                "geo_centroid" : { "field" : "_system.location" }
              }
            }
          }
        };

        var esQuery = {
          index: index,
          type: type,
          method: "GET",
          source: '{"query":'+build_query()+',"_source": '+JSON.stringify($scope.atts.fields.split(','))+', "size":500,"sort":[{"_system.agency_listing":{"order":"asc"}},{"post_title":{"order":"asc"}}],"aggregations":'+JSON.stringify($scope.aggregations)+'}',
        };

        $scope._request = client.search( esQuery, function getPropertiesResponse( error, response ) {
          debug( 'getPropertiesResponse', esQuery.source, response.hits.total );

          setStatus( 'ready' );

          if ( !error ) {
            jQuery( '.sm-search-layer', ngAppDOM ).show();

            $scope.loaded = true;
            $scope.responseAggregations = response.aggregations;

            if( typeof response.hits.hits == 'undefined' ) {
              debug( 'Error occurred during getting properties data.' );
            } else {
              response.hits.hits.filter(cast_fields);

              $scope.total = response.hits.total;
              $scope.properties = response.hits.hits;

              // Select First Element of Properties Collection
              if( $scope.properties.length > 0 ) {
                $scope.currentProperty = $scope.properties[0];
                $scope.properties[0].isSelected = true;
              }

              if ( $scope.total > $scope.properties.length ) {


              }else{
                if( ! $scope.loadNgMapChangedEvent ) {
                  $scope.loadNgMapChangedEvent = true;
                  // why do this? doesn't it search again?
                  //$scope.addMapChanged();
                }
                search_form.removeClass('mapChanged');
              }

            }

            // Over 500 listings, we only show cluster
            if( $scope.total > 500 ) {
              $scope.hideListings();
              $scope.renderClusters( $scope.clusterTerm )
            } else {
              $scope.hideClusters();
              $scope.renderListings()
            }

            //google.maps.Marker
            $scope.col_changed();


          } else {
            console.error(error);
            search_form.removeClass('mapChanged');
          }

          search_form.removeClass('processing');

          $scope.toggleSearchButton();

        });

      };

      /**
       *
       */
      $scope.col_changed = function() {
        debug( 'col_changed' );
        jQuery(document).trigger('rdc_cols_changed');
      };

      /**
       * map zoom or drag event listener for search results refresh
       */
      $scope.addMapChanged = function addMapChanged() {
        debug( 'addMapChanged' );

        NgMap.getMap().then(function (map) {

          window.map = map;

          if ( 'object' === typeof supermapMode && supermapMode.isMobile == true) {
            return false;
          }

          // This event is fired when the map becomes idle after panning or zooming.
          idle_listener = map.addListener('idle', function () {
            var bounds = map.getBounds();
            var zoom = map.getZoom();
            if( zoom > 4 ) {
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
            }else{
              $scope.resetMapBounds();
            }
            jQuery('.sm-search-form form').addClass('mapChanged');

            jQuery('.sm-search-form form').submit();

          });
        });
      };

      $scope.resetMapBounds = function resetMapBounds() {
        debug( 'resetMapBounds' );

        jQuery('.rdc-latitude-gte').val('');
        jQuery('.rdc-latitude-lte').val('');
        jQuery('.rdc-longitude-gte').val('');
        jQuery('.rdc-longitude-lte').val('');
      };

      $document.bind("st_sort_done",function(){
        if( $scope.propertiesTableCollection.length > 0 ) {
          $scope.selectRow($scope.propertiesTableCollection[0]);
        }
      });

      /**
       * Toogle Search Form
       */
      $scope.toggleSearchForm = function toggleSearchForm() {
        $scope.searchForm = !$scope.searchForm;
      }

      $scope.haveImages = function haveImages( row ) {
        // debug( 'haveImages', row._id );
        return true;
      }

      /**
       * Fixes selected Row.
       *
       * @param row
       */
      $scope.selectRow = function selectRow(row) {
        debug( 'selectRow', row._id );

        for (var i = 0, len = $scope.properties.length; i < len; i += 1) {
          $scope.properties[i].isSelected = false;
        }
        $scope.currentProperty = row;
        row.isSelected = true;
      }

      /**
       * Fired when currentProperty is changed!
       * Opens InfoBubble Window!
       */
      $scope.$watch( 'currentProperty', function( currentProperty, prevCurrentProperty ) {
        var prevPropertyID = typeof prevCurrentProperty != 'undefined'?prevCurrentProperty._id:false;
        for ( var i=0; i<$scope.dynMarkers.length; i++ ) {
          if (currentProperty._id != prevPropertyID && $scope.dynMarkers[i].listingId == currentProperty._id ) {
            NgMap.getMap().then( function( map ) {
              $scope.infoBubble.setContent( jQuery( '.sm-marker-infobubble', ngAppDOM ).html() );
              $scope.infoBubble.setPosition( $scope.latLngs[i] );
              $scope.infoBubble.open( map );
            } );
            break;
          }
        }
      }, true );

      var $select = jQuery('.termsSelection').select2({
        placeholder: 'Search',
        maximumSelectionLength: 1,
        minimumInputLength: 3,
        data: [],
        query: function selectQuery(query) {
          debug( 'selectQuery' );

          var data = [];

          if( query.term && query.term.length  >= 3 ) {

            jQuery('.select2-dropdown').removeClass("hide");

            if( $scope._request ) {
              $scope._request.abort();
            }

            $scope._request = client.search({
              index: 'v5',
              type: 'property',
              method: "GET",
              source:'{query: {"match": {"_all": {"query": "'+query.term+'","operator": "and"}}},_source: ["post_title","_permalink","tax_input.location_city","tax_input.mls_id","tax_input.location_street","tax_input.location_zip","tax_input.location_county","tax_input.subdivision","tax_input.elementary_school","tax_input.middle_school","tax_input.high_school","tax_input.listing_office","tax_input.listing_agent_name","_system.agency_listing"]}',
            }, function selectQueryResponse(err, response) {
              debug( 'selectQueryResponse' );

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
              var unique = { "None" : "None","Not in a Subdivision" : "Not in a Subdivision" };

              jQuery.each(response.hits.hits,function(k,v){
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
              });

              post_title.children.length ? data.push( post_title ) : '';
              city.children.length ? data.push( city ) : '';
              elementary_school.children.length ? data.push( elementary_school ) : '';
              middle_school.children.length ? data.push( middle_school ) : '';
              high_school.children.length ? data.push( high_school ) : '';
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
      }).on('select2:select', function(e) {
        var data = $select.select2('data');
        if ( typeof data[0].taxonomy != 'undefined' && data[0].taxonomy == 'post_title' || data[0].taxonomy == 'mls_id' ) {
          window.location.href= data[0].permalink;
        } else if ( typeof data[0].taxonomy == 'undefined' && window.sm_current_terms.values && window.sm_current_terms.values.length ) {
          var value = window.sm_current_terms.values[0];
          var key = window.sm_current_terms.key;
          if( value == data[0].text ) {
            $scope.map_filter_taxonomy = key;
          }
        } else {
          $scope.map_filter_taxonomy = data[0].taxonomy;
        }
        $scope.$apply();
      }).on('select2:selecting', function(e) {
        if( $select.select2('val') != null && $select.select2('val').length > 0 ) {
          $select.select2( 'val', {} );
        }
      });

      if ( window.sm_current_terms.values && window.sm_current_terms.values.length ) {
        var $option = jQuery('<option selected>Loading...</option>').val(window.sm_current_terms.values[0]).text(window.sm_current_terms.values[0]);
        $select.append($option).trigger('change');
        debug('taxonomy=' + window.sm_current_terms.key + ' value=' + window.sm_current_terms.values[0] );
      }

      $scope.sm_form_data = function sm_form_data( form_data ) {
        debug( 'sm_form_data' );

        // form_data.forEach(function(data){console.log(data.name)});

        if( ! jQuery(".rdc-home-types input:checkbox:checked").length ) {
          jQuery.each( jQuery(".rdc-home-types input:checkbox"), function (k,v) {
            form_data.push({name:v.name,value:v.value});
          } );
        }
        if( ! jQuery(".rdc-sale-types input:checkbox:checked").length ) {
          jQuery.each( jQuery(".rdc-sale-types input:checkbox"), function (k,v) {
            form_data.push({name:v.name,value:v.value});
          } );
        }
        return form_data;
      };

      $document.on( 'change', '.rdc-home-types input:checkbox', function(){
        if( ! jQuery(".rdc-home-types input:checkbox:checked").length ) {
          jQuery(".rdc-home-types input:checkbox").attr( 'name', 'bool[must_not][6][terms][meta_input.property_type][]' );
        } else {
          jQuery(".rdc-home-types input:checkbox").attr( 'name', 'bool[must][6][terms][meta_input.property_type][]' );
        }
      });

      $document.on( 'change', '.rdc-sale-types input:checkbox', function(){
        if( ! jQuery(".rdc-sale-types input:checkbox:checked").length ) {
          jQuery(".rdc-sale-types input:checkbox").attr( 'name', 'bool[must_not][5][terms][tax_input.sale_type][]' );
        } else {
          jQuery(".rdc-sale-types input:checkbox").attr( 'name', 'bool[must][5][terms][tax_input.sale_type][]' );
        }
      });

      /**
       * SEARCH FILTER EVENT
       *
       * We're using jQuery instead of AngularJS here because
       * property search form is being generated via [property_search] shortcode
       * or even can be custom, since we are using apply_filters on rendering.
       */
      jQuery( '.sm-search-form form', ngAppDOM).on( 'submit', function formSubmitted(e){
        debug( 'formSubmitted' );

        e.preventDefault();

        if ( ! jQuery(this).hasClass('mapChanged') ) {
          $scope.resetMapBounds();
        }


        var formQuery = {},
          push_counters = {},
          patterns = {
            "validate": /^[a-zA-Z][a-zA-Z0-9_\.]*(?:\[(?:\d*|[a-zA-Z0-9_\.]+)\])*$/,
            "key":      /[a-zA-Z0-9_\.]+|(?=\[\])/g,
            "push":     /^$/,
            "fixed":    /^\d+$/,
            "named":    /^[a-zA-Z0-9_\.]+$/
          };

        var build = function(base, key, value){
          base[key] = value;
          return base;
        };

        var push_counter = function(key){
          if(push_counters[key] === undefined){
            push_counters[key] = 0;
          }
          return push_counters[key]++;
        };

        var form_data = $scope.sm_form_data( jQuery( this ).serializeArray() );

        jQuery.each(form_data, function(){

          if(!patterns.validate.test(this.name)){
            return;
          }

          var k,
            keys = this.name.match(patterns.key),
            merge = this.value,
            reverse_key = this.name;

          while((k = keys.pop()) !== undefined){

            reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');

            if(k.match(patterns.push)){
              merge = build([], push_counter(reverse_key), merge);
            }

            else if(k.match(patterns.fixed)){
              merge = build([], k, merge);
            }

            else if(k.match(patterns.named)){
              merge = build({}, k, merge);
            }
          }

          formQuery = removeAllBlankOrNull( jQuery.extend(true, formQuery, merge) );
        });

        if( jQuery.isEmptyObject(formQuery.bool.must_not) ) {
          formQuery.bool.must_not = [];
        }

        console.log( 'formQuery', formQuery );

        $scope.query = formQuery;

        prepare_query();

        //debug( '$scope.query', $scope.query );

        if( $scope.searchForm ) {
          $scope.toggleSearchForm();
        }

        $scope.$apply();

        $scope.getProperties();

      } );

      /**
       * BACK HISTORY EVENT
       */
      window.addEventListener( 'popstate', function popstateHandler(){
        debug('popstateHandler');

        // Get current location params
        var location = window.location.href.split('?');
        var locationQuery = {};
        if( typeof location[1] !== 'undefined' ) {
          parse_str( location[1], locationQuery );
        }

        $scope.$apply();
        $scope.getProperties();

      }, false);

      $scope.getProperties();

    }

    function MarkerClustererCalculator(markers, numStyles){
      // debug( 'MarkerClustererCalculator', markers.length );

      var index = 0;
      var title = "";
      var count = markers.length.toString();

      var dv = count;
      while (dv !== 0) {
        dv = parseInt(dv / 10, 10);
        index++;
      }

      index = Math.min(index, numStyles);

      var _total_count = 0;
      var _label = [];
      var _type = null;

      angular.forEach(markers, function eachMarker( marker ) {
        // debug( 'MarkerClustererCalculator eachMarker someCluster.key', marker.someCluster.key );
        _total_count =  _total_count + parseInt( marker.labelContent )
        _label.push(marker.someCluster.key);
        _type = marker.someCluster.type;
      });

      // 5700 listings in Wake,Johnston,Durham,Franklin,Clay,Misc location_county
      title = _total_count + ' listings in ' + _label.join( ', ' ) + ' ' + _type;

      // debug( 'MarkerClustererCalculator', 'title', title );

      return {
        text: _total_count,
        doc_count: _total_count,
        index: index,
        title: title,
        keys: _label,
        type: _type
      };

    };

    /**
     * Angular Module.
     */
    angular.module( vars.ng_app, [ 'ngMap', 'smart-table', 'ngSanitize' ] )

      /**
       * Autocomplete directive.
       * It requires jQuery UI.
       *
       * It's not used for the current advanced View,
       * but can be used for custom solutions as well!
       */
      .directive('autoComplete', function($timeout) {
        return function(scope, iElement, iAttrs) {
          var uiItems = iAttrs.uiItems;
          var source;
          uiItems = uiItems.split('.');

          for( var i=0; i<uiItems.length; i++ ) {
            if(!source) {
              if( typeof scope[uiItems[i]] !== 'undefined' ) {
                source = scope[uiItems[i]];
              } else {
                break;
              }
            } else if( typeof source[uiItems[i]] !== 'undefined' ) {
              source = source[uiItems[i]];
            } else {
              break;
            }
          }

          if(!source || !source.length > 0) {
            debug('error on trying to get source for autoComplete directive');
            return null;
          }
          iElement.autocomplete({
            source: source
          });
        };
      })

      .filter('simpleAmount', function() {
        return function( int ) {
          if ( !int || int == 0 ) return '';
          int = Math.round(int/1000)*1000
          if ( !String(int).length ) return '';
          return '$' + ( int / 1000 ) + 'k';
        };
      })

      .filter('acreage', function() {
        return function( int ) {
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

      .controller( 'main', [ '$document', '$scope', '$http', '$filter', 'NgMap', supermapController ] );

  };

  /**
   * Experimental.
   *
   */
  function restrictBounds() {
    var strictBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng( 35.132123, -77.154236 ),
      new google.maps.LatLng( 36.065613, -79.455872 )
    );

    google.maps.event.addListener( map, 'dragend', function () {
      if( strictBounds.contains( map.getCenter() ) ) return;

      // We're out of bounds - Move the map back within the bounds
      var c = map.getCenter(),
        x = c.lng(),
        y = c.lat(),
        maxX = strictBounds.getNorthEast().lng(),
        maxY = strictBounds.getNorthEast().lat(),
        minX = strictBounds.getSouthWest().lng(),
        minY = strictBounds.getSouthWest().lat();

      if( x < minX ) x = minX;
      if( x > maxX ) x = maxX;
      if( y < minY ) y = minY;
      if( y > maxY ) y = maxY;

      map.setCenter( new google.maps.LatLng( y, x ) );
    } );

  }

  function removeAllBlankOrNull(JsonObj) {
    jQuery.each(JsonObj, function(key, value) {
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
      utf8Overhead = function(chr) {
        var code = chr.charCodeAt(0);
        if (  code < 0x0080
          || 0x00A0 <= code && code <= 0x00FF
          || [338,339,352,353,376,402,8211,8212,8216,8217,8218,8220,8221,8222,8224,8225,8226,8230,8240,8364,8482].indexOf(code)!=-1)
        {
          return 0;
        }
        if (code < 0x0800) {
          return 1;
        }
        return 2;
      };
    error = function(type, msg, filename, line) {
      throw new that.window[type](msg, filename, line);
    };
    read_until = function(data, offset, stopchr) {
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
    read_chrs = function(data, offset, length) {
      var i, chr, buf;

      buf = [];
      for (i = 0; i < length; i++) {
        chr = data.slice(offset + (i - 1), offset + i);
        buf.push(chr);
        length -= utf8Overhead(chr);
      }
      return [buf.length, buf.join('')];
    };
    _unserialize = function(data, offset) {
      var dtype, dataoffset, keyandchrs, keys, contig,
        length, array, readdata, readData, ccount,
        stringlength, i, key, kprops, kchrs, vprops,
        vchrs, value, chrs = 0,
        typeconvert = function(x) {
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
          typeconvert = function(x) {
            return parseInt(x, 10);
          };
          readData = read_until(data, dataoffset, ';');
          chrs = readData[0];
          readdata = readData[1];
          dataoffset += chrs + 1;
          break;
        case 'b':
          typeconvert = function(x) {
            return parseInt(x, 10) !== 0;
          };
          readData = read_until(data, dataoffset, ';');
          chrs = readData[0];
          readdata = readData[1];
          dataoffset += chrs + 1;
          break;
        case 'd':
          typeconvert = function(x) {
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
      fixStr = function(str) {
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
      var _parts = parse_query_string( window.location.search );

      if( _parts[ name ] ) {
        // debug( 'getParameterByName', name, _parts[ name ] );
        return _parts[ name ];
      }

      // debug( 'getParameterByName', name, 'empty result' );

      return '';
    }

    // debug( 'getParameterByName', name, decodeURIComponent(results[2].replace(/\+/g, " ")) );
    return decodeURIComponent(results[2].replace(/\+/g, " "));
  }

  /**
   * get URL vars
   * @returns {Array}
   */
  function getUrlVars() {
    var vars = [], hash;
    var window_url = decodeURI(window.location.href);
    var hashes = window_url.slice(window_url.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  function alterQueryParams() {


    //current url taxonomy terms
    var current_term = {
      key : getParameterByName('_taxonomy'),
      values: [ getParameterByName('_term') ],
    };


    window.sm_current_terms = window.sm_current_terms || current_term;

  }

  /**
   * Initialize our Supermap modules ( Angular Modules! )
   */
  function initialize() {

    //alter query params
    // alterQueryParams();


    jQuery( '.wpp-advanced-supermap').each( function( i,e ) {
      jQuery( e ).wpp_advanced_supermap( {
        'query': jQuery(e).data( 'query' ) || false,
        'atts': jQuery(e).data( 'atts' ) || false,
        'ng_app': jQuery(e).attr( 'ng-app' ) || false
      } );
    } );
  }

  /**
   * Initialization
   */
  initialize();


  // geohash.js
// Geohash library for Javascript
// (c) 2008 David Troy
// Distributed under the MIT License

  BITS = [16, 8, 4, 2, 1];

  BASE32 = 											   "0123456789bcdefghjkmnpqrstuvwxyz";
  NEIGHBORS = { right  : { even :  "bc01fg45238967deuvhjyznpkmstqrwx" },
    left   : { even :  "238967debc01fg45kmstqrwxuvhjyznp" },
    top    : { even :  "p0r21436x8zb9dcf5h7kjnmqesgutwvy" },
    bottom : { even :  "14365h7k9dcfesgujnmqp0r2twvyx8zb" } };
  BORDERS   = { right  : { even : "bcfguvyz" },
    left   : { even : "0145hjnp" },
    top    : { even : "prxz" },
    bottom : { even : "028b" } };

  NEIGHBORS.bottom.odd = NEIGHBORS.left.even;
  NEIGHBORS.top.odd = NEIGHBORS.right.even;
  NEIGHBORS.left.odd = NEIGHBORS.bottom.even;
  NEIGHBORS.right.odd = NEIGHBORS.top.even;

  BORDERS.bottom.odd = BORDERS.left.even;
  BORDERS.top.odd = BORDERS.right.even;
  BORDERS.left.odd = BORDERS.bottom.even;
  BORDERS.right.odd = BORDERS.top.even;

  function refine_interval(interval, cd, mask) {
    if (cd&mask)
      interval[0] = (interval[0] + interval[1])/2;
    else
      interval[1] = (interval[0] + interval[1])/2;
  }

  function calculateAdjacent(srcHash, dir) {
    srcHash = srcHash.toLowerCase();
    var lastChr = srcHash.charAt(srcHash.length-1);
    var type = (srcHash.length % 2) ? 'odd' : 'even';
    var base = srcHash.substring(0,srcHash.length-1);
    if (BORDERS[dir][type].indexOf(lastChr)!=-1)
      base = calculateAdjacent(base, dir);
    return base + BASE32[NEIGHBORS[dir][type].indexOf(lastChr)];
  }

  function decodeGeoHash(geohash) {

    debug( 'decodeGeoHash', geohash );

    var is_even = 1;
    var lat = []; var lon = [];
    lat[0] = -90.0;  lat[1] = 90.0;
    lon[0] = -180.0; lon[1] = 180.0;
    lat_err = 90.0;  lon_err = 180.0;

    for (i=0; i<geohash.length; i++) {
      c = geohash[i];
      cd = BASE32.indexOf(c);
      for (j=0; j<5; j++) {
        mask = BITS[j];
        if (is_even) {
          lon_err /= 2;
          refine_interval(lon, cd, mask);
        } else {
          lat_err /= 2;
          refine_interval(lat, cd, mask);
        }
        is_even = !is_even;
      }
    }
    lat[2] = (lat[0] + lat[1])/2;
    lon[2] = (lon[0] + lon[1])/2;

    return { lat: lat[0], lng: lon[0]};
  }

  function encodeGeoHash(latitude, longitude) {
    var is_even=1;
    var i=0;
    var lat = []; var lon = [];
    var bit=0;
    var ch=0;
    var precision = 12;
    geohash = "";

    lat[0] = -90.0;  lat[1] = 90.0;
    lon[0] = -180.0; lon[1] = 180.0;

    while (geohash.length < precision) {
      if (is_even) {
        mid = (lon[0] + lon[1]) / 2;
        if (longitude > mid) {
          ch |= BITS[bit];
          lon[0] = mid;
        } else
          lon[1] = mid;
      } else {
        mid = (lat[0] + lat[1]) / 2;
        if (latitude > mid) {
          ch |= BITS[bit];
          lat[0] = mid;
        } else
          lat[1] = mid;
      }

      is_even = !is_even;
      if (bit < 4)
        bit++;
      else {
        geohash += BASE32[ch];
        bit = 0;
        ch = 0;
      }
    }
    return geohash;
  }

} )( jQuery, wpp );

