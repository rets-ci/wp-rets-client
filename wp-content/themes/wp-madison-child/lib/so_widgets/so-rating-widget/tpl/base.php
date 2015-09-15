<?php

$rate = $instance[ 'rate' ];


if( !empty( $rate ) && is_numeric( $rate ) ) {
	$rate = round( $rate / 2, 1 );
}

?><div class="rdc-rating">
	<div class="section-content">

		<h3 class="section-title"><?php echo $instance['label']; ?></h3>

		<p class="section-tagline"><?php echo $instance['tagline']; ?></p>
		<hr class="section-delimiter"/>

		<div class="rating-section">

			<div class="stars rating">
				<div class="star-item full star-5 <?php echo $rate >= 5 ? 'checked' : ''; ?>" title=""></div>
				<div class="star-item half star-4-half <?php echo $rate >= 4.5 ? 'checked' : ''; ?>" title=""></div>
				<div class="star-item full star-4 <?php echo $rate >= 4 ? 'checked' : ''; ?>" title=""></div>
				<div class="star-item half star-3-half <?php echo $rate >= 3.5 ? 'checked' : ''; ?>" title=""></div>
				<div class="star-item full star-3 <?php echo $rate >= 3 ? 'checked' : ''; ?>" title=""></div>
				<div class="star-item half star-2-half <?php echo $rate >= 2.5 ? 'checked' : ''; ?>" title=""></div>
				<div class="star-item full star-2 <?php echo $rate >= 2 ? 'checked' : ''; ?>" title=""></div>
				<div class="star-item half star-1-half <?php echo $rate >= 1.5 ? 'checked' : ''; ?>" title=""></div>
				<div class="star-item full star-1 <?php echo $rate >= 1 ? 'checked' : ''; ?>" title=""></div>
				<div class="star-item half starhalf <?php echo $rate >= 0.5 ? 'checked' : ''; ?>" title=""></div>
				<div class="clear"></div>
			</div>

			<div class="clear"></div>
		</div>

	</div>
</div>