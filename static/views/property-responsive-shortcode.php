<?php
global $property_resp_slideshow_counter;
if(empty($property_id)){
	global $post;
	$property_id = $post->ID;
}
$title = get_the_title($property_id);
$images = UsabilityDynamics\WPP\Property_Factory::get_images($property_id);
$imgs = array();
$property_resp_slideshow_counter++;
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
								'full' => $full,
								'large' => $large,
								'thumb' => $thumb
							);
}
?>
<?php if(count($imgs)>0):?>
<!-- Swiper -->
<div id="wpprs-<?php echo $property_resp_slideshow_counter?>" class="property-resp-slideshow slider-type-<?php echo $slider_type;?>" data-slider-type="<?php echo $slider_type;?>">
    <div class="modal-header">
      <div class="pull-left">
          <span><?php echo $title;?></span>
      </div>
      <div class="pull-right">
        <a class="viewOriginal" class="button" aria-label="Close" href="javascript:void(0);" target="_blank">
          View Original <i class="dashicons dashicons-external"></i>
        </a>
        <a class="close" aria-label="Close"><i class="dashicons dashicons-no"></i></a>
      </div>
      <div class="clearfix"></div>
    </div>
    <div class="swiper-container gallery-top ratio-16-9">
        <div class="swiper-wrapper">
        <?php foreach ($imgs as $key => $img) {
        	echo "<div class='swiper-slide' data-src='{$img['full'][0]}' data-width='{$img['full'][1]}' data-height='{$img['full'][2]}' data-title='$title'>{$img['large']}</div>";
        }
        ?>
        </div>
        <!-- Add Arrows  swiper-button-white-->
        <div class="swiper-button-prev"><i class="dashicons dashicons-arrow-left-alt2"></i></div>
        <div class="swiper-button-next"><i class="dashicons dashicons-arrow-right-alt2"></i></div>
        <span class="count-progress">
            <span class="current">1</span> / 
            <span class="total"><?php echo count($imgs);?></span>
        </span> 
    </div>
    <?php if(!wp_is_mobile()):?>
    <div class="swiper-container gallery-thumbs">
        <div class="swiper-wrapper">
        <?php foreach ($imgs as $key => $img) {
        	echo "<div class='swiper-slide'>{$img['thumb']}</div>";
        }
        ?>
        </div>
    </div>
    <?php endif;?>
</div>
<!-- END Swiper -->
<?php endif;?>