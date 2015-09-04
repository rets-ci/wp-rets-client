<?php
/**
 * The template for displaying the footer.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/

?>
		</section>

		<?php //madison_site_contact_information(); ?>

		<?php //get_sidebar( 'footer' ); ?>

		<section id="site-footer">
			<div class="section-container">
				<section class="footer-logo column col-3-12">
					<div class="logo-wrapper">

					</div>
				</section>
				<section class="column col-3-12">
					<?php if ( $site_info = get_theme_mod( 'madison_footer_text') ) : ?>
						<h3><?php _e( 'At Red Door', 'rdc' ); ?></h3>
						<?php echo $site_info; ?>
					<?php endif; ?>
				</section>
				<nav class="site-navigation column col-3-12" role="navigation">
					<h3><?php _e( 'Company', 'rdc' ); ?></h3>
					<?php wp_nav_menu( array( 'theme_location' => 'footer', 'menu' => 'madison-footer-menu', 'container' => false, 'fallback_cb' => null ) ); ?>
				</nav>
				<section class="rdc-contact-info column col-3-12">
					<h3><?php _e( 'Connect with Us', 'rdc' ); ?></h3>
					<?php madison_site_contact_information(); ?>
				</section>
				<div class="clear"></div>
			</div>
			<a href class="scroll-to-top"><i class="fa fa-chevron-up"></i></a>
		</section>

		<?php /*/ ?>
		<section id="site-footer">
			<footer class="site-info section-container" role="contentinfo">
				<?php if ( $site_info = get_theme_mod( 'madison_footer_text') ) : ?>
					<?php echo $site_info; ?>
				<?php else : ?>
          Copyright 2015 Red Door Company
				<?php endif; ?>
			</footer>
			<a href class="scroll-to-top"><i class="fa fa-chevron-up"></i></a>
		</section>
		<?php //*/ ?>

		<?php wp_footer(); ?>
	</body>
</html>