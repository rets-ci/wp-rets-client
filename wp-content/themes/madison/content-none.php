<?php
/**
 * Template for displaying no content, or rather,
 * a template for displaying content when no 
 * content is available.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>

<section class="no-results not-found">
	<div class="page-content hentry">
		<header class="entry-header page-header">
			<h1 class="entry-title page-title"><?php _e( 'Nothing Found', 'madison' ); ?></h1>
		</header>

		<?php if ( is_home() && current_user_can( 'publish_posts' ) ) : ?>

			<p><?php printf( __( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'madison' ), esc_url( admin_url( 'post-new.php' ) ) ); ?></p>

		<?php elseif ( is_search() ) : ?>

			<p><?php _e( 'Sorry, but nothing matched your search terms. Please try again with some different keywords.', 'madison' ); ?></p>
			<?php get_search_form(); ?>

		<?php else : ?>

			<p><?php _e( 'It seems we cannot find what you are looking for. Perhaps searching can help.', 'madison' ); ?></p>
			<?php get_search_form(); ?>

		<?php endif; ?>
	</div>
</section>
