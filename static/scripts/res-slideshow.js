function setSlideSize(slide, s) {
    var width, height, slide = jQuery(slide), img = slide.find("img"), maxHeight = s.container.height() / s.params.slidesPerColumn, attrWidth = parseInt(img.attr("width")), attrHeight = parseInt(img.attr("height")), ratio = attrWidth / attrHeight;
    return height = slide.is(":first-child") && "12mosaic" == s.params.sliderType ? s.container.height() : maxHeight, 
    width = height * ratio, img.width(width).height(height), slide.width(width).height(height), 
    width;
}

jQuery(document).ready(function($) {
    var wpprs = $(".property-resp-slideshow");
    wpprs.each(function() {
        function setControlSize() {
            var cWidth = galleryTop.container.width(), control = $(galleryTop.container).find(".swiper-button-prev, .swiper-button-next");
            cWidth > 900 ? width = 36 : 400 > cWidth ? width = 20 : width = cWidth / 100 * 6, 
            control.css("font-size", width);
        }
        var slidesPerView, slidesPerColumn, galleryThumbs, $this = $(this), id = $this.attr("id"), sliderType = $this.attr("data-slider-type"), centeredSlides = !0, slidesPerColumnFill = "column", _galleryThumbs = $this.find(".gallery-thumbs"), goToClickedSlide = function(e) {
            var clickedIndex = $(this).index();
            return galleryTop.activeIndex != clickedIndex ? (galleryTop.slideTo(clickedIndex), 
            e.preventDefault(), e.stopImmediatePropagation(), !1) : void enDisKeyCtrl();
        }, enDisKeyCtrl = function() {
            wpprs.find(".gallery-top").each(function() {
                this.swiper.disableKeyboardControl();
            }), galleryTop.enableKeyboardControl();
        };
        switch (sliderType) {
          case "standard":
            slidesPerView = 1, slidesPerColumn = 1;
            break;

          case "carousel":
            slidesPerView = "auto", slidesPerColumn = 1;
            break;

          case "12grid":
            slidesPerView = 3, slidesPerColumn = 2, centeredSlides = !1;
            break;

          case "12mosaic":
            slidesPerView = 3, slidesPerColumn = 2, centeredSlides = !1;
        }
        var galleryTop = new Swiper($this.find(".gallery-top"), {
            nextButton: $this.find(".swiper-button-next"),
            prevButton: $this.find(".swiper-button-prev"),
            centeredSlides: centeredSlides,
            slidesPerView: slidesPerView,
            slidesPerColumn: slidesPerColumn,
            slidesPerColumnFill: slidesPerColumnFill,
            sliderType: sliderType,
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
            longSwipesRatio: 1
        }), galleryThumbs.container.on("click", ".swiper-slide", function(e) {
            galleryTop.params.byThumbs = !0, goToClickedSlide.call(this, e), galleryTop.params.byThumbs = !1;
        }), galleryTop.on("onSlideChangeStart", function(s) {
            galleryThumbs.activeIndex != s.activeIndex && galleryThumbs.slideTo(s.activeIndex);
        })), galleryTop.on("onSlideChangeStart", function(s) {
            var active = s.activeIndex + 1, progress = s.container.find(".count-progress");
            progress.find(".current").html(active), enDisKeyCtrl();
        }), jQuery(window).on("orientationchange", galleryTop.onResize), jQuery(document).on("wpp_denali_tabbed_widget_render", galleryTop.onResize), 
        "12mosaic" != sliderType && galleryTop.container.on("click", ".swiper-slide", goToClickedSlide), 
        galleryTop.on("onResizeStart", function(s) {
            if (setControlSize(), s.params.lightBox || "12mosaic" != s.params.sliderType) {
                var $styler = (s.container.width(), jQuery("#" + id + "-img-max-width")), maxWidth = s.container.width() / s.params.slidesPerView - s.params.spaceBetween * s.params.slidesPerView, maxHeight = s.container.height() / s.params.slidesPerColumn - s.params.spaceBetween;
                0 == $styler.length && ($styler = jQuery('<style id="' + id + '-img-max-width"></style>').appendTo("body")), 
                $styler.html("#" + id + ".swiper-container.gallery-top .swiper-slide img{max-width:" + s.container.width() + "px!important;max-height:" + s.container.height() + "px!important;}"), 
                s.slides.each(function() {
                    var $this = jQuery(this).find("img"), width = parseInt($this.attr("width")), height = parseInt($this.attr("height")), ratio = width / height;
                    width > maxWidth && height > maxHeight ? maxWidth >= maxHeight * ratio ? (height = maxHeight, 
                    width = maxHeight * ratio) : (width = maxWidth, height = maxWidth / ratio) : width > maxWidth ? (width = maxWidth, 
                    height = maxWidth / ratio) : height > maxHeight && (height = maxHeight, width = maxHeight * ratio), 
                    $this.width(width), $this.height(height);
                });
            }
        }), galleryTop.on("onLazyImageReady", function(s, slide, _img) {
            s.onResize();
        }), $this.wpp_rs_lb({
            galleryTop: galleryTop,
            galleryThumbs: galleryThumbs,
            sliderType: sliderType
        });
    });
});