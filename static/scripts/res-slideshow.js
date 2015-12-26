jQuery(document).ready(function($) {
    $(".property-resp-slideshow").each(function() {
        var $this = $(this), galleryTop = new Swiper($this.find(".gallery-top"), {
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev",
            centeredSlides: !0,
            slidesPerView: "auto",
            spaceBetween: 10,
            keyboardControl: !0,
            preventClicks: !1
        }), galleryThumbs = new Swiper($this.find(".gallery-thumbs"), {
            spaceBetween: 2,
            centeredSlides: !0,
            slidesPerView: "auto",
            touchRatio: 1,
            longSwipesRatio: 1,
            freeModeMomentumRatio: 5,
            simulateTouch: !1
        }), goToClickedSlide = function(e) {
            var clickedIndex = $(this).index();
            return galleryTop.activeIndex != clickedIndex ? (galleryTop.slideTo(clickedIndex), 
            !1) : void 0;
        };
        galleryTop.container.on("click", ".swiper-slide", goToClickedSlide), galleryThumbs.container.on("click", ".swiper-slide", goToClickedSlide), 
        jQuery(window).on("orientationchange", galleryTop.onResize), galleryTop.on("onSlideChangeStart", function(e, s) {
            galleryThumbs.slideTo(e.activeIndex);
        });
    });
});