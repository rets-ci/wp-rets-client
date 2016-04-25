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
function wpp_ws_parse_str(s, o) {
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
 * Removes old one if it exists.
 *
 * @param el
 */
function wpp_ws_render_nmap( el ){
  if( jQuery( el ).length <= 0 ) {
    console.log( 'wpp_ws_render_nmap:failed', 'No DOM element found', el );
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

  //console.log( 'wpp_ws_render_nmap:options', data );

  jQuery.ajax({
    url: '/wp-admin/admin-ajax.php',
    data: data,
    success: function onSuccess( data, type ) {
      jQuery( '#property_walkscore_neighborhood').remove();
      jQuery(el).append( data );
    }
  });
}