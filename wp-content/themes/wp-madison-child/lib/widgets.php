<?php

/**
 * Class RDCScheduleShowing
 * Custom widget for RDC
 */
class RDCScheduleShowing extends WP_Widget {

  /**
   * init
   */
  public function __construct() {
    parent::WP_Widget('rdc-schedule-showing', __('Schedule Showing Form'));
  }

  /**
   * @param array $args
   * @param array $instance
   */
  public function widget($args, $instance) {

    if ( !is_singular('property') ) return;

    extract( $args );

    $widget_title = apply_filters('widget_title', $instance['title']);

    ob_start();

    echo $before_widget;

    if ( $widget_title ) {
      echo $before_title . $widget_title . $after_title;
    }

    if ( !file_exists( get_stylesheet_directory() . '/static/views/rdc-schedule-showing.php' ) ) {
      _e('Widget template not found - '.get_stylesheet_directory() . '/static/views/rdc-schedule-showing.php');
    } else {
      include get_stylesheet_directory() . '/static/views/rdc-schedule-showing.php';
    }

    echo $after_widget;

    echo ob_get_clean();

  }

  /**
   * @param array $new_instance
   * @param array $old_instance
   * @return array
   */
  function update($new_instance, $old_instance) {
    return $new_instance;
  }

  /**
   * @param array $instance
   */
  public function form($instance) {
    $title = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';

    ?>
    <p>
      <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
    </p>
  <?php
  }
}

/**
 * Class RDCProspectOwnerForm
 * Custom widget for RDC project
 */
class RDCProspectOwnerForm extends WP_Widget {

  /**
   * init
   */
  public function __construct() {
    parent::WP_Widget('rdc-prospect-owner-form', __('Prospect Owner Form'));
  }

  /**
   * @param array $args
   * @param array $instance
   */
  public function widget($args, $instance) {

    extract( $args );

    $widget_title = apply_filters('widget_title', $instance['title']);

    ob_start();

    echo $before_widget;

    if ( $widget_title ) {
      echo $before_title . $widget_title . $after_title;
    }

    if ( !file_exists( get_stylesheet_directory() . '/static/views/rdc-prospect-owner-form.php' ) ) {
      _e('Widget template not found - '.get_stylesheet_directory() . '/static/views/rdc-prospect-owner-form.php');
    } else {
      include get_stylesheet_directory() . '/static/views/rdc-prospect-owner-form.php';
    }

    echo $after_widget;

    echo ob_get_clean();

  }

  /**
   * @param array $new_instance
   * @param array $old_instance
   * @return array
   */
  function update($new_instance, $old_instance) {
    return $new_instance;
  }

  /**
   * @param array $instance
   */
  public function form($instance) {
    $title = isset( $instance['title'] ) ? esc_attr( $instance['title'] ) : '';

    ?>
    <p>
      <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
      <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>" name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>" />
    </p>
  <?php
  }
}