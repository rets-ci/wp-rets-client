module.exports = function ( grunt ) {

  process.env.ES_HOST = 'site:462410d704f694edb7422745387c6b12@dori-us-east-1.searchly.com';
  process.env.ES_INDEX = 'v5';
  process.env.ES_TYPE = 'property';

  grunt.initConfig( {} );

  grunt.registerTask( "default", defaultTask );
  grunt.registerTask( "primeRedirectionCache", primeRedirectionCache );
  grunt.registerTask( "primeSitemapCache", primeSitemapCache );

  /**
   *
   * grunt primeRedirectionCache
   * DEBUG=prime grunt primeRedirectionCache
   *
   */
  function primeRedirectionCache() {

    var taskDone = this.async();
    var debug = require( 'debug' )('prime');

    var esQuery = {
      "index": process.env.ES_INDEX,
      "type": process.env.ES_TYPE,
      "size": 1,
      "from": 0,
      "scroll": '300m',
      "body": {
        "query": {
          "filtered": {
            "filter": {
              "bool": {
                "must": [
                  {
                    "exists": { "field": "_permalink" }
                  }
                ]
              }
            }
          }
        }
      }
    };

    var q = async.queue(function (task, callback) {
      //debug('Doing task [%s].', task.location);
      cache_prime_request(task.location, callback);
    }, 2);



    scrollResults( esQuery, handleListing, function () {
      debug( 'scrollComplete' );
      taskDone();
    } );

    var _done = 0;

    function handleListing( source, callback, doc ) {
      // debug( '[%s] Priming [%s] ID.', _done, doc._id );
      //debug( 'https://www.reddoorcompany.com/listing/' + doc._id );

      cache_prime_request( 'https://d2v5c8pxcauet3.cloudfront.net/listing/' + doc._id, callback );

    }

    function cache_prime_request( target_url, request_done ) {
      // debug( '[%s] Making Cache Prime request to [%s].', _done, target_url );

      var _requestOptions = {
        url: target_url.replace( 'www.reddoorcompany.com', 'd2v5c8pxcauet3.cloudfront.net' ),
        actualUrl:  target_url.replace( 'd2v5c8pxcauet3.cloudfront.net', 'www.reddoorcompany.com' ),
        method: 'GET',
        strictSSL: false,
        followRedirect: false,
        headers: {
          'host': 'www.reddoorcompany.com',
          'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'accept-language':'en-US,en;q=0.8',
          'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
        }
      };

      request(_requestOptions, function haveCallback( error, resp, body ) {

        _done++;

        if( error || !resp.headers ) {
          console.error( '[%s] Unable to prime [%s] url, error [%s]', _done, _requestOptions.actualUrl, ( error ? error.message : 'no-error' ) )
        }

        if( !error && resp.headers && resp.headers['location'] ) {

          if( _.get( resp, 'headers.age' ) ) {
            debug( '[%s] Already primed [%s] to with [%s] age.', _done, _requestOptions.actualUrl, _.get( resp, 'headers.age' ) );
          } else {
            debug( '[%s] Primed [%s] to follow [%s] url.', _done, _requestOptions.actualUrl, resp.headers[ 'location' ] )
          }

          q.push({location: resp.headers['location'], resp: resp}, function (err, resp) {

            if( _.get( resp, 'headers.age' ) ) {
              debug('[%s] Already primed [%s] with [%s] ttl.', _done, resp.headers['location'], _.get( resp, 'headers.age' ) );
            } else {
              debug('[%s] Primed [%s] with [%s] status code.', _done, _requestOptions.actualUrl, resp.statusCode);
            }

          });

        }

        if( !error && resp.headers && !resp.headers['location'] ) {
          debug( '[%s] Primed [%s], no-redirection, status [%s].', _done, _requestOptions.actualUrl, resp.statusCode );
        }

        if( 'function' === typeof request_done ) {
          request_done( null, resp );
        }

      });

    }

  }

  /**
   *
   * 'http://localhost/sitemap_index.xml'
   * 'http://localhost/property-sitemap1.xml'
   *
   */
  function primeSitemapCache() {

    var taskDone = this.async();

    var Sitemapper = require('sitemapper');

    var sitemap = new Sitemapper();

    sitemap.fetch('http://localhost/property-sitemap1.xml').then(function(sites) {
      console.log( require( 'util' ).inspect( sites.sites, { showHidden: false, depth: 2, colors: true } ) );

      taskDone();
    });


  }


  /**
   *
   */
  function defaultTask() {
    console.log( process.env.ES_ADDRESS );
  }

};


/**
 * Handler For Scrolling through large dataset with simple callback system
 *
 * @param query
 * @param documentHandler
 * @param done
 */
function scrollResults( query, documentHandler, done ) {

  var client = new require( 'elasticsearch' ).Client({
    host: process.env.ES_HOST,
    log: 'error'
  });

  var _scroll_id = null;

  function documentCallbackWrapper( hits, finalCallback ) {
    debug( 'scrollResults.documentCallbackWrapper', hits.length );

    async.each( hits, function ( body, callback ) {
      debug( 'Doing [%s] listing.', body._id );

      documentHandler( body._source, callback, body );

    }, finalCallback );

  }

  async.forever( function ( next ) {

    if( !_scroll_id ) {

      var _query  = {
          index: query.index,
          scroll: query.scroll || "60m",
          type: query.type,
          sort: query.sort || null,
          size: query.size || 100,
          from: query.size || 0,
          q: query.q || null,
          body: query.body || null,
        };


      client.search( _query, function ( error, response ) {

        if( !error && response && response.hits.hits.length ) {
          _scroll_id = response._scroll_id;
          console.log( 'Have first result set, out of [%s] total.', _.get( response, 'hits.total' ) );
          documentCallbackWrapper( response.hits.hits, next );
        } else {
          next( new Error( 'First request returned 0 hits' ) );
        }

      } );

    } else {

      client.scroll( {
        scrollId: _scroll_id,
        scroll: query.scroll || '60m'
      }, function ( error, response ) {
        if( !error && response && response.hits.hits.length ) {
          debug( 'Next scroll step done.' );
          documentCallbackWrapper( response.hits.hits, next );
        } else if( error ) {
          console.log( 'Error', error );
          next( error );
        } else if( !response.hits.hits.length ) {
          // console.log( 'Done' );
          next( true );
        }
      } );

    }

  }, function ( error ) {
    debug('DONE', error);
    done();
  } );

}

var elasticsearch = require( 'elasticsearch' );
var debug = require( 'debug' )('gruntfile');
var request = require( 'request' );
var _ = require( 'lodash' );
var colors = require( 'colors' );
var async = require( 'async' );
