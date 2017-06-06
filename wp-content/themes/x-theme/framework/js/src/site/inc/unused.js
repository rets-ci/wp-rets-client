// Helper Function: Toggle Toggle
  // ------------------------------

  function toggleToggle( $toggle ) {

    var data              = $toggle.data('x-toggle');
    var $target           = $(data.target);
    var thisAnimation     = data.type;
    var targetIsModal     = false;
    var targetIsOffCanvas = false;

    if ( $target.length > 0 ) {
      targetIsModal     = $target.attr('class').indexOf('x-modal') > -1;
      targetIsOffCanvas = $target.attr('class').indexOf('x-off-canvas') > -1;
    }


    // Animations
    // ----------

    if ( thisAnimation ) {

      var thisAnimationPhases  = getAnimationPhases(thisAnimation);
      var thisAnimationPhaseMS = 650 / 2;


      // Burger
      // ------

      if ( thisAnimation.indexOf('burger') > -1 ) {

        var $burger    = $toggle.find('.x-toggle-burger');
        var $patty     = $toggle.find('.x-toggle-burger-patty');
        var $bunTop    = $toggle.find('.x-toggle-burger-bun-top');
        var $bunBottom = $toggle.find('.x-toggle-burger-bun-bottom');

        $burger.css(thisAnimationPhases.p1.burger);
        $patty.css(thisAnimationPhases.p1.patty);
        $bunTop.css(thisAnimationPhases.p1.bunTop);
        $bunBottom.css(thisAnimationPhases.p1.bunBottom);

        if ( $toggle.hasClass(classActive) ) {

          setTimeout( function() {
            $burger.removeAttr('style');
            $patty.removeAttr('style');
            $bunTop.removeAttr('style');
            $bunBottom.removeAttr('style');
          }, thisAnimationPhaseMS );

        } else {

          setTimeout( function() {
            $burger.css(thisAnimationPhases.p2.burger);
            $patty.css(thisAnimationPhases.p2.patty);
            $bunTop.css(thisAnimationPhases.p2.bunTop);
            $bunBottom.css(thisAnimationPhases.p2.bunBottom);
          }, thisAnimationPhaseMS );

        }

      }


      // Grid
      // ----

      else if ( thisAnimation.indexOf('grid') > -1 ) {

        var $grid   = $toggle.find('.x-toggle-grid');
        var $gridTL = $toggle.find('.x-toggle-grid-tl');
        var $gridT  = $toggle.find('.x-toggle-grid-t');
        var $gridTR = $toggle.find('.x-toggle-grid-tr');
        var $gridL  = $toggle.find('.x-toggle-grid-l');
        var $gridC  = $toggle.find('.x-toggle-grid-c');
        var $gridR  = $toggle.find('.x-toggle-grid-r');
        var $gridBL = $toggle.find('.x-toggle-grid-bl');
        var $gridB  = $toggle.find('.x-toggle-grid-b');
        var $gridBR = $toggle.find('.x-toggle-grid-br');

        $grid.css(thisAnimationPhases.p1.grid);
        $gridTL.css(thisAnimationPhases.p1.gridTL);
        $gridT.css(thisAnimationPhases.p1.gridT);
        $gridTR.css(thisAnimationPhases.p1.gridTR);
        $gridL.css(thisAnimationPhases.p1.gridL);
        $gridC.css(thisAnimationPhases.p1.gridC);
        $gridR.css(thisAnimationPhases.p1.gridR);
        $gridBL.css(thisAnimationPhases.p1.gridBL);
        $gridB.css(thisAnimationPhases.p1.gridB);
        $gridBR.css(thisAnimationPhases.p1.gridBR);

        if ( $toggle.hasClass(classActive) ) {

          setTimeout( function() {
            $grid.removeAttr('style');
            $gridTL.removeAttr('style');
            $gridT.removeAttr('style');
            $gridTR.removeAttr('style');
            $gridL.removeAttr('style');
            $gridC.removeAttr('style');
            $gridR.removeAttr('style');
            $gridBL.removeAttr('style');
            $gridB.removeAttr('style');
            $gridBR.removeAttr('style');
          }, thisAnimationPhaseMS );

        } else {

          setTimeout( function() {
            $grid.css(thisAnimationPhases.p2.grid);
            $gridTL.css(thisAnimationPhases.p2.gridTL);
            $gridT.css(thisAnimationPhases.p2.gridT);
            $gridTR.css(thisAnimationPhases.p2.gridTR);
            $gridL.css(thisAnimationPhases.p2.gridL);
            $gridC.css(thisAnimationPhases.p2.gridC);
            $gridR.css(thisAnimationPhases.p2.gridR);
            $gridBL.css(thisAnimationPhases.p2.gridBL);
            $gridB.css(thisAnimationPhases.p2.gridB);
            $gridBR.css(thisAnimationPhases.p2.gridBR);
          }, thisAnimationPhaseMS );

        }

      }


      // More
      // ----

      else if ( thisAnimation.indexOf('more') > -1 ) {

        var $more       = $toggle.find('.x-toggle-more');
        var $moreStart  = $toggle.find('.x-toggle-more-start');
        var $moreMiddle = $toggle.find('.x-toggle-more-middle');
        var $moreEnd    = $toggle.find('.x-toggle-more-end');

        $more.css(thisAnimationPhases.p1.more);
        $moreStart.css(thisAnimationPhases.p1.moreStart);
        $moreMiddle.css(thisAnimationPhases.p1.moreMiddle);
        $moreEnd.css(thisAnimationPhases.p1.moreEnd);

        if ( $toggle.hasClass(classActive) ) {

          setTimeout( function() {
            $more.removeAttr('style');
            $moreStart.removeAttr('style');
            $moreMiddle.removeAttr('style');
            $moreEnd.removeAttr('style');
          }, thisAnimationPhaseMS );

        } else {

          setTimeout( function() {
            $more.css(thisAnimationPhases.p2.more);
            $moreStart.css(thisAnimationPhases.p2.moreStart);
            $moreMiddle.css(thisAnimationPhases.p2.moreMiddle);
            $moreEnd.css(thisAnimationPhases.p2.moreEnd);
          }, thisAnimationPhaseMS );

        }

      }

    }


    // Toggle Active Classes
    // ---------------------

    if ( ! targetIsModal || ! targetIsOffCanvas ) {
      $toggle.toggleClass(classActive);
    }

    $target.toggleClass(classToggled);


    // Trigger Child Animations
    // ------------------------

    if ( $target.hasClass(classToggled) ) {
      $target.find('[data-x-anim]').trigger('xAnimInit');
    }

  }


  // Helper Function: Get Animation Phases
  // -------------------------------------

  function getAnimationPhases( animation ) {

    var data = {
      'burger-1' : {
        'p1' : {
          'burger'    : { '' : '' },
          'patty'     : { 'opacity' : 0 },
          'bunTop'    : { 'transform' : 'translate3d(0, 0, 0)' },
          'bunBottom' : { 'transform' : 'translate3d(0, 0, 0)' }
        },
        'p2' : {
          'burger'    : { '' : '' },
          'patty'     : { '' : '' },
          'bunTop'    : { 'transform' : 'translate3d(0, 0, 0) rotate(45deg)' },
          'bunBottom' : { 'transform' : 'translate3d(0, 0, 0) rotate(-45deg)' }
        }
      },
      'burger-2' : {
        'p1' : {
          'burger'    : { 'transform' : 'translate3d(0, 0, 0)' },
          'patty'     : { 'opacity' : 0 },
          'bunTop'    : { 'transform' : 'translate3d(0, 0, 0)' },
          'bunBottom' : { 'transform' : 'translate3d(0, 0, 0)' }
        },
        'p2' : {
          'burger'    : { 'transform' : 'translate3d(0, 0, 0) rotate(180deg)' },
          'patty'     : { '' : '' },
          'bunTop'    : { 'transform' : 'translate3d(0, 0, 0) rotate(45deg)' },
          'bunBottom' : { 'transform' : 'translate3d(0, 0, 0) rotate(-45deg)' }
        }
      },
      'burger-3' : {
        'p1' : {
          'burger'    : { 'transform' : 'translate3d(0, 0, 0) rotate(-90deg)' },
          'patty'     : { 'opacity' : 0 },
          'bunTop'    : { 'transform' : 'translate3d(0, 0, 0)' },
          'bunBottom' : { 'transform' : 'translate3d(0, 0, 0)' }
        },
        'p2' : {
          'burger'    : { 'transform' : 'translate3d(0, 0, 0) rotate(-180deg)' },
          'patty'     : { '' : '' },
          'bunTop'    : { 'transform' : 'translate3d(0, 0, 0) rotate(45deg)' },
          'bunBottom' : { 'transform' : 'translate3d(0, 0, 0) rotate(-45deg)' }
        }
      },
      'grid-1' : {
        'p1' : {
          'grid'   : { 'transform' : 'translate3d(0, 0, 0) rotate(135deg)' },
          'gridTL' : { 'transform' : '' },
          'gridT'  : { 'transform' : '' },
          'gridTR' : { 'transform' : '' },
          'gridL'  : { 'transform' : '' },
          'gridC'  : { '' : '' },
          'gridR'  : { 'transform' : '' },
          'gridBL' : { 'transform' : '' },
          'gridB'  : { 'transform' : '' },
          'gridBR' : { 'transform' : '' }
        },
        'p2' : {
          'grid'   : { 'transform' : 'translate3d(0, 0, 0) rotate(135deg)', 'border-radius' : '0' },
          'gridTL' : { 'transform' : 'translate3d(0, -2em, 0)' },
          'gridT'  : { 'transform' : 'translate3d(0, -1em, 0)' },
          'gridTR' : { 'transform' : 'translate3d(2em, 0, 0)' },
          'gridL'  : { 'transform' : 'translate3d(-1em, 0, 0)' },
          'gridC'  : { '' : '' },
          'gridR'  : { 'transform' : 'translate3d(1em, 0, 0)' },
          'gridBL' : { 'transform' : 'translate3d(-2em, 0, 0)' },
          'gridB'  : { 'transform' : 'translate3d(0, 1em, 0)' },
          'gridBR' : { 'transform' : 'translate3d(0, 2em, 0)' }
        }
      },
      'grid-2' : {
        'p1' : {
          'grid'   : { 'transform' : 'translate3d(0, 0, 0)', 'border-radius' : '0' },
          'gridTL' : { 'transform' : 'translate3d(0, -2em, 0)' },
          'gridT'  : { 'transform' : 'translate3d(0, -1em, 0)' },
          'gridTR' : { 'transform' : 'translate3d(2em, 0, 0)' },
          'gridL'  : { 'transform' : 'translate3d(-1em, 0, 0)' },
          'gridC'  : { '' : '' },
          'gridR'  : { 'transform' : 'translate3d(1em, 0, 0)' },
          'gridBL' : { 'transform' : 'translate3d(-2em, 0, 0)' },
          'gridB'  : { 'transform' : 'translate3d(0, 1em, 0)' },
          'gridBR' : { 'transform' : 'translate3d(0, 2em, 0)' }
        },
        'p2' : {
          'grid'   : { 'transform' : 'translate3d(0, 0, 0) rotate(135deg)', 'border-radius' : '0' },
          'gridTL' : { 'transform' : 'translate3d(0, -2em, 0)' },
          'gridT'  : { 'transform' : 'translate3d(0, -1em, 0)' },
          'gridTR' : { 'transform' : 'translate3d(2em, 0, 0)' },
          'gridL'  : { 'transform' : 'translate3d(-1em, 0, 0)' },
          'gridC'  : { '' : '' },
          'gridR'  : { 'transform' : 'translate3d(1em, 0, 0)' },
          'gridBL' : { 'transform' : 'translate3d(-2em, 0, 0)' },
          'gridB'  : { 'transform' : 'translate3d(0, 1em, 0)' },
          'gridBR' : { 'transform' : 'translate3d(0, 2em, 0)' }
        }
      },
      'more-1' : {
        'p1' : {
          'more'       : { 'transform' : 'translate3d(0, 0, 0) rotate(90deg)' },
          'moreStart'  : { 'transform' : 'none' },
          'moreMiddle' : { 'opacity' : '1' },
          'moreEnd'    : { 'transform' : 'none' }
        },
        'p2' : {
          'more'       : { 'transform' : 'translate3d(0, 0, 0) rotate(90deg)' },
          'moreStart'  : { 'transform' : 'translate3d(0, 0, 0) scale(2)' },
          'moreMiddle' : { 'opacity' : '0' },
          'moreEnd'    : { 'transform' : 'translate3d(0, 0, 0) scale(4)' }
        }
      }
      // 'more-1' : {
      //   'p1' : {
      //     'more'       : { 'transform' : 'translate3d(0, 0, 0)', 'width' : '1em', 'height' : '1em' },
      //     'moreStart'  : { 'transform' : 'translate3d(0, 0, 0) rotate(-45deg)' },
      //     'moreMiddle' : { 'opacity' : 0 },
      //     'moreEnd'    : { 'transform' : 'translate3d(0, 0, 0) rotate(45deg)' }
      //   },
      //   'p2' : {
      //     'more'       : { 'transform' : 'translate3d(0, 0, 0) rotate(-90deg)', 'width' : '2.5em', 'height' : '0.25em' },
      //     'moreStart'  : { 'transform' : 'translate3d(0, 0, 0) rotate(-45deg)' },
      //     'moreMiddle' : { 'opacity' : 0 },
      //     'moreEnd'    : { 'transform' : 'translate3d(0, 0, 0) rotate(45deg)' }
      //   }
      // }
    };

    return data[animation];

  }


  // =============================================================================
  // JS/SRC/SITE/INC/X-BODY-ANIM.JS
  // -----------------------------------------------------------------------------
  // Element animations
  // =============================================================================

  // =============================================================================
  // TABLE OF CONTENTS
  // -----------------------------------------------------------------------------
  //   01. Animation Functionality
  // =============================================================================

  // Animation Functionality
  // =============================================================================

  jQuery(document).ready(function($) {

    var $animations = $('[data-x-anim]');

    if ( $animations.length > 0 ) {

      $animations.each(function() {
        animateElement($(this));
      });

    }


    function animateElement( $el ) {

      var animData   = $el.data('x-anim');
      var dataType   = animData.type;
      var dataDelay  = animData.delay;
      var dataOffset = animData.offset;
      var runAnim    = function() {
        $el.delay(dataDelay).queue(function() {
          $el.removeClass('x-anim-hide').addClass(dataType + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
            $el.removeClass(dataType + ' animated');
          }).dequeue();
        });
      }

      if ( dataOffset === 'activeParent' ) {

        $el.on('xAnimInit', function() {
          runAnim();
        });

      } else {
        if ( window.csGlobal && window.csGlobal.waypoint ) {
          window.csGlobal.waypoint(el[0], runAnim, dataOffset );
        }
      }

    }

  });
