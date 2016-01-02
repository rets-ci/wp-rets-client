jQuery(document).ready(function($) {
    $(".property-resp-slideshow").each(function() {
        var $this = $(this), galleryTop = new Swiper($this.find(".gallery-top"), {
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev",
            centeredSlides: !0,
            slidesPerView: "auto",
            spaceBetween: 2.5,
            keyboardControl: !0,
            preventClicks: !1
        }), galleryThumbs = new Swiper($this.find(".gallery-thumbs"), {
            spaceBetween: 2.5,
            centeredSlides: !0,
            slidesPerView: "auto",
            touchRatio: 1,
            longSwipesRatio: 1,
            freeModeMomentumRatio: 5,
            simulateTouch: !1
        }), goToClickedSlide = function(e) {
            var clickedIndex = $(this).index();
            return galleryTop.activeIndex != clickedIndex ? (galleryTop.slideTo(clickedIndex), 
            e.preventDefault(), e.stopImmediatePropagation(), !1) : void 0;
        };
        galleryTop.container.on("click", ".swiper-slide", goToClickedSlide), galleryThumbs.container.on("click", ".swiper-slide", goToClickedSlide), 
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
        }), jQuery(window).on("orientationchange", galleryTop.onResize), galleryTop.on("onSlideChangeStart", function(e, s) {
            galleryThumbs.slideTo(e.activeIndex);
        });
    });
});