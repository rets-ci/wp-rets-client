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
	$large = wp_get_attachment_image($attach_id, 'large');
	$full = wp_get_attachment_image_src( $attach_id, "full");
	$thumb = wp_get_attachment_image($attach_id);
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
        <div class="swiper-button-next"></div>
        <div class="swiper-button-prev"></div>
    </div>
    <div class="swiper-container gallery-thumbs">
        <div class="swiper-wrapper">
        <?php foreach ($imgs as $key => $img) {
        	echo "<div class='swiper-slide'>{$img['thumb']}</div>\n";
        }
        ?>
        </div>
    </div>
</div>
<!-- END Swiper -->
