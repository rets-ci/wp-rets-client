	<div class="popupContactUsMore popup contact-popup" style="display: none;">
		<div class="popup-overlay"></div>
		<div class="popup-inner-wrapper">
			<span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
			<ul>
				<li class="pupBuy showContactPopup">
					<a href="javascript:;" rel="<?php echo is_singular('property') ? 'popupBuyHomeListing' : 'popupBuyHome'; ?>">
						<i class="icon-rdc-home-buying"></i><div><?php _e('I want to buy a home','reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupRent showContactPopup">
					<a href="javascript:;" rel="<?php echo is_singular('property') ? 'popupRentHomeListing' : 'popupRentHome'; ?>">
						<i class="icon-rdc-home-renting"></i><div><?php _e('I want to rent a home', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupSell showContactPopup">
					<a href="javascript:;" rel="popupSellHome">
						<i class="icon-rdc-home-selling"></i><div><?php _e('I want to sell my home', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupRentProp showContactPopup">
					<a href="javascript:;" rel="popupManage">
						<i class="icon-rdc-property-management"></i><div><?php _e('I went to rent my property', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
			</ul>
		</div>
	</div>

	<?php get_template_part('static/views/popups/login'); ?>
	<?php get_template_part('static/views/popups/home-buying'); ?>
	<?php get_template_part('static/views/popups/home-buying-listing'); ?>
	<?php get_template_part('static/views/popups/home-renting'); ?>
	<?php get_template_part('static/views/popups/home-renting-listing'); ?>
	<?php get_template_part('static/views/popups/home-selling'); ?>
	<?php get_template_part('static/views/popups/home-management'); ?>
	<?php get_template_part('static/views/popups/request-application'); ?>
