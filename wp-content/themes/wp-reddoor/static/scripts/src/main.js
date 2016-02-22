jQuery(document).ready(function(){
    jQuery('.archive .featuredImageHeader').css('height', jQuery(window).height()-212);
    jQuery('.single .featuredImageHeader, .blog .featuredImageHeader').css('height', jQuery(window).height()-132);
    jQuery('.mobileMenu').css('min-height', jQuery(window).height());
    //jQuery( ".speed" ).selectmenu(); // custom select
    jQuery( "#tabs" ).tabs(); //tabs for search form

    /* autocomplete input */
    var availableTags = [
        "ActionScript",
        "AppleScript",
        "Asp",
        "BASIC",
        "C",
        "C++",
        "Clojure",
        "COBOL",
        "ColdFusion",
        "Erlang",
        "Fortran",
        "Groovy",
        "Haskell",
        "Java",
        "JavaScript",
        "Lisp",
        "Perl",
        "PHP",
        "Python",
        "Ruby",
        "Scala",
        "Scheme"
    ];
    jQuery( ".tags" ).autocomplete({
        source: availableTags
    });
    /* autocomplete input end */
    jQuery('.toggle').on('click', function(){
        jQuery('.mobileMenu').animate({'left':'0'},400);
    });
    jQuery('.closeMobileMenu').on('click', function(){
        jQuery('.mobileMenu').animate({'left':'-80%'},400);
    });
    jQuery(document).click( function(event){
        if( $(event.target).closest(".sfBeds ul, .sfBaths ul, .sfPriceRange").length )
            return;
        jQuery(".sfBeds ul, .sfBaths ul, .sfPriceRange").slideUp("slow");
        event.stopPropagation();
    });
    jQuery('.sfBeds span, .sfBaths span, .sfPrice span').click( function() {
        jQuery(this).siblings(".sfBeds ul, .sfBaths ul, .sfPriceRange").slideToggle("slow");
        return false;
    });
    jQuery(function($){
        jQuery("#phone").mask("+919-333-333",{placeholder:"+919-XXX-XXX"});
    })
    jQuery(function () {
        //script for popups
        jQuery('.showContactPopup a').click(function () {
            jQuery('div.'+$(this).attr("rel")).fadeIn(500);
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
            var html = city.name;
            return html;
        }
    });
});

jQuery(window).load(function(){
    jQuery('.wpp-advanced-supermap, .sm-properties-list-wrap, ng-map').height(jQuery(window).height()-jQuery("#header").height());
});