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

    vars.atts = vars.atts ? unserialize( decodeURIComponent( vars.atts ) ) : {};

    if( typeof vars.atts.map_height !== 'undefined' ) {
      ngAppDOM.css( 'height', vars.atts.map_height );
      jQuery( 'ng-map', ngAppDOM).css( 'height', vars.atts.map_height );
      jQuery( '.sm-properties-list-wrap', ngAppDOM).css( 'height', vars.atts.map_height );
    }

    /**
     * Be sure our module App is shown
     */
    ngAppDOM.show();

    /**
     * Angular Module.
     */
    angular.module( vars.ng_app, [ 'ngMap', 'smart-table' ] )

      .controller( 'main', [ '$scope', '$http', '$filter', 'NgMap', function( $scope, $http, $filter, NgMap ){

        $scope.query = unserialize( decodeURIComponent( vars.query ) );
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

        jQuery( '.sm-search-layer', ngAppDOM ).show();
        jQuery( '.sm-properties-list-wrap', ngAppDOM ).show();

        /**
         * Get Properties by provided Query ( filter )
         */
        $scope.getProperties = function getProperties() {
          //console.log( { "action": "supermap_get_properties", "json": true, "wpp_search": $scope.query } );
          var getQuery = jQuery.param( { "action": "/supermap/get_properties", "json": true, "wpp_search": $scope.query } );
          $http({
            method: 'GET',
            url: wpp.instance.ajax_url + '?' + getQuery
          }).then(function successCallback(response) {

            $scope.loaded = true;

            if( typeof response.data.total == 'undefined' || typeof response.data.data == 'undefined' ) {
              console.log( 'Error occurred during getting properties data.' );
            } else {
              $scope.total = response.data.total;
              $scope.properties = response.data.data;
              // Select First Element of Properties Collection
              if( $scope.properties.length > 0 ) {
                $scope.properties[0].isSelected = true;
              }
              $scope.refreshMarkers();
            }
          }, function errorCallback(response) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log( 'Error occurred during getting properties data.' );
          });
        }

        /**
         * Refresh Markers ( Marker Cluster ) on Google Map
         */
        $scope.refreshMarkers = function refreshMarkers() {
          NgMap.getMap().then(function( map ) {
            $scope.dynMarkers = [];
            $scope.latLngs = [];

            // Clears all clusters and markers from the clusterer.
            if( typeof $scope.markerClusterer == 'object' ) {
              $scope.markerClusterer.clearMarkers();
            }

            if( typeof $scope.infoWindow !== 'object' ) {
              $scope.infoWindow = new google.maps.InfoWindow();
            }

            if( typeof $scope.infoBubble !== 'object' ) {
              $scope.infoBubble = new InfoBubble({
                map: map,
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
              var latLng = new google.maps.LatLng( $scope.properties[i].latitude, $scope.properties[i].longitude );
              latLng.listingId = $scope.properties[i].ID;
              var marker = new google.maps.Marker( {
                position: latLng,
                icon: $scope.properties[i]._map_marker_url
              } );
              marker.listingId = $scope.properties[i].ID;

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
                    if ( property.ID == marker.listingId ) {
                      property.isSelected = true;
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

            // Set Map 'Zoom' and 'Center On' automatically using existing markers.
            $scope.latlngbounds = new google.maps.LatLngBounds();
            for (var i = 0; i < $scope.latLngs.length; i++) {
              $scope.latlngbounds.extend( $scope.latLngs[i] );
            }
            map.fitBounds( $scope.latlngbounds );
            // Finally Initialize Marker Cluster
            $scope.markerClusterer = new MarkerClusterer( map, $scope.dynMarkers, {} );
          } );
        }

        /**
         * Toogle Search Form
         */
        $scope.toggleSearchForm = function toggleSearchForm() {
          $scope.searchForm = !$scope.searchForm;
        }

        /**
         * Fixes selected Row.
         *
         * @param row
         */
        $scope.selectRow = function selectRow(row) {
          var index = null;
          for (var i = 0, len = $scope.properties.length; i < len; i += 1) {
            $scope.properties[i].isSelected = false;

          }
          row.isSelected = true;
        }

        /**
         * Fired when table row is selected
         */
        $scope.$watch( 'properties', function( rows ) {
          // get selected row
          rows.filter(function(r) {
            if (r.isSelected) {
              $scope.currentProperty = r;
            }
          })
        }, true );

        /**
         * Fired when currentProperty is changed!
         * Opens InfoBubble Window!
         */
        $scope.$watch( 'currentProperty', function( currentProperty ) {
          //console.log( 'currentProperty', currentProperty );
          //console.log( 'dynMarkers', $scope.dynMarkers );
          //console.log( 'currentProperty', currentProperty );
          for ( var i=0; i<$scope.dynMarkers.length; i++ ) {
            if ( $scope.dynMarkers[i].listingId == currentProperty.ID ) {
              //console.log( 'Marker', $scope.dynMarkers[i] );
              NgMap.getMap().then( function( map ) {
                //*
                $scope.infoBubble.setContent( jQuery( '.sm-marker-infobubble', ngAppDOM ).html() );
                $scope.infoBubble.setPosition( $scope.latLngs[i] );
                //map.setCenter( $scope.latLngs[i] );
                $scope.infoBubble.open( map );
                //*/
                /*
                $scope.infoWindow.setContent( jQuery( '.sm-marker-infobubble', ngAppDOM ).html() );
                $scope.infoWindow.setPosition( $scope.latLngs[i] );
                $scope.infoWindow.open( map );
                //*/
              } );
              break;
            }
          }
        }, true );

        /**
         * SEARCH FILTER EVENT
         *
         * We're using jQuery instead of AngularJS here because
         * property search form is being generated via [property_search] shortcode
         * or even can be custom, since we are using apply_filters on rendering.
         */
        jQuery( '.sm-search-form form', ngAppDOM).on( 'submit', function(e){
          e.preventDefault();

          // Get search params from Property Search Form
          var formQuery = {};
          parse_str( jQuery( this ).serialize(), formQuery );

          // Get current location params
          var location = window.location.href.split('?');
          var locationQuery = {};
          if( typeof location[1] !== 'undefined' ) {
            parse_str( location[1], locationQuery );
          }

          //console.log( 'location', location );

          // Extend scope query with Property Search Form params
          //angular.extend( $scope.query, formQuery.wpp_search );
          $scope.query = formQuery.wpp_search;

          //console.log( '$scope.query', $scope.query );

          // Redeclare location's wpp_search param with Property Search Form's one
          // And update browser location href
          locationQuery.wpp_search = formQuery.wpp_search;

          //console.log( 'locationQuery', locationQuery );

          locationQuery = jQuery.param( locationQuery );

          //console.log( 'window.history.pushState', location[0] + '?' + locationQuery );

          window.history.pushState( null, null, location[0] + '?' + locationQuery );

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

          // Extend scope query with Property Search Form params
          //angular.extend( $scope.query, formQuery.wpp_search );
          $scope.query = typeof locationQuery.wpp_search !== 'undefined' ? locationQuery.wpp_search : {};

          $scope.$apply();
          $scope.getProperties();

        }, false);

        // Get properties by request
        $scope.getProperties();

      } ] );

  };

  /**
   *
   * @param data
   * @returns {*}
   */
  function unserialize(data) {
    //  discuss at: http://phpjs.org/functions/unserialize/
    // original by: Arpad Ray (mailto:arpad@php.net)
    // improved by: Pedro Tainha (http://www.pedrotainha.com)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // improved by: Chris
    // improved by: James
    // improved by: Le Torbi
    // improved by: Eli Skeggs
    // bugfixed by: dptr1988
    // bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // bugfixed by: Brett Zamir (http://brett-zamir.me)
    //  revised by: d3x
    //    input by: Brett Zamir (http://brett-zamir.me)
    //    input by: Martin (http://www.erlenwiese.de/)
    //    input by: kilops
    //    input by: Jaroslaw Czarniak
    //        note: We feel the main purpose of this function should be to ease the transport of data between php & js
    //        note: Aiming for PHP-compatibility, we have to translate objects to arrays
    //   example 1: unserialize('a:3:{i:0;s:5:"Kevin";i:1;s:3:"van";i:2;s:9:"Zonneveld";}');
    //   returns 1: ['Kevin', 'van', 'Zonneveld']
    //   example 2: unserialize('a:3:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";s:7:"surName";s:9:"Zonneveld";}');
    //   returns 2: {firstName: 'Kevin', midName: 'van', surName: 'Zonneveld'}

    var that = this,
      utf8Overhead = function(chr) {
        // http://phpjs.org/functions/unserialize:571#comment_95906
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
    //       discuss at: http://phpjs.org/functions/parse_str/
    //      original by: Cagri Ekin
    //      improved by: Michael White (http://getsprink.com)
    //      improved by: Jack
    //      improved by: Brett Zamir (http://brett-zamir.me)
    //      bugfixed by: Onno Marsman
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //      bugfixed by: stag019
    //      bugfixed by: Brett Zamir (http://brett-zamir.me)
    //      bugfixed by: MIO_KODUKI (http://mio-koduki.blogspot.com/)
    // reimplemented by: stag019
    //         input by: Dreamer
    //         input by: Zaide (http://zaidesthings.com/)
    //         input by: David Pesta (http://davidpesta.com/)
    //         input by: jeicquest
    //             note: When no argument is specified, will put variables in global scope.
    //             note: When a particular argument has been passed, and the returned value is different parse_str of PHP. For example, a=b=c&d====c
    //             test: skip
    //        example 1: var arr = {};
    //        example 1: parse_str('first=foo&second=bar', arr);
    //        example 1: $result = arr
    //        returns 1: { first: 'foo', second: 'bar' }
    //        example 2: var arr = {};
    //        example 2: parse_str('str_a=Jack+and+Jill+didn%27t+see+the+well.', arr);
    //        example 2: $result = arr
    //        returns 2: { str_a: "Jack and Jill didn't see the well." }
    //        example 3: var abc = {3:'a'};
    //        example 3: parse_str('abc[a][b]["c"]=def&abc[q]=t+5');
    //        returns 3: {"3":"a","a":{"b":{"c":"def"}},"q":"t 5"}

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

