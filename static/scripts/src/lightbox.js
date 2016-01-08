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
    });

    //Click event on element
    lb.on('click', '.modal-header .close', function(e){
      hideLightbox();
    });

    setViewOriginalHref(options.galleryTop);

    //
    options.galleryTop.on('slideChangeStart', function(s){
      // Setting view originals link for current slide.
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

    function handleMoveImage(s, e){
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    }

    function setViewOriginalHref(s){
      var activeIndex = s.activeIndex;
      var href = $(s.slides[activeIndex]).data('src');
      lb.find('.viewOriginal').attr('href', href);
    }

    function showLightbox(){
      var activeIndex = options.galleryTop.activeIndex;
      options.galleryTop.params.slidesPerView = 1;
      options.galleryTop.params.noSwiping = true;

      loadFullImageLazy();
      lb.addClass('lightbox');
      $('#wpadminbar').hide();

      options.galleryTop.update();
      options.galleryTop.lazy.load();
      setTimeout(function() {
          options.galleryTop.onResize();
      },150);
      options.galleryTop.slideTo(activeIndex, 0);
      if(options.galleryThumbs.onResize)
        options.galleryThumbs.onResize();

      $(document).on('keydown', lbHandleKeyboard);
      $('body').css({'overflow':'hidden'});
    }

    function loadFullImageLazy(index){
      if(!lb.hasClass('fullLazyInserted')){
        $.each(options.galleryTop.slides, function(index, item){
          var slide = $(item);
          var src = slide.data('src');
          if(src){
            var img = slide.find('img');
            img.addClass('swiper-lazy').attr('data-src', src).attr('data-srcset', " ");
          }
        });
      }
      lb.addClass('fullLazyInserted');
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
