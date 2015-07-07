<?php
/**
 * The default page for property overview page.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>

<?php get_header(); ?>

<div class="section-container column-wrapper">
	<section id="site-primary" class="content-area column col-8-12">
		<main id="site-main" class="content-area-main" role="main">
			<?php echo WPP_Core::shortcode_property_overview(); ?>
		</main>
	</section>

	<?php get_sidebar(); ?>
</div>

<?php get_footer(); ?>