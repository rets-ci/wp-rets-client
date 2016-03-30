<div class="container-fluid archiveFilterBg">
	<div class="container">
		<div class="row">
			<section class="archiveFilterBody">
				<ul>
					<?php
					$_categories = get_terms('category');
					if(!empty($_categories)) {
						foreach ($_categories as $_categoriesNew) {
							if($_categoriesNew->slug != 'uncategorized'){
								?>
								<li>
									<a href="<?php echo get_category_link($_categoriesNew->term_id); ?>">
										<span style="display: inline-block; width: 50px; height: 50px; font-size: 2em; position: relative; top: 5px;" class="icon-rdc-<?php echo $_categoriesNew->slug; ?>"></span>
										<?php echo $_categoriesNew->name; ?>
									</a>
								</li>
							<?php	} } } ?>
				</ul>
				<div class="clear"></div>
			</section>
		</div>
	</div>
</div>

<div class="container">
	<div class="row loadMore">
		<?php

		// Start the Loop.
		while ( have_posts() ) : the_post(); ?>

			<div class="col-lg-4">
				<div class="oneCategory">
					<?php
					$currentId = get_the_ID();
					$post_thumbnail_id = get_post_thumbnail_id( $currentId );
					$_url = wp_get_attachment_image_url($post_thumbnail_id, 'medium');
					?>

					<div class="oneCategoryImg">
						<img src="<?php echo $_url ?>" alt="<?php the_title(); ?>" />
					</div>
					<div class="catIconLoop">
						<!-- <img src="<?php echo get_stylesheet_directory_uri(); ?>/static/images/src/categoryIcon.png" alt="" /> -->
						<!-- <svg class="icon icon-<?php //echo $_categoriesNew->slug; ?>"><use xlink:href="#icon-<?php //echo $_categoriesNew->slug; ?>"></use></svg> -->
						<?php

						$categories = get_the_category();
						if ( ! empty( $categories ) ) {
							foreach( $categories as $category ) { ?>
								<span class="icon icon-rdc-<?php if($category->slug){echo $category->slug;} ?>"></span>
							<?php }
						}

						?>


					</div>
					<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
				</div>
			</div>

		<?php endwhile; ?>

	</div>
</div>