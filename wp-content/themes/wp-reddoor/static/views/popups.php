	<div class="popupContactUsMore popup contact-popup" style="display: none;">
		<div class="popup-overlay"></div>
		<div class="popup-inner-wrapper">
			<span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
			<ul>
				<li class="pupBuy showContactPopup">
					<a href="#<?php echo is_singular('property') ? 'popupBuyHomeListing' : 'popupBuyHome'; ?>">
						<i class="icon-rdc-buy"></i><div><?php _e('I want to buy a home','reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupRent showContactPopup">
					<a href="#popupRentHome">
						<i class="icon-rdc-rent"></i><div><?php _e('I want to rent a home', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupSell showContactPopup">
					<a href="#popupSellHome">
						<i class="icon-rdc-home-selling"></i><div><?php _e('I want to sell my home', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupRentProp showContactPopup">
					<a href="#popupManage">
						<i class="icon-rdc-management"></i><div><?php _e('I want to rent my property', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupContact showContactPopup">
					<a href="#popupGeneralContact">
						<i class="icon-rdc-who-we-are"></i><div><?php _e('I have a different question', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
			</ul>
		</div>
	</div>

	<?php get_template_part('static/views/popups/login'); ?>
	<?php get_template_part('static/views/popups/contact-us'); ?>
	<?php get_template_part('static/views/popups/home-buying'); ?>
	<?php get_template_part('static/views/popups/home-buying-listing'); ?>
	<?php get_template_part('static/views/popups/home-renting'); ?>
	<?php get_template_part('static/views/popups/home-renting-listing'); ?>
	<?php get_template_part('static/views/popups/home-selling'); ?>
	<?php get_template_part('static/views/popups/home-management'); ?>
	<?php get_template_part('static/views/popups/request-application'); ?>
	<?php get_template_part('static/views/popups/non-rdc-renting-listing'); ?>
	<?php get_template_part('static/views/popups/career'); ?>
