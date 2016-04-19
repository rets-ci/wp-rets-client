<?php

//die( '<pre>' . print_r( $post, true ) . '</pre>' );
if( is_home() ) {
	$currentId = get_option( 'page_for_posts' );
}else{
	$currentId = get_the_ID();
}
$post_thumbnail_id = get_post_thumbnail_id( $currentId );

if(!($post_thumbnail_id)) {
	return;
}
$_url = wp_get_attachment_image_url($post_thumbnail_id, 'large');

?>
<?php if(!(empty($_url))) { ?>


<div class="container-fluid ftrdImgGoTop">
	<section class="featuredImageHeader" style="background: url('<?php echo $_url; ?>');">
		<?php $category = get_the_category(); ?>
		<div class="singleHeroIcon">
			<svg class="icon icon-<?php if($category[0]->slug){echo $category[0]->slug;} ?>"><use xlink:href="#icon-<?php if($category[0]->slug){echo $category[0]->slug;} ?>"></use></svg>
		</div>
	</section>
</div>
<?php } ?>

