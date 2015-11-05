<?php
$last_row = floor( ( count($instance['features']) - 1 ) / $instance['per_row'] );
?>

<div class="container sow-features-list <?php if( $instance['responsive'] ) echo 'sow-features-responsive'; ?>">

  <div class="widget-heading">
    <h2 class="title"><?php echo $instance['global_title']; ?></h2>

    <p class="subtitle col-md-8 col-md-offset-2"><?php echo $instance['global_subtitle']; ?></p>

    <div class="clear"></div>
    <div class="separator"> </div>
  </div>

	<?php foreach( $instance['features'] as $i => $feature ) : ?>

		<?php if( $i % $instance['per_row'] == 0 && $i != 0 ) : ?>
			<div class="sow-features-clear"></div>
		<?php endif; ?>

		<div class="col-sm-<?php echo 12/$instance['per_row']; ?> sow-features-feature <?php if(  floor( $i / $instance['per_row'] ) == $last_row ) echo 'sow-features-feature-last-row' ?>">

			<?php if( !empty( $feature['more_url'] ) && $instance['icon_link'] ) echo '<a href="' . sow_esc_url( $feature['more_url'] ) . '" ' . ( $instance['new_window'] ? 'target="_blank"' : '' ) . '>'; ?>
			<div
				class="col-sm-4 sow-icon-container <?php echo !empty($instance['container_shape']) ? 'sow-container-' . esc_attr($instance['container_shape']) : 'sow-container-none'?>"
				style="font-size: <?php echo intval($instance['container_size']) ?>px; color: <?php echo esc_attr($feature['container_color']) ?>; width: <?php echo intval($instance['container_size']) ?>px; height: <?php echo intval($instance['container_size']) ?>px;">
				<?php
				if( !empty($feature['icon_image']) ) {
					$attachment = wp_get_attachment_image_src($feature['icon_image']);
					if(!empty($attachment)) {
						$icon_styles[] = 'background-image: url(' . sow_esc_url($attachment[0]) . ')';
						if(!empty($instance['icon_size'])) $icon_styles[] = 'font-size: '.intval($instance['icon_size']).'px';

						?><div class="sow-icon-image" style="<?php echo implode('; ', $icon_styles) ?>"></div><?php
					}
				}
				elseif( !empty($feature['icon']) ) {
					$icon_styles = array();
					if(!empty($instance['icon_size'])) $icon_styles[] = 'font-size: '.intval($instance['icon_size']).'px';
					if(!empty($feature['icon_color'])) $icon_styles[] = 'color: '.$feature['icon_color'];
					echo siteorigin_widget_get_icon($feature['icon'], $icon_styles);
				} elseif( !empty( $feature['rdc_icon'] ) ) {
          ?>
          <img class="rdc_icon_svg" src="<?php echo $this->widget_url() . 'assets/icons/' . $feature['rdc_icon'] . '.svg'; ?>" type="image/svg+xml" />
          <?php
        }
				?>
			</div>
			<?php if( !empty( $feature['more_url'] ) && $instance['icon_link'] ) echo '</a>'; ?>

			<div class="col-sm-8 textwidget">
				<?php if(!empty($feature['title'])) : ?>
					<h5>
						<?php if( !empty( $feature['more_url'] ) && $instance['title_link'] ) echo '<a href="' . sow_esc_url( $feature['more_url'] ) . '" ' . ( $instance['new_window'] ? 'target="_blank"' : '' ) . '>'; ?>
						<?php echo wp_kses_post( $feature['title'] ) ?>
						<?php if( !empty( $feature['more_url'] ) && $instance['title_link'] ) echo '</a>'; ?>
					</h5>
				<?php endif; ?>

				<?php if(!empty($feature['text'])) : ?>
					<?php echo wp_kses_post( $feature['text'] ) ?>
				<?php endif; ?>

				<?php if(!empty($feature['more_text'])) : ?>
					<p class="sow-more-text">
						<?php if( !empty( $feature['more_url'] ) ) echo '<a href="' . sow_esc_url( $feature['more_url'] ) . '" ' . ( $instance['new_window'] ? 'target="_blank"' : '' ) . '>'; ?>
						<?php echo wp_kses_post( $feature['more_text'] ) ?>
						<?php if( !empty( $feature['more_url'] ) ) echo '</a>'; ?>
					</p>
				<?php endif; ?>
			</div>
		</div>

	<?php endforeach; ?>

</div>