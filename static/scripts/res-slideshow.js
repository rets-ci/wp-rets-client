jQuery(document).ready(function($) {
    $(".property-resp-slideshow").each(function() {
        var galleryThumbs, $this = $(this), _galleryThumbs = $this.find(".gallery-thumbs"), goToClickedSlide = function(e) {
            var clickedIndex = $(this).index();
            return galleryTop.activeIndex != clickedIndex ? (galleryTop.slideTo(clickedIndex), 
            e.preventDefault(), e.stopImmediatePropagation(), !1) : void 0;
        }, galleryTop = new Swiper($this.find(".gallery-top"), {
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev",
            centeredSlides: !0,
            slidesPerView: "auto",
            spaceBetween: 2.5,
            keyboardControl: !0,
            preventClicks: !1,
            lazyLoading: !0,
            lazyLoadingInPrevNext: !0,
            lazyLoadingOnTransitionStart: !0,
            onInit: function(s) {
                setTimeout(function() {
                    s.onResize();
                }, 200);
            }
        });
        _galleryThumbs.length && (galleryThumbs = new Swiper(_galleryThumbs, {
            spaceBetween: 2.5,
            centeredSlides: !0,
            slidesPerView: "auto",
            touchRatio: 1,
            longSwipesRatio: 1,
            freeModeMomentumRatio: 5,
            simulateTouch: !1
        }), galleryThumbs.container.on("click", ".swiper-slide", goToClickedSlide), galleryTop.on("onSlideChangeStart", function(s) {
            galleryThumbs.slideTo(s.activeIndex);
        })), galleryTop.on("onSlideChangeStart", function(s) {
            var active = s.activeIndex + 1, progress = s.container.find(".count-progress");
            progress.find(".current").html(active);
        }), jQuery(window).on("orientationchange", galleryTop.onResize), galleryTop.container.on("click", ".swiper-slide", goToClickedSlide), 
        galleryTop.on("onResizeStart", function(s) {
            if (s.container.hasClass("gallery-top")) {
                var $styler = (s.container.width(), jQuery("#swiper-img-max-width"));
                0 == $styler.length && ($styler = jQuery('<style id="swiper-img-max-width"></style>').appendTo("body")), 
                $styler.html(".swiper-container.gallery-top .swiper-slide img{max-width:" + s.container.width() + "px!important;max-height:" + s.container.height() + "px!important;}");
                var container_width = s.container.width(), container_height = s.container.height();
                s.slides.each(function() {
                    var $this = jQuery(this).find("img"), width = parseInt($this.attr("width")), height = parseInt($this.attr("height")), wRatio = height / width, hRatio = width / height;
                    width > container_width && height > container_height ? container_width >= container_height * hRatio ? ($this.height(container_height), 
                    $this.width(container_height * hRatio)) : ($this.width(container_width), $this.height(container_width * wRatio)) : width > container_width ? ($this.width(container_width), 
                    $this.height(container_width * wRatio)) : height > container_height ? ($this.height(container_height), 
                    $this.width(container_height * hRatio)) : ($this.width($this.width()), $this.height($this.height()));
                });
            }
        }), galleryTop.on("onLazyImageReady", function(s, slide, _img) {
            s.onResize();
        });
    });
});