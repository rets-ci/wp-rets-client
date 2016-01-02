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
        galleryTop.on('onResizeStart', function(s){
            if(s.container.hasClass('gallery-top')){
                var width = s.container.width();

                var $styler = jQuery('#swiper-img-max-width')
                if($styler.length==0)
                    $styler = jQuery('<style id="swiper-img-max-width"></style>').appendTo('body');
                $styler.html('.swiper-container.gallery-top .swiper-slide img{max-width:'+ s.container.width() +'px!important;max-height:'+s.container.height() +'px!important;}');
                var container_width = s.container.width();
                var container_height = s.container.height();
                s.slides.each(function(){
                    var $this   = jQuery(this).find('img'),
                        width   = parseInt($this.attr('width')),
                        height  = parseInt($this.attr('height')),
                        wRatio   = height/width,
                        hRatio   = width/height;

                        if((width > container_width) && (height > container_height)){
                            if(container_height*hRatio<=container_width){
                                $this.height(container_height);
                                $this.width(container_height*hRatio);
                            }
                            else{
                                $this.width(container_width);
                                $this.height(container_width*wRatio);
                            }
                        }
                        else if(width > container_width){
                            $this.width(container_width);
                            $this.height(container_width*wRatio);
                        }
                        else if(height > container_height){
                            $this.height(container_height);
                            $this.width(container_height*hRatio);
                        }
                        else{
                            $this.width($this.width());
                            $this.height($this.height());
                        }

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

