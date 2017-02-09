/**
 * Bootstrap WordPress Theme
 *
 * - Scan meta tags for app:{key} overrides, update require config.
 * - Return method for data-requires="" attribute support.
 *
 */
define( 'udx.wp.theme', [ "module","require","exports"], function( module, localRequire, exports ) {
  console.debug( module.id, 'loaded' );

  if( document.getElementsByName( 'app:baseUrl' ).length ) {
    console.debug( module.id, 'baseUrl override detected' );
    require.config({baseUrl:document.getElementsByName( 'app:baseUrl' )[0].content});
  }

  if( document.getElementsByName( 'app:deps' ).length ) {
    console.debug( module.id, 'deps override detected' );
    require.config({deps: document.getElementsByName( 'app:deps' )[0].content.split( ',' )});
  }

  if( document.getElementsByName( 'app:jquery' ).length ) {
    console.debug( module.id, 'jquery override detected' );
    require.config({ paths: { jquery: document.getElementsByName( 'app:jquery' )[ 0 ].content } });
  }

  return function domnReady() {
    console.debug( module.id, 'dom:ready' );

    return this;

  };

});

