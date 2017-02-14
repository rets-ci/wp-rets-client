/**
 * Script Ran within iFrame when using Customizer.
 * Logic here is used to interact with the site preview in real-time.
 *
 * @author peshkov@ud
 */
 
( function( $, args ) {

  /**
   * Create Element for Hot Swapping Styles
   */
  function createStyleContainer( key ) {
    // console.log( 'createStyleContainer' );
    if( $( '#lib_wp_theme_customizer_' + key ).length ) {
      return null;
    }
    var _element = $( '<style type="text/css" id="lib_wp_theme_customizer_' + key + '"></style>' );
    // Create New Element and add to <head>
    $( 'head' ).append( _element );
    //console.log( '_element', _element );
  }

  /**
   * Update Dynamic Styles
   *
   * @param style
   */
  function updateStyles( c, style ) {
    // Oue dynamically generated style element
    if ( c && c.length > 0 ) {
      var v = '';
      var mod_name = c[0].mod_name;
      if( style && style.length > 0 ) {
        for ( var i in c ) {
          v += c[ i ].selector + ' { ' + c[ i ].style + ':' + c[ i ].prefix + style + c[ i ].postfix + ' !important; } ';
        }
        if ( typeof c[0].media_query === 'string' && c[0].media_query.trim() !== '' ) {
          v = '@media ' + c[0].media_query + ' { ' + v + ' } ';
        }
      }
      $( 'head #lib_wp_theme_customizer_' + mod_name ).text( v );
    }
    
  }
  
  /**
   * Update Image
   *
   * @param style
   */
  function updateImage( c, src ) {
    // Oue dynamically generated style element
    if( src && src.length > 0 ) {
      for ( var i in c ) {
        if ( c[ i ].selector.length > 0 ) {
          $( c[ i ].selector ).attr( 'src', src );
        }
      }
    }
  }
  
  // Update Styles Live.
  $.each( args.settings, function( i, s ) {
    //console.log( s );
    
    switch( s.control ) {
    
      case 'image':
        wp.customize( s.key, function( src ) {
          // Listen for Changes.
          src.bind( function ( src ) {
            //console.log( 'imageChanged', s.key, src );
            updateImage( s.css, src );
          });
        });
        break;
        
      default:
        wp.customize( s.key, function( style ) {
          var intent;
          createStyleContainer( s.key );
          // Listen for Changes.
          style.bind( function ( style ) {
            //console.log( 'stylesChanged', s.key, style );
            // Clear Intent
            window.clearTimeout( intent );
            // Pause for Intent Check
            intent = window.setTimeout( function() {
              updateStyles( s.css, style );
            }, 200 );
          });
        });
        break;
    
    }
    
  } );

} )( jQuery, _lib_wp_theme_customizer );

