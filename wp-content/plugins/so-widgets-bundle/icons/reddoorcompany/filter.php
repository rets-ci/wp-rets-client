<?php

function siteorigin_widgets_icons_reddoorcompany_filter($icons) {
	return array_merge( $icons, array(
		'accurate-data' => '&#xe900;',
		'attention-communication' => '&#xe901;',
		'best-foot-forward' => '&#xe902;',
		'closing' => '&#xe903;',
		'complete-transparency' => '&#xe904;',
		'customer-commitment' => '&#xe905;',
		'emergency-response' => '&#xe906;',
		'expertise' => '&#xe907;',
		'full-service' => '&#xe908;',
		'high-exposure-marketing' => '&#xe909;',
		'home-buying' => '&#xe90a;',
		'home-renting' => '&#xe90b;',
		'home-selling' => '&#xe90c;',
		'honest-pricing' => '&#xe90d;',
		'innovative-technology' => '&#xe90e;',
		'inspections-contingencies' => '&#xe90f;',
		'leases-breaches' => '&#xe910;',
		'legal-compliance' => '&#xe911;',
		'marketing-showing' => '&#xe912;',
		'negotiation-closing' => '&#xe913;',
		'offer-negotation' => '&#xe914;',
		'professional-service' => '&#xe915;',
		'professionals' => '&#xe916;',
		'prompt-maintenance' => '&#xe917;',
		'property-management' => '&#xe918;',
		'proven' => '&#xe919;',
		'rent-deposits' => '&#xe91a;',
		'representing-you' => '&#xe91b;',
		'right-price-strategy' => '&#xe91c;',
		'right-way-to-rent' => '&#xe91d;',
		'screening-selection' => '&#xe91e;',
		'search-recommendations' => '&#xe91f;',
		'seasoned-modern' => '&#xe920;',
		'smart-search' => '&#xe921;',
		'strategy-commitment' => '&#xe922;',
		'tenant-portal' => '&#xe923;',
		'tours-insights' => '&#xe924;',
		'benefits' => '&#xe925;',
		'competitive' => '&#xe926;',
		'creative' => '&#xe927;',
		'empowering-excellence' => '&#xe928;',
		'honest' => '&#xe929;',
		'innovative-technology-2' => '&#xe92a;',
		'lead-management' => '&#xe92b;',
		'leadership' => '&#xe92c;',
		'marketing-materials' => '&#xe92d;',
		'our-mission' => '&#xe92e;',
		'profile' => '&#xe92f;',
		'reliable' => '&#xe930;',
		'supportive-environment' => '&#xe931;',
		'technology' => '&#xe927;',
		'top-commission' => '&#xe932;',
		'transparent' => '&#xe933;',
		'what-we-do' => '&#xe934;',
		'who-we-are' => '&#xe935;',

	));
}
add_filter('siteorigin_widgets_icons_reddoorcompany', 'siteorigin_widgets_icons_reddoorcompany_filter');