/**
 * Global RDC Object
 *
 * @type {{client: rdc.getClient, getCount: rdc.getCount}}
 */
var rdc = {

  /**
   * Get Elasticsearch client.
   *
   * @returns {*}
   */
  client: function getClient() {

    if ( 'object' !== typeof jQuery.es || typeof jQuery.es.Client !== 'function' ) {
      // console.log( "ElasticSearch client not loaded." );
      return false;
    }

    // return stored client or create new one
    return rdc.__client = ( rdc.__client || new jQuery.es.Client({
        host: 'dori-us-east-1.searchly.com',
        index: 'v5',
    }));

  },

  /**
   * Get sale_type count
   *
   *  rdc.getCount('Rent', callback );
   *
   * @param type
   * @param callback
   */
  getCount: function getCount( type, callback ) {

    rdc.client().search({
      index: 'v5',
      type: 'property',
      method: "GET",
      q: 'tax_input.sale_type:' + type,
      size: 0,
      headers: {
        "Authorization": make_base_auth( "supermap", "oxzydzbx4rn0kcrjyppzrhxouxrgp32n" )
      },
    }, function (err, response) {

      // trigger callback if everything come sback okay.
      if( 'function' === typeof callback && response && response.hits && response.hits.total ) {
        return callback( null, rdc.numberWithCommas( response.hits.total ) );
      }

      if( 'function' === typeof callback ) {
        console.error( "Unable get rd.getCount()" );
        return callback( err || new Error( "Unexpected response." ) );
      }

    })

  },

  /**
   * Format Number to have commas.
   *
   * @param x
   * @returns {*}
   */
  numberWithCommas: function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  /**
   * Build the search query
   */
  build_query: function build_query( q, sale_type ) {
      return '"query":{"bool":{"must":[{"match":{"_all":{"query": "'+q+'","operator": "and"}}},{"match": {"tax_input.sale_type": "'+sale_type+'"}}]}}';
  },

  __client: null,

  __request: null,

};

function make_base_auth(user, password) {
    var tok = user + ':' + password;
    var hash = btoa(tok);
    return "Basic " + hash;
}

/**
 * We treat everything that is 992px and smaller as "mobile" while everything above as "desktop".
 *
 */
(function(){

  /**
   * Debug Helper
   *
   */
  function debug() {
    var _args = [].slice.call(arguments);
    // _args.unshift( 'jquery-search-form' );
    console.debug.apply(console, _args);
  }

  jQuery( document ).ready( function rdcReady() {
    console.log( "RDC version 2.4.1" );

    /**
     * Validate popup forms.
     *
     */

    // jQuery.extend(jQuery.validator.messages, {
    //
    //   email:"Please enter a valid email address. Make sure there are no leading or trailing spaces."
    // });

    jQuery.validator.addClassRules({
      required:{
        required: true
      },
      email:{
        email: true
      },
      digits:{
        digits: true
      }
    });

    jQuery(".form-validate").each(function(){
      var form = jQuery(this);
      form.validate({
        errorPlacement: function(error, element) {
          error.insertBefore(element);
          //error.appendTo( element.parents("div.field:first").find("div.clear:first") );
        },

        invalidHandler: function(event, validator) {
          var errors = validator.numberOfInvalids();
          if (errors) {
            jQuery("input[type=submit]").removeAttr("disabled");
          }
        },
        messages: {
          name: "Please specify your name",
          email: {
            required: "We need your email address to contact you",
            email: "Your email address must be in the format of name@domain.com"
          }
        },
        onfocusout: false,
        onkeyup: false,
        onclick: false,
        debug: false
      });
    });

    jQuery(".form-validate").submit(function(e){
      if ( typeof grecaptcha == 'undefined' ) return true;
      if ( typeof recaptchaforms == 'undefined' ) return true;
      var _this = jQuery(this);
      var rresult;
      if( _this.find("#rdcgrecaptchacontactus").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "contactus", recaptchaforms ) );
      } else if( _this.find("#rdcgrecaptchahomebuy").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "homebuy", recaptchaforms ) );
      }  else if( _this.find("#rdcgrecaptchacareer").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "career", recaptchaforms ) );
      }  else if( _this.find("#rdcgrecaptchahomebuylisting").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "buylisting", recaptchaforms ) );
      }  else if( _this.find("#rdcgrecaptchahomemanagement").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "homemanagement", recaptchaforms ) );
      }  else if( _this.find("#rdcgrecaptchahomerenting").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "homerenting", recaptchaforms ) );
      }  else if( _this.find("#rdcgrecaptchahomeselling").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "homeselling", recaptchaforms ) );
      }  else if( _this.find("#rdcgrecaptchajobrequest").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "jobrequest", recaptchaforms ) );
      }  else if( _this.find("#rdcgrecaptchareferral").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "referral", recaptchaforms ) );
      }  else if( _this.find("#rdcgrecaptchareqapplication").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "reqapplication", recaptchaforms ) );
      } else if( _this.find("#rdcgrecaptchamanagementreferral").length ) {
        rresult = grecaptcha.getResponse( jQuery.inArray( "managementreferral", recaptchaforms ) );
      }

      if( !rresult.length > 0 ) {
        return false;
      }
      return true;
    });

    /**Validate popup forms.*/

    // Search Result / Map Pages - detect
    if( jQuery( 'body.is-taxonomy' ).length && getParameterByName( 'wpp_search[sale_type]' ) ) {
      // console.log( 'wpp_search[sale_type]', getParameterByName( 'wpp_search[sale_type]' ) );

      if( getParameterByName( 'wpp_search[sale_type]' ) === 'Rent' ) {
        jQuery( '#menu-header li' ).removeClass( 'current-menu-item' );
        jQuery( '.rentBtnForm' ).addClass( 'current-menu-item' );
      }

      if( getParameterByName( 'wpp_search[sale_type]' ) === 'Sale' ) {
        jQuery( '#menu-header li' ).removeClass( 'current-menu-item' );
        jQuery( '.buyBtnForm' ).addClass( 'current-menu-item' );
      }

    }

    // Invoke RDC Search Form, if tabs_search element exists.
    if ( 'undefined' !== typeof jQuery().rdc_search_form && jQuery('#tabs_search').length ) {
      jQuery('#tabs_search').rdc_search_form();
    }


    // add datepicker to all input elements with "rdc-datepicker" class
    if( 'function' === typeof jQuery.fn.datepicker && jQuery('input.rdc-datepicker' ).length ) {
      jQuery('input.rdc-datepicker' ).datepicker();
    }
    
    // Property Attribute Lists Filter
    if( jQuery('.attribute-content').length ) {

      jQuery('.attribute-content').isotope({
        itemSelector: '.col-md-6',
        transitionDuration: '0'
      });

      jQuery('.attribute-filter a.attribute-filter-single' ).on( 'click', function onClick() {

        jQuery('li.attribute-filter-single-wrapper').removeClass('active');
        jQuery(this).closest('li.attribute-filter-single-wrapper').addClass( 'active' );

        jQuery('.attribute-content').isotope({
          filter: jQuery(this).attr('data-filter')
        });

      });

    }

    // If we have a .totals_properties_rent class on page, fetch Rent count.
    if( rdc.client() && jQuery('.totals_properties_rent .value').length ) {
      rdc.getCount( 'Rent', function( error, count ) {
        jQuery('.totals_properties_rent .value').html(count);
      });
    }

    // If we have a .totals_properties_rent class on page, fetch Sale count.
    if( rdc.client() && jQuery('.totals_properties_sale .value').length ) {
      rdc.getCount( 'Sale', function( error, count ) {
        jQuery('.totals_properties_sale .value').html(count);
      });
    }

    jQuery( ".rdc-accordion" ).accordion( {
      active: false,
      collapsible: true,
      heightStyle: "content",
      animate: 300,
      activate: function( event, ui ) {
        if (!jQuery.isEmptyObject(ui.newHeader.offset())) {
          jQuery('html:not(:animated), body:not(:animated)').animate({scrollTop: ui.newHeader.offset().top}, 'slow');
        }
      }
    } );

    // if(jQuery( window ).width() < 992 ) {
    //   jQuery('.rdc-carousel-wrapper .descriptionBlock').width(jQuery(window).width() - 10);
    // }

    // Open Mobile Menu
    jQuery( '#header').find('.toggle' ).on( 'click', function () {

      // When opening the menu, set its height to be slightly above viewport
      jQuery( '.mobileMenu' ).css( 'height', ( jQuery( window ).height() + 30 ));

      jQuery( '.mobileMenu' ).animate( { 'left': '0' }, 300, function menuOpened() {

        // After meny is done opening, we remove scrolling from HTML element via our class.
        jQuery( 'html' ).addClass( 'rdc-mobile-menu-opened' );
      }).css( 'position', 'absolute' );

    } );

    // Close Mobile Menu
    jQuery( '.closeMobileMenu' ).on( 'click', function () {
      jQuery( '.mobileMenu' ).animate( { 'left': '-100%' }, 300 );
      // allow scrolling om DOM right away, no waiting for animation to complete.
      jQuery( 'html' ).removeClass( 'rdc-mobile-menu-opened' );
    } );

    /* Mobile slide sub-menu */
    jQuery( function () {
      jQuery( ".menuAdaptive" ).accordion({
        autoHeight: false,
        heightStyle: "content"
      });
    } );

    /* Footer social icons */
    jQuery( '.facebookFootIcon a' ).html( '<span class="icon-wpproperty-social-facebook-symbol"></span>' );
    jQuery( '.twitterFootIcon a' ).html( '<span class="icon-wpproperty-social-twitter-symbol"></span>' );
    jQuery( '.googleFootIcon a' ).html( '<span class="icon-wpproperty-social-googleplus-symbol"></span>' );
    jQuery( '.linkedFootIcon a' ).html( '<span class="icon-wpproperty-social-linkedin-symbol"></span>' );
    jQuery( '.instagramFootIcon a' ).html( '<span class="icon-wpproperty-social-instagram-symbol"></span>' );

    //jQuery( '.archive .ourCompanyBtn, .category .ourCompanyBtn, .single .ourCompanyBtn, .blog .ourCompanyBtn' ).addClass( 'current-menu-item' );

    if( jQuery( 'body.page' ).hasClass( 'home' ) ) {
      jQuery( '#menu-header li' ).removeClass( 'current-menu-item' );
      jQuery( '.home .buyBtnForm' ).addClass( 'current-menu-item' );
    }

    //jQuery( '.page .ourCompanyBtn.current_page_parent' ).addClass( 'current-menu-item' );

    var parentElement = jQuery('li.current-menu-item').closest('li.visibilityMenu');
    jQuery(parentElement).addClass('current-menu-item');

    if(jQuery('body[class*=listing_office]').length > 0){
      jQuery( '#menu-header li' ).removeClass('current-menu-item');
      jQuery('.buyBtnForm').addClass('current-menu-item')
    }

    jQuery( '.menuDesktop > .removeLink > a' ).removeAttr( 'href' );

    jQuery( '.formTabs' ).on( 'click', function () {
      var menuItem = jQuery( this ).data( 'topmenu' );
      jQuery( '.menuDesktop li' ).removeClass( 'current-menu-item' );
      jQuery( '.' + menuItem ).addClass( 'current-menu-item' );
    } );

    jQuery( '.menuDesktop > li' ).on( 'click', function () {
      jQuery( '.menuDesktop > li' ).removeClass( 'current-menu-item' );
      jQuery( jQuery( this ) ).addClass( 'current-menu-item' );
    } );

    jQuery( '.itemData > a' ).on( 'click', function ( event ) {
      var firsthref = jQuery(this).attr("href");
      var lasthref = firsthref.substr(1);
      var itemTopMenu = lasthref;

      event.preventDefault();

      jQuery( '[data-topmenu="' + itemTopMenu + '"] > a' ).click();
    } );

    jQuery( '.association-carousel .sow-carousel-wrapper' ).append( '<div class="assocCarouselBg"></div>' );

    if (jQuery(window).width() >= 1200) {
      rdc_property_sticky();
    }

    if (jQuery(window).width() < 992) {
      rdc_agent_carousel_item_width();
    }

    if (jQuery(window).width() <= 992) {
      /* Walk score map icons on mobile */
      jQuery('.single-property .iconNeighborhood').addClass('icon-wpproperty-attribute-neighborhood-solid').html('');
      jQuery('.single-property .iconCommute').addClass('icon-wpproperty-navigation-car-solid').html('');
      jQuery('.single-property .iconStreet').addClass('icon-wpproperty-navigation-streetview-solid').html('');
      jQuery('.single-property .iconSatellite').addClass('icon-wpproperty-navigation-satelliteview-solid').html('');

      /* Property Details icons on mobile */
      jQuery('.single-property .iconRooms').addClass('icon-wpproperty-attribute-bedroom-outline').html('');
      jQuery('.single-property .iconFeatures').addClass('icon-wpproperty-attribute-features-solid').html('');
      jQuery('.single-property .iconNeighborhoodDetail').addClass('icon-wpproperty-attribute-neighborhood-solid').html('');
      jQuery('.single-property .iconPropertyLot').addClass('icon-wpproperty-attribute-lot-solid').html('');
      
    }

    /**
     * Set correct height for Tabbet Widget blocks
     */

    function fitHeight(){
      jQuery.each( jQuery( '.so-widget-tabbed-content .sow-slider-image.cycle-slide-active' ), function ( index, element ){
        var contentBlockHeight = jQuery('.tabbedWidgetContent', element ).outerHeight();
        jQuery( element ).height(contentBlockHeight);
        jQuery( element ).parent().height(contentBlockHeight);
        jQuery( element ).css('overflow', 'visible');
      } );
    }

    jQuery('.so-widget-tabbed-content .sow-slider-pagination li').on('click', function (){
      setTimeout(function(){
        fitHeight();
      }, 500);
    })


    /**
     * Set row height for tabbed Widget Image Area
     */
    setTimeout(function(){

      jQuery.each( jQuery( '.so-widget-tabbed-content .tabbedWidgetImageArea:visible' ), function eachColumn( index, element ){
        jQuery( element ).height( jQuery( element ).closest( '.sow-slider-image-wrapper' ).height() );
      } );

      fitHeight();

      // var contentBlockHeight = jQuery('.so-widget-tabbed-content .tabbedWidgetContent').outerHeight();
      // jQuery('.so-widget-tabbed-content .sow-slider-images, .so-widget-tabbed-content .sow-slider-image').height(contentBlockHeight);
       //jQuery('.so-widget-tabbed-content .sow-slider-image').css('overflow', 'visible');

    }, 500);


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

    if(jQuery(window).width() <= 560) {
      jQuery('.rdc-carousel-wrapper ul.rdc-carousel-items li.rdc-carousel-item').width(jQuery(document).width() - 20);
      jQuery(document).on('rdc-carousel-ajax-complete', function(){
        jQuery('.rdc-carousel-wrapper ul.rdc-carousel-items li.rdc-carousel-item').width(jQuery(document).width());
      });
      if(jQuery('.rdc-carousel-item').hasClass('calloutcard')){
        jQuery('.calloutcard').addClass('carousel-item')
      }
    }

    jQuery('.oneAgent .showContactPopup a').on('click', function(){
      var agentphone = jQuery(this).data('agentphone');
      jQuery('.popupBuyHomeListing .hidden-phone').data('phone', agentphone);
      jQuery('.popupBuyHomeListing .hidden-phone').val('919-XXX-XXXX');
    });

    jQuery('.oneAgent .showContactPopup a[href="#popupNonRdcRentListing"]').on('click', function(){
      var agentphone = jQuery(this).data('nonrdcagentphone');
      var agentname = jQuery(this).data('nonrdcagentname');
      var agentoffice = jQuery(this).data('nonrdcagentoffice');
      jQuery('.popupNonRdcRentListing .nonrdcagentname').html(agentname);
      jQuery('.popupNonRdcRentListing .nonrdcagentoffice').html(agentoffice);
      jQuery('.popupNonRdcRentListing .nonrdcagentphone').val(agentphone);
    });

    // get buy count if buy element exists
    if( jQuery('#wpprc-home-buy').length ) {
      rdc.getCount( 'Sale', function( error, count ) {
        jQuery('#wpprc-home-buy').prepend(count + ' ');
      });
    }

    // get rent value of target element exists
    if( jQuery('#wpprc-home-rent').length ) {
      rdc.getCount( 'Rent', function ( error, count ) {
        jQuery( '#wpprc-home-rent' ).prepend( count + ' ' );
      } );
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

    jQuery('.sm-scrollable-table > div').on('scroll', function(e) {
      var that = this;
      jQuery('.sm-table-header th > div').each(function(key, element){
        jQuery(element).css('left', jQuery(element).data('left')-jQuery(that).scrollLeft());
      });
    });

    //console.log( rdc.client );


  } );

  function map_resize() {
    if ( jQuery( window ).width() < 992 ) {
      jQuery('.wpp-advanced-supermap, .sm-properties-list-wrap, ng-map').height('auto');
      jQuery('.sm-scrollable-table > div').height('100%');
      jQuery('.sm-properties-grid').height('100%');
    } else {
      var height = jQuery(window).height() - jQuery("#header").height() + 29;
      if (height < 400) {
        height = 400;
      }
      jQuery('.wpp-advanced-supermap, .sm-properties-list-wrap, ng-map').height(height);



        jQuery('.sm-scrollable-table > div').height(height - 303);

      jQuery('.sm-properties-grid').height(height - 103);
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
    //console.log( jQuery('.frontPageSearchBlock').height() );
  }

  function rdc_property_sticky() {
      jQuery("#propertyDetails").sticky({topSpacing: 0, bottomSpacing: 1000});
  }

  function rdc_agent_carousel_item_width(){
      jQuery('.rdc-agents-carousel-item').width(jQuery('.rdc-agents-carousel-wrapper').width());
  }

  jQuery( window ).load( function () {

    jQuery('.sm-table-header th > div').each(function(key, element){
      jQuery(element).data('left', jQuery(element).position().left);
    });

    rdc_agent_carousel_item_width();
    var resizeTimer;
    jQuery( window ).on( 'resize', function () {
      clearTimeout( resizeTimer );
      resizeTimer = setTimeout( function () {
        map_resize();
        frontPageSearchBlock_resize();
        if (jQuery(window).width() >= 1200) {
          rdc_property_sticky();
        }
        rdc_agent_carousel_item_width();
      }, 250 );
    } ).resize();
  } );

  jQuery(document).on('rdc_cols_changed', function(){
    jQuery('.sm-table-header th > div').each(function(key, element){
      jQuery(element).data('left', '');
      jQuery(element).css('left','auto');
    });

    jQuery('.sm-table-header th > div').each(function(key, element){
      jQuery(element).data('left', jQuery(element).position().left);
    });
  });

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
      // console.log( 'renderNeighborhoodMap:failed', 'No DOM element found', el );
    }

    var data = {};
    var options = jQuery( el).data( 'nmap-options' );

    if( options ) {
      parse_str( options, data );
      // console.log(data);
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


  /**
   * Convert URL Query to Object
   *
   * @param qstr
   * @returns {{}}
   */
  function parse_query_string(qstr) {
    qstr = qstr || window.location.search;
    var query = {};
    var a = qstr.substr(1).split('&');
    for (var i = 0; i < a.length; i++) {
      var b = a[i].split('=');
      query[decodeURIComponent(b[0])] = decodeURIComponent(b[1] || '');
    }

    return query;
  }

  /**
   * Get parameters by name from query string
   * @param name
   * @param url
   * @returns {*}
   */
  function getParameterByName(name) {

    // Try another method.. - potanin@UD
    var _parts = parse_query_string( window.location.search );

    if( _parts[ name ] ) {
      // debug( 'getParameterByName', name, _parts[ name ] );
      return _parts[ name ];
    }

    return null;


  }


})();

