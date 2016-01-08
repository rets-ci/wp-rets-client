!function($) {
    $.fn.wpp_rs_lb = function(prop) {
        function setViewOriginalHref(s) {
            var activeIndex = s.activeIndex, href = $(s.slides[activeIndex]).data("src");
            lb.find(".viewOriginal").attr("href", href);
        }
        function showLightbox() {
            var activeIndex = options.galleryTop.activeIndex;
            options.galleryTop.params.slidesPerView = 1, options.galleryTop.params.noSwiping = !0, 
            loadFullImageLazy(), lb.addClass("lightbox"), $("#wpadminbar").hide(), options.galleryTop.update(), 
            options.galleryTop.lazy.load(), setTimeout(function() {
                options.galleryTop.onResize();
            }, 150), options.galleryTop.slideTo(activeIndex, 0), options.galleryThumbs.onResize && options.galleryThumbs.onResize(), 
            $(document).on("keydown", lbHandleKeyboard), $("body").css({
                overflow: "hidden"
            });
        }
        function loadFullImageLazy(index) {
            lb.hasClass("fullLazyInserted") || $.each(options.galleryTop.slides, function(index, item) {
                var slide = $(item), src = slide.data("src");
                if (src) {
                    var img = slide.find("img");
                    img.addClass("swiper-lazy").attr("data-src", src).attr("data-srcset", " ");
                }
            }), lb.addClass("fullLazyInserted");
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
        return lb.on("click", ".gallery-top .swiper-slide.swiper-slide-active img", function(e) {
            lb.hasClass("lightbox") || showLightbox();
        }), lb.on("click", ".modal-header .close", function(e) {
            hideLightbox();
        }), setViewOriginalHref(options.galleryTop), options.galleryTop.on("slideChangeStart", function(s) {
            setViewOriginalHref(s);
        }), options.galleryTop.on("touchEnd", function(s, e) {
            var touches = s.touches, diff = touches.currentY - touches.startY;
            return diff > 100 ? (e.preventDefault(), setTimeout(function() {
                hideLightbox();
            }, 50), !1) : void 0;
        }), this;
    };
}(jQuery);