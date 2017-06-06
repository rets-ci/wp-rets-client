// =============================================================================
// JS/X-BODY.JS
// -----------------------------------------------------------------------------
// Site specific functionality needed before the closing </body> tag.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Imports
//   02. Anchors
//   03. Library Initialization
// =============================================================================

// Imports
// =============================================================================

// =include "vendor/hoverintent.js"
// =include "vendor/isotope.js"
// =include "vendor/perfect-scrollbar.js"
// =include "inc/x-body-*.js"

jQuery(function($){

  if ( ! window.csGlobal ) {
    return;
  }

  // Library Initialization
  // ===========================================================================

  window.csGlobal.particle.setup();

  window.csGlobal.stem( {
    positioning: true,
    interaction: {
      selectors: ['.x-menu-inline .menu-item-has-children', '.x-menu-dropdown .menu-item-has-children'],
      beforeActivate: function( el ) {
        window.csGlobal.particle.activateAnchor($(el).find('a:first')[0])
      },
      beforeDeactivate: function( el ) {
        window.csGlobal.particle.deactivateAnchor($(el).find('a:first')[0])
      },
      deactivateChild: function( el ) {
        window.csGlobal.particle.deactivateAnchor($(el).find('a:first')[0]);
      }
    }
  });

  window.csGlobal.collapse( {
    contentSelector: 'ul.sub-menu',
    isLinked: function( el ) {
      // Return true/false for if you want neighboring items to close
      // when an item is toggled
      //$(el).closest('.x-menu-collapsed');
      return true;
    },

    interaction: {
      selectors: ['.x-menu-collapsed [data-x-collapse]'],
      indicatingSelecter: 'a.x-anchor',
      beforeActivate: function( el ) {
        window.csGlobal.particle.activateAnchor($(el).find('a.x-anchor:first')[0])
      },
      beforeDeactivate: function( el ) {
        window.csGlobal.particle.deactivateAnchor($(el).find('a.x-anchor:first')[0])
      },
      deactivateChild: function( el ) {
        window.csGlobal.particle.deactivateAnchor($(el).find('a.x-anchor:first')[0])
      }
    }

  });

});
