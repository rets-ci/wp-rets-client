<?php
/**
 * The template for displaying the footer.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/

$logo = esc_url( get_theme_mod( 'footer_logo' ) );
if( empty( $logo ) ) {
	$logo = get_stylesheet_directory_uri() . '/static/images/footer-logo.png';
}

?>
		</section>

		<section id="site-footer">
			<div class="section-container">
				<section class="footer-logo column col-3-12">
					<div class="logo-wrapper">
						<a href='<?php echo esc_url( home_url( '/' ) ); ?>' title='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>' rel='home'>
							<img src='<?php echo $logo; ?>' alt='<?php echo esc_attr( get_bloginfo( 'name', 'display' ) ); ?>'>
						</a>
					</div>
				</section>
				<section class="column-footer-info column col-3-12">
					<?php if ( $site_info = get_theme_mod( 'madison_footer_text') ) : ?>
						<h3><?php _e( 'At Red Door', 'rdc' ); ?></h3>
						<p><?php echo $site_info; ?></p>
					<?php endif; ?>
				</section>
				<nav class="column-footer-navigation column col-2-12" role="navigation">
					<?php if( has_nav_menu( 'footer' ) ) : ?>
						<h3><?php _e( 'Company', 'rdc' ); ?></h3>
						<?php wp_nav_menu( array( 'theme_location' => 'footer', 'menu' => 'madison-footer-menu', 'container' => false, 'fallback_cb' => null ) ); ?>
					<?php endif; ?>
				</nav>
				<section class="column-contact-info column col-4-12">
					<?php
					ob_start();
					madison_site_contact_information();
					$social = ob_get_clean();
					?>
					<?php if( !empty( $social ) ) : ?>
						<h3><?php _e( 'Connect with Us', 'rdc' ); ?></h3>
						<?php if ( $site_info = get_theme_mod( 'madison_footer_text') ) : ?>
							<p><?php echo $site_info; ?></p>
						<?php endif; ?>
						<?php echo $social; ?>
					<?php endif; ?>
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