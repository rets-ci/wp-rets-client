<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

//vars
$tag_prefix     = @$vars['tag_prefix'];
$instance       = @$vars['instance'];
$defaultImg     = @$vars['defaultImg'];
?>

<div id="<?php echo $tag_prefix;?>_admin">
    <div class="<?php echo $tag_prefix;?>_block" style="background: #FFF;">
        <div class="<?php echo $tag_prefix;?>_block_line">
            <label for="<?php echo $this->get_field_id('title');?>"><?php echo $this->trans('title');?>:</label>
            <input style="width: 100%" id="<?php echo $this->get_field_id('title');?>" name="<?php echo $this->get_field_name('title');?>" value="<?php echo esc_attr(@$instance['title']);?>"/>
        </div>
        <div class="<?php echo $tag_prefix;?>_block_line">
            <label for="<?php echo $this->get_field_id('count_lines');?>"><?php echo $this->trans('count_lines');?></label>
            <input type="number" min="1" max="20" id="<?php echo $this->get_field_id('count_lines');?>" name="<?php echo $this->get_field_name('count_lines');?>" value="<?php echo (empty($instance['count_lines']) ? 1 : $instance['count_lines']);?>" />
        </div>
    </div>
<?php
for($i = 0; $i < $instance['count_lines']; $i++){
    $title_id    = 'title_'.$i;
    $title_name  = 'lines_title_'.$i;
    $title_value      = @$instance[$title_name];

    $rate_id    = 'rate_'.$i;
    $rate_name  = 'lines_rate_'.$i;
    $rate_value = @(int)$instance[$rate_name];

    $dimage_id      = 'dimage_'.$i;
    $dimage_name    = 'lines_dimage_'.$i;
    $dimage_value   = @(int)$instance[$dimage_name];

    $image_id       = 'image_'.$i;
    $image_name     = 'lines_image_'.$i;
    $image_value    = @(string)$instance[$image_name];
    ?>
    <div class="<?php echo $tag_prefix;?>_block">
        <h4><?php echo $this->trans('line_title');?> #<?php echo ($i+1);?>:</h4>
        <div class="<?php echo $tag_prefix;?>_block_line">
            <input placeholder="<?php echo $this->trans('line_item_title');?> ..." id="<?php echo $this->get_field_id($title_id);?>" name="<?php echo $this->get_field_name($title_name);?>" value="<?php echo esc_attr($title_value);?>" />
        </div>
        <div class="<?php echo $tag_prefix;?>_block_line <?php echo (!empty($image_value) ? 'with_image' : '');?>">
            <input type="hidden" id="<?php echo $this->get_field_id($rate_id);?>" name="<?php echo $this->get_field_name($rate_name);?>" value="<?php echo $i;?>" />
            <input type="hidden" id="<?php echo $this->get_field_id($dimage_id);?>" class="dimage" name="<?php echo $this->get_field_name($dimage_name);?>" value="<?php echo $dimage_value;?>" />

            <label for="<?php echo $this->get_field_id($image_name);?>"><?php echo $this->trans('line_item_image');?>:</label>
            <ul class="default_rates">
                <li onclick="selectDimage(1,this);" class="rate_1 <?php echo ($dimage_value == 1 ? 'active' : '');?>">&nbsp;</li>
                <li onclick="selectDimage(2,this);" class="rate_2 <?php echo ($dimage_value == 2 ? 'active' : '');?>">&nbsp;</li>
                <li onclick="selectDimage(3,this);" class="rate_3 <?php echo ($dimage_value == 3 ? 'active' : '');?>">&nbsp;</li>
                <li onclick="selectDimage(4,this);" class="rate_4 <?php echo ($dimage_value == 4 ? 'active' : '');?>">&nbsp;</li>
                <li onclick="selectDimage(5,this);" class="rate_5 <?php echo ($dimage_value == 5 ? 'active' : '');?>">&nbsp;</li>
            </ul>
            <input type="submit" class="button <?php echo $tag_prefix;?>_upload_image_button upload_image_button" value="<?php _e('Select Image', 'links_with_icons_widget'); ?>" data-target-id="<?php echo $this->get_field_id($image_id);?>"/>
            <input type="submit" class="button <?php echo $tag_prefix;?>_clear_image_button clear_image_button" value="<?php _e('Clear Image', 'links_with_icons_widget'); ?>" data-target-id="<?php echo $this->get_field_id($image_id);?>" data-default="<?php echo $defaultImg;?>" />
            <input type="hidden" class="image" id="<?php echo $this->get_field_id($image_id);?>" name="<?php echo @$this->get_field_name($image_name);?>" value="<?php echo esc_attr($image_value); ?>" />
            <img id="<?php echo @$this->get_field_id($image_id);?>-preview" class="<?php echo $tag_prefix;?>_img_preview" src="<?php echo esc_attr((empty($image_value) ? $defaultImg : $image_value)); ?>" />
        </div>
    </div>

    <?php
}
?>
</div>