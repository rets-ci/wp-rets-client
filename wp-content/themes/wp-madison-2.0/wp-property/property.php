<?php
/**
 * Property Template for Single Property View for Madison
 *
 * @package Madison
 * @since 1.0.0
 * @author Justin Kopepasah
*/

?>

<?php get_header(); ?>

<?php the_post(); ?>

<?php get_template_part( 'wp-property/property-map' ); ?>

<div class="section-container column-wrapper">
	<section id="site-primary" class="content-area column col-8-12">
		<main id="site-main" class="content-area-main" role="main">
			<?php get_template_part( 'wp-property/property-content' ); ?>
			<?php
				// If comments are open or we have at least one comment, load up the comment template
				if ( comments_open() || '0' != get_comments_number() ) {
					comments_template();
				}
			?>
		</main>
	</section>

	<?php if ( is_active_sidebar( 'wpp_sidebar_' . $post->property_type ) ) : ?>
		<section id="site-secondary" class="widget-area content-area-sidebar sidebar column col-4-12" role="complementary">
			<?php dynamic_sidebar( 'wpp_sidebar_' . $post->property_type ); ?>
		</section>
	<?php else : ?>
		<?php get_sidebar(); ?>
	<?php endif; ?>
</div>

<?php get_footer(); ?>