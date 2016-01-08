/**
 * Script need to be improve
 * Author: Md. Alimuzzaman Alim
 * 
 */

(function($){

  // Defining our jQuery plugin

  $.fn.wpp_rs_lb = function(prop){
    var lb = this;
    // Default parameters

    var options = $.extend({
      galleryTop:[],
      galleryThumbs:[],
    },prop);
    var originalSlidesPerView = options.galleryTop.params.slidesPerView;
    //Click event on element
    lb.on('click', '.gallery-top .swiper-slide.swiper-slide-active img', function(e){
      if(!lb.hasClass('lightbox')){
        showLightbox();
      }
      else{ // in lightbox zoom
        if(!$(this).parent().hasClass('zoomEnabled')){
          _enableZoom(options.galleryTop);
          $(this).parent().addClass('zoomEnabled');//swiper-no-swiping 
        }
      }
    });

    //Click event on element
    lb.on('click', '.modal-header .close', function(e){
      hideLightbox();
    });

    setViewOriginalHref(options.galleryTop);

    //Click event on element
    options.galleryTop.on('slideChangeStart', function(s){
      setViewOriginalHref(s);
    });

    //Swipe down to close
    options.galleryTop.on('touchEnd', function(s, e){
      var touches = s.touches;
      var diff = touches.currentY - touches.startY;
      if(diff>100){
        e.preventDefault();
        setTimeout(function() {
          hideLightbox();
        },50);
        return false;
      }
    });


    var _enableZoom = (function() {
      var scroller = undefined;

      return function(swiper) {
        if(scroller !== undefined) {
          scroller.destroy();
        }
        scroller = new IScroll($(swiper.container).find('.swiper-slide-active')[0], {
                                hideScrollbar: true,
                                zoom: true,
                                scrollX: true,
                                scrollY: true,
                                mouseWheel: true,
                                wheelAction: 'zoom',
                              });

        scroller.on('zoomEnd', function(e) {
          var slide = $(this.wrapper);

          if(parseInt(this.scale) == 1) {
            slide.removeClass('swiper-no-swiping');
          } else {
            slide.addClass('swiper-no-swiping');
          }
        });

        scroller.on('zoomStart', function(e) {
          var slide = $(this.wrapper);
          if(e.type === 'touchstart') {
            slide.addClass('swiper-no-swiping');
            //this.originX = Math.abs(e.touches[0].pageX + e.touches[1].pageX) / 2 - this.x;
          } else if(e.type === 'touchend') {
            slide.removeClass('swiper-no-swiping');
            this.wrapperOffsetLeft = 0;
          }
        });
      };
    })();


    function handleMoveImage(s, e){
      console.log("s.touches");
      console.log(s.touches);
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    function setViewOriginalHref(s){
      var activeIndex = s.activeIndex;
      var href = $(s.slides[activeIndex]).data('href');
      lb.find('.viewOriginal').attr('href', href);
    }

    function showLightbox(){
      var activeIndex = options.galleryTop.activeIndex;
      options.galleryTop.params.slidesPerView = 1;
      options.galleryTop.params.noSwiping = true;

      lb.addClass('lightbox');
      $('#wpadminbar').hide();

      options.galleryTop.update();
      setTimeout(function() {
          options.galleryTop.onResize();
      },150);
      options.galleryTop.slideTo(activeIndex, 0);
      if(options.galleryThumbs.onResize)
        options.galleryThumbs.onResize();

      $(document).on('keydown', lbHandleKeyboard);
      $('body').css({'overflow':'hidden'});
    }
    
    function hideLightbox(){
      var activeIndex = options.galleryTop.activeIndex;

      options.galleryTop.params.slidesPerView = originalSlidesPerView;

      lb.removeClass('lightbox');
      $('#wpadminbar').show();

      options.galleryTop.destroy(false, true);
      options.galleryTop.init();
      setTimeout(function() {
          options.galleryTop.onResize();
      },150);
      options.galleryTop.update(true);
      options.galleryTop.slideTo(activeIndex, 0);
      options.galleryTop.enableKeyboardControl();

      if(options.galleryThumbs.onResize)
        options.galleryThumbs.onResize();

      $(document).off('keydown', lbHandleKeyboard);
      $('body').css({'overflow':''});
    }
    /**
     * Add styles to the html markup
     */
     function lbHandleKeyboard(e){
      switch(e.keyCode){
        case 27:
          hideLightbox();
          if (e.preventDefault) e.preventDefault();
          break;
      }
    }
    

    return this;
  };
  
})(jQuery);
