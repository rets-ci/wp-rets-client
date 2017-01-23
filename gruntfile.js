module.exports = function ( grunt ) {

  process.env.ES_HOST = 'site:462410d704f694edb7422745387c6b12@dori-us-east-1.searchly.com';
  process.env.ES_INDEX = 'v5';
  process.env.ES_TYPE = 'property';

  grunt.initConfig( {} );

  grunt.registerTask( "default", defaultTask );
  grunt.registerTask( "primeRedirectionCache", primeRedirectionCache );

  /**
   *
   * grunt primeRedirectionCache
   * DEBUG=gruntfile grunt primeRedirectionCache
   *
   */
  function primeRedirectionCache() {

    var taskDone = this.async();

    var esQuery = {
      "index": process.env.ES_INDEX,
      "type": process.env.ES_TYPE,
      "size": 5,
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

    scrollResults( esQuery, handleListing, function () {
      console.log( 'scrollComplete' );
      taskDone();
    } );

    var _done = 0;

    function handleListing( source, callback, doc ) {
      debug( '[%s] Priming [%s] ID.', _done, doc._id );
      //console.log( 'https://www.reddoorcompany.com/listing/' + doc._id );

      var _requestOptions = {
        url: 'https://d2v5c8pxcauet3.cloudfront.net/listing/' + doc._id,
        actualUrl: 'https://www.reddoorcompany.com/listing/' + doc._id,
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

        if( error || !resp.headers || !resp.headers['location'] ) {
          console.error( '[%s] Unable to prime [%s] url.', _done, _requestOptions.actualUrl )

        }

        if( !error && resp.headers && resp.headers['location'] ) {
          console.error( '[%s] Primed [%s] to follow [%s] url.', _done, _requestOptions.actualUrl, resp.headers['location'] )
        }

        callback();

      });

    }

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
