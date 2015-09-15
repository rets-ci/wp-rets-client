<?php
defined( 'ABSPATH' ) or die( 'No script kiddies please!' );

//vars
$tag_prefix = @$vars['tag_prefix'];
$args       = @$vars['args'];
$instance   = @$vars['instance'];

if( !empty($instance['count_lines']) ) {
    ?>
    <div id="<?php echo $args['widget_id']; ?>" class="<?php echo $tag_prefix; ?>">
        <div class="<?php echo $tag_prefix; ?>_title">
            <span
                class="<?php echo $tag_prefix; ?>_title_text"><?php echo htmlspecialchars($instance['title']); ?></span>
            <span onclick="ratingsArea.animateArea('close');" class="<?php echo $tag_prefix; ?>_title_close">X</span>
        </div>
        <div class="<?php echo $tag_prefix; ?>_body">
            <ul>
                <?php
                for ($i = 0; $i < $instance['count_lines']; $i++) {
                    $title_value    = @$instance['lines_title_' . $i];
                    $rate_value     = @(int)$instance['lines_rate_' . $i];
                    $img_value      = @(string)$instance['lines_image_' . $i];
                    $dimg_value     = @(string)$instance['lines_dimage_' . $i];
                    ?>
                    <li onclick="ratingsArea.click(this,'<?php echo (int)$rate_value; ?>', '<?php echo $args['widget_id']; ?>')">
                    <span
                        class="<?php echo $tag_prefix; ?>_li_img rate_<?php echo $dimg_value; ?> <?php echo(!empty($img_value) ? 'no_back' : ''); ?>">
                        <?php if (!empty($img_value)) { ?>
                            <img alt="" src="<?php echo htmlspecialchars($img_value); ?>"/>
                        <?php } ?>
                    </span>
                        <span
                            class="<?php echo $tag_prefix; ?>_li_text"><?php echo htmlspecialchars($title_value); ?></span>
                    </li>
                    <?php
                }
                ?>
            </ul>
        </div>
    </div>
    <?php
}
