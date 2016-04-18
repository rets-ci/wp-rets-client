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
          if ( !String(int).length ) return '';
          return '$' + ( int / 1000 ) + 'k';
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

      .controller( 'main', [ '$document', '$scope', '$http', '$filter', 'NgMap', function( $document, $scope, $http, $filter, NgMap ){

        $scope.query = unserialize( decodeURIComponent( vars.query ).replace(/\+/g, " ") );
        $scope.atts = vars.atts;
        $scope.total = 0;
        $scope.loaded = false;
        $scope.properties = [];
        $scope.propertiesTableCollection = [];
        $scope.wpp = wpp;
        $scope.dynMarkers = [];
        $scope.latLngs = [];
        $scope.per_page = typeof $scope.atts.per_page !== 'undefined' ? $scope.atts.per_page : 10;
        $scope.searchForm = false;
        $scope.map_filter_taxonomy = '';

        $scope._request = null;

        $scope.columns = {
          post_title: {
            label: 'Address',
            enable: 1
          },
          price: {
            label: 'Price',
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
          price_per_sqft: {
            label: 'Price per Sq.Ft.',
            enable: 1
          },
          approximate_lot_size: {
            label: 'Lot',
            enable: 1
          },
          sale_type: {
            label: 'Sale',
            enable: 0
          },
          days_on_market: {
            label: 'Days',
            enable: 0
          },
          subdivision: {
            label: 'Subdivision',
            enable: 0
          },
          neighborhood: {
            label: 'Neighborhood',
            enable: 0
          }
        };

        $scope.show_dropdown_columns = false;

        $document.bind('click', function(event){
          $scope.show_dropdown_columns = false;
          $scope.$apply();
        });

        /**
         *
         * @type {{min: $scope.pricing.min, max: $scope.pricing.max}}
         */
        $scope.pricing = {
          mode: false,

          current_min:'',
          current_max:'',

          min_prices: [ 25000, 50000, 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000 ],
          max_prices: [ 75000, 100000, 150000, 200000, 250000, 300000, 400000, 500000, 600000, 700000 ],

          set_min: function(_price) {
            this.current_min = _price;
            this.recalculate();
            this.mode = 'max';
          },

          set_max: function(_price) {
            this.current_max = _price;
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
        $scope.footage = {

          min_feet: [500, 750, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 5000],
          max_feet: [2000, 2500, 3000, 3500, 4000, 5000, 6000, 7000, 8000, 10000],

          recalculate: function ( current ) {
            var j;
            j = typeof current == 'number' ? current : 0;
            for( var i in this.max_feet ) {
              this.max_feet[i] = j += 500;
            }
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

        console.log( $scope.query );

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

          if (typeof r._source.tax_input.price_per_sqft!='undefined') {
            r._source.tax_input.price_per_sqft[0] = parseFloat(r._source.tax_input.price_per_sqft[0]);
          } else {
            r._source.tax_input.price_per_sqft = [0];
          }

          r._source.tax_input.approximate_lot_size[0] = parseFloat( r._source.tax_input.approximate_lot_size[0] );
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
                }
              }
            } else {
              console.error(error);
            }

          });
        }

        /**
         * Get Properties by provided Query ( filter )
         */
        $scope.getProperties = function getProperties() {

          if ( $scope._request ) {
            $scope._request.abort();
          }

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
                $scope.total = response.hits.total;
                response.hits.hits.filter(cast_fields);
                $scope.properties = response.hits.hits;
                // Select First Element of Properties Collection
                if( $scope.properties.length > 0 ) {
                  $scope.currentProperty = $scope.properties[0];
                  $scope.properties[0].isSelected = true;
                  loadImages($scope.properties[0]);
                }
                $scope.refreshMarkers( true );

                if ( $scope.total > $scope.properties.length ) {
                  getMoreProperties();
                }
              }
            } else {
              console.error(error);
            }

          });

        }

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
                      loadImages(property);
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
        function loadImages( row ) {
          if ( typeof row.images == 'undefined' || !row.images.length ) {
            client.get({
              index: index,
              type: type,
              id: row._id,
              _source: ['meta_input.rets_media.*']
            }, function (error, response) {

              if ( !error ) {

                if( typeof response._source.meta_input.rets_media == 'undefined' ) {
                  console.log( 'Error occurred during getting properties data.' );
                } else {
                  row.images = response._source.meta_input.rets_media;
                  $scope.$apply();
                }
              } else {
                console.error(error);
              }

            });
          }
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
          loadImages(row);
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
        jQuery('.termsSelection').select2({
          placeholder: 'Location',
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
          templateResult: function formatRepo (city) {
            if (city.loading) return 'Loading...';
            var html = "<span style='float: left; max-width: 200px; overflow: hidden; height: 23px;'>" + city.name  + "</span><span style='float: right; color: #cf3428;'>" + city.taxonomy_label + "</span>";
            return html;
          },
          escapeMarkup: function (markup) { return markup; },
          templateSelection: function formatRepoSelection (term) {
            $scope.map_filter_taxonomy = term.taxonomy;
            return term.name;
          }
        });

        /**
         * SEARCH FILTER EVENT
         *
         * We're using jQuery instead of AngularJS here because
         * property search form is being generated via [property_search] shortcode
         * or even can be custom, since we are using apply_filters on rendering.
         */
        jQuery( '.sm-search-form form', ngAppDOM).on( 'submit', function(e){
          e.preventDefault();

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

