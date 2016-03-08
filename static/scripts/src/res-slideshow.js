jQuery(document).ready(function($){
    var wpprs = $('.property-resp-slideshow');
    wpprs.each(function(){
        var $this = $(this);
        var id = $this.attr('id');
        var sliderType = $this.attr('data-slider-type');
        var slidesPerView;
        var slidesPerColumn;
        var pagination;
        var centeredSlides = true;
        var slidesPerColumnFill = 'column';
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
                enDisKeyCtrl(); // Enable keyboard control only on current swiper.
            };
        var enDisKeyCtrl = function(){
            wpprs.find('.gallery-top').each(function(){
                this.swiper.disableKeyboardControl();
            });
            galleryTop.enableKeyboardControl();
        }

        // Settings specific on slider types.
        switch(sliderType){
            case 'standard':
                slidesPerView   = 1;
                slidesPerColumn = 1;
                pagination = "swiper-pagination";
            break;
            case 'carousel':
                slidesPerView   = 'auto';
                slidesPerColumn = 1;
            break;
            case '12grid':
                slidesPerView   = 3;
                //slidesPerColumnFill   = 'row';
                slidesPerColumn = 2;
                centeredSlides = false;
            break;
            case '12mosaic':
                slidesPerView   = 3;
                //slidesPerColumnFill   = 'row';
                slidesPerColumn = 2;
                centeredSlides = false;
            break;
        }

        var galleryTop = new Swiper($this.find('.gallery-top'), {
                nextButton: $this.find('.swiper-button-next'),
                prevButton: $this.find('.swiper-button-prev'),
                centeredSlides: centeredSlides,
                slidesPerView: slidesPerView,
                slidesPerColumn: slidesPerColumn,
                slidesPerColumnFill: slidesPerColumnFill,
                sliderType: sliderType,
                pagination: pagination,
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
                //simulateTouch: false,
                //slideToClickedSlide:true

            });

            galleryThumbs.container.on('click', '.swiper-slide', function(e){
                galleryTop.params.byThumbs = true;
                goToClickedSlide.call(this, e);
                galleryTop.params.byThumbs = false;
            });

            galleryTop.on('onSlideChangeStart', function(s){
                if(galleryThumbs.activeIndex != s.activeIndex)
                    galleryThumbs.slideTo( s.activeIndex );
            });
        }

        galleryTop.on('onSlideChangeStart', function(s){
            var active      = s.activeIndex+1;
            //var total       = s.slides.length;
            var progress    = s.container.find('.count-progress');
            progress.find('.current').html(active);
            //progress.find('.total').html(total);
            enDisKeyCtrl(); // Enable keyboard control only on current swiper.
        });
        
        jQuery(window).on('orientationchange', galleryTop.onResize);
        jQuery(document).on('wpp_denali_tabbed_widget_render', galleryTop.onResize);
        if(!galleryTop.isGrid())
            galleryTop.container.on('click', '.swiper-slide', goToClickedSlide);

        galleryTop.on('onResizeStart', function(s){
            setControlSize();// setting the next prev control size;
            if (s.isGrid()) {
                return;
            }
            var width = s.container.width();
            var $styler = jQuery('#' + id + '-img-max-width')
            var maxWidth = (s.container.width() / s.params.slidesPerView) - (s.params.spaceBetween * s.params.slidesPerView);
            var maxHeight = (s.container.height() / s.params.slidesPerColumn) - s.params.spaceBetween;

            if($styler.length==0)
                $styler = jQuery('<style id="' + id + '-img-max-width"></style>').appendTo('body');
            $styler.html('#' + id + '.swiper-container.gallery-top .swiper-slide img{max-width:'+ s.container.width() +'px!important;max-height:'+s.container.height() +'px!important;}');

            s.slides.each(function(){
                var $this   = jQuery(this).find('img'),
                    width   = parseInt($this.attr('width')),
                    height  = parseInt($this.attr('height')),
                    ratio   = width/height;
                
                if(s.isLightbox()){
                    width   = parseInt($this.data('width'));
                    height  = parseInt($this.data('height'));
                }
                if((width > maxWidth) && (height > maxHeight)){
                    if(maxHeight * ratio <= maxWidth){
                        height  = maxHeight;
                        width   = maxHeight * ratio;
                    }
                    else{
                        width   = maxWidth;
                        height  = maxWidth / ratio;
                    }
                }
                else if(width > maxWidth){
                    width   = maxWidth;
                    height  = maxWidth / ratio;
                }
                else if(height > maxHeight){
                    height  = maxHeight;
                    width   = maxHeight * ratio;
                }

                $this.width(width);
                $this.height(height);
                $this[0].style.setProperty('width', width + "px", 'important');
                $this[0].style.setProperty('height', height + "px", 'important');

            });
        });

        
        galleryTop.on('onLazyImageReady', function(s, slide, _img){
            s.onResize();
        });

        // Lightbox
        $this.wpp_rs_lb({galleryTop:galleryTop, galleryThumbs:galleryThumbs, sliderType:sliderType});

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

function setSlideSize_12mosaic(slide, s){
    var width;
    var height;
    var slide = jQuery(slide);
    var img = slide.find('img');
    var maxHeight = s.container.height() / s.params.slidesPerColumn;

    var attrWidth  = parseInt(img.attr('width'));
    var attrHeight  = parseInt(img.attr('height'));
    var ratio   = attrWidth / attrHeight;

    if(slide.is(':first-child')){
        height = s.container.height();
    }
    else{
        height = maxHeight;
    }
    width   = height * ratio;
    img.width(width)
         .height(height);
    slide.width(width)
         .height(height);
    img[0].style.setProperty('width', width + "px", 'important');
    img[0].style.setProperty('height', height + "px", 'important');
    return width;
}

function setSlideSize_12grid(slide, s){
    var width;
    var height;
    var slide = jQuery(slide);
    var img = slide.find('img');
    var maxHeight = s.container.height() / s.params.slidesPerColumn;

    var attrWidth  = parseInt(img.attr('width'));
    var attrHeight  = parseInt(img.attr('height'));
    var imgRatio   = attrWidth / attrHeight;
    var slideRatio   = 4 / 3; 
    var width, height;

    if(slide.is(':first-child')){
        slideHeight = s.container.height();
    }
    else{
        slideHeight = maxHeight;
    }
    slideWidth   = slideHeight * slideRatio;

    slide.width(slideWidth)
         .height(slideHeight);

    if(slideWidth > slideHeight){
        width = slideWidth;
        height = width / imgRatio;
    }
    else{
        height = slideHeight;
        width = height * imgRatio;
    }
    if(width<slideWidth){
        width = slideWidth;
        height = width / imgRatio;
    }
    else if(height<slideHeight){
        height = slideHeight;
        width = height * imgRatio;
    }
    
    img.width(width)
         .height(height);
    img[0].style.setProperty('width', width + "px", 'important');
    img[0].style.setProperty('height', height + "px", 'important');
    return slideWidth;
}