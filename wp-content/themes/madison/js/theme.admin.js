/**
 * Madison Administration
 *
 * This library will be delivered via UDX CDN and access will be restricted to authorized domains.
 *
 * @example
 *
 *      require( [ 'wpp.madison.admin' ], function onReady( library ) {
 *
 *        // Handle unauthorized domains.
 *        if( library instanceof Error ) { ... }
 *
 *
 *        console.log( 'wpp.madison loaded!' );
 *
 *      });
 *
 * @version 0.0.1
 * @cdn-url http://cdn.udx.io/wpp.madison.admin.js
 * @author potanin@UD
 */
define( 'wpp.madison.admin', function themeAdministration() {
  console.debug( 'wpp.madison.admin', 'initialized' );

  /**
   *
   */
  function checkUpdates() {}

  /**
   *
   */
  function verifyLicense() {}

  /**
   *
   */
  function configureDefaults() {}

  return {
    version: "0.0.1",
    checkUpdates: checkUpdates,
    configureDefaults: configureDefaults,
    verifyLicense: verifyLicense
  };
});