<?php
/**
 * The Sidebar containing the main widget areas.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/

// Return if there is no active sidebar.
if ( ! is_active_sidebar( 'sidebar-1' ) ) {
	return;
}
?>

	<section id="site-secondary" class="widget-area content-area-sidebar sidebar column col-4-12" role="complementary">
		<?php dynamic_sidebar( 'sidebar-1' ) ?>
	</section>
