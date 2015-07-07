<?php
/**
 * Template Name: Home
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?>

<?php get_header(); ?>

<?php if ( class_exists( 'class_wpp_supermap') ) : ?>
	<div id="properties-map" class="clearfix">
		<?php
		$atts = array(
			'map_height' => '500',
			'pagination' => 'off',
			'hide_sidebar' => 'true'
		);
		?>

		<?php echo class_wpp_supermap::shortcode_supermap( $atts ) ?>
	</div>
<?php else : ?>
	<section id="property-featured" class="property-overview-full-width column-wrapper">
		<?php
			$atts = array(
				'sort_by'          => 'menu_order',
				'sort_order'       => 'ASC',
				'featured'         => 'true',
				'template'         => 'full-width',
				'sorter_type'      => 'none',
				'per_page'         => 1,
				'starting_row'     => 0,
				'disable_wrapper'  => true,
				'pagination'       => 'off',
				'hide_count'       => true,
			);
		?>

		<?php echo WPP_Core::shortcode_property_overview( $atts ); ?>
	</section>
<?php endif; ?>

<div id="property-catchline" data-default="<?php bloginfo( 'description' ); ?>">
	<div class="property-catchline-inner">
		<?php if ( get_theme_mod( 'madison_front_page_message' ) ) : ?>
			<h3><?php echo get_theme_mod( 'madison_front_page_message' ); ?></h3>
		<?php else : ?>
			<h3><?php bloginfo( 'description' ); ?></h3>
		<?php endif; ?>
	</div>
</div>

<div class="section-container site-content clearfix">
	<section id="site-primary" class="content-area column col-8-12">
		<main id="site-main" class="content-area-main" role="main">
			<?php if ( have_posts() ) : ?>
				<?php while ( have_posts() ) : the_post(); ?>
					<?php the_content(); ?>
				<?php endwhile; ?>
			<?php endif; ?>
		</main>
	</section>

	<?php get_sidebar(); ?>
</div>

<?php get_footer(); ?>