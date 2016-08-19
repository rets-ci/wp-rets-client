function rdc_init_agents_carousel(){
    jQuery('.rdc-agents-carousel-wrapper').each(function(){

        var $$ = jQuery(this),
            $postsContainer = $$.closest('.rdc-agents-carousel-container'),
            $container = $$.closest('.rdc-agents-carousel-container').parent(),
            $itemsContainer = $$.find('.rdc-agents-carousel-items'),
            $items = $$.find('.rdc-agents-carousel-item'),
            $firstItem = $items.eq(0);

        var position = 0,
            page = 1,
            fetching = false,
            numItems = $items.length,
            totalPosts = $$.data('found-posts'),
            complete = numItems == totalPosts,
            itemWidth = ( $firstItem.width() + parseInt($firstItem.css('margin-right')) ),
            isRTL = $postsContainer.hasClass('js-rtl'),
            updateProp = isRTL ? 'margin-right' : 'margin-left';

        // console.log(numItems);

        var updatePosition = function() {
            if ( position < 0 ) position = 0;
            if ( position >= $$.find('.rdc-agents-carousel-item').length - 1 ) {
                position = $$.find('.rdc-agents-carousel-item').length - 1;
            }
            $itemsContainer.css('transition-duration', "0.45s");
            $itemsContainer.css(updateProp, -( itemWidth * position) + 'px' );
        };

        $container.on( 'click', 'a.rdc-agents-carousel-previous',
            function(e){
                e.preventDefault();
                position -= isRTL ? -1 : 1;
                updatePosition();
            }
        );

        $container.on( 'click', 'a.rdc-agents-carousel-next',
            function(e){
                e.preventDefault();
                position += isRTL ? -1 : 1;
                updatePosition();
            }
        );
        var validSwipe = false;
        var prevDistance = 0;
        var startPosition = 0;
        var velocity = 0;
        var prevTime = 0;
        var posInterval;
        var negativeDirection = isRTL ? 'right' : 'left';

        // Verify "swipe" method exists prior to invoking it.
        if( 'function' === typeof $$.swipe && numItems > 1 ) {
            $$.swipe( {
                excludedElements: "",
                triggerOnTouchEnd: true,
                threshold: 75,
                swipeStatus: function (event, phase, direction, distance, duration, fingerCount, fingerData) {
                    if ( phase == "start" ) {
                        startPosition = -( itemWidth * position);
                        prevTime = new Date().getTime();
                        clearInterval(posInterval);
                    }
                    else if ( phase == "move" ) {
                        if( direction == negativeDirection ) distance *= -1;
                        setNewPosition(startPosition + distance);
                        var newTime = new Date().getTime();
                        var timeDelta = (newTime - prevTime) / 1000;
                        velocity = (distance - prevDistance) / timeDelta;
                        prevTime = newTime;
                        prevDistance = distance;
                    }
                    else if ( phase == "end" ) {
                        validSwipe = true;
                        if( direction == negativeDirection ) distance *= -1;
                        if(Math.abs(velocity) > 400) {
                            velocity *= 0.1;
                            var startTime = new Date().getTime();
                            var cumulativeDistance = 0;
                            posInterval = setInterval(function () {
                                var time = (new Date().getTime() - startTime) / 1000;
                                cumulativeDistance += velocity * time;
                                var newPos = startPosition + distance + cumulativeDistance;
                                var decel = 30;
                                var end = (Math.abs(velocity) - decel) < 0;
                                if(direction == negativeDirection) {
                                    velocity += decel;
                                } else {
                                    velocity -= decel;
                                }
                                if(end || !setNewPosition(newPos)) {
                                    clearInterval(posInterval);
                                    setFinalPosition();
                                }
                            }, 20);
                        } else {
                            setFinalPosition();
                        }
                    }
                    else if( phase == "cancel") {
                        updatePosition();
                    }
                }
            } );
        }

        if(jQuery(window).width() > 992 && jQuery(window).width() < 1200) {
            if (numItems <= 1) {
                jQuery('body.single-property .singlePropertyHeader .rdc-agents-carousel-container .rdc-agents-carousel-items').css('position', 'relative');
            }
        }

        var setNewPosition = function(newPosition) {
            if(newPosition < 50 && newPosition >  -( itemWidth * numItems )) {
                $itemsContainer.css('transition-duration', "0s");
                $itemsContainer.css(updateProp, newPosition + 'px' );
                return true;
            }
            return false;
        };
        var setFinalPosition = function() {
            var finalPosition = parseInt( $itemsContainer.css(updateProp) );
            position = Math.abs( Math.round( finalPosition / itemWidth ) );
            updatePosition();
        };
        $$.on('click', '.rdc-agents-carousel-item a',
            function (event) {
                if(validSwipe) {
                    event.preventDefault();
                    validSwipe = false;
                }
            }
        )
    } );
}

jQuery(document).ready(function(){
        // The carousel widget


});

jQuery( window ).load( function () {
    rdc_init_agents_carousel();
    var resizeTimer;
    jQuery( window ).on( 'resize', function () {
        clearTimeout( resizeTimer );
        resizeTimer = setTimeout( function () {
            rdc_init_agents_carousel();
        }, 100 );
    } ).resize();
} );