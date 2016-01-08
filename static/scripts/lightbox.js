!function($) {
    $.fn.wpp_rs_lb = function(prop) {
        function setViewOriginalHref(s) {
            var activeIndex = s.activeIndex, href = $(s.slides[activeIndex]).data("href");
            lb.find(".viewOriginal").attr("href", href);
        }
        function showLightbox() {
            var activeIndex = options.galleryTop.activeIndex;
            options.galleryTop.params.slidesPerView = 1, options.galleryTop.params.noSwiping = !0, 
            lb.addClass("lightbox"), $("#wpadminbar").hide(), options.galleryTop.update(), setTimeout(function() {
                options.galleryTop.onResize();
            }, 150), options.galleryTop.slideTo(activeIndex, 0), options.galleryThumbs.onResize && options.galleryThumbs.onResize(), 
            $(document).on("keydown", lbHandleKeyboard), $("body").css({
                overflow: "hidden"
            });
        }
        function hideLightbox() {
            var activeIndex = options.galleryTop.activeIndex;
            options.galleryTop.params.slidesPerView = originalSlidesPerView, lb.removeClass("lightbox"), 
            $("#wpadminbar").show(), options.galleryTop.destroy(!1, !0), options.galleryTop.init(), 
            setTimeout(function() {
                options.galleryTop.onResize();
            }, 150), options.galleryTop.update(!0), options.galleryTop.slideTo(activeIndex, 0), 
            options.galleryTop.enableKeyboardControl(), options.galleryThumbs.onResize && options.galleryThumbs.onResize(), 
            $(document).off("keydown", lbHandleKeyboard), $("body").css({
                overflow: ""
            });
        }
        function lbHandleKeyboard(e) {
            switch (e.keyCode) {
              case 27:
                hideLightbox(), e.preventDefault && e.preventDefault();
            }
        }
        var lb = this, options = $.extend({
            galleryTop: [],
            galleryThumbs: []
        }, prop), originalSlidesPerView = options.galleryTop.params.slidesPerView;
        lb.on("click", ".gallery-top .swiper-slide.swiper-slide-active img", function(e) {
            lb.hasClass("lightbox") ? $(this).parent().hasClass("zoomEnabled") || (_enableZoom(options.galleryTop), 
            $(this).parent().addClass("zoomEnabled")) : showLightbox();
        }), lb.on("click", ".modal-header .close", function(e) {
            hideLightbox();
        }), setViewOriginalHref(options.galleryTop), options.galleryTop.on("slideChangeStart", function(s) {
            setViewOriginalHref(s);
        }), options.galleryTop.on("touchEnd", function(s, e) {
            var touches = s.touches, diff = touches.currentY - touches.startY;
            return diff > 100 ? (e.preventDefault(), setTimeout(function() {
                hideLightbox();
            }, 50), !1) : void 0;
        });
        var _enableZoom = function() {
            var scroller = void 0;
            return function(swiper) {
                void 0 !== scroller && scroller.destroy(), scroller = new IScroll($(swiper.container).find(".swiper-slide-active")[0], {
                    hideScrollbar: !0,
                    zoom: !0,
                    scrollX: !0,
                    scrollY: !0,
                    mouseWheel: !0,
                    wheelAction: "zoom"
                }), scroller.on("zoomEnd", function(e) {
                    var slide = $(this.wrapper);
                    1 == parseInt(this.scale) ? slide.removeClass("swiper-no-swiping") : slide.addClass("swiper-no-swiping");
                }), scroller.on("zoomStart", function(e) {
                    var slide = $(this.wrapper);
                    "touchstart" === e.type ? slide.addClass("swiper-no-swiping") : "touchend" === e.type && (slide.removeClass("swiper-no-swiping"), 
                    this.wrapperOffsetLeft = 0);
                });
            };
        }();
        return this;
    };
}(jQuery);