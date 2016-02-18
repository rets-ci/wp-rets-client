jQuery(document).ready(function(){
    jQuery('.archive .featuredImageHeader').css('height', jQuery(window).height()-212);
    jQuery('.single .featuredImageHeader, .blog .featuredImageHeader').css('height', jQuery(window).height()-132);
    jQuery('.mobileMenu').css('min-height', jQuery(window).height());
    jQuery( ".speed" ).selectmenu(); // custom select
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
        if( $(event.target).closest(".sfBeds ul, .sfBaths ul").length )
            return;
        jQuery(".sfBeds ul, .sfBaths ul").slideUp("slow");
        event.stopPropagation();
    });
    jQuery('.sfBeds span, .sfBaths span').click( function() {
        jQuery(this).siblings(".sfBeds ul, .sfBaths ul").slideToggle("slow");
        return false;
    });
    jQuery(function($){
        jQuery("#phone").mask("99/99/9999",{placeholder:"mm/dd/yyyy"});
    })
});



