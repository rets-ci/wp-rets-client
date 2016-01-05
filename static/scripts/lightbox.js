!function($) {
    $.fn.wpp_rs_lb = function(prop) {
        function showLightbox() {
            lb.addClass("lightbox"), $("#wpadminbar").hide(), options.galleryTop.onResize(), 
            options.galleryThumbs.onResize(), $(document).on("keydown", handleKeyboard), $("body").css({
                overflow: "hidden"
            });
        }
        function hideLightbox() {
            $("body").css({
                overflow: ""
            }), lb.removeClass("lightbox"), $("#wpadminbar").show(), options.galleryTop.onResize(), 
            options.galleryThumbs.onResize(), $(document).off("keydown", handleKeyboard);
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
        }, prop);
        return this.on("click", ".swiper-slide.swiper-slide-active", function(e) {
            lb.hasClass("lightbox") ? hideLightbox() : showLightbox();
        });
    };
}(jQuery);