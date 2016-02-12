<?php
/**
 * The template for displaying Archive pages
 *
 * Used to display archive-type pages if nothing more specific matches a query.
 * For example, puts together date-based pages if no date.php file exists.
 *
 * If you'd like to further customize these archive views, you may create a
 * new template file for each specific one. For example, Twenty Twelve already
 * has tag.php for Tag archives, category.php for Category archives, and
 * author.php for Author archives.
 *
 * @link http://codex.wordpress.org/Template_Hierarchy
 *
 * @package WordPress
 * @subpackage Twenty_Twelve
 * @since Twenty Twelve 1.0
 */

get_header(); ?>

	<div class="container-fluid archiveFilterBg">
		<div class="container">
			<div class="row">
			<section class="archiveFilterBody">
				<div>
					Filter by:
				</div>
				<!--
				<ul>
					<li>Home Buying</li>
					<li>Home Selling</li>
					<li>Home Renting</li>
					<li>Management</li>
				</ul>
				-->
			</section>
			</div>
		</div>
	</div>

<div class="container">
	<div class="row">
		<?php

		// Start the Loop.
		while ( have_posts() ) : the_post(); ?>

		<div class="col-lg-4">
			<div class="oneCategory">
				<?php
				$currentId = get_the_ID();
				$post_thumbnail_id = get_post_thumbnail_id( $currentId );
				$_url = wp_get_attachment_image_url($post_thumbnail_id, 'medium');
				?>

					<div class="oneCategoryImg">
						<img src="<?php echo $_url ?>" alt="<?php the_title(); ?>" />
					</div>
				<div class="catIconLoop">
					<img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/categoryIcon.png" alt="" />
				</div>
				<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
			</div>
		</div>

		<?php endwhile; ?>

	</div>
</div>


<?php get_footer(); ?>