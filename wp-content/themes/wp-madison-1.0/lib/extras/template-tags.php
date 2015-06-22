<?php
/**
 * Custom template tags for this theme.
 *
 * Eventually, some of the functionality here could be replaced by core features.
 *
 * @package Madison
*/

/**
 * Check the content blob for an <img>, <audio>, <video> <object>, <embed>, or <iframe>
 *
 * @since 1.0.0
 *
 * @param string $content A string which might contain media data.
 * @param array $types array of media types: 'img', 'audio', 'video', 'object', 'embed', or 'iframe'
 * @param string $sortby A string which defines how to sort the results.
 * @return array A list of found HTML media embeds
 *
 * NOTE This function only exists because the get_media_embedded_in_content() core function does not work properly.
 */
function madison_get_media_embedded_in_content( $content, $types = null ) {
	$html = array();

	$allowed_media_types = array( 'audio', 'video', 'object', 'embed', 'iframe', 'img' );
	if ( ! empty( $types ) ) {
		if ( ! is_array( $types ) ) {
			$types = array( $types );
		}
		$allowed_media_types = array_intersect( $allowed_media_types, $types );
	}

	$tags = implode( '|', $allowed_media_types );

	if ( preg_match_all( '#<(?P<tag>' . $tags . ')[^<]*?(?:>[\s\S]*?<\/(?P=tag)>|\s*\/>)#', $content, $matches ) ) {
		foreach ( $matches[0] as $match ) {
			$html[] = $match;
		}
	}

	return $html;
}

/**
 * Template tag for getting information regarding a
 * setting a backstretch image.
 *
 * @since 1.0.0
*/
function madison_backstretch_data( $post_id ) {
	if ( ! has_post_thumbnail( $post_id ) ) {
		return;
	}
	
	$image = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), 'content-single' );
	$data = 'data-backstretch="' . $image[0] . '"';
	
	echo $data;
}

/**
 * Display navigation to next/previous pages when applicable.
*/
function madison_content_nav( $nav_id ) {
	global $wp_query, $post, $paged;


	if ( ( is_home() || is_archive() ) && class_exists( 'Jetpack' ) && Jetpack::is_module_active( 'infinite-scroll' ) ) {
		return;
	}

	// Don't print empty markup on single pages if there's nowhere to navigate.
	if ( is_single() ) {
		$previous = ( is_attachment() ) ? get_post( $post->post_parent ) : get_adjacent_post( false, '', true );
		$next = get_adjacent_post( false, '', false );

		if ( ! $next && ! $previous )
			return;
	}

	// Don't print empty markup in archives if there's only one page.
	if ( $wp_query->max_num_pages < 2 && ( is_home() || is_archive() || is_search() ) )
		return;

	$nav_class = ( is_single() ) ? 'post-navigation' : 'paging-navigation';

	?>
	<nav role="navigation" id="<?php echo esc_attr( $nav_id ); ?>" class="content-navigation <?php echo $nav_class; ?>">
		<h1 class="screen-reader-text"><?php _e( 'Post navigation', 'madison' ); ?></h1>

		<?php if ( is_single() ) : // navigation links for single posts ?>

			<?php previous_post_link( '<div class="nav-section nav-previous">%link</div>', '<span class="meta-nav fa fa-chevron-left"></span>' ); ?>
			<?php next_post_link( '<div class="nav-section nav-next">%link</div>', '<span class="meta-nav fa fa-chevron-right"></span>' ); ?>

		<?php elseif ( $wp_query->max_num_pages > 1 && ( is_home() || is_archive() || is_search() ) ) : // navigation links for home, archive, and search pages ?>

			<?php if ( get_next_posts_link() ) : ?>
				<div class="nav-section nav-previous">
					<?php next_posts_link( __( '<span class="meta-nav fa fa-chevron-left"></span>' ) ); ?>
				</div>
			<?php endif; ?>

			<?php if ( get_previous_posts_link() ) : ?>
				<div class="nav-section nav-next">
					<?php previous_posts_link( __( '<span class="meta-nav fa fa-chevron-right"></span>' ) ); ?>
				</div>
			<?php endif; ?>

			<?php if ( $paged ) : ?>
				<div class="nav-section nav-paged">
					<span class="meta-nav meta-nav-paged"><?php echo sprintf( __( '%d of %d' ), $paged, $wp_query->max_num_pages ); ?></span>
				</div>
			<?php endif; ?>

		<?php endif; ?>

	</nav>
	<?php
}

/**
 * Return a time difference of a given time in
 * days, hours or minutes depending on the time
 * difference.
 *
 * @since 1.0.0
 *
 * @param $time (required)
*/
function madison_get_time_difference( $time ) {
	$current_time = new DateTime( current_time( 'mysql' ) );
	$previous_time = new DateTime( $time );
	$difference = $current_time->diff( $previous_time );
	$timestamp = '';

	if ( 0 < $difference->days ) {
		$timestamp .= sprintf( translate_nooped_plural( _n_noop( '%s day', '%s days' ), $difference->days ), $difference->days ) . ' ago.';
	} else {
		if ( 0 == $difference->i && 0 == $difference->h ) {
			$timestamp = __( 'Less than a minute ago.', 'madison' );
		} else {
			if ( 0 < $difference->h ) {
				$timestamp .= sprintf( translate_nooped_plural( _n_noop( '%s hour ago', '%s hours ago', 'madison' ), $difference->h, 'madison' ), $difference->h );
			} else {
				$timestamp .= sprintf( translate_nooped_plural( _n_noop( '%s minute ago', '%s minutes ago', 'madison' ), $difference->i, 'madison' ), $difference->i );
			}
		}
	}

	return $timestamp;
}

/**
 * Template for comments and pingbacks.
 *
 * Used as a callback by wp_list_comments() for displaying the comments.
 *
 * @since 1.0.0
*/
function madison_comment( $comment, $args, $depth ) {
	$GLOBALS['comment'] = $comment;

	$timestamp = madison_get_time_difference( $comment->comment_date );

	if ( 'pingback' == $comment->comment_type || 'trackback' == $comment->comment_type ) : ?>

		<li id="comment-<?php comment_ID(); ?>" <?php comment_class(); ?>>
			<div class="comment-body">
				<?php _e( 'Pingback:', 'madison' ); ?> <?php comment_author_link(); ?> <?php edit_comment_link( __( 'Edit', 'madison' ), '<span class="edit-link">', '</span>' ); ?>
			</div>

	<?php else : ?>

		<li id="comment-<?php comment_ID(); ?>" <?php comment_class( empty( $args['has_children'] ) ? '' : 'parent' ); ?>>
			<div id="column-wrapper-<?php comment_ID() ?>" class="column-wrapper">
				<div class="column  column-avatar">
					<div class="vcard column-inner">
						<?php if ( $args['avatar_size'] != 0 ) echo get_avatar( $comment, $args['avatar_size'] ); ?>
					</div>
				</div>
				<div class="column column-comment">
					<div class="comment-wrap column-inner">
						<div class="comment-top">
							<span class="comment-author">
								<?php printf( __( '%s'), get_comment_author_link() ) ?>
							</span>
							<span class="comment-meta comment-timestamp">
								 &middot; <?php echo $timestamp; ?>
							</span>
						</div>
						<div class="comment-body">
							<?php if ( $comment->comment_approved == '0' ) : ?>
								<div class="comment-awaiting-moderation">
									<p class="notice"><?php _e( 'Your comment is awaiting moderation.' ) ?></p>
								</div>
							<?php endif; ?>
							<?php comment_text(); ?>
						</div>
						<div class="reply">
							<?php comment_reply_link( array_merge( $args, array( 'add_below' => 'column-wrapper', 'depth' => $depth, 'max_depth' => $args['max_depth'] ) ) ); ?>
						</div>
					</div>
				</div>
			</div>
	<?php endif; ?>
<?php
}

/**
 * Contact information called in the footer.
 *
 * @since 1.0.0
*/
function madison_site_contact_information() {
	$mods = array(
		'social' => array(
			'twitter'     => get_theme_mod( 'madison_footer_twitter' ),
			'facebook'    => get_theme_mod( 'madison_footer_facebook' ),
			'google_plus' => get_theme_mod( 'madison_footer_google' ),
			'linkedin'    => get_theme_mod( 'madison_footer_linkedin' ),
			'pinterest'   => get_theme_mod( 'madison_footer_pinterest' ),
			'instagram'   => get_theme_mod( 'madison_footer_instagram' ),
			'youtube'     => get_theme_mod( 'madison_footer_youtube' ),
		),
		'email'  => get_theme_mod( 'madison_footer_email' ),
		'phone'  => get_theme_mod( 'madison_footer_phone' ),
	);

	$show = false;
	$show_social = false;

	// Let's see if any of the mods are set.
	foreach ( $mods as $mod ) {
		if ( is_array( $mod ) ) {
			foreach ( $mod as $item ) {
				if ( ! empty( $item ) ) {
					$show = true;
					$show_social = true;
					break;
				}
			}
		} else if ( ! empty( $mod ) ) {
			$show = true;
			break;
		}
	}

	// If all the items are empty, bail.
	if ( $show != true ) {
		return;
	}
?>
	<section id="site-contact-information">
		<div class="section-container column-wrapper">
			<?php if ( ! empty( $mods['email'] ) || ! empty( $mods['phone'] ) ) : ?>
				<div class="site-contact-info column col-5-12">
					<?php if ( ! empty( $mods['email'] ) ) : ?>
						<a href="mailto:<?php echo $mods['email']; ?>" class="site-email" title="<?php _e( 'Send Email', 'madison' ) ?>">
							<i class="fa fa-envelope"></i>
							<span><?php echo $mods['email']; ?></span>
						</a>
					<?php endif; ?>

					<?php if ( ! empty( $mods['phone'] ) ) : ?>
						<a href="tel:<?php echo $mods['phone']; ?>" class="site-number" title="<?php _e( 'Call', 'madison' ) ?>">
							<i class="fa fa-phone-square"></i>
							<span><?php echo $mods['phone']; ?></span>
						</a>
					<?php endif; ?>
				</div>
			<?php endif; ?>

			<?php if ( $show_social === true ) : ?>
				<div class="site-social-info right column col-7-12">
					<?php foreach ( $mods['social'] as $network => $url ) : ?>
						<?php if ( ! empty( $url ) ) : ?>
							<a href="<?php esc_url( $url ); ?>" class="site-social-<?php echo str_replace( '_', '-', $network ); ?>"><i class="fa fa-<?php echo str_replace( '_', '-', $network ) ?>"></i></a>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
	</section>
<?php
}