<?php

/**
 * Class RDCScheduleShowing
 * Custom widget for RDC
 */
namespace UsabilityDynamics\RDC {

  /**
   * Class RDCScheduleShowing
   * @package UsabilityDynamics\RDC
   */
  class RDCScheduleShowing extends \WP_Widget {

    /**
     * init
     */
    public function __construct() {
      parent::__construct('rdc-schedule-showing', __('Schedule Showing Form'));
    }

    /**
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance) {

      if (!is_singular('property')) return;

      extract($args);

      $widget_title = apply_filters('widget_title', $instance['title']);

      ob_start();

      echo $before_widget;

      if ($widget_title) {
        echo $before_title . $widget_title . $after_title;
      }

      if (!file_exists(get_stylesheet_directory() . '/static/views/rdc-schedule-showing.php')) {
        _e('Widget template not found - ' . get_stylesheet_directory() . '/static/views/rdc-schedule-showing.php');
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
      $title = isset($instance['title']) ? esc_attr($instance['title']) : '';

      ?>
      <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
               name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>"/>
      </p>
      <?php
    }
  }

  /**
   * Class RDCProspectLandlordForm
   * Custom widget for RDC project
   */
  class RDCProspectLandlordForm extends \WP_Widget {

    /**
     * init
     */
    public function __construct() {
      parent::__construct('rdc-prospect-landlord-form', __('Prospect Landlord Form'));
    }

    /**
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance) {

      extract($args);

      $widget_title = apply_filters('widget_title', $instance['title']);

      ob_start();

      echo $before_widget;

      if ($widget_title) {
        echo $before_title . $widget_title . $after_title;
      }

      if (!file_exists(get_stylesheet_directory() . '/static/views/rdc-prospect-landlord-form.php')) {
        _e('Widget template not found - ' . get_stylesheet_directory() . '/static/views/rdc-prospect-landlord-form.php');
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
      $title = isset($instance['title']) ? esc_attr($instance['title']) : '';

      ?>
      <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
               name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>"/>
      </p>
      <?php
    }
  }

  /**
   * Class RDCContactForm
   */
  class RDCContactForm extends \WP_Widget {

    /**
     * init
     */
    public function __construct() {
      parent::__construct('rdc-contact-form', __('Contact Form'));
    }

    /**
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance) {

      extract($args);

      $widget_title = apply_filters('widget_title', $instance['title']);

      ob_start();

      echo $before_widget;

      if ($widget_title) {
        echo $before_title . $widget_title . $after_title;
      }

      if (!file_exists(get_stylesheet_directory() . '/static/views/rdc-contact-form.php')) {
        _e('Widget template not found - ' . get_stylesheet_directory() . '/static/views/rdc-contact-form.php');
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
      $title = isset($instance['title']) ? esc_attr($instance['title']) : '';

      ?>
      <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
               name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>"/>
      </p>
      <?php
    }
  }

  /**
   * Class RDCFeedbackForm
   */
  class RDCFeedbackForm extends \WP_Widget {

    /**
     * init
     */
    public function __construct() {
      parent::__construct('rdc-feedback-form', __('Feedback Form'));
    }

    /**
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance) {

      extract($args);

      $widget_title = apply_filters('widget_title', $instance['title']);

      ob_start();

      echo $before_widget;

      if ($widget_title) {
        echo $before_title . $widget_title . $after_title;
      }

      if (!file_exists(get_stylesheet_directory() . '/static/views/rdc-feedback-form.php')) {
        _e('Widget template not found - ' . get_stylesheet_directory() . '/static/views/rdc-feedback-form.php');
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
      $title = isset($instance['title']) ? esc_attr($instance['title']) : '';

      ?>
      <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
               name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>"/>
      </p>
      <?php
    }
  }

  /**
   * Class RDCReferralProgramForm
   */
  class RDCReferralProgramForm extends \WP_Widget {

    /**
     * init
     */
    public function __construct() {
      parent::__construct('rdc-referral-program-form', __('Referral Program Form'));
    }

    /**
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance) {

      extract($args);

      $widget_title = apply_filters('widget_title', $instance['title']);

      ob_start();

      echo $before_widget;

      if ($widget_title) {
        echo $before_title . $widget_title . $after_title;
      }

      if (!file_exists(get_stylesheet_directory() . '/static/views/rdc-referral-program.php')) {
        _e('Widget template not found - ' . get_stylesheet_directory() . '/static/views/rdc-referral-program.php');
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
      $title = isset($instance['title']) ? esc_attr($instance['title']) : '';

      ?>
      <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
               name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>"/>
      </p>
      <?php
    }
  }

  /**
   * Class RDCApplicationRequestForm
   */
  class RDCApplicationRequestForm extends \WP_Widget {

    /**
     * init
     */
    public function __construct() {
      parent::__construct('rdc-application-request-form', __('Application Request Form'));
    }

    /**
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance) {

      extract($args);

      $widget_title = apply_filters('widget_title', $instance['title']);

      ob_start();

      echo $before_widget;

      if ($widget_title) {
        echo $before_title . $widget_title . $after_title;
      }

      if (!file_exists(get_stylesheet_directory() . '/static/views/rdc-application-request.php')) {
        _e('Widget template not found - ' . get_stylesheet_directory() . '/static/views/rdc-application-request.php');
      } else {
        include get_stylesheet_directory() . '/static/views/rdc-application-request.php';
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
      $title = isset($instance['title']) ? esc_attr($instance['title']) : '';

      ?>
      <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
               name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>"/>
      </p>
      <?php
    }
  }

  /**
   * Class RDCJobRequestForm
   */
  class RDCJobRequestForm extends \WP_Widget {

    /**
     * init
     */
    public function __construct() {
      parent::__construct('rdc-job-request-form', __('Job Request Form'));
    }

    /**
     * @param array $args
     * @param array $instance
     */
    public function widget($args, $instance) {

      extract($args);

      $widget_title = apply_filters('widget_title', $instance['title']);

      ob_start();

      echo $before_widget;

      if ($widget_title) {
        echo $before_title . $widget_title . $after_title;
      }

      if (!file_exists(get_stylesheet_directory() . '/static/views/rdc-job-request.php')) {
        _e('Widget template not found - ' . get_stylesheet_directory() . '/static/views/rdc-job-request.php');
      } else {
        include get_stylesheet_directory() . '/static/views/rdc-job-request.php';
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
      $title = isset($instance['title']) ? esc_attr($instance['title']) : '';

      ?>
      <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:'); ?></label>
        <input class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
               name="<?php echo $this->get_field_name('title'); ?>" type="text" value="<?php echo $title; ?>"/>
      </p>
      <?php
    }
  }

  /**
   * Class Guide_content_Widget
   * @package UsabilityDynamics\RDC
   */
  class Guide_content_Widget extends \WP_Widget
  {

    /**
     * Sets up a new Custom Menu widget instance.
     *
     * @since 3.0.0
     * @access public
     */
    public function __construct()
    {
      $widget_ops = array('description' => __('Add a custom menu block with WP nav menu and image.'));
      parent::__construct('guide_content', __('Guide content'), $widget_ops);

      if (is_admin()) {
        wp_enqueue_media();
      }

      add_action('admin_enqueue_scripts', array($this, 'admin_enqueue'));
      add_action('wp_enqueue_scripts', array($this, 'frontend_enqueue'));

    }

    /**
     *
     */
    public function frontend_enqueue()
    {
      wp_enqueue_style('gc-style', get_stylesheet_directory_uri() . '/lib/widgets/gc-widget/css/gc-style.css?nocache=' . rand(1, 200));
      wp_enqueue_script('frontend-guide', get_stylesheet_directory_uri() . '/lib/widgets/gc-widget/js/frontend-guide.js?nocache=' . rand(1, 200));
    }

    /**
     *
     */
    public function admin_enqueue()
    {
      wp_enqueue_script('guide', get_stylesheet_directory_uri() . '/lib/widgets/gc-widget/js/guide.js?nocache=' . rand(1, 200));
    }

    /**
     * Outputs the content for the current Custom Menu widget instance.
     *
     * @since 3.0.0
     * @access public
     *
     * @param array $args Display arguments including 'before_title', 'after_title',
     *                        'before_widget', and 'after_widget'.
     * @param array $instance Settings for the current Custom Menu widget instance.
     */
    public function widget($args, $instance)
    {
      // Get menu

      $nav_menu = !empty($instance['nav_menu']) ? wp_get_nav_menu_object($instance['nav_menu']) : false;

      if (!$nav_menu)
        return;

      /** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
      $instance['title'] = apply_filters('widget_title', empty($instance['title']) ? '' : $instance['title'], $instance, $this->id_base);

      $gc_image = wp_get_attachment_image($instance['custom_media_id'], 'medium');

      echo $args['before_widget'];

      if (!empty($instance['title']))
        echo '<div class="gc-left-side"><h2>' . $instance['title'] . '</h2>';

      $nav_menu_args = array(
          'fallback_cb' => '',
          'menu' => $nav_menu
      );

      /**
       * Filter the arguments for the Custom Menu widget.
       *
       * @since 4.2.0
       * @since 4.4.0 Added the `$instance` parameter.
       *
       * @param array $nav_menu_args {
       *     An array of arguments passed to wp_nav_menu() to retrieve a custom menu.
       *
       * @type callable|bool $fallback_cb Callback to fire if the menu doesn't exist. Default empty.
       * @type mixed $menu Menu ID, slug, or name.
       * }
       * @param stdClass $nav_menu Nav menu object for the current menu.
       * @param array $args Display arguments for the current widget.
       * @param array $instance Array of settings for the current widget.
       */
      wp_nav_menu(apply_filters('widget_nav_menu_args', $nav_menu_args, $nav_menu, $args, $instance));

      echo '</div><div class="gc-image">' . $gc_image . '</div>';

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
    public function update($new_instance, $old_instance)
    {

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
    public function form($instance)
    {
      $title = isset($instance['title']) ? $instance['title'] : '';
      $nav_menu = isset($instance['nav_menu']) ? $instance['nav_menu'] : '';
      $custom_media_id = isset($instance['custom_media_id']) ? $instance['custom_media_id'] : '';

      // Get menus
      $menus = wp_get_nav_menus();

      // If no menus exists, direct the user to go and create some.
      ?>
      <p class="nav-menu-widget-no-menus-message" <?php if (!empty($menus)) {
        echo ' style="display:none" ';
      } ?>>
        <?php
        if (isset($GLOBALS['wp_customize']) && $GLOBALS['wp_customize'] instanceof WP_Customize_Manager) {
          $url = 'javascript: wp.customize.panel( "nav_menus" ).focus();';
        } else {
          $url = admin_url('nav-menus.php');
        }
        ?>
        <?php echo sprintf(__('No menus have been created yet. <a href="%s">Create some</a>.'), esc_attr($url)); ?>
      </p>
      <div class="nav-menu-widget-form-controls" <?php if (empty($menus)) {
        echo ' style="display:none" ';
      } ?>>
        <p>
          <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:') ?></label>
          <input type="text" class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
                 name="<?php echo $this->get_field_name('title'); ?>" value="<?php echo esc_attr($title); ?>"/>
        </p>
        <p>
          <label for="<?php echo $this->get_field_id('nav_menu'); ?>"><?php _e('Select Menu:'); ?></label>
          <select id="<?php echo $this->get_field_id('nav_menu'); ?>"
                  name="<?php echo $this->get_field_name('nav_menu'); ?>">
            <option value="0"><?php _e('&mdash; Select &mdash;'); ?></option>
            <?php foreach ($menus as $menu) : ?>
              <option value="<?php echo esc_attr($menu->term_id); ?>" <?php selected($nav_menu, $menu->term_id); ?>>
                <?php echo esc_html($menu->name); ?>
              </option>
            <?php endforeach; ?>
          </select>
        </p>
        <p>
          <a href="javascript:void(0);" class="custom_media_upload button button-primary" style="margin-bottom: 15px;">Select
            image</a> <br/>
          <img class="custom_media_url" src="<?php echo wp_get_attachment_image_url($custom_media_id, 'thumbnail'); ?>"
               width="300" style="display: none;"/>
          <input type="hidden" class="custom_media_id" id="<?php echo $this->get_field_id('custom_media_id'); ?>"
                 name="<?php echo $this->get_field_name('custom_media_id'); ?>"
                 value="<?php echo esc_attr($custom_media_id); ?>"/>
        </p>
      </div>
      <?php
    }
  }

  /**
   * Class RDC_Callout_Widget
   * @package UsabilityDynamics\RDC
   */
  class RDC_Callout_Widget extends \WP_Widget {

    /**
     * Sets up a new Custom Menu widget instance.
     *
     * @since 3.0.0
     * @access public
     */
    public function __construct()
    {
      $widget_ops = array('description' => __('Add a custom block with title, button and background'));
      parent::__construct('callout', __('RDC Callout'), $widget_ops);

      if (is_admin()) {
        wp_enqueue_media();
      }

      add_action('admin_enqueue_scripts', array($this, 'admin_enqueue'));
      add_action('wp_enqueue_scripts', array($this, 'frontend_enqueue'));
    }

    /**
     *
     */
    public function admin_enqueue()
    {
      wp_enqueue_script('callout', get_stylesheet_directory_uri() . '/lib/widgets/rdc-callout-widget/js/callout.js?nocache=' . rand(1, 200));
    }

    /**
     *
     */
    public function frontend_enqueue()
    {
      wp_enqueue_style('callout-style', get_stylesheet_directory_uri() . '/lib/widgets/rdc-callout-widget/css/callout-style.css?nocache=' . rand(1, 200));
      wp_enqueue_script('frontend-callout', get_stylesheet_directory_uri() . '/lib/widgets/rdc-callout-widget/js/frontend-callout.js?nocache=' . rand(1, 200));
    }

    /**
     * Outputs the content for the current Custom Menu widget instance.
     *
     * @since 3.0.0
     * @access public
     *
     * @param array $args Display arguments including 'before_title', 'after_title',
     *                        'before_widget', and 'after_widget'.
     * @param array $instance Settings for the current Custom Menu widget instance.
     */
    public function widget($args, $instance)
    {

      /** This filter is documented in wp-includes/widgets/class-wp-widget-pages.php */
      $instance['title'] = apply_filters('widget_title', empty($instance['title']) ? '' : $instance['title'], $instance, $this->id_base);

      $callout_image = wp_get_attachment_url($instance['custom_media_id']);

      echo $args['before_widget'];

      if (!empty($instance['title']))
        echo '<div class="widgetBody" style="background: url(' . $callout_image . ')"><h2>' . $instance['title'] . '</h2>';


      /**
       * Filter the arguments for the Custom Menu widget.
       *
       * @since 4.2.0
       * @since 4.4.0 Added the `$instance` parameter.
       *
       * @param array $nav_menu_args {
       *     An array of arguments passed to wp_nav_menu() to retrieve a custom menu.
       *
       * @type callable|bool $fallback_cb Callback to fire if the menu doesn't exist. Default empty.
       * @type mixed $menu Menu ID, slug, or name.
       * }
       * @param stdClass $nav_menu Nav menu object for the current menu.
       * @param array $args Display arguments for the current widget.
       * @param array $instance Array of settings for the current widget.
       */

      echo '<h3>' . $instance['subtitle'] . '</h3>';

      echo '<a href="' . $instance['buttonlink'] . '">' . $instance['buttonlabel'] . '</a>';

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
    public function update($new_instance, $old_instance)
    {

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
    public function form($instance)
    {
      $title = isset($instance['title']) ? $instance['title'] : '';
      $subtitle = isset($instance['subtitle']) ? $instance['subtitle'] : '';
      $buttonlabel = isset($instance['buttonlabel']) ? $instance['buttonlabel'] : '';
      $buttonlink = isset($instance['buttonlink']) ? $instance['buttonlink'] : '';
      $custom_media_id = isset($instance['custom_media_id']) ? $instance['custom_media_id'] : '';

      // If no menus exists, direct the user to go and create some.
      ?>

      <p>
        <label for="<?php echo $this->get_field_id('title'); ?>"><?php _e('Title:') ?></label>
        <input type="text" class="widefat" id="<?php echo $this->get_field_id('title'); ?>"
               name="<?php echo $this->get_field_name('title'); ?>" value="<?php echo esc_attr($title); ?>"/>
      </p>
      <p>
        <label for="<?php echo $this->get_field_id('subtitle'); ?>"><?php _e('Subtitle:') ?></label>
        <input type="text" class="widefat" id="<?php echo $this->get_field_id('subtitle'); ?>"
               name="<?php echo $this->get_field_name('subtitle'); ?>" value="<?php echo esc_attr($subtitle); ?>"/>
      </p>
      <p>
        <label for="<?php echo $this->get_field_id('buttonlable'); ?>"><?php _e('Button label:') ?></label>
        <input type="text" class="widefat" id="<?php echo $this->get_field_id('buttonlabel'); ?>"
               name="<?php echo $this->get_field_name('buttonlabel'); ?>" value="<?php echo esc_attr($buttonlabel); ?>"/>
      </p>
      <p>
        <label for="<?php echo $this->get_field_id('buttonlink'); ?>"><?php _e('Button link:') ?></label>
        <input type="text" class="widefat" id="<?php echo $this->get_field_id('buttonlink'); ?>"
               name="<?php echo $this->get_field_name('buttonlink'); ?>" value="<?php echo esc_attr($buttonlink); ?>"/>
      </p>


      <p>
        <a href="javascript:void(0);" class="custom_media_upload button button-primary" style="margin-bottom: 15px;">Select
          image</a> <br/>
        <img class="custom_media_url" src="<?php echo wp_get_attachment_image_url($custom_media_id, 'thumbnail'); ?>"
             width="300" style="display: none;"/>
        <input type="hidden" class="custom_media_id" id="<?php echo $this->get_field_id('custom_media_id'); ?>"
               name="<?php echo $this->get_field_name('custom_media_id'); ?>"
               value="<?php echo esc_attr($custom_media_id); ?>"/>
      </p>
      <?php
    }
  }
}