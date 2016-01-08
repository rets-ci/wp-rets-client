jQuery(document).ready(function($) {
    $(".property-resp-slideshow").each(function() {
        function setControlSize() {
            var cWidth = galleryTop.container.width(), control = $(galleryTop.container).find(".swiper-button-prev, .swiper-button-next");
            cWidth > 900 ? width = 36 : 400 > cWidth ? width = 20 : width = cWidth / 100 * 6, 
            control.css("font-size", width);
        }
        var galleryThumbs, $this = $(this), id = $this.attr("id"), _galleryThumbs = $this.find(".gallery-thumbs"), goToClickedSlide = function(e) {
            var clickedIndex = $(this).index();
            return galleryTop.activeIndex != clickedIndex ? (galleryTop.slideTo(clickedIndex), 
            e.preventDefault(), e.stopImmediatePropagation(), !1) : void 0;
        }, galleryTop = new Swiper($this.find(".gallery-top"), {
            nextButton: $this.find(".swiper-button-next"),
            prevButton: $this.find(".swiper-button-prev"),
            centeredSlides: !0,
            slidesPerView: "auto",
            spaceBetween: 2.5,
            keyboardControl: !0,
            lazyLoading: !0,
            lazyLoadingInPrevNext: !0,
            lazyLoadingOnTransitionStart: !0,
            onInit: function(s) {
                setTimeout(function() {
                    s.onResize(), setControlSize();
                }, 0);
            }
        });
        _galleryThumbs.length && (galleryThumbs = new Swiper(_galleryThumbs, {
            spaceBetween: 2.5,
            centeredSlides: !0,
            slidesPerView: "auto",
            touchRatio: 1,
            longSwipesRatio: 1,
            freeModeMomentumRatio: 5
        }), galleryThumbs.container.on("click", ".swiper-slide", goToClickedSlide), galleryTop.on("onSlideChangeStart", function(s) {
            galleryThumbs.slideTo(s.activeIndex);
        })), galleryTop.on("onSlideChangeStart", function(s) {
            var active = s.activeIndex + 1, progress = s.container.find(".count-progress");
            progress.find(".current").html(active);
        }), jQuery(window).on("orientationchange", galleryTop.onResize), jQuery(document).on("wpp_denali_tabbed_widget_render", galleryTop.onResize), 
        galleryTop.container.on("click", ".swiper-slide", goToClickedSlide), galleryTop.on("onResizeStart", function(s) {
            setControlSize();
            var $styler = (s.container.width(), jQuery("#" + id + "-img-max-width")), container_width = s.container.width(), container_height = s.container.height();
            0 == $styler.length && ($styler = jQuery('<style id="' + id + '-img-max-width"></style>').appendTo("body")), 
            $styler.html("#" + id + ".swiper-container.gallery-top .swiper-slide img{max-width:" + s.container.width() + "px!important;max-height:" + s.container.height() + "px!important;}"), 
            s.slides.each(function() {
                var $this = jQuery(this).find("img"), width = parseInt($this.attr("width")), height = parseInt($this.attr("height")), wRatio = height / width, hRatio = width / height;
                width > container_width && height > container_height ? container_width >= container_height * hRatio ? ($this.height(container_height), 
                $this.width(container_height * hRatio)) : ($this.width(container_width), $this.height(container_width * wRatio)) : width > container_width ? ($this.width(container_width), 
                $this.height(container_width * wRatio)) : height > container_height ? ($this.height(container_height), 
                $this.width(container_height * hRatio)) : ($this.width(width), $this.height(height));
            });
        }), galleryTop.on("onLazyImageReady", function(s, slide, _img) {
            s.onResize();
        }), $this.wpp_rs_lb({
            galleryTop: galleryTop,
            galleryThumbs: galleryThumbs
        });
    });
});