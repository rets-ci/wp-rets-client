
<div class="rdc-masthead-widget" style="background-image: url('<?php echo wp_get_attachment_url($instance['background']['image'], 'large') ?>'); ">

	<h1 class="rdc-masthead-title"><?php echo ($instance['title']) ? $instance['title'] : '' ?></h1>
	<h3 class="rdc-masthead-subtitle"><?php echo ($instance['subtitle']) ? $instance['subtitle'] : '' ?></h3>

	<?php

	if($instance['searchbar']){
		echo do_shortcode('[template_part name=static/views/search-form]');
	}

	?>
</div>