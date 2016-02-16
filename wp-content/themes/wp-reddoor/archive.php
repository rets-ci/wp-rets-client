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

<?php if(is_category() || is_archive()){ ?>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			jQuery('.featuredImageHeader').css('height', jQuery(window).height()-212);
		});
	</script>

	<div class="container-fluid ftrdImgGoTop">
		<section class="archiveImageHeader">
			<h1><?php single_cat_title(); ?></h1>
			<h3><?php echo category_description( $category_id ); ?></h3>
		</section>
	</div>
<?php } ?>

<?php get_template_part('templates/blog-content') ?>


<?php get_footer(); ?>