<?php
/**
 * Widget API: WP_Nav_Menu_Widget class
 *
 * @package WordPress
 * @subpackage Widgets
 * @since 4.4.0
 */

/**
 * Core class used to implement the Custom Menu widget.
 *
 * @since 3.0.0
 *
 * @see WP_Widget
 */
 class RDC_Callout_Widget extends WP_Widget {

	/**
	 * Sets up a new Custom Menu widget instance.
	 *
	 * @since 3.0.0
	 * @access public
	 */
	public function __construct()
	{
		$widget_ops = array('description' => __('Add a custom block with title, button and background'));
		parent::__construct('callout', __('RDC Callout widget'), $widget_ops);

		if (function_exists('wp_enqueue_media')) {
			wp_enqueue_media();
		} else {
			wp_enqueue_style('thickbox');
			wp_enqueue_script('media-upload');
			wp_enqueue_script('thickbox');
		}

		wp_enqueue_style('callout-style', get_stylesheet_directory_uri() . '/widgets/rdc-callout-widget/css/callout-style.css?nocache=' . rand(1,200) );
		wp_enqueue_script('frontend-callout', get_stylesheet_directory_uri() . '/widgets/rdc-callout-widget/js/frontend-callout.js?nocache=' . rand(1,200) );


		function callout_image_dowmload_script(){
			wp_enqueue_script('callout', get_stylesheet_directory_uri() . '/widgets/rdc-callout-widget/js/callout.js?nocache=' . rand(1,200) );
		}
		add_action('admin_enqueue_scripts', 'callout_image_dowmload_script');


	}
	/**
	 * Outputs the content for the current Custom Menu widget instance.
	 *
	 * @since 3.0.0
	 * @access public
	 *
	 * @param array $args     Display arguments including 'before_title', 'after_title',
	 *                        'before_widget', and 'after_widget'.
	 * @param array $instance Settings for the current Custom Menu widget instance.
	 */
	public function widget( $args, $instance ) {

		/** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
		$instance['title'] = apply_filters( 'widget_title', empty( $instance['title'] ) ? '' : $instance['title'], $instance, $this->id_base );

		$callout_image = wp_get_attachment_url( $instance['custom_media_id']);

		echo $args['before_widget'];

		if ( !empty($instance['title']) )
			echo '<div class="widgetBody" style="background: url('. $callout_image .')"><h2>' . $instance['title'] . '</h2>';


		/**
		 * Filter the arguments for the Custom Menu widget.
		 *
		 * @since 4.2.0
		 * @since 4.4.0 Added the `$instance` parameter.
		 *
		 * @param array    $nav_menu_args {
		 *     An array of arguments passed to wp_nav_menu() to retrieve a custom menu.
		 *
		 *     @type callable|bool $fallback_cb Callback to fire if the menu doesn't exist. Default empty.
		 *     @type mixed         $menu        Menu ID, slug, or name.
		 * }
		 * @param stdClass $nav_menu      Nav menu object for the current menu.
		 * @param array    $args          Display arguments for the current widget.
		 * @param array    $instance      Array of settings for the current widget.
		 */

		echo '<h3>' . $instance['subtitle'] . '</h3>';

		echo '<a href="'. $instance['buttonlink'] .'">' . $instance['buttonlable'] . '</a>' ;

		echo '</div>';

		echo $args['after_widget'];


	}

	/**
	 * Handles updating settings for the current Custom Menu widget instance.
	 *
	 * @since 3.0.0
	 * @access public
	 *
	 * @param array $new_instance New settings for this instance as input by the user via
	 *                            WP_Widget::form().
	 * @param array $old_instance Old settings for this instance.
	 * @return array Updated settings to save.
	 */
	public function update( $new_instance, $old_instance ) {

		return $new_instance;
	}

	/**
	 * Outputs the settings form for the Custom Menu widget.
	 *
	 * @since 3.0.0
	 * @access public
	 *
	 * @param array $instance Current settings.
	 */
	public function form( $instance ) {
		$title = isset( $instance['title'] ) ? $instance['title'] : '';
		$subtitle = isset( $instance['subtitle'] ) ? $instance['subtitle'] : '';
		$buttonlable = isset( $instance['buttonlable'] ) ? $instance['buttonlable'] : '';
		$buttonlink = isset( $instance['buttonlink'] ) ? $instance['buttonlink'] : '';
		$custom_media_id = isset( $instance['custom_media_id'] ) ? $instance['custom_media_id'] : '';

		// If no menus exists, direct the user to go and create some.
		?>

			<p>
				<label for="<?php echo $this->get_field_id( 'title' ); ?>"><?php _e( 'Title:' ) ?></label>
				<input type="text" class="widefat" id="<?php echo $this->get_field_id( 'title' ); ?>" name="<?php echo $this->get_field_name( 'title' ); ?>" value="<?php echo esc_attr( $title ); ?>"/>
			</p>
			<p>
				<label for="<?php echo $this->get_field_id( 'subtitle' ); ?>"><?php _e( 'Subtitle:' ) ?></label>
				<input type="text" class="widefat" id="<?php echo $this->get_field_id( 'subtitle' ); ?>" name="<?php echo $this->get_field_name( 'subtitle' ); ?>" value="<?php echo esc_attr( $subtitle ); ?>"/>
			</p>
			<p>
				<label for="<?php echo $this->get_field_id( 'buttonlable' ); ?>"><?php _e( 'Button lable:' ) ?></label>
				<input type="text" class="widefat" id="<?php echo $this->get_field_id( 'buttonlable' ); ?>" name="<?php echo $this->get_field_name( 'buttonlable' ); ?>" value="<?php echo esc_attr( $buttonlable ); ?>"/>
			</p>
			<p>
				<label for="<?php echo $this->get_field_id( 'buttonlink' ); ?>"><?php _e( 'Button link:' ) ?></label>
				<input type="text" class="widefat" id="<?php echo $this->get_field_id( 'buttonlink' ); ?>" name="<?php echo $this->get_field_name( 'buttonlink' ); ?>" value="<?php echo esc_attr( $buttonlink ); ?>"/>
			</p>



			<p>
				<a href="javascript:void(0);" class="custom_media_upload button button-primary" style="margin-bottom: 15px;">Select image</a> <br />
				<img class="custom_media_url" src="<?php echo wp_get_attachment_image_url($custom_media_id, 'thumbnail'); ?>" width="300" style="display: none;" />
				<input type="hidden" class="custom_media_id" id="<?php echo $this->get_field_id( 'custom_media_id' ); ?>" name="<?php echo $this->get_field_name( 'custom_media_id' ); ?>" value="<?php echo esc_attr( $custom_media_id); ?>"/>
			</p>
		<?php
	}
}

add_action( 'widgets_init', register_widget('RDC_Callout_Widget') );