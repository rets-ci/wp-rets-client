<?php
/**
 * Template Name: Full Width
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>

<?php get_header(); ?>

	<section id="site-primary" class="content-area column col-12-12">
		<main id="site-main" class="content-area-main" role="main">

			<?php while ( have_posts() ) : the_post(); ?>

				<?php get_template_part( 'content', 'page' ); ?>

				<?php
					// If comments are open or we have at least one comment, load up the comment template
					if ( comments_open() || '0' != get_comments_number() ) {
						comments_template();
					}
				?>

			<?php endwhile; // end of the loop. ?>

		</main>
	</section>

<?php get_footer(); ?>
