<?php
/**
 * The Footer Sidebar
 *
 * @package Madison
 * @since 1.0.0
 */

if ( ! is_active_sidebar( 'footer-1' ) ) {
	return;
}
?>

<section id="site-supplementary">
	<div class="footer-sidebar section-container widget-area column-wrapper" role="complementary">
		<?php dynamic_sidebar( 'footer-1' ); ?>
	</div>
</section>
