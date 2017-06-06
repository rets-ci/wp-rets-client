// =============================================================================
// JS/SRC/SITE/INC/X-BODY-BAR.JS
// -----------------------------------------------------------------------------
// Site scripts.
// =============================================================================

// =============================================================================
// TABLE OF CONTENTS
// -----------------------------------------------------------------------------
//   01. Bars
// =============================================================================

// Bars
// =============================================================================

jQuery(function($){

  if ( ! window.csGlobal ) {
    return;
  }

  // Setup
  // -----
  var $window   = $(window);
  var $body     = $('body');
  var $site     = $('.x-site');
  var $masthead = $('.x-masthead');
  var $colophon = $('.x-colophon');
  var $adminBar       = $('#wpadminbar');
  var fixedClasses = $body.hasClass('x-boxed-layout-active') ? 'x-bar-fixed x-container max width' : 'x-bar-fixed';

  var adminBarOffset;
  detectAdminBarOffset();
  $window.on('resize',detectAdminBarOffset);

  function detectAdminBarOffset() {
    adminBarOffset  = ( $adminBar.css('position') === 'fixed' ) ? $adminBar.outerHeight() : 0;
  }

  $window.on('scroll resize', updateStickyBars );

  // Interpolation functions

  var shrinkInterpolate = lerp;//easeOutQuart;
  var slideInterpolate = lerp;//easeOutQuart;

  function easeOutQuart( a, b, f ) {
    return jQuery.easing.easeOutQuart(null, f, a, b - a, 1 )
  }

  // Begining, End, Percect complete
  function lerp(a, b, f) {
    return a + f * (b - a);
  }


  // Initialize Bars
  // ---------------

  window.csGlobal.everinit( '[data-x-bar]', function(el) {

    var barData    = $(el).data('x-bar');

    if ( 'top' === barData.region || 'bottom' === barData.region ) {
      computeFixedBar(el);
      $window.on('resize',function(){
        computeFixedBar(el);
      })
    }

    setTimeout(function() {
      if ( barData.sticky && 'top' === barData.region ) {
        setupStickyBar( el, barData);
      }
    },0);

  });



  // Compute width property for fixed bars
  // -------------------------------------

  function computeFixedBar(el) {

    var style = window.getComputedStyle(el);

    if ( 'fixed' !== style.position ) {
      $(el).css({width: '', 'max-width': ''});
      return;
    }

    var margins = [];
    if ( ! cssValIsZero(style['margin-left']) ) {
      margins.push(style['margin-left'])
    }
    if ( ! cssValIsZero(style['margin-right']) ) {
      margins.push(style['margin-right'])
    }

    var marginString = '';
    if ( margins.length > 0 ) {
      marginString = margins.length === 1 ? margins[0] : '(' + margins.join(' + ') + ')';
    }

    var combinedSpacerWidths = 0;

    $('.x-bar-space-v').each(function(){
      combinedSpacerWidths += $(this).width();
    });

    var width = '';
    if ( combinedSpacerWidths > 0 ) {
      width += ' - ' + combinedSpacerWidths + 'px';
    }

    if ( marginString ) {
      width += ' - ' + marginString;
    }

    var update = {
      'width': width ? 'calc(100%' + width + ')' : '100%',
    }

    var maxWidth = window.getComputedStyle($('.x-site')[0])['max-width'];

    if ( 'none' !== maxWidth ) {
      update['max-width'] = marginString ? 'calc(' + maxWidth + ' - ' + marginString + ')' : maxWidth
    }

    $(el).css(update);

  }

  function cssValIsZero( val ) {
    return 0 === val.trim().split(' ').filter( function( part ) {
      return ! part.match(/^0[a-zA-Z%]+|0$|none$/);
    }).length;
  }


  // Manage stacking and triggering of sticky bars
  // ---------------------------------------------

  function setupStickyBar(el, barData) {
    var $bar = $(el);
    var $barContent = $bar.find('.x-bar-content');
    var initialHeight = $bar.height();
    var shrinkHeight = isNaN( barData.shrink ) ? initialHeight : initialHeight * barData.shrink;

    var offsetMod = Number.parseInt(barData.triggerOffset);
    offsetMod = isNaN( offsetMod ) ? 0 : offsetMod;


    var $triggerElement = false;
    if ( barData.triggerSelector ) {
      var $findTriggerElement = $(barData.triggerSelector);
      if ( 0 !== $findTriggerElement.length ) {
        $triggerElement = $findTriggerElement.first();
      }
    }

    $bar.data('xBarSticky', {
      id: barData.id,
      $triggerElement: $triggerElement,
      offsetMod: offsetMod,
      keepMargin: barData.keepMargin,
      shrinkHeight: shrinkHeight,
      initialHeight: initialHeight,
      zStack: barData.zStack,
      hideInitially: barData.hideInitially
    } );

    $bar.data('xBarStickyTop', $bar.offset().top );
    $window.on('resize', updateOffsetTop );
    updateOffsetTop();

    function updateOffsetTop() {
      if ( ! $bar || $bar.hasClass('x-bar-fixed') ) return;
      $bar.data('xBarStickyTop', $bar.offset().top );
    }

  }

  function updateStickyBars() {

    var st = $window.scrollTop() + adminBarOffset;
    var stackedHeight = 0;
    var minOffset = 0;
    var barIndex = 0;
    var canFix = true; // Flag used to ensure bars are fixed in sequence

    $('.x-bar.x-bar-top').each( function(index) {
      var $bar = $(this);
      var data = $bar.data('xBarSticky');
      if ( data ) {
        updateBar( $bar, data );
        barIndex++;
      }
    });

    function updateBar( $bar, barData ) {

      var $space = $('.' + barData.id + '.x-bar-space');
      var $content = $bar.find('.x-bar-content');
      var baseOffset = barIndex > 0 ? minOffset + barData.shrinkHeight : 0;
      var margin = Number.parseFloat($bar.css('margin-top'));
      var marginOffset = barData.keepMargin ? margin : 0;

      var offsetTop = $bar.data('xBarStickyTop');
      var triggerOffset = 0;
      if ( barData.$triggerElement ) {
        triggerOffset += ( barData.$triggerElement.offset().top - adminBarOffset );
      }

      triggerOffset = Math.max( offsetTop, triggerOffset);

      var snap = ( Math.max( baseOffset, triggerOffset ) - marginOffset ) + barData.offsetMod;


      var offset = snap - stackedHeight;

      if ( canFix && st > offset ) { fix(); } else { unfix(); }

      function fix() {
        canFix = true;
        var slidePosition = null;

        var height = barData.shrinkHeight;
        if ( st <= offsetTop + barData.initialHeight && ! barData.hideInitially ) {
          height = shrinkInterpolate(
            barData.initialHeight,
            barData.shrinkHeight,
            Math.min(Math.max(0, st - offset), barData.initialHeight) / barData.initialHeight
          );
        } else {
          slidePosition = slideInterpolate(0,100,Math.min(Math.max(0, st - offset), height) / height);
        }

        var update = {
          top:       adminBarOffset + stackedHeight,
          height: height
        };

        if ( ! barData.keepMargin && margin ) {
          update.top -= margin;
        }

        if ( slidePosition ) {
          update.transform = 'translate3d( 0, ' + ((100 - slidePosition) * -1).toPrecision(2) + '%' + ', 0)';
        }

        minOffset = snap;

        if ( ! barData.zStack ) {
          stackedHeight += update.height;
          if ( barData.keepMargin && margin ) {
            stackedHeight += margin;
          }
          minOffset += update.height;
        }

        if ( barData.hideInitially ) {
          update.visibility = '';
        }

        $content.css({height: update.height});
        $bar.css(update).addClass(fixedClasses);
        computeFixedBar($bar[0]);
        $space.show();

      }

      function unfix() {
        canFix = false;

        var update = {
          top:       '',
          transform: '',
          height:    '',
          width:     '',
        }

        if ( barData.hideInitially ) {
          update.visibility = 'hidden';
        }

        $bar.css(update).removeClass(fixedClasses);
        $content.css({height: ''});
        $space.hide();

      }

    }

  }

});
