// =============================================================================
// JS/SRC/SITE/INC/X-BODY-SEARCH.JS
// -----------------------------------------------------------------------------
// Site scripts.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Search Scripts
// =============================================================================

// Search Scripts
// =============================================================================

jQuery(document).ready(function($) {

  // Variables
  // ---------

  var $body              = $('body');
  var dataSearch         = 'data-x-search';
  var searchForm         = '[' + dataSearch + ']';
  var searchButtons      = '[' + dataSearch + '] button';
  var searchButtonSubmit = '[' + dataSearch + '-submit]'
  var searchButtonClear  = '[' + dataSearch + '-clear]'
  var searchInput        = '[' + dataSearch + '] input';
  var searchChildren     = searchButtons + ', ' + searchInput;


  // Event: focusin focusout
  // -----------------------

  $body.on('focusin focusout', searchChildren, function(e) {

    var $parent = $(this).closest(searchForm)

    if ( e.type === 'focusout' && $parent.data('data-x-focus-search-down') ) {
      return;
    }

    $parent.data('data-x-focus-search-down', false);
    $parent.toggleClass('x-search-focused', e.type === 'focusin');

  });


  // Event: mousedown
  // ----------------

  $body.on('mousedown', searchForm, function(e) {

    if ( ! e.target.hasAttribute(dataSearch) ) {
      return;
    }

    var $this = $(this);

    $this.addClass('x-search-focused');
    $this.data('data-x-focus-search-down', true);

    setTimeout(function() {
      $this.find('input').focus();
    }, 0);

  });


  // Event: input
  // ------------

  $body.on('input', searchInput, function(e) {

    var $this   = $(this);
    var $parent = $this.closest(searchForm);

    if ( $this.val() !== '' ) {
      $parent.addClass('x-search-has-content');
    } else {
      $parent.removeClass('x-search-has-content');
    }

  });


  // Event: click
  // ------------

  $body.on('click', searchButtonSubmit, function(e) {

    var $parent = $(this).closest(searchForm);

    $parent.submit();

  });

  $body.on('click', searchButtonClear, function(e) {

    var $parent = $(this).closest(searchForm);

    $parent.find('input').val('').focus();
    $parent.removeClass('x-search-has-content');

  });

});
