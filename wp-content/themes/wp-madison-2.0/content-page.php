<?php
/**
 * Template for displaying page content.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>
<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
	<div class="entry-inner">
		<header class="entry-header">
			<h1 class="entry-title"><?php the_title(); ?></h1>
		</header>

		<div class="entry-content">
			<?php the_content(); ?>
			<?php
				wp_link_pages( array(
					'before' => '<div class="page-links">' . __( 'Pages:', 'madison' ),
					'after'  => '</div>',
				) );
			?>
		</div>
	</div>
</article>
