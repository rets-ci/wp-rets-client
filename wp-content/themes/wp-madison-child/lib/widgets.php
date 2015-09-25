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
 * Class RDCProspectLandlordForm
 * Custom widget for RDC project
 */
class RDCProspectLandlordForm extends WP_Widget {

  /**
   * init
   */
  public function __construct() {
    parent::WP_Widget('rdc-prospect-landlord-form', __('Prospect Landlord Form'));
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

    if ( !file_exists( get_stylesheet_directory() . '/static/views/rdc-prospect-landlord-form.php' ) ) {
      _e('Widget template not found - '.get_stylesheet_directory() . '/static/views/rdc-prospect-landlord-form.php');
    } else {
      include get_stylesheet_directory() . '/static/views/rdc-prospect-landlord-form.php';
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
 * Class RDCContactForm
 */
class RDCContactForm extends WP_Widget {

  /**
   * init
   */
  public function __construct() {
    parent::WP_Widget('rdc-contact-form', __('Contact Form'));
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

    if ( !file_exists( get_stylesheet_directory() . '/static/views/rdc-contact-form.php' ) ) {
      _e('Widget template not found - '.get_stylesheet_directory() . '/static/views/rdc-contact-form.php');
    } else {
      include get_stylesheet_directory() . '/static/views/rdc-contact-form.php';
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
 * Class RDCFeedbackForm
 */
class RDCFeedbackForm extends WP_Widget {

  /**
   * init
   */
  public function __construct() {
    parent::WP_Widget('rdc-feedback-form', __('Feedback Form'));
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

    if ( !file_exists( get_stylesheet_directory() . '/static/views/rdc-feedback-form.php' ) ) {
      _e('Widget template not found - '.get_stylesheet_directory() . '/static/views/rdc-feedback-form.php');
    } else {
      include get_stylesheet_directory() . '/static/views/rdc-feedback-form.php';
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
 * Class RDCReferralProgramForm
 */
class RDCReferralProgramForm extends WP_Widget {

  /**
   * init
   */
  public function __construct() {
    parent::WP_Widget('rdc-referral-program-form', __('Referral Program Form'));
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

    if ( !file_exists( get_stylesheet_directory() . '/static/views/rdc-referral-program.php' ) ) {
      _e('Widget template not found - '.get_stylesheet_directory() . '/static/views/rdc-referral-program.php');
    } else {
      include get_stylesheet_directory() . '/static/views/rdc-referral-program.php';
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