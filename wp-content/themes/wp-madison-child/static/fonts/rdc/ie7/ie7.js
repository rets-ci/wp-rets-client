/* To avoid CSS expressions while still supporting IE 7 and IE 6, use this script */
/* The script tag referencing this file must be placed before the ending body tag. */

/* Use conditional comments in order to target IE 7 and older:
	<!--[if lt IE 8]><!-->
	<script src="ie7/ie7.js"></script>
	<!--<![endif]-->
*/

(function() {
	function addIcon(el, entity) {
		var html = el.innerHTML;
		el.innerHTML = '<span style="font-family: \'rdc\'">' + entity + '</span>' + html;
	}
	var icons = {
		'icon-honest-pricing': '&#xe60a;',
		'icon-full-service': '&#xe60b;',
		'icon-star': '&#xe600;',
		'icon-service-request': '&#xe601;',
		'icon-payrent-online': '&#xe602;',
		'icon-online-portal': '&#xe603;',
		'icon-area': '&#xe604;',
		'icon-price': '&#xe605;',
		'icon-bed-a': '&#xe606;',
		'icon-shower': '&#xe607;',
		'icon-bath': '&#xe608;',
		'icon-location': '&#xe609;',
		'0': 0
		},
		els = document.getElementsByTagName('*'),
		i, c, el;
	for (i = 0; ; i += 1) {
		el = els[i];
		if(!el) {
			break;
		}
		c = el.className;
		c = c.match(/icon-[^\s'"]+/);
		if (c && icons[c[0]]) {
			addIcon(el, icons[c[0]]);
		}
	}
}());
