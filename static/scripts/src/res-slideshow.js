jQuery(document).ready(function($){
    $('.property-resp-slideshow').each(function(){
        var $this = $(this);
        var id = $this.attr('id');
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
                nextButton: $this.find('.swiper-button-next'),
                prevButton: $this.find('.swiper-button-prev'),
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
                                        setControlSize(); // setting the next prev control size;
                                    },00);
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
                //simulateTouch: false,
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
        jQuery(document).on('wpp_denali_tabbed_widget_render', galleryTop.onResize);
        galleryTop.container.on('click', '.swiper-slide', goToClickedSlide);

        galleryTop.on('onResizeStart', function(s){
            setControlSize();// setting the next prev control size;
            var width = s.container.width();
            var $styler = jQuery('#' + id + '-img-max-width')
            var container_width = s.container.width();
            var container_height = s.container.height();
            
            if($styler.length==0)
                $styler = jQuery('<style id="' + id + '-img-max-width"></style>').appendTo('body');
            $styler.html('#' + id + '.swiper-container.gallery-top .swiper-slide img{max-width:'+ s.container.width() +'px!important;max-height:'+s.container.height() +'px!important;}');
            
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
                    $this.width(width);
                    $this.height(height);
                }

            });
        });

        
        galleryTop.on('onLazyImageReady', function(s, slide, _img){
            s.onResize();
        });
        $this.wpp_rs_lb({galleryTop:galleryTop, galleryThumbs:galleryThumbs});

        // set font based on cointer width
        function setControlSize(){
            var cWidth = galleryTop.container.width();
            var control = $(galleryTop.container).find('.swiper-button-prev, .swiper-button-next');
            if(cWidth>900){
                width = 36;
            }
            else if(cWidth<400){
                width = 20;
            }
            else{
                width = (cWidth /100) * 6
            }
            control.css('font-size', width);
        }
        //galleryTop.params.control = galleryThumbs;
        //galleryThumbs.params.control = galleryTop;
    });
});

