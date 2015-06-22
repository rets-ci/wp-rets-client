<?php
/**
 * Template Name: No Container
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>

<?php get_header(); ?>

<section id="site-primary" class="content-area column col-8-12">
	<main id="site-main" class="content-area-main" role="main">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php get_template_part( 'content', 'page-no-wrapper' ); ?>

		<?php endwhile; // end of the loop. ?>

	</main>
</section>

<?php get_sidebar(); ?>
<?php get_footer(); ?>
