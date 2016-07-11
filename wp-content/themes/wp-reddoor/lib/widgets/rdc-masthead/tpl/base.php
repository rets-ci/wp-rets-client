
<div class="rdc-masthead-widget" style="
	<?php
		echo ($instance['background']['image']) ? 'background-image: url('. wp_get_attachment_url($instance['background']['image'], 'large') . ');' : '';
		echo ($instance['background']['color']) ? 'background-color: ' . $instance['background']['color'] . ';' : '';
	?>
	">

	<h1 class="rdc-masthead-title"><?php echo ($instance['title']) ? $instance['title'] : '' ?></h1>
	<h3 class="rdc-masthead-subtitle"><?php echo ($instance['subtitle']) ? $instance['subtitle'] : '' ?></h3>

	<?php

	if($instance['searchbar']){
		echo do_shortcode('[template_part name=static/views/search-form]');
	}
	?>
	
	<div class="clear"></div>

	<div class="container rdc-masthead-buttons-block">
	
		<?php if($instance['buttons']['primary-button']['btn_available']){ ?>

		<?php if($instance['buttons']['primary-button']['btn_url']){ ?>

			<a href="<?php echo $instance['buttons']['primary-button']['btn_url'] ?>"
			   class="rdc-masthead-btn
			   <?php echo ($instance['buttons']['primary-button']['btn_align'] == 'left') ?  'left-side ' : '';
					 echo ($instance['buttons']['primary-button']['btn_align'] == 'right') ?  'right-side ' : '';
					 echo ($instance['buttons']['primary-button']['btn_class']) ?  $instance['buttons']['primary-button']['btn_class'] : '';
			   ?>"
			   style="<?php echo ($instance['buttons']['primary-button']['btn_color']) ? 'background-color: '. $instance['buttons']['primary-button']['btn_color'] . ';' : '';
			   				echo ($instance['buttons']['primary-button']['btn_text_color']) ? 'color: '. $instance['buttons']['primary-button']['btn_text_color'] . ';' : '';
			   ?>">
			<?php echo ($instance['buttons']['primary-button']['btn_title']) ?  $instance['buttons']['primary-button']['btn_title'] : ''; ?>
			</a>

		<?php } else { ?>

			<button class="rdc-masthead-btn
			<?php echo ($instance['buttons']['primary-button']['btn_align'] == 'left') ?  'left-side ' : '';
				  echo ($instance['buttons']['primary-button']['btn_align'] == 'right') ?  'right-side ' : '';
			  	  echo ($instance['buttons']['primary-button']['btn_class']) ?  $instance['buttons']['primary-button']['btn_class'] : '';
			?>"
					style="<?php echo ($instance['buttons']['primary-button']['btn_color']) ? 'background-color: '. $instance['buttons']['primary-button']['btn_color'] . ';' : '';
								 echo ($instance['buttons']['primary-button']['btn_text_color']) ? 'color: '. $instance['buttons']['primary-button']['btn_text_color'] . ';' : '';
						  ?>">
				<?php echo ($instance['buttons']['primary-button']['btn_title']) ?  $instance['buttons']['primary-button']['btn_title'] : ''; ?>
			</button>

		<?php } ?>

		<?php } ?>

		<?php if($instance['buttons']['secondary-button']['btn_available_sec']){ ?>

			<?php if($instance['buttons']['secondary-button']['btn_url_sec']){ ?>

				<a href="<?php echo $instance['buttons']['secondary-button']['btn_url_sec'] ?>"
				   class="rdc-masthead-btn
			   <?php echo ($instance['buttons']['secondary-button']['btn_align_sec'] == 'left') ?  'left-side ' : '';
				   echo ($instance['buttons']['secondary-button']['btn_align_sec'] == 'right') ?  'right-side ' : '';
				   echo ($instance['buttons']['secondary-button']['btn_class_sec']) ?  $instance['buttons']['secondary-button']['btn_class_sec'] : '';
				   ?>"
				   style="<?php echo ($instance['buttons']['secondary-button']['btn_color_sec']) ? 'background-color: '. $instance['buttons']['secondary-button']['btn_color_sec'] . ';' : '';
				   echo ($instance['buttons']['secondary-button']['btn_text_color_sec']) ? 'color: '. $instance['buttons']['secondary-button']['btn_text_color_sec'] . ';' : '';
				   ?>">
					<?php echo ($instance['buttons']['primary-button']['btn_title_sec']) ?  $instance['buttons']['secondary-button']['btn_title_sec'] : ''; ?>
				</a>

			<?php } else { ?>

				<button class="rdc-masthead-btn
			<?php echo ($instance['buttons']['secondary-button']['btn_align_sec'] == 'left') ?  'left-side ' : '';
				echo ($instance['buttons']['secondary-button']['btn_align_sec'] == 'right') ?  'right-side ' : '';
				echo ($instance['buttons']['secondary-button']['btn_class_sec']) ?  $instance['buttons']['secondary-button']['btn_class_sec'] : '';
				?>"
						style="background: none;
						<?php echo ($instance['buttons']['secondary-button']['btn_border_size_sec']) ? 'border: '. $instance['buttons']['secondary-button']['btn_border_size_sec'] . 'px solid;' : '';
						echo ($instance['buttons']['secondary-button']['btn_border_color_sec']) ? 'border-color: '. $instance['buttons']['secondary-button']['btn_border_color_sec'] . ';' : '';
						echo ($instance['buttons']['secondary-button']['btn_text_color_sec']) ? 'color: '. $instance['buttons']['secondary-button']['btn_text_color_sec'] . ';' : '';
						?>">
					<?php echo ($instance['buttons']['secondary-button']['btn_title_sec']) ?  $instance['buttons']['secondary-button']['btn_title_sec'] : ''; ?>
				</button>

			<?php } ?>

		<?php } ?>

	</div>
</div>