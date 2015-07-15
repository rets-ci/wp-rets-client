<?php
/**
 * The Header for Madison.
 *
 * Displays all of the <head> section and
 * everything up till <div id="content">
 *
 * @package Madison
 * @author Justin Kopepasah
 * @since 1.0.0
*/
?><!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" <?php language_attributes(); ?>>
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" <?php language_attributes(); ?>>
<![endif]-->
<!--[if !(IE 7) | !(IE 8) ]><!-->
<html <?php language_attributes(); ?>>
<!--<![endif]-->
	<head>
		<meta charset="<?php bloginfo( 'charset' ); ?>">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title><?php wp_title( '|', true, 'right' ); ?></title>
		<link rel="profile" href="http://gmpg.org/xfn/11">
		<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
		<!--[if lt IE 9]>
		<script src="<?php echo get_template_directory_uri(); ?>/js/html5.js"></script>
		<![endif]-->
		<?php wp_head(); ?>
	</head>

	<body <?php body_class( 'hfeed' ); ?>>
		<section id="site-header" class="section-header">
			<section class="section-header-navigation">
				<div class="section-container column-wrapper">
					<header class="site-branding column col-3-12" role="banner">
						<h1 class="site-title">
							<a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
								<span><?php bloginfo( 'name' ); ?></span>
							</a>
						</h1>
						<span class="site-tagline"><?php bloginfo( 'description' ); ?></span>
					</header>
					<nav class="site-navigation column col-9-12" role="navigation">
						<a href id="mobile-menu-toggle"><span><?php _e( 'Navigation', 'madison' ); ?></span><i class="fa fa-bars"></i></a>
						<?php wp_nav_menu( array( 'theme_location' => 'header', 'menu' => 'madison-header-menu', 'container' => false, 'fallback_cb' => null ) ); ?>
            <div class="secondary-menu"><?php wp_nav_menu( array( 'theme_location' => 'header-secondary', 'rdc-header-second-menu', 'container' => false ) ); ?></div>
          </nav>
				</div>
			</section>

			<?php if ( function_exists( 'madison_maybe_header_property_search' ) ) : ?>
				<?php echo madison_maybe_header_property_search(); ?>
			<?php endif; ?>

			<?php if ( function_exists( 'breadcrumb_trail' ) && ! is_page_template( 'page-templates/front-page.php' ) ) : ?>
				<section class="section-breadcrumbs">
					<div class="section-container">
						<?php
						$args = array(
							'show_on_front'   => false,    // whether to show on front
							'show_browse'     => false,    // whether to show the "browse" text
						);
						?>
						<?php breadcrumb_trail( $args ); ?>
					</div>
				</section>
			<?php endif; ?>
		</section>
		<section id="site-content" class="section-content column-wrapper clearfix">