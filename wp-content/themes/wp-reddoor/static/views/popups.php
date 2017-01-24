<div class="popupFormOptions popup contact-popup" style="display: none;">
	<div class="popup-overlay"></div>
	<div class="popup-inner-wrapper">
		<span class="exitPopup"><svg class="icon icon-cross"><use xlink:href="#icon-cross"></use></svg></span>
		<ul>
			<li class="pupTest showContactPopup">
				<a href="#popupTestContact">
					<i class="icon-rdc-buy"></i><div><?php _e('Test Contact','reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
				</a>
			</li>
			<li class="pupBuy showContactPopup">
				<a href="#<?php echo is_singular('property') ? 'popupFormBuyInquiryListing' : 'popupFormBuyInquiry'; ?>">
					<i class="icon-rdc-buy"></i><div><?php _e('I want to buy a home','reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
				</a>
			</li>
			<li class="pupRent showContactPopup">
				<a href="#popupFormRentInquiry">
					<i class="icon-rdc-rent"></i><div><?php _e('I want to rent a home', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
				</a>
			</li>
			<li class="pupSell showContactPopup">
				<a href="#popupFormSellInquiry">
					<i class="icon-rdc-home-selling"></i><div><?php _e('I want to sell my home', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
				</a>
			</li>
			<li class="pupRentProp showContactPopup">
				<a href="#popupFormManagementInquiry">
					<i class="icon-rdc-management"></i><div><?php _e('I want to rent my property', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
				</a>
			</li>
			<li class="pupContact showContactPopup">
				<a href="#popupFormContactInquiry">
					<i class="icon-rdc-who-we-are"></i><div><?php _e('I have a different question', 'reddoor'); ?></div><svg class="icon icon-circle-right"><use xlink:href="#icon-circle-right"></use></svg>
				</a>
			</li>
		</ul>
	</div>
</div>

<?php get_template_part('static/views/popups/form-test-contact'); ?>

<?php get_template_part('static/views/popups/form-buy-inquiry'); ?>
<?php get_template_part('static/views/popups/form-buy-inquiry-listing'); ?>

<?php get_template_part('static/views/popups/form-rent-inquiry'); ?>
<?php get_template_part('static/views/popups/form-rent-application'); ?>
<?php get_template_part('static/views/popups/notice-rent-pass'); ?>

<?php get_template_part('static/views/popups/form-sell-inquiry'); ?>

<?php get_template_part('static/views/popups/form-management-inquiry'); ?>
<?php get_template_part('static/views/popups/form-management-referral'); ?>

<?php get_template_part('static/views/popups/form-contact-inquiry'); ?>

<?php get_template_part('static/views/popups/form-career-inquiry'); ?>	

<?php get_template_part('static/views/popups/ux-login'); ?>