!function($) {
    $.fn.wpp_rs_lb = function(prop) {
        function setViewOriginalHref(s) {
            var activeIndex = s.activeIndex, href = $(s.slides[activeIndex]).data("href");
            lb.find(".viewOriginal").attr("href", href);
        }
        function showLightbox() {
            var activeIndex = options.galleryTop.activeIndex;
            options.galleryTop.params.slidesPerView = 1, lb.addClass("lightbox"), $("#wpadminbar").hide(), 
            options.galleryTop.onResize(), options.galleryTop.update(), options.galleryTop.slideTo(activeIndex, 0), 
            options.galleryThumbs.onResize(), $(document).on("keydown", handleKeyboard), $("body").css({
                overflow: "hidden"
            });
        }
        function hideLightbox() {
            var activeIndex = options.galleryTop.activeIndex;
            options.galleryTop.params.slidesPerView = originalSlidesPerView, lb.removeClass("lightbox"), 
            $("#wpadminbar").show(), options.galleryTop.destroy(!1, !0), options.galleryTop.init(), 
            options.galleryTop.onResize(), options.galleryTop.update(!0), options.galleryTop.slideTo(activeIndex, 0), 
            options.galleryThumbs.onResize(), $(document).off("keydown", handleKeyboard), $("body").css({
                overflow: ""
            });
        }
        function handleKeyboard(e) {
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
            lb.hasClass("lightbox") ? hideLightbox() : showLightbox();
        }), lb.on("click", ".modal-header .close", function(e) {
            hideLightbox();
        }), setViewOriginalHref(options.galleryTop), options.galleryTop.on("onSlideChangeStart", function(s) {
            setViewOriginalHref(s);
        }), this;
    };
}(jQuery);