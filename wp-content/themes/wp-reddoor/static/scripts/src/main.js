(function(){

  jQuery( document ).ready( function () {

    //jQuery('.archive .featuredImageHeader').css('height', jQuery(window).height()-212);
    //jQuery('.single .featuredImageHeader, .blog .featuredImageHeader, .single-property .slideshowHeadImage').css('height', jQuery(window).height()-132);
    //jQuery('.home .frontPageSearchBlock').css('height', jQuery(window).height()-90);
    //jQuery('.page-template .so-widget-sow-hero, .page-template .sow-slider-image-cover, .page-template .sow-slider-images').css('height', jQuery(window).height()-132);
    jQuery( '.mobileMenu' ).css( 'min-height', jQuery( window ).height() );

    jQuery( ".rdc-accordion" ).accordion( {
      active: false,
      collapsible: true,
      heightStyle: "content"
    } );

    //jQuery( '.ui-accordion-content' ).css( 'height', jQuery( '.ui-accordion-content' ).outerHeight() - 200 );

    /* Mobile menu slide */
    jQuery( '.toggle' ).on( 'click', function () {
      jQuery( '.mobileMenu' ).animate( { 'left': '0' }, 400 ).css( 'position', 'absolute' );
    } );
    jQuery( '.closeMobileMenu' ).on( 'click', function () {
      jQuery( '.mobileMenu' ).animate( { 'left': '-80%' }, 400 );
    } );
    /* Mobile menu slide */

    /* Mobile slide sub-menu */
    jQuery( function () {
      jQuery( ".menuAdaptive" ).accordion();
    } );

    /* Footer social icons */
    jQuery( '.facebookFootIcon a' ).html( '<span class="icon-wpproperty-social-facebook-symbol"></span>' );
    jQuery( '.twitterFootIcon a' ).html( '<span class="icon-wpproperty-social-twitter-symbol"></span>' );
    jQuery( '.googleFootIcon a' ).html( '<span class="icon-wpproperty-social-googleplus-symbol"></span>' );
    jQuery( '.linkedFootIcon a' ).html( '<span class="icon-wpproperty-social-linkedin-symbol"></span>' );
    jQuery( '.instagramFootIcon a' ).html( '<span class="icon-wpproperty-social-instagram-symbol"></span>' );

    jQuery( '.archive .ourCompanyBtn, .category .ourCompanyBtn, .single .ourCompanyBtn, .blog .ourCompanyBtn' ).addClass( 'current-menu-item' );

    if( jQuery( 'body.page' ).hasClass( 'home' ) ) {
      jQuery( '#menu-header li' ).removeClass( 'current-menu-item' );
      jQuery( '.home .buyBtnForm' ).addClass( 'current-menu-item' );
    }

    jQuery( '.page .ourCompanyBtn.current_page_parent' ).addClass( 'current-menu-item' );

    jQuery( '.menuDesktop > .menu-item > a' ).removeAttr( 'href' );

    jQuery( '.formTabs' ).on( 'click', function () {
      var menuItem = jQuery( this ).data( 'topmenu' );
      jQuery( '.menuDesktop li' ).removeClass( 'current-menu-item' );
      jQuery( '.' + menuItem ).addClass( 'current-menu-item' );
    } );

    jQuery( '.menuDesktop > li' ).on( 'click', function () {
      jQuery( '.menuDesktop > li' ).removeClass( 'current-menu-item' );
      jQuery( jQuery( this ) ).addClass( 'current-menu-item' );
    } );

    jQuery( '.itemData > a' ).on( 'click', function () {
      var itemTopMenu = (jQuery( this ).attr( 'rel' ));
      jQuery( '[data-topmenu="' + itemTopMenu + '"] > a' ).click();
    } );

    jQuery( '.association-carousel .sow-carousel-wrapper' ).append( '<div class="assocCarouselBg"></div>' );

    if (jQuery(window).width() > 1200) {
      rdc_property_sticky();
    }

    if (jQuery(window).width() < 1200) {
      rdc_agent_carousel_item_width();
    }


    /**
     * Tabbed content widget (feature point)
     */
    var imgFeaturePoint = jQuery( '.featurePoint div' ).outerHeight();
    var iconHeight = jQuery( '.featurePoint > span' ).outerHeight();
    var featurePointMarg = (imgFeaturePoint - iconHeight) / 2;
    jQuery( '.featurePoint' ).css( 'height', imgFeaturePoint );
    jQuery( '.featurePoint > span' ).css( 'margin-top', featurePointMarg );

    /**
     * Set row height for tabbed Widget Image Area
     */
    jQuery.each( jQuery( '.so-widget-tabbed-content .tabbedWidgetImageArea' ), function eachColumn( index, element ){
      jQuery( element ).height( jQuery( element ).closest( '.sow-slider-image-wrapper' ).height() );
    } );

    /* Share button */
    jQuery( '.shareButton' ).on( 'click', function () {
      jQuery( this ).toggleClass( 'shareButtonColor' );
      jQuery( '.singleShareContainer' ).toggle( 'slow' );
    } );

    jQuery( '.widget_nav_menu ul.menu li:first-child' ).append( '<span class="menu-spoiler arrow-down"></span>' );
    jQuery( '.widget_nav_menu ul.menu .menu-spoiler' ).on( 'click', function () {
      jQuery( '.widget_nav_menu ul.menu li+li' ).slideToggle();
      jQuery( this ).toggleClass( 'arrow-down' );
    } );

    if(jQuery(window).width() > 620) {

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

    }

    /**
     * Load "More" elements of same kind.
     *
     * - data-element-kind must exist on every element that is already displayed of this kind
     * - data-kind - attribute of 'load more' button and must match data-element-kind on displayed elements
     * - data-action - should match AJAX handler action
     * - data-category - optional category for loading posts
     *
     * The offset is calculated automatically based on total number of elements of same kind
     *
     * @todo Could also calculate if there more elements to load by seeing if returned count is less than per_page.
     * @author potanin@UD
     */
    jQuery('button[data-handler=load-more]').on('click', function loadMore( e ) {

      // get button as jQuery element
      var element = jQuery( this );

      // make button disabled
      element.prop('disabled',true);

      var _options = {
        action: jQuery( this ).attr( 'data-action' ),
        category: jQuery( this ).attr( 'data-category' ),
        kind: jQuery( this ).attr( 'data-kind' )
      };

      // find similar elements we'll be adding more of
      var kindElements = jQuery( '[data-element-kind=' + _options.kind + ']' );

      // console.log( '_options', _options );

      jQuery.ajax({
        url: '/wp-admin/admin-ajax.php',
        data: {
          action: _options.action,
          offset: kindElements.size(),
          kind: _options.kind,
          category: _options.category
        },
        success: function onSuccess( data, type ) {
          // console.log( 'onSuccess', data );

          // remove disabled state from button
          element.prop('disabled',false);

          // insert loaded elements after last item of same kind
          kindElements.last().after( data );

        }
      });

    });

    /**
     * Renders Neighborhood Map on every tab selection
     * ( used on Single Property page )
     *
     * @author peshkov@UD
     */
    jQuery( 'li a', 'ul.ws_nmaps').on( 'click', function(){
      var id = jQuery(this).attr( 'href').replace( '#', '' );
      renderNeighborhoodMap( jQuery( '#'+id).get(0) );
    } );
    // Render Neighborhood Map in active nmap tab on page ready
    renderNeighborhoodMap( jQuery( jQuery( 'li.active a', 'ul.ws_nmaps' ).attr( 'href') ).get(0) );

    /**
     * Set row height for 'bg-image' block
     */
    jQuery.each( jQuery( '.panel-grid-cell .bg-image' ), function eachColumn( index, element ){
      jQuery( element ).height( jQuery( element ).closest( '.panel-grid' ).height() );
    } );

  } );

  function map_resize() {
    if ( jQuery( window ).width() < 990 ) {
      jQuery('.wpp-advanced-supermap, .sm-properties-list-wrap, ng-map').height('auto');
    } else {
      var height = jQuery(window).height() - jQuery("#header").height() - 40;
      if (height < 400) {
        height = 400;
      }
      jQuery('.wpp-advanced-supermap, .sm-properties-list-wrap, ng-map').height(height);
    }
  }

  /**
   * Resizes Search Block on Home page to fit the Viewport
   *
   * @author peshkov@UD
   */
  function frontPageSearchBlock_resize() {
    var height = jQuery(window).height()-jQuery("#header").height()-jQuery('.association-carousel').height()-100;
    if( jQuery( '#wpadminbar').length > 0 ) {
      height = height - jQuery( '#wpadminbar').height();
    }
    jQuery('.frontPageSearchBlock').height(height);
    console.log( jQuery('.frontPageSearchBlock').height() );
  }

  function rdc_property_sticky() {
      jQuery("#propertyDetails").sticky({topSpacing: 0, bottomSpacing: 1000});
  }

  function rdc_agent_carousel_item_width(){
      jQuery('.rdc-agents-carousel-item').width(jQuery('.rdc-agents-carousel-wrapper').width());
  }

  jQuery( window ).load( function () {
    var resizeTimer;
    jQuery( window ).on( 'resize', function () {
      clearTimeout( resizeTimer );
      resizeTimer = setTimeout( function () {
        map_resize();
        frontPageSearchBlock_resize();
        if (jQuery(window).width() > 1200) {
          rdc_property_sticky();
        }
        rdc_agent_carousel_item_width();
      }, 250 );
    } ).resize();
  } );

  /**
   * parse_str function
   *
   * @subpackages URL
   * @author shogo < shogo4405 at gmail dot com >
   * @version 1.0.0RC3
   * @see http://www.php.net/parse_str
   * @param  {String} s string
   * @param  {Object} o object
   */
  function parse_str(s, o) {
    var i, f, p, m, r = /\[(.*?)\]/g;
    s = decodeURI(s.toString()).replace(/\+/g,' ').split('&');

    function c(o, k, v, p) {
      var n, m = r.exec(p);

      if(m != null) {
        n = m[1];
        if(typeof(o[k]) == 'undefined'){ o[k] = []; };
        c(o[k], n || o[k].length.toString(), v, p);
        return;
      };

      o[k] = v;
    };

    for(i=0,f=s.length;i<f;i++) {
      p = s[i].split('='), m = p[0].indexOf('[');
      c(o || this, (0 <= m) ? p[0].slice(0, m) : p[0], decodeURIComponent(p[1]), p[0]);
    };

  };

  /**
   * Renders Neighborhood Map
   *
   * @param el
   */
  function renderNeighborhoodMap( el ){
    if( jQuery( el ).length <= 0 ) {
      console.log( 'renderNeighborhoodMap:failed', 'No DOM element found', el );
    }

    var data = {};
    var options = jQuery( el).data( 'nmap-options' );

    if( options ) {
      parse_str( options, data );
      console.log(data);
    } else {
      return false;
    }

    jQuery.extend( data, {
      action: 'wpp_walkscore_nmap'
    } );

    //console.log( 'renderNeighborhoodMap:options', data );

    jQuery.ajax({
      url: '/wp-admin/admin-ajax.php',
      data: data,
      success: function onSuccess( data, type ) {
        jQuery( '#property_walkscore_neighborhood').remove();
        jQuery(el).append( data );
      }
    });
  }

})();

