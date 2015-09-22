/**
 * WP-AMD Plugin Handler.
 *
 */
(function( $ ) {

  /**
   * Console Debug
   *
   */
  function debug() {
    if( 'function' === typeof console.debug ) {
      console.debug.apply( console, arguments );
    }
  }

  var AceSettings = AceSettings || {};

  // constructor function
  var AceJavascriptEditor = function( config ) {
    // unpacks all of config and adds it to 'this'
    $.extend( this, config );

    // element = the textarea with the content to bring into the ace editor
    this.$elem = this.element;
    this.element = this.$elem.attr( 'id' );

    // set the container as the first parent if not provided in options
    this.$container = this.container ? $( this.container ) : this.$elem.parent();
    this.contWd = this.$container.width();
    this.loaded = false;

    // if tinymce shows up, assume we have visual mode enabled on this page
    this.tinymce = !!window.tinymce;

    if( this.onInit ) this.onInit.call( this );

  };

  var AceStylesheetEditor = function( config ) {
    // unpacks all of config and adds it to 'this'
    $.extend( this, config );

    // element = the textarea with the content to bring into the ace editor
    this.$elem = this.element;
    this.element = this.$elem.attr( 'id' );

    // set the container as the first parent if not provided in options
    this.$container = this.container ? $( this.container ) : this.$elem.parent();
    this.contWd = this.$container.width();
    this.loaded = false;
    // if tinymce shows up, assume we have visual mode enabled on this page
    this.tinymce = !!window.tinymce;

    if( this.onInit ) this.onInit.call( this );
  };

  AceJavascriptEditor.prototype = {

    load: function() {
      if( this.loaded ) return false;
      var self = this;
      // hide the textarea
      this.$elem.hide();
      // insert the editor div
      this.insertEditor();
      // init the ace editor
      this.editor = ace.edit( this.aceId );
      this.$editor = $( '#' + this.aceId );
      // set some ace properties
      this.setEditorProps();
      // set editor content - either content of textarea or tinymce
      this.setEditorContent();
      // make the container div resizable in y-direction
      this.containerResizable();
      // update the textarea when the content in the ace div changes
      this.editor.on( 'change', function() {
        self.synchronize.apply( self );
      });
      // trigger the initial resize event
      this.editor.resize( true );
      // execute callback if it exists
      this.loaded = true;
      if( this.onLoaded ) this.onLoaded.call( this );
    },

    insertEditor: function() {
      $( '<div id="' + this.aceId + '"></div>' ).css( {left: 0, top: 0, bottom: 0, right: 0, zIndex: 1 } ).insertAfter( this.$elem );
    },

    setEditorProps: function() {
      this.editor.setTheme( 'ace/theme/' + this.theme );
      this.editor.getSession().setMode( 'ace/mode/javascript' );

      this.editor.getSession().setUseSoftTabs( true );
      this.editor.getSession().setTabSize( 2 );
      this.editor.getSession().setWrapLimitRange();
      //this.editor.getSession().setUseWrapMode( false );
      //this.editor.getSession().setHighlightActiveLine( false );
      //this.editor.getSession().setShowPrintMargin( false );

    },

    setEditorContent: function() {
      this.editor.getSession().setValue( this.$elem.val() ); // seems like html, val, or text OK
    },

    containerResizable: function() {
      var self = this;
      this.$container.resizable( {handles: 's'} ).css( {position: 'relative', height: this.defaultHt, minHeight: '400px'} ).on( 'resize.aceEditorResize', function() {
        self.editor.resize( true );
      });
    },

    synchronize: function() {
      var val = this.editor.getValue();
      this.$elem.val( val ); // text, val, html ??
      if( this.tinymce && tinyMCE.get( this.element ) ) tinyMCE.get( this.element ).setContent( val );
    },

    destroy: function() {
      if( !this.loaded ) return false;
      this.$editor.remove();
      this.editor.destroy();
      this.$container.resizable( 'destroy' ).off( 'resize.aceEditorResize' ).css( {height: ''});
      this.$elem.show();
      this.loaded = false;
      if( this.onDestroy ) this.onDestroy.apply( this, arguments );
    }

  };

  AceStylesheetEditor.prototype = {

    load: function() {
      if( this.loaded ) return false;
      var self = this;
      // hide the textarea
      this.$elem.hide();
      // insert the editor div
      this.insertEditor();
      // init the ace editor
      this.editor = ace.edit( this.aceId );
      this.$editor = $( '#' + this.aceId );
      // set some ace properties
      this.setEditorProps();
      // set editor content - either content of textarea or tinymce
      this.setEditorContent();
      // make the container div resizable in y-direction
      this.containerResizable();
      // update the textarea when the content in the ace div changes
      this.editor.on( 'change', function() {
        self.synchronize.apply( self );
      });
      // trigger the initial resize event
      this.editor.resize( true );
      // execute callback if it exists
      this.loaded = true;
      if( this.onLoaded ) this.onLoaded.call( this );
    },

    insertEditor: function() {
      $( '<div id="' + this.aceId + '"></div>' ).css( {left: 0, top: 0, bottom: 0, right: 0, zIndex: 1 } ).insertAfter( this.$elem );
    },

    setEditorProps: function() {
      this.editor.setTheme( 'ace/theme/' + this.theme );
      this.editor.getSession().setMode( 'ace/mode/css' );

      this.editor.getSession().setUseSoftTabs( true );
      this.editor.getSession().setTabSize( 2 );
      this.editor.getSession().setWrapLimitRange();

    },

    setEditorContent: function() {
      this.editor.getSession().setValue( this.$elem.val() ); // seems like html, val, or text OK
    },

    containerResizable: function() {
      var self = this;
      this.$container.resizable( {handles: 's'} ).css( {position: 'relative', height: this.defaultHt, minHeight: '400px'} ).on( 'resize.aceEditorResize', function() {
        self.editor.resize( true );
      });
    },

    synchronize: function() {
      var val = this.editor.getValue();
      this.$elem.val( val ); // text, val, html ??
      if( this.tinymce && tinyMCE.get( this.element ) ) tinyMCE.get( this.element ).setContent( val );
    },

    destroy: function() {
      if( !this.loaded ) return false;
      this.$editor.remove();
      this.editor.destroy();
      this.$container.resizable( 'destroy' ).off( 'resize.aceEditorResize' ).css( {height: ''});
      this.$elem.show();
      this.loaded = false;
      if( this.onDestroy ) this.onDestroy.apply( this, arguments );
    }

  };

  // jquery plugin for ace editor
  // gives us an entry point for method calls if needed in the future
  $.fn.AceJavascriptEditor = function( option, value ) {
    debug( 'wp-amd', 'AceJavascriptEditor' );

    option = option || null;

    var data = $( this ).data( 'AceEditor' );

    // if data exists (has been instantiated) and calling a public method
    if( data && typeof option == 'string' && data[option] ) {
      data[option]( value || null );
      // if no data, then instantiate the plugin
    } else if( !data ) {
      return this.each( function() {

        $( this ).data( 'AceEditor', new AceJavascriptEditor( $.extend({
          element: $( this ),
          aceId: 'ace-editor',
          theme: 'wordpress',
          defaultHt: '600px',
          container: false
        }, option ) ) );


        $( this ).attr( 'data-editor-status', 'ready' );

      });
      // else, throw jquery error
    } else {
      $.error( 'Method "' + option + '" does not exist on AceEditor!' );
    }

  };

  $.fn.AceStylesheetEditor = function( option, value ) {
    debug( 'wp-amd', 'AceStylesheetEditor' );

    option = option || null;
    var data = $( this ).data( 'AceEditor' );

    // if data exists (has been instantiated) and calling a public method
    if( data && typeof option == 'string' && data[option] ) {
      data[option]( value || null );
      // if no data, then instantiate the plugin
    } else if( !data ) {
      return this.each( function() {

        $( this ).data( 'AceEditor', new AceStylesheetEditor( $.extend({
          element: $( this ),
          aceId: 'ace-editor',
          theme: 'wordpress',
          defaultHt: '600px',
          container: false
        }, option ) ) );

        $( this ).attr( 'data-editor-status', 'ready' );

      });
      // else, throw jquery error
    } else {
      $.error( 'Method "' + option + '" does not exist on AceEditor!' );
    }

  };

  jQuery( document ).ready( function( $ ) {
    console.debug( 'wp-amd', 'Ready.' );

    var editor = {};

    /**
     *
     * @author potanin@UD
     * @param response
     */
    function ajaxCallback( response ) {
      debug( 'wp-amd', 'The server responded', response );

      var ajaxMessage = jQuery( 'h2 span.ajax-message' );

      if( response.ok ) {
        ajaxMessage.removeClass( 'success' ).addClass( 'error' );
      } else {
        ajaxMessage.removeClass( 'error' ).addClass( 'success' );
      }

      ajaxMessage.show().text( response.message || 'Unknown error.' ).fadeIn( 400, function onceDisplayed() {
        debug( 'wp-amd', 'Callback message displayed.' );
      });

    }

    /**
     * Save Script Dynamicslly
     *
     * author potanin@UD
     * @returns {boolean}
     */
    function saveScript() {
      debug( 'wp-amd', 'Saving script asset.' );

      // JavaScript failure fallback.
      $( '#global-javascript' ).val( editor.getValue() );

      var _dependency = [];

      jQuery( '[data-amd-dependency]:checked' ).each( function eachDependency() {
        _dependency.push( jQuery(this).attr('value') );
      });

      jQuery.post( ajaxurl, {
        action: '/amd/v1/asset',
        type: 'script',
        data: editor.getValue(),
        dependency: _dependency
      }, ajaxCallback );

      return false;

    }

    /**
     *
     * @author potanin@UD
     * @returns {boolean}
     */
    function saveStyle() {
      debug( 'wp-amd', 'Saving CSS asset.' );

      // JavaScript failure fallback.
      $( '#global-stylesheet' ).val( editor.getValue() );

      var _dependency = [];

      jQuery( '[data-amd-dependency]:checked' ).each( function eachDependency() {
        _dependency.push( jQuery(this).attr('value') );
      });

      jQuery.post( ajaxurl, {
        action: '/amd/v1/asset',
        type: 'style',
        data: editor.getValue(),
        dependency: _dependency
      }, ajaxCallback );

      return false;

    }

    $( '#global-javascript' ).AceJavascriptEditor({
      // overwrites the default
      setEditorContent: function() {
        var value = this.$elem.val();
        editor = this.editor;
        this.editor.getSession().setValue( value );
      },
      onInit: function() {
        this.load();
      },
      onLoaded: function() {

      },
      onDestroy: function( e ) {
        // console.log( this.editor )
      }
    });

    $( '#global-stylesheet' ).AceStylesheetEditor( {
      // overwrites the default
      setEditorContent: function() {
        var value = this.$elem.val();
        editor = this.editor;
        this.editor.getSession().setValue( value );
      },
      onInit: function() {
        this.load();
      },
      onLoaded: function() {

      },
      onDestroy: function( e ) {
        // console.log( this.editor )
      }
    });

    $( '#global-javascript-form' ).submit( saveScript );

    $( '#global-stylesheet-form' ).submit( saveStyle );

  });

})( jQuery );


