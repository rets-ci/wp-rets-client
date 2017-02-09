/**
 * WordPress Single Page Application
 *
 * @todo bindNavigation should be live.
 *
 */
define( 'udx.wp.spa', [ 'knockout', 'pace', 'history', 'udx.utility', 'knockout.mapping', 'udx.model', 'sammy' ], function SPA( ko, pace, history, utility ) {
  // console.debug( 'udx.wp.spa', 'loaded' );

  return function domnReady() {
    // console.debug( 'udx.wp.spa', 'ready' );

    Object.extend( this.options, {
      debug: false,
      api: window.location.href + 'api'

    });
    // Modules.
    var Utility     = require( 'udx.utility' );
    var Knockout    = require( 'knockout' );
    var Mapping     = require( 'knockout.mapping' );
    var Model       = require( 'udx.model' );
    var Pace        = require( 'pace' );
    var Sammy       = require( 'sammy' );

    // Instance Models and Variables.
    var _version    = this.getAttribute( 'data-version' );
    var _ajax       = this.getAttribute( 'data-ajax' );
    var _home       = this.getAttribute( 'data-home' );
    var _debug      = this.getAttribute( 'data-debug' ) || false;
    var _settings   = {};
    var _locale     = {};

    /**
     * Initialize View Model
     *
     * window.setInterval( function() { this.schedules.push( { name: 'Mario', credits: 5800 } ); }.bind( this ), 3000 );
     *
     */
    Knockout.applyBindings( new function ViewModel() {

      var self = this;

      Pace.options = {
        document: true,
        ajax: true,
        //eventLag: false,
        restartOnPushState: true,
        restartOnRequestAfter: true,
        elements: {
          selectors: ['.sdf']
        }
      };

      Pace.on('start', function () {
        console.debug('pace started');
      });

      Pace.on('restart', function () {
        console.debug('pace restart');
      });

      Pace.on('done', function () {
        console.debug('pace done');
      });

      Pace.on('hide', function () {
        console.debug('pace hide');
      });

      Pace.on('stop', function () {
        console.debug('pace stop');
      });

      Pace.on('done', function () {
        console.debug('pace done');
      });

      Pace.start();

      // Observable Objects.
      self.schedules  = Knockout.observableArray([]);
      self.processes  = Knockout.observableArray([]);
      self.state      = Knockout.observableArray([]);

      jQuery( 'li.menu-item > a' ).click( function bindNavigation( e ) {

        e.preventDefault();

        // Do nothing.
        if( !e.target.pathname || e.target.pathname === '/' ) {
          return null;
        }

        //history.pushState(null, 'sadf', e.target.pathname );

        jQuery( 'main' ).load( e.target.href + ' main' );

      });

      //console.dir( Pace );
      //console.dir( Sammy );

    }, this );

    console.debug( 'udx.wp.spa', this.options );

    return this;

  };

});

