/**
 * Requires.js
 *
 * @todo Add shim-exports detection to prevent loading of globally-available objects such as jQuery.
 *
 * Includes
 * * ECMA5 shim - defineProperty, getOwnPropertyDescriptor, etc.
 * * Object Validation methods - Object.defineSchema(), Object.validateSchema()
 *
 * @version 3.1.0
 */
var requirejs, require, define;

(function( global ) {

  var version = '3.1.0';

  var req, s, head, baseElement, dataMain, src, interactiveScript, currentlyAddingScript, mainScript, subPath, commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg, cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, jsSuffixRegExp = /\.js$/, currDirRegExp = /^\.\//, op = Object.prototype, ostring = op.toString, hasOwn = op.hasOwnProperty, ap = Array.prototype, apsp = ap.splice, isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document), isWebWorker = !isBrowser && typeof importScripts !== 'undefined';
  var readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/, defContextName = '_';
  var isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]', contexts = {};
  var cfg = {};
  var globalDefQueue = [];
  var useInteractive = false;
  var debugBuild = false;

  // Try loading inline configuration.
  try {
    var _lastScript = document.getElementsByTagName( 'script' )[ document.getElementsByTagName( 'script' ).length - 1];

    if( _lastScript.getAttribute( 'data-config' ) ) {
      cfg = JSON.parse( _lastScript.getAttribute( 'data-config' ) );
    } else if ( _lastScript.innerText ) {
      cfg = JSON.parse( _lastScript.innerText );
    }

  } catch( error ) {}

  if( window.domReady == undefined ) {
    window.domReady = {};
    window.domReady = null;
  } else {
    window.domReady = window.domReady;
  }

  if( document.domReady == undefined ) {
    document.domReady = {};
    document.domReady = null;
  } else {
    document.domReady = document.domReady;
  }

  var winonload = window.onload;
  var oldonload = document.onload;
  var isLaunched = 2;

  document.onload = function() {
    if( oldonload !== null ) {
      oldonload.call();
    }
  };

  window.onload = function() {
    if( winonload !== null ) {
      winonload.call();
    }
  };

  document.addEventListener( "DOMContentLoaded", function onDom( event ) {
    var windomready = window.domReady; //Save the window hook
    var olddomready = document.domReady; //Save the document hook

    if( (document.domReady) || (window.domReady) ) { //Check for the hooks
      if( isLaunched > 0 ) { //Check if DomReady hasn't been launched

        var evt = document.createEvent( 'Event' ); //Create document DomReady event
        evt.initEvent( 'onDomReady', true, false ); //Initialize document DomReady Event
        document.dispatchEvent( evt ); //Dispatch the document DomReady event
        //window.dispatchEvent(evt); //Dispatch the window DomReady event

        //OLD FOR EMERGENCIES OR BROKEN: if(document.domReady !== null) { //Make sure DomReady isn't 100% null

        if( window.domReady ) { //Make sure DomReady isn't null by browser feature detection
          if( isLaunched == 2 ) {
            //Always load window hook first
            windomready.call( this, evt ); //Execute if not null (already checked on line: if((document.domReady)||(window.domReady)) {...)
          }
        }
        isLaunched -= 1; //Lower value

        if( document.domReady ) { //Make sure DomReady isn't null by browser feature detection
          if( isLaunched == 1 ) {
            //Always load document hook next
            olddomready.call( this, evt ); //Execute if not null (already checked on line: if((document.domReady)||(window.domReady)) {...)
          }
        }
        isLaunched -= 1; //Lower value

        isLaunched = 0; //Make sure it isn't launched again in case of a continuous loop that may or may not stop looping

        if( console && debugBuild != false ) { //Debugging
          context.log( 'Event onDomReady has been called by DomContentLoaded.' );
        }
      } else {
        if( console && debugBuild != false ) { //Debugging
          context.log( 'isLaunched=' + isLaunched ); //Has DomReady already been launched?
          context.log( 'Dom ready=' + document.domReady ); //Current DomReady function hook
          context.log( 'Old dom ready=' + olddomready ); //Old DomReady function hook
        }
      }
    } else {
      if( console && debugBuild != false ) { //Debugging
        context.log( 'No hooks for domReady.' );
      }
    }
  }, false );


  /**
   * UDX Base Application
   *
   * require( 'udx' ).emit();
   *
   * @returns {{get: get, set: set, bind: bind}}
   */
  function udxBaseModule() {
    // console.debug( 'udx', 'udxBaseModule' );

    var self = window.__udx = window.__udx = {
      _events: {},
      _settings: {},
      _cache: {}
    };

    return {
      version: require.version,
      /**
       *
       * @param handler
       * @returns {{_events: {}, _settings: {}, _cache: {}}}
       */
      configure: function configure( handler ) {

        if( 'function' === typeof handler ) {
          handler.call( self );
        }

        return self;

      },
      emit: function emit( tag, data, callback ) {

        self._events[ tag ] = self._events[ tag ] || [];

        self._events[ tag ].forEach( function( callback ) {
          callback.call( self, data );
        });

        return self;

      },
      on: function on( tag, callback ) {
        self._events[ tag ] = self._events[ tag ] || [];
        self._events[ tag ].push( callback );
        return self;
      },
      get: function get( key ) {},
      set: function set( key, value ) {},
      bind: function bind( name, app ) {
        return self._cache[ app ] = app;
      }
    }

  }

  Object.defineProperties( udxBaseModule, {
    create: {
      value: function create() {
        return new udxBaseModule;
      },
      enumerable: true,
      configurable: true,
      writable: true
    }
  })

  /**
   * Convert Object to URL Parameter String.
   *
   * @param obj
   * @returns {string}
   */
  function stringifyObject( obj ) {
    var str = [];
    var prefix = arguments[1] ? arguments[1] : null;
    for( var p in obj ) {
      var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
      str.push( typeof v == "object" ? stringifyObject( v, k ) : encodeURIComponent( k ) + "=" + encodeURIComponent( v ) );
    }
    return str.join("&");
  }

  /**
   * Fetch All Elemnets by Attribute
   *
   * @author potanin@ud
   * @param attribute
   * @param type
   * @returns {Array}
   */
  function getAllElementsWithAttribute( attribute, type ) {
    var matchingElements = [];
    var allElements = document.getElementsByTagName( type || '*' );

    for( var i = 0; i < allElements.length; i++ ) {
      if( allElements[i].getAttribute( attribute ) ) {
        // Element exists with attribute. Add to array.
        matchingElements.push( allElements[i] );
      }
    }

    matchingElements.each = each.bind( this, matchingElements );

    return matchingElements;

  }

  /**
   * Load and Enqueue Styleshet
   *
   * @author potanin@ud
   * @param url
   * @param async
   * @param callback
   * @param args
   */
  function loadStyle( url, async, callback, args ) {
    console.debug( 'loadStyle', url );

    if( !url ) {
      return;
    }

    window.setTimeout( function() {

      var link = document.createElement( "link" );
      link.type = "text/css";
      link.rel = "stylesheet";
      link.href = url;
      document.getElementsByTagName( "head" )[0].appendChild( link );

    }, 0 )

  }

  /**
   * Extend Target Object
   *
   * @source https://github.com/knockout/knockout/blob/master/src/utils.js
   * @param target
   * @param source
   * @returns {*}
   */
  function extend( target, source ) {

    if( source ) {
      for( var prop in source ) {
        if( source.hasOwnProperty( prop ) ) {
          target[prop] = source[prop];
        }
      }
    }

    return target;

  }

  /**
   * Parse data-options String
   *
   * @param string
   * @returns {{}}
   */
  function parseOptions( string ) {
    // console.debug( 'parseOptions', string );

    var options = {};
    var parts = ( string || '' ).split( ',' );
    var _temp;
    var _key;
    var _value;

    for( var _line in parts || [] ) {

      _temp = parts[ _line ].split( ':' );
      _key = _temp[0] ? _temp[0].trim() : null;
      _value = _temp[1] ? _temp[1].trim() : null;

      if( 'string' === typeof _value && _value === 'true' ) {
        _value = true;
      }

      if( 'string' === typeof _value && _value === 'false' ) {
        _value = false;
      }

      if( _key && _value ) {
        options[ _key ] = _value;
      }

    }

    return options;
  }

  // UDX Methods.
  var udx = {
    config: {
      loading_class: 'udx-module-loading'
    },
    setDefaultPackages: function( packages ) {
      //context.log( 'udx', 'setDefaultPackages' );

      packages = packages || [];

      if( 'function' !== typeof packages.push ) {
        //return packages;
      }

      packages.push( {
        location: 'http://cdn.udx.io/ace',
        main: 'ace',
        name: 'ace'
      } );

      return packages;

    },
    dynamicLoading: function dynamicLoader( deps, callback, errback ) {
      // console.debug( 'udx', 'dynamicLoading' );

      var context = this;

      function findTriggers() {
        //context.log( 'findTriggers' );

        /**
         * Executed when an instance is ready.
         * @param element
         */
        function instanceReady( element ) {
          //console.debug( 'instanceReady', arguments );

          var _style = window.getComputedStyle( element );

          if( _style.getPropertyValue( 'opacity' ) < 1 ) {
            //console.log( 'no opacity' );

            context.nextTick( function() {
              element.style.opacity = 1;
            } );

          }

        }

        /**
         * Load Optional Module Controller for DOM Element
         *
         * @param element
         */
        function loadController( element ) {
          return loadRequires( element );
        }

        /**
         * DOM Element Required for Module
         *
         * @param element
         * @returns {*}
         */
        function loadRequired( element ) {
          return loadRequires( element );
        }

        /**
         * DOM Element Requires a Module
         *
         * @param element
         */
        function loadRequires( element ) {
          //context.log( 'element[data-requires]', element );

          // Only load once.
          if( element.getAttribute( 'data-status' ) ) {
            return;
          }

          element.setAttribute( 'data-status', 'loading' );

          // Set Options
          element.options = parseOptions( element.getAttribute( 'data-options' ) );

          // console.dir( context.config.paths );

          context.require( [ element.getAttribute( 'data-requires' ) ], function moduleLoaded( callback ) {
            context.log( 'moduleLoaded', typeof callback );

            element.setAttribute( 'data-status', 'ready' );

            if( 'function' === typeof callback ) {

              var _instance = callback.call( element, context );

              if( _instance && 'function' === typeof _instance.emit ) {
                _instance.emit.call( _instance, 'loaded', element );
              }

              if( _instance && 'function' === typeof _instance.on ) {
                _instance.on( 'loaded', instanceReady.bind( _instance, element ) );
              } else {
                instanceReady.call( _instance, element );
              }

            }

          }, function notFound( error ) {
            context.log( element.getAttribute( 'data-requires' ), 'not found.', error );
          } );

        }

        getAllElementsWithAttribute( 'data-controller', null ).each( loadController );
        getAllElementsWithAttribute( 'data-requires', null ).each( loadRequires );
        getAllElementsWithAttribute( 'data-required', null ).each( loadRequired );

      }

      // Trigger only once and when ready.
      document.domReady = function() {

        // @todo Fix ghetto timeout - figure out how to make local models be loaded before libs...
        window.setTimeout( function() {
          findTriggers();
        }, 100 )

      };

    },
    /**
     *
     * @param url
     * @param _callback
     */
    fetch_json_file: function( url, _callback ) {

      if( window.XMLHttpRequest ) {
        http_request = new XMLHttpRequest();
      } else if( window.ActiveXObject ) {
        http_request = new ActiveXObject( "Microsoft.XMLHTTP" );
      }

      http_request.open( 'GET', url, true );
      http_request.send( null );

      http_request.onreadystatechange = function() {
        if( http_request.readyState == 4 ) {

          if( http_request.status == 200 ) {
            _callback( null, http_request.responseText );
          } else {
            _callback( new Error( 'Could not load JSON file.' ) );
          }

        }
      };

    },

    /**
     *
     * @param string
     * @returns {*}
     */
    parse_json_string: function( string ) {

      return JSON.parse( string );

    },
    deepExtend: function( destination, source ) {
      for( var property in source ) {
        if( source[property] && source[property].constructor && source[property].constructor === Object ) {
          destination[property] = destination[property] || {};
          arguments.callee( destination[property], source[property] );
        } else {
          destination[property] = source[property];
        }
      }
      return destination;
    },
    /**
     * Handle our Special Model-Module.
     *
     * When called the module extends contextual paths, args, config and deps.
     *
     * @param context
     * @param data
     * @returns {data|*|data|data|data|data}
     */
    contextModel: function contextModel( context, id, data ) {
      // this.log( 'contextModel', id, data );

      // Extend Properties into Conifg.
      udx.deepExtend( context.config, {
        "paths": data.paths || {},
        "shim": data.shim || {},
        "urlArgs": data.urlArgs || null,
        "config": data.config || {}
      } );

      // Add Dependencies.
      each( data.deps || [], function( dep ) {
        context.config.deps.push( dep );
      } );

      // Overwrite value so this extension does not run again
      return data.data || {};

    }
  };

  // ECMA5 Shim.
  var call = Function.prototype.call;
  var prototypeOfObject = Object.prototype;
  var owns = call.bind( prototypeOfObject.hasOwnProperty );

  // If JS engine supports accessors creating shortcuts.
  var defineGetter;
  var defineSetter;
  var lookupGetter;
  var lookupSetter;
  var supportsAccessors;

  if( (supportsAccessors = owns( prototypeOfObject, "__defineGetter__" )) ) {
    defineGetter = call.bind( prototypeOfObject.__defineGetter__ );
    defineSetter = call.bind( prototypeOfObject.__defineSetter__ );
    lookupGetter = call.bind( prototypeOfObject.__lookupGetter__ );
    lookupSetter = call.bind( prototypeOfObject.__lookupSetter__ );
  }

  // Ensure console is defined.
  if( !window.console ) {
    window.console = {}
  }

  if( !console.debug ) {
    /**
     * Console Debug Method.
     */
    console.debug = function consoleDebug() {
    };
  }

  if( !Object.extend ) {
    /**
     * Extend Object
     *
     * @param target
     * @param source
     * @returns {{}}
     */
    Object.extend = function extendObject( target, source ) {

      target = target || {};

      for( var prop in source ) {
        if( typeof source[prop] === 'object' ) {
          target[prop] = Object.extend( target, source[prop] );
        } else {
          target[prop] = source[prop];
        }
      }

      return target;

    };
  }

  if( !Object.getPrototypeOf ) {
    Object.getPrototypeOf = function getPrototypeOf( object ) {
      return object.__proto__ || (
        object.constructor ? object.constructor.prototype : prototypeOfObject
        );
    };
  }

  function doesGetOwnPropertyDescriptorWork( object ) {
    try {
      object.sentinel = 0;
      return Object.getOwnPropertyDescriptor( object, "sentinel" ).value === 0;
    } catch( exception ) {
      // returns falsy
    }
  }

  function doesDefinePropertyWork( object ) {
    try {
      Object.defineProperty( object, "sentinel", {} );
      return "sentinel" in object;
    } catch( exception ) {
      // returns falsy
    }
  }

  if( Object.defineProperty ) {
    var getOwnPropertyDescriptorWorksOnObject = doesGetOwnPropertyDescriptorWork( {} );
    var getOwnPropertyDescriptorWorksOnDom = typeof document == "undefined" || doesGetOwnPropertyDescriptorWork( document.createElement( "div" ) );
    if( !getOwnPropertyDescriptorWorksOnDom || !getOwnPropertyDescriptorWorksOnObject ) {
      var getOwnPropertyDescriptorFallback = Object.getOwnPropertyDescriptor;
    }
  }

  if( !Object.getOwnPropertyDescriptor || getOwnPropertyDescriptorFallback ) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a non-object: ";

    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor( object, property ) {
      if( (typeof object != "object" && typeof object != "function") || object === null ) {
        throw new TypeError( ERR_NON_OBJECT + object );
      }

      // make a valiant attempt to use the real getOwnPropertyDescriptor
      // for I8's DOM elements.
      if( getOwnPropertyDescriptorFallback ) {
        try {
          return getOwnPropertyDescriptorFallback.call( Object, object, property );
        } catch( exception ) {
          // try the shim if the real one doesn't work
        }
      }

      // If object does not owns property return undefined immediately.
      if( !owns( object, property ) ) {
        return;
      }

      // If object has a property then it's for sure both `enumerable` and
      // `configurable`.
      var descriptor = { enumerable: true, configurable: true };

      // If JS engine supports accessor properties then property may be a
      // getter or setter.
      if( supportsAccessors ) {
        // Unfortunately `__lookupGetter__` will return a getter even
        // if object has own non getter property along with a same named
        // inherited getter. To avoid misbehavior we temporary remove
        // `__proto__` so that `__lookupGetter__` will return getter only
        // if it's owned by an object.
        var prototype = object.__proto__;
        object.__proto__ = prototypeOfObject;

        var getter = lookupGetter( object, property );
        var setter = lookupSetter( object, property );

        // Once we have getter and setter we can put values back.
        object.__proto__ = prototype;

        if( getter || setter ) {
          if( getter ) {
            descriptor.get = getter;
          }
          if( setter ) {
            descriptor.set = setter;
          }
          // If it was accessor property we're done and return here
          // in order to avoid adding `value` to the descriptor.
          return descriptor;
        }
      }

      // If we got this far we know that object has an own property that is
      // not an accessor so we set it as a value and return descriptor.
      descriptor.value = object[property];
      descriptor.writable = true;
      return descriptor;
    };
  }

  if( !Object.getOwnPropertyNames ) {
    Object.getOwnPropertyNames = function getOwnPropertyNames( object ) {
      return Object.keys( object );
    };
  }

  if( !Object.create ) {

    // Contributed by Brandon Benvie, October, 2012
    var createEmpty;
    var supportsProto = Object.prototype.__proto__ === null;
    if( supportsProto || typeof document == 'undefined' ) {
      createEmpty = function() {
        return { "__proto__": null };
      };
    } else {
      // In old IE __proto__ can't be used to manually set `null`, nor does
      // any other method exist to make an object that inherits from nothing,
      // aside from Object.prototype itself. Instead, create a new global
      // object and *steal* its Object.prototype and strip it bare. This is
      // used as the prototype to create nullary objects.
      createEmpty = function() {
        var iframe = document.createElement( 'iframe' );
        var parent = document.body || document.documentElement;
        iframe.style.display = 'none';
        parent.appendChild( iframe );
        iframe.src = 'javascript:';
        var empty = iframe.contentWindow.Object.prototype;
        parent.removeChild( iframe );
        iframe = null;
        delete empty.constructor;
        delete empty.hasOwnProperty;
        delete empty.propertyIsEnumerable;
        delete empty.isPrototypeOf;
        delete empty.toLocaleString;
        delete empty.toString;
        delete empty.valueOf;
        empty.__proto__ = null;

        function Empty() {
        }

        Empty.prototype = empty;
        // short-circuit future calls
        createEmpty = function() {
          return new Empty();
        };
        return new Empty();
      };
    }

    Object.create = function create( prototype, properties ) {

      var object;

      function Type() {
      }  // An empty constructor.

      if( prototype === null ) {
        object = createEmpty();
      } else {
        if( typeof prototype !== "object" && typeof prototype !== "function" ) {
          // In the native implementation `parent` can be `null`
          // OR *any* `instanceof Object`  (Object|Function|Array|RegExp|etc)
          // Use `typeof` tho, b/c in old IE, DOM elements are not `instanceof Object`
          // like they are in modern browsers. Using `Object.create` on DOM elements
          // is...err...probably inappropriate, but the native version allows for it.
          throw new TypeError( "Object prototype may only be an Object or null" ); // same msg as Chrome
        }
        Type.prototype = prototype;
        object = new Type();
        // IE has no built-in implementation of `Object.getPrototypeOf`
        // neither `__proto__`, but this manually setting `__proto__` will
        // guarantee that `Object.getPrototypeOf` will work as expected with
        // objects created using `Object.create`
        object.__proto__ = prototype;
      }

      if( properties !== void 0 ) {
        Object.defineProperties( object, properties );
      }

      return object;
    };
  }


  if( Object.defineProperty ) {
    var definePropertyWorksOnObject = doesDefinePropertyWork( {} );
    var definePropertyWorksOnDom = typeof document == "undefined" || doesDefinePropertyWork( document.createElement( "div" ) );
    if( !definePropertyWorksOnObject || !definePropertyWorksOnDom ) {
      var definePropertyFallback = Object.defineProperty, definePropertiesFallback = Object.defineProperties;
    }
  }

  if( !Object.defineProperty || definePropertyFallback ) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: "
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " + "on this javascript engine";

    Object.defineProperty = function defineProperty( object, property, descriptor ) {
      if( (typeof object != "object" && typeof object != "function") || object === null ) {
        throw new TypeError( ERR_NON_OBJECT_TARGET + object );
      }
      if( (typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null ) {
        throw new TypeError( ERR_NON_OBJECT_DESCRIPTOR + descriptor );
      }
      // make a valiant attempt to use the real defineProperty
      // for I8's DOM elements.
      if( definePropertyFallback ) {
        try {
          return definePropertyFallback.call( Object, object, property, descriptor );
        } catch( exception ) {
          // try the shim if the real one doesn't work
        }
      }

      // If it's a data property.
      if( owns( descriptor, "value" ) ) {
        // fail silently if "writable", "enumerable", or "configurable"
        // are requested but not supported
        /*
         // alternate approach:
         if ( // can't implement these features; allow false but not true
         !(owns(descriptor, "writable") ? descriptor.writable : true) ||
         !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
         !(owns(descriptor, "configurable") ? descriptor.configurable : true)
         )
         throw new RangeError(
         "This implementation of Object.defineProperty does not " +
         "support configurable, enumerable, or writable."
         );
         */

        if( supportsAccessors && (lookupGetter( object, property ) || lookupSetter( object, property )) ) {
          // As accessors are supported only on engines implementing
          // `__proto__` we can safely override `__proto__` while defining
          // a property to make sure that we don't hit an inherited
          // accessor.
          var prototype = object.__proto__;
          object.__proto__ = prototypeOfObject;
          // Deleting a property anyway since getter / setter may be
          // defined on object itself.
          delete object[property];
          object[property] = descriptor.value;
          // Setting original `__proto__` back now.
          object.__proto__ = prototype;
        } else {
          object[property] = descriptor.value;
        }
      } else {
        if( !supportsAccessors ) {
          throw new TypeError( ERR_ACCESSORS_NOT_SUPPORTED );
        }
        // If we got that far then getters and setters can be defined !!
        if( owns( descriptor, "get" ) ) {
          defineGetter( object, property, descriptor.get );
        }
        if( owns( descriptor, "set" ) ) {
          defineSetter( object, property, descriptor.set );
        }
      }
      return object;
    };
  }

  if( !Object.defineProperties || definePropertiesFallback ) {
    Object.defineProperties = function defineProperties( object, properties ) {
      // make a valiant attempt to use the real defineProperties
      if( definePropertiesFallback ) {
        try {
          return definePropertiesFallback.call( Object, object, properties );
        } catch( exception ) {
          // try the shim if the real one doesn't work
        }
      }

      for( var property in properties ) {
        if( owns( properties, property ) && property != "__proto__" ) {
          Object.defineProperty( object, property, properties[property] );
        }
      }
      return object;
    };
  }

  if( !Object.seal ) {
    Object.seal = function seal( object ) {
      // this is misleading and breaks feature-detection, but
      // allows "securable" code to "gracefully" degrade to working
      // but insecure code.
      return object;
    };
  }

  if( !Object.freeze ) {
    Object.freeze = function freeze( object ) {
      // this is misleading and breaks feature-detection, but
      // allows "securable" code to "gracefully" degrade to working
      // but insecure code.
      return object;
    };
  }

  try {
    Object.freeze( function() {
    } );
  } catch( exception ) {
    Object.freeze = (function freeze( freezeObject ) {
      return function freeze( object ) {
        if( typeof object == "function" ) {
          return object;
        } else {
          return freezeObject( object );
        }
      };
    })( Object.freeze );
  }

  if( !Object.preventExtensions ) {
    Object.preventExtensions = function preventExtensions( object ) {
      // this is misleading and breaks feature-detection, but
      // allows "securable" code to "gracefully" degrade to working
      // but insecure code.
      return object;
    };
  }

  if( !Object.isSealed ) {
    Object.isSealed = function isSealed( object ) {
      return false;
    };
  }

  if( !Object.isFrozen ) {
    Object.isFrozen = function isFrozen( object ) {
      return false;
    };
  }

  if( !Object.isExtensible ) {
    Object.isExtensible = function isExtensible( object ) {
      // 1. If Type(O) is not Object throw a TypeError exception.
      if( Object( object ) !== object ) {
        throw new TypeError(); // TODO message
      }
      // 2. Return the Boolean value of the [[Extensible]] internal property of O.
      var name = '';
      while( owns( object, name ) ) {
        name += '?';
      }
      object[name] = true;
      var returnValue = owns( object, name );
      delete object[name];
      return returnValue;
    };
  }

  // Object Schema.
  if( !Object.defineSchema ) {
    Object.defineSchema = function defineSchema( object, schema ) {
      console.log( 'not implemented' );
    };
  }

  // Object Schema Validation.
  if( !Object.validateSchema ) {
    Object.validateSchema = function validateSchema() {
      console.log( 'not implemented' );
    };
  }

  /**
   * Variable is Functions
   *
   * @param it
   * @returns {boolean}
   */
  function isFunction( it ) {
    return ostring.call( it ) === '[object Function]';
  }

  /**
   * Variable Is Array
   *
   * @param it
   * @returns {boolean}
   */
  function isArray( it ) {
    return ostring.call( it ) === '[object Array]';
  }

  /**
   * Helper function for iterating over an array. If the func returns
   * a true value, it will break out of the loop.
   */
  function each( ary, func ) {
    if( ary ) {
      var i;
      for( i = 0; i < ary.length; i += 1 ) {
        if( ary[i] && func( ary[i], i, ary ) ) {
          break;
        }
      }
    }
  }

  /**
   * Helper function for iterating over an array backwards. If the func
   * returns a true value, it will break out of the loop.
   */
  function eachReverse( ary, func ) {
    if( ary ) {
      var i;
      for( i = ary.length - 1; i > -1; i -= 1 ) {
        if( ary[i] && func( ary[i], i, ary ) ) {
          break;
        }
      }
    }
  }

  function hasProp( obj, prop ) {

    if( obj && hasOwn && 'function' === typeof hasOwn.call ) {
      return hasOwn.call( obj, prop );
    }

  }

  function getOwn( obj, prop ) {
    return hasProp( obj, prop ) && obj[prop];
  }

  /**
   * Cycles over properties in an object and calls a function for each
   * property value. If the function returns a truthy value, then the
   * iteration is stopped.
   */
  function eachProp( obj, func ) {
    var prop;
    for( prop in obj ) {
      if( hasProp( obj, prop ) ) {
        if( func( obj[prop], prop ) ) {
          break;
        }
      }
    }
  }

  /**
   * Simple function to mix in properties from source into target,
   * but only if target does not already have a property of the same name.
   */
  function mixin( target, source, force, deepStringMixin ) {
    if( source ) {
      eachProp( source, function( value, prop ) {
        if( force || !hasProp( target, prop ) ) {
          if( deepStringMixin && typeof value === 'object' && value && !isArray( value ) && !isFunction( value ) && !(value instanceof RegExp) ) {

            if( !target[prop] ) {
              target[prop] = {};
            }
            mixin( target[prop], value, force, deepStringMixin );
          } else {
            target[prop] = value;
          }
        }
      } );
    }
    return target;
  }

  //Similar to Function.prototype.bind, but the 'this' object is specified
  //first, since it is easier to read/figure out what 'this' will be.
  function bind( obj, fn ) {
    return function() {
      return fn.apply( obj, arguments );
    };
  }

  function scripts() {
    return document.getElementsByTagName( 'script' );
  }

  function defaultOnError( err ) {
    throw err;
  }

  /**
   * Allow getting a global that expressed in dot notation, like 'a.b.c'.
   *
   * @param value
   * @returns {*}
   */
  function getGlobal( value ) {
    if( !value ) {
      return value;
    }
    var g = global;
    each( value.split( '.' ), function( part ) {
      g = g[part];
    } );
    return g;
  }

  /**
   * Constructs an error with a pointer to an URL with more information.
   * @param {String} id the error ID that maps to an ID on a web page.
   * @param {String} message human readable error.
   * @param {Error} [err] the original error, if there is one.
   *
   * @returns {Error}
   */
  function makeError( id, msg, err, requireModules ) {
    var e = new Error( msg + '\nhttp://requirejs.org/docs/errors.html#' + id );
    e.requireType = id;
    e.requireModules = requireModules;
    if( err ) {
      e.originalError = err;
    }
    return e;
  }

  if( typeof define !== 'undefined' ) {
    //If a define is already in play via another AMD loader,
    //do not overwrite.
    return;
  }

  if( typeof requirejs !== 'undefined' ) {
    if( isFunction( requirejs ) ) {
      //Do not overwrite and existing requirejs instance.
      return;
    }
    cfg = requirejs;
    requirejs = undefined;
  }

  //Allow for a require config object
  if( typeof require !== 'undefined' && !isFunction( require ) ) {
    //assume it is a config object.
    cfg = require;
    require = undefined;
  }

  /**
   * Neq Requires Context
   *
   * @param contextName
   * @returns {{config: {waitSeconds: number, baseUrl: string, paths: {}, pkgs: {}, shim: {}, config: {}}, contextName: *, registry: {}, defined: {}, urlFetched: {}, defQueue: Array, Module: Module, makeModuleMap: makeModuleMap, nextTick: (*|nextTick|Function), onError: onError, log: debugLog, info: infoLog, configure: configure, makeShimExports: makeShimExports, makeRequire: makeRequire, enable: enable, completeLoad: completeLoad, nameToUrl: nameToUrl, load: load, execCb: execCb, onScriptLoad: onScriptLoad, onScriptError: onScriptError}}
   */
  function newContext( contextName ) {
    var inCheckLoaded, Module, context, handlers, checkLoadedTimeoutId, registry = {}, enabledRegistry = {}, undefEvents = {}, defQueue = [], defined = {}, urlFetched = {}, requireCounter = 1, unnormalizedCounter = 1;

    var config = {
        waitSeconds: 7,
        baseUrl: './',
        paths: {},
        pkgs: {},
        shim: {
          "knockout": {
            // exports: "knockout"
          },
          "knockout.mapping": {
            exports: "knockout.mapping",
            deps: [ 'knockout' ]
          },
          "twitter.bootstrap": {
            exports: "jQuery.fn.popover",
            deps: [ 'jquery' ]
          },
          "jquery": {
            exports: 'jQuery',
            deps: []
          },
          "jquery.ui": {
            exports: 'jQuery.ui',
            deps: [ 'jquery' ]
          },
          "jquery.spin": {
            exports: 'jQuery.fn.spin',
            deps: [ 'jquery' ]
          },
          "jquery.fancybox": {
            exports: 'jQuery.fn.fancybox',
            deps: [ 'jquery' ]
          },
          "jquery.isotope": {
            exports: 'jQuery.fn.isotope',
            deps: [ 'jquery' ]
          },
          "jquery.scrollto": {
            exports: 'jQuery.fn.scrollto',
            deps: [ 'jquery' ]
          },
          "jquery.resizely": {
            exports: 'jQuery.fn.resizely',
            deps: [ 'jquery' ]
          },
          "jquery.lazyload": {
            exports: 'jQuery.fn.lazyload',
            deps: [ 'jquery' ]
          },
          "sammy": {
            exports: 'sammy',
            deps: [ 'jquery' ]
          },
          "spin": {
            exports: 'spin'
          },
          "swiper": {
            exports: 'Swiper',
            deps: [ 'jquery' ]
          },
          "jquery.validation": {
            exports: 'jQuery.validation',
            deps: [ 'jquery' ]
          },
          "datatables": {
            //exports: 'jQuery.dataTable',
            deps: [ 'jquery' ]
          },
          "backbone": {
            deps: [ 'underscore', 'jquery' ],
            exports: 'Backbone'
          }
        },
        config: {}
      };

    config.paths[ 'async' ]                           = "//cdnjs.cloudflare.com/ajax/libs/async/0.2.7/async.min";
    config.paths[ 'datatables' ]                      = '//cdnjs.cloudflare.com/ajax/libs/datatables/1.9.4/jquery.dataTables.min';
    config.paths[ 'jquery.ui' ]                       = "//code.jquery.com/ui/1.10.3/jquery-ui";
    config.paths[ 'jquery.validation' ]               = '//cdnjs.cloudflare.com/ajax/libs/datatables/1.9.4/jquery.dataTables.min';
    config.paths[ 'knockout' ]                        = '//ajax.aspnetcdn.com/ajax/knockout/knockout-2.2.1';
    config.paths[ 'knockout.mapping' ]                = '//cdnjs.cloudflare.com/ajax/libs/knockout.mapping/2.4.1/knockout.mapping.min';
    config.paths[ 'twitter.bootstrap' ]               = "//netdna.bootstrapcdn.com/bootstrap/3.0.3/js/bootstrap.min";

    // Local Vendors.
    config.paths[ 'skrollr' ]                         = '//cdn.udx.io/skrollr';
    config.paths[ 'swiper' ]                          = '//cdn.udx.io/swiper';
    config.paths[ 'swiper.scrollbar' ]                = '//cdn.udx.io/swiper.scrollbar';
    config.paths[ 'elastic.client' ]                  = '//cdn.udx.io/elastic.client';
    config.paths[ 'parallax' ]                        = '//cdn.udx.io/parallax';
    config.paths[ 'pace' ]                            = '//cdn.udx.io/pace';
    config.paths[ 'history' ]                         = '//cdn.udx.io/history';
    config.paths[ 'sammy' ]                           = '//cdn.udx.io/sammy';
    config.paths[ 'emitter' ]                         = '//cdn.udx.io/emitter';
    config.paths[ 'resizely' ]                        = '//cdn.udx.io/resizely';
    config.paths[ 'jquery' ]                          = '//cdn.udx.io/jquery';
    config.paths[ 'jquery.scrollto' ]                 = '//cdn.udx.io/jquery.scrollto';
    config.paths[ 'jquery.parallax' ]                 = '//cdn.udx.io/jquery.parallax';
    config.paths[ 'jquery.fancybox' ]                 = '//cdn.udx.io/jquery.fancybox';
    config.paths[ 'jquery.isotope' ]                  = '//cdn.udx.io/jquery.isotope';
    config.paths[ 'jquery.resizely' ]                 = '//cdn.udx.io/jquery.resizely';
    config.paths[ 'jquery.lazyload' ]                 = '//cdn.udx.io/jquery.lazyload';
    config.paths[ 'jquery.scrollstop' ]               = '//cdn.udx.io/jquery.scrollstop';

    // UI Library.
    config.paths[ 'udx.ui.jquery.tabs' ]              = "//cdn.udx.io/udx.ui.jquery.tabs";
    config.paths[ 'udx.ui.sticky-header' ]            = "//cdn.udx.io/udx.ui.sticky-header";
    config.paths[ 'udx.ui.dynamic-table' ]            = "//cdn.udx.io/udx.ui.dynamic-table";
    config.paths[ 'udx.ui.parallax' ]                 = "//cdn.udx.io/udx.ui.parallax";
    config.paths[ 'udx.ui.scrollr' ]                  = "//cdn.udx.io/udx.ui.scrollr";
    config.paths[ 'udx.ui.swiper' ]                   = "//cdn.udx.io/udx.ui.swiper";
    config.paths[ 'udx.ui.slider' ]                   = "//cdn.udx.io/udx.ui.slider";
    config.paths[ 'udx.ui.gallery' ]                  = "//cdn.udx.io/udx.ui.gallery";
    config.paths[ 'udx.ui.stream' ]                   = "//cdn.udx.io/udx.ui.stream";
    config.paths[ 'udx.ui.video' ]                    = "//cdn.udx.io/udx.ui.video";
    config.paths[ 'udx.ui.wp.editor.script' ]         = "//cdn.udx.io/udx.ui.wp.editor.script";
    config.paths[ 'udx.ui.wp.editor.style' ]          = "//cdn.udx.io/udx.ui.wp.editor.style";
    config.paths[ 'udx.ui.wp.customizer.style' ]      = "//cdn.udx.io/udx.ui.wp.customizer.style";
    config.paths[ 'udx.ui.wp.customizer.script' ]     = "//cdn.udx.io/udx.ui.wp.customizer.script";

    // Utility Library.
    config.paths[ 'udx.utility' ]                     = "//cdn.udx.io/udx.utility";
    config.paths[ 'udx.utility.md5' ]                 = "//cdn.udx.io/udx.utility.md5";
    config.paths[ 'udx.utility.device' ]              = "//cdn.udx.io/udx.utility.device";
    config.paths[ 'udx.utility.facebook.like' ]       = "//cdn.udx.io/udx.facebook.like";
    config.paths[ 'udx.utility.process' ]             = "//cdn.udx.io/udx.utility.process";
    config.paths[ 'udx.utility.activity' ]            = "//cdn.udx.io/udx.utility.activity";
    config.paths[ 'udx.utility.video' ]               = "//cdn.udx.io/udx.utility.video";
    config.paths[ 'udx.utility.bus' ]                 = "//cdn.udx.io/udx.utility.bux";
    config.paths[ 'udx.utility.job' ]                 = "//cdn.udx.io/udx.utility.job";
    config.paths[ 'udx.utility.imagesloaded' ]        = "//cdn.udx.io/udx.utility.imagesloaded";
    config.paths[ 'udx.analytics' ]                   = "//cdn.udx.io/udx.analytics";

    // Model Library.
    config.paths[ 'udx.model' ]                       = "//cdn.udx.io/udx.model";
    config.paths[ 'udx.model.validation' ]            = "//cdn.udx.io/udx.model.validation";

    // SaaS Library.
    config.paths[ 'udx.saas.elastic' ]                = "//cdn.udx.io/udx.saas.elastic";

    // Settings Library.
    config.paths[ 'udx.settings' ]                    = "//cdn.udx.io/udx.settings";
    config.paths[ 'udx.storage' ]                     = "//cdn.udx.io/udx.storage";

    // WP Theme
    config.paths[ 'udx.spa' ]                         = "//cdn.udx.io/udx.spa";
    config.paths[ 'udx.wp.spa' ]                      = "//cdn.udx.io/udx.wp.spa";
    config.paths[ 'udx.wp.editor' ]                   = "//cdn.udx.io/udx.wp.editor";
    config.paths[ 'udx.wp.theme' ]                    = "//cdn.udx.io/udx.wp.theme";
    config.paths[ 'udx.wp.posts' ]                    = "//cdn.udx.io/udx.wp.posts";

    // WP-Property: Importer
    config.paths[ 'wpp.importer.overview' ]           = "//cdn.udx.io/wpp.importer.overview";
    config.paths[ 'wpp.importer.editor' ]             = "//cdn.udx.io/wpp.importer.editor";
    config.paths[ 'wpp.importer.rets' ]               = "//cdn.udx.io/wpp.importer.rets";

    /**
     * Trims the . and .. from an array of path segments.
     * It will keep a leading path segment if a .. will become
     * the first path segment, to help with module name lookups,
     * which act like paths, but can be remapped. But the end result,
     * all paths that use this function should look normalized.
     * NOTE: this method MODIFIES the input array.
     * @param {Array} ary the array of path segments.
     */
    function trimDots( ary ) {
      var i, part;
      for( i = 0; ary[i]; i += 1 ) {
        part = ary[i];
        if( part === '.' ) {
          ary.splice( i, 1 );
          i -= 1;
        } else if( part === '..' ) {
          if( i === 1 && (ary[2] === '..' || ary[0] === '..') ) {
            //End of the line. Keep at least one non-dot
            //path segment at the front so it can be mapped
            //correctly to disk. Otherwise, there is likely
            //no path mapping for a path starting with '..'.
            //This can still fail, but catches the most reasonable
            //uses of ..
            break;
          } else if( i > 0 ) {
            ary.splice( i - 1, 2 );
            i -= 2;
          }
        }
      }
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @param {Boolean} applyMap apply the map config to the value. Should
     * only be done if this normalization is for a dependency ID.
     * @returns {String} normalized name
     */
    function normalize( name, baseName, applyMap ) {
      var pkgName, pkgConfig, mapValue, nameParts, i, j, nameSegment, foundMap, foundI, foundStarMap, starI, baseParts = baseName && baseName.split( '/' ), normalizedBaseParts = baseParts, map = config.map, starMap = map && map['*'];

      //Adjust any relative paths.
      if( name && name.charAt( 0 ) === '.' ) {
        //If have a base name, try to normalize against it,
        //otherwise, assume it is a top-level require that will
        //be relative to baseUrl in the end.
        if( baseName ) {
          if( getOwn( config.pkgs, baseName ) ) {
            normalizedBaseParts = baseParts = [baseName];
          } else {
            normalizedBaseParts = baseParts.slice( 0, baseParts.length - 1 );
          }

          name = normalizedBaseParts.concat( name.split( '/' ) );
          trimDots( name );

          //Some use of packages may use a . path to reference the
          //'main' module name, so normalize for that.
          pkgConfig = getOwn( config.pkgs, (pkgName = name[0]) );
          name = name.join( '/' );
          if( pkgConfig && name === pkgName + '/' + pkgConfig.main ) {
            name = pkgName;
          }
        } else if( name.indexOf( './' ) === 0 ) {
          // No baseName, so this is ID is resolved relative
          // to baseUrl, pull off the leading dot.
          name = name.substring( 2 );
        }
      }

      //Apply map config if available.
      if( applyMap && map && (baseParts || starMap) ) {
        nameParts = name.split( '/' );

        for( i = nameParts.length; i > 0; i -= 1 ) {
          nameSegment = nameParts.slice( 0, i ).join( '/' );

          if( baseParts ) {
            //Find the longest baseName segment match in the config.
            //So, do joins on the biggest to smallest lengths of baseParts.
            for( j = baseParts.length; j > 0; j -= 1 ) {
              mapValue = getOwn( map, baseParts.slice( 0, j ).join( '/' ) );

              //baseName segment has config, find if it has one for
              //this name.
              if( mapValue ) {
                mapValue = getOwn( mapValue, nameSegment );
                if( mapValue ) {
                  //Match, update name to the new value.
                  foundMap = mapValue;
                  foundI = i;
                  break;
                }
              }
            }
          }

          if( foundMap ) {
            break;
          }

          //Check for a star map match, but just hold on to it,
          //if there is a shorter segment match later in a matching
          //config, then favor over this star map.
          if( !foundStarMap && starMap && getOwn( starMap, nameSegment ) ) {
            foundStarMap = getOwn( starMap, nameSegment );
            starI = i;
          }
        }

        if( !foundMap && foundStarMap ) {
          foundMap = foundStarMap;
          foundI = starI;
        }

        if( foundMap ) {
          nameParts.splice( 0, foundI, foundMap );
          name = nameParts.join( '/' );
        }
      }

      return name;
    }

    /**
     * Remove Script
     *
     * @param name
     */
    function removeScript( name ) {
      if( isBrowser ) {
        each( scripts(), function( scriptNode ) {
          if( scriptNode.getAttribute( 'data-requiremodule' ) === name && scriptNode.getAttribute( 'data-requirecontext' ) === context.contextName ) {
            scriptNode.parentNode.removeChild( scriptNode );
            return true;
          }
        } );
      }
    }

    /**
     * Has Path Fallback
     *
     * @param id
     * @returns {boolean}
     */
    function hasPathFallback( id ) {
      var pathConfig = getOwn( config.paths, id );
      if( pathConfig && isArray( pathConfig ) && pathConfig.length > 1 ) {
        //Pop off the first array value, since it failed, and
        //retry
        pathConfig.shift();
        context.require.undef( id );
        context.require( [id] );
        return true;
      }
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix( name ) {
      var prefix, index = name ? name.indexOf( '!' ) : -1;
      if( index > -1 ) {
        prefix = name.substring( 0, index );
        name = name.substring( index + 1, name.length );
      }
      return [prefix, name];
    }

    /**
     * Creates a module mapping that includes plugin prefix, module
     * name, and path. If parentModuleMap is provided it will
     * also normalize the name via require.normalize()
     *
     * @param {String} name the module name
     * @param {String} [parentModuleMap] parent module map
     * for the module name, used to resolve relative names.
     * @param {Boolean} isNormalized: is the ID already normalized.
     * This is true if this call is done for a define() module ID.
     * @param {Boolean} applyMap: apply the map config to the ID.
     * Should only be true if this map is for a dependency.
     *
     * @returns {Object}
     */
    function makeModuleMap( name, parentModuleMap, isNormalized, applyMap ) {

      var url, pluginModule, suffix, nameParts, prefix = null, parentName = parentModuleMap ? parentModuleMap.name : null, originalName = name, isDefine = true, normalizedName = '';

      //If no name, then it means it is a require call, generate an
      //internal name.
      if( !name ) {
        isDefine = false;
        name = '_@r' + (requireCounter += 1);
      }

      nameParts = splitPrefix( name );
      prefix = nameParts[0];
      name = nameParts[1];

      if( prefix ) {
        prefix = normalize( prefix, parentName, applyMap );
        pluginModule = getOwn( defined, prefix );
      }

      //Account for relative paths if there is a base name.
      if( name ) {
        if( prefix ) {
          if( pluginModule && pluginModule.normalize ) {
            //Plugin is loaded, use its normalize method.
            normalizedName = pluginModule.normalize( name, function( name ) {
              return normalize( name, parentName, applyMap );
            } );
          } else {
            normalizedName = normalize( name, parentName, applyMap );
          }
        } else {
          //A regular module.
          normalizedName = normalize( name, parentName, applyMap );

          //Normalized name may be a plugin ID due to map config
          //application in normalize. The map config values must
          //already be normalized, so do not need to redo that part.
          nameParts = splitPrefix( normalizedName );
          prefix = nameParts[0];
          normalizedName = nameParts[1];
          isNormalized = true;

          url = context.nameToUrl( normalizedName );
        }
      }

      //If the id is a plugin id that cannot be determined if it needs
      //normalization, stamp it with a unique ID so two matching relative
      //ids that may conflict can be separate.
      suffix = prefix && !pluginModule && !isNormalized ? '_unnormalized' + (unnormalizedCounter += 1) : '';

      var _map = {
        prefix: prefix,
        name: normalizedName,
        parentMap: parentModuleMap,
        unnormalized: !!suffix,
        url: url,
        originalName: originalName,
        isDefine: isDefine,
        id: (prefix ? prefix + '!' + normalizedName : normalizedName) + suffix
      };

      context.log( 'makeModuleMap', name, _map );

      return _map;

    }

    function getModule( depMap ) {
      context.log( 'getModule', depMap );

      var id = depMap.id;
      var mod = getOwn( registry, id );

      //console.debug( 'getModule', context.config.shim );

      if( !mod ) {
        mod = registry[id] = new context.Module( depMap );
      }


      if( context.config.shim[ id ] && context.config.shim[ id ].exports ) {
        var exportName = context.config.shim[ id ].exports;

        if( window[ exportName ] ) {
          //console.debug( 'already have', id );
          mod.inWindow = true;
        }
      }


      return mod;
    }

    function on( depMap, name, fn ) {
      var id = depMap.id, mod = getOwn( registry, id );

      if( hasProp( defined, id ) && (!mod || mod.defineEmitComplete) ) {
        if( name === 'defined' ) {
          fn( defined[id] );
        }
      } else {
        mod = getModule( depMap );
        if( mod.error && name === 'error' ) {
          fn( mod.error );
        } else {
          mod.on( name, fn );
        }
      }
    }

    function onError( err, errback ) {
      var ids = err.requireModules, notified = false;

      if( errback ) {
        errback( err );
      } else {
        each( ids, function( id ) {
          var mod = getOwn( registry, id );
          if( mod ) {
            //Set error on module, so it skips timeout checks.
            mod.error = err;
            if( mod.events.error ) {
              notified = true;
              mod.emit( 'error', err );
            }
          }
        } );

        if( !notified ) {
          req.onError( err );
        }
      }
    }

    /**
     * Internal method to transfer globalQueue items to this context's
     * defQueue.
     */
    function takeGlobalQueue() {
      //Push all the globalDefQueue items into the context's defQueue
      if( globalDefQueue.length ) {
        //Array splice in the values since the context code has a
        //local var ref to defQueue, so cannot just reassign the one
        //on context.
        apsp.apply( defQueue, [defQueue.length, 0].concat( globalDefQueue ) );
        globalDefQueue = [];
      }
    }

    handlers = {
      'require': function( mod ) {
        if( mod.require ) {
          return mod.require;
        } else {
          return (mod.require = context.makeRequire( mod.map ));
        }
      },
      'exports': function( mod ) {
        mod.usingExports = true;
        if( mod.map.isDefine ) {
          if( mod.exports ) {
            return mod.exports;
          } else {
            return (mod.exports = defined[mod.map.id] = {});
          }
        }
      },
      'module': function( mod ) {
        if( mod.module ) {
          return mod.module;
        } else {
          return (mod.module = {
            id: mod.map.id,
            uri: mod.map.url,
            config: function() {
              var c, pkg = getOwn( config.pkgs, mod.map.id );
              // For packages, only support config targeted
              // at the main module.
              c = pkg ? getOwn( config.config, mod.map.id + '/' + pkg.main ) : getOwn( config.config, mod.map.id );
              return  c || {};
            },
            exports: defined[mod.map.id],
            /**
             * Module Logger.
             *
             * @author potanin@UD
             * @returns {*}
             */
            log: function moduleLog() {
              console.info.call( console, this.id, arguments );
              return arguments[0];
            },
            /**
             * Module Error Logger
             *
             * @author potanin@UD
             * @returns {*}
             */
            error: function moduleError() {
              console.error.call( console, this.id, arguments );
              return arguments[0];
            },
            /**
             * Module Debugger
             *
             * @author potanin@UD
             * @returns {*}
             */
            debug: function moduleDebug() {
              console.debug.call( console, this.id, arguments );
              return arguments[0];
            }
          });
        }
      }
    };

    function cleanRegistry( id ) {
      //Clean up machinery used for waiting modules.
      delete registry[id];
      delete enabledRegistry[id];
    }

    function breakCycle( mod, traced, processed ) {
      var id = mod.map.id;

      if( mod.error ) {
        mod.emit( 'error', mod.error );
      } else {
        traced[id] = true;
        each( mod.depMaps, function( depMap, i ) {
          var depId = depMap.id, dep = getOwn( registry, depId );

          //Only force things that have not completed
          //being defined, so still in the registry,
          //and only if it has not been matched up
          //in the module already.
          if( dep && !mod.depMatched[i] && !processed[depId] ) {
            if( getOwn( traced, depId ) ) {
              mod.defineDep( i, defined[depId] );
              mod.check(); //pass false?
            } else {
              breakCycle( dep, traced, processed );
            }
          }
        } );
        processed[id] = true;
      }
    }

    function checkLoaded() {
      var err, usingPathFallback, waitInterval = config.waitSeconds * 1000, //It is possible to disable the wait interval by using waitSeconds of 0.
        expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(), noLoads = [], reqCalls = [], stillLoading = false, needCycleCheck = true;

      //Do not bother if this call was a result of a cycle break.
      if( inCheckLoaded ) {
        return;
      }

      inCheckLoaded = true;

      //Figure out the state of all the modules.
      eachProp( enabledRegistry, function( mod ) {
        var map = mod.map, modId = map.id;

        //Skip things that are not enabled or in error state.
        if( !mod.enabled ) {
          return;
        }

        if( !map.isDefine ) {
          reqCalls.push( mod );
        }

        if( !mod.error ) {
          //If the module should be executed, and it has not
          //been inited and time is up, remember it.
          if( !mod.inited && expired ) {
            if( hasPathFallback( modId ) ) {
              usingPathFallback = true;
              stillLoading = true;
            } else {
              noLoads.push( modId );
              removeScript( modId );
            }
          } else if( !mod.inited && mod.fetched && map.isDefine ) {
            stillLoading = true;
            if( !map.prefix ) {
              //No reason to keep looking for unfinished
              //loading. If the only stillLoading is a
              //plugin resource though, keep going,
              //because it may be that a plugin resource
              //is waiting on a non-plugin cycle.
              return (needCycleCheck = false);
            }
          }
        }
      } );

      if( expired && noLoads.length ) {
        //If wait time expired, throw error of unloaded modules.
        err = makeError( 'timeout', 'Load timeout for modules: ' + noLoads, null, noLoads );
        err.contextName = context.contextName;
        return onError( err );
      }

      //Not expired, check for a cycle.
      if( needCycleCheck ) {
        each( reqCalls, function( mod ) {
          breakCycle( mod, {}, {} );
        } );
      }

      //If still waiting on loads, and the waiting load is something
      //other than a plugin resource, or there are still outstanding
      //scripts, then just try back later.
      if( (!expired || usingPathFallback) && stillLoading ) {
        //Something is still waiting to load. Wait for it, but only
        //if a timeout is not already in effect.
        if( (isBrowser || isWebWorker) && !checkLoadedTimeoutId ) {
          checkLoadedTimeoutId = setTimeout( function() {
            checkLoadedTimeoutId = 0;
            checkLoaded();
          }, 50 );
        }
      }

      inCheckLoaded = false;
    }

    Module = function( map ) {
      this.events = getOwn( undefEvents, map.id ) || {};
      this.map = map;
      this.shim = getOwn( config.shim, map.id );
      this.depExports = [];
      this.depMaps = [];
      this.depMatched = [];
      this.pluginMaps = {};
      this.depCount = 0;

      /* this.exports this.factory
       this.depMaps = [],
       this.enabled, this.fetched
       */
    };

    Module.prototype = {
      init: function( depMaps, factory, errback, options ) {
        context.log( 'Module.init', this.map.id, this.map.url );

        options = options || {};

        //Do not do more inits if already done. Can happen if there
        //are multiple define calls for the same module. That is not
        //a normal, common case, but it is also not unexpected.
        if( this.inited ) {
          return;
        }

        this.factory = factory;

        if( errback ) {
          //Register for errors on this module.
          this.on( 'error', errback );
        } else if( this.events.error ) {
          //If no errback already, but there are error listeners
          //on this module, set up an errback to pass to the deps.
          errback = bind( this, function( err ) {
            this.emit( 'error', err );
          } );
        }

        //Do a copy of the dependency array, so that
        //source inputs are not modified. For example
        //"shim" deps are passed in here directly, and
        //doing a direct modification of the depMaps array
        //would affect that config.

        // Deps is an object not an array.
        if( depMaps && 'object' === typeof depMaps && 'function' !== typeof depMaps.slice ) {
          depMaps = [ depMaps[0] ];
        }

        this.depMaps = depMaps && depMaps.slice( 0 );

        this.errback = errback;

        //Indicate this module has be initialized
        this.inited = true;

        this.ignore = options.ignore;

        //Could have option to init this module in enabled mode,
        //or could have been previously marked as enabled. However,
        //the dependencies are not known until init is called. So
        //if enabled previously, now trigger dependencies as enabled.
        if( options.enabled || this.enabled ) {
          //Enable this module and dependencies.
          //Will call this.check()
          this.enable();
        } else {
          this.check();
        }
      },

      defineDep: function( i, depExports ) {
        context.log( 'Module.defineDep', this.map.id, this.map.url );

        //Because of cycles, defined callback for a given
        //export can be called more than once.
        if( !this.depMatched[i] ) {
          this.depMatched[i] = true;
          this.depCount -= 1;
          this.depExports[i] = depExports;
        }
      },

      fetch: function() {
        context.log( 'Module.fetch', this.map.id, this.map.url, this.map.prefix, this.shim );

        if( this.fetched ) {
          return;
        }

        this.fetched = true;

        context.startTime = (new Date()).getTime();

        var map = this.map;

        //If the manager is for a plugin managed resource,
        //ask the plugin to load it now.
        if( this.shim ) {

          if( this.inWindow ) {
            //console.debug( 'in fucking window', this.map.prefix );
            //return map.prefix ? this.callPlugin() : this.load();
          }

          context.makeRequire( this.map, {
            enableBuildCallback: true
          } )( this.shim.deps || [], bind( this, function() {
              return map.prefix ? this.callPlugin() : this.load();
            } ) );
        } else {
          //Regular dependency.
          return map.prefix ? this.callPlugin() : this.load();
        }
      },

      load: function() {
        context.log( 'Module.load', this.map.id, this.map.url );
        var url = this.map.url;

        if( this.inWindow ) {
          console.debug( 'Module.load', this.map.id, 'inWindow', context );
          //return;
        }

        //Regular dependency.
        if( !urlFetched[url] ) {
          urlFetched[url] = true;
          context.load( this.map.id, url );
        }

      },

      /**
       * Checks if the module is ready to define itself, and if so,
       * define it.
       */
      check: function() {
        context.log( 'Module.check', this.map.id, this.map.url, this.inWindow, this.depExports );

        if( !this.enabled || this.enabling ) {
          return;
        }

        var err, cjsModule, id = this.map.id, depExports = this.depExports, exports = this.exports, factory = this.factory;


        // Already in window.. do not fetch. (@experimental)
        if( this.inWindow ) {
          //this.enable();
          //this.inited = true;
          //this.inited = true;
          //this.enabled = true;
          //this.defining = false;

          //this.exports = window[ this.shim.exports ]

          //console.debug( 'this.exports', this.inited );
          //this.defineEmitted = true;
          //this.emit( 'defined', this.exports );
          //this.defineEmitComplete = true;
//          this.depExports = true;
          //context.completeLoad( this.map.id );
          //context.log( 'Module.check', this.map.id, this.map.url, 'in window', this.depExports );
          //return;
        }

        if( !this.inited ) {
          this.fetch();
        } else if( this.error ) {
          this.emit( 'error', this.error );
        } else if( !this.defining ) {
          //The factory could trigger another require call
          //that would result in checking this module to
          //define itself again. If already in the process
          //of doing that, skip this work.
          this.defining = true;

          if( this.depCount < 1 && !this.defined ) {
            if( isFunction( factory ) ) {
              //If there is an error listener, favor passing
              //to that instead of throwing an error. However,
              //only do it for define()'d  modules. require
              //errbacks should not be called for failures in
              //their callbacks (#699). However if a global
              //onError is set, use that.
              if( (this.events.error && this.map.isDefine) || req.onError !== defaultOnError ) {
                try {
                  exports = context.execCb( id, factory, depExports, exports );
                } catch( e ) {
                  err = e;
                }
              } else {
                exports = context.execCb( id, factory, depExports, exports );
              }

              if( this.map.isDefine ) {
                //If setting exports via 'module' is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                cjsModule = this.module;
                if( cjsModule && cjsModule.exports !== undefined && //Make sure it is not already the exports value
                  cjsModule.exports !== this.exports ) {
                  exports = cjsModule.exports;
                } else if( exports === undefined && this.usingExports ) {
                  //exports already set the defined value.
                  exports = this.exports;
                }
              }

              if( err ) {
                err.requireMap = this.map;
                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                err.requireType = this.map.isDefine ? 'define' : 'require';
                return onError( (this.error = err) );
              }

            } else {
              //Just a literal value
              exports = factory;
            }

            this.exports = exports;

            if( this.map.isDefine && !this.ignore ) {
              defined[id] = exports;

              if( req.onResourceLoad ) {
                req.onResourceLoad( context, this.map, this.depMaps );
              }
            }

            //Clean up
            cleanRegistry( id );

            this.defined = true;
          }

          //Finished the define stage. Allow calling check again
          //to allow define notifications below in the case of a
          //cycle.
          this.defining = false;

          if( this.defined && !this.defineEmitted ) {
            this.defineEmitted = true;
            this.emit( 'defined', this.exports );
            this.defineEmitComplete = true;
          }

        }
      },

      callPlugin: function() {
        context.log( 'Module.callPlugin', this.map.id, this.map.url );

        var map = this.map, id = map.id, //Map already normalized the prefix.
          pluginMap = makeModuleMap( map.prefix );

        //Mark this as a dependency for this plugin, so it
        //can be traced for cycles.
        this.depMaps.push( pluginMap );

        on( pluginMap, 'defined', bind( this, function( plugin ) {
          var load, normalizedMap, normalizedMod, name = this.map.name, parentName = this.map.parentMap ? this.map.parentMap.name : null, localRequire = context.makeRequire( map.parentMap, {
            enableBuildCallback: true
          } );

          //If current map is not normalized, wait for that
          //normalized name to load instead of continuing.
          if( this.map.unnormalized ) {
            //Normalize the ID if the plugin allows it.
            if( plugin.normalize ) {
              name = plugin.normalize( name, function( name ) {
                return normalize( name, parentName, true );
              } ) || '';
            }

            //prefix and name should already be normalized, no need
            //for applying map config again either.
            normalizedMap = makeModuleMap( map.prefix + '!' + name, this.map.parentMap );
            on( normalizedMap, 'defined', bind( this, function( value ) {
              this.init( [], function() {
                return value;
              }, null, {
                enabled: true,
                ignore: true
              } );
            } ) );

            normalizedMod = getOwn( registry, normalizedMap.id );
            if( normalizedMod ) {
              //Mark this as a dependency for this plugin, so it
              //can be traced for cycles.
              this.depMaps.push( normalizedMap );

              if( this.events.error ) {
                normalizedMod.on( 'error', bind( this, function( err ) {
                  this.emit( 'error', err );
                } ) );
              }
              normalizedMod.enable();
            }

            return;
          }

          load = bind( this, function( value ) {
            this.init( [], function() {
              return value;
            }, null, {
              enabled: true
            } );
          } );

          load.error = bind( this, function( err ) {
            this.inited = true;
            this.error = err;
            err.requireModules = [id];

            //Remove temp unnormalized modules for this module,
            //since they will never be resolved otherwise now.
            eachProp( registry, function( mod ) {
              if( mod.map.id.indexOf( id + '_unnormalized' ) === 0 ) {
                cleanRegistry( mod.map.id );
              }
            } );

            onError( err );
          } );

          //Allow plugins to load other code without having to know the
          //context or how to 'complete' the load.
          load.fromText = bind( this, function( text, textAlt ) {
            /*jslint evil: true */
            var moduleName = map.name, moduleMap = makeModuleMap( moduleName ), hasInteractive = useInteractive;

            //As of 2.1.0, support just passing the text, to reinforce
            //fromText only being called once per resource. Still
            //support old style of passing moduleName but discard
            //that moduleName in favor of the internal ref.
            if( textAlt ) {
              text = textAlt;
            }

            //Turn off interactive script matching for IE for any define
            //calls in the text, then turn it back on at the end.
            if( hasInteractive ) {
              useInteractive = false;
            }

            //Prime the system by creating a module instance for
            //it.
            getModule( moduleMap );

            //Transfer any config to this other module.
            if( hasProp( config.config, id ) ) {
              config.config[moduleName] = config.config[id];
            }

            try {
              req.exec( text );
            } catch( e ) {
              return onError( makeError( 'fromtexteval', 'fromText eval for ' + id + ' failed: ' + e, e, [id] ) );
            }

            if( hasInteractive ) {
              useInteractive = true;
            }

            //Mark this as a dependency for the plugin
            //resource
            this.depMaps.push( moduleMap );

            //Support anonymous modules.
            context.completeLoad( moduleName );

            //context.log( 'completeLoad')

            //Bind the value of that module to the value for this
            //resource ID.
            localRequire( [moduleName], load );

          } );

          //Use parentName here since the plugin's name is not reliable,
          //could be some weird string with no path that actually wants to
          //reference the parentName's path.
          plugin.load( map.name, localRequire, load, config );
        } ) );

        context.enable( pluginMap, this );

        this.pluginMaps[pluginMap.id] = pluginMap;

      },

      enable: function() {
        context.log( 'Module.enable', this.map.id, this.map.url );

        enabledRegistry[this.map.id] = this;
        this.enabled = true;

        //Set flag mentioning that the module is enabling,
        //so that immediate calls to the defined callbacks
        //for dependencies do not trigger inadvertent load
        //with the depCount still being zero.
        this.enabling = true;

        //Enable each dependency
        each( this.depMaps, bind( this, function( depMap, i ) {
          var id, mod, handler;

          if( typeof depMap === 'string' ) {
            //Dependency needs to be converted to a depMap
            //and wired up to this module.
            depMap = makeModuleMap( depMap, (this.map.isDefine ? this.map : this.map.parentMap), false, !this.skipMap );
            this.depMaps[i] = depMap;

            handler = getOwn( handlers, depMap.id );

            if( handler ) {
              this.depExports[i] = handler( this );
              return;
            }

            this.depCount += 1;

            on( depMap, 'defined', bind( this, function( depExports ) {
              this.defineDep( i, depExports );
              this.check();
            } ) );

            if( this.errback ) {
              on( depMap, 'error', bind( this, this.errback ) );
            }
          }

          id = depMap.id;
          mod = registry[id];

          //Skip special modules like 'require', 'exports', 'module'
          //Also, don't call enable if it is already enabled,
          //important in circular dependency cases.
          if( !hasProp( handlers, id ) && mod && !mod.enabled ) {
            context.enable( depMap, this );
          }
        } ) );

        //Enable each plugin that is used in
        //a dependency
        eachProp( this.pluginMaps, bind( this, function( pluginMap ) {
          var mod = getOwn( registry, pluginMap.id );
          if( mod && !mod.enabled ) {
            context.enable( pluginMap, this );
          }
        } ) );

        this.enabling = false;

        this.check();
      },

      on: function( name, cb ) {
        var cbs = this.events[name];
        if( !cbs ) {
          cbs = this.events[name] = [];
        }
        cbs.push( cb );
      },

      emit: function( name, evt ) {
        each( this.events[name], function( cb ) {
          cb( evt );
        } );
        if( name === 'error' ) {
          //Now that the error handler was triggered, remove
          //the listeners, since this broken Module instance
          //can stay around for a while in the registry.
          delete this.events[name];
        }
      }
    };

    function callGetModule( args ) {
      context.log( 'callGetModule', args );

      //Skip modules already defined.
      if( !hasProp( defined, args[0] ) ) {
        getModule( makeModuleMap( args[0], null, true ) ).init( args[1], args[2] );
      }

    }

    function removeListener( node, func, name, ieName ) {
      //Favor detachEvent because of IE9
      //issue, see attachEvent/addEventListener comment elsewhere
      //in this file.
      if( node.detachEvent && !isOpera ) {
        //Probably IE. If not it will throw an error, which will be
        //useful to know.
        if( ieName ) {
          node.detachEvent( ieName, func );
        }
      } else {
        node.removeEventListener( name, func, false );
      }
    }

    /**
     * Given an event from a script node, get the requirejs info from it,
     * and then removes the event listeners on the node.
     * @param {Event} evt
     * @returns {Object}
     */
    function getScriptData( evt ) {
      context.log( 'getScriptData', evt );

      //Using currentTarget instead of target for Firefox 2.0's sake. Not
      //all old browsers will be supported, but this one was easy enough
      //to support and still makes sense.
      var node = evt.currentTarget || evt.srcElement;

      //Remove the listeners once here.
      removeListener( node, context.onScriptLoad, 'load', 'onreadystatechange' );
      removeListener( node, context.onScriptError, 'error' );

      return {
        node: node,
        id: node && node.getAttribute( 'data-requiremodule' )
      };
    }

    function intakeDefines() {
      var args;

      //Any defined modules in the global queue, intake them now.
      takeGlobalQueue();

      //Make sure any remaining defQueue items get properly processed.
      while( defQueue.length ) {
        args = defQueue.shift();

        if( args[0] === null ) {
          return onError( makeError( 'mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1] ) );
        } else {

          //args are id, deps, factory. Should be normalized by the
          //define() function.
          callGetModule( args );
        }
      }
    }

    context = {
      config: config,
      contextName: contextName,
      registry: registry,
      defined: defined,
      urlFetched: urlFetched,
      defQueue: defQueue,
      Module: Module,
      makeModuleMap: makeModuleMap,
      nextTick: req.nextTick,
      onError: onError,

      /**
       * Debug Log
       * @author potanin@UD
       */
      log: function debugLog() {

        //config.debug = true;

        if( config.debug ) {
          console['log'].apply( console, arguments );
        }

      },
      info: function infoLog() {
        console.info.apply( console, arguments );
      },

      /**
       * Set a configuration for the context.
       * @param {Object} cfg config object to integrate.
       */
      configure: function( cfg ) {
        // context.log( 'configure', cfg );

        //Make sure the baseUrl ends in a slash.
        if( cfg.baseUrl ) {
          if( cfg.baseUrl.charAt( cfg.baseUrl.length - 1 ) !== '/' ) {
            cfg.baseUrl += '/';
          }
        }

        //Save off the paths and packages since they require special processing,
        //they are additive.
        var pkgs = config.pkgs, shim = config.shim, objs = {
          paths: true,
          config: true,
          map: true
        };

        cfg.packages = udx.setDefaultPackages( cfg.packages );

        //context.log( 'cfg.packages', cfg.packages );

        eachProp( cfg, function( value, prop ) {
          if( objs[prop] ) {
            if( !config[prop] ) {
              config[prop] = {};
            }
            mixin( config[prop], value, true, true );
          } else {
            config[prop] = value;
          }
        } );

        //Merge shim
        if( cfg.shim ) {
          eachProp( cfg.shim, function( value, id ) {
            //Normalize the structure
            if( isArray( value ) ) {
              value = {
                deps: value
              };
            }
            if( (value.exports || value.init) && !value.exportsFn ) {
              value.exportsFn = context.makeShimExports( value );
            }
            shim[id] = value;
          } );
          config.shim = shim;
        }

        //Adjust packages if necessary.
        if( cfg.packages ) {
          each( cfg.packages, function( pkgObj ) {
            var location;

            pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;
            location = pkgObj.location;

            //Create a brand new object on pkgs, since currentPackages can
            //be passed in again, and config.pkgs is the internal transformed
            //state for all package configs.
            pkgs[pkgObj.name] = {
              name: pkgObj.name,
              location: location || pkgObj.name,
              //Remove leading dot in main, so main paths are normalized,
              //and remove any trailing .js, since different package
              //envs have different conventions: some use a module name,
              //some use a file name.
              main: (pkgObj.main || 'main').replace( currDirRegExp, '' ).replace( jsSuffixRegExp, '' )
            };
          } );

          //Done with modifications, assing packages back to context config
          config.pkgs = pkgs;
        }

        // context.log( 'config.pkgs', config.pkgs );

        //If there are any "waiting to execute" modules in the registry,
        //update the maps for them, since their info, like URLs to load,
        //may have changed.
        eachProp( registry, function( mod, id ) {
          //If module already has init called, since it is too
          //late to modify them, and ignore unnormalized ones
          //since they are transient.
          if( !mod.inited && !mod.map.unnormalized ) {
            mod.map = makeModuleMap( id );
          }
        } );

        //If a deps array or a config callback is specified, then call
        //require with those args. This is useful when require is defined as a
        //config object before require.js is loaded.
        if( cfg.deps || cfg.callback ) {
          context.require( cfg.deps || [], cfg.callback );
        }
      },

      makeShimExports: function( value ) {
        function fn() {
          var ret;
          if( value.init ) {
            ret = value.init.apply( global, arguments );
          }
          return ret || (value.exports && getGlobal( value.exports ));
        }

        return fn;
      },

      makeRequire: function( relMap, options ) {
        context.log( 'makeRequire', defined );

        options = options || {};

        function localRequire( deps, callback, errback ) {
          context.log( 'localRequire', this );

          var id, map, requireMod;

          if( options.enableBuildCallback && callback && isFunction( callback ) ) {
            callback.__requireJsBuild = true;
          }

          if( typeof deps === 'string' ) {
            context.log( 'localRequire', deps );

            if( isFunction( callback ) ) {
              //Invalid call
              return onError( makeError( 'requireargs', 'Invalid require call' ), errback );
            }

            //If require|exports|module are requested, get the
            //value for them from the special handlers. Caveat:
            //this only works while module is being defined.
            if( relMap && hasProp( handlers, deps ) ) {
              return handlers[deps]( registry[relMap.id] );
            }

            //Synchronous access to one module. If require.get is
            //available (as in the Node adapter), prefer that.
            if( req.get ) {
              return req.get( context, deps, relMap, localRequire );
            }

            //Normalize module name, if it contains . or ..
            map = makeModuleMap( deps, relMap, false, true );

            id = map.id;

            if( !hasProp( defined, id ) ) {
              return onError( makeError( 'notloaded', 'Module name "' + id + '" has not been loaded yet for context: ' + contextName + (relMap ? '' : '. Use require([])') ) );
            }

            if( hasProp( defined[id], 'data' ) && hasProp( defined[ id ], 'type' ) ) {
              return udx.contextModel( context, id, defined[id] );
            }

            return defined[id];

          }

          //Grab defines waiting in the global queue.
          intakeDefines();

          //Mark all the dependencies as needing to be loaded.
          context.nextTick( function() {
            context.log( 'localRequire:nextTick', deps );

            //Some defines could have been added since the
            //require call, collect them.
            intakeDefines();

            requireMod = getModule( makeModuleMap( null, relMap ) );

            //Store if map config should be applied to this require
            //call for dependencies.
            requireMod.skipMap = options.skipMap;

            requireMod.init( deps, callback, errback, {
              enabled: true
            } );

            checkLoaded();
          } );

          return localRequire;

        }

        mixin( localRequire, {
          isBrowser: isBrowser,

          /**
           * Converts a module name + .extension into an URL path.
           * *Requires* the use of a module name. It does not support using
           * plain URLs like nameToUrl.
           */
          toUrl: function( moduleNamePlusExt ) {

            var ext, index = moduleNamePlusExt.lastIndexOf( '.' ), segment = moduleNamePlusExt.split( '/' )[0], isRelative = segment === '.' || segment === '..';

            //Have a file extension alias, and it is not the
            //dots from a relative path.
            if( index !== -1 && (!isRelative || index > 1) ) {
              ext = moduleNamePlusExt.substring( index, moduleNamePlusExt.length );
              moduleNamePlusExt = moduleNamePlusExt.substring( 0, index );
            }

            var _return = context.nameToUrl( normalize( moduleNamePlusExt, relMap && relMap.id, true ), ext, true );

            // context.log( 'toUrl', moduleNamePlusExt, _return );

            return _return;

          },

          defined: function( id ) {
            return hasProp( defined, makeModuleMap( id, relMap, false, true ).id );
          },

          specified: function( id ) {
            id = makeModuleMap( id, relMap, false, true ).id;
            return hasProp( defined, id ) || hasProp( registry, id );
          }
        } );

        //Only allow undef on top level require calls
        if( !relMap ) {
          localRequire.undef = function( id ) {
            //Bind any waiting define() calls to this context,
            //fix for #408
            takeGlobalQueue();

            var map = makeModuleMap( id, relMap, true ), mod = getOwn( registry, id );

            removeScript( id );

            delete defined[id];
            delete urlFetched[map.url];
            delete undefEvents[id];

            //Clean queued defines too. Go backwards
            //in array so that the splices do not
            //mess up the iteration.
            eachReverse( defQueue, function( args, i ) {
              if( args[0] === id ) {
                defQueue.splice( i, 1 );
              }
            } );

            if( mod ) {
              //Hold on to listeners in case the
              //module will be attempted to be reloaded
              //using a different config.
              if( mod.events.defined ) {
                undefEvents[id] = mod.events;
              }

              cleanRegistry( id );
            }
          };
        }

        return localRequire;
      },

      /**
       * Called to enable a module if it is still in the registry
       * awaiting enablement. A second arg, parent, the parent module,
       * is passed in for context, when this method is overriden by
       * the optimizer. Not shown here to keep code compact.
       */
      enable: function( depMap ) {
        var mod = getOwn( registry, depMap.id );
        if( mod ) {
          getModule( depMap ).enable();
        }
      },

      /**
       * Internal method used by environment adapters to complete a load event.
       * A load event could be a script load or just a load pass from a synchronous
       * load call.
       * @param {String} moduleName the name of the module to potentially complete.
       */
      completeLoad: function( moduleName ) {
        context.log( 'completeLoad', moduleName );

        var found, args, mod, shim = getOwn( config.shim, moduleName ) || {}, shExports = shim.exports;

        takeGlobalQueue();

        while( defQueue.length ) {
          args = defQueue.shift();
          if( args[0] === null ) {
            args[0] = moduleName;
            //If already found an anonymous module and bound it
            //to this name, then this is some other anon module
            //waiting for its completeLoad to fire.
            if( found ) {
              break;
            }
            found = true;
          } else if( args[0] === moduleName ) {
            //Found matching define call for this script!
            found = true;
          }

          callGetModule( args );
        }

        //Do this after the cycle of callGetModule in case the result
        //of those calls/init calls changes the registry.
        mod = getOwn( registry, moduleName );

        if( !found && !hasProp( defined, moduleName ) && mod && !mod.inited ) {
          if( config.enforceDefine && (!shExports || !getGlobal( shExports )) ) {
            if( hasPathFallback( moduleName ) ) {
              return;
            } else {
              return onError( makeError( 'nodefine', 'No define call for ' + moduleName, null, [moduleName] ) );
            }
          } else {
            //context.log( 'completeLoad -> callGetModule', moduleName );
            //A script that does not call define(), so just simulate
            //the call for it.
            callGetModule( [moduleName, (shim.deps || []), shim.exportsFn] );
          }
        }

        checkLoaded();
      },

      /**
       * Converts a module name to a file path. Supports cases where
       * moduleName may actually be just an URL.
       * Note that it **does not** call normalize on the moduleName,
       * it is assumed to have already been normalized. This is an
       * internal API, not a public one. Use toUrl for the public API.
       */
      nameToUrl: function( moduleName, ext, skipExt ) {
        context.log( 'nameToUrl', moduleName );

        var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url, parentPath;

        //If a colon is in the URL, it indicates a protocol is used and it is just
        //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
        //or ends with .js, then assume the user meant to use an url and not a module id.
        //The slash is important for protocol-less URLs as well as full paths.
        if( req.jsExtRegExp.test( moduleName ) ) {
          //Just a plain path, not module name lookup, so just return it.
          //Add extension if it is included. This is a bit wonky, only non-.js things pass
          //an extension, this method probably needs to be reworked.
          url = moduleName + (ext || '');
        } else {
          //A module that needs to be converted to a path.
          paths = config.paths;
          pkgs = config.pkgs;

          syms = moduleName.split( '/' );
          //For each module name segment, see if there is a path
          //registered for it. Start with most specific name
          //and work up from it.
          for( i = syms.length; i > 0; i -= 1 ) {
            parentModule = syms.slice( 0, i ).join( '/' );
            pkg = getOwn( pkgs, parentModule );
            parentPath = getOwn( paths, parentModule );
            if( parentPath ) {
              //If an array, it means there are a few choices,
              //Choose the one that is desired
              if( isArray( parentPath ) ) {
                parentPath = parentPath[0];
              }
              syms.splice( 0, i, parentPath );
              break;
            } else if( pkg ) {
              //If module name is just the package name, then looking
              //for the main module.
              if( moduleName === pkg.name ) {
                pkgPath = pkg.location + '/' + pkg.main;
              } else {
                pkgPath = pkg.location;
              }
              syms.splice( 0, i, pkgPath );
              break;
            }
          }

          //Join the path parts together, then figure out if baseUrl is needed.
          url = syms.join( '/' );

          // If this is NOT a JSON request.
          if( url.indexOf( '.json' ) === -1 ) {
            url += (ext || (/^data\:|\?/.test( url ) || skipExt ? '' : '.js'));
          }

          url = (url.charAt( 0 ) === '/' || url.match( /^[\w\+\.\-]+:/ ) ? '' : config.baseUrl) + url;

        }


        // Add urlArgs if an object exists.
        if( config.urlArgs ) {

          // Convert urlArgs to string if object given.
          var _args =  Object.keys( config.urlArgs ).length ? stringifyObject( config.urlArgs ) : config.urlArgs;

          url = config.urlArgs ? url + ((url.indexOf( '?' ) === -1 ? '?' : '&') + _args) : url;

        }

        return url;

      },

      //Delegates to req.load. Broken out as a separate function to
      //allow overriding in the optimizer.
      load: function( id, url ) {
        req.load( context, id, url );
      },

      /**
       * Executes a module callback function. Broken out as a separate function
       * solely to allow the build system to sequence the files in the built
       * layer in the right sequence.
       *
       * @private
       */
      execCb: function( name, callback, args, exports ) {
        //context.log( 'execCb', name );

        return callback.apply( exports, args );
      },

      /**
       * callback for script loads, used to check status of loading.
       *
       * @param {Event} evt the event from the browser for the script
       * that was loaded.
       */
      onScriptLoad: function( evt ) {
        context.log( 'onScriptLoad', evt );

        //Using currentTarget instead of target for Firefox 2.0's sake. Not
        //all old browsers will be supported, but this one was easy enough
        //to support and still makes sense.
        if( evt.type === 'load' || (readyRegExp.test( (evt.currentTarget || evt.srcElement).readyState )) ) {
          //Reset interactive script so a script node is not held onto for
          //to long.
          interactiveScript = null;

          //Pull out the name of the module and the context.
          var data = getScriptData( evt );

          context.completeLoad( data.id );

        }
      },

      /**
       * Callback for script errors.
       */
      onScriptError: function( evt ) {

        // context.log( 'onScriptError:context.config', context.config );     // config object
        // context.log( 'onScriptError:context.defined', context.defined );   // modules (loaded and unloaded)
        // context.log( 'onScriptError:context.registry', context.registry ); // looks like a dependency map
        // context.log( 'onScriptError:evt', evt ); // event
        // context.log( 'onScriptError:this', this );  // DOM element

        var data = getScriptData( evt );

        if( !hasPathFallback( data.id ) ) {
          return onError( makeError( 'scripterror', 'Script error for: ' + data.id, evt, [data.id] ) );
        }
      }
    };

    context.require = context.makeRequire();

    return context;
  }

  /**
   * Main entry point.
   *
   * If the only argument to require is a string, then the module that
   * is represented by that string is fetched for the appropriate context.
   *
   * If the first argument is an array, then it will be treated as an array
   * of dependency string names to fetch. An optional function callback can
   * be specified to execute when all of those dependencies are available.
   *
   * Make a local req variable to help Caja compliance (it assumes things
   * on a require that are not standardized), and to give a short
   * name for minification/local scope use.
   */
  req = requirejs = function( deps, callback, errback, optional ) {

    //Find the right context, use default
    var context, config, contextName = defContextName;

    // Determine if have config object in the call.
    if( !isArray( deps ) && typeof deps !== 'string' ) {
      // deps is a config object
      config = deps;
      if( isArray( callback ) ) {
        // Adjust args if there are dependencies
        deps = callback;
        callback = errback;
        errback = optional;
      } else {
        deps = [];
      }
    }

    if( config && config.context ) {
      contextName = config.context;
    }

    context = getOwn( contexts, contextName );

    if( !context ) {
      context = contexts[contextName] = req.s.newContext( contextName );
    }

    if( config ) {
      context.configure( config );
    }

    udx.dynamicLoading.call( context, deps, callback, errback );

    context.log( 'requirejs', deps );

    return context.require( deps, callback, errback );

  };

  req.loadStyle = loadStyle;

  /**
   * Support require.config() to make it easier to cooperate with other
   * AMD loaders on globally agreed names.
   */
  req.config = function( config ) {
    if( !config ) {
      return cfg;
    }
    return req( config );
  };

  /**
   * Execute something after the current tick
   * of the event loop. Override for other envs
   * that have a better solution than setTimeout.
   * @param  {Function} fn function to execute later.
   */
  req.nextTick = typeof setTimeout !== 'undefined' ? function( fn ) {
    setTimeout( fn, 4 );
  } : function( fn ) {
    fn();
  };

  /**
   * Export require as a global, but only if it does not already exist.
   */
  if( !require ) {
    require = req;
  }

  Object.defineProperties( req, {
    version: {
      value: version,
      enumerable: true,
      configurable: false,
      writable: false
    },
    showHelp: {
      get: function showHelp() {
        console.info( 'requires.js help' );
        console.info( 'Available Paths:' );

        for( var _name in req.s.contexts._.config.paths ) {
          console.info( _name );
        }

      },
      enumerable: false,
      configurable: false
    }
  })

  //Used to filter out dependencies that are already paths.
  req.jsExtRegExp = /^\/|:|\?|\.js$/;
  req.isBrowser = isBrowser;

  s = req.s = {
    contexts: contexts,
    newContext: newContext
  };

  //Create default context.
  req( [ 'udx' ] );

  //Exports some context-sensitive methods on global require.
  each( [ 'toUrl', 'undef', 'defined', 'specified' ], function( prop ) {
    req[prop] = function() {
      var ctx = contexts[defContextName];
      return ctx.require[prop].apply( ctx, arguments );
    };
  });

  if( isBrowser ) {
    head = s.head = document.getElementsByTagName( 'head' )[0];
    baseElement = document.getElementsByTagName( 'base' )[0];
    if( baseElement ) {
      head = s.head = baseElement.parentNode;
    }
  }

  /**
   * Any errors that require explicitly generates will be passed to this
   * function. Intercept/override it if you want custom error handling.
   * @param {Error} err the error object.
   */
  req.onError = defaultOnError;

  /**
   * Creates the node for the load command. Only used in browser envs.
   */
  req.createNode = function( config, moduleName, url ) {
    var node = config.xhtml ? document.createElementNS( 'http://www.w3.org/1999/xhtml', 'html:script' ) : document.createElement( 'script' );
    node.type = config.scriptType || 'text/javascript';
    node.charset = 'utf-8';
    node.async = true;
    return node;
  };

  /**
   * Does the request to load a module for the browser case.
   * Make this a separate function to allow other environments
   * to override it.
   *
   * @param {Object} context the require context to find state.
   * @param {String} moduleName the name of the module.
   * @param {Object} url the URL to the module.
   */
  req.load = function( context, moduleName, url ) {
    context.log( 'req.load', moduleName, url );

    var config = (context && context.config) || {}, node;

    if( url.indexOf( '.json' ) > 1 ) {

      return udx.fetch_json_file( url, function( error, data ) {
        context.log( 'have json!' );

        try {

          var _model = udx.parse_json_string( data );

          context.log( 'json parsed', _model );

          context.log( 'context.registry', context.registry );

          context.completeLoad( moduleName );

          currentlyAddingScript = null;

        } catch( error ) {
          console.error( error );
        }

      });

    }

    if( isBrowser ) {
      //In the browser so use a script tag
      node = req.createNode( config, moduleName, url );

      node.setAttribute( 'data-requirecontext', context.contextName );
      node.setAttribute( 'data-requiremodule', moduleName );

      if( node.attachEvent && //Check if node.attachEvent is artificially added by custom script or
        !(node.attachEvent.toString && node.attachEvent.toString().indexOf( '[native code' ) < 0) && !isOpera ) {
        useInteractive = true;
        node.attachEvent( 'onreadystatechange', context.onScriptLoad );
      } else {
        node.addEventListener( 'load', context.onScriptLoad, false );
        node.addEventListener( 'error', context.onScriptError, false );
      }
      node.src = url;

      currentlyAddingScript = node;

      if( baseElement ) {
        head.insertBefore( node, baseElement );
      } else {
        head.appendChild( node );
      }
      currentlyAddingScript = null;

      return node;

    }

    if( isWebWorker ) {

      try {
        //In a web worker, use importScripts. This is not a very
        //efficient use of importScripts, importScripts will block until
        //its script is downloaded and evaluated. However, if web workers
        //are in play, the expectation that a build has been done so that
        //only one script needs to be loaded anyway. This may need to be
        //reevaluated if other use cases become common.
        importScripts( url );

        //Account for anonymous modules
        context.completeLoad( moduleName );
      } catch( e ) {
        context.onError( makeError( 'importscripts', 'importScripts failed for ' + moduleName + ' at ' + url, e, [moduleName] ) );
      }

    }

  };

  /**
   * Get Interactive Script
   *
   * @returns {*}
   */
  function getInteractiveScript() {
    if( interactiveScript && interactiveScript.readyState === 'interactive' ) {
      return interactiveScript;
    }

    eachReverse( scripts(), function( script ) {
      if( script.readyState === 'interactive' ) {
        return (interactiveScript = script);
      }
    } );
    return interactiveScript;
  }

  //Look for a data-main script attribute, which could also adjust the baseUrl.
  if( isBrowser && !cfg.skipDataMain ) {

    var _last_script;

    //Figure out baseUrl. Get it from the script tag with require.js in it.
    eachReverse( scripts(), function( script ) {

      //Set the 'head' where we can append children by
      //using the script's parent.
      if( !head ) {
        head = script.parentNode;
      }

      udx.dataBaseURL = script.getAttribute( 'data-base-url' );
      udx.dataModel = script.getAttribute( 'data-model' );

      // Set baseUrl from data-base tag on the script
      if( udx.dataBaseURL ) {
        cfg.baseUrl = udx.dataBaseURL;
      }

      // If dataModel is defined in script tag, as
      if( udx.dataModel ) {
        cfg.deps = cfg.deps ? cfg.deps.concat( udx.dataModel ) : [ udx.dataModel ];
      }

      //Look for a data-main attribute to set main script for the page
      //to load. If it is there, the path to data main becomes the
      //baseUrl, if it is not already set.
      dataMain = script.getAttribute( 'data-main' );

      // Add "ver" parameter if version provided.
      if( script.getAttribute( 'data-version' ) != '' ) {
        cfg.urlArgs = { ver: script.getAttribute( 'data-version' ) };
      }

      if( dataMain ) {

        _last_script = script;

        //Preserve dataMain in case it is a path (i.e. contains '?')
        mainScript = dataMain;

        //Set final baseUrl if there is not already an explicit one.
        if( !cfg.baseUrl ) {
          //Pull off the directory of data-main for use as the
          //baseUrl.
          src = mainScript.split( '/' );
          mainScript = src.pop();
          subPath = src.length ? src.join( '/' ) + '/' : './';

          cfg.baseUrl = subPath;
        }

        //Strip off any trailing .js since mainScript is now
        //like a module name.
        mainScript = mainScript.replace( jsSuffixRegExp, '' );

        // context.info( 'mainScript', mainScript );

        //If mainScript is still a path, fall back to dataMain
        if( req.jsExtRegExp.test( mainScript ) ) {
          mainScript = dataMain;
        }

        //Put the data-main script in the files to load.
        cfg.deps = cfg.deps ? cfg.deps.concat( mainScript ) : [mainScript];

        //context.log( 'cfg', cfg );

        // script.setAttribute( 'data-loading', 'true' );

        return true;
      }

    } );

    /**
     * Add Check to ensure that the script we found references the
     *
     *
     */
    req.nextTick( function otherScriptTags() {

      getAllElementsWithAttribute( 'data-main', 'script' ).each( function( element ) {
        //context.log( 'data-main script', element );

        if( !element.getAttribute( 'data-loading' ) && element.src == _last_script.src ) {

          //if( !element.getAttribute( 'data-loading' ) && _last_script && element.src == _last_script.src ) {
          //cfg.paths[ 'asdfasf' ] = 'asdsadf';

          var dataId = element.getAttribute( 'data-id' );
          var dataVersion = element.getAttribute( 'data-version' );
          var dataName = element.getAttribute( 'data-name' );
          var dataMain = element.getAttribute( 'data-main' );

          element.setAttribute( 'data-status', 'loading' );

          // Register Path.
          getOwn( contexts, '_' ).config.paths[ element.getAttribute( 'data-id' ) ] = element.getAttribute( 'data-main' );

          // Include as Dependency.
          getOwn( contexts, '_' ).config.deps.push( element.getAttribute( 'data-id' ) );

        }

      } );

    } );

  }

  /**
   * The function that handles definitions of modules. Differs from
   * require() in that a string for the module should be the first argument,
   * and the function to execute after dependencies are loaded should
   * return a value to define the module corresponding to the first argument's
   * name.
   */
  define = function define( name, deps, callback ) {
    var node, context;

    //Allow for anonymous modules
    if( typeof name !== 'string' ) {
      //Adjust args appropriately
      callback = deps;
      deps = name;
      name = null;
    }

    //This module may not have dependencies
    if( !isArray( deps ) ) {
      callback = deps;
      deps = null;
    }

    //If no name, and callback is a function, then figure out if it a
    //CommonJS thing with dependencies.
    if( !deps && isFunction( callback ) ) {
      deps = [];
      //Remove comments from the callback string,
      //look for require calls, and pull them into the dependencies,
      //but only if there are function args.
      if( callback.length ) {
        callback.toString().replace( commentRegExp, '' ).replace( cjsRequireRegExp, function( match, dep ) {
          deps.push( dep );
        } );

        //May be a CommonJS thing even without require calls, but still
        //could use exports, and module. Avoid doing exports and module
        //work though if it just needs require.
        //REQUIRES the function to expect the CommonJS variables in the
        //order listed below.
        deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat( deps );
      }
    }

    //If in IE 6-8 and hit an anonymous define() call, do the interactive
    //work.
    if( useInteractive ) {
      node = currentlyAddingScript || getInteractiveScript();
      if( node ) {
        if( !name ) {
          name = node.getAttribute( 'data-requiremodule' );
        }
        context = contexts[node.getAttribute( 'data-requirecontext' )];
      }
    }

    //Always save off evaluating the def call until the script onload handler.
    //This allows multiple modules to be in a file without prematurely
    //tracing dependencies, and allows for anonymous module support,
    //where the module name is not known until the script onload event
    //occurs. If no context, use the global queue, and get it processed
    //in the onscript load callback.
    (context ? context.defQueue : globalDefQueue).push( [name, deps, callback] );
  };

  define.amd = {
    jQuery: true
  };

  /**
   * Executes the text. Normally just uses eval, but can be modified
   * to use a better, environment-specific call. Only used for transpiling
   * loader plugins, not for plain JS modules.
   * @param {String} text the text to execute/evaluate.
   */
  req.exec = function( text ) {
    /*jslint evil: true */
    return eval( text );
  };

  define( 'udx', udxBaseModule.create );

  //Set up with config info.
  req( cfg );

}( this ));
