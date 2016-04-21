	<div class="popupContactUsMore popup" style="display: none;">
		<div class="popup-overlay"></div>
		<div class="popup-inner-wrapper">
			<span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
			<ul>
				<li class="pupBuy showContactPopup">
					<a href="javascript:;" rel="<?php echo is_singular('property') ? 'popupBuyHomeListing' : 'popupBuyHome'; ?>">
						<img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/buyHome.png" alt="" /><div>I want to buy a home</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupRent showContactPopup">
					<a href="javascript:;" rel="<?php echo is_singular('property') ? 'popupRentHomeListing' : 'popupRentHome'; ?>">
						<img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/rentHome.png" alt="" /><div>I want to rent a home</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupSell showContactPopup">
					<a href="javascript:;" rel="popupSellHome">
						<img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/sellHome.png" alt="" /><div>I want to sell my home</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
					</a>
				</li>
				<li class="pupRentProp showContactPopup">
					<a href="javascript:;" rel="popupManage">
						<img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/rentMyProp.png" alt="" /><div>I went to rent my property</div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
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
