<?php

	$instance_id = rand( 10000, 99999 );

?><div class="rdc-supermap">
	<div class="section-content">

		<h3 class="section-title"><?php echo $instance['label']; ?></h3>

		<p class="section-tagline"><?php echo $instance['tagline']; ?></p>
		<hr class="section-delimiter"/>

		<div class="supermap-section">
			<?php rdc_supermap_filters( $instance['filters'], $instance_id ); ?>
			<?php echo do_shortcode( '[supermap pagination=off hide_sidebar=true per_page=999 scrollwheel=true rand=' . $instance_id . ']' ); //  ?>
		</div>

	</div>
</div>