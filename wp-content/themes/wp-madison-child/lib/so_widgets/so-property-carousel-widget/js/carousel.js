jQuery( function($){
    // The carousel widget
    $('.rdc-carousel-wrapper').each(function(){

        var $$ = $(this),
            $container = $$.closest('.rdc-carousel-container').parent(),
            $itemsContainer = $$.find('.rdc-carousel-items'),
            $items = $$.find('.rdc-carousel-item'),
            $firstItem = $items.eq(0);

        var position = 0,
            page = 1,
            fetching = false,
            numItems = $items.length,
            totalPosts = $$.data('found-posts'),
            complete = numItems == totalPosts,
            itemWidth = ( $firstItem.width() + parseInt($firstItem.css('margin-right')) );

        var updatePosition = function() {
            if ( position < 0 ) position = 0;
            if ( position >= $$.find('.rdc-carousel-item').length - 1 ) {
                position = $$.find('.rdc-carousel-item').length - 1;
                // Fetch the next batch
                if( !fetching &&  !complete ) {
                    fetching = true;
                    page++;
                    $itemsContainer.append('<li class="rdc-carousel-item rdc-carousel-loading"></li>');

                    $.get(
                        $$.data('ajax-url'),
                        {
                            query : $$.data('query'),
                            action : 'rdc_carousel_load',
                            paged : page
                        },
                        function (data, status){
                            var $items = $(data.html);
                            $items.appendTo( $itemsContainer ).hide().fadeIn();
                            $$.find('.rdc-carousel-loading').remove();
                            numItems = $$.find('.rdc-carousel-item').length;
                            complete = numItems == totalPosts;
                            fetching = false;
                        }
                    )
                }
            }
            $itemsContainer.css('transition-duration', "0.45s");
            $itemsContainer.css('margin-left', -( itemWidth * position) + 'px' );
        };

        $container.on( 'click', 'a.rdc-carousel-previous',
            function(e){
                e.preventDefault();
                position -= 1;
                updatePosition();
            }
        );

        $container.on( 'click', 'a.rdc-carousel-next',
            function(e){
                e.preventDefault();
                position += 1;
                updatePosition();
            }
        );
        var validSwipe = false;
        var prevDistance = 0;
        var startPosition = 0;
        var velocity = 0;
        var prevTime = 0;
        var posInterval;
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
                    if( direction == "left" ) distance *= -1;
                    setNewPosition(startPosition + distance);
                    var newTime = new Date().getTime();
                    var timeDelta = (newTime - prevTime) / 1000;
                    velocity = (distance - prevDistance) / timeDelta;
                    prevTime = newTime;
                    prevDistance = distance;
                }
                else if ( phase == "end" ) {
                    validSwipe = true;
                    if( direction == "left" ) distance *= -1;
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
                            if(direction == "left") {
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
        var setNewPosition = function(newPosition) {
            if(newPosition < 50 && newPosition >  -( itemWidth * numItems )) {
                $itemsContainer.css('transition-duration', "0s");
                $itemsContainer.css('margin-left', newPosition + 'px' );
                return true;
            }
            return false;
        };
        var setFinalPosition = function() {
            var finalPosition = parseInt( $itemsContainer.css('margin-left') );
            position = Math.abs( Math.round( finalPosition / itemWidth ) );
            updatePosition();
        };
        $$.on('click', '.rdc-carousel-item a',
            function (event) {
                if(validSwipe) {
                    event.preventDefault();
                    validSwipe = false;
                }
            }
        )
    } );
} );