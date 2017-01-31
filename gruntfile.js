module.exports = function ( grunt ) {

  process.env.ES_HOST = 'site:462410d704f694edb7422745387c6b12@dori-us-east-1.searchly.com';
  process.env.ES_INDEX = 'v5';
  process.env.ES_TYPE = 'property';

  grunt.initConfig( {} );

  grunt.registerTask( "default", defaultTask );
  grunt.registerTask( "primeCache", primeCache );
  grunt.registerTask( "watchCacheChange", watchCacheChange );

  /**
   *
   * clear; DEBUG=* grunt primeCache
   *
   * grunt primeCache
   *
   */
  function primeCache() {

    var taskDone = this.async();

    var debug = require( 'debug' )('prime');

    var _maps = require( './package').config.sitemaps;

    var _queue = async.queue(function (task, callback) {
      debug('Starting [primeCache] task [%s] with gzip [%s].', task.location, task.gzip);

      cache_prime_request(task.location, { gzip: task.gzip }, function responseCallback( error, resp, stats ) {

        if( stats.cached && stats.age > 10000 ) {
          console.log( stats.url.green, stats.options.gzip ? 'gzip' : '' );
        } else if( stats.cached && stats.age < 10000 ) {
          console.log( stats.url.blue, stats.options.gzip ? 'gzip' : '', stats.age );
        } else {
          console.log( stats.url.red, stats.options.gzip ? 'gzip' : '' );
        }

        //console.log( 'resp.headers', require( 'util' ).inspect( resp.headers, { showHidden: false, depth: 2, colors: true } ) );
        callback( error, resp, stats );

      });

    }, 10);

    var _sites = [];

    var Sitemapper = require('sitemapper');

    var sitemap = new Sitemapper();

    async.eachSeries( _maps, function eachMap( _map, done ) {
      //console.log( 'eachMap', _map );

      sitemap.fetch( 'https://usabilitydynamics-www-reddoorcompany-com-production.c.rabbit.ci/' + _map ).then(function(sites) {

        if( !sites || !sites.sites ) {
          debug( 'No sites from [%s] sitemap.', 'https://usabilitydynamics-www-reddoorcompany-com-production.c.rabbit.ci/' + _map + '.xml' );
          return done();
        }

        debug( 'Have [%s] urls from [%s] sitemap.', sites.sites.length, 'https://usabilitydynamics-www-reddoorcompany-com-production.c.rabbit.ci/' + _map );

        _.each(sites.sites, function( location ) {

          location = location.replace('usabilitydynamics-www-reddoorcompany-com-production.c.rabbit.ci', 'www.reddoorcompany.com');

          // console.log( "Pushing location", location );
          _queue.push({location:location, gzip: true });
          _queue.push({location:location, gzip: false });
          //_sites.push( location );
        });

        done();

      });

    }, function haveMaps() {
      debug( 'All sitemaps parsed, total of [%s] sites.', _.flatten( _sites ).length );

      _queue.drain = function() {
        console.log( 'drained' );
        taskDone();
      }

    } );


  }

  /**
   *
   */
  function defaultTask() {
    console.log( process.env.ES_ADDRESS );
  }


  /**
   * grunt watchCacheChange
   *
   */
  function watchCacheChange() {

    var taskDone = this.async();

    var _last_age = null;
    async.forever(function checkCache( done ) {

      get_header_request( 'https://www.reddoorcompany.com/rent/our-listings', function( error, resp_headers ) {

        if( !resp_headers.age ) {
          console.log( "No age! x-cache: [%s]" );
        }

        console.log( "Cache control [%s], before it was [%s]. x-cache [%s]", parseInt( resp_headers.age  ), _last_age, resp_headers['cache-control'] );
        //console.log( require( 'util' ).inspect( resp_headers.age , { showHidden: false, depth: 2, colors: true } ) );

        _last_age = parseInt( resp_headers.age );

        setTimeout(done, 1000 );

      });


    }, function final( error ) {
      console.log( "Stopped monitor", error );

    });


  }

};

function rabbit_request( target_url, request_done ) {
  debug( '[%s] Making Rabbit Cache request to [%s].', _done, target_url );

  var _requestOptions = {
    url: target_url.replace( 'www.reddoorcompany.com', 'c.rabbit.ci' ),
    actualUrl:  target_url.replace( 'c.rabbit.ci', 'www.reddoorcompany.com' ),
    method: 'GET',
    strictSSL: false,
    followRedirect: false,
    headers: {
      'x-access-token': 'yhcwokwserjzdjir',
      'host': 'www.reddoorcompany.com',
      'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'accept-language':'en-US,en;q=0.8',
      'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
    }
  };

  request(_requestOptions, function haveCallback( error, resp, body ) {

    _done++;

    console.log( "Checking URL [%s].", _requestOptions.actualUrl );

    if( error || !resp.headers ) {
      console.error( '[%s] Unable to prime [%s] url, error [%s]', _done, _requestOptions.actualUrl, ( error ? error.message : 'no-error' ) )
    }


    if( !resp.headers[ 'x-object-ttl' ] ) {
      console.log( 'statusCode', resp.statusCode );
      console.log( require( 'util' ).inspect( resp.headers, { showHidden: false, depth: 2, colors: true } ) );
    }

    console.log( "Varnish TTL [%s].", resp.headers[ 'x-object-ttl' ] );
    console.log( "Varnish hits [%s].", resp.headers[ 'x-object-hits' ] );
    console.log( "Varnish x-cache [%s].", resp.headers[ 'x-cache' ] );
    console.log( require( 'util' ).inspect( resp.headers, { showHidden: false, depth: 2, colors: true } ) );

    if( !error && resp.headers && resp.headers['location'] ) {

      if( _.get( resp, 'headers.age' ) ) {
        debug( '[%s] Already primed [%s] to with [%s] age.', _done, _requestOptions.actualUrl, _.get( resp, 'headers.age' ) );
      } else {
        debug( '[%s] Primed [%s] to follow [%s] url.', _done, _requestOptions.actualUrl, resp.headers[ 'location' ] )
      }

    }

    if( !error && resp.headers && !resp.headers['location'] ) {
      //debug( '[%s] Primed [%s], no-redirection, status [%s].', _done, _requestOptions.actualUrl, resp.statusCode );
    }

    if( 'function' === typeof request_done ) {
      request_done( null, resp );
    }

  });

}

/**
 *
 * - the 'accept' header is cache-busting, not sure if value is analyzed
 * - the 'accept-encoding' header is cache-busting. Seems to look for "gzip" value.
 *
 * - the 'accept-language' header is ignored
 *
 *
 * @todo Could just issue accept-encoding with and without "gzip".
 * @param target_url
 * @param options
 * @param request_done
 */
function cache_prime_request( target_url, options, request_done ) {
  debug( '[%s] Making Cache Prime request to [%s].', _done, target_url );

  _.defaults( options, { gzip: true } );

  var _requestOptions = {
    url: target_url.replace( 'www.reddoorcompany.com', 'd2v5c8pxcauet3.cloudfront.net' ).replace( 'usabilitydynamics-www-reddoorcompany-com-production.c.rabbit.ci', 'd2v5c8pxcauet3.cloudfront.net' ),
    actualUrl:  target_url.replace( 'd2v5c8pxcauet3.cloudfront.net', 'www.reddoorcompany.com' ).replace( 'usabilitydynamics-www-reddoorcompany-com-production.c.rabbit.ci', 'www.reddoorcompany.com' ),
    method: 'GET',
    strictSSL: false,
    followRedirect: false,
    headers: {
      'accept': 'text/html',
      'accept-encoding': options.gzip ? 'gzip, deflate, sdch, br' : 'deflate, sdch, br',
      //'accept-language':'en-US,en;q=0.8',
      'host': 'www.reddoorcompany.com',
      'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
    }
  };

  var _resultDetail = {
    url: _requestOptions.actualUrl,
    cached: undefined,
    age: undefined,
    options: options
  };

  // debug( 'Making Cache Prime request to [%s].', _requestOptions.url );

  request(_requestOptions, function haveCallback( error, resp, body ) {

    _done++;

    if( error || !resp.headers ) {
      console.error( '[%s] Unable to prime [%s] url, error [%s]', _done, _requestOptions.actualUrl, ( error ? error.message : 'no-error' ) )
    }

    if( !error && resp.headers && resp.headers['location'] ) {

      if( _.get( resp, 'headers.age' ) ) {
        debug( '[%s] Already primed [%s] to with [%s] age.', _done, _requestOptions.actualUrl, _.get( resp, 'headers.age' ) );
        _resultDetail.cached = true;
        _resultDetail.age = parseInt( _.get( resp, 'headers.age' ) );
      } else {
        debug( '[%s] Primed [%s] to follow [%s] url.', _done, _requestOptions.actualUrl, resp.headers[ 'location' ] );
        _resultDetail.cached = false;
        _resultDetail.age = null;
      }

      _queue.push({location: resp.headers['location'], resp: resp}, function (err, resp) {

        if( _.get( resp, 'headers.age' ) ) {
          debug('[%s] Already primed [%s] with [%s] ttl.', _done, resp.headers['location'], _.get( resp, 'headers.age' ) );
          _resultDetail.cached = true;
          _resultDetail.age = parseInt( _.get( resp, 'headers.age' ) );
        } else {
          debug('[%s] Primed [%s] with [%s] status code.', _done, _requestOptions.actualUrl, resp.statusCode);
          _resultDetail.cached = false;
          _resultDetail.age = null;
        }

      });

    }

    if( !error && resp.headers && !resp.headers['location'] ) {

      if( resp.headers.age ) {
        debug( '[%s] Already primed [%s], status [%s], age [%s].', _done, _requestOptions.actualUrl, resp.statusCode, resp.headers.age );
        _resultDetail.cached = true;
        _resultDetail.age = parseInt( _.get( resp, 'headers.age' ) );
      } else {
        debug( '[%s] Primed [%s], status [%s].', _done, _requestOptions.actualUrl, resp.statusCode );
        _resultDetail.cached = false;
        _resultDetail.age = null

      }
    }

    if( 'function' === typeof request_done ) {
      request_done( null, resp, _resultDetail );
    }

  });

}

function get_header_request( target_url, request_done ) {
  debug( '[%s] Making Cache Prime request to [%s].', _done, target_url );

  var _requestOptions = {
    //url: target_url.replace( 'www.reddoorcompany.com', 'd2v5c8pxcauet3.cloudfront.net' ),
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

    if( 'function' === typeof request_done ) {
      request_done( null, resp.headers );
    }

  });

}


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

var _queue = async.queue(function (task, callback) {
  //debug('Doing task [%s].', task.location);
  cache_prime_request(task.location, {}, callback);
}, 2);

var _done = 0;