jQuery(document).ready(function($) {
    $(".property-resp-slideshow").each(function() {
        var $this = $(this), galleryTop = new Swiper($this.find(".gallery-top"), {
            nextButton: ".swiper-button-next",
            prevButton: ".swiper-button-prev",
            centeredSlides: !0,
            slidesPerView: "auto",
            spaceBetween: 20,
            keyboardControl: !0
        }), galleryThumbs = new Swiper($this.find(".gallery-thumbs"), {
            spaceBetween: 2,
            centeredSlides: !0,
            slidesPerView: "auto",
            touchRatio: 1,
            longSwipesRatio: 1,
            freeModeMomentumRatio: 5,
            keyboardControl: !0,
            simulateTouch: !1
        }), goToClickedSlide = function(e) {
            var clickedIndex = $(this).index();
            return galleryTop.activeIndex != clickedIndex ? (galleryTop.slideTo(clickedIndex), 
            !1) : void 0;
        }, width = galleryTop.container.width();
        galleryTop.container.height(.5625 * width), galleryTop.params.control = galleryThumbs, 
        galleryThumbs.params.control = galleryTop, galleryTop.slides.on("click", goToClickedSlide), 
        galleryThumbs.slides.on("click", goToClickedSlide);
    });
});