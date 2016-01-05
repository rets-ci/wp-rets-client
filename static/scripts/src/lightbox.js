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
        
    //Click event on element
    return this.on('click', '.swiper-slide.swiper-slide-active', function(e){
      if(lb.hasClass('lightbox')){
        hideLightbox();
      }
      else{
        showLightbox();
      }
    });

    function showLightbox(){
      lb.addClass('lightbox');
      $('#wpadminbar').hide();
      options.galleryTop.onResize();
      options.galleryThumbs.onResize();
      $(document).on('keydown', handleKeyboard);
      $('body').css({'overflow':'hidden'});
    }
    
    function hideLightbox(){
      $('body').css({'overflow':''});
      lb.removeClass('lightbox');
      $('#wpadminbar').show();
      options.galleryTop.onResize();
      options.galleryThumbs.onResize();
      $(document).off('keydown', handleKeyboard);
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
