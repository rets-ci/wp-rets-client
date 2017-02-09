<div class="<?php echo $id_base; ?>-image" style="min-height: <?php echo $box_height; ?>px;<?php if (!empty($image_src)) { ?> background-image: url(<?php echo $image_src[0]; ?>); background-position: <?php echo $image_alignment; ?>; background-repeat: no-repeat;<?php } ?>">
	<div class="<?php echo $id_base; ?>-wrap">
		<?php
			if (!empty($title)) { 
				echo '<h2 class="cfct-mod-title">'.$title.'</h2>';
			}
			if (!empty($content)) { 
				echo '<div class="cfct-mod-content">'.$content.'</div>';
			}
			if (!empty($url)) {
				echo '<p><a href="'.$url.'" class="more-link">'.__('Read More', 'carrington-build').'</a></p>';
			}
		?>
	</div>
</div>
