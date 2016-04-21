<?php
/**
 *
 *
 *
 */

$category = get_the_category();

?>
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

			<div class="col-lg-4" data-element-kind="singleCategoryCard">
        <?php get_template_part('static/views/category-card') ?>
			</div>

		<?php endwhile; ?>

	</div>

  <div class="row loadMoreContainer">
    <div class="col-lg-4 col-lg-offset-5">
      <button type="button" class="btn btn-primary btn-lg	btn-danger" data-kind="singleCategoryCard" data-handler="load-more" data-action="categoryCard" data-category="<?php echo $category[0]->term_id; ?>"><?php _e( 'Load More' ); ?>
    </div>
  </div>

</div>