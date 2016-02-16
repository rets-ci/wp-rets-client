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
    }

    /**
     * Angular Module.
     */
    angular.module( vars.ng_app, [ 'ngMap', 'smart-table' ] )

      .controller( 'main', [ '$scope', '$http', '$filter', 'NgMap', function( $scope, $http, $filter, NgMap ){

        $scope.query = unserialize( decodeURIComponent( vars.query ) );
        $scope.atts = vars.atts;
        $scope.total = 0;
        $scope.properties = [];
        $scope.propertiesTableCollection = [];
        $scope.wpp = wpp;
        $scope.dynMarkers = [];
        $scope.latLngs = [];
        $scope.per_page = typeof $scope.atts.per_page !== 'undefined' ? $scope.atts.per_page : 10;
        $scope.searchForm = false;

        /**
         * Be sure it's shown
         */
        ngAppDOM.show();

        /**
         * Get Properties by provided Query ( filter )
         */
        $scope.getProperties = function getProperties() {
          $http({
            method: 'GET',
            url: wpp.instance.ajax_url,
            params: angular.extend( { "action": "supermap_get_properties", "json": true }, $scope.query ),
          }).then(function successCallback(response) {

            if( typeof response.data.total == 'undefined' || typeof response.data.data == 'undefined' ) {
              console.log( 'Error occurred during getting properties data.' );
            } else {
              $scope.total = response.data.total;
              $scope.properties = response.data.data;
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

            $scope.infoWindow = new google.maps.InfoWindow();

            $scope.infoBubble = new InfoBubble({
              map: map,
              shadowStyle: 1,
              padding: 0,
              backgroundColor: '#f3f0e9',
              borderRadius: 4,
              arrowSize: 2,
              borderWidth: 0,
              borderColor: 'transparent',
              disableAutoPan: false,
              hideCloseButton: true,
              arrowPosition: 7,
              backgroundClassName: 'sm-infobubble-wrap',
              arrowStyle: 3
            });

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
         *
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
         * Fired when table row is selected
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

        // Get properties by requets
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

