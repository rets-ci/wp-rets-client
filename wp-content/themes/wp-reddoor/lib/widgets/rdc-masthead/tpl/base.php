
<div class="ow-button-base">

	<?php

	echo ($instance['title']) ? $instance['title'] : '';
	echo ($instance['subtitle']) ? $instance['subtitle'] : '';
	if($instance['searchbar']){
		echo do_shortcode('[search-form]');
	}

	?>
</div>