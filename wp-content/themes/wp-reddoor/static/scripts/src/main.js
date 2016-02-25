jQuery(document).ready(function(){
    jQuery('.archive .featuredImageHeader').css('height', jQuery(window).height()-212);
    jQuery('.single .featuredImageHeader, .blog .featuredImageHeader').css('height', jQuery(window).height()-132);
    jQuery('.mobileMenu').css('min-height', jQuery(window).height());
    //jQuery( ".speed" ).selectmenu(); // custom select
    jQuery( "#tabs" ).tabs(); //tabs for search form

    /* Mobile menu slide */
    jQuery('.toggle').on('click', function(){
        jQuery('.mobileMenu').animate({'left':'0'},400).css('position', 'fixed');
    });
    jQuery('.closeMobileMenu').on('click', function(){
        jQuery('.mobileMenu').animate({'left':'-80%'},400);
    });
    /* Mobile menu slide */

    /* Mobile slide sub-menu */
    jQuery('.menuAdaptive li').on('click', function(){
        var ourItem = jQuery(this);
       jQuery('.menuAdaptive' + ourItem +  '.sub-menu').css('display', 'block');
    });

    /* Mobile slide sub-menu */
    jQuery(function() {
        jQuery( ".menuAdaptive" ).accordion();
    });

    /* Search-form slide selects */
    jQuery(document).click( function(event){
        if( jQuery(event.target).closest(".sfBeds ul, .sfBaths ul, .sfPriceRange").length )
            return;
        jQuery(".sfBeds ul, .sfBaths ul, .sfPriceRange").slideUp("slow");
        event.stopPropagation();
    });
    jQuery('.sfBeds span, .sfBaths span, .sfPrice span').click( function() {
        jQuery(this).siblings(".sfBeds ul, .sfBaths ul, .sfPriceRange").slideToggle("slow");
        return false;
    });
    /* Search-form slide selects */

    jQuery(function($){
        jQuery("#phone").mask("+919-333-333",{placeholder:"+919-XXX-XXX"});
    })
    jQuery(function () {
        //script for popups
        jQuery('.showContactPopup a').click(function () {
            jQuery('div.'+jQuery(this).attr("rel")).fadeIn(500);
            jQuery("body").append("<div id='overlay'></div>");
            jQuery('#overlay').show().css({'filter' : 'alpha(opacity=80)'});
            return false;
        });
        jQuery('span.exitPopup').click(function () {
            jQuery(this).parent().fadeOut(100);
            jQuery('#overlay').remove('#overlay');
            return false;
        });
    });
    /* Price Range */
    jQuery('.firstRangeList a').on('click', function(){
        jQuery('.firstRange').val(jQuery(this).attr('val'));
        jQuery('.lastRangeList').show();
        jQuery('.firstRangeList').hide();
    });
    jQuery('.lastRangeList a').on('click', function(){
        jQuery('.lastRange').val(jQuery(this).attr('val'));
        jQuery('.lastRangeList').hide();
    });
    jQuery('.firstRange').on('click', function(){
       jQuery('.firstRangeList').show();
       jQuery('.lastRangeList').hide();
    });
    jQuery('.lastRange').on('click', function(){
        jQuery('.lastRangeList').show();
        jQuery('.firstRangeList').hide();
    });
    jQuery('.citiesSelection').select2({
        ajax: {
            url: "/wp-admin/admin-ajax.php?action=TermsSearchable",
            dataType: 'json',
            processResults: function(data, page){
                return {
                    results: data.data
                }
            }
        },
        templateResult: function formatRepo (city) {
            if (city.loading) return city.text;

            var html = "<span style='float: left; max-width: 200px; overflow: hidden; height: 23px;'>" + city.name  + "</span><span style='float: right; color: red;'>" + city.taxonomy + "</span>";
            return html;
        },
        escapeMarkup: function (markup) { return markup; },
        templateSelection: function formatRepoSelection (city) {
        return city.name;
    }
    });
    jQuery('.facebookFootIcon a').html('<svg class="icon icon-facebook"><use xlink:href="#icon-facebook"></use></svg>');
    jQuery('.twitterFootIcon a').html('<svg class="icon icon-twitter"><use xlink:href="#icon-twitter"></use></svg>');
    jQuery('.googleFootIcon a').html('<svg class="icon icon-google-plus"><use xlink:href="#icon-google-plus"></use></svg>');
    jQuery('.linkedFootIcon a').html('<svg class="icon icon-linkedin2"><use xlink:href="#icon-linkedin2"></use></svg>');
    jQuery('.instagramFootIcon a').html('<svg class="icon icon-instagram"><use xlink:href="#icon-instagram"></use></svg>');

    jQuery('.menuDesktop > .menu-item > a').removeAttr('href');

    jQuery('.formTabs').on('click', function(){
        var menuItem = jQuery(this).data('topmenu');
        jQuery('.menuDesktop li').removeClass('current-menu-item');
        jQuery('.' + menuItem).addClass('current-menu-item');
    });

    jQuery('.menuDesktop > li').on('click', function(){
        jQuery('.menuDesktop > li').removeClass('current-menu-item');
        jQuery(jQuery(this)).addClass('current-menu-item');
    });

    jQuery('.itemData > a').on('click', function(){
        var itemTopMenu = (jQuery(this).attr('rel'));
        jQuery('[data-topmenu="'+ itemTopMenu +'"] > a').click();
    });

    jQuery('.association-carousel .sow-carousel-wrapper').append('<div class="assocCarouselBg"></div>');
});

function map_resize() {
    var height = jQuery(window).height()-jQuery("#header").height()-40;
    console.log(height);
    if ( height < 400 ) {
        height = 400;
    }
    jQuery('.wpp-advanced-supermap, .sm-properties-list-wrap, ng-map').height(height);
    jQuery('.sm-properties-list-wrap').css('overflow-y', 'scroll');
}

jQuery(window).load(function(){
    var resizeTimer;
    jQuery(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(map_resize, 250);
    }).resize();
});