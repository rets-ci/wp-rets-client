<?php
	$carousel_id = 'carousel-'.$data['module_id'];
	$carousel_class = 'carousel car-size-'.$image_size;
?>
<div id="<?php echo $carousel_id; ?>" class="<?php echo $carousel_class; ?>">
	<div class="carousel-inner"><?php
	if ($car_opts['nav_pos'] == 'before') {
		echo '
		'.$car_opts['nav_element'];
	}
?>
		<div class="car-content">
<?php
if (!empty($items)) {
	$carousel_items_style = 'clear:both;overflow:hidden;width:'.$items[0]['img_src'][1].'px;';
	if (!empty($car_opts['height'])) {
		$carousel_items_style .= 'height:'.$car_opts['height'].'px;';
	}
?>
			<ul style="<?php echo esc_attr($carousel_items_style); ?>">
<?php
	foreach ($items as $key => $item) {
		$title = !empty($item['link']) ? '<a href="'.$item['link'].'">'.$item['title'].'</a>' : $item['title'];
		
		$img = '<img alt="" src="'.$item['img_src'][0].'" width="'.$item['img_src'][1].'" height="'.$item['img_src'][2].'" class="car-img" />';
		if ($car_opts['link_images']) {
			$img = '<a href="'.$item['link'].'">'.$img.'</a>';
		}
		
		echo '
				<li class="car-entry" id="car-'.$data['module_id'].'-item-'.$key.'"'.(!empty($carousel_items_style) ? ' style="'.$carousel_items_style.'"' : '').'>
					'.$img.'
					<div class="car-entry-assets" style="display: none;">
						<h2 class="car-entry-title">'.$title.'</h2>
						<div class="car-entry-description">
							'.$item['content'].'
						</div>
						<div class="car-entry-cta"><a href="'.$item['link'].'">learn more&hellip;</a></div>
					</div>
				</li>';
	}
?>
			</ul>
<?php
}
?>
		</div>
		<div class="car-overlay">
			<div class="car-overlay-inside">
<?php
foreach ($control_layout_order as $control) {
	switch ($control) {
		case 'title':
			echo '
				<div class="car-header">
					<h2 class="car-title">'.(!empty($items[0]['title']) ? $items[0]['title'] : '').'</h2>
				</div>';
			break;
		case 'description':
			echo '
				<div class="car-description">'.(!empty($items[0]['content']) ? $items[0]['content'] : '').'</div>';
			break;
		case 'call-to-action':
			echo '
				<div class="car-cta">
					'.(!empty($items[0]['link']) ? '<a href="'.$items[0]['link'].'" class="imr imr-learn-more">Learn More</a>' : '').'
				</div>';
			break;
		case 'pagination':
			if ($car_opts['nav_pos'] == 'overlay') {
				echo '
					'.$car_opts['nav_element'];
			}
			break;
	}
}
?>
			</div>
		</div><?php
	if ($car_opts['nav_pos'] == 'after') {
		echo '
		'.$car_opts['nav_element'];
	}
?>
	</div>
</div>
<?php echo $js_init; ?>
