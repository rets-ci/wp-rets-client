jQuery(document).ready(function(){
    //jQuery('.archive .featuredImageHeader').css('height', jQuery(window).height()-212);
    //jQuery('.single .featuredImageHeader, .blog .featuredImageHeader, .single-property .slideshowHeadImage').css('height', jQuery(window).height()-132);
    //jQuery('.home .frontPageSearchBlock').css('height', jQuery(window).height()-90);
    //jQuery('.page-template .so-widget-sow-hero, .page-template .sow-slider-image-cover, .page-template .sow-slider-images').css('height', jQuery(window).height()-132);
    jQuery('.mobileMenu').css('min-height', jQuery(window).height());

    jQuery( ".rdc-accordion" ).accordion({
        active: false,
        collapsible: true,
    });
    jQuery('.ui-accordion-content').css('height', jQuery('.ui-accordion-content').outerHeight()-200);

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

    /* Footer social icons */
    jQuery('.facebookFootIcon a').html('<span class="icon-wpproperty-social-facebook-symbol"></span>');
    jQuery('.twitterFootIcon a').html('<span class="icon-wpproperty-social-twitter-symbol"></span>');
    jQuery('.googleFootIcon a').html('<span class="icon-wpproperty-social-googleplus-symbol"></span>');
    jQuery('.linkedFootIcon a').html('<span class="icon-wpproperty-social-linkedin-symbol"></span>');
    jQuery('.instagramFootIcon a').html('<span class="icon-wpproperty-social-instagram-symbol"></span>');

    jQuery('.archive .ourCompanyBtn, .category .ourCompanyBtn, .single .ourCompanyBtn, .blog .ourCompanyBtn').addClass('current-menu-item');

    if(jQuery('body.page').hasClass('home')){
        jQuery('#menu-header li').removeClass('current-menu-item');
        jQuery('.home .buyBtnForm').addClass('current-menu-item');
    }

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

    jQuery("#propertyDetails").sticky({topSpacing:0});

    /* Tabbed content widget (feature point) */
    var imgFeaturePoint = jQuery('.featurePoint div').outerHeight();
    var iconHeight = jQuery('.featurePoint > span').outerHeight();
    var featurePointMarg = (imgFeaturePoint - iconHeight) / 2;
    var tabbedWidgetImageHeight = jQuery('.tabbedWidgetContent').outerHeight();
    jQuery('.featurePoint').css('height', imgFeaturePoint);
    jQuery('.featurePoint > span').css('margin-top', featurePointMarg);
    jQuery('.tabbedWidgetImageArea').css('height', tabbedWidgetImageHeight);

    /* Share button */
    jQuery('.shareButton').on('click', function(){
        jQuery(this).toggleClass('shareButtonColor');
        jQuery('.singleShareContainer').toggle('slow');
    });

    jQuery('#menu-home-buying-page-sub-menu li:first-child').append('<span class="homeBuyingMenuSpoiler arrow-down"></span>');
    jQuery('.homeBuyingMenuSpoiler').on('click', function() {
        jQuery('#menu-home-buying-page-sub-menu li+li').slideToggle();
        jQuery(this).toggleClass('arrow-down');
    });
    jQuery('.archiveFilterBody ul li:first-child').append('<span class="archiveFilterMenuSpoiler arrow-down"></span>');
    jQuery('.archiveFilterMenuSpoiler').on('click', function() {
        jQuery('.archiveFilterBody ul li+li').slideToggle();
        jQuery(this).toggleClass('arrow-down');
    });

    var $grid = jQuery('.grid').masonry({
        // options
        itemSelector: '.grid-item',
        singleMode: true,
        isResizable: true,
        transitionDuration: 0,
    });

    jQuery('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        $grid.masonry('layout');
    })


});

function map_resize() {
    var height = jQuery(window).height()-jQuery("#header").height()-40;
    if ( height < 400 ) {
        height = 400;
    }
    jQuery('.wpp-advanced-supermap, .sm-properties-list-wrap, ng-map').height(height);
}

jQuery(window).load(function(){
    var resizeTimer;
    jQuery(window).on('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(map_resize, 250);
    }).resize();
});