<?php if(!defined('ABSPATH')) die('Direct access denied.'); ?>

<div class="widvis">
	<p><?php _e('Widget Visibility', $textdomain); ?></p>
	<p>
		<select name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[action]" id="<?php echo $widget->get_field_id('widvis_show_time'); ?>">
			<option <?php $widvis->in_array_selected($instance['widvis_conditions']['action'], 'show') ?> value="show"><?php _e('Show only', $textdomain); ?></option>
			<option <?php $widvis->in_array_selected($instance['widvis_conditions']['action'], 'hide') ?> value="hide"><?php _e('Hide', $textdomain); ?></option>
		</select>
		<label for="<?php echo $widget->get_field_id('widvis_show_time'); ?>"><?php _e('on:', $textdomain); ?></label>
	</p>
	<div class="widvis-scroller">
		<div class="widvis-expandable">
			<div class="widvis-title"><?php _e( 'Main Pages', $textdomain ); ?></div>
			<div class="widvis-body">
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['main'], '404_page') ?> id="<?php echo $widget->get_field_id('widvis_404_page'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][main][]" value="404_page" />
					<label for="<?php echo $widget->get_field_id('widvis_404_page'); ?>"><?php _e('404 Page', $textdomain); ?></label>
				</p>
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['main'], 'front_page') ?> id="<?php echo $widget->get_field_id('widvis_front_page'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][main][]" value="front_page" />
					<label for="<?php echo $widget->get_field_id('widvis_front_page'); ?>"><?php _e('Front Page', $textdomain); ?></label>
				</p>
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['main'], 'posts_page') ?> id="<?php echo $widget->get_field_id('widvis_posts_page'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][main][]" value="posts_page" />
					<label for="<?php echo $widget->get_field_id('widvis_posts_page'); ?>"><?php _e('Posts Page', $textdomain); ?></label>
				</p>
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['main'], 'search_page') ?> id="<?php echo $widget->get_field_id('widvis_search_page'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][main][]" value="search_page" />
					<label for="<?php echo $widget->get_field_id('widvis_search_page'); ?>"><?php _e('Search Results', $textdomain); ?></label>
				</p>
			</div>
		</div>
		<div class="widvis-expandable">
			<div class="widvis-title"><?php _e('Pages', $textdomain); ?></div>
			<div class="widvis-body">
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['page'], 'all') ?> id="<?php echo $widget->get_field_id('widvis_page_all'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][page][]" value="all" />
					<label for="<?php echo $widget->get_field_id('widvis_page_all'); ?>"><?php _e('All Pages', $textdomain); ?></label>
				</p>
				<?php foreach($pages_list as $i=>$page):?>
					<p style="padding-left:<?php echo ((int)$page['level'])*8;?>px">
						<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['page'], $page['ID']) ?> id="<?php echo $widget->get_field_id('widvis_page_'.$i); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][page][]" value="<?php echo esc_attr($page['ID']); ?>" />
						<label title="ID:<?php echo esc_attr($page['ID']); ?>" for="<?php echo $widget->get_field_id('widvis_page_'.$i); ?>"><?php echo esc_attr($page['post_title']); ?></label>
					</p>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="widvis-expandable">
			<div class="widvis-title"><?php _e('Categories', $textdomain); ?></div>
			<div class="widvis-body">
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['cat'], 'all') ?> id="<?php echo $widget->get_field_id('widvis_cat_all'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][cat][]" value="all" />
					<label for="<?php echo $widget->get_field_id('widvis_cat_all'); ?>"><?php _e('All Categories', $textdomain); ?></label>
				</p>
				<?php foreach($categories_list as $i=>$category):?>
					<p style="padding-left:<?php echo ((int)$category['level'])*8;?>px">
						<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['cat'], $category['term_id']) ?> id="<?php echo $widget->get_field_id('widvis_cat_'.$i); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][cat][]" value="<?php echo esc_attr($category['term_id']); ?>" />
						<label for="<?php echo $widget->get_field_id('widvis_cat_'.$i); ?>"><?php echo esc_attr($category['name']); ?></label>
					</p>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="widvis-expandable">
			<div class="widvis-title"><?php _e('Authors', $textdomain); ?></div>
			<div class="widvis-body">
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['author'], 'all') ?> id="<?php echo $widget->get_field_id('widvis_author_all'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][author][]" value="all" />
					<label for="<?php echo $widget->get_field_id('widvis_author_all'); ?>"><?php _e('All Authors', $textdomain); ?></label>
				</p>
				<?php foreach($authors as $i=>$author):?>
					<p>
						<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['author'], $author->ID) ?> id="<?php echo $widget->get_field_id('widvis_author_'.$i); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][author][]" value="<?php echo esc_attr($author->ID); ?>" />
						<label for="<?php echo $widget->get_field_id('widvis_author_'.$i); ?>"><?php echo esc_attr($author->data->display_name); ?></label>
					</p>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="widvis-expandable">
			<div class="widvis-title"><?php _e('Tags', $textdomain); ?></div>
			<div class="widvis-body">
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['tag'], $author->ID) ?> id="<?php echo $widget->get_field_id('widvis_tag_all'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][tag][]" value="all" />
					<label for="<?php echo $widget->get_field_id('widvis_tag_all'); ?>"><?php _e('All Tags', $textdomain); ?></label>
				</p>
				<?php foreach($tags as $i=>$tag):?>
					<p>
						<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['tag'], $author->ID) ?> id="<?php echo $widget->get_field_id('widvis_tag_'.$i); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][tag][]" value="<?php echo esc_attr($tag->term_id); ?>" />
						<label for="<?php echo $widget->get_field_id('widvis_tag_'.$i); ?>"><?php echo esc_attr($tag->name); ?></label>
					</p>
				<?php endforeach; ?>
			</div>
		</div>
		<div class="widvis-expandable">
			<div class="widvis-title"><?php _e('Archives', $textdomain); ?></div>
			<div class="widvis-body">
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['archive'], 'author') ?> id="<?php echo $widget->get_field_id('widvis_archive_author'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][archive][]" value="author" />
					<label for="<?php echo $widget->get_field_id('widvis_archive_author'); ?>"><?php _e('Author Archives', $textdomain); ?></label>
				</p>
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['archive'], 'category') ?> id="<?php echo $widget->get_field_id('widvis_archive_category'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][archive][]" value="category" />
					<label for="<?php echo $widget->get_field_id('widvis_archive_category'); ?>"><?php _e('Category Archives', $textdomain); ?></label>
				</p>
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['archive'], 'custom_post') ?> id="<?php echo $widget->get_field_id('widvis_archive_custom_post'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][archive][]" value="custom_post" />
					<label for="<?php echo $widget->get_field_id('widvis_archive_custom_post'); ?>"><?php _e('Custom Post Archives', $textdomain); ?></label>
				</p>
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['archive'], 'custom_taxonomy') ?> id="<?php echo $widget->get_field_id('widvis_archive_custom_taxonomy'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][archive][]" value="custom_taxonomy" />
					<label for="<?php echo $widget->get_field_id('widvis_archive_custom_taxonomy'); ?>"><?php _e('Custom Taxonomy Archives', $textdomain); ?></label>
				</p>
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['archive'], 'date') ?> id="<?php echo $widget->get_field_id('widvis_archive_date'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][archive][]" value="date" />
					<label for="<?php echo $widget->get_field_id('widvis_archive_date'); ?>"><?php _e('Date Archives', $textdomain); ?></label>
				</p>
				<p>
					<input type="checkbox" <?php $widvis->in_array_checked($instance['widvis_conditions']['rules']['archive'], 'tag') ?> id="<?php echo $widget->get_field_id('widvis_archive_tag'); ?>" name="<?php echo $widget->get_field_name('widvis_conditions'); ?>[rules][archive][]" value="tag" />
					<label for="<?php echo $widget->get_field_id('widvis_archive_tag'); ?>"><?php _e('Tag Archives', $textdomain); ?></label>
				</p>
			</div>
		</div>
		
	</div>
</div>