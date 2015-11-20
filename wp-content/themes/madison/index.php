<?php
/**
 * The main template file.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>

<?php get_header(); ?>

<section id="site-primary" class="content-area column col-8-12">
	<main id="site-main" class="content-area-main" role="main">
		<?php if ( have_posts() ) : ?>
			<?php while ( have_posts() ) : the_post(); ?>
				<?php get_template_part( 'content', get_post_format() ); ?>
			<?php endwhile; ?>

			<?php madison_content_nav( 'nav-below' ); ?>

		<?php else : ?>
			<?php get_template_part( 'content', 'none' ); ?>
		<?php endif; ?>
	</main>
</section>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
