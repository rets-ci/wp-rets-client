<?php
/**
 * Various filters to modify the way things work.
 *
 * @package Madison
 * @author Justin Kopepasah
*/

/**
 * For video post formats we need to get the
 * first video embedded in the content.
 *
 * @since 1.0.0
*/
function madison_post_format_video_get_first_video() {
	if ( get_post_format( get_the_ID() ) !== 'video' ) {
		return;
	}

	$output = '';
	$embeds = madison_get_media_embedded_in_content( apply_filters( 'the_content', get_the_content( get_the_ID() ) ) );

	if ( $embeds ) {
		$output = $embeds[0];
	} else {
		return;
	}

	return $output;
}

/**
 * For video post formats we need to echo the
 * first video embedded in the content.
 *
 * @since 1.0.0
*/
function madison_post_format_video_first_video() {
	if ( get_post_format( get_the_ID() ) !== 'video' ) {
		return;
	}

	echo madison_post_format_video_get_first_video();

	add_filter( 'the_content', 'madison_post_format_video_filter_the_content' );
}

/**
 * For video post formats we need to remove the
 * first video embedded in the content after we
 * place it in the template.
 *
 * @since 1.0.0
 * @var content
*/
function madison_post_format_video_filter_the_content( $content ) {
	if ( get_post_format( get_the_ID() ) !== 'video' ) {
		return $content;
	}

	$embeds = madison_get_media_embedded_in_content( do_shortcode( $content ) );

	if ( $embeds ) {
		$embed = $embeds[0];
	} else {
		return $content;
	}

	$content = str_replace( $embed, '', $content );

	return $content;
}

/**
 * For audio post formats we need to get the
 * first audio embedded in the content.
 *
 * @since 1.0.0
*/
function madison_post_format_audio_get_first_audio() {
	if ( get_post_format( get_the_ID() ) !== 'audio' ) {
		return;
	}

	$content = apply_filters( 'the_content', get_the_content( get_the_ID() ) );

	$embeds = madison_get_media_embedded_in_content( $content );

	// koop_toolkit_print( $embeds );

	if ( ! $embeds ) {
		return;
	} else {
		$output = $embeds[0];
	}

	return $output;
}

/**
 * For audio post formats we need to echo the
 * first video embedded in the content.
 *
 * @since 1.0.0
*/
function madison_post_format_audio_first_audio() {
	if ( get_post_format( get_the_ID() ) !== 'audio' ) {
		return;
	}

	echo madison_post_format_audio_get_first_audio();

	add_filter( 'the_content', 'madison_post_format_audio_filter_the_content' );
}

/**
 * For audio post formats we need to remove the
 * first audio embedded in the content after we
 * place it in the template.
 *
 * @since 1.0.0
 * @var content
*/
function madison_post_format_audio_filter_the_content( $content ) {
	if ( get_post_format( get_the_ID() ) !== 'audio' ) {
		return $content;
	}

	$replace = '';
	$filtered_content = do_shortcode( $content );

	$embeds = get_media_embedded_in_content( $filtered_content, null, 'source' );

	if ( $embeds ) {
		$replace = $embeds[0];
	}

	if ( $replace == '' ) {
		return $content;
	}

	$content = str_replace( $replace, '', $filtered_content );

	return $content;
}

/**
 * Filter the gallery image sizes on the index
 * and archive pages for work more fluidly with
 * slides.
 *
 * @since 1.0.0
 * @var $out, $pairs, $atts
*/
function madison_post_format_gallery_filter_image_size( $out, $pairs, $atts ) {
	if ( ( is_home() || is_archive() ) && get_post_format( get_the_ID() ) == 'gallery' ) {
		$atts = shortcode_atts( array(
			'size' => 'content-gallery',
		), $atts );

		$out['size'] = $atts['size'];
	}

	return $out;
}
add_filter( 'shortcode_atts_gallery', 'madison_post_format_gallery_filter_image_size', 10, 3 );