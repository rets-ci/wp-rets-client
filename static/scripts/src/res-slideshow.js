jQuery(document).ready(function($){
    $('.property-resp-slideshow').each(function(){
        var $this = $(this);
        var galleryThumbs;
        var _galleryThumbs = $this.find('.gallery-thumbs');
        var goToClickedSlide = function(e){
                var clickedIndex = $(this).index();
                if(galleryTop.activeIndex != clickedIndex){
                    galleryTop.slideTo(clickedIndex);
                    e.preventDefault();
                    e.stopImmediatePropagation()
                    return false;
                }
            };
        var galleryTop = new Swiper($this.find('.gallery-top'), {
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                centeredSlides: true,
                slidesPerView: 'auto',
                spaceBetween: 2.5,
                keyboardControl:true,
                //preventClicks:false,
                // Enable lazy loading
                lazyLoading: true,
                lazyLoadingInPrevNext: true,
                lazyLoadingOnTransitionStart: true,
                onInit: function(s){
                                    setTimeout(function() {
                                        s.onResize();
                                    },200);
                                },
                //slideToClickedSlide:true
            });
        if(_galleryThumbs.length){
            galleryThumbs = new Swiper(_galleryThumbs, {
                spaceBetween: 2.5,
                centeredSlides: true,
                slidesPerView: 'auto',
                touchRatio: 1,
                longSwipesRatio: 1,
                freeModeMomentumRatio: 5,
                simulateTouch: false,
                //slideToClickedSlide:true

            });

            galleryThumbs.container.on('click', '.swiper-slide', goToClickedSlide);

            galleryTop.on('onSlideChangeStart', function(s){
                galleryThumbs.slideTo(s.activeIndex);
            });
        }

        galleryTop.on('onSlideChangeStart', function(s){
            var active      = s.activeIndex+1;
            //var total       = s.slides.length;
            var progress    = s.container.find('.count-progress');
            progress.find('.current').html(active);
            //progress.find('.total').html(total);
        });
        jQuery(window).on('orientationchange', galleryTop.onResize);
        galleryTop.container.on('click', '.swiper-slide', goToClickedSlide);

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

        
        galleryTop.on('onLazyImageReady', function(s, slide, _img){
            s.onResize();
        });
        $this.wpp_rs_lb({galleryTop:galleryTop, galleryThumbs:galleryThumbs});
        //galleryTop.params.control = galleryThumbs;
        //galleryThumbs.params.control = galleryTop;
    });
});

