var ratingsArea;
(function($) {
    $( document ).ready(function() {
        if(!ratingsArea){
            ratingsArea = new RatingsArea();
            ratingsArea.init();
        }
    });

    function RatingsArea(){
        var settings = {
            'ajaxAction' : 'jsRatingsProcess',
            'requestUrl' : '/wp-admin/admin-ajax.php'
        };

        this.setup = function(vars){

        };

        this.init = function(mode, vars){
            this.setup(vars);
            //open area
            var area = $('.ratings_area');
            if(area.length > 0){
                this.animateArea('open');
            }
        };

        this.animateArea = function(mode){
            var area = $('.ratings_area');

            if(mode == 'open'){
                area.css({'bottom': -area.outerHeight(), 'visibility': 'visible'});
                setTimeout(function(){
                    area.animate({
                        bottom: 0
                    }, 500, function() {
                        area.addClass('active');
                    });
                },1000);
            }

            if(mode == 'close'){
                area.animate({
                    bottom: -(area.outerHeight())
                }, 500, function() {
                    area.remove();
                });
            }
        };

        this.click = function(line, rate, widget_id){
            var line = $(line);
            var area = line.closest('.ratings_area');

            //hide area
            this.animateArea('close');

            $.ajax({
                type: "POST",
                url: settings.requestUrl,
                data: {
                    'mode'      : 'click',
                    'action'    : settings.ajaxAction,
                    'rate'      : rate,
                    'widget_id' : widget_id,
                    'referer'   : window.location.href
                },
                dataType: "json",
                cache: false,
                success: function(data){
                    if(data && data.result == 1){

                    }
                }
            });
        }
    }
})(jQuery);
