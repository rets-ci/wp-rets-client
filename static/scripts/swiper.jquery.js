!function() {
    "use strict";
    function addLibraryPlugin(lib) {
        lib.fn.swiper = function(params) {
            var firstInstance;
            return lib(this).each(function() {
                var s = new Swiper(this, params);
                firstInstance || (firstInstance = s);
            }), firstInstance;
        };
    }
    var $, Swiper = function(container, params) {
        function isH() {
            return "horizontal" === s.params.direction;
        }
        function round(a) {
            return Math.floor(a);
        }
        function autoplay() {
            s.autoplayTimeoutId = setTimeout(function() {
                s.params.loop ? (s.fixLoop(), s._slideNext()) : s.isEnd ? params.autoplayStopOnLast ? s.stopAutoplay() : s._slideTo(0) : s._slideNext();
            }, s.params.autoplay);
        }
        function findElementInEvent(e, selector) {
            var el = $(e.target);
            if (!el.is(selector)) if ("string" == typeof selector) el = el.parents(selector); else if (selector.nodeType) {
                var found;
                return el.parents().each(function(index, _el) {
                    _el === selector && (found = selector);
                }), found ? selector : void 0;
            }
            return 0 === el.length ? void 0 : el[0];
        }
        function initObserver(target, options) {
            options = options || {};
            var ObserverFunc = window.MutationObserver || window.WebkitMutationObserver, observer = new ObserverFunc(function(mutations) {
                mutations.forEach(function(mutation) {
                    s.onResize(!0), s.emit("onObserverUpdate", s, mutation);
                });
            });
            observer.observe(target, {
                attributes: "undefined" == typeof options.attributes ? !0 : options.attributes,
                childList: "undefined" == typeof options.childList ? !0 : options.childList,
                characterData: "undefined" == typeof options.characterData ? !0 : options.characterData
            }), s.observers.push(observer);
        }
        function handleKeyboard(e) {
            if (console.log(e), !$("body").hasClass("inLightbox")) {
                e.originalEvent && (e = e.originalEvent);
                var kc = e.keyCode || e.charCode;
                if (!s.params.allowSwipeToNext && (isH() && 39 === kc || !isH() && 40 === kc)) return !1;
                if (!s.params.allowSwipeToPrev && (isH() && 37 === kc || !isH() && 38 === kc)) return !1;
                if (!(e.shiftKey || e.altKey || e.ctrlKey || e.metaKey || document.activeElement && document.activeElement.nodeName && ("input" === document.activeElement.nodeName.toLowerCase() || "textarea" === document.activeElement.nodeName.toLowerCase()))) {
                    if (37 === kc || 39 === kc || 38 === kc || 40 === kc) {
                        var inView = !1;
                        if (s.container.parents(".swiper-slide").length > 0 && 0 === s.container.parents(".swiper-slide-active").length) return;
                        var windowScroll = {
                            left: window.pageXOffset,
                            top: window.pageYOffset
                        }, windowWidth = window.innerWidth, windowHeight = window.innerHeight, swiperOffset = s.container.offset();
                        s.rtl && (swiperOffset.left = swiperOffset.left - s.container[0].scrollLeft);
                        for (var swiperCoord = [ [ swiperOffset.left, swiperOffset.top ], [ swiperOffset.left + s.width, swiperOffset.top ], [ swiperOffset.left, swiperOffset.top + s.height ], [ swiperOffset.left + s.width, swiperOffset.top + s.height ] ], i = 0; i < swiperCoord.length; i++) {
                            var point = swiperCoord[i];
                            point[0] >= windowScroll.left && point[0] <= windowScroll.left + windowWidth && point[1] >= windowScroll.top && point[1] <= windowScroll.top + windowHeight && (inView = !0);
                        }
                        if (!inView) return;
                    }
                    isH() ? ((37 === kc || 39 === kc) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), 
                    (39 === kc && !s.rtl || 37 === kc && s.rtl) && s.slideNext(), (37 === kc && !s.rtl || 39 === kc && s.rtl) && s.slidePrev()) : ((38 === kc || 40 === kc) && (e.preventDefault ? e.preventDefault() : e.returnValue = !1), 
                    40 === kc && s.slideNext(), 38 === kc && s.slidePrev());
                }
            }
        }
        function handleMousewheel(e) {
            e.originalEvent && (e = e.originalEvent);
            var we = s.mousewheel.event, delta = 0, rtlFactor = s.rtl ? -1 : 1;
            if (e.detail) delta = -e.detail; else if ("mousewheel" === we) if (s.params.mousewheelForceToAxis) if (isH()) {
                if (!(Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY))) return;
                delta = e.wheelDeltaX * rtlFactor;
            } else {
                if (!(Math.abs(e.wheelDeltaY) > Math.abs(e.wheelDeltaX))) return;
                delta = e.wheelDeltaY;
            } else delta = Math.abs(e.wheelDeltaX) > Math.abs(e.wheelDeltaY) ? -e.wheelDeltaX * rtlFactor : -e.wheelDeltaY; else if ("DOMMouseScroll" === we) delta = -e.detail; else if ("wheel" === we) if (s.params.mousewheelForceToAxis) if (isH()) {
                if (!(Math.abs(e.deltaX) > Math.abs(e.deltaY))) return;
                delta = -e.deltaX * rtlFactor;
            } else {
                if (!(Math.abs(e.deltaY) > Math.abs(e.deltaX))) return;
                delta = -e.deltaY;
            } else delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? -e.deltaX * rtlFactor : -e.deltaY;
            if (0 !== delta) {
                if (s.params.mousewheelInvert && (delta = -delta), s.params.freeMode) {
                    var position = s.getWrapperTranslate() + delta * s.params.mousewheelSensitivity, wasBeginning = s.isBeginning, wasEnd = s.isEnd;
                    if (position >= s.minTranslate() && (position = s.minTranslate()), position <= s.maxTranslate() && (position = s.maxTranslate()), 
                    s.setWrapperTransition(0), s.setWrapperTranslate(position), s.updateProgress(), 
                    s.updateActiveIndex(), (!wasBeginning && s.isBeginning || !wasEnd && s.isEnd) && s.updateClasses(), 
                    s.params.freeModeSticky && (clearTimeout(s.mousewheel.timeout), s.mousewheel.timeout = setTimeout(function() {
                        s.slideReset();
                    }, 300)), 0 === position || position === s.maxTranslate()) return;
                } else {
                    if (new window.Date().getTime() - s.mousewheel.lastScrollTime > 60) if (0 > delta) if (s.isEnd && !s.params.loop || s.animating) {
                        if (s.params.mousewheelReleaseOnEdges) return !0;
                    } else s.slideNext(); else if (s.isBeginning && !s.params.loop || s.animating) {
                        if (s.params.mousewheelReleaseOnEdges) return !0;
                    } else s.slidePrev();
                    s.mousewheel.lastScrollTime = new window.Date().getTime();
                }
                return s.params.autoplay && s.stopAutoplay(), e.preventDefault ? e.preventDefault() : e.returnValue = !1, 
                !1;
            }
        }
        function setParallaxTransform(el, progress) {
            el = $(el);
            var p, pX, pY, rtlFactor = s.rtl ? -1 : 1;
            p = el.attr("data-swiper-parallax") || "0", pX = el.attr("data-swiper-parallax-x"), 
            pY = el.attr("data-swiper-parallax-y"), pX || pY ? (pX = pX || "0", pY = pY || "0") : isH() ? (pX = p, 
            pY = "0") : (pY = p, pX = "0"), pX = pX.indexOf("%") >= 0 ? parseInt(pX, 10) * progress * rtlFactor + "%" : pX * progress * rtlFactor + "px", 
            pY = pY.indexOf("%") >= 0 ? parseInt(pY, 10) * progress + "%" : pY * progress + "px", 
            el.transform("translate3d(" + pX + ", " + pY + ",0px)");
        }
        function normalizeEventName(eventName) {
            return 0 !== eventName.indexOf("on") && (eventName = eventName[0] !== eventName[0].toUpperCase() ? "on" + eventName[0].toUpperCase() + eventName.substring(1) : "on" + eventName), 
            eventName;
        }
        if (!(this instanceof Swiper)) return new Swiper(container, params);
        var defaults = {
            direction: "horizontal",
            touchEventsTarget: "container",
            initialSlide: 0,
            speed: 300,
            autoplay: !1,
            autoplayDisableOnInteraction: !0,
            iOSEdgeSwipeDetection: !1,
            iOSEdgeSwipeThreshold: 20,
            freeMode: !1,
            freeModeMomentum: !0,
            freeModeMomentumRatio: 1,
            freeModeMomentumBounce: !0,
            freeModeMomentumBounceRatio: 1,
            freeModeSticky: !1,
            freeModeMinimumVelocity: .02,
            autoHeight: !1,
            setWrapperSize: !1,
            virtualTranslate: !1,
            effect: "slide",
            coverflow: {
                rotate: 50,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: !0
            },
            cube: {
                slideShadows: !0,
                shadow: !0,
                shadowOffset: 20,
                shadowScale: .94
            },
            fade: {
                crossFade: !1
            },
            parallax: !1,
            scrollbar: null,
            scrollbarHide: !0,
            scrollbarDraggable: !1,
            scrollbarSnapOnRelease: !1,
            keyboardControl: !1,
            mousewheelControl: !1,
            mousewheelReleaseOnEdges: !1,
            mousewheelInvert: !1,
            mousewheelForceToAxis: !1,
            mousewheelSensitivity: 1,
            hashnav: !1,
            breakpoints: void 0,
            spaceBetween: 0,
            slidesPerView: 1,
            slidesPerColumn: 1,
            slidesPerColumnFill: "column",
            slidesPerGroup: 1,
            centeredSlides: !1,
            slidesOffsetBefore: 0,
            slidesOffsetAfter: 0,
            roundLengths: !1,
            touchRatio: 1,
            touchAngle: 45,
            simulateTouch: !0,
            shortSwipes: !0,
            longSwipes: !0,
            longSwipesRatio: .5,
            longSwipesMs: 300,
            followFinger: !0,
            onlyExternal: !1,
            threshold: 0,
            touchMoveStopPropagation: !0,
            pagination: null,
            paginationElement: "span",
            paginationClickable: !1,
            paginationHide: !1,
            paginationBulletRender: null,
            resistance: !0,
            resistanceRatio: .85,
            nextButton: null,
            prevButton: null,
            watchSlidesProgress: !1,
            watchSlidesVisibility: !1,
            grabCursor: !1,
            preventClicks: !0,
            preventClicksPropagation: !0,
            slideToClickedSlide: !1,
            lazyLoading: !1,
            lazyLoadingInPrevNext: !1,
            lazyLoadingOnTransitionStart: !1,
            preloadImages: !0,
            updateOnImagesReady: !0,
            loop: !1,
            loopAdditionalSlides: 0,
            loopedSlides: null,
            control: void 0,
            controlInverse: !1,
            controlBy: "slide",
            allowSwipeToPrev: !0,
            allowSwipeToNext: !0,
            swipeHandler: null,
            noSwiping: !0,
            noSwipingClass: "swiper-no-swiping",
            slideClass: "swiper-slide",
            slideActiveClass: "swiper-slide-active",
            slideVisibleClass: "swiper-slide-visible",
            slideDuplicateClass: "swiper-slide-duplicate",
            slideNextClass: "swiper-slide-next",
            slidePrevClass: "swiper-slide-prev",
            wrapperClass: "swiper-wrapper",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
            buttonDisabledClass: "swiper-button-disabled",
            paginationHiddenClass: "swiper-pagination-hidden",
            observer: !1,
            observeParents: !1,
            a11y: !1,
            prevSlideMessage: "Previous slide",
            nextSlideMessage: "Next slide",
            firstSlideMessage: "This is the first slide",
            lastSlideMessage: "This is the last slide",
            paginationBulletMessage: "Go to slide {{index}}",
            runCallbacksOnInit: !0
        }, initialVirtualTranslate = params && params.virtualTranslate;
        params = params || {};
        var originalParams = {};
        for (var param in params) if ("object" != typeof params[param] || (params[param].nodeType || params[param] === window || params[param] === document || "undefined" != typeof Dom7 && params[param] instanceof Dom7 || "undefined" != typeof jQuery && params[param] instanceof jQuery)) originalParams[param] = params[param]; else {
            originalParams[param] = {};
            for (var deepParam in params[param]) originalParams[param][deepParam] = params[param][deepParam];
        }
        for (var def in defaults) if ("undefined" == typeof params[def]) params[def] = defaults[def]; else if ("object" == typeof params[def]) for (var deepDef in defaults[def]) "undefined" == typeof params[def][deepDef] && (params[def][deepDef] = defaults[def][deepDef]);
        var s = this;
        if (s.params = params, s.originalParams = originalParams, s.classNames = [], "undefined" != typeof $ && "undefined" != typeof Dom7 && ($ = Dom7), 
        ("undefined" != typeof $ || ($ = "undefined" == typeof Dom7 ? window.Dom7 || window.Zepto || window.jQuery : Dom7)) && (s.$ = $, 
        s.currentBreakpoint = void 0, s.getActiveBreakpoint = function() {
            if (!s.params.breakpoints) return !1;
            var point, breakpoint = !1, points = [];
            for (point in s.params.breakpoints) s.params.breakpoints.hasOwnProperty(point) && points.push(point);
            points.sort(function(a, b) {
                return parseInt(a, 10) > parseInt(b, 10);
            });
            for (var i = 0; i < points.length; i++) point = points[i], point >= window.innerWidth && !breakpoint && (breakpoint = point);
            return breakpoint || "max";
        }, s.setBreakpoint = function() {
            var breakpoint = s.getActiveBreakpoint();
            if (breakpoint && s.currentBreakpoint !== breakpoint) {
                var breakPointsParams = breakpoint in s.params.breakpoints ? s.params.breakpoints[breakpoint] : s.originalParams;
                for (var param in breakPointsParams) s.params[param] = breakPointsParams[param];
                s.currentBreakpoint = breakpoint;
            }
        }, s.params.breakpoints && s.setBreakpoint(), s.container = $(container), 0 !== s.container.length)) {
            if (s.container.length > 1) return void s.container.each(function() {
                new Swiper(this, params);
            });
            s.container[0].swiper = s, s.container.data("swiper", s), s.classNames.push("swiper-container-" + s.params.direction), 
            s.params.freeMode && s.classNames.push("swiper-container-free-mode"), s.support.flexbox || (s.classNames.push("swiper-container-no-flexbox"), 
            s.params.slidesPerColumn = 1), s.params.autoHeight && s.classNames.push("swiper-container-autoheight"), 
            (s.params.parallax || s.params.watchSlidesVisibility) && (s.params.watchSlidesProgress = !0), 
            [ "cube", "coverflow" ].indexOf(s.params.effect) >= 0 && (s.support.transforms3d ? (s.params.watchSlidesProgress = !0, 
            s.classNames.push("swiper-container-3d")) : s.params.effect = "slide"), "slide" !== s.params.effect && s.classNames.push("swiper-container-" + s.params.effect), 
            "cube" === s.params.effect && (s.params.resistanceRatio = 0, s.params.slidesPerView = 1, 
            s.params.slidesPerColumn = 1, s.params.slidesPerGroup = 1, s.params.centeredSlides = !1, 
            s.params.spaceBetween = 0, s.params.virtualTranslate = !0, s.params.setWrapperSize = !1), 
            "fade" === s.params.effect && (s.params.slidesPerView = 1, s.params.slidesPerColumn = 1, 
            s.params.slidesPerGroup = 1, s.params.watchSlidesProgress = !0, s.params.spaceBetween = 0, 
            "undefined" == typeof initialVirtualTranslate && (s.params.virtualTranslate = !0)), 
            s.params.grabCursor && s.support.touch && (s.params.grabCursor = !1), s.wrapper = s.container.children("." + s.params.wrapperClass), 
            s.params.pagination && (s.paginationContainer = $(s.params.pagination), s.params.paginationClickable && s.paginationContainer.addClass("swiper-pagination-clickable")), 
            s.rtl = isH() && ("rtl" === s.container[0].dir.toLowerCase() || "rtl" === s.container.css("direction")), 
            s.rtl && s.classNames.push("swiper-container-rtl"), s.rtl && (s.wrongRTL = "-webkit-box" === s.wrapper.css("display")), 
            s.params.slidesPerColumn > 1 && s.classNames.push("swiper-container-multirow"), 
            s.device.android && s.classNames.push("swiper-container-android"), s.container.addClass(s.classNames.join(" ")), 
            s.translate = 0, s.progress = 0, s.velocity = 0, s.lockSwipeToNext = function() {
                s.params.allowSwipeToNext = !1;
            }, s.lockSwipeToPrev = function() {
                s.params.allowSwipeToPrev = !1;
            }, s.lockSwipes = function() {
                s.params.allowSwipeToNext = s.params.allowSwipeToPrev = !1;
            }, s.unlockSwipeToNext = function() {
                s.params.allowSwipeToNext = !0;
            }, s.unlockSwipeToPrev = function() {
                s.params.allowSwipeToPrev = !0;
            }, s.unlockSwipes = function() {
                s.params.allowSwipeToNext = s.params.allowSwipeToPrev = !0;
            }, s.params.grabCursor && (s.container[0].style.cursor = "move", s.container[0].style.cursor = "-webkit-grab", 
            s.container[0].style.cursor = "-moz-grab", s.container[0].style.cursor = "grab"), 
            s.imagesToLoad = [], s.imagesLoaded = 0, s.loadImage = function(imgElement, src, srcset, checkForComplete, callback) {
                function onReady() {
                    callback && callback();
                }
                var image;
                imgElement.complete && checkForComplete ? onReady() : src ? (image = new window.Image(), 
                image.onload = onReady, image.onerror = onReady, srcset && (image.srcset = srcset), 
                src && (image.src = src)) : onReady();
            }, s.preloadImages = function() {
                function _onReady() {
                    "undefined" != typeof s && null !== s && (void 0 !== s.imagesLoaded && s.imagesLoaded++, 
                    s.imagesLoaded === s.imagesToLoad.length && (s.params.updateOnImagesReady && s.update(), 
                    s.emit("onImagesReady", s)));
                }
                s.imagesToLoad = s.container.find("img");
                for (var i = 0; i < s.imagesToLoad.length; i++) s.loadImage(s.imagesToLoad[i], s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute("src"), s.imagesToLoad[i].srcset || s.imagesToLoad[i].getAttribute("srcset"), !0, _onReady);
            }, s.autoplayTimeoutId = void 0, s.autoplaying = !1, s.autoplayPaused = !1, s.startAutoplay = function() {
                return "undefined" != typeof s.autoplayTimeoutId ? !1 : s.params.autoplay ? s.autoplaying ? !1 : (s.autoplaying = !0, 
                s.emit("onAutoplayStart", s), void autoplay()) : !1;
            }, s.stopAutoplay = function(internal) {
                s.autoplayTimeoutId && (s.autoplayTimeoutId && clearTimeout(s.autoplayTimeoutId), 
                s.autoplaying = !1, s.autoplayTimeoutId = void 0, s.emit("onAutoplayStop", s));
            }, s.pauseAutoplay = function(speed) {
                s.autoplayPaused || (s.autoplayTimeoutId && clearTimeout(s.autoplayTimeoutId), s.autoplayPaused = !0, 
                0 === speed ? (s.autoplayPaused = !1, autoplay()) : s.wrapper.transitionEnd(function() {
                    s && (s.autoplayPaused = !1, s.autoplaying ? autoplay() : s.stopAutoplay());
                }));
            }, s.minTranslate = function() {
                return -s.snapGrid[0];
            }, s.maxTranslate = function() {
                return -s.snapGrid[s.snapGrid.length - 1];
            }, s.updateAutoHeight = function() {
                var newHeight = s.slides.eq(s.activeIndex)[0].offsetHeight;
                newHeight && s.wrapper.css("height", s.slides.eq(s.activeIndex)[0].offsetHeight + "px");
            }, s.updateContainerSize = function() {
                var width, height;
                width = "undefined" != typeof s.params.width ? s.params.width : s.container[0].clientWidth, 
                height = "undefined" != typeof s.params.height ? s.params.height : s.container[0].clientHeight, 
                0 === width && isH() || 0 === height && !isH() || (width = width - parseInt(s.container.css("padding-left"), 10) - parseInt(s.container.css("padding-right"), 10), 
                height = height - parseInt(s.container.css("padding-top"), 10) - parseInt(s.container.css("padding-bottom"), 10), 
                s.width = width, s.height = height, s.size = isH() ? s.width : s.height);
            }, s.updateSlidesSize = function() {
                s.slides = s.wrapper.children("." + s.params.slideClass), s.snapGrid = [], s.slidesGrid = [], 
                s.slidesSizesGrid = [];
                var i, spaceBetween = s.params.spaceBetween, slidePosition = -s.params.slidesOffsetBefore, prevSlideSize = 0, index = 0;
                "string" == typeof spaceBetween && spaceBetween.indexOf("%") >= 0 && (spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * s.size), 
                s.virtualSize = -spaceBetween, s.rtl ? s.slides.css({
                    marginLeft: "",
                    marginTop: ""
                }) : s.slides.css({
                    marginRight: "",
                    marginBottom: ""
                });
                var slidesNumberEvenToRows;
                s.params.slidesPerColumn > 1 && (slidesNumberEvenToRows = Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn ? s.slides.length : Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn, 
                "auto" !== s.params.slidesPerView && "row" === s.params.slidesPerColumnFill && (slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows, s.params.slidesPerView * s.params.slidesPerColumn)));
                var slideSize, slidesPerColumn = s.params.slidesPerColumn, slidesPerRow = slidesNumberEvenToRows / slidesPerColumn, numFullColumns = slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);
                for (i = 0; i < s.slides.length; i++) {
                    slideSize = 0;
                    var slide = s.slides.eq(i);
                    if (s.params.slidesPerColumn > 1) {
                        var newSlideOrderIndex, column, row;
                        "column" === s.params.slidesPerColumnFill ? (column = Math.floor(i / slidesPerColumn), 
                        row = i - column * slidesPerColumn, (column > numFullColumns || column === numFullColumns && row === slidesPerColumn - 1) && ++row >= slidesPerColumn && (row = 0, 
                        column++), newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn, 
                        slide.css({
                            "-webkit-box-ordinal-group": newSlideOrderIndex,
                            "-moz-box-ordinal-group": newSlideOrderIndex,
                            "-ms-flex-order": newSlideOrderIndex,
                            "-webkit-order": newSlideOrderIndex,
                            order: newSlideOrderIndex
                        })) : (row = Math.floor(i / slidesPerRow), column = i - row * slidesPerRow), slide.css({
                            "margin-top": 0 !== row && s.params.spaceBetween && s.params.spaceBetween + "px"
                        }).attr("data-swiper-column", column).attr("data-swiper-row", row);
                    }
                    "none" !== slide.css("display") && ("auto" === s.params.slidesPerView ? (slideSize = isH() ? slide.outerWidth(!0) : slide.outerHeight(!0), 
                    s.params.roundLengths && (slideSize = round(slideSize))) : (slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView, 
                    s.params.roundLengths && (slideSize = round(slideSize)), isH() ? s.slides[i].style.width = slideSize + "px" : s.slides[i].style.height = slideSize + "px"), 
                    s.slides[i].swiperSlideSize = slideSize, s.slidesSizesGrid.push(slideSize), s.params.centeredSlides ? (slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween, 
                    0 === i && (slidePosition = slidePosition - s.size / 2 - spaceBetween), Math.abs(slidePosition) < .001 && (slidePosition = 0), 
                    index % s.params.slidesPerGroup === 0 && s.snapGrid.push(slidePosition), s.slidesGrid.push(slidePosition)) : (index % s.params.slidesPerGroup === 0 && s.snapGrid.push(slidePosition), 
                    s.slidesGrid.push(slidePosition), slidePosition = slidePosition + slideSize + spaceBetween), 
                    s.virtualSize += slideSize + spaceBetween, prevSlideSize = slideSize, index++);
                }
                s.virtualSize = Math.max(s.virtualSize, s.size) + s.params.slidesOffsetAfter;
                var newSlidesGrid;
                if (s.rtl && s.wrongRTL && ("slide" === s.params.effect || "coverflow" === s.params.effect) && s.wrapper.css({
                    width: s.virtualSize + s.params.spaceBetween + "px"
                }), (!s.support.flexbox || s.params.setWrapperSize) && (isH() ? s.wrapper.css({
                    width: s.virtualSize + s.params.spaceBetween + "px"
                }) : s.wrapper.css({
                    height: s.virtualSize + s.params.spaceBetween + "px"
                })), s.params.slidesPerColumn > 1 && (s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows, 
                s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween, 
                s.wrapper.css({
                    width: s.virtualSize + s.params.spaceBetween + "px"
                }), s.params.centeredSlides)) {
                    for (newSlidesGrid = [], i = 0; i < s.snapGrid.length; i++) s.snapGrid[i] < s.virtualSize + s.snapGrid[0] && newSlidesGrid.push(s.snapGrid[i]);
                    s.snapGrid = newSlidesGrid;
                }
                if (!s.params.centeredSlides) {
                    for (newSlidesGrid = [], i = 0; i < s.snapGrid.length; i++) s.snapGrid[i] <= s.virtualSize - s.size && newSlidesGrid.push(s.snapGrid[i]);
                    s.snapGrid = newSlidesGrid, Math.floor(s.virtualSize - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1]) && s.snapGrid.push(s.virtualSize - s.size);
                }
                0 === s.snapGrid.length && (s.snapGrid = [ 0 ]), 0 !== s.params.spaceBetween && (isH() ? s.rtl ? s.slides.css({
                    marginLeft: spaceBetween + "px"
                }) : s.slides.css({
                    marginRight: spaceBetween + "px"
                }) : s.slides.css({
                    marginBottom: spaceBetween + "px"
                })), s.params.watchSlidesProgress && s.updateSlidesOffset();
            }, s.updateSlidesOffset = function() {
                for (var i = 0; i < s.slides.length; i++) s.slides[i].swiperSlideOffset = isH() ? s.slides[i].offsetLeft : s.slides[i].offsetTop;
            }, s.updateSlidesProgress = function(translate) {
                if ("undefined" == typeof translate && (translate = s.translate || 0), 0 !== s.slides.length) {
                    "undefined" == typeof s.slides[0].swiperSlideOffset && s.updateSlidesOffset();
                    var offsetCenter = -translate;
                    s.rtl && (offsetCenter = translate), s.slides.removeClass(s.params.slideVisibleClass);
                    for (var i = 0; i < s.slides.length; i++) {
                        var slide = s.slides[i], slideProgress = (offsetCenter - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);
                        if (s.params.watchSlidesVisibility) {
                            var slideBefore = -(offsetCenter - slide.swiperSlideOffset), slideAfter = slideBefore + s.slidesSizesGrid[i], isVisible = slideBefore >= 0 && slideBefore < s.size || slideAfter > 0 && slideAfter <= s.size || 0 >= slideBefore && slideAfter >= s.size;
                            isVisible && s.slides.eq(i).addClass(s.params.slideVisibleClass);
                        }
                        slide.progress = s.rtl ? -slideProgress : slideProgress;
                    }
                }
            }, s.updateProgress = function(translate) {
                "undefined" == typeof translate && (translate = s.translate || 0);
                var translatesDiff = s.maxTranslate() - s.minTranslate(), wasBeginning = s.isBeginning, wasEnd = s.isEnd;
                0 === translatesDiff ? (s.progress = 0, s.isBeginning = s.isEnd = !0) : (s.progress = (translate - s.minTranslate()) / translatesDiff, 
                s.isBeginning = s.progress <= 0, s.isEnd = s.progress >= 1), s.isBeginning && !wasBeginning && s.emit("onReachBeginning", s), 
                s.isEnd && !wasEnd && s.emit("onReachEnd", s), s.params.watchSlidesProgress && s.updateSlidesProgress(translate), 
                s.emit("onProgress", s, s.progress);
            }, s.updateActiveIndex = function() {
                var newActiveIndex, i, snapIndex, translate = s.rtl ? s.translate : -s.translate;
                for (i = 0; i < s.slidesGrid.length; i++) "undefined" != typeof s.slidesGrid[i + 1] ? translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2 ? newActiveIndex = i : translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] && (newActiveIndex = i + 1) : translate >= s.slidesGrid[i] && (newActiveIndex = i);
                (0 > newActiveIndex || "undefined" == typeof newActiveIndex) && (newActiveIndex = 0), 
                snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup), snapIndex >= s.snapGrid.length && (snapIndex = s.snapGrid.length - 1), 
                newActiveIndex !== s.activeIndex && (s.snapIndex = snapIndex, s.previousIndex = s.activeIndex, 
                s.activeIndex = newActiveIndex, s.updateClasses());
            }, s.updateClasses = function() {
                s.slides.removeClass(s.params.slideActiveClass + " " + s.params.slideNextClass + " " + s.params.slidePrevClass);
                var activeSlide = s.slides.eq(s.activeIndex);
                if (activeSlide.addClass(s.params.slideActiveClass), activeSlide.next("." + s.params.slideClass).addClass(s.params.slideNextClass), 
                activeSlide.prev("." + s.params.slideClass).addClass(s.params.slidePrevClass), s.bullets && s.bullets.length > 0) {
                    s.bullets.removeClass(s.params.bulletActiveClass);
                    var bulletIndex;
                    s.params.loop ? (bulletIndex = Math.ceil(s.activeIndex - s.loopedSlides) / s.params.slidesPerGroup, 
                    bulletIndex > s.slides.length - 1 - 2 * s.loopedSlides && (bulletIndex -= s.slides.length - 2 * s.loopedSlides), 
                    bulletIndex > s.bullets.length - 1 && (bulletIndex -= s.bullets.length)) : bulletIndex = "undefined" != typeof s.snapIndex ? s.snapIndex : s.activeIndex || 0, 
                    s.paginationContainer.length > 1 ? s.bullets.each(function() {
                        $(this).index() === bulletIndex && $(this).addClass(s.params.bulletActiveClass);
                    }) : s.bullets.eq(bulletIndex).addClass(s.params.bulletActiveClass);
                }
                s.params.loop || (s.params.prevButton && (s.isBeginning ? ($(s.params.prevButton).addClass(s.params.buttonDisabledClass), 
                s.params.a11y && s.a11y && s.a11y.disable($(s.params.prevButton))) : ($(s.params.prevButton).removeClass(s.params.buttonDisabledClass), 
                s.params.a11y && s.a11y && s.a11y.enable($(s.params.prevButton)))), s.params.nextButton && (s.isEnd ? ($(s.params.nextButton).addClass(s.params.buttonDisabledClass), 
                s.params.a11y && s.a11y && s.a11y.disable($(s.params.nextButton))) : ($(s.params.nextButton).removeClass(s.params.buttonDisabledClass), 
                s.params.a11y && s.a11y && s.a11y.enable($(s.params.nextButton)))));
            }, s.updatePagination = function() {
                if (s.params.pagination && s.paginationContainer && s.paginationContainer.length > 0) {
                    for (var bulletsHTML = "", numberOfBullets = s.params.loop ? Math.ceil((s.slides.length - 2 * s.loopedSlides) / s.params.slidesPerGroup) : s.snapGrid.length, i = 0; numberOfBullets > i; i++) bulletsHTML += s.params.paginationBulletRender ? s.params.paginationBulletRender(i, s.params.bulletClass) : "<" + s.params.paginationElement + ' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + ">";
                    s.paginationContainer.html(bulletsHTML), s.bullets = s.paginationContainer.find("." + s.params.bulletClass), 
                    s.params.paginationClickable && s.params.a11y && s.a11y && s.a11y.initPagination();
                }
            }, s.update = function(updateTranslate) {
                function forceSetTranslate() {
                    newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate()), 
                    s.setWrapperTranslate(newTranslate), s.updateActiveIndex(), s.updateClasses();
                }
                if (s.updateContainerSize(), s.updateSlidesSize(), s.updateProgress(), s.updatePagination(), 
                s.updateClasses(), s.params.scrollbar && s.scrollbar && s.scrollbar.set(), updateTranslate) {
                    var translated, newTranslate;
                    s.controller && s.controller.spline && (s.controller.spline = void 0), s.params.freeMode ? (forceSetTranslate(), 
                    s.params.autoHeight && s.updateAutoHeight()) : (translated = ("auto" === s.params.slidesPerView || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides ? s.slideTo(s.slides.length - 1, 0, !1, !0) : s.slideTo(s.activeIndex, 0, !1, !0), 
                    translated || forceSetTranslate());
                } else s.params.autoHeight && s.updateAutoHeight();
            }, s.onResize = function(forceUpdatePagination) {
                s.params.breakpoints && s.setBreakpoint();
                var allowSwipeToPrev = s.params.allowSwipeToPrev, allowSwipeToNext = s.params.allowSwipeToNext;
                if (s.params.allowSwipeToPrev = s.params.allowSwipeToNext = !0, s.updateContainerSize(), 
                s.updateSlidesSize(), ("auto" === s.params.slidesPerView || s.params.freeMode || forceUpdatePagination) && s.updatePagination(), 
                s.params.scrollbar && s.scrollbar && s.scrollbar.set(), s.controller && s.controller.spline && (s.controller.spline = void 0), 
                s.params.freeMode) {
                    var newTranslate = Math.min(Math.max(s.translate, s.maxTranslate()), s.minTranslate());
                    s.setWrapperTranslate(newTranslate), s.updateActiveIndex(), s.updateClasses(), s.params.autoHeight && s.updateAutoHeight();
                } else s.updateClasses(), ("auto" === s.params.slidesPerView || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides ? s.slideTo(s.slides.length - 1, 0, !1, !0) : s.slideTo(s.activeIndex, 0, !1, !0);
                s.params.allowSwipeToPrev = allowSwipeToPrev, s.params.allowSwipeToNext = allowSwipeToNext;
            };
            var desktopEvents = [ "mousedown", "mousemove", "mouseup" ];
            window.navigator.pointerEnabled ? desktopEvents = [ "pointerdown", "pointermove", "pointerup" ] : window.navigator.msPointerEnabled && (desktopEvents = [ "MSPointerDown", "MSPointerMove", "MSPointerUp" ]), 
            s.touchEvents = {
                start: s.support.touch || !s.params.simulateTouch ? "touchstart" : desktopEvents[0],
                move: s.support.touch || !s.params.simulateTouch ? "touchmove" : desktopEvents[1],
                end: s.support.touch || !s.params.simulateTouch ? "touchend" : desktopEvents[2]
            }, (window.navigator.pointerEnabled || window.navigator.msPointerEnabled) && ("container" === s.params.touchEventsTarget ? s.container : s.wrapper).addClass("swiper-wp8-" + s.params.direction), 
            s.initEvents = function(detach) {
                var actionDom = detach ? "off" : "on", action = detach ? "removeEventListener" : "addEventListener", touchEventsTarget = "container" === s.params.touchEventsTarget ? s.container[0] : s.wrapper[0], target = s.support.touch ? touchEventsTarget : document, moveCapture = s.params.nested ? !0 : !1;
                s.browser.ie ? (touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, !1), 
                target[action](s.touchEvents.move, s.onTouchMove, moveCapture), target[action](s.touchEvents.end, s.onTouchEnd, !1)) : (s.support.touch && (touchEventsTarget[action](s.touchEvents.start, s.onTouchStart, !1), 
                touchEventsTarget[action](s.touchEvents.move, s.onTouchMove, moveCapture), touchEventsTarget[action](s.touchEvents.end, s.onTouchEnd, !1)), 
                !params.simulateTouch || s.device.ios || s.device.android || (touchEventsTarget[action]("mousedown", s.onTouchStart, !1), 
                document[action]("mousemove", s.onTouchMove, moveCapture), document[action]("mouseup", s.onTouchEnd, !1))), 
                window[action]("resize", s.onResize), s.params.nextButton && ($(s.params.nextButton)[actionDom]("click", s.onClickNext), 
                s.params.a11y && s.a11y && $(s.params.nextButton)[actionDom]("keydown", s.a11y.onEnterKey)), 
                s.params.prevButton && ($(s.params.prevButton)[actionDom]("click", s.onClickPrev), 
                s.params.a11y && s.a11y && $(s.params.prevButton)[actionDom]("keydown", s.a11y.onEnterKey)), 
                s.params.pagination && s.params.paginationClickable && ($(s.paginationContainer)[actionDom]("click", "." + s.params.bulletClass, s.onClickIndex), 
                s.params.a11y && s.a11y && $(s.paginationContainer)[actionDom]("keydown", "." + s.params.bulletClass, s.a11y.onEnterKey)), 
                (s.params.preventClicks || s.params.preventClicksPropagation) && touchEventsTarget[action]("click", s.preventClicks, !0);
            }, s.attachEvents = function(detach) {
                s.initEvents();
            }, s.detachEvents = function() {
                s.initEvents(!0);
            }, s.allowClick = !0, s.preventClicks = function(e) {
                s.allowClick || (s.params.preventClicks && e.preventDefault(), s.params.preventClicksPropagation && s.animating && (e.stopPropagation(), 
                e.stopImmediatePropagation()));
            }, s.onClickNext = function(e) {
                e.preventDefault(), (!s.isEnd || s.params.loop) && s.slideNext();
            }, s.onClickPrev = function(e) {
                e.preventDefault(), (!s.isBeginning || s.params.loop) && s.slidePrev();
            }, s.onClickIndex = function(e) {
                e.preventDefault();
                var index = $(this).index() * s.params.slidesPerGroup;
                s.params.loop && (index += s.loopedSlides), s.slideTo(index);
            }, s.updateClickedSlide = function(e) {
                var slide = findElementInEvent(e, "." + s.params.slideClass), slideFound = !1;
                if (slide) for (var i = 0; i < s.slides.length; i++) s.slides[i] === slide && (slideFound = !0);
                if (!slide || !slideFound) return s.clickedSlide = void 0, void (s.clickedIndex = void 0);
                if (s.clickedSlide = slide, s.clickedIndex = $(slide).index(), s.params.slideToClickedSlide && void 0 !== s.clickedIndex && s.clickedIndex !== s.activeIndex) {
                    var realIndex, slideToIndex = s.clickedIndex;
                    if (s.params.loop) {
                        if (s.animating) return;
                        realIndex = $(s.clickedSlide).attr("data-swiper-slide-index"), s.params.centeredSlides ? slideToIndex < s.loopedSlides - s.params.slidesPerView / 2 || slideToIndex > s.slides.length - s.loopedSlides + s.params.slidesPerView / 2 ? (s.fixLoop(), 
                        slideToIndex = s.wrapper.children("." + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index(), 
                        setTimeout(function() {
                            s.slideTo(slideToIndex);
                        }, 0)) : s.slideTo(slideToIndex) : slideToIndex > s.slides.length - s.params.slidesPerView ? (s.fixLoop(), 
                        slideToIndex = s.wrapper.children("." + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index(), 
                        setTimeout(function() {
                            s.slideTo(slideToIndex);
                        }, 0)) : s.slideTo(slideToIndex);
                    } else s.slideTo(slideToIndex);
                }
            };
            var isTouched, isMoved, allowTouchCallbacks, touchStartTime, isScrolling, currentTranslate, startTranslate, allowThresholdMove, clickTimeout, allowMomentumBounce, formElements = "input, select, textarea, button", lastClickTime = Date.now(), velocities = [];
            s.animating = !1, s.touches = {
                startX: 0,
                startY: 0,
                currentX: 0,
                currentY: 0,
                diff: 0
            };
            var isTouchEvent, startMoving;
            if (s.onTouchStart = function(e) {
                if (e.originalEvent && (e = e.originalEvent), isTouchEvent = "touchstart" === e.type, 
                isTouchEvent || !("which" in e) || 3 !== e.which) {
                    if (s.params.noSwiping && findElementInEvent(e, "." + s.params.noSwipingClass)) return void (s.allowClick = !0);
                    if (!s.params.swipeHandler || findElementInEvent(e, s.params.swipeHandler)) {
                        var startX = s.touches.currentX = "touchstart" === e.type ? e.targetTouches[0].pageX : e.pageX, startY = s.touches.currentY = "touchstart" === e.type ? e.targetTouches[0].pageY : e.pageY;
                        if (!(s.device.ios && s.params.iOSEdgeSwipeDetection && startX <= s.params.iOSEdgeSwipeThreshold)) {
                            if (isTouched = !0, isMoved = !1, allowTouchCallbacks = !0, isScrolling = void 0, 
                            startMoving = void 0, s.touches.startX = startX, s.touches.startY = startY, touchStartTime = Date.now(), 
                            s.allowClick = !0, s.updateContainerSize(), s.swipeDirection = void 0, s.params.threshold > 0 && (allowThresholdMove = !1), 
                            "touchstart" !== e.type) {
                                var preventDefault = !0;
                                $(e.target).is(formElements) && (preventDefault = !1), document.activeElement && $(document.activeElement).is(formElements) && document.activeElement.blur(), 
                                preventDefault && e.preventDefault();
                            }
                            s.emit("onTouchStart", s, e);
                        }
                    }
                }
            }, s.onTouchMove = function(e) {
                if (e.originalEvent && (e = e.originalEvent), !(isTouchEvent && "mousemove" === e.type || e.preventedByNestedSwiper)) {
                    if (s.params.onlyExternal) return s.allowClick = !1, void (isTouched && (s.touches.startX = s.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, 
                    s.touches.startY = s.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, 
                    touchStartTime = Date.now()));
                    if (isTouchEvent && document.activeElement && e.target === document.activeElement && $(e.target).is(formElements)) return isMoved = !0, 
                    void (s.allowClick = !1);
                    if (allowTouchCallbacks && s.emit("onTouchMove", s, e), !(e.targetTouches && e.targetTouches.length > 1)) {
                        if (s.touches.currentX = "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX, 
                        s.touches.currentY = "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY, 
                        "undefined" == typeof isScrolling) {
                            var touchAngle = 180 * Math.atan2(Math.abs(s.touches.currentY - s.touches.startY), Math.abs(s.touches.currentX - s.touches.startX)) / Math.PI;
                            isScrolling = isH() ? touchAngle > s.params.touchAngle : 90 - touchAngle > s.params.touchAngle;
                        }
                        if (isScrolling && s.emit("onTouchMoveOpposite", s, e), "undefined" == typeof startMoving && s.browser.ieTouch && (s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY) && (startMoving = !0), 
                        isTouched) {
                            if (isScrolling) return void (isTouched = !1);
                            if (startMoving || !s.browser.ieTouch) {
                                s.allowClick = !1, s.emit("onSliderMove", s, e), e.preventDefault(), s.params.touchMoveStopPropagation && !s.params.nested && e.stopPropagation(), 
                                isMoved || (params.loop && s.fixLoop(), startTranslate = s.getWrapperTranslate(), 
                                s.setWrapperTransition(0), s.animating && s.wrapper.trigger("webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd"), 
                                s.params.autoplay && s.autoplaying && (s.params.autoplayDisableOnInteraction ? s.stopAutoplay() : s.pauseAutoplay()), 
                                allowMomentumBounce = !1, s.params.grabCursor && (s.container[0].style.cursor = "move", 
                                s.container[0].style.cursor = "-webkit-grabbing", s.container[0].style.cursor = "-moz-grabbin", 
                                s.container[0].style.cursor = "grabbing")), isMoved = !0;
                                var diff = s.touches.diff = isH() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY;
                                diff *= s.params.touchRatio, s.rtl && (diff = -diff), s.swipeDirection = diff > 0 ? "prev" : "next", 
                                currentTranslate = diff + startTranslate;
                                var disableParentSwiper = !0;
                                if (diff > 0 && currentTranslate > s.minTranslate() ? (disableParentSwiper = !1, 
                                s.params.resistance && (currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff, s.params.resistanceRatio))) : 0 > diff && currentTranslate < s.maxTranslate() && (disableParentSwiper = !1, 
                                s.params.resistance && (currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff, s.params.resistanceRatio))), 
                                disableParentSwiper && (e.preventedByNestedSwiper = !0), !s.params.allowSwipeToNext && "next" === s.swipeDirection && startTranslate > currentTranslate && (currentTranslate = startTranslate), 
                                !s.params.allowSwipeToPrev && "prev" === s.swipeDirection && currentTranslate > startTranslate && (currentTranslate = startTranslate), 
                                s.params.followFinger) {
                                    if (s.params.threshold > 0) {
                                        if (!(Math.abs(diff) > s.params.threshold || allowThresholdMove)) return void (currentTranslate = startTranslate);
                                        if (!allowThresholdMove) return allowThresholdMove = !0, s.touches.startX = s.touches.currentX, 
                                        s.touches.startY = s.touches.currentY, currentTranslate = startTranslate, void (s.touches.diff = isH() ? s.touches.currentX - s.touches.startX : s.touches.currentY - s.touches.startY);
                                    }
                                    (s.params.freeMode || s.params.watchSlidesProgress) && s.updateActiveIndex(), s.params.freeMode && (0 === velocities.length && velocities.push({
                                        position: s.touches[isH() ? "startX" : "startY"],
                                        time: touchStartTime
                                    }), velocities.push({
                                        position: s.touches[isH() ? "currentX" : "currentY"],
                                        time: new window.Date().getTime()
                                    })), s.updateProgress(currentTranslate), s.setWrapperTranslate(currentTranslate);
                                }
                            }
                        }
                    }
                }
            }, s.onTouchEnd = function(e) {
                if (e.originalEvent && (e = e.originalEvent), allowTouchCallbacks && s.emit("onTouchEnd", s, e), 
                allowTouchCallbacks = !1, isTouched) {
                    s.params.grabCursor && isMoved && isTouched && (s.container[0].style.cursor = "move", 
                    s.container[0].style.cursor = "-webkit-grab", s.container[0].style.cursor = "-moz-grab", 
                    s.container[0].style.cursor = "grab");
                    var touchEndTime = Date.now(), timeDiff = touchEndTime - touchStartTime;
                    if (s.allowClick && (s.updateClickedSlide(e), s.emit("onTap", s, e), 300 > timeDiff && touchEndTime - lastClickTime > 300 && (clickTimeout && clearTimeout(clickTimeout), 
                    clickTimeout = setTimeout(function() {
                        s && (s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass) && s.paginationContainer.toggleClass(s.params.paginationHiddenClass), 
                        s.emit("onClick", s, e));
                    }, 300)), 300 > timeDiff && 300 > touchEndTime - lastClickTime && (clickTimeout && clearTimeout(clickTimeout), 
                    s.emit("onDoubleTap", s, e))), lastClickTime = Date.now(), setTimeout(function() {
                        s && (s.allowClick = !0);
                    }, 0), !isTouched || !isMoved || !s.swipeDirection || 0 === s.touches.diff || currentTranslate === startTranslate) return void (isTouched = isMoved = !1);
                    isTouched = isMoved = !1;
                    var currentPos;
                    if (currentPos = s.params.followFinger ? s.rtl ? s.translate : -s.translate : -currentTranslate, 
                    s.params.freeMode) {
                        if (currentPos < -s.minTranslate()) return void s.slideTo(s.activeIndex);
                        if (currentPos > -s.maxTranslate()) return void (s.slides.length < s.snapGrid.length ? s.slideTo(s.snapGrid.length - 1) : s.slideTo(s.slides.length - 1));
                        if (s.params.freeModeMomentum) {
                            if (velocities.length > 1) {
                                var lastMoveEvent = velocities.pop(), velocityEvent = velocities.pop(), distance = lastMoveEvent.position - velocityEvent.position, time = lastMoveEvent.time - velocityEvent.time;
                                s.velocity = distance / time, s.velocity = s.velocity / 2, Math.abs(s.velocity) < s.params.freeModeMinimumVelocity && (s.velocity = 0), 
                                (time > 150 || new window.Date().getTime() - lastMoveEvent.time > 300) && (s.velocity = 0);
                            } else s.velocity = 0;
                            velocities.length = 0;
                            var momentumDuration = 1e3 * s.params.freeModeMomentumRatio, momentumDistance = s.velocity * momentumDuration, newPosition = s.translate + momentumDistance;
                            s.rtl && (newPosition = -newPosition);
                            var afterBouncePosition, doBounce = !1, bounceAmount = 20 * Math.abs(s.velocity) * s.params.freeModeMomentumBounceRatio;
                            if (newPosition < s.maxTranslate()) s.params.freeModeMomentumBounce ? (newPosition + s.maxTranslate() < -bounceAmount && (newPosition = s.maxTranslate() - bounceAmount), 
                            afterBouncePosition = s.maxTranslate(), doBounce = !0, allowMomentumBounce = !0) : newPosition = s.maxTranslate(); else if (newPosition > s.minTranslate()) s.params.freeModeMomentumBounce ? (newPosition - s.minTranslate() > bounceAmount && (newPosition = s.minTranslate() + bounceAmount), 
                            afterBouncePosition = s.minTranslate(), doBounce = !0, allowMomentumBounce = !0) : newPosition = s.minTranslate(); else if (s.params.freeModeSticky) {
                                var nextSlide, j = 0;
                                for (j = 0; j < s.snapGrid.length; j += 1) if (s.snapGrid[j] > -newPosition) {
                                    nextSlide = j;
                                    break;
                                }
                                newPosition = Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || "next" === s.swipeDirection ? s.snapGrid[nextSlide] : s.snapGrid[nextSlide - 1], 
                                s.rtl || (newPosition = -newPosition);
                            }
                            if (0 !== s.velocity) momentumDuration = s.rtl ? Math.abs((-newPosition - s.translate) / s.velocity) : Math.abs((newPosition - s.translate) / s.velocity); else if (s.params.freeModeSticky) return void s.slideReset();
                            s.params.freeModeMomentumBounce && doBounce ? (s.updateProgress(afterBouncePosition), 
                            s.setWrapperTransition(momentumDuration), s.setWrapperTranslate(newPosition), s.onTransitionStart(), 
                            s.animating = !0, s.wrapper.transitionEnd(function() {
                                s && allowMomentumBounce && (s.emit("onMomentumBounce", s), s.setWrapperTransition(s.params.speed), 
                                s.setWrapperTranslate(afterBouncePosition), s.wrapper.transitionEnd(function() {
                                    s && s.onTransitionEnd();
                                }));
                            })) : s.velocity ? (s.updateProgress(newPosition), s.setWrapperTransition(momentumDuration), 
                            s.setWrapperTranslate(newPosition), s.onTransitionStart(), s.animating || (s.animating = !0, 
                            s.wrapper.transitionEnd(function() {
                                s && s.onTransitionEnd();
                            }))) : s.updateProgress(newPosition), s.updateActiveIndex();
                        }
                        return void ((!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs) && (s.updateProgress(), 
                        s.updateActiveIndex()));
                    }
                    var i, stopIndex = 0, groupSize = s.slidesSizesGrid[0];
                    for (i = 0; i < s.slidesGrid.length; i += s.params.slidesPerGroup) "undefined" != typeof s.slidesGrid[i + s.params.slidesPerGroup] ? currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup] && (stopIndex = i, 
                    groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i]) : currentPos >= s.slidesGrid[i] && (stopIndex = i, 
                    groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2]);
                    var ratio = (currentPos - s.slidesGrid[stopIndex]) / groupSize;
                    if (timeDiff > s.params.longSwipesMs) {
                        if (!s.params.longSwipes) return void s.slideTo(s.activeIndex);
                        "next" === s.swipeDirection && (ratio >= s.params.longSwipesRatio ? s.slideTo(stopIndex + s.params.slidesPerGroup) : s.slideTo(stopIndex)), 
                        "prev" === s.swipeDirection && (ratio > 1 - s.params.longSwipesRatio ? s.slideTo(stopIndex + s.params.slidesPerGroup) : s.slideTo(stopIndex));
                    } else {
                        if (!s.params.shortSwipes) return void s.slideTo(s.activeIndex);
                        "next" === s.swipeDirection && s.slideTo(stopIndex + s.params.slidesPerGroup), "prev" === s.swipeDirection && s.slideTo(stopIndex);
                    }
                }
            }, s._slideTo = function(slideIndex, speed) {
                return s.slideTo(slideIndex, speed, !0, !0);
            }, s.slideTo = function(slideIndex, speed, runCallbacks, internal) {
                "undefined" == typeof runCallbacks && (runCallbacks = !0), "undefined" == typeof slideIndex && (slideIndex = 0), 
                0 > slideIndex && (slideIndex = 0), s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup), 
                s.snapIndex >= s.snapGrid.length && (s.snapIndex = s.snapGrid.length - 1);
                var translate = -s.snapGrid[s.snapIndex];
                s.params.autoplay && s.autoplaying && (internal || !s.params.autoplayDisableOnInteraction ? s.pauseAutoplay(speed) : s.stopAutoplay()), 
                s.updateProgress(translate);
                for (var i = 0; i < s.slidesGrid.length; i++) -Math.floor(100 * translate) >= Math.floor(100 * s.slidesGrid[i]) && (slideIndex = i);
                return !s.params.allowSwipeToNext && translate < s.translate && translate < s.minTranslate() ? !1 : !s.params.allowSwipeToPrev && translate > s.translate && translate > s.maxTranslate() && (s.activeIndex || 0) !== slideIndex ? !1 : ("undefined" == typeof speed && (speed = s.params.speed), 
                s.previousIndex = s.activeIndex || 0, s.activeIndex = slideIndex, s.rtl && -translate === s.translate || !s.rtl && translate === s.translate ? (s.params.autoHeight && s.updateAutoHeight(), 
                s.updateClasses(), "slide" !== s.params.effect && s.setWrapperTranslate(translate), 
                !1) : (s.updateClasses(), s.onTransitionStart(runCallbacks), 0 === speed ? (s.setWrapperTranslate(translate), 
                s.setWrapperTransition(0), s.onTransitionEnd(runCallbacks)) : (s.setWrapperTranslate(translate), 
                s.setWrapperTransition(speed), s.animating || (s.animating = !0, s.wrapper.transitionEnd(function() {
                    s && s.onTransitionEnd(runCallbacks);
                }))), !0));
            }, s.onTransitionStart = function(runCallbacks) {
                "undefined" == typeof runCallbacks && (runCallbacks = !0), s.params.autoHeight && s.updateAutoHeight(), 
                s.lazy && s.lazy.onTransitionStart(), runCallbacks && (s.emit("onTransitionStart", s), 
                s.activeIndex !== s.previousIndex && (s.emit("onSlideChangeStart", s), s.activeIndex > s.previousIndex ? s.emit("onSlideNextStart", s) : s.emit("onSlidePrevStart", s)));
            }, s.onTransitionEnd = function(runCallbacks) {
                s.animating = !1, s.setWrapperTransition(0), "undefined" == typeof runCallbacks && (runCallbacks = !0), 
                s.lazy && s.lazy.onTransitionEnd(), runCallbacks && (s.emit("onTransitionEnd", s), 
                s.activeIndex !== s.previousIndex && (s.emit("onSlideChangeEnd", s), s.activeIndex > s.previousIndex ? s.emit("onSlideNextEnd", s) : s.emit("onSlidePrevEnd", s))), 
                s.params.hashnav && s.hashnav && s.hashnav.setHash();
            }, s.slideNext = function(runCallbacks, speed, internal) {
                if (s.params.loop) {
                    if (s.animating) return !1;
                    s.fixLoop();
                    s.container[0].clientLeft;
                    return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
                }
                return s.slideTo(s.activeIndex + s.params.slidesPerGroup, speed, runCallbacks, internal);
            }, s._slideNext = function(speed) {
                return s.slideNext(!0, speed, !0);
            }, s.slidePrev = function(runCallbacks, speed, internal) {
                if (s.params.loop) {
                    if (s.animating) return !1;
                    s.fixLoop();
                    s.container[0].clientLeft;
                    return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
                }
                return s.slideTo(s.activeIndex - 1, speed, runCallbacks, internal);
            }, s._slidePrev = function(speed) {
                return s.slidePrev(!0, speed, !0);
            }, s.slideReset = function(runCallbacks, speed, internal) {
                return s.slideTo(s.activeIndex, speed, runCallbacks);
            }, s.setWrapperTransition = function(duration, byController) {
                s.wrapper.transition(duration), "slide" !== s.params.effect && s.effects[s.params.effect] && s.effects[s.params.effect].setTransition(duration), 
                s.params.parallax && s.parallax && s.parallax.setTransition(duration), s.params.scrollbar && s.scrollbar && s.scrollbar.setTransition(duration), 
                s.params.control && s.controller && s.controller.setTransition(duration, byController), 
                s.emit("onSetTransition", s, duration);
            }, s.setWrapperTranslate = function(translate, updateActiveIndex, byController) {
                var x = 0, y = 0, z = 0;
                if (isH()) {
                    var width = s.virtualSize, wrapper_width = s.wrapper.width();
                    translate > 0 ? translate = 0 : -(width - wrapper_width) > translate && (translate = -(width - wrapper_width)), 
                    x = s.rtl ? -translate : translate;
                } else y = translate;
                s.params.roundLengths && (x = round(x), y = round(y)), s.params.virtualTranslate || (s.support.transforms3d ? s.wrapper.transform("translate3d(" + x + "px, " + y + "px, " + z + "px)") : s.wrapper.transform("translate(" + x + "px, " + y + "px)")), 
                s.translate = isH() ? x : y;
                var progress, translatesDiff = s.maxTranslate() - s.minTranslate();
                progress = 0 === translatesDiff ? 0 : (translate - s.minTranslate()) / translatesDiff, 
                progress !== s.progress && s.updateProgress(translate), updateActiveIndex && s.updateActiveIndex(), 
                "slide" !== s.params.effect && s.effects[s.params.effect] && s.effects[s.params.effect].setTranslate(s.translate), 
                s.params.parallax && s.parallax && s.parallax.setTranslate(s.translate), s.params.scrollbar && s.scrollbar && s.scrollbar.setTranslate(s.translate), 
                s.params.control && s.controller && s.controller.setTranslate(s.translate, byController), 
                s.emit("onSetTranslate", s, s.translate);
            }, s.getTranslate = function(el, axis) {
                var matrix, curTransform, curStyle, transformMatrix;
                return "undefined" == typeof axis && (axis = "x"), s.params.virtualTranslate ? s.rtl ? -s.translate : s.translate : (curStyle = window.getComputedStyle(el, null), 
                window.WebKitCSSMatrix ? (curTransform = curStyle.transform || curStyle.webkitTransform, 
                curTransform.split(",").length > 6 && (curTransform = curTransform.split(", ").map(function(a) {
                    return a.replace(",", ".");
                }).join(", ")), transformMatrix = new window.WebKitCSSMatrix("none" === curTransform ? "" : curTransform)) : (transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,"), 
                matrix = transformMatrix.toString().split(",")), "x" === axis && (curTransform = window.WebKitCSSMatrix ? transformMatrix.m41 : 16 === matrix.length ? parseFloat(matrix[12]) : parseFloat(matrix[4])), 
                "y" === axis && (curTransform = window.WebKitCSSMatrix ? transformMatrix.m42 : 16 === matrix.length ? parseFloat(matrix[13]) : parseFloat(matrix[5])), 
                s.rtl && curTransform && (curTransform = -curTransform), curTransform || 0);
            }, s.getWrapperTranslate = function(axis) {
                return "undefined" == typeof axis && (axis = isH() ? "x" : "y"), s.getTranslate(s.wrapper[0], axis);
            }, s.observers = [], s.initObservers = function() {
                if (s.params.observeParents) for (var containerParents = s.container.parents(), i = 0; i < containerParents.length; i++) initObserver(containerParents[i]);
                initObserver(s.container[0], {
                    childList: !1
                }), initObserver(s.wrapper[0], {
                    attributes: !1
                });
            }, s.disconnectObservers = function() {
                for (var i = 0; i < s.observers.length; i++) s.observers[i].disconnect();
                s.observers = [];
            }, s.createLoop = function() {
                s.wrapper.children("." + s.params.slideClass + "." + s.params.slideDuplicateClass).remove();
                var slides = s.wrapper.children("." + s.params.slideClass);
                "auto" !== s.params.slidesPerView || s.params.loopedSlides || (s.params.loopedSlides = slides.length), 
                s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView, 10), 
                s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides, s.loopedSlides > slides.length && (s.loopedSlides = slides.length);
                var i, prependSlides = [], appendSlides = [];
                for (slides.each(function(index, el) {
                    var slide = $(this);
                    index < s.loopedSlides && appendSlides.push(el), index < slides.length && index >= slides.length - s.loopedSlides && prependSlides.push(el), 
                    slide.attr("data-swiper-slide-index", index);
                }), i = 0; i < appendSlides.length; i++) s.wrapper.append($(appendSlides[i].cloneNode(!0)).addClass(s.params.slideDuplicateClass));
                for (i = prependSlides.length - 1; i >= 0; i--) s.wrapper.prepend($(prependSlides[i].cloneNode(!0)).addClass(s.params.slideDuplicateClass));
            }, s.destroyLoop = function() {
                s.wrapper.children("." + s.params.slideClass + "." + s.params.slideDuplicateClass).remove(), 
                s.slides.removeAttr("data-swiper-slide-index");
            }, s.fixLoop = function() {
                var newIndex;
                s.activeIndex < s.loopedSlides ? (newIndex = s.slides.length - 3 * s.loopedSlides + s.activeIndex, 
                newIndex += s.loopedSlides, s.slideTo(newIndex, 0, !1, !0)) : ("auto" === s.params.slidesPerView && s.activeIndex >= 2 * s.loopedSlides || s.activeIndex > s.slides.length - 2 * s.params.slidesPerView) && (newIndex = -s.slides.length + s.activeIndex + s.loopedSlides, 
                newIndex += s.loopedSlides, s.slideTo(newIndex, 0, !1, !0));
            }, s.appendSlide = function(slides) {
                if (s.params.loop && s.destroyLoop(), "object" == typeof slides && slides.length) for (var i = 0; i < slides.length; i++) slides[i] && s.wrapper.append(slides[i]); else s.wrapper.append(slides);
                s.params.loop && s.createLoop(), s.params.observer && s.support.observer || s.update(!0);
            }, s.prependSlide = function(slides) {
                s.params.loop && s.destroyLoop();
                var newActiveIndex = s.activeIndex + 1;
                if ("object" == typeof slides && slides.length) {
                    for (var i = 0; i < slides.length; i++) slides[i] && s.wrapper.prepend(slides[i]);
                    newActiveIndex = s.activeIndex + slides.length;
                } else s.wrapper.prepend(slides);
                s.params.loop && s.createLoop(), s.params.observer && s.support.observer || s.update(!0), 
                s.slideTo(newActiveIndex, 0, !1);
            }, s.removeSlide = function(slidesIndexes) {
                s.params.loop && (s.destroyLoop(), s.slides = s.wrapper.children("." + s.params.slideClass));
                var indexToRemove, newActiveIndex = s.activeIndex;
                if ("object" == typeof slidesIndexes && slidesIndexes.length) {
                    for (var i = 0; i < slidesIndexes.length; i++) indexToRemove = slidesIndexes[i], 
                    s.slides[indexToRemove] && s.slides.eq(indexToRemove).remove(), newActiveIndex > indexToRemove && newActiveIndex--;
                    newActiveIndex = Math.max(newActiveIndex, 0);
                } else indexToRemove = slidesIndexes, s.slides[indexToRemove] && s.slides.eq(indexToRemove).remove(), 
                newActiveIndex > indexToRemove && newActiveIndex--, newActiveIndex = Math.max(newActiveIndex, 0);
                s.params.loop && s.createLoop(), s.params.observer && s.support.observer || s.update(!0), 
                s.params.loop ? s.slideTo(newActiveIndex + s.loopedSlides, 0, !1) : s.slideTo(newActiveIndex, 0, !1);
            }, s.removeAllSlides = function() {
                for (var slidesIndexes = [], i = 0; i < s.slides.length; i++) slidesIndexes.push(i);
                s.removeSlide(slidesIndexes);
            }, s.effects = {
                fade: {
                    setTranslate: function() {
                        for (var i = 0; i < s.slides.length; i++) {
                            var slide = s.slides.eq(i), offset = slide[0].swiperSlideOffset, tx = -offset;
                            s.params.virtualTranslate || (tx -= s.translate);
                            var ty = 0;
                            isH() || (ty = tx, tx = 0);
                            var slideOpacity = s.params.fade.crossFade ? Math.max(1 - Math.abs(slide[0].progress), 0) : 1 + Math.min(Math.max(slide[0].progress, -1), 0);
                            slide.css({
                                opacity: slideOpacity
                            }).transform("translate3d(" + tx + "px, " + ty + "px, 0px)");
                        }
                    },
                    setTransition: function(duration) {
                        if (s.slides.transition(duration), s.params.virtualTranslate && 0 !== duration) {
                            var eventTriggered = !1;
                            s.slides.transitionEnd(function() {
                                if (!eventTriggered && s) {
                                    eventTriggered = !0, s.animating = !1;
                                    for (var triggerEvents = [ "webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd" ], i = 0; i < triggerEvents.length; i++) s.wrapper.trigger(triggerEvents[i]);
                                }
                            });
                        }
                    }
                },
                cube: {
                    setTranslate: function() {
                        var cubeShadow, wrapperRotate = 0;
                        s.params.cube.shadow && (isH() ? (cubeShadow = s.wrapper.find(".swiper-cube-shadow"), 
                        0 === cubeShadow.length && (cubeShadow = $('<div class="swiper-cube-shadow"></div>'), 
                        s.wrapper.append(cubeShadow)), cubeShadow.css({
                            height: s.width + "px"
                        })) : (cubeShadow = s.container.find(".swiper-cube-shadow"), 0 === cubeShadow.length && (cubeShadow = $('<div class="swiper-cube-shadow"></div>'), 
                        s.container.append(cubeShadow))));
                        for (var i = 0; i < s.slides.length; i++) {
                            var slide = s.slides.eq(i), slideAngle = 90 * i, round = Math.floor(slideAngle / 360);
                            s.rtl && (slideAngle = -slideAngle, round = Math.floor(-slideAngle / 360));
                            var progress = Math.max(Math.min(slide[0].progress, 1), -1), tx = 0, ty = 0, tz = 0;
                            i % 4 === 0 ? (tx = 4 * -round * s.size, tz = 0) : (i - 1) % 4 === 0 ? (tx = 0, 
                            tz = 4 * -round * s.size) : (i - 2) % 4 === 0 ? (tx = s.size + 4 * round * s.size, 
                            tz = s.size) : (i - 3) % 4 === 0 && (tx = -s.size, tz = 3 * s.size + 4 * s.size * round), 
                            s.rtl && (tx = -tx), isH() || (ty = tx, tx = 0);
                            var transform = "rotateX(" + (isH() ? 0 : -slideAngle) + "deg) rotateY(" + (isH() ? slideAngle : 0) + "deg) translate3d(" + tx + "px, " + ty + "px, " + tz + "px)";
                            if (1 >= progress && progress > -1 && (wrapperRotate = 90 * i + 90 * progress, s.rtl && (wrapperRotate = 90 * -i - 90 * progress)), 
                            slide.transform(transform), s.params.cube.slideShadows) {
                                var shadowBefore = isH() ? slide.find(".swiper-slide-shadow-left") : slide.find(".swiper-slide-shadow-top"), shadowAfter = isH() ? slide.find(".swiper-slide-shadow-right") : slide.find(".swiper-slide-shadow-bottom");
                                0 === shadowBefore.length && (shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? "left" : "top") + '"></div>'), 
                                slide.append(shadowBefore)), 0 === shadowAfter.length && (shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? "right" : "bottom") + '"></div>'), 
                                slide.append(shadowAfter));
                                slide[0].progress;
                                shadowBefore.length && (shadowBefore[0].style.opacity = -slide[0].progress), shadowAfter.length && (shadowAfter[0].style.opacity = slide[0].progress);
                            }
                        }
                        if (s.wrapper.css({
                            "-webkit-transform-origin": "50% 50% -" + s.size / 2 + "px",
                            "-moz-transform-origin": "50% 50% -" + s.size / 2 + "px",
                            "-ms-transform-origin": "50% 50% -" + s.size / 2 + "px",
                            "transform-origin": "50% 50% -" + s.size / 2 + "px"
                        }), s.params.cube.shadow) if (isH()) cubeShadow.transform("translate3d(0px, " + (s.width / 2 + s.params.cube.shadowOffset) + "px, " + -s.width / 2 + "px) rotateX(90deg) rotateZ(0deg) scale(" + s.params.cube.shadowScale + ")"); else {
                            var shadowAngle = Math.abs(wrapperRotate) - 90 * Math.floor(Math.abs(wrapperRotate) / 90), multiplier = 1.5 - (Math.sin(2 * shadowAngle * Math.PI / 360) / 2 + Math.cos(2 * shadowAngle * Math.PI / 360) / 2), scale1 = s.params.cube.shadowScale, scale2 = s.params.cube.shadowScale / multiplier, offset = s.params.cube.shadowOffset;
                            cubeShadow.transform("scale3d(" + scale1 + ", 1, " + scale2 + ") translate3d(0px, " + (s.height / 2 + offset) + "px, " + -s.height / 2 / scale2 + "px) rotateX(-90deg)");
                        }
                        var zFactor = s.isSafari || s.isUiWebView ? -s.size / 2 : 0;
                        s.wrapper.transform("translate3d(0px,0," + zFactor + "px) rotateX(" + (isH() ? 0 : wrapperRotate) + "deg) rotateY(" + (isH() ? -wrapperRotate : 0) + "deg)");
                    },
                    setTransition: function(duration) {
                        s.slides.transition(duration).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(duration), 
                        s.params.cube.shadow && !isH() && s.container.find(".swiper-cube-shadow").transition(duration);
                    }
                },
                coverflow: {
                    setTranslate: function() {
                        for (var transform = s.translate, center = isH() ? -transform + s.width / 2 : -transform + s.height / 2, rotate = isH() ? s.params.coverflow.rotate : -s.params.coverflow.rotate, translate = s.params.coverflow.depth, i = 0, length = s.slides.length; length > i; i++) {
                            var slide = s.slides.eq(i), slideSize = s.slidesSizesGrid[i], slideOffset = slide[0].swiperSlideOffset, offsetMultiplier = (center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier, rotateY = isH() ? rotate * offsetMultiplier : 0, rotateX = isH() ? 0 : rotate * offsetMultiplier, translateZ = -translate * Math.abs(offsetMultiplier), translateY = isH() ? 0 : s.params.coverflow.stretch * offsetMultiplier, translateX = isH() ? s.params.coverflow.stretch * offsetMultiplier : 0;
                            Math.abs(translateX) < .001 && (translateX = 0), Math.abs(translateY) < .001 && (translateY = 0), 
                            Math.abs(translateZ) < .001 && (translateZ = 0), Math.abs(rotateY) < .001 && (rotateY = 0), 
                            Math.abs(rotateX) < .001 && (rotateX = 0);
                            var slideTransform = "translate3d(" + translateX + "px," + translateY + "px," + translateZ + "px)  rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";
                            if (slide.transform(slideTransform), slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1, 
                            s.params.coverflow.slideShadows) {
                                var shadowBefore = isH() ? slide.find(".swiper-slide-shadow-left") : slide.find(".swiper-slide-shadow-top"), shadowAfter = isH() ? slide.find(".swiper-slide-shadow-right") : slide.find(".swiper-slide-shadow-bottom");
                                0 === shadowBefore.length && (shadowBefore = $('<div class="swiper-slide-shadow-' + (isH() ? "left" : "top") + '"></div>'), 
                                slide.append(shadowBefore)), 0 === shadowAfter.length && (shadowAfter = $('<div class="swiper-slide-shadow-' + (isH() ? "right" : "bottom") + '"></div>'), 
                                slide.append(shadowAfter)), shadowBefore.length && (shadowBefore[0].style.opacity = offsetMultiplier > 0 ? offsetMultiplier : 0), 
                                shadowAfter.length && (shadowAfter[0].style.opacity = -offsetMultiplier > 0 ? -offsetMultiplier : 0);
                            }
                        }
                        if (s.browser.ie) {
                            var ws = s.wrapper[0].style;
                            ws.perspectiveOrigin = center + "px 50%";
                        }
                    },
                    setTransition: function(duration) {
                        s.slides.transition(duration).find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").transition(duration);
                    }
                }
            }, s.lazy = {
                initialImageLoaded: !1,
                loadImageInSlide: function(index, loadInDuplicate) {
                    if ("undefined" != typeof index && ("undefined" == typeof loadInDuplicate && (loadInDuplicate = !0), 
                    0 !== s.slides.length)) {
                        var slide = s.slides.eq(index), img = slide.find(".swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)");
                        !slide.hasClass("swiper-lazy") || slide.hasClass("swiper-lazy-loaded") || slide.hasClass("swiper-lazy-loading") || (img = img.add(slide[0])), 
                        0 !== img.length && img.each(function() {
                            var _img = $(this);
                            _img.addClass("swiper-lazy-loading");
                            var background = _img.attr("data-background"), src = _img.attr("data-src"), srcset = _img.attr("data-srcset");
                            s.loadImage(_img[0], src || background, srcset, !1, function() {
                                if (background ? (_img.css("background-image", "url(" + background + ")"), _img.removeAttr("data-background")) : (srcset && (_img.attr("srcset", srcset), 
                                _img.removeAttr("data-srcset")), src && (_img.attr("src", src), _img.removeAttr("data-src"))), 
                                _img.addClass("swiper-lazy-loaded").removeClass("swiper-lazy-loading"), slide.find(".swiper-lazy-preloader, .preloader").remove(), 
                                s.params.loop && loadInDuplicate) {
                                    var slideOriginalIndex = slide.attr("data-swiper-slide-index");
                                    if (slide.hasClass(s.params.slideDuplicateClass)) {
                                        var originalSlide = s.wrapper.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + s.params.slideDuplicateClass + ")");
                                        s.lazy.loadImageInSlide(originalSlide.index(), !1);
                                    } else {
                                        var duplicatedSlide = s.wrapper.children("." + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');
                                        s.lazy.loadImageInSlide(duplicatedSlide.index(), !1);
                                    }
                                }
                                s.emit("onLazyImageReady", s, slide[0], _img[0]);
                            }), s.emit("onLazyImageLoad", s, slide[0], _img[0]);
                        });
                    }
                },
                load: function() {
                    var i;
                    if (s.params.watchSlidesVisibility) s.wrapper.children("." + s.params.slideVisibleClass).each(function() {
                        s.lazy.loadImageInSlide($(this).index());
                    }); else if (s.params.slidesPerView > 1) for (i = s.activeIndex; i < s.activeIndex + s.params.slidesPerView; i++) s.slides[i] && s.lazy.loadImageInSlide(i); else s.lazy.loadImageInSlide(s.activeIndex);
                    if (s.params.lazyLoadingInPrevNext) if (s.params.slidesPerView > 1) {
                        for (i = s.activeIndex + s.params.slidesPerView; i < s.activeIndex + s.params.slidesPerView + s.params.slidesPerView; i++) s.slides[i] && s.lazy.loadImageInSlide(i);
                        for (i = s.activeIndex - s.params.slidesPerView; i < s.activeIndex; i++) s.slides[i] && s.lazy.loadImageInSlide(i);
                    } else {
                        var nextSlide = s.wrapper.children("." + s.params.slideNextClass);
                        nextSlide.length > 0 && s.lazy.loadImageInSlide(nextSlide.index());
                        var prevSlide = s.wrapper.children("." + s.params.slidePrevClass);
                        prevSlide.length > 0 && s.lazy.loadImageInSlide(prevSlide.index());
                    }
                },
                onTransitionStart: function() {
                    s.params.lazyLoading && (s.params.lazyLoadingOnTransitionStart || !s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded) && s.lazy.load();
                },
                onTransitionEnd: function() {
                    s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart && s.lazy.load();
                }
            }, s.scrollbar = {
                isTouched: !1,
                setDragPosition: function(e) {
                    var sb = s.scrollbar, pointerPosition = isH() ? "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageX : e.pageX || e.clientX : "touchstart" === e.type || "touchmove" === e.type ? e.targetTouches[0].pageY : e.pageY || e.clientY, position = pointerPosition - sb.track.offset()[isH() ? "left" : "top"] - sb.dragSize / 2, positionMin = -s.minTranslate() * sb.moveDivider, positionMax = -s.maxTranslate() * sb.moveDivider;
                    positionMin > position ? position = positionMin : position > positionMax && (position = positionMax), 
                    position = -position / sb.moveDivider, s.updateProgress(position), s.setWrapperTranslate(position, !0);
                },
                dragStart: function(e) {
                    var sb = s.scrollbar;
                    sb.isTouched = !0, e.preventDefault(), e.stopPropagation(), sb.setDragPosition(e), 
                    clearTimeout(sb.dragTimeout), sb.track.transition(0), s.params.scrollbarHide && sb.track.css("opacity", 1), 
                    s.wrapper.transition(100), sb.drag.transition(100), s.emit("onScrollbarDragStart", s);
                },
                dragMove: function(e) {
                    var sb = s.scrollbar;
                    sb.isTouched && (e.preventDefault ? e.preventDefault() : e.returnValue = !1, sb.setDragPosition(e), 
                    s.wrapper.transition(0), sb.track.transition(0), sb.drag.transition(0), s.emit("onScrollbarDragMove", s));
                },
                dragEnd: function(e) {
                    var sb = s.scrollbar;
                    sb.isTouched && (sb.isTouched = !1, s.params.scrollbarHide && (clearTimeout(sb.dragTimeout), 
                    sb.dragTimeout = setTimeout(function() {
                        sb.track.css("opacity", 0), sb.track.transition(400);
                    }, 1e3)), s.emit("onScrollbarDragEnd", s), s.params.scrollbarSnapOnRelease && s.slideReset());
                },
                enableDraggable: function() {
                    var sb = s.scrollbar, target = s.support.touch ? sb.track : document;
                    $(sb.track).on(s.touchEvents.start, sb.dragStart), $(target).on(s.touchEvents.move, sb.dragMove), 
                    $(target).on(s.touchEvents.end, sb.dragEnd);
                },
                disableDraggable: function() {
                    var sb = s.scrollbar, target = s.support.touch ? sb.track : document;
                    $(sb.track).off(s.touchEvents.start, sb.dragStart), $(target).off(s.touchEvents.move, sb.dragMove), 
                    $(target).off(s.touchEvents.end, sb.dragEnd);
                },
                set: function() {
                    if (s.params.scrollbar) {
                        var sb = s.scrollbar;
                        sb.track = $(s.params.scrollbar), sb.drag = sb.track.find(".swiper-scrollbar-drag"), 
                        0 === sb.drag.length && (sb.drag = $('<div class="swiper-scrollbar-drag"></div>'), 
                        sb.track.append(sb.drag)), sb.drag[0].style.width = "", sb.drag[0].style.height = "", 
                        sb.trackSize = isH() ? sb.track[0].offsetWidth : sb.track[0].offsetHeight, sb.divider = s.size / s.virtualSize, 
                        sb.moveDivider = sb.divider * (sb.trackSize / s.size), sb.dragSize = sb.trackSize * sb.divider, 
                        isH() ? sb.drag[0].style.width = sb.dragSize + "px" : sb.drag[0].style.height = sb.dragSize + "px", 
                        sb.divider >= 1 ? sb.track[0].style.display = "none" : sb.track[0].style.display = "", 
                        s.params.scrollbarHide && (sb.track[0].style.opacity = 0);
                    }
                },
                setTranslate: function() {
                    if (s.params.scrollbar) {
                        var newPos, sb = s.scrollbar, newSize = (s.translate || 0, sb.dragSize);
                        newPos = (sb.trackSize - sb.dragSize) * s.progress, s.rtl && isH() ? (newPos = -newPos, 
                        newPos > 0 ? (newSize = sb.dragSize - newPos, newPos = 0) : -newPos + sb.dragSize > sb.trackSize && (newSize = sb.trackSize + newPos)) : 0 > newPos ? (newSize = sb.dragSize + newPos, 
                        newPos = 0) : newPos + sb.dragSize > sb.trackSize && (newSize = sb.trackSize - newPos), 
                        isH() ? (s.support.transforms3d ? sb.drag.transform("translate3d(" + newPos + "px, 0, 0)") : sb.drag.transform("translateX(" + newPos + "px)"), 
                        sb.drag[0].style.width = newSize + "px") : (s.support.transforms3d ? sb.drag.transform("translate3d(0px, " + newPos + "px, 0)") : sb.drag.transform("translateY(" + newPos + "px)"), 
                        sb.drag[0].style.height = newSize + "px"), s.params.scrollbarHide && (clearTimeout(sb.timeout), 
                        sb.track[0].style.opacity = 1, sb.timeout = setTimeout(function() {
                            sb.track[0].style.opacity = 0, sb.track.transition(400);
                        }, 1e3));
                    }
                },
                setTransition: function(duration) {
                    s.params.scrollbar && s.scrollbar.drag.transition(duration);
                }
            }, s.controller = {
                LinearSpline: function(x, y) {
                    this.x = x, this.y = y, this.lastIndex = x.length - 1;
                    var i1, i3;
                    this.x.length;
                    this.interpolate = function(x2) {
                        return x2 ? (i3 = binarySearch(this.x, x2), i1 = i3 - 1, (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1]) : 0;
                    };
                    var binarySearch = function() {
                        var maxIndex, minIndex, guess;
                        return function(array, val) {
                            for (minIndex = -1, maxIndex = array.length; maxIndex - minIndex > 1; ) array[guess = maxIndex + minIndex >> 1] <= val ? minIndex = guess : maxIndex = guess;
                            return maxIndex;
                        };
                    }();
                },
                getInterpolateFunction: function(c) {
                    s.controller.spline || (s.controller.spline = s.params.loop ? new s.controller.LinearSpline(s.slidesGrid, c.slidesGrid) : new s.controller.LinearSpline(s.snapGrid, c.snapGrid));
                },
                setTranslate: function(translate, byController) {
                    function setControlledTranslate(c) {
                        translate = c.rtl && "horizontal" === c.params.direction ? -s.translate : s.translate, 
                        "slide" === s.params.controlBy && (s.controller.getInterpolateFunction(c), controlledTranslate = -s.controller.spline.interpolate(-translate)), 
                        controlledTranslate && "container" !== s.params.controlBy || (multiplier = (c.maxTranslate() - c.minTranslate()) / (s.maxTranslate() - s.minTranslate()), 
                        controlledTranslate = (translate - s.minTranslate()) * multiplier + c.minTranslate()), 
                        s.params.controlInverse && (controlledTranslate = c.maxTranslate() - controlledTranslate), 
                        c.updateProgress(controlledTranslate), c.setWrapperTranslate(controlledTranslate, !1, s), 
                        c.updateActiveIndex();
                    }
                    var multiplier, controlledTranslate, controlled = s.params.control;
                    if (s.isArray(controlled)) for (var i = 0; i < controlled.length; i++) controlled[i] !== byController && controlled[i] instanceof Swiper && setControlledTranslate(controlled[i]); else controlled instanceof Swiper && byController !== controlled && setControlledTranslate(controlled);
                },
                setTransition: function(duration, byController) {
                    function setControlledTransition(c) {
                        c.setWrapperTransition(duration, s), 0 !== duration && (c.onTransitionStart(), c.wrapper.transitionEnd(function() {
                            controlled && (c.params.loop && "slide" === s.params.controlBy && c.fixLoop(), c.onTransitionEnd());
                        }));
                    }
                    var i, controlled = s.params.control;
                    if (s.isArray(controlled)) for (i = 0; i < controlled.length; i++) controlled[i] !== byController && controlled[i] instanceof Swiper && setControlledTransition(controlled[i]); else controlled instanceof Swiper && byController !== controlled && setControlledTransition(controlled);
                }
            }, s.hashnav = {
                init: function() {
                    if (s.params.hashnav) {
                        s.hashnav.initialized = !0;
                        var hash = document.location.hash.replace("#", "");
                        if (hash) for (var speed = 0, i = 0, length = s.slides.length; length > i; i++) {
                            var slide = s.slides.eq(i), slideHash = slide.attr("data-hash");
                            if (slideHash === hash && !slide.hasClass(s.params.slideDuplicateClass)) {
                                var index = slide.index();
                                s.slideTo(index, speed, s.params.runCallbacksOnInit, !0);
                            }
                        }
                    }
                },
                setHash: function() {
                    s.hashnav.initialized && s.params.hashnav && (document.location.hash = s.slides.eq(s.activeIndex).attr("data-hash") || "");
                }
            }, s.disableKeyboardControl = function() {
                s.params.keyboardControl = !1, $(document).off("keydown", handleKeyboard);
            }, s.enableKeyboardControl = function() {
                s.params.keyboardControl = !0, $(document).on("keydown", handleKeyboard);
            }, s.mousewheel = {
                event: !1,
                lastScrollTime: new window.Date().getTime()
            }, s.params.mousewheelControl) {
                try {
                    new window.WheelEvent("wheel"), s.mousewheel.event = "wheel";
                } catch (e) {}
                s.mousewheel.event || void 0 === document.onmousewheel || (s.mousewheel.event = "mousewheel"), 
                s.mousewheel.event || (s.mousewheel.event = "DOMMouseScroll");
            }
            s.disableMousewheelControl = function() {
                return s.mousewheel.event ? (s.container.off(s.mousewheel.event, handleMousewheel), 
                !0) : !1;
            }, s.enableMousewheelControl = function() {
                return s.mousewheel.event ? (s.container.on(s.mousewheel.event, handleMousewheel), 
                !0) : !1;
            }, s.parallax = {
                setTranslate: function() {
                    s.container.children("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        setParallaxTransform(this, s.progress);
                    }), s.slides.each(function() {
                        var slide = $(this);
                        slide.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                            var progress = Math.min(Math.max(slide[0].progress, -1), 1);
                            setParallaxTransform(this, progress);
                        });
                    });
                },
                setTransition: function(duration) {
                    "undefined" == typeof duration && (duration = s.params.speed), s.container.find("[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]").each(function() {
                        var el = $(this), parallaxDuration = parseInt(el.attr("data-swiper-parallax-duration"), 10) || duration;
                        0 === duration && (parallaxDuration = 0), el.transition(parallaxDuration);
                    });
                }
            }, s._plugins = [];
            for (var plugin in s.plugins) {
                var p = s.plugins[plugin](s, s.params[plugin]);
                p && s._plugins.push(p);
            }
            return s.callPlugins = function(eventName) {
                for (var i = 0; i < s._plugins.length; i++) eventName in s._plugins[i] && s._plugins[i][eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }, s.emitterEventListeners = {}, s.emit = function(eventName) {
                s.params[eventName] && s.params[eventName](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                var i;
                if (s.emitterEventListeners[eventName]) for (i = 0; i < s.emitterEventListeners[eventName].length; i++) s.emitterEventListeners[eventName][i](arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
                s.callPlugins && s.callPlugins(eventName, arguments[1], arguments[2], arguments[3], arguments[4], arguments[5]);
            }, s.on = function(eventName, handler) {
                return eventName = normalizeEventName(eventName), s.emitterEventListeners[eventName] || (s.emitterEventListeners[eventName] = []), 
                s.emitterEventListeners[eventName].push(handler), s;
            }, s.off = function(eventName, handler) {
                var i;
                if (eventName = normalizeEventName(eventName), "undefined" == typeof handler) return s.emitterEventListeners[eventName] = [], 
                s;
                if (s.emitterEventListeners[eventName] && 0 !== s.emitterEventListeners[eventName].length) {
                    for (i = 0; i < s.emitterEventListeners[eventName].length; i++) s.emitterEventListeners[eventName][i] === handler && s.emitterEventListeners[eventName].splice(i, 1);
                    return s;
                }
            }, s.once = function(eventName, handler) {
                eventName = normalizeEventName(eventName);
                var _handler = function() {
                    handler(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]), s.off(eventName, _handler);
                };
                return s.on(eventName, _handler), s;
            }, s.a11y = {
                makeFocusable: function($el) {
                    return $el.attr("tabIndex", "0"), $el;
                },
                addRole: function($el, role) {
                    return $el.attr("role", role), $el;
                },
                addLabel: function($el, label) {
                    return $el.attr("aria-label", label), $el;
                },
                disable: function($el) {
                    return $el.attr("aria-disabled", !0), $el;
                },
                enable: function($el) {
                    return $el.attr("aria-disabled", !1), $el;
                },
                onEnterKey: function(event) {
                    13 === event.keyCode && ($(event.target).is(s.params.nextButton) ? (s.onClickNext(event), 
                    s.isEnd ? s.a11y.notify(s.params.lastSlideMessage) : s.a11y.notify(s.params.nextSlideMessage)) : $(event.target).is(s.params.prevButton) && (s.onClickPrev(event), 
                    s.isBeginning ? s.a11y.notify(s.params.firstSlideMessage) : s.a11y.notify(s.params.prevSlideMessage)), 
                    $(event.target).is("." + s.params.bulletClass) && $(event.target)[0].click());
                },
                liveRegion: $('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),
                notify: function(message) {
                    var notification = s.a11y.liveRegion;
                    0 !== notification.length && (notification.html(""), notification.html(message));
                },
                init: function() {
                    if (s.params.nextButton) {
                        var nextButton = $(s.params.nextButton);
                        s.a11y.makeFocusable(nextButton), s.a11y.addRole(nextButton, "button"), s.a11y.addLabel(nextButton, s.params.nextSlideMessage);
                    }
                    if (s.params.prevButton) {
                        var prevButton = $(s.params.prevButton);
                        s.a11y.makeFocusable(prevButton), s.a11y.addRole(prevButton, "button"), s.a11y.addLabel(prevButton, s.params.prevSlideMessage);
                    }
                    $(s.container).append(s.a11y.liveRegion);
                },
                initPagination: function() {
                    s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length && s.bullets.each(function() {
                        var bullet = $(this);
                        s.a11y.makeFocusable(bullet), s.a11y.addRole(bullet, "button"), s.a11y.addLabel(bullet, s.params.paginationBulletMessage.replace(/{{index}}/, bullet.index() + 1));
                    });
                },
                destroy: function() {
                    s.a11y.liveRegion && s.a11y.liveRegion.length > 0 && s.a11y.liveRegion.remove();
                }
            }, s.init = function() {
                s.params.loop && s.createLoop(), s.updateContainerSize(), s.updateSlidesSize(), 
                s.updatePagination(), s.params.scrollbar && s.scrollbar && (s.scrollbar.set(), s.params.scrollbarDraggable && s.scrollbar.enableDraggable()), 
                "slide" !== s.params.effect && s.effects[s.params.effect] && (s.params.loop || s.updateProgress(), 
                s.effects[s.params.effect].setTranslate()), s.params.loop ? s.slideTo(s.params.initialSlide + s.loopedSlides, 0, s.params.runCallbacksOnInit) : (s.slideTo(s.params.initialSlide, 0, s.params.runCallbacksOnInit), 
                0 === s.params.initialSlide && (s.parallax && s.params.parallax && s.parallax.setTranslate(), 
                s.lazy && s.params.lazyLoading && (s.lazy.load(), s.lazy.initialImageLoaded = !0))), 
                s.attachEvents(), s.params.observer && s.support.observer && s.initObservers(), 
                s.params.preloadImages && !s.params.lazyLoading && s.preloadImages(), s.params.autoplay && s.startAutoplay(), 
                s.params.keyboardControl && s.enableKeyboardControl && s.enableKeyboardControl(), 
                s.params.mousewheelControl && s.enableMousewheelControl && s.enableMousewheelControl(), 
                s.params.hashnav && s.hashnav && s.hashnav.init(), s.params.a11y && s.a11y && s.a11y.init(), 
                s.emit("onInit", s);
            }, s.cleanupStyles = function() {
                s.container.removeClass(s.classNames.join(" ")).removeAttr("style"), s.wrapper.removeAttr("style"), 
                s.slides && s.slides.length && s.slides.removeClass([ s.params.slideVisibleClass, s.params.slideActiveClass, s.params.slideNextClass, s.params.slidePrevClass ].join(" ")).removeAttr("style").removeAttr("data-swiper-column").removeAttr("data-swiper-row"), 
                s.paginationContainer && s.paginationContainer.length && s.paginationContainer.removeClass(s.params.paginationHiddenClass), 
                s.bullets && s.bullets.length && s.bullets.removeClass(s.params.bulletActiveClass), 
                s.params.prevButton && $(s.params.prevButton).removeClass(s.params.buttonDisabledClass), 
                s.params.nextButton && $(s.params.nextButton).removeClass(s.params.buttonDisabledClass), 
                s.params.scrollbar && s.scrollbar && (s.scrollbar.track && s.scrollbar.track.length && s.scrollbar.track.removeAttr("style"), 
                s.scrollbar.drag && s.scrollbar.drag.length && s.scrollbar.drag.removeAttr("style"));
            }, s.destroy = function(deleteInstance, cleanupStyles) {
                s.detachEvents(), s.stopAutoplay(), s.params.scrollbar && s.scrollbar && s.params.scrollbarDraggable && s.scrollbar.disableDraggable(), 
                s.params.loop && s.destroyLoop(), cleanupStyles && s.cleanupStyles(), s.disconnectObservers(), 
                s.params.keyboardControl && s.disableKeyboardControl && s.disableKeyboardControl(), 
                s.params.mousewheelControl && s.disableMousewheelControl && s.disableMousewheelControl(), 
                s.params.a11y && s.a11y && s.a11y.destroy(), s.emit("onDestroy"), deleteInstance !== !1 && (s = null);
            }, s.init(), s;
        }
    };
    Swiper.prototype = {
        isSafari: function() {
            var ua = navigator.userAgent.toLowerCase();
            return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
        }(),
        isUiWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),
        isArray: function(arr) {
            return "[object Array]" === Object.prototype.toString.apply(arr);
        },
        browser: {
            ie: window.navigator.pointerEnabled || window.navigator.msPointerEnabled,
            ieTouch: window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1
        },
        device: function() {
            var ua = navigator.userAgent, android = ua.match(/(Android);?[\s\/]+([\d.]+)?/), ipad = ua.match(/(iPad).*OS\s([\d_]+)/), ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/), iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
            return {
                ios: ipad || iphone || ipod,
                android: android
            };
        }(),
        support: {
            touch: window.Modernizr && Modernizr.touch === !0 || function() {
                return !!("ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch);
            }(),
            transforms3d: window.Modernizr && Modernizr.csstransforms3d === !0 || function() {
                var div = document.createElement("div").style;
                return "webkitPerspective" in div || "MozPerspective" in div || "OPerspective" in div || "MsPerspective" in div || "perspective" in div;
            }(),
            flexbox: function() {
                for (var div = document.createElement("div").style, styles = "alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient".split(" "), i = 0; i < styles.length; i++) if (styles[i] in div) return !0;
            }(),
            observer: function() {
                return "MutationObserver" in window || "WebkitMutationObserver" in window;
            }()
        },
        plugins: {}
    };
    for (var swiperDomPlugins = [ "jQuery", "Zepto", "Dom7" ], i = 0; i < swiperDomPlugins.length; i++) window[swiperDomPlugins[i]] && addLibraryPlugin(window[swiperDomPlugins[i]]);
    var domLib;
    domLib = "undefined" == typeof Dom7 ? window.Dom7 || window.Zepto || window.jQuery : Dom7, 
    domLib && ("transitionEnd" in domLib.fn || (domLib.fn.transitionEnd = function(callback) {
        function fireCallBack(e) {
            if (e.target === this) for (callback.call(this, e), i = 0; i < events.length; i++) dom.off(events[i], fireCallBack);
        }
        var i, events = [ "webkitTransitionEnd", "transitionend", "oTransitionEnd", "MSTransitionEnd", "msTransitionEnd" ], dom = this;
        if (callback) for (i = 0; i < events.length; i++) dom.on(events[i], fireCallBack);
        return this;
    }), "transform" in domLib.fn || (domLib.fn.transform = function(transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
    }), "transition" in domLib.fn || (domLib.fn.transition = function(duration) {
        "string" != typeof duration && (duration += "ms");
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    })), window.Swiper = Swiper;
}(), "undefined" != typeof module ? module.exports = window.Swiper : "function" == typeof define && define.amd && define([], function() {
    "use strict";
    return window.Swiper;
});