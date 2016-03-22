jQuery(document).ready(function($) {
    var wpprs = $(".property-resp-slideshow");
    wpprs.each(function() {
        function setControlSize() {
            var cWidth = galleryTop.container.width(), control = $(galleryTop.container).find(".swiper-button-prev, .swiper-button-next");
            cWidth > 900 ? width = 36 : 400 > cWidth ? width = 20 : width = cWidth / 100 * 6, 
            control.css("font-size", width);
        }
        var slidesPerView, slidesPerColumn, pagination, galleryTop, galleryThumbs, $this = $(this), id = $this.attr("id"), sliderType = $this.attr("data-slider-type"), autoHeight = !1, centeredSlides = !0, slidesPerColumnFill = "column", _galleryTop = $this.find(".gallery-top"), _galleryThumbs = $this.find(".gallery-thumbs"), slideshow_layout = _galleryTop.data("slideshow_layout"), slider_width = _galleryTop.data("slider_width"), slider_height = _galleryTop.data("slider_height"), slider_auto_height = _galleryTop.data("slider_auto_height").toString();
        slider_auto_height = "true" == slider_auto_height ? !0 : !1;
        var slider_min_height = _galleryTop.data("slider_min_height"), slider_max_height = _galleryTop.data("slider_max_height");
        switch (sliderType) {
          case "standard":
            slidesPerView = 1, slidesPerColumn = 1, pagination = "swiper-pagination", autoHeight = slider_auto_height;
            break;

          case "carousel":
            slidesPerView = "auto", slidesPerColumn = 1, autoHeight = slider_auto_height;
            break;

          case "12grid":
            slidesPerView = 3, slidesPerColumn = 2, centeredSlides = !1;
            break;

          case "12mosaic":
            slidesPerView = 3, slidesPerColumn = 2, centeredSlides = !1;
        }
        autoHeight || slider_height || "strict" == slideshow_layout || _galleryTop.addClass("ratio-16-9"), 
        galleryTop = new Swiper(_galleryTop, {
            nextButton: $this.find(".swiper-button-next"),
            prevButton: $this.find(".swiper-button-prev"),
            centeredSlides: centeredSlides,
            slidesPerView: slidesPerView,
            slidesPerColumn: slidesPerColumn,
            slidesPerColumnFill: slidesPerColumnFill,
            pagination: pagination,
            autoHeight: autoHeight,
            spaceBetween: 2.5,
            keyboardControl: !0,
            lazyLoading: !0,
            lazyLoadingInPrevNext: !0,
            lazyLoadingOnTransitionStart: !0,
            sliderType: sliderType,
            slideshow_layout: slideshow_layout,
            slider_width: slider_width,
            slider_height: slider_height,
            slider_min_height: slider_min_height,
            slider_max_height: slider_max_height,
            onInit: function(s) {
                setTimeout(function() {
                    s.onResize(), setControlSize();
                }, 0);
            }
        }), _galleryThumbs.length && (galleryThumbs = new Swiper(_galleryThumbs, {
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
        galleryTop.isGrid() || galleryTop.container.on("click", ".swiper-slide", goToClickedSlide), 
        galleryTop.on("onResizeStart", function(s) {
            if (setControlSize(), s.params.slider_min_height && s.container.css("min-height", s.params.slider_min_height), 
            s.params.slider_max_height && s.container.css("max-height", s.params.slider_max_height), 
            s.params.slider_height && !s.params.slider_auto_height && s.container.height(s.params.slider_height), 
            "strict" == s.params.slideshow_layout && s.params.slider_width) s.container.parent().width(s.params.slider_width), 
            s.params.slider_height || s.container.height(16 * s.container.width() / 9), s.container.parent().css("margin", "auto"); else if ("fullwidth" == s.params.slideshow_layout) {
                var ofsetleft = $this.parent().offset().left - $(window).scrollLeft();
                $this.css({
                    position: "absolute",
                    left: -ofsetleft,
                    width: jQuery(window).width(),
                    margin: "0 auto"
                }), 0 == jQuery("#wprs-fullwidth-spacer").length && jQuery("<div />").attr("id", "wprs-fullwidth-spacer").width("100%").height($this.height()).insertAfter($this);
            }
            if ("auto" == s.params.slideshow_layout && s.params.slider_width && s.params.slider_height && !s.params.slider_auto_height) {
                var containerRatio = s.params.slider_width / s.params.slider_height;
                s.container.height(s.container.width() / containerRatio);
            }
            if (!s.isGrid()) {
                var containerWidth = s.container.width(), containerHeight = s.container.height(), $styler = jQuery("#" + id + "-img-max-width"), maxWidth = containerWidth / s.params.slidesPerView - s.params.spaceBetween * s.params.slidesPerView, maxHeight = containerHeight / s.params.slidesPerColumn - s.params.spaceBetween;
                0 == $styler.length && ($styler = jQuery('<style id="' + id + '-img-max-width"></style>').appendTo("body")), 
                $styler.html("#" + id + ".swiper-container.gallery-top .swiper-slide img{max-width:" + containerWidth + "px!important;max-height:" + containerHeight + "px!important;}"), 
                s.slides.each(function() {
                    var $this = jQuery(this).find("img"), width = parseInt($this.attr("width")), height = parseInt($this.attr("height")), ratio = width / height;
                    if (s.isLightbox()) width = parseInt($this.data("width")), height = parseInt($this.data("height")), 
                    ratio = width / height; else if (s.params.autoHeight && !s.params.slider_height) return maxHeight = containerWidth / ratio, 
                    height > maxHeight && (height = maxHeight), width = height * ratio, $this.css("height", height), 
                    $this.css("width", width), $this.css("max-width", maxWidth), void jQuery(this).css("height", "100%");
                    width > maxWidth && height > maxHeight ? maxWidth >= maxHeight * ratio ? (height = maxHeight, 
                    width = maxHeight * ratio) : (width = maxWidth, height = maxWidth / ratio) : width > maxWidth ? (width = maxWidth, 
                    height = maxWidth / ratio) : height > maxHeight && (height = maxHeight, width = maxHeight * ratio), 
                    $this.width(width), $this.height(height), $this[0].style.setProperty("width", width + "px", "important"), 
                    $this[0].style.setProperty("height", height + "px", "important");
                });
            }
        }), galleryTop.on("onLazyImageReady", function(s, slide, _img) {
            s.onResize();
        }), $this.wpp_rs_lb({
            galleryTop: galleryTop,
            galleryThumbs: galleryThumbs,
            sliderType: sliderType
        });
        var goToClickedSlide = function(e) {
            var clickedIndex = $(this).index();
            return galleryTop.activeIndex != clickedIndex ? (galleryTop.slideTo(clickedIndex), 
            e.preventDefault(), e.stopImmediatePropagation(), !1) : void enDisKeyCtrl();
        }, enDisKeyCtrl = function() {
            wpprs.find(".gallery-top").each(function() {
                this.swiper.disableKeyboardControl();
            }), galleryTop.enableKeyboardControl();
        };
    });
});