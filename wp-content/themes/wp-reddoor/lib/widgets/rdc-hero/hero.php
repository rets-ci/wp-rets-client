<?php
/*
Widget Name: Hero Image
Description: A big hero image with a few settings to make it your own.
Author: SiteOrigin
Author URI: https://siteorigin.com
*/

if( !class_exists( 'SiteOrigin_Widget_Base_Slider' ) ) include_once get_stylesheet_directory().'/lib/widgets/rdc-hero/base/base-slider.class.php';

class Tabbed_content_Widget extends SiteOrigin_Widget_Base_Slider {

	protected $buttons = array();

	function __construct() {
		parent::__construct(
			'tabbed-content',
			__('Tabbed content', 'so-widgets-bundle'),
			array(
				'description' => __('Tabbed content widget', 'so-widgets-bundle'),
				'help' => 'https://siteorigin.com/widgets-bundle/hero-image-widget/',
				'panels_title' => false,
			),
			array( ),
			array(
				'title' => array(
					'type' => 'text',
					'label' => __( 'Title', 'so-widgets-bundle' ),
				),

				'frames' => array(
					'type' => 'repeater',
					'label' => __('Tabbed frames', 'so-widgets-bundle'),
					'item_name' => __('Frame', 'so-widgets-bundle'),
					'item_label' => array(
						'selector' => "[id*='frames-title']",
						'update_event' => 'change',
						'value_method' => 'val'
					),

					'fields' => array(

						'image' => array(
							'type' => 'media',
							'label' => __( 'Image', 'so-widgets-bundle' ),
							'library' => 'image',
							'fallback' => true,
						),

						'content_title' => array(
							'type' => 'text',
							'label' => __( 'Content title', 'so-widgets-bundle' ),
						),

						'content' => array(
							'type' => 'tinymce',
							'label' => __( 'Content', 'so-widgets-bundle' ),
						),

						'svg' => array(
							'type' => 'icon',
							'label' => __( 'Navigation icon', 'so-widgets-bundle' ),
						),

						'feature_point' => array(
							'type' => 'section',
							'label' => __('Feature point', 'so-widgets-bundle'),
							'fields' => array(
								'icon_point' => array(
									'type' => 'icon',
									'label' => __( 'Select icon', 'so-widgets-bundle' ),
								),

								'feature_title' => array(
									'type' => 'text',
									'label' => __( 'Feature title', 'so-widgets-bundle' ),
								),

								'feature_content' => array(
									'type' => 'tinymce',
									'label' => __( 'Feature content', 'so-widgets-bundle' ),
								),
							),
						),

						'feature_point2' => array(
							'type' => 'section',
							'label' => __('Feature point', 'so-widgets-bundle'),
							'fields' => array(
								'icon_point2' => array(
									'type' => 'icon',
									'label' => __( 'Select icon', 'so-widgets-bundle' ),
								),

								'feature_title2' => array(
									'type' => 'text',
									'label' => __( 'Feature title', 'so-widgets-bundle' ),
								),

								'feature_content2' => array(
									'type' => 'tinymce',
									'label' => __( 'Feature content', 'so-widgets-bundle' ),
								),
							),
						),
						'feature_point3' => array(
							'type' => 'section',
							'label' => __('Feature point', 'so-widgets-bundle'),
							'fields' => array(
								'icon_point3' => array(
									'type' => 'icon',
									'label' => __( 'Select icon', 'so-widgets-bundle' ),
								),

								'feature_title3' => array(
									'type' => 'text',
									'label' => __( 'Feature title', 'so-widgets-bundle' ),
								),

								'feature_content3' => array(
									'type' => 'tinymce',
									'label' => __( 'Feature content', 'so-widgets-bundle' ),
								),
							),
						),

					),
				),

			)
		);

	}

	/**
	 * Get everything necessary for the background image.
	 *
	 * @param $i
	 * @param $frame
	 *
	 * @return array
	 */
	function get_frame_background( $i, $frame ){
		$background_image = siteorigin_widgets_get_attachment_image_src(
			$frame['background']['image'],
			'full',
			!empty( $frame['background']['image_fallback'] ) ? $frame['background']['image_fallback'] : ''
		);

		return array(
			'color' => !empty( $frame['background']['color'] ) ? $frame['background']['color'] : false,
			'image' => !empty( $background_image ) ? $background_image[0] : false,
			'image-sizing' => 'cover',
			'url' => !empty( $frame['background']['url'] ) ? $frame['background']['url'] : false,
			'new_window' => !empty( $frame['background']['new_window'] ),
			'video-sizing' => 'background',
			'opacity' => intval($frame['background']['opacity'])/100,
		);
	}

	/**
	 * Render the actual content of the frame
	 *
	 * @param $i
	 * @param $frame
	 */
	function render_frame_contents($i, $frame) {

		?>
		<div class="sow-slider-image-container">
			<div class="sow-slider-image-wrapper">
				<?php	$dataImage = wp_get_attachment_image_url($frame['image'], 'full');	?>
				<div class="tabbedWidgetImageArea" style="background-image: url('<?php echo $dataImage ?>');"></div>
				<div class="tabbedWidgetContent">
				<h3><?php echo $frame['content_title'] ?></h3>
					<p><?php echo $frame['content'] ?></p>
					<div class="featurePoint">
						<?php echo siteorigin_widget_get_icon($frame['feature_point']['icon_point']); ?>
						<div style="width: <?php if(empty(siteorigin_widget_get_icon($frame['feature_point']['icon_point']))){echo '100%'; }; ?>">
							<h4><?php echo $frame['feature_point']['feature_title'] ?></h4>
							<?php echo $frame['feature_point']['feature_content'] ?>
						</div>
						<div class="clear"></div>
					</div>
					<?php if($frame['feature_point2']['icon_point2'] || $frame['feature_point2']['feature_title2'] || $frame['feature_point2']['feature_content2'] ){ ?>
					<div class="featurePoint">
						<?php echo siteorigin_widget_get_icon($frame['feature_point2']['icon_point2']); ?>
						<div style="width: <?php if(empty(siteorigin_widget_get_icon($frame['feature_point2']['icon_point2']))){echo '100%'; }; ?>">
							<h4><?php echo $frame['feature_point2']['feature_title2'] ?></h4>
							<?php echo $frame['feature_point2']['feature_content2'] ?>
						</div>
						<div class="clear"></div>
					</div>
					<?php } ?>
					<?php if($frame['feature_point3']['icon_point3'] || $frame['feature_point3']['feature_title3'] || $frame['feature_point3']['feature_content3'] ){ ?>
						<div class="featurePoint">
							<?php echo siteorigin_widget_get_icon($frame['feature_point3']['icon_point3']); ?>
							<div style="width: <?php if(empty(siteorigin_widget_get_icon($frame['feature_point3']['icon_point3']))){echo '100%'; }; ?>">
								<h4><?php echo $frame['feature_point3']['feature_title3'] ?></h4>
								<?php echo $frame['feature_point3']['feature_content3'] ?>
							</div>
							<div class="clear"></div>
						</div>
					<?php } ?>
				</div>

				<div class="clear"></div>
			</div>
		</div>

		<?php
	}

	/**
	 * Process the content. Most importantly add the buttons by replacing [buttons] in the content
	 *
	 * @param $content
	 * @param $frame
	 *
	 * @return string
	 */
	function process_content( $content, $frame ) {
		ob_start();

		// Add in the button code
		$san_content = wp_kses_post($content);
		$content = preg_replace('/(?:<(?:p|h\d|em|strong|li|blockquote) *([^>]*)> *)?\[ *buttons *\](:? *<\/(?:p|h\d|em|strong|li|blockquote)>)?/i', '<div class="sow-hero-buttons" $1>' . $button_code . '</div>', $san_content );
		return $content;
	}

	/**
	 * The less variables to control the design of the slider
	 *
	 * @param $instance
	 *
	 * @return array
	 */


	function add_default_measurement_unit($val) {
		if (!empty($val)) {
			if (!preg_match('/\d+([a-zA-Z%]+)/', $val)) {
				$val .= 'px';
			}
		}
		return $val;
	}


}

siteorigin_widget_register('tabbed-content', __FILE__, 'Tabbed_Content_Widget');
