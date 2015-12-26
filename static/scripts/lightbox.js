!function(root, factory) {
    "function" == typeof define && define.amd ? define([ "jquery" ], factory) : "object" == typeof exports ? module.exports = factory(require("jquery")) : root.lightbox = factory(root.jQuery);
}(this, function($) {
    function Lightbox(options) {
        this.album = [], this.currentImageIndex = void 0, this.init(), this.options = $.extend({}, this.constructor.defaults), 
        this.option(options);
    }
    return Lightbox.defaults = {
        albumLabel: "Image %1 of %2",
        alwaysShowNavOnTouchDevices: !1,
        fadeDuration: 500,
        fitImagesInViewport: !0,
        positionFromTop: 50,
        resizeDuration: 700,
        showImageNumberLabel: !0,
        wrapAround: !1
    }, Lightbox.prototype.option = function(options) {
        $.extend(this.options, options);
    }, Lightbox.prototype.imageCountLabel = function(currentImageNum, totalImages) {
        return this.options.albumLabel.replace(/%1/g, currentImageNum).replace(/%2/g, totalImages);
    }, Lightbox.prototype.init = function() {
        this.enable(), this.build();
    }, Lightbox.prototype.enable = function() {
        var self = this;
        $("body").on("click", ".swiper-slide.swiper-slide-active[data-lightbox]", function(event) {
            return $(this).hasClass("swiper-slide-active") ? (self.start($(event.currentTarget)), 
            !1) : void 0;
        });
    }, Lightbox.prototype.build = function() {
        var self = this;
        $('<div id="lightboxOverlay" class="lightboxOverlay"></div><div id="lightbox" class="lightbox"><div class="lb-dataContainer"><div class="lb-data"><div class="lb-details"><span class="lb-caption"></span><span class="lb-number"></span></div><div class="lb-closeContainer"><a class="lb-close"></a></div></div></div><div class="lb-outerContainer"><div class="lb-container"><img class="lb-image" src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==" /><div class="lb-loader"><a class="lb-cancel"></a></div></div></div><div class="lb-nav"><a class="lb-prev" href="" ></a><a class="lb-next" href="" ></a></div></div>').appendTo($("body")), 
        this.$lightbox = $("#lightbox"), this.$overlay = $("#lightboxOverlay"), this.$outerContainer = this.$lightbox.find(".lb-outerContainer"), 
        this.$dataContainer = this.$lightbox.find(".lb-dataContainer"), this.$container = this.$lightbox.find(".lb-container"), 
        this.containerTopPadding = parseInt(this.$container.css("padding-top"), 10), this.containerRightPadding = parseInt(this.$container.css("padding-right"), 10), 
        this.containerBottomPadding = parseInt(this.$container.css("padding-bottom"), 10), 
        this.containerLeftPadding = parseInt(this.$container.css("padding-left"), 10), this.$overlay.hide().on("click", function() {
            return self.end(), !1;
        }), this.$lightbox.hide().on("click", function(event) {
            return "lightbox" === $(event.target).attr("id") && self.end(), !1;
        }), this.$outerContainer.on("click", function(event) {
            return "lightbox" === $(event.target).attr("id") && self.end(), !1;
        }), this.$lightbox.find(".lb-prev").on("click", function() {
            return 0 === self.currentImageIndex ? self.changeImage(self.album.length - 1) : self.changeImage(self.currentImageIndex - 1), 
            !1;
        }), this.$lightbox.find(".lb-next").on("click", function() {
            return self.currentImageIndex === self.album.length - 1 ? self.changeImage(0) : self.changeImage(self.currentImageIndex + 1), 
            !1;
        }), this.$lightbox.find(".lb-loader, .lb-close").on("click", function() {
            return self.end(), !1;
        });
    }, Lightbox.prototype.start = function($link) {
        function addToAlbum($link) {
            self.album.push({
                link: $link.data("href"),
                title: $link.attr("data-title") || $link.attr("title")
            });
        }
        var self = this, $window = $(window);
        $window.find("body").css("overflow", "no-scrool"), $window.on("resize", $.proxy(this.sizeOverlay, this)), 
        $window.on("resize", $.proxy(this.resizeImage, this)), $("select, object, embed").css({
            visibility: "hidden"
        }), this.sizeOverlay(), this.album = [];
        var $links, imageNumber = 0, dataLightboxValue = $link.attr("data-lightbox");
        if (dataLightboxValue) {
            $links = $($link.prop("tagName") + '[data-lightbox="' + dataLightboxValue + '"]');
            for (var i = 0; i < $links.length; i = ++i) addToAlbum($($links[i])), $links[i] === $link[0] && (imageNumber = i);
        } else if ("lightbox" === $link.attr("rel")) addToAlbum($link); else {
            $links = $($link.prop("tagName") + '[rel="' + $link.attr("rel") + '"]');
            for (var j = 0; j < $links.length; j = ++j) addToAlbum($($links[j])), $links[j] === $link[0] && (imageNumber = j);
        }
        $window.scrollTop() + this.options.positionFromTop, $window.scrollLeft();
        this.$lightbox.fadeIn(this.options.fadeDuration), this.changeImage(imageNumber), 
        self.$lightbox.find(".lb-image").on("click", function() {
            self.$lightbox.find(".lb-next").trigger("click");
        }), $("html, body").css({
            margin: 0,
            height: "100%"
        }), $("html").css({
            overflow: "hidden"
        }), $("body").addClass("inLightbox");
    }, Lightbox.prototype.changeImage = function(imageNumber) {
        var self = this;
        this.disableKeyboardNav();
        var $image = this.$lightbox.find(".lb-image");
        this.$overlay.fadeIn(this.options.fadeDuration), $(".lb-loader").fadeIn("slow"), 
        this.$lightbox.find(".lb-image, .lb-nav, .lb-prev, .lb-next").hide(), this.$outerContainer.addClass("animating");
        var preloader = new Image();
        preloader.onload = function() {
            var $preloader, imageHeight, imageWidth, maxImageHeight, maxImageWidth, windowHeight, windowWidth;
            $image.attr("src", self.album[imageNumber].link), $image.attr("data-imageNumber", imageNumber), 
            $preloader = $(preloader), $image.width(preloader.width), $image.height(preloader.height), 
            self.options.fitImagesInViewport && (windowWidth = $(window).width(), windowHeight = $(window).height(), 
            maxImageWidth = windowWidth - 5, maxImageHeight = windowHeight - self.$dataContainer.outerHeight(!0) - 5, 
            self.options.maxWidth && self.options.maxWidth < maxImageWidth && (maxImageWidth = self.options.maxWidth), 
            self.options.maxHeight && self.options.maxHeight < maxImageWidth && (maxImageHeight = self.options.maxHeight), 
            preloader.width > maxImageWidth || preloader.height > maxImageHeight ? preloader.width / maxImageWidth > preloader.height / maxImageHeight ? (imageWidth = maxImageWidth, 
            imageHeight = parseInt(preloader.height / (preloader.width / imageWidth), 10), $image.width(imageWidth), 
            $image.height(imageHeight)) : (imageHeight = maxImageHeight, imageWidth = parseInt(preloader.width / (preloader.height / imageHeight), 10), 
            $image.width(imageWidth), $image.height(imageHeight)) : (imageWidth = preloader.width, 
            imageHeight = preloader.height, $image.width(imageWidth), $image.height(imageHeight))), 
            self.sizeContainer(imageWidth, imageHeight, maxImageHeight);
        }, preloader.src = this.album[imageNumber].link, this.currentImageIndex = imageNumber;
    }, Lightbox.prototype.sizeOverlay = function() {
        this.$overlay.width($(window).width()).height($(document).height());
    }, Lightbox.prototype.resizeImage = function() {
        var imageNumber = this.$lightbox.find(".lb-image").attr("data-imageNumber");
        imageNumber && this.changeImage(imageNumber);
    }, Lightbox.prototype.sizeContainer = function(imageWidth, imageHeight, maxImageHeight) {
        function postResize() {
            self.showImage();
        }
        var self = this, oldWidth = this.$outerContainer.outerWidth(), oldHeight = this.$outerContainer.outerHeight(), newWidth = imageWidth, newHeight = imageHeight;
        oldWidth !== newWidth || oldHeight !== newHeight ? this.$outerContainer.animate({
            width: newWidth,
            height: newHeight,
            top: (maxImageHeight - imageHeight) / 2
        }, this.options.resizeDuration, "swing", function() {
            postResize();
        }) : postResize();
    }, Lightbox.prototype.showImage = function() {
        this.$lightbox.find(".lb-loader").stop(!0).hide(), this.$lightbox.find(".lb-image").fadeIn("slow"), 
        this.updateNav(), this.updateDetails(), this.preloadNeighboringImages(), this.enableKeyboardNav();
    }, Lightbox.prototype.updateNav = function() {
        var alwaysShowNav = !1;
        try {
            document.createEvent("TouchEvent"), alwaysShowNav = this.options.alwaysShowNavOnTouchDevices ? !0 : !1;
        } catch (e) {}
        this.$lightbox.find(".lb-nav").show(), this.album.length > 1 && (this.options.wrapAround ? (alwaysShowNav && this.$lightbox.find(".lb-prev, .lb-next").css("opacity", "1"), 
        this.$lightbox.find(".lb-prev, .lb-next").show()) : (this.currentImageIndex > 0 && (this.$lightbox.find(".lb-prev").show(), 
        alwaysShowNav && this.$lightbox.find(".lb-prev").css("opacity", "1")), this.currentImageIndex < this.album.length - 1 && (this.$lightbox.find(".lb-next").show(), 
        alwaysShowNav && this.$lightbox.find(".lb-next").css("opacity", "1"))));
    }, Lightbox.prototype.updateDetails = function() {
        var self = this;
        if ("undefined" != typeof this.album[this.currentImageIndex].title && "" !== this.album[this.currentImageIndex].title && this.$lightbox.find(".lb-caption").html(this.album[this.currentImageIndex].title).fadeIn("fast").find("a").on("click", function(event) {
            void 0 !== $(this).attr("target") ? window.open($(this).data("href"), $(this).attr("target")) : location.href = $(this).data("href");
        }), this.album.length > 1 && this.options.showImageNumberLabel) {
            var labelText = this.imageCountLabel(this.currentImageIndex + 1, this.album.length);
            this.$lightbox.find(".lb-number").text(labelText).fadeIn("fast");
        } else this.$lightbox.find(".lb-number").hide();
        this.$outerContainer.removeClass("animating"), this.$lightbox.find(".lb-dataContainer").fadeIn(this.options.resizeDuration, function() {
            return self.sizeOverlay();
        });
    }, Lightbox.prototype.preloadNeighboringImages = function() {
        if (this.album.length > this.currentImageIndex + 1) {
            var preloadNext = new Image();
            preloadNext.src = this.album[this.currentImageIndex + 1].link;
        }
        if (this.currentImageIndex > 0) {
            var preloadPrev = new Image();
            preloadPrev.src = this.album[this.currentImageIndex - 1].link;
        }
    }, Lightbox.prototype.enableKeyboardNav = function() {
        $(document).on("keyup.keyboard", $.proxy(this.keyboardAction, this));
    }, Lightbox.prototype.disableKeyboardNav = function() {
        $(document).off(".keyboard");
    }, Lightbox.prototype.keyboardAction = function(event) {
        var KEYCODE_ESC = 27, KEYCODE_LEFTARROW = 37, KEYCODE_RIGHTARROW = 39, keycode = event.keyCode, key = String.fromCharCode(keycode).toLowerCase();
        keycode === KEYCODE_ESC || key.match(/x|o|c/) ? this.end() : "p" === key || keycode === KEYCODE_LEFTARROW ? 0 !== this.currentImageIndex ? this.changeImage(this.currentImageIndex - 1) : this.options.wrapAround && this.album.length > 1 && this.changeImage(this.album.length - 1) : ("n" === key || keycode === KEYCODE_RIGHTARROW) && (this.currentImageIndex !== this.album.length - 1 ? this.changeImage(this.currentImageIndex + 1) : this.options.wrapAround && this.album.length > 1 && this.changeImage(0));
    }, Lightbox.prototype.end = function() {
        this.disableKeyboardNav(), $(window).off("resize", this.sizeOverlay), $(window).off("resize", this.resizeImage), 
        this.$lightbox.fadeOut(this.options.fadeDuration), this.$overlay.fadeOut(this.options.fadeDuration), 
        $("select, object, embed").css({
            visibility: "visible"
        }), $("html, body").css({
            margin: "",
            height: "",
            overflow: ""
        }), $("body").removeClass("inLightbox");
    }, new Lightbox();
});