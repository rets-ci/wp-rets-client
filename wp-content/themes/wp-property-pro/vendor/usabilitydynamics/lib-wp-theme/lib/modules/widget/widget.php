<?php

if( !class_exists( 'WidgetModule' ) ) {
  /**
   * Widget Carrington Build Module
   * Displays a WordPress 2.8+ object based widget anywhere in the layout.
   * Will defer old style widgets to the SideBar module.
   *
   */
  class WidgetModule extends cfct_build_module {
    protected $_deprecated_id = 'cfct-widget-module'; // deprecated property, not needed for new module development

    protected $registered_widgets;
    protected $registered_widget_controls;
    protected $registered_widget_updates;
    protected $available_widgets;
    protected $suppress_chooser = false;

    public function __construct() {
      $opts = array(
        'description' => __( 'Place any WordPress 2.7+ compatible widget in to the layout.', 'carrington-build' ),
        'icon'        => plugins_url( '/icon.png', __DIR__ )
      );
      parent::__construct( 'cfct-widget-module', __( 'Widget', 'carrington-build' ), $opts );
      $this->_init_widgets();

      $modern_widgets = cfct_get_modern_widgets();
      foreach( $this->registered_widgets as $id => $widget ) {
        if( !isset( $modern_widgets[ $id ] ) ) {
          $this->available_widgets[ $id ] = $widget;
        }
      }

      // bail forcefully of no modules available for use
      if( empty( $this->available_widgets ) ) {
        $this->available = false;
      }
    }

    protected function _init_widgets() {
      // duplicate registered widgets in format we can use
      global $wp_registered_widgets;
      $done = array();
      foreach( $wp_registered_widgets as $id => $widget ) {
        // don't do the same widget twice
        if( in_array( $widget[ 'callback' ], $done, true ) ) {
          continue;
        }
        $done[ ]                                          = $widget[ 'callback' ];
        $registered_widgets[ _get_widget_id_base( $id ) ] = $widget;
      }
      $this->registered_widgets = cfct_array_sort_by_key( $registered_widgets, 'name' );

      if( count( $this->registered_widgets ) ) {
        // duplicate registered widget controls in format we can use
        global $wp_registered_widget_controls;
        foreach( $wp_registered_widget_controls as $id => $control ) {
          $this->registered_widget_controls[ _get_widget_id_base( $id ) ] = $control;
        }

        // duplicate registered widget updates in a format we can use
        global $wp_registered_widget_updates;
        foreach( $wp_registered_widget_updates as $id => $update ) {
          $this->registered_widget_updates[ _get_widget_id_base( $id ) ] = $update;
        }
      }
    }

    public function display( $data ) {
      $widget_id      = $data[ 'widget_id' ];
      $full_widget_id = $widget_id . '-' . $data[ 'module_id' ];
      $control        = $this->registered_widgets[ $widget_id ];

      // fake it
      $sidebar = apply_filters( 'cfct-build-fake-sidebar-params', array(
        'name'          => 'Fake Sidebar',
        'id'            => 'fake-sidebar-' . $data[ 'module_id' ],
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h2 class="widget-title"><span>',
        'after_title'   => '</span></h2>'
      ), $data[ 'module_id' ], $data[ 'widget_id' ] );

      $params = array_merge(
        array( array_merge( $sidebar, array( 'widget_id' => $full_widget_id, 'widget_name' => $this->registered_widgets[ $widget_id ][ 'name' ] ) ) ),
        (array) $this->registered_widgets[ $widget_id ][ 'params' ]
      );

      // Substitute HTML id and class attributes into before_widget
      $classname_ = '';
      foreach( (array) $this->registered_widgets[ $widget_id ][ 'classname' ] as $cn ) {
        if( is_string( $cn ) ) {
          $classname_ .= '_' . $cn;
        } elseif( is_object( $cn ) ) {
          $classname_ .= '_' . get_class( $cn );
        }
      }
      $classname_                     = ltrim( $classname_, '_' );
      $params[ 0 ][ 'before_widget' ] = sprintf( $params[ 0 ][ 'before_widget' ], $full_widget_id, $classname_ );

      $widget_html = '';
      if( is_array( $control[ 'callback' ] ) && $control[ 'callback' ][ 0 ] instanceof WP_Widget ) {
        // set widget data for get_option filter
        if( !isset( $data[ 'widget' ] ) ) {
          $data[ 'widget' ] = null;
        }
        $this->widget_data = $data[ 'widget' ];

        // widgets echo, run through output buffer
        ob_start();
        $control[ 'callback' ][ 0 ]->widget( $params[ 0 ], $data[ 'widget' ] );
        $widget_html .= ob_get_clean();
      }

      return $this->load_view( $data, compact( 'widget_html' ) );
    }

    public function admin_form( $data ) {
      global $wp_registered_widgets, $wp_registered_widget_controls;

      // handle a legacy "widget module" widget in a "widgets as modules" world
      if( isset( $data[ 'module_id' ] ) && !isset( $this->available_widgets[ $data[ 'module_id' ] ] ) ) {
        $this->suppress_chooser = true;
      }

      $html = '';
      if( isset( $data[ 'widget_id' ] ) ) {
        $html .= '<p>' . $data[ 'widget_id' ] . '</p>';
      }

      // widget select list
      if( $this->suppress_chooser || !$this->available ) {
        $html .= '<input type="hidden" name="widget_id" value="' . $data[ 'widget_id' ] . '" />';
      } else {
        $html .= '
					<div id="cfct-widget-chooser">
						<select name="widget_id" onchange="cfct_widget_select();">
							<option value="0">' . __( '(Choose a Widget)', 'carrington-build' ) . '</option>';
        foreach( $this->available_widgets as $id => $widget ) {
          $selected = isset( $data[ 'widget_id' ] ) && $data[ 'widget_id' ] == $id ? ' selected="selected"' : '';
          $html .= '
							<option value="' . $id . '"' . $selected . '>
								<span class="cfct-widget-name"><b>' . wp_specialchars( $widget[ 'name' ] ) . '</b></span>
								<span class="cfct-widget-sep"> - </span>
								<span class="cfct-widget-description">' . wp_specialchars( $widget[ 'description' ] ) . '</span>
							</option>';
        }
        $html .= '</select>
					</div>';
      }

      if( !isset( $data[ 'widget_id' ] ) || $data[ 'widget_id' ] == 'null' ) {
        // widget admin area
        $html .= '
					<div id="cfct_widget_select_loading" class="loading cfct-hidden">
						<p><img src="' . trailingslashit( CFCT_BUILD_URL ) . 'img/ajax-loader.gif" alt="" /> ' . __( 'Loading widget&hellip;', 'carrington-build' ) . '</p>
					</div>
					';
      } else {
        // show widget form
        $widget_id = $data[ 'widget_id' ];

        $control       = isset( $this->registered_widget_controls[ $widget_id ] ) ? $this->registered_widget_controls[ $widget_id ] : array();
        $widget_number = isset( $control[ 'params' ][ 0 ][ 'number' ] ) ? $control[ 'params' ][ 0 ][ 'number' ] : '';
        $widget_number = 0;
        $id_base       = isset( $control[ 'id_base' ] ) ? $control[ 'id_base' ] : $widget_id;

        $widget_data = isset( $data[ 'widget' ] ) ? $data[ 'widget' ] : array();
        if( isset( $control[ 'callback' ] ) ) {
          if( is_array( $control[ 'callback' ] ) && $control[ 'callback' ][ 0 ] instanceof WP_Widget ) {
            $control[ 'callback' ][ 0 ]->_set( $widget_number );
            // run thorugh output buffer 'cause default for widgets is to echo
            ob_start();
            $control[ 'callback' ][ 0 ]->form( $widget_data );
            $html .= ob_get_clean();
          } else {
            $this->suppress_save = true;
            $html .= '<p>' . __( 'Widget type', 'carrington-build' ) . ' `' . esc_html( $data[ 'widget_id' ] ) . '` ' . __( 'is not a WordPress 2.7+ compatible widget.', 'carrington-build' ) . '<p>';
          }
        } else {
          $html .= PHP_EOL . '<p>' . __( 'There are no options for this widget.', 'carrington-build' ) . '</p>' . PHP_EOL;
        }
        // processing helpers
        $html .= '
						<input type="hidden" name="widget_number" value="' . $widget_number . '" />
						<input type="hidden" name="id_base" class="id_base" value="' . esc_attr( $id_base ) . '" />
						';
      }

      return $html;
    }

    public function update( $new_data, $old_data ) {
      // grab the widget we need
      $control = $this->registered_widget_updates[ $new_data[ 'id_base' ] ];
      if( is_array( $control[ 'callback' ] ) && $control[ 'callback' ][ 0 ] instanceof WP_Widget ) {
        if( !isset( $new_data[ 'widget-' . $new_data[ 'id_base' ] ] ) ) {
          return $new_data;
        }
        $new_widget_data = $new_data[ 'widget-' . $new_data[ 'id_base' ] ][ $new_data[ 'widget_number' ] ];
        unset( $new_data[ 'widget-' . $new_data[ 'id_base' ] ], $new_data[ 'widget_number' ], $new_data[ 'id_base' ] );

        $old_widget_data = array();
        if( isset( $old_data[ 'widget' ] ) ) {
          $old_widget_data = $old_data[ 'widget' ];
        }

        $processed            = @$control[ 'callback' ][ 0 ]->update( $new_widget_data, $old_widget_data );
        $new_data[ 'widget' ] = $processed;
      } else {
        // non-2.8 widgets not supported
      }

      return $new_data;
    }

    public function text( $data ) {
      return '';
    }

    public function admin_text( $data ) {
      $widget_info = $this->registered_widgets[ $data[ 'widget_id' ] ];
      $text        = $widget_info[ 'name' ];
      if( isset( $data[ 'widget' ][ 'title' ] ) ) {
        $text .= ( !empty( $text ) ? ': ' : '' ) . esc_attr( $data[ 'widget' ][ 'title' ] );
      }

      return $text;
    }

    public function admin_js() {
      $js = '
				cfct_widget_select = function() {
					var _val = jQuery("#cfct-widget-chooser select").val();
					if (_val != "0") {
						jQuery("#cfct_widget_select_loading").css({"display":"block"});
						cfct_builder.editModule({"widget_id":_val});
					}
				}
			';

      return $js;
    }
  }

  /**
   * Full widget class for loading in all 2.8+ widgets as individual modules
   *
   */
  class WidgetModule_full extends WidgetModule {
    protected $_widget_id;
    protected $_classname;

    public function __construct() {
      $params = func_get_arg( 0 );

      if( empty( $params[ 'id' ] ) || empty( $params[ 'name' ] ) ) {
        throw new Exception( 'Missing argument for proper widget construct: ' . print_r( $params, true ) );
      }

      $this->_widget_id = $params[ 'id' ];

      // legacy widgets were registered with their $id instead of the generic id
      // so we need this for legacy lookups using the existing legacy lookup system
      $this->_deprecated_id = $params[ 'id' ];

      $this->_module_type = $params[ 'module_id' ];
      $opts               = array(
        'description' => __( $params[ 'description' ], 'carrington-build' ),
        'icon'        => ( !empty( $params[ 'icon' ] ) ? $params[ 'icon' ] : 'widget/icon.png' )
      );
      cfct_build_module::__construct( 'cfct-widget-module-' . $this->_widget_id, __( $params[ 'name' ], 'carrington-build' ), $opts );

      do_action( 'cfct-widget-module-registered', $this->_widget_id, $this->id_base );

      $this->_init_widgets();
      $this->is_widget = true;
    }

    public function admin_form( $data ) {
      if( empty( $data[ 'widget_id' ] ) ) {
        $data[ 'widget_id' ] = $this->_widget_id;
      }
      $this->suppress_chooser = true;

      return parent::admin_form( $data );
    }

    public function display( $data ) {
      if( empty( $data[ 'widget_id' ] ) ) {
        $data[ 'widget_id' ] = $this->_widget_id;
      }

      return parent::display( $data );
    }

    public function get_type() {
      return $this->_module_type;
    }
  }

// Registration functions

  function cfct_register_widget_modules() {
    if( class_exists( 'WidgetModule_full' ) ) {
      $widgets = cfct_get_modern_widgets();

      foreach( $widgets as $id => $widget ) {
        $args = array(
          'module_id'   => 'cfct-widget-module-' . $id,
          'id'          => $id,
          'name'        => $widget[ 'name' ],
          'description' => isset( $widget ) && isset( $widget[ 'description' ] ) ? $widget[ 'description' ] : '',
          'icon'        => 'widget/icon.png'
        );
        cfct_build_register_module( 'WidgetModule_full', $args );
      }
    }
  }

  add_action( 'cfct-modules-included', 'cfct_register_widget_modules' );

}
