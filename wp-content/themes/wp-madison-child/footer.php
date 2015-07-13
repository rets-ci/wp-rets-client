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

		<?php madison_site_contact_information(); ?>

		<?php get_sidebar( 'footer' ); ?>

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
		<?php wp_footer(); ?>
	</body>
</html>