/**
 * 
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
      if(lb.hasClass('lightbox')){
        hideLightbox();
      }
      else{
        showLightbox();
      }
    });
    //Click event on element
    lb.on('click', '.modal-header .close', function(e){
      hideLightbox();
    });

    setViewOriginalHref(options.galleryTop);

    //Click event on element
    options.galleryTop.on('onSlideChangeStart', function(s){
      setViewOriginalHref(s);
    });

    function setViewOriginalHref(s){
      var activeIndex = s.activeIndex;
      var href = $(s.slides[activeIndex]).data('href');
      lb.find('.viewOriginal').attr('href', href);
    }

    function showLightbox(){
      var activeIndex = options.galleryTop.activeIndex;
      options.galleryTop.params.slidesPerView = 1;

      lb.addClass('lightbox');
      $('#wpadminbar').hide();

      options.galleryTop.onResize();
      options.galleryTop.update();
      options.galleryTop.slideTo(activeIndex, 0);

      options.galleryThumbs.onResize();

      $(document).on('keydown', handleKeyboard);
      $('body').css({'overflow':'hidden'});
    }
    
    function hideLightbox(){
      var activeIndex = options.galleryTop.activeIndex;

      options.galleryTop.params.slidesPerView = originalSlidesPerView;

      lb.removeClass('lightbox');
      $('#wpadminbar').show();

      options.galleryTop.destroy(false, true);
      options.galleryTop.init();
      options.galleryTop.onResize();
      options.galleryTop.update(true);
      options.galleryTop.slideTo(activeIndex, 0);

      options.galleryThumbs.onResize();

      $(document).off('keydown', handleKeyboard);
      $('body').css({'overflow':''});
    }
    /**
     * Add styles to the html markup
     */
     function handleKeyboard(e){
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
