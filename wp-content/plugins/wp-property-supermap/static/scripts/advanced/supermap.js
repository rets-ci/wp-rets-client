/**
 *
 */

( function( jQuery, wpp ){

  /**
   *
   * @param options
   */
  jQuery.fn.wpp_advanced_supermap = function( options ) {

    var ngAppDOM = jQuery( this );

    /** Making variables public */
    var vars = jQuery.extend({
      'ng_app': false,
      'query': false,
      'atts': false
    }, options);

    if( !vars.ng_app ) {
      console.log( 'wpp_advanced_supermap: ng_app is undefined!' );
      return;
    }

    if( !vars.query ) {
      console.log( 'wpp_advanced_supermap: query is undefined!' );
      return;
    }

    // Prepare DOM before initialize angular.

    vars.atts = vars.atts ? unserialize( decodeURIComponent( vars.atts).replace(/\+/g, " ") ) : {};

    if( typeof vars.atts.map_height !== 'undefined' ) {
      ngAppDOM.css( 'height', vars.atts.map_height );
      jQuery( 'ng-map', ngAppDOM).css( 'height', vars.atts.map_height );
      jQuery( '.sm-properties-list-wrap', ngAppDOM).css( 'height', vars.atts.map_height );
      jQuery( '.sm-properties-list-wrap', ngAppDOM ).show();
    }

    /**
     * Be sure our module App is shown
     */
    ngAppDOM.show();

    /**
     * Angular Module.
     */
    angular.module( vars.ng_app, [ 'ngMap', 'smart-table' ] )

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
            console.log('error on trying to get source for autoComplete directive');
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

      .controller( 'main', [ '$document', '$scope', '$http', '$filter', 'NgMap', function( $document, $scope, $http, $filter, NgMap ){

        var resizeTimer, idle_listener, mapChangedTimer;
        jQuery( window ).on( 'resize', function () {
          clearTimeout( resizeTimer );
          resizeTimer = setTimeout( function () {
            NgMap.getMap().then(function(map){
              google.maps.event.trigger(map, "resize");
            });
          }, 250 );
        } ).resize();

        $scope.query = unserialize( decodeURIComponent( vars.query ).replace(/\+/g, " ") );
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
        $scope.rdc_listing = window.sm_rdc_listing || true;

        $scope.map_filter_taxonomy = window.sm_current_terms.key || '';
        $scope.current_filter = window.sm_current_filter || {};
        $scope.tax_must_query = window.sm_must_tax_query || {};
        $scope.rdc_listing_query = window.sm_rdc_listing_query || {};

        $scope.view = {
          mode: {
            table: isMobile == true ? false : true,
            preview: isMobile == true ? true : false,
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
            setTimeout(function(){jQuery(document).trigger('rdc_cols_changed');}, 100);
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
        $scope.sale_type_checked = function(current) {
          var _types = [];

          if ( _types = $scope.current_filter.sale_type.split(',') ) {
            for (var i in _types) {
              if ( _types[i] == current ) return true;
            }
          }

          return false;
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
            $scope.current_filter.acrage[mode] = Math.round(parseInt(jQuery(target).val())/10)*10;
            if ( mode == 'min' ) {
              this.current_min = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
            } else {
              this.current_max = Math.round(parseInt(jQuery(target).val()) / 10) * 10;
            }
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

        var index = 'v5',
            type = 'property';

        /**
         * @type {$.es.Client|*}
         */
        var client = new jQuery.es.Client({
          hosts: 'site:1d5f77cffa8e5bbc062dab552a3c2093@dori-us-east-1.searchly.com'
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

          if (typeof r._source.tax_input.price_per_sqft!='undefined') {
            r._source.tax_input.price_per_sqft[0] = parseFloat(r._source.tax_input.price_per_sqft[0]);
          } else {
            r._source.tax_input.price_per_sqft = [0];
          }

          r._source.tax_input.approximate_lot_size[0] = parseFloat( r._source.tax_input.approximate_lot_size[0] );
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
          // maybe alter something
          return $scope.query;
        }

        /**
         *
         */
        function getMoreProperties() {
          jQuery( '.sm-search-form form').addClass('processing');
          $scope.toggleSearchButton();
          $scope._request = client.search({
            index: index,
            type: type,
            body: {
              query: build_query()
            },
            _source: $scope.atts.fields,
            size: 800,
            from: $scope.properties.length,
            sort: "post_title:asc"
          }, function( error, response ) {

            if ( !error ) {

              if( typeof response.hits.hits == 'undefined' ) {
                console.log( 'Error occurred during getting properties data.' );
              } else {
                $scope.total = response.hits.total;
                response.hits.hits.filter(cast_fields);
                Array.prototype.push.apply($scope.properties, response.hits.hits);
                $scope.refreshMarkers(false);

                if ( $scope.total > $scope.properties.length ) {
                  getMoreProperties();
                }else{
                  jQuery( '.sm-search-form form').removeClass('mapChanged');
                }
              }
              $scope.col_changed();
            } else {
              console.error(error);
              jQuery( '.sm-search-form form').removeClass('mapChanged');
            }
            jQuery( '.sm-search-form form').removeClass('processing');
            $scope.toggleSearchButton();
          });
        }

        /**
         * toggle search filter button loading icon and search icon
         */
        $scope.toggleSearchButton = function () {
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

          if ( $scope._request ) {
            $scope._request.abort();
          }
          jQuery( '.sm-search-form form').addClass('processing');
          $scope.toggleSearchButton();

          $scope._request = client.search({
            index: index,
            type: type,
            body: {
              query: build_query()
            },
            _source: $scope.atts.fields,
            size: 100,
            sort: "post_title:asc"
          }, function( error, response ) {

            if ( !error ) {
              jQuery( '.sm-search-layer', ngAppDOM ).show();

              $scope.loaded = true;

              if( typeof response.hits.hits == 'undefined' ) {
                console.log( 'Error occurred during getting properties data.' );
              } else {
                response.hits.hits.filter(cast_fields);
                if( ! jQuery.isEmptyObject($scope.rdc_listing_query) && ! $scope.rdc_listing ) {
                  $scope.total = $scope.total + response.hits.total;
                  Array.prototype.push.apply($scope.properties, response.hits.hits);
                }else{
                  $scope.total = response.hits.total;
                  $scope.properties = response.hits.hits;
                }
                // Select First Element of Properties Collection
                if( $scope.properties.length > 0 ) {
                  $scope.currentProperty = $scope.properties[0];
                  $scope.properties[0].isSelected = true;
                  $scope.loadImages($scope.properties[0]);
                }
                $scope.refreshMarkers( jQuery( '.sm-search-form form').hasClass('mapChanged') ? false : true );
                console.log($scope.total);
                if ( $scope.total > $scope.properties.length ) {
                  getMoreProperties();
                }else if($scope.rdc_listing){
                  $scope.rdc_listing = false;
                  jQuery('.sm-search-form form').submit();
                }else{
                  jQuery( '.sm-search-form form').removeClass('mapChanged');
                }
              }
              $scope.col_changed();
            } else {
              console.error(error);
              jQuery( '.sm-search-form form').removeClass('mapChanged');
            }

            jQuery( '.sm-search-form form').removeClass('processing');
            $scope.toggleSearchButton();

          });

        };

        /**
         *
         */
        $scope.col_changed = function() {
          jQuery(document).trigger('rdc_cols_changed');
        };

        /**
         * map zoom or drag event listener for search results refresh
         */
        NgMap.getMap().then(function( map ) {
          if( isMobile == true ) {
            return false;
          }
          idle_listener = map.addListener('idle', function () {
            var bounds = map.getBounds();
            var SouthWestLatitude = bounds.getSouthWest().lat();
            var NorthEastLatitude = bounds.getNorthEast().lat();
            var NorthEastLongitude = bounds.getNorthEast().lng();
            var SouthWestLongitude = bounds.getSouthWest().lng();
            if (( SouthWestLatitude != 0 && NorthEastLatitude != 0 ) && ( SouthWestLongitude != 180 && NorthEastLongitude != -180 )) {
              jQuery('.rdc-latitude-gte').val(SouthWestLatitude);
              jQuery('.rdc-latitude-lte').val(NorthEastLatitude);
              jQuery('.rdc-longitude-gte').val(NorthEastLongitude);
              jQuery('.rdc-longitude-lte').val(SouthWestLongitude);
              clearTimeout(mapChangedTimer);
              mapChangedTimer = setTimeout(function () {
                jQuery('.sm-search-form form').addClass('mapChanged');
                $scope.rdc_listing = true;
                jQuery('.sm-search-form form').submit();
              }, 250);
            }
          });
        });

        $scope.resetMapBounds = function resetMapBounds() {
          jQuery('.rdc-latitude-gte').val('');
          jQuery('.rdc-latitude-lte').val('');
          jQuery('.rdc-longitude-gte').val('');
          jQuery('.rdc-longitude-lte').val('');
        };

        jQuery('table.sm-properties-list,ul.sm-columns-sorter').bind("DOMSubtreeModified", function(){
          if( $scope.propertiesTableCollection.length > 0 ) {
            $scope.selectRow($scope.propertiesTableCollection[0]);
          }
        });

        /**
         * Refresh Markers ( Marker Cluster ) on Google Map
         */
        $scope.refreshMarkers = function refreshMarkers( update_map_pos ) {
          NgMap.getMap().then(function( map ) {
            $scope.dynMarkers = [];
            $scope.latLngs = [];

            // Clears all clusters and markers from the clusterer.
            if( typeof $scope.markerClusterer == 'object' ) {
              $scope.markerClusterer.clearMarkers();
            }

            if( typeof $scope.infoBubble !== 'object' ) {
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
            }

            for ( var i=0; i < $scope.properties.length; i++ ) {
              var latLng = new google.maps.LatLng( $scope.properties[i]._source.tax_input.location_latitude[0], $scope.properties[i]._source.tax_input.location_longitude[0] );
              latLng.listingId = $scope.properties[i]._id;
              var marker = new google.maps.Marker( {
                position: latLng
                //icon: $scope.properties[i]._map_marker_url
              } );
              marker.listingId = $scope.properties[i]._id;

              $scope.dynMarkers.push( marker );
              $scope.latLngs.push( latLng );

              /**
               * Marker Click Event!
               * - Selects Table Page
               * - Selects Collection Row
               */
              google.maps.event.addListener( marker, 'click', ( function( marker, i, $scope ) {
                return function() {
                  // Preselect a row
                  var index;
                  for ( var i = 0, len = $scope.properties.length; i < len; i += 1) {
                    var property = $scope.properties[i];
                    if ( property._id == marker.listingId ) {
                      property.isSelected = true;
                      $scope.currentProperty = property;
                      $scope.loadImages(property);
                      index = i;
                    } else {
                      property.isSelected = false;
                    }
                  }
                  // Maybe Select Page!
                  if( index !== null ) {
                    var pageNumber = Math.ceil( ( index + 1 ) / $scope.per_page );
                    angular
                      .element( jQuery( '.collection-pagination', ngAppDOM ) )
                      .isolateScope()
                      .selectPage( pageNumber );
                  }
                  $scope.$apply();
                }
              })( marker, i, $scope ) );

            }

            if ( update_map_pos ) {
              // Set Map 'Zoom' and 'Center On' automatically using existing markers.
              $scope.latlngbounds = new google.maps.LatLngBounds();
              for (var i = 0; i < $scope.latLngs.length; i++) {
                $scope.latlngbounds.extend($scope.latLngs[i]);
              }
              map.fitBounds($scope.latlngbounds);
            }

            // Finally Initialize Marker Cluster
            $scope.markerClusterer = new MarkerClusterer( map, $scope.dynMarkers, {
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
            }
            );
          } );

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
        $scope.loadImages = function loadImages( row ) {
          if ( ( typeof row.images == 'undefined' || !row.images.length ) && !row._is_loading_images ) {
            row._is_loading_images = true;
            client.get({
              index: index,
              type: type,
              id: row._id,
              _source: ['meta_input.rets_media.*', 'meta_input.data_source_logo']
            }, function (error, response) {

              if ( !error ) {

                row._is_loading_images = false;

                if( typeof response._source.meta_input.rets_media == 'undefined' ) {
                  console.log( 'Error occurred during getting properties data.' );
                } else {
                  row.images = response._source.meta_input.rets_media;
                  $scope.$apply();
                }

                if( typeof response._source.meta_input.data_source_logo == 'undefined' ) {
                  console.log( 'Error occurred during getting properties data.' );
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

        /**
         *
         */
        var $select = jQuery('.termsSelection').select2({
          placeholder: 'Location',
          minimumInputLength: 3,
          maximumSelectionLength: 1,
          ajax: {
            url: "/wp-admin/admin-ajax.php?action=mapFilterAutocomplete",
            dataType: 'json',
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
            if (city.loading) return 'Searching...';
            var html = "<span style='float: left; max-width: 200px; overflow: hidden; height: 23px;'>" + city.name  + "</span><span style='float: right; color: #cf3428;'>" + city.taxonomy_label + "</span>";
            return html;
          },
          escapeMarkup: function (markup) { return markup; },
          templateSelection: function formatRepoSelection (term) {
            if ( typeof term.taxonomy != 'undefined' ) {
              $scope.map_filter_taxonomy = term.taxonomy;
            }
            return term.text || term.name;
          }
        });

        if ( window.sm_current_terms.values && window.sm_current_terms.values.length ) {
          var $option = jQuery('<option selected>Loading...</option>').val(window.sm_current_terms.values[0]).text(window.sm_current_terms.values[0]);
          $select.append($option).trigger('change');
        }

        /**
         * SEARCH FILTER EVENT
         *
         * We're using jQuery instead of AngularJS here because
         * property search form is being generated via [property_search] shortcode
         * or even can be custom, since we are using apply_filters on rendering.
         */
        jQuery( '.sm-search-form form', ngAppDOM).on( 'submit', function(e){
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

          jQuery.each(jQuery( this ).serializeArray(), function(){

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

          if( ! jQuery.isEmptyObject($scope.rdc_listing_query) && $scope.rdc_listing ) {
            formQuery.bool.must.push($scope.rdc_listing_query);
          }

          if( ! jQuery.isEmptyObject($scope.rdc_listing_query) && ! $scope.rdc_listing ) {
            formQuery.bool.must_not = [ $scope.rdc_listing_query ];
          }

          //merging the current taxonomy if tax archieve page
          if( ! jQuery.isEmptyObject($scope.tax_must_query) && ! $scope.rdc_listing ) {
            formQuery.bool.must.push($scope.tax_must_query);
          }

          $scope.query = formQuery;

          $scope.query.bool.must = $scope.query.bool.must.filter(Boolean);

          $scope.toggleSearchForm();
          $scope.$apply();
          $scope.getProperties();

        } );

        /**
         * BACK HISTORY EVENT
         */
        window.addEventListener( 'popstate', function(){

          // Get current location params
          var location = window.location.href.split('?');
          var locationQuery = {};
          if( typeof location[1] !== 'undefined' ) {
            parse_str( location[1], locationQuery );
          }

          $scope.$apply();
          $scope.getProperties();

        }, false);

        // Get properties by request
        $scope.getProperties();

      } ] );

  };

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
   * Initialize our Supermap modules ( Angular Modules! )
   */
  function initialize() {
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

} )( jQuery, wpp );

