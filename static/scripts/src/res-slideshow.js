jQuery(document).ready(function($){
    $('.property-resp-slideshow').each(function(){
        var $this = $(this),
            galleryTop = new Swiper($this.find('.gallery-top'), {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                centeredSlides: true,
                slidesPerView: 'auto',
                spaceBetween: 10,
                keyboardControl:true,
                preventClicks:false
                //slideToClickedSlide:true
            }),
            
            galleryThumbs = new Swiper($this.find('.gallery-thumbs'), {
                spaceBetween: 2,
                centeredSlides: true,
                slidesPerView: 'auto',
                touchRatio: 1,
                longSwipesRatio: 1,
                freeModeMomentumRatio: 5,
                simulateTouch: false,
                //slideToClickedSlide:true

            }),
            goToClickedSlide = function(e){
                var clickedIndex = $(this).index();
                if(galleryTop.activeIndex != clickedIndex){
                    galleryTop.slideTo(clickedIndex);
                    return false;
                }
            }
            
        galleryTop.container.on('click', '.swiper-slide', goToClickedSlide);
        galleryThumbs.container.on('click', '.swiper-slide', goToClickedSlide);

        jQuery(window).on('orientationchange', galleryTop.onResize);
        galleryTop.on('onSlideChangeStart', function(e, s){
            galleryThumbs.slideTo(e.activeIndex);
        });
        //galleryTop.params.control = galleryThumbs;
        //galleryThumbs.params.control = galleryTop;
    })
});

