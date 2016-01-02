<?php
if(empty($property_id)){
	global $post;
	$property_id = $post->ID;
}
$title = get_the_title($property_id);
$images = UsabilityDynamics\WPP\Property_Factory::get_images($property_id);
$imgs = array();
//print_r($images);
foreach ($images as $img) {
	$attach_id = $img['attachment_id'];
	$full = wp_get_attachment_image_src( $attach_id, "full");
    if(!wp_is_mobile()){
        $large = wp_get_attachment_image($attach_id, 'large');
        $thumb = wp_get_attachment_image($attach_id);
    }
    else{
        $large_src = wp_get_attachment_image_src($attach_id, 'large');
        $large = "<img data-src='{$large_src[0]}' class='swiper-lazy' width='{$large_src[1]}' height='{$large_src[2]}' /><div class='swiper-lazy-preloader'></div>";
        $thumb = '';
    }
	$imgs[$attach_id] = array(
								'full' => $full[0],
								'large' => $large,
								'thumb' => $thumb
							);
}
global $property_resp_slideshow_counter;
$property_resp_slideshow_counter++;
?>
<!-- Swiper -->
<div id="<?php echo $property_resp_slideshow_counter?>" class="property-resp-slideshow">
    <div class="swiper-container gallery-top ratio-16-9">
        <div class="swiper-wrapper clearfix">
        <?php foreach ($imgs as $key => $img) {
        	echo "<div class='swiper-slide' data-href='{$img['full']}' data-lightbox='property-responsive-slideshow' data-title='$title'>{$img['large']}</div>\n";
        }
        ?>
        </div>
        <!-- Add Arrows  swiper-button-white-->
        <div class="swiper-button-next swiper-button-black"></div>
        <div class="swiper-button-prev swiper-button-black"></div>
        <span class="count-progress">
            <span class="current">1</span> / 
            <span class="total"><?php echo count($imgs);?></span>
        </span> 
    </div>
    <?php if(!wp_is_mobile()):?>
    <div class="swiper-container gallery-thumbs">
        <div class="swiper-wrapper">
        <?php foreach ($imgs as $key => $img) {
        	echo "<div class='swiper-slide'>{$img['thumb']}</div>\n";
        }
        ?>
        </div>
    </div>
    <?php endif;?>
</div>
<!-- END Swiper -->
