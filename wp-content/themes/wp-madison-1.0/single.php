<?php
/**
 * The Template for displaying all single posts.
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

			<?php if ( in_array(  get_post_format(), array( 'quote', 'link', 'aside', 'status', 'video', 'audio' ) ) ) : ?>
				<?php get_template_part( 'content', get_post_format() ); ?>
			<?php else : ?>
				<?php get_template_part( 'content-single', get_post_format() ); ?>
			<?php endif; ?>

			<?php madison_content_nav( 'nav-below' ); ?>

			<?php
				// If comments are open or we have at least one comment, load up the comment template
				if ( comments_open() || '0' != get_comments_number() ) {
					comments_template();
				}
			?>

		<?php endwhile;?>

		</main>
	</section>

<?php get_sidebar(); ?>
<?php get_footer(); ?>