jQuery(document).ready(function($){
    $('.property-resp-slideshow').each(function(){
        var $this = $(this),
            galleryTop = new Swiper($this.find('.gallery-top'), {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                centeredSlides: true,
                slidesPerView: 'auto',
                spaceBetween: 2.5,
                keyboardControl:true,
                preventClicks:false
                //slideToClickedSlide:true
            }),
            
            galleryThumbs = new Swiper($this.find('.gallery-thumbs'), {
                spaceBetween: 2.5,
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
                    e.preventDefault();
                    e.stopImmediatePropagation()
                    return false;
                }
            }
            
        galleryTop.container.on('click', '.swiper-slide', goToClickedSlide);
        galleryThumbs.container.on('click', '.swiper-slide', goToClickedSlide);
        galleryTop.on('onResizeStart', function(event, s){
            if(s.container.hasClass('gallery-top')){
                var width = s.container.width(),
                    ratio = 16/9;
                s.container.height(width * ratio);

                var $styler = jQuery('#swiper-img-max-width')
                if($styler.length==0)
                    $styler = jQuery('<style id="swiper-img-max-width"></style>').appendTo('body');
                $styler.html('.swiper-container .swiper-slide img{max-width:'+ s.container.width() +'px!important;}');
                var container_width = s.container.width();
                var container_height = s.container.height();
                s.slides.each(function(){
                    var $this   = jQuery(this).find('img'),
                        width   = parseInt($this.attr('width')),
                        height  = parseInt($this.attr('height'))

                        if((width > container_width) && (height > container_height)){
                            $this.height(container_height);
                        }
                        else if(width > container_width){
                            $this.width(container_width);
                        }
                        else if(height > container_height){
                            $this.height(container_height);
                        }
                        else
                            $this.width($this.width());

                });
            }
        });
        jQuery(window).on('orientationchange', galleryTop.onResize);
        galleryTop.on('onSlideChangeStart', function(e, s){
            galleryThumbs.slideTo(e.activeIndex);
        });
        //galleryTop.params.control = galleryThumbs;
        //galleryThumbs.params.control = galleryTop;
    })
});

