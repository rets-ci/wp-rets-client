<?php
/**
 * Template for displaying audio content.
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
		<figure class="entry-video">
			<?php madison_post_format_audio_first_audio(); ?>
		</figure>
		<div class="entry-inner">
			<header class="entry-header">
				<h1 class="entry-title"><a href="<?php the_permalink(); ?>" rel="bookmark"><?php the_title(); ?></a></h1>
			</header>
			<div class="entry-content">
				<?php the_content( __( 'Continue Reading', 'madison' ) ); ?>
			</div>
		</div>
</article>
