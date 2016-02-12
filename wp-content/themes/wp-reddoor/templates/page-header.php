<?php

//die( '<pre>' . print_r( $post, true ) . '</pre>' );
$post_thumbnail_id = get_post_thumbnail_id( $post );

if(!($post_thumbnail_id)) {
	return;
}
$_url = wp_get_attachment_image_url($post_thumbnail_id, 'large');


