<?php
/*
Widget Name: Hero Image
Description: A big hero image with a few settings to make it your own.
Author: SiteOrigin
Author URI: https://siteorigin.com
*/

if( !class_exists( 'SiteOrigin_Widget_Base_Slider' ) ) include_once get_stylesheet_directory().'/widgets/rdc-hero/base/base-slider.class.php';

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

						'title' => array(
							'type' => 'text',
							'label' => __( 'Title', 'so-widgets-bundle' ),
						),

						'image' => array(
							'type' => 'media',
							'label' => __( 'Image', 'so-widgets-bundle' ),
							'library' => 'image',
							'fallback' => true,
						),

						'content' => array(
							'type' => 'tinymce',
							'label' => __( 'Content', 'so-widgets-bundle' ),
						),

						'svg-title' => array(
							'type' => 'text',
							'label' => __( 'SVG icon title', 'so-widgets-bundle' ),
						),

						'background' => array(
							'type' => 'section',
							'label' => __('Background', 'so-widgets-bundle'),
							'fields' => array(
								'image' => array(
									'type' => 'media',
									'label' => __( 'Background image', 'so-widgets-bundle' ),
									'library' => 'image',
									'fallback' => true,
								),

								'opacity' => array(
									'label' => __( 'Background image opacity', 'so-widgets-bundle' ),
									'type' => 'slider',
									'min' => 0,
									'max' => 100,
									'default' => 100,
								),

								'color' => array(
									'type' => 'color',
									'label' => __( 'Background color', 'so-widgets-bundle' ),
									'default' => '#333333',
								),

								'url' => array(
									'type' => 'link',
									'label' => __( 'Destination URL', 'so-widgets-bundle' ),
								),

								'new_window' => array(
									'type' => 'checkbox',
									'label' => __( 'Open URL in a new window', 'so-widgets-bundle' ),
								),

							)
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
				<?php $dataImage = wp_get_attachment_image_src($frame['image']);
							$imageLink = $dataImage[0];
				?>

				<h2><?php echo $frame['title'] ?></h2>
				<img src="<?php echo $imageLink ?>" alt="" />
				<?php echo $frame['content'] ?>
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
